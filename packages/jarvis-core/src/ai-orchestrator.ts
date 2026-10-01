import { z } from "zod";
import { routeBusinessIntent } from "./business-routing.js";

export const AIAbility = z.enum([
  "text-generation",
  "reasoning",
  "structured-output",
  "tool-use",
  "vision",
  "image-generation",
  "audio-input",
  "audio-generation",
  "speech-output",
  "realtime-voice",
  "video-understanding",
  "video-generation",
  "embeddings",
  "reranking",
  "web-research",
  "file-understanding",
  "code-execution",
  "long-context",
  "memory",
  "agent-delegation",
  "computer-use",
]);

export const AIDataClassification = z.enum([
  "public",
  "internal",
  "confidential",
  "restricted",
]);

export const AIGroundingMode = z.enum(["optional", "required"]);
export const AIMemoryMode = z.enum(["none", "session", "long-term"]);
export const AIToolAccess = z.enum(["disabled", "read-only", "approval-gated"]);

export const AIModelProfile = z.object({
  id: z.string().min(1),
  provider: z.string().min(1),
  abilities: z.array(AIAbility).min(1),
  qualityTier: z.number().int().min(1).max(5),
  speedTier: z.number().int().min(1).max(5),
  costTier: z.number().int().min(1).max(5),
  dataClasses: z.array(AIDataClassification).min(1),
  enabled: z.boolean(),
});

export const AIRequest = z.object({
  requestId: z.string().min(1),
  goal: z.string().min(1),
  businessIntent: z.string().min(1),
  requiredAbilities: z.array(AIAbility).min(1),
  dataClassification: AIDataClassification,
  maxCostTier: z.number().int().min(1).max(5),
  minimumQualityTier: z.number().int().min(1).max(5),
  preferredProviders: z.array(z.string().min(1)),
  grounding: AIGroundingMode,
  memory: AIMemoryMode,
  toolAccess: AIToolAccess,
});

export const AIExecutionPlan = z.object({
  requestId: z.string().min(1),
  goal: z.string().min(1),
  agent: z.string().min(1),
  skills: z.array(z.string().min(1)),
  routeReason: z.string().min(1),
  primaryModel: z.string().min(1),
  fallbackModels: z.array(z.string().min(1)),
  requiredAbilities: z.array(AIAbility).min(1),
  dataClassification: AIDataClassification,
  controls: z.object({
    grounding: AIGroundingMode,
    memory: AIMemoryMode,
    toolAccess: AIToolAccess,
  }),
});

export type AIAbility = z.infer<typeof AIAbility>;
export type AIDataClassification = z.infer<typeof AIDataClassification>;
export type AIGroundingMode = z.infer<typeof AIGroundingMode>;
export type AIMemoryMode = z.infer<typeof AIMemoryMode>;
export type AIToolAccess = z.infer<typeof AIToolAccess>;
export type AIModelProfile = z.infer<typeof AIModelProfile>;
export type AIRequest = z.infer<typeof AIRequest>;
export type AIExecutionPlan = z.infer<typeof AIExecutionPlan>;

export type AIModelRegistry = ReadonlyMap<string, AIModelProfile>;

export function createAIModelRegistry(inputs: unknown[]): AIModelRegistry {
  const registry = new Map<string, AIModelProfile>();

  for (const input of inputs) {
    const profile = AIModelProfile.parse(input);
    if (registry.has(profile.id)) {
      throw new Error(`duplicate_ai_model:${profile.id}`);
    }
    registry.set(
      profile.id,
      Object.freeze({
        ...profile,
        abilities: Object.freeze([...profile.abilities]) as AIAbility[],
        dataClasses: Object.freeze([...profile.dataClasses]) as AIDataClassification[],
      }),
    );
  }

  return registry;
}

function supportsRequest(
  request: AIRequest,
  profile: AIModelProfile,
): boolean {
  if (!profile.enabled) {
    return false;
  }
  if (profile.qualityTier < request.minimumQualityTier) {
    return false;
  }
  if (profile.costTier > request.maxCostTier) {
    return false;
  }
  if (!profile.dataClasses.includes(request.dataClassification)) {
    return false;
  }

  const supported = new Set(profile.abilities);
  return request.requiredAbilities.every((ability) => supported.has(ability));
}

export function selectAIModels(
  inputRequest: AIRequest,
  registry: AIModelRegistry,
): AIModelProfile[] {
  const request = AIRequest.parse(inputRequest);
  const preferred = new Set(request.preferredProviders);

  return [...registry.values()]
    .filter((profile) => supportsRequest(request, profile))
    .sort((a, b) => {
      const aPreferred = preferred.has(a.provider) ? 1 : 0;
      const bPreferred = preferred.has(b.provider) ? 1 : 0;
      if (aPreferred !== bPreferred) {
        return bPreferred - aPreferred;
      }
      if (a.qualityTier !== b.qualityTier) {
        return b.qualityTier - a.qualityTier;
      }
      if (a.speedTier !== b.speedTier) {
        return b.speedTier - a.speedTier;
      }
      if (a.costTier !== b.costTier) {
        return a.costTier - b.costTier;
      }
      return a.id.localeCompare(b.id);
    });
}

export function buildAIExecutionPlan(
  inputRequest: AIRequest,
  registry: AIModelRegistry,
): AIExecutionPlan {
  const request = AIRequest.parse(inputRequest);
  const candidates = selectAIModels(request, registry);
  const primary = candidates[0];

  if (!primary) {
    throw new Error("no_compatible_ai_model");
  }

  const route = routeBusinessIntent(request.businessIntent);

  return AIExecutionPlan.parse({
    requestId: request.requestId,
    goal: request.goal,
    agent: route.agent,
    skills: route.skills,
    routeReason: route.reason,
    primaryModel: primary.id,
    fallbackModels: candidates.slice(1).map((candidate) => candidate.id),
    requiredAbilities: request.requiredAbilities,
    dataClassification: request.dataClassification,
    controls: {
      grounding: request.grounding,
      memory: request.memory,
      toolAccess: request.toolAccess,
    },
  });
}
