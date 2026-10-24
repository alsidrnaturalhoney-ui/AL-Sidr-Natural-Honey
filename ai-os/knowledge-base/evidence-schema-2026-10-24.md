# AL SIDR — Versioned Evidence Schema (Public-safe Template)

**Authority:** Existing Notion master and `ai-os/knowledge-base/ingestion-policy.yaml` remain canonical. This is a versioned data contract, not a second KB or actual private incident log.

## Record shape
```json
{
  "record_id": "generated-opaque-id",
  "entity_type": "shopify_product|company|supplier|integration|claim|incident",
  "entity_id": "non-secret-identifier",
  "field": "scoped-field-name",
  "language": "en-AE|ar-AE|neutral",
  "source_class": "primary_evidence|live_commerce|approved_knowledge|official_external|historical_draft",
  "source_ref": "authorized-link-or-record-id",
  "observed_on": "YYYY-MM-DD",
  "effective_on": null,
  "expires_on": null,
  "verified": false,
  "status": "UNVERIFIED|VERIFIED_CURRENT|STALE|CONFLICTED|BLOCKED",
  "value": "PUBLIC_EXAMPLE_ONLY",
  "approved_for_publication": false,
  "owner": "responsible-team",
  "review_due": "YYYY-MM-DD"
}
```

## Private vs public storage
Private operational outcomes, account performance, licensing details and customer/vendor correspondence belong in authorized Notion, Airtable, Shopify, Drive or Asana scopes. Do **not** commit them to this public GitHub repository. GitHub stores only generic policies, schemas, skill contracts and code. Do not store tokens, API keys, credentials, bank identifiers or customer data.

## Freshness and dispute policy
Current authenticated commerce wins over older brochure copy for stock, price, shipping and order state; current legal/batch certificates govern regulated claims within scope. Capture timestamps and expiry. Same-rank current disagreement is a conflict until reviewed; historical drafts must never silently overwrite verified current records.
