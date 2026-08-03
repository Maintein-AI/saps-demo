/**
 * P0-4 · Shared AirVault primitives.
 *
 * Each of these exists because a flow amendment demands the same concept in
 * several places. Building them once is what keeps the demo coherent — no
 * screen after Phase 0 should re-implement any of them locally.
 *
 * | Component            | Flow amendment                                   |
 * |----------------------|--------------------------------------------------|
 * | OcrConfidenceField   | FC-01 05b–05d, FC-02, FC-06, FC-11               |
 * | OcrAcceptanceGate    | FC-01 05c                                        |
 * | EvidencePack         | FC-04 — digital evidence vs remarks-only         |
 * | ApprovalStepper      | FC-07 waiver, FC-04 instruction, FC-10 disposition|
 * | AgingBadge           | FC-07 storage clock, FC-10 aging engine          |
 * | DocNumber            | FC-04, FC-07, FC-08, FC-10 numbering continuity  |
 * | AuditStrip           | ~60 CMTS tables carry the audit columns          |
 * | GatewaySwitch        | FC-06 provider abstraction, FC-12 gateways       |
 */

export { default as OcrConfidenceField, OcrAcceptanceGate } from "./OcrConfidenceField";
export { default as EvidencePack } from "./EvidencePack";
export { default as ApprovalStepper } from "./ApprovalStepper";
export { default as AgingBadge } from "./AgingBadge";
export { default as DocNumber } from "./DocNumber";
export { default as AuditStrip } from "./AuditStrip";
export { default as GatewaySwitch, GatewayCard } from "./GatewaySwitch";
