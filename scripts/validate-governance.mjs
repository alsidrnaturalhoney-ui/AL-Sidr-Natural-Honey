import fs from 'node:fs';

const readJson = (path) => JSON.parse(fs.readFileSync(path, 'utf8'));
const canonical = readJson('config/canonical-values.json');
const promotions = readJson('config/promotions.json');
const brandCore = fs.readFileSync('brand-system/knowledge-base/brand-core.md', 'utf8');

const errors = [];
const check = (condition, message) => {
  if (!condition) errors.push(message);
};

check(canonical.commerce?.free_delivery_threshold_aed === 250,
  'Canonical free UAE delivery threshold must be AED 250.');
check(canonical.commerce?.flat_delivery_fee_below_threshold_aed === 20,
  'Canonical UAE delivery fee below threshold must be AED 20.');
check(canonical.governance?.canonical_promotion_source === 'config/promotions.json',
  'Canonical promotion source must be config/promotions.json.');
check(canonical.governance?.medical_claims_allowed === false,
  'Unsupported medical claims must remain disabled.');

check(promotions.shipping?.free_delivery_threshold_aed === canonical.commerce?.free_delivery_threshold_aed,
  'Promotion shipping threshold must match canonical commerce rules.');
check(promotions.shipping?.flat_delivery_fee_below_threshold_aed === canonical.commerce?.flat_delivery_fee_below_threshold_aed,
  'Promotion delivery fee must match canonical commerce rules.');
check(promotions.governance?.single_source_of_truth === true,
  'Promotions must remain single-source-of-truth governed.');
check(promotions.governance?.hardcoded_promotions_forbidden === true,
  'Hard-coded promotions must remain forbidden.');
check(promotions.governance?.hero_promotion_copy_forbidden === true,
  'Promotional hero copy must remain forbidden.');

for (const campaign of promotions.active_campaigns ?? []) {
  check(campaign?.status === 'active', `Active campaign ${campaign?.id ?? '<missing-id>'} must have status=active.`);
  check(Boolean(campaign?.starts_at), `Active campaign ${campaign?.id ?? '<missing-id>'} is missing starts_at.`);
  check(Boolean(campaign?.ends_at), `Active campaign ${campaign?.id ?? '<missing-id>'} is missing ends_at.`);
}

check(!brandCore.includes('ADFCA Grade A certification'),
  'Brand core contains obsolete positive ADFCA certification wording. Use ADAFSA.');
check(brandCore.includes('ADAFSA — Abu Dhabi Agriculture and Food Safety Authority'),
  'Brand core must name ADAFSA in full.');
check(brandCore.includes('https://wa.me/message/GL7KBRRYQOAPN1'),
  'Brand core WhatsApp link does not match the canonical AL SIDR contact link.');

if (errors.length) {
  console.error(`Governance validation failed with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Governance validation passed.');
