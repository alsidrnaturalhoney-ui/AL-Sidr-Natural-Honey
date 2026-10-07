# Business AI Capability Expansion — 2026-09-26

This release extends the existing AL SIDR AI OS.

## Added
- 6 specialist agents: retail operations, payments continuity, finance reconciliation, local reputation, data quality and growth experiments.
- 20 reusable business skills.
- 9 governed runtime capabilities.
- 3 connector definitions: Tabby, Google Business Profile and OpenAI Platform.
- Prompt Library v2 with 20 operating prompts.
- Instruction Pack v2.
- Business Knowledge Map v2.
- MCP service-profile catalog.
- Plugin capability registry.
- Credential requirements manifest with no secret values.

## Guardrails
No production deployment, external publishing, financial action, legal acceptance, credential creation outside a secure provider flow, or destructive cleanup is performed by this registry expansion.

## Activation sequence
1. Registry-integrity/CI checks pass.
2. Review duplicate responsibility against existing agents/skills.
3. Connect only approved plugins.
4. Provision provider credentials through secure OAuth/key setup.
5. Implement MCP profiles incrementally behind tests.
6. Register production-ready tools in Airtable/Supabase only after verification.
