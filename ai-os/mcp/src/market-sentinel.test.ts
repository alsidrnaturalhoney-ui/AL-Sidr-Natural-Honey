import { calculateResult, handler } from './market-sentinel.js';

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

const base = {
  sourceUrl: 'https://example.com/evidence',
  capturedAt: '2026-08-30T00:00:00.000Z',
};

const balqees = {
  brand: 'Balqees Honey' as const,
  priceAED: 178.69,
  packageSizeGrams: 500,
  moistureDisclosure: 18.2,
  isHeated: false,
  ...base,
};

const shifa = {
  brand: 'Al Shifa' as const,
  priceAED: 95.76,
  packageSizeGrams: 1000,
  moistureDisclosure: null,
  isHeated: true,
  ...base,
};

const benchmark = {
  handle: '/royal-yemeni-sidr-honey-doan' as const,
  pricePer100g: 56,
  moisture: 16.5,
  grade: 'ADAFSA Grade A',
  nmrPollen: '>85%',
  diastase: '≥18 DN',
  hmf: '≤10 mg/kg',
  irmsC4: '0.00%',
};

const first = calculateResult(balqees, benchmark);
assert(first.pricePremiumPercent === 56.7, `Expected 56.7 premium, got ${first.pricePremiumPercent}`);
assert(first.luxuryArbitrage === true, 'Expected luxury arbitrage');
assert(first.heatedPriceDeficitPercent === 0, 'Expected zero heated deficit');
assert(first.competitorQualityStatus === 'DISCLOSED', 'Expected disclosed evidence status');

const second = calculateResult(shifa, benchmark);
assert(second.heatedPriceVariancePercent === -82.9, `Expected -82.9 variance, got ${second.heatedPriceVariancePercent}`);
assert(second.heatedPriceDeficitPercent === -82.9, 'Expected heated deficit');
assert(second.moistureVariance === null, 'Expected unknown moisture variance');
assert(second.evidence.moisture === 'UNDISCLOSED', 'Expected undisclosed moisture');

const output = await handler({ trigger: 'MANUAL', competitors: [balqees] }, { now: () => new Date('2026-08-30T01:02:03.000Z') });
assert(output.status === 'SUCCESS', 'Expected success');
assert(output.summary.maxPremiumBrand === 'Balqees Honey', 'Expected Balqees as max premium');
assert(output.summary.avgPricePremiumPercent === 56.7, 'Expected average premium');
assert(output.benchmark.grade === 'ADAFSA Grade A', 'Expected ADAFSA benchmark');

let duplicateDetected = false;
try {
  await handler({ trigger: 'MANUAL', competitors: [balqees] }, {
    now: () => new Date('2026-08-30T01:02:03.000Z'),
    store: { hasRun: async () => true, appendRun: async () => undefined },
  });
} catch (error) {
  duplicateDetected = String(error).includes('MARKET_SENTINEL_DUPLICATE');
}
assert(duplicateDetected, 'Expected duplicate detection');

const partial = await handler({ trigger: 'MANUAL', competitors: [balqees] }, {
  now: () => new Date('2026-08-30T01:02:04.000Z'),
  store: {
    hasRun: async () => false,
    appendRun: async () => { throw new Error('persistence unavailable'); },
  },
});
assert(partial.status === 'PARTIAL', 'Expected partial status after persistence failure');
assert(partial.failures[0]?.subsystem === 'BIGQUERY', 'Expected BigQuery failure classification');

console.log('Skill-25 MarketSentinel tests passed');
