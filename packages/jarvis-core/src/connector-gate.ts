import type { RiskClass } from "./contracts.js";
import type { ConnectorManifest } from "./manifests.js";

const riskRank: Record<RiskClass, number> = { R0: 0, R1: 1, R2: 2, R3: 3 };

export type ConnectorGateDecision =
  | { allowed: true; reason: "connector_gate_satisfied" }
  | { allowed: false; reason: string };

export function evaluateConnectorGate(input: {
  connector: ConnectorManifest;
  operation: string;
  risk: RiskClass;
  write: boolean;
  approvalValid: boolean;
}): ConnectorGateDecision {
  const { connector, operation, risk, write, approvalValid } = input;

  if (connector.status === "blocked" || connector.status === "registered-unverified") {
    return { allowed: false, reason: "connector_not_verified" };
  }
  if (!connector.allowedOperations.includes(operation)) {
    return { allowed: false, reason: "connector_operation_not_allowed" };
  }
  if (riskRank[risk] > riskRank[connector.maxRisk]) {
    return { allowed: false, reason: "connector_risk_ceiling_exceeded" };
  }
  if (connector.status === "connected-limited" && write) {
    return { allowed: false, reason: "limited_connector_read_only" };
  }
  if (write && connector.writePolicy === "disabled") {
    return { allowed: false, reason: "connector_writes_disabled" };
  }
  if (write && connector.writePolicy === "approval-required" && !approvalValid) {
    return { allowed: false, reason: "connector_approval_required" };
  }
  return { allowed: true, reason: "connector_gate_satisfied" };
}
