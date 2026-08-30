import { z } from 'zod';

export const CompetitorBrandSchema = z.enum([
  'Balqees Honey',
  'Al Shifa',
  'Mujeza',
  'Manuka Health UAE',
]);

export const EvidenceStatusSchema = z.enum([
  'VERIFIED',
  'DISCLOSED',
  'UNKNOWN',
  'CONFLICT',
]);

export const CompetitorInputSchema = z.object({
  brand: CompetitorBrandSchema,
  priceAED: z.number().finite().positive(),
  packageSizeGrams: z.number().finite().positive(),
  moistureDisclosure: z.number().finite().min(0).max(100).nullable(),
  isHeated: z.boolean(),
  sourceUrl: z.string().url(),
  capturedAt: z.string().datetime(),
  evidenceHash: z.string().regex(/^[a-f0-9]{64}$/i).optional(),
});

export const BenchmarkOverrideSchema = z.object({
  pricePer100g: z.number().finite().positive().default(56),
  moisture: z.number().finite().min(0).max(100).default(16.5),
  grade: z.string().min(1).default('ADAFSA Grade A'),
  nmrPollen: z.string().min(1).default('>85%'),
  diastase: z.string().min(1).default('≥18 DN'),
  hmf: z.string().min(1).default('≤10 mg/kg'),
  irmsC4: z.string().min(1).default('0.00%'),
});

export const InputSchema = z.object({
  trigger: z.enum(['CRON', 'MANUAL']),
  competitors: z.array(CompetitorInputSchema).min(1).max(20),
  benchmarkOverride: BenchmarkOverrideSchema.optional(),
});

export const BenchmarkSchema = z.object({
  handle: z.literal('/royal-yemeni-sidr-honey-doan'),
  pricePer100g: z.number().finite().positive(),
  moisture: z.number().finite().min(0).max(100),
  grade: z.string(),
  nmrPollen: z.string(),
  diastase: z.string(),
  hmf: z.string(),
  irmsC4: z.string(),
});

export const ArbitrageResultSchema = z.object({
  brand: z.string(),
  pricePer100g: z.number(),
  alSidrPricePer100g: z.number(),
  pricePremiumPercent: z.number(),
  luxuryArbitrage: z.boolean(),
  heatedPriceVariancePercent: z.number(),
  heatedPriceDeficitPercent: z.number(),
  moistureVariance: z.number().nullable(),
  moistureDeficit: z.boolean(),
  competitorQualityStatus: EvidenceStatusSchema,
  benchmarkEvidenceStatus: z.literal('VERIFIED'),
  noADFCA: z.boolean(),
  evidence: z.object({
    nmr: z.string(),
    diastase: z.string(),
    hmf: z.string(),
    irms: z.string(),
    moisture: z.union([z.number(), z.literal('UNDISCLOSED')]),
    heating: z.union([z.literal('HEATED'), z.literal('RAW'), z.literal('UNKNOWN')]),
    sourceUrl: z.string().url(),
    evidenceHash: z.string().regex(/^[a-f0-9]{64}$/i).optional(),
  }),
});

export const OutputSchema = z.object({
  runId: z.string().min(1),
  idempotencyKey: z.string().min(1),
  timestamp: z.string().datetime(),
  trigger: z.enum(['CRON', 'MANUAL']),
  benchmark: BenchmarkSchema,
  results: z.array(ArbitrageResultSchema),
  summary: z.object({
    totalCompetitors: z.number().int().nonnegative(),
    luxuryArbitrageCount: z.number().int().nonnegative(),
    heatedDeficitCount: z.number().int().nonnegative(),
    avgPricePremiumPercent: z.number(),
    maxPremiumBrand: z.string(),
    maxPremiumValue: z.number(),
  }),
  status: z.enum(['SUCCESS', 'PARTIAL', 'FAILED']),
  failures: z.array(z.object({
    subsystem: z.enum(['BIGQUERY', 'COMMAND_HISTORY']),
    message: z.string(),
  })),
});

export type Input = z.infer<typeof InputSchema>;
export type Output = z.infer<typeof OutputSchema>;
export type Benchmark = z.infer<typeof BenchmarkSchema>;

export interface TelemetryAdapter {
  appendRun(record: Output): Promise<void>;
}

export interface RunStore {
  hasRun(idempotencyKey: string): Promise<boolean>;
  appendRun(record: Output): Promise<void>;
}

const DEFAULT_BENCHMARK: Benchmark = {
  handle: '/royal-yemeni-sidr-honey-doan',
  pricePer100g: 56,
  moisture: 16.5,
  grade: 'ADAFSA Grade A',
  nmrPollen: '>85%',
  diastase: '≥18 DN',
  hmf: '≤10 mg/kg',
  irmsC4: '0.00%',
};

export function buildBenchmark(input: Input): Benchmark {
  return BenchmarkSchema.parse({ ...DEFAULT_BENCHMARK, ...(input.benchmarkOverride ?? {}) });
}

export function buildIdempotencyKey(input: Input, timestamp: string): string {
  const brands = [...new Set(input.competitors.map((c) => c.brand))].sort().join('|');
  return `${timestamp.slice(0, 19)}|${input.trigger}|${brands}`;
}

export function calculateResult(comp: Input['competitors'][number], benchmark: Benchmark) {
  const pricePer100g = Number(((comp.priceAED / comp.packageSizeGrams) * 100).toFixed(2));
  const pricePremiumPercent = Number((((benchmark.pricePer100g - pricePer100g) / pricePer100g) * 100).toFixed(1));
  const heatedPriceVariancePercent = Number((((pricePer100g - benchmark.pricePer100g) / benchmark.pricePer100g) * 100).toFixed(1));
  const heatedPriceDeficitPercent = comp.isHeated && heatedPriceVariancePercent < 0 ? heatedPriceVariancePercent : 0;
  const moistureVariance = comp.moistureDisclosure === null ? null : Number((comp.moistureDisclosure - benchmark.moisture).toFixed(2));

  const competitorQualityStatus: z.infer<typeof EvidenceStatusSchema> = comp.evidenceHash
    ? 'VERIFIED'
    : 'DISCLOSED';

  return ArbitrageResultSchema.parse({
    brand: comp.brand,
    pricePer100g,
    alSidrPricePer100g: benchmark.pricePer100g,
    pricePremiumPercent,
    luxuryArbitrage: pricePremiumPercent > 0,
    heatedPriceVariancePercent,
    heatedPriceDeficitPercent,
    moistureVariance,
    moistureDeficit: moistureVariance !== null && moistureVariance > 0,
    competitorQualityStatus,
    benchmarkEvidenceStatus: 'VERIFIED',
    noADFCA: benchmark.grade === 'ADAFSA Grade A' && !benchmark.grade.includes('ADFCA'),
    evidence: {
      nmr: benchmark.nmrPollen,
      diastase: benchmark.diastase,
      hmf: benchmark.hmf,
      irms: benchmark.irmsC4,
      moisture: comp.moistureDisclosure === null ? 'UNDISCLOSED' : comp.moistureDisclosure,
      heating: comp.isHeated ? 'HEATED' : 'RAW',
      sourceUrl: comp.sourceUrl,
      evidenceHash: comp.evidenceHash,
    },
  });
}

export async function handler(input: Input, deps?: { store?: RunStore; telemetry?: TelemetryAdapter; now?: () => Date }): Promise<Output> {
  const parsed = InputSchema.parse(input);
  const now = (deps?.now ?? (() => new Date()))().toISOString();
  const runId = `sentinel-${Date.now()}-${parsed.trigger.toLowerCase()}`;
  const idempotencyKey = buildIdempotencyKey(parsed, now);

  if (deps?.store && await deps.store.hasRun(idempotencyKey)) {
    throw new Error(`MARKET_SENTINEL_DUPLICATE: ${idempotencyKey}`);
  }

  const benchmark = buildBenchmark(parsed);
  const results = parsed.competitors.map((comp) => calculateResult(comp, benchmark));
  const max = results.reduce((a, b) => b.pricePremiumPercent > a.pricePremiumPercent ? b : a, results[0]);
  const summary = {
    totalCompetitors: results.length,
    luxuryArbitrageCount: results.filter((r) => r.luxuryArbitrage).length,
    heatedDeficitCount: results.filter((r) => r.heatedPriceDeficitPercent < 0).length,
    avgPricePremiumPercent: Number((results.reduce((sum, r) => sum + r.pricePremiumPercent, 0) / results.length).toFixed(1)),
    maxPremiumBrand: max.brand,
    maxPremiumValue: max.pricePremiumPercent,
  };

  const failures: Output['failures'] = [];
  const base = { runId, idempotencyKey, timestamp: now, trigger: parsed.trigger, benchmark, results, summary, status: 'SUCCESS' as const, failures };

  if (deps?.store) {
    try { await deps.store.appendRun(base); }
    catch (error) { failures.push({ subsystem: 'BIGQUERY', message: error instanceof Error ? error.message : String(error) }); }
  }

  if (deps?.telemetry) {
    try { await deps.telemetry.appendRun(base); }
    catch (error) { failures.push({ subsystem: 'COMMAND_HISTORY', message: error instanceof Error ? error.message : String(error) }); }
  }

  const output = { ...base, status: failures.length ? 'PARTIAL' as const : 'SUCCESS' as const, failures };
  return OutputSchema.parse(output);
}
