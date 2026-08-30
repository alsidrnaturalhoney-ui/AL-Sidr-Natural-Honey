# JARVIS V6 — Capability Registry

Every skill/agent/capability declares: stable ID/version, owner, purpose, input/output contract, required MCP/connector, source-of-truth domain, permissions, risk class, approval policy, required evidence, tests, rollback strategy, and audit event type.

## Governance
- AuthorityResolver
- RiskClassifier
- PermissionGate
- ClaimGate
- AuditLedgerWriter
- DriftDetector

## Intelligence
- ModelRouter
- MemoryRetriever
- RAGKnowledgeBase
- CompetitorIntelligence
- DemandForecasting

## Commerce
- ProductManager
- PromotionsSync
- InventoryRebalancer
- PricingEngine
- CartDrawerArchitect
- StructuredDataInjector

## Engineering
- FullMonorepoScaffold
- ZodContractGen
- MCPServerScaffolder
- GitOpsOrchestrator
- SpeedOptimizer

## CX / Content
- WhatsAppBotRouter
- DMResponder
- KlaviyoFlowSync
- JudgeMeReviewSync
- ASMRStoryboarder
- ContentProduction

## Risk policy
R0/R1 may execute automatically within declared permissions. R2 requires policy validation. R3-R5 require the approval path declared by the authority owner. Missing permission, dependency, or evidence causes BLOCK/REVIEW.
