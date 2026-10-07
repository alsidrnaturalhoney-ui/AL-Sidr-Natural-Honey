import { describe, expect, it } from "vitest";
import {
  buildAIExecutionPlan,
  createAIModelRegistry,
  executeAIRequest,
  selectAIModels,
  type AIModelAdapter,
  type AIModelProfile,
  type AIRequest,
} from "../src/ai-orchestrator.js";

const profiles: AIModelProfile[] = [
  {
    id: "fast-text",
    provider: "provider-a",
    abilities: ["text-generation", "structured-output", "tool-use"],
    qualityTier: 3,
    speedTier: 5,
    costTier: 1,
    dataClasses: ["public", "internal"],
    enabled: true,
  },
  {
    id: "multimodal-reasoner",
    provider: "provider-b",
    abilities: [
      "text-generation",
      "reasoning",
      "structured-output",
      "tool-use",
      "vision",
      "file-understanding",
      "long-context",
      "agent-delegation",
    ],
    qualityTier: 5,
    speedTier: 3,
    costTier: 3,
    dataClasses: ["public", "internal", "confidential"],
    enabled: true,
  },
  {
    id: "disabled-all-capable",
    provider: "provider-c",
    abilities: [
      "text-generation",
      "reasoning",
      "structured-output",
      "tool-use",
      "vision",
      "file-understanding",
      "long-context",
      "agent-delegation",
    ],
    qualityTier: 5,
    speedTier: 5,
    costTier: 1,
    dataClasses: ["public", "internal", "confidential", "restricted"],
    enabled: false,
  },
];

function request(overrides: Partial<AIRequest> = {}): AIRequest {
  return {
    requestId: "req-ai-1",
    goal: "Analyze a supplier document and return a structured recommendation",
    businessIntent: "supplier onboarding and procurement",
    requiredAbilities: [
      "reasoning",
      "structured-output",
      "file-understanding",
    ],
    dataClassification: "confidential",
    maxCostTier: 4,
    minimumQualityTier: 4,
    preferredProviders: [],
    grounding: "required",
    memory: "session",
    toolAccess: "read-only",
    outputSchema: {
      required: ["answer", "requestId"],
      properties: {
        answer: "string",
        requestId: "string",
      },
      allowAdditionalProperties: true,
    },
    ...overrides,
  };
}

describe("AI orchestration", () => {
  it("selects only enabled models that satisfy ability, quality, cost, and data constraints", () => {
    const registry = createAIModelRegistry(profiles);
    const candidates = selectAIModels(request(), registry);

    expect(candidates.map((model) => model.id)).toEqual(["multimodal-reasoner"]);
  });

  it("prefers a requested provider without allowing it to bypass hard constraints", () => {
    const registry = createAIModelRegistry(profiles);
    const candidates = selectAIModels(
      request({
        requiredAbilities: ["text-generation", "structured-output"],
        dataClassification: "internal",
        minimumQualityTier: 1,
        preferredProviders: ["provider-a"],
      }),
      registry,
    );

    expect(candidates[0]?.id).toBe("fast-text");
    expect(candidates.some((model) => model.id === "disabled-all-capable")).toBe(false);
  });

  it("builds a governed plan with specialist routing, fallback models, grounding, memory, and tool policy", () => {
    const registry = createAIModelRegistry([
      ...profiles,
      {
        id: "backup-reasoner",
        provider: "provider-d",
        abilities: [
          "text-generation",
          "reasoning",
          "structured-output",
          "file-understanding",
        ],
        qualityTier: 4,
        speedTier: 2,
        costTier: 2,
        dataClasses: ["public", "internal", "confidential"],
        enabled: true,
      },
    ]);

    const plan = buildAIExecutionPlan(request(), registry);

    expect(plan.agent).toBe("agent.procurement");
    expect(plan.primaryModel).toBe("multimodal-reasoner");
    expect(plan.fallbackModels).toEqual(["backup-reasoner"]);
    expect(plan.controls).toEqual({
      grounding: "required",
      memory: "session",
      toolAccess: "read-only",
    });
  });

  it("falls back to the next compatible model only for retryable provider failures", async () => {
    const registry = createAIModelRegistry([
      ...profiles,
      {
        id: "backup-reasoner",
        provider: "provider-d",
        abilities: [
          "text-generation",
          "reasoning",
          "structured-output",
          "file-understanding",
        ],
        qualityTier: 4,
        speedTier: 2,
        costTier: 2,
        dataClasses: ["public", "internal", "confidential"],
        enabled: true,
      },
    ]);

    const adapters = new Map<string, AIModelAdapter>([
      [
        "multimodal-reasoner",
        {
          modelId: "multimodal-reasoner",
          async invoke() {
            return {
              ok: false,
              code: "provider_temporarily_unavailable",
              retryable: true,
            };
          },
        },
      ],
      [
        "backup-reasoner",
        {
          modelId: "backup-reasoner",
          async invoke(input) {
            return {
              ok: true,
              output: { answer: "grounded result", requestId: input.request.requestId },
              citations: ["source:1"],
              usage: { inputUnits: 10, outputUnits: 5 },
            };
          },
        },
      ],
    ]);

    const result = await executeAIRequest(request(), { models: registry, adapters });

    expect(result.modelId).toBe("backup-reasoner");
    expect(result.attemptedModels).toEqual([
      "multimodal-reasoner",
      "backup-reasoner",
    ]);
    expect(result.output).toEqual({
      answer: "grounded result",
      requestId: "req-ai-1",
    });
    expect(result.citations).toEqual(["source:1"]);
  });


  it("falls back when structured output does not satisfy the declared schema", async () => {
    const registry = createAIModelRegistry([
      ...profiles,
      {
        id: "backup-reasoner",
        provider: "provider-d",
        abilities: [
          "text-generation",
          "reasoning",
          "structured-output",
          "file-understanding",
        ],
        qualityTier: 4,
        speedTier: 2,
        costTier: 2,
        dataClasses: ["public", "internal", "confidential"],
        enabled: true,
      },
    ]);

    const adapters = new Map<string, AIModelAdapter>([
      [
        "multimodal-reasoner",
        {
          modelId: "multimodal-reasoner",
          async invoke(input) {
            return {
              ok: true,
              output: { answer: 42, requestId: input.request.requestId },
              citations: ["source:1"],
            };
          },
        },
      ],
      [
        "backup-reasoner",
        {
          modelId: "backup-reasoner",
          async invoke(input) {
            return {
              ok: true,
              output: {
                answer: "validated fallback",
                requestId: input.request.requestId,
              },
              citations: ["source:2"],
            };
          },
        },
      ],
    ]);

    const result = await executeAIRequest(request(), { models: registry, adapters });

    expect(result.modelId).toBe("backup-reasoner");
    expect(result.output.answer).toBe("validated fallback");
  });

  it("falls back when grounding is required and a model returns no citations", async () => {
    const registry = createAIModelRegistry([
      ...profiles,
      {
        id: "backup-reasoner",
        provider: "provider-d",
        abilities: [
          "text-generation",
          "reasoning",
          "structured-output",
          "file-understanding",
        ],
        qualityTier: 4,
        speedTier: 2,
        costTier: 2,
        dataClasses: ["public", "internal", "confidential"],
        enabled: true,
      },
    ]);

    const adapters = new Map<string, AIModelAdapter>([
      [
        "multimodal-reasoner",
        {
          modelId: "multimodal-reasoner",
          async invoke(input) {
            return {
              ok: true,
              output: {
                answer: "unsupported",
                requestId: input.request.requestId,
              },
            };
          },
        },
      ],
      [
        "backup-reasoner",
        {
          modelId: "backup-reasoner",
          async invoke(input) {
            return {
              ok: true,
              output: {
                answer: "grounded fallback",
                requestId: input.request.requestId,
              },
              citations: ["source:grounded"],
            };
          },
        },
      ],
    ]);

    const result = await executeAIRequest(request(), { models: registry, adapters });

    expect(result.modelId).toBe("backup-reasoner");
    expect(result.citations).toEqual(["source:grounded"]);
  });

  it("falls back when an adapter rejects with a provider or network error", async () => {
    const registry = createAIModelRegistry([
      ...profiles,
      {
        id: "backup-reasoner",
        provider: "provider-d",
        abilities: [
          "text-generation",
          "reasoning",
          "structured-output",
          "file-understanding",
        ],
        qualityTier: 4,
        speedTier: 2,
        costTier: 2,
        dataClasses: ["public", "internal", "confidential"],
        enabled: true,
      },
    ]);

    const adapters = new Map<string, AIModelAdapter>([
      [
        "multimodal-reasoner",
        {
          modelId: "multimodal-reasoner",
          async invoke() {
            throw new Error("provider_connection_reset");
          },
        },
      ],
      [
        "backup-reasoner",
        {
          modelId: "backup-reasoner",
          async invoke(input) {
            return {
              ok: true,
              output: {
                answer: "recovered",
                requestId: input.request.requestId,
              },
              citations: ["source:recovered"],
            };
          },
        },
      ],
    ]);

    const result = await executeAIRequest(request(), { models: registry, adapters });

    expect(result.modelId).toBe("backup-reasoner");
    expect(result.attemptedModels).toEqual([
      "multimodal-reasoner",
      "backup-reasoner",
    ]);
  });

  it("fails closed when no compatible model exists", () => {
    const registry = createAIModelRegistry(profiles);

    expect(() =>
      buildAIExecutionPlan(
        request({
          requiredAbilities: ["computer-use", "realtime-voice"],
          dataClassification: "restricted",
        }),
        registry,
      ),
    ).toThrow("no_compatible_ai_model");
  });
});
