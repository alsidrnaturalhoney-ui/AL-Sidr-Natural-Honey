import assert from 'node:assert/strict';
import { calculateResult, handler } from './market-sentinel.js';

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
assert.equal(first.pricePremiumPercent, 56.7);
assert.equal(first.luxuryArbitrage, true);
assert.equal(first.heatedPriceDeficitPercent, 0);
assert.equal(first.competitorQualityStatus, 'DISCLOSED');

const second = calculateResult(shifa, benchmark);
assert.equal(second.heatedPriceVariancePercent,  -82.9);
assert.equal(second.heatedPriceDeficitPercent, -82.9);
assert.equal(second.moistureVariance, null);
assert.equal(second.evidence.moisture, 'UNDISCLOSED');

const output = await handler({ trigger: 'MANUAL', competitors: [balqees] }, { now: () => new Date('2026-08-30T01:02:03.000Z') });
assert.equal(output.status, 'SUCCESS');
assert.equal(output.summary.maxPremiumBrand, 'Balqees Honey');
assert.equal(output.summary.avgPricePremiumPercent, 56.7);
assert.equal(output.benchmark.grade, 'ADAFSA Grade A');

let duplicateDetected = false;
try {
  await handler({ trigger: 'MANUAL', competitors: [balqees] }, {
    now: () => new Date('2026-08-30T01:02:03.000Z'),
    store: {
      hasRun: async () => true,
      appendRun: async () => undefined,
    },
  });
} catch (error) {
  duplicateDetected = String(error).includes('MARKET_SENTINEL_DUPLICATE');
}
assert.equal(duplicateDetected, true);

let partial: Awaited<ReturnType<typeof handler>>;
partial = await handler({ trigger: 'MANUAL', competitors: [balqees] }, {
  now: () => new Date('2026-08-30T01:02:04.000Z'),
  store: {
    hasRun: async () => false,
    appendRun: async () => { throw new Error('persistence unavailable'); },
  },
});
assert.equal(partial.status, 'PARTIAL');
assert.equal(partial.failures[0]?.subsystem, 'BIGQUERY');

console.log('Skill-25 MarketSentinel tests passed');
