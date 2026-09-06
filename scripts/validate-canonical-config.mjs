import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const readJson = (relativePath) => JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));

const canonical = readJson('config/canonical-values.json');
const promotions = readJson('config/promotions.json');

const checks = [
  ['brand name', canonical.brand?.name === 'AL SIDR Natural Honey'],
  ['heritage year', canonical.brand?.established === 1986],
  ['Abu Dhabi location', canonical.brand?.location === 'Abu Dhabi, UAE'],
  ['currency', canonical.commerce?.currency === 'AED'],
  ['target AOV', canonical.commerce?.target_aov_aed === 450],
  ['free UAE delivery threshold', canonical.commerce?.shipping?.free_delivery_threshold_aed === 250],
  ['below-threshold UAE delivery fee', canonical.commerce?.shipping?.delivery_below_threshold_aed === 20],
  ['English locale', canonical.localization?.default_locale === 'en-AE'],
  ['Arabic locale', canonical.localization?.arabic_locale === 'ar-AE'],
  ['Arabic storefront path', canonical.localization?.arabic_storefront_path === '/ar/'],
  ['ADAFSA terminology', canonical.compliance?.certification_name === 'ADAFSA'],
  ['promotion source', canonical.governance?.canonical_promotion_source === 'config/promotions.json'],
  ['promotion hero protection', promotions.hero_takeover_allowed === false],
  ['announcement-only promotions', promotions.announcement_only === true]
];

const serialized = JSON.stringify({ canonical, promotions });
checks.push(['forbidden ADFCA alias is not used as active certification', !serialized.includes('"certification_name":"ADFCA"')]);

const failed = checks.filter(([, ok]) => !ok);
for (const [name, ok] of checks) {
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`);
}

if (failed.length) {
  console.error(`\n${failed.length} canonical rule check(s) failed.`);
  process.exit(1);
}

console.log('\nAll canonical Al Sidr configuration checks passed.');
