/**
 * P0-5 · The FC-12 module map and the FC-01…FC-12 flow walkthroughs.
 *
 * The sidebar is organised by persona, which is right for daily use but
 * makes a flow-based walkthrough impossible — FC-01 alone crosses eight
 * portals. This file gives the other two views:
 *
 *   • Module view    — FC-12's tiers and spines, with honest coverage
 *   • Flow walkthrough — each flowchart as an ordered list of screens
 *
 * Coverage is deliberately honest. A module that does not exist shows as
 * "not-started" rather than being quietly omitted, because the gap is the
 * point: FC-09 transhipment and FC-10-A mishandled cargo are live dead
 * ends in the product today.
 */

export type Coverage = "built" | "partial" | "stub" | "not-started";

export const COVERAGE_LABEL: Record<Coverage, string> = {
  built: "Built",
  partial: "Partial",
  stub: "Stub",
  "not-started": "Not started",
};

export const COVERAGE_STYLE: Record<Coverage, { bg: string; fg: string }> = {
  built: { bg: "#DCFCE7", fg: "#16A34A" },
  partial: { bg: "#FEF3C7", fg: "#D97706" },
  stub: { bg: "#F1F5F9", fg: "#64748B" },
  "not-started": { bg: "#FEE2E2", fg: "#DC2626" },
};

export type Tier = "tier1" | "tier2" | "messaging" | "exception" | "tier3";

export const TIER_LABEL: Record<Tier, string> = {
  tier1: "Tier 1 — Input",
  tier2: "Tier 2 — Core Processing",
  messaging: "Messaging Spine",
  exception: "Exception Spine",
  tier3: "Tier 3 — Output / Closure",
};

export interface ModuleDef {
  code: string;
  name: string;
  tier: Tier;
  coverage: Coverage;
  /** Which build phase owns bringing this to "built". */
  phase: string;
  /** Flowcharts this module implements. */
  flows: string[];
  screens: Array<{ label: string; href: string }>;
  /** What is missing, when coverage is not "built". */
  gap?: string;
}

export const MODULES: ModuleDef[] = [
  // ---- Tier 1: Input ----
  {
    code: "M01",
    name: "Flight & Airline Data",
    tier: "tier1",
    coverage: "built",
    phase: "P1-1 ✓",
    flows: ["FC-02"],
    screens: [
      { label: "Flight board", href: "/import/flights" },
      { label: "Manifest & IGM", href: "/import/manifest" },
      { label: "Demand forecast (planning)", href: "/planner/demand-forecast" },
    ],
    gap: "Flight board with pre-arrival message completeness and airline reference is live. Real SITA feed is a backend concern.",
  },
  {
    code: "M02",
    name: "Document Management",
    tier: "tier1",
    coverage: "built",
    phase: "P1-2 ✓",
    flows: ["FC-04", "FC-08", "FC-11"],
    screens: [
      { label: "Document repository", href: "/import/documents" },
      { label: "OCR intake workbench", href: "/import/ocr-intake" },
      { label: "Authority letter OCR", href: "/gate-entry/authority-letter-digitisation" },
    ],
    gap: "Repository, viewer and version history are live. No CMTS table — flagged as an AirVault addition for sign-off.",
  },
  {
    code: "M03",
    name: "AWB / MAWB / HAWB Indexing — HUB",
    tier: "tier1",
    coverage: "built",
    phase: "P0-3, P1-4, P1-7, P1-8 ✓",
    flows: ["FC-01", "FC-02"],
    screens: [
      { label: "AWB hub", href: "/awb/1" },
      { label: "AWB register", href: "/warehouse-manager/awb-detail" },
      { label: "Indexing workbench", href: "/import/indexing" },
      { label: "Consolidation & split", href: "/import/consolidation" },
      { label: "Arrival advice / NOA", href: "/import/arrival-advice" },
    ],
    gap: "All 64 IMPORTAWB columns render, legacy-only fields marked. Hub wires to the eight FC-12 modules.",
  },

  // ---- Tier 2: Core ----
  {
    code: "M04",
    name: "Cargo Receipt & Acceptance",
    tier: "tier2",
    coverage: "built",
    phase: "P1-6 ✓",
    flows: ["FC-01", "FC-02"],
    screens: [
      { label: "Cargo acceptance", href: "/import/acceptance" },
      { label: "Cargo acceptance check-in (legacy screen)", href: "/cmts-absorption/cargo-acceptance" },
      { label: "Putaway", href: "/warehouse-manager/putaway" },
    ],
    gap: "All 32 IMPORTAWBDETAIL columns present incl. short-landing, part-receipt and damage. Weighing computes chargeable weight live.",
  },
  {
    code: "M05",
    name: "Storage & Warehouse Management",
    tier: "tier2",
    coverage: "partial",
    phase: "P2-1 … P2-5",
    flows: ["FC-03"],
    screens: [
      { label: "Storage map", href: "/warehouse-manager/storage-map" },
      { label: "Putaway", href: "/warehouse-manager/putaway" },
      { label: "Picking", href: "/warehouse-manager/picking" },
      { label: "Cold chain console", href: "/warehouse-manager/cold-chain" },
    ],
    gap: "Allocation is decorative — no class→subclass→location rules, and the logical/physical dual model is not modelled on screen.",
  },
  {
    code: "M06",
    name: "CDR / Exception Management",
    tier: "tier2",
    coverage: "built",
    phase: "P3-1 … P3-3",
    flows: ["FC-04"],
    screens: [
      { label: "Aging dashboard", href: "/exceptions/queue" },
      { label: "CDR workbench", href: "/exceptions/cdr" },
      { label: "Damage register", href: "/exceptions/damage" },
      { label: "Hold register (29-col)", href: "/exceptions/holds" },
      { label: "Exceptions queue (warehouse)", href: "/warehouse-manager/exceptions-queue" },
    ],
    gap: "Covered. The §11 final action and the release workflow are click-through only — no backend to persist a decision.",
  },
  {
    code: "M09",
    name: "Customs Clearance Tracking",
    tier: "tier2",
    coverage: "built",
    phase: "P4-1 … P4-4",
    flows: ["FC-06"],
    screens: [
      { label: "Gateway (PSW / WeBOC)", href: "/customs/gateway" },
      { label: "SD / GD filing", href: "/customs/filing" },
      { label: "Channels & OOC", href: "/customs/channels" },
      { label: "Detained cargo", href: "/customs/detained" },
      { label: "Customs queue (legacy screen)", href: "/excise-compliance/customs-queue" },
      { label: "GD filing workbench (legacy screen)", href: "/cha/gd-filing-workbench" },
    ],
    gap: "Covered. The five pre-P4 screens still carry their own hard-coded mock data and have not been re-pointed at the domain model — see P4-5.",
  },
  {
    code: "M10",
    name: "Tariff & Billing Engine",
    tier: "tier2",
    coverage: "partial",
    phase: "P5-1, P5-2",
    flows: ["FC-07"],
    screens: [
      { label: "Tariff master editor", href: "/finance-manager/tariff-master-editor" },
      { label: "Multi-tariff engine", href: "/finance-manager/multi-tariff-engine" },
      { label: "Charges calculator", href: "/cmts-absorption/charges-calculator" },
    ],
    gap: "No location charges, no subclass dimension, and the calculator computes nothing.",
  },
  {
    code: "M11",
    name: "Invoice / Payment / Waiver",
    tier: "tier2",
    coverage: "partial",
    phase: "P5-3 … P5-6",
    flows: ["FC-07"],
    screens: [
      { label: "Invoice generation", href: "/finance-manager/invoice-generation" },
      { label: "Waiver workflow", href: "/finance-manager/waiver-workflow" },
      { label: "Payment reconciliation", href: "/finance-manager/payment-reconciliation" },
      { label: "Godown rent history", href: "/cmts-absorption/godown-rent-history" },
    ],
    gap: "The whole godown-rent calculation chain is missing — six CMTS tables, 165 columns. Challan, pay order and bank fields have zero coverage.",
  },
  {
    code: "M12",
    name: "Delivery Order Management",
    tier: "tier2",
    coverage: "partial",
    phase: "P5-7",
    flows: ["FC-07", "FC-08"],
    screens: [
      { label: "DO collection", href: "/cha/do-collection" },
      { label: "Pay & download DO", href: "/consignee/pay-do" },
    ],
    gap: "Collection-side only. There is no DO issuance screen and no five-condition release gate.",
  },

  // ---- Messaging spine ----
  {
    code: "M07",
    name: "Messaging Engine",
    tier: "messaging",
    coverage: "partial",
    phase: "P7-1",
    flows: ["FC-05"],
    screens: [
      { label: "Customs messaging console", href: "/excise-compliance/customs-messaging" },
      { label: "ULD message builder", href: "/uld-message-builder" },
    ],
    gap: "ULD messaging (UCM/SCM/LUC) is covered; IATA Cargo-IMP status messaging has no console.",
  },
  {
    code: "M08",
    name: "Notification Engine",
    tier: "messaging",
    coverage: "partial",
    phase: "P7-2, P7-3",
    flows: ["FC-05"],
    screens: [{ label: "Notifications & messaging", href: "/notifications-messaging" }],
    gap: "No template model, no per-recipient channel preference, no read receipts, and no trigger map.",
  },

  // ---- Exception spine ----
  {
    code: "M15",
    name: "Transhipment Management",
    tier: "exception",
    coverage: "not-started",
    phase: "P8-1, P8-2",
    flows: ["FC-09"],
    screens: [],
    gap: "Does not exist. FC-01 branches into it and FC-03 routes cargo to a transhipment bonded zone — both are dead ends today.",
  },
  {
    code: "M16",
    name: "Re-export Management",
    tier: "exception",
    coverage: "built",
    phase: "P3-5",
    flows: ["FC-10"],
    screens: [
      { label: "Re-export console (FC-10-B)", href: "/exceptions/re-export" },
      { label: "CHA re-export / long-stay", href: "/cha/re-export-long-stay" },
    ],
    gap: "Covered: eight stages, PSW-primary filing, and the §B6-before-§B7 charge gate.",
  },
  {
    code: "M17",
    name: "Mishandled Cargo Management",
    tier: "exception",
    coverage: "built",
    phase: "P3-4",
    flows: ["FC-10"],
    screens: [{ label: "Mishandled cargo (FC-10-A)", href: "/exceptions/mishandled" }],
    gap: "Covered. Built with no CMTS table behind it — AWBTRANSFER cannot express this branch.",
  },
  {
    code: "M18",
    name: "Long-Stay / Auction / Disposal",
    tier: "exception",
    coverage: "built",
    phase: "P3-6",
    flows: ["FC-10"],
    screens: [
      { label: "Long-stay / Section 82", href: "/exceptions/long-stay" },
      { label: "Aging dashboard", href: "/exceptions/queue" },
      { label: "Section 82 register (compliance)", href: "/excise-compliance/section-82-long-stay" },
    ],
    gap: "Covered. Per-site Section82Days remains open as BLK-07 — the demo applies one threshold everywhere.",
  },

  // ---- Tier 3: Output ----
  {
    code: "M13",
    name: "Gate Pass & Dispatch",
    tier: "tier3",
    coverage: "partial",
    phase: "P6-1 … P6-3",
    flows: ["FC-08"],
    screens: [
      { label: "Vehicle entry", href: "/gate-entry/vehicle-entry" },
      { label: "Vehicle exit", href: "/gate-entry/vehicle-exit" },
      { label: "Live vehicle board", href: "/gate-entry/live-vehicle-board" },
      { label: "Picking", href: "/warehouse-manager/picking" },
    ],
    gap: "Strong on the vehicle side; no gate-pass generation screen carrying GATEPASS's 43 fields.",
  },
  {
    code: "M14",
    name: "POD Capture",
    tier: "tier3",
    coverage: "partial",
    phase: "P6-4, P6-5",
    flows: ["FC-08"],
    screens: [{ label: "POD history (consignee view)", href: "/consignee/pod-history" }],
    gap: "History only. There is no operator-side capture screen — no e-signature, CNIC scan or geo.",
  },
  {
    code: "M19",
    name: "Reports & Dashboards",
    tier: "tier3",
    coverage: "partial",
    phase: "P10-6",
    flows: ["FC-12"],
    screens: [
      { label: "Reports", href: "/reports" },
      { label: "Auditor home", href: "/auditor" },
    ],
    gap: "A shell with sample charts rather than reports derived from the modules.",
  },
  {
    code: "M20",
    name: "Audit Trail & Archive",
    tier: "tier3",
    coverage: "partial",
    phase: "P10-5",
    flows: ["FC-12"],
    screens: [
      { label: "Audit trail browser", href: "/admin/audit-trail" },
      { label: "Session & event log", href: "/admin/event-log" },
      { label: "Cargo trace", href: "/auditor/cargo-trace" },
    ],
    gap: "No before/after diff (the CMTS XmlTesst pattern), no session drill-down, no per-record history.",
  },
];

export const TIER_ORDER: Tier[] = ["tier1", "tier2", "messaging", "exception", "tier3"];

export function modulesByTier(tier: Tier): ModuleDef[] {
  return MODULES.filter((m) => m.tier === tier);
}

export function coverageSummary() {
  const by: Record<Coverage, number> = { built: 0, partial: 0, stub: 0, "not-started": 0 };
  for (const m of MODULES) by[m.coverage]++;
  return by;
}

/* ================================================================== *
 * Flow walkthroughs
 * ================================================================== */

export interface FlowStep {
  /** The flow's own step reference, e.g. "05a" or "B4". */
  ref: string;
  label: string;
  /** Where this step happens in the product; null when nothing implements it. */
  href: string | null;
  module: string;
  note?: string;
}

export interface FlowDef {
  id: string;
  title: string;
  subtitle: string;
  /** From the FigJam title block. */
  docNo: string;
  rev: string;
  steps: FlowStep[];
  /** The AirVault amendment, summarised. */
  amendment: string;
}

export const FLOWS: FlowDef[] = [
  {
    id: "FC-01",
    title: "Master End-to-End Air Cargo Flow",
    subtitle: "The complete cargo lifecycle from airline handover to file closure",
    docNo: "SAPS-ACMS-FC-01",
    rev: "Rev 2.0",
    amendment:
      "Step 05 becomes OCR-assisted intake (05a–05f): scan → auto-extract line items with per-item confidence → operator accepts/corrects → capture declared (OCR) vs physical (received) → commit. The variance feeds reconciliation → CDR.",
    steps: [
      { ref: "01–04", label: "Handover, pouch opening", href: null, module: "M01", note: "Flight board not yet built (P1-1)" },
      { ref: "05", label: "Document verification", href: null, module: "M02", note: "OCR intake workbench is P1-3" },
      { ref: "06", label: "AWB summary preparation", href: "/awb/1?tab=intake", module: "M03" },
      { ref: "07–08", label: "Manifest reconciliation → discrepancy?", href: "/cmts-absorption/manifest-reconciliation", module: "M03" },
      { ref: "09", label: "Indexation & classification", href: "/awb/1", module: "M03" },
      { ref: "10", label: "Piece-level tagging (barcode / RFID)", href: "/lifter-operator/rfid-scan", module: "M05" },
      { ref: "11–12", label: "Split identification, segregation", href: "/cmts-absorption/awb-consolidation", module: "M03" },
      { ref: "13–14", label: "Acceptance, weighing & condition check", href: "/cmts-absorption/cargo-acceptance", module: "M04" },
      { ref: "15–16", label: "Storage allocation, data capture", href: "/warehouse-manager/putaway", module: "M05" },
      { ref: "17", label: "IATA messaging (ARR / RCF / NFD)", href: "/excise-compliance/customs-messaging", module: "M07" },
      { ref: "18", label: "Notice of Arrival to consignee / CHA", href: "/consignee/notice-of-arrival", module: "M08" },
      { ref: "19", label: "Customs clearance tracking", href: "/excise-compliance/customs-queue", module: "M09" },
      { ref: "20–21", label: "Charges calculation, invoice", href: "/awb/1?tab=charges", module: "M10" },
      { ref: "—", label: "Godown rent voucher", href: "/cmts-absorption/godown-rent-history", module: "M11" },
      { ref: "22", label: "Delivery Order", href: "/cha/do-collection", module: "M12", note: "Issuance screen is P5-7" },
      { ref: "23", label: "Gate pass", href: "/gate-entry/live-vehicle-board", module: "M13", note: "Generation screen is P6-1" },
      { ref: "24", label: "Physical delivery / dispatch", href: "/gate-entry/vehicle-exit", module: "M13" },
      { ref: "25–26", label: "POD capture, DLV message", href: "/consignee/pod-history", module: "M14", note: "Capture screen is P6-4" },
      { ref: "27", label: "AWB closure / file archive", href: "/awb/6?tab=audit", module: "M20" },
    ],
  },
  {
    id: "FC-03",
    title: "Cargo Classification & Storage Allocation",
    subtitle: "How cargo is routed to the correct storage zone by handling code",
    docNo: "SAPS-ACMS-FC-03-02",
    rev: "Rev 2.0",
    amendment:
      "Allocation is system-driven: the system suggests rack/bin by class + subclass + capacity using CARGOSUBCLASSLOCATION rules, validates availability, offers overflow, then binds the RFID tag to the location with putaway confirmed by scan.",
    steps: [
      { ref: "—", label: "Cargo classified by handling code", href: "/awb/1", module: "M03" },
      { ref: "—", label: "Class / subclass set at intake", href: "/awb/1?tab=intake", module: "M03" },
      { ref: "—", label: "System suggests rack / bin", href: "/warehouse-manager/putaway", module: "M05", note: "Rules engine is P2-1/P2-2" },
      { ref: "—", label: "Location valid & available?", href: "/warehouse-manager/storage-map", module: "M05" },
      { ref: "—", label: "Bind RFID tag → location; confirm by scan", href: "/lifter-operator/rfid-scan", module: "M05", note: "Binding is P2-4" },
      { ref: "A", label: "General / Normal zones (GCR, AFU, ICG, UAB)", href: "/warehouse-manager/storage-map", module: "M05" },
      { ref: "B", label: "Special handling (DGR, PER, VAL, AVI, HUM, AOG, DIP, VUN)", href: "/warehouse-manager/cold-chain", module: "M05" },
      { ref: "C", label: "Controlled / exception zones", href: "/warehouse-manager/exceptions-queue", module: "M06" },
    ],
  },
  {
    id: "FC-04",
    title: "CDR / Discrepancy Handling Flow",
    subtitle: "Identification through evidence capture to final action",
    docNo: "SAPS-ACMS-FC-04-02",
    rev: "Rev 2.0",
    amendment:
      "CDR is variance-driven: declared-vs-physical variance ≥ tolerance auto-raises it. Evidence is a digital pack (scan/photos, RFID/AWB-linked, timestamped) rather than remarks-only. CDR numbering continues the CMTS sequence.",
    steps: [
      { ref: "—", label: "Variance flagged at intake / acceptance", href: "/awb/20?tab=intake", module: "M04" },
      { ref: "01", label: "Discrepancy identified", href: "/exceptions/cdr", module: "M06", note: "Auto-raised when variance ≥ tolerance — no operator required" },
      { ref: "02", label: "Type selected (9 types)", href: "/exceptions/cdr", module: "M06" },
      { ref: "03", label: "Capture evidence (6 items)", href: "/exceptions/cdr", module: "M06", note: "Digital pack, RFID/AWB-linked" },
      { ref: "03a", label: "Damage recorded (DamageDetail)", href: "/exceptions/damage", module: "M06", note: "Not every damage finding escalates to a CDR" },
      { ref: "04–05", label: "Create CDR, assign reference", href: "/exceptions/cdr", module: "M06" },
      { ref: "06–08", label: "Notify airline / customs, send DIS", href: "/excise-compliance/customs-messaging", module: "M07" },
      { ref: "09", label: "Move to discrepancy / quarantine hold", href: "/exceptions/holds", module: "M05" },
      { ref: "10–11", label: "Instruction received? → final action (5 options)", href: "/exceptions/cdr", module: "M06", note: "F3 → FC-10-A, F4 → FC-10-B" },
      { ref: "12", label: "Close CDR", href: "/exceptions/cdr", module: "M06" },
    ],
  },
  {
    id: "FC-06",
    title: "Pakistan Customs Clearance Flow",
    subtitle: "NOA through risk channel and duty to out-of-charge",
    docNo: "SAPS-ACMS-FC-06-02",
    rev: "Rev 2.0",
    amendment:
      "PSW (Pakistan Single Window) is primary, WeBOC legacy/parallel-run — build behind a provider-abstracted customs gateway. Single Declaration (SD) replaces GD. SD status, risk channel and OOC are fetched electronically. OOC is captured by scanner (OCR) and verified against the SD.",
    steps: [
      { ref: "01", label: "NOA issued to consignee / CHA", href: "/import/arrival-advice", module: "M08" },
      { ref: "02", label: "CHA collects import documents", href: "/import/documents", module: "M02" },
      { ref: "03", label: "SD filed (GD in CMTS terms)", href: "/customs/filing", module: "M09", note: "Filed to both providers during the parallel run" },
      { ref: "03a", label: "Gateway submission — PSW primary / WeBOC parallel", href: "/customs/gateway", module: "M09", note: "BLK-04 — divergence blocks settlement" },
      { ref: "04", label: "Risk channel assigned (fetched, not typed)", href: "/customs/channels", module: "M09" },
      { ref: "05-G", label: "Green — auto-cleared", href: "/customs/channels", module: "M09" },
      { ref: "05-Y", label: "Yellow — document scrutiny → query loop", href: "/customs/channels", module: "M09" },
      { ref: "05-R", label: "Red — physical examination → sampling", href: "/customs/channels", module: "M09", note: "BLK-03 — FC-06 calls this edge \"Normal\"" },
      { ref: "05-R1", label: "Examination discrepancy → cargo detained", href: "/customs/detained", module: "M09", note: "Gap G1 — the sub-identity carries across 12 tables" },
      { ref: "06", label: "Duty / sales tax / FED / WHT assessed and paid", href: "/customs/channels", module: "M09" },
      { ref: "07", label: "ANF / ASF clearance", href: "/customs/channels", module: "M09" },
      { ref: "08", label: "OOC issued, OCR-captured, verified vs SD", href: "/customs/channels", module: "M09" },
      { ref: "09", label: "Eligible for release → FC-07 charging", href: "/customs/channels", module: "M10" },
    ],
  },
  {
    id: "FC-07",
    title: "Charges, Invoice, Waiver & DO Release",
    subtitle: "Charge calculation, tariff application, adjustments and DO issuance",
    docNo: "SAPS-ACMS-FC-07-02",
    rev: "Rev 2.0",
    amendment:
      "Charges auto-computed from a versioned Tariff Master. Payment is cash-less via gateway, auto-reconciled. Waiver runs role-based multi-level approval + audit → credit note. DO release is auto-gated on the five conditions.",
    steps: [
      { ref: "01", label: "Cargo arrival time recorded", href: "/awb/1", module: "M04" },
      { ref: "02–03", label: "Free period calculated, storage clock starts", href: "/awb/1?tab=charges", module: "M10" },
      { ref: "04–06", label: "Actual → volumetric (L×W×H/6000) → chargeable = max()", href: "/awb/3?tab=charges", module: "M10" },
      { ref: "07", label: "Category surcharge applied", href: "/awb/3?tab=charges", module: "M10" },
      { ref: "08", label: "Tariff slab applied (D1-3 / D4-7 / D8-14 / D15+)", href: "/awb/3?tab=charges", module: "M10" },
      { ref: "09", label: "Invoice / tax invoice generated", href: "/finance-manager/invoice-generation", module: "M11" },
      { ref: "10–12", label: "Waiver? → approval workflow → credit note", href: "/finance-manager/waiver-workflow", module: "M11" },
      { ref: "13", label: "Payment received", href: "/finance-manager/payment-reconciliation", module: "M11" },
      { ref: "—", label: "Godown rent verification — 5 conditions", href: "/awb/3?tab=customs", module: "M12" },
      { ref: "—", label: "G.Rent voucher issued", href: "/cmts-absorption/godown-rent-history", module: "M11" },
    ],
  },
  {
    id: "FC-08",
    title: "Gate Pass, POD & AWB Closure",
    subtitle: "Physical delivery verification, POD capture and file closure",
    docNo: "SAPS-ACMS-FC-08-02",
    rev: "Rev 2.0",
    amendment:
      "RFID/scan-verified end to end: the tag bound at putaway is read at retrieval and gate-out, where it is matched to the gate pass + DO with an automatic re-check of OOC, DO charges and no-hold. POD is digital — e-signature + CNIC scan + geo/timestamp + photo.",
    steps: [
      { ref: "01", label: "Consignee / agent presents DO", href: "/cha/do-collection", module: "M12" },
      { ref: "03", label: "Verify receiver identity / CNIC", href: "/gate-entry/driver-identity-register", module: "M13" },
      { ref: "04", label: "Verify authority letter", href: "/gate-entry/authority-letter-digitisation", module: "M13" },
      { ref: "06", label: "Generate gate pass", href: "/awb/2?tab=dispatch", module: "M13", note: "Generation screen is P6-1" },
      { ref: "07–08", label: "Picking request, retrieval from rack", href: "/warehouse-manager/picking", module: "M13" },
      { ref: "09–10", label: "Piece count & condition verification", href: "/warehouse-manager/picking", module: "M13" },
      { ref: "12–13", label: "Load to vehicle, security / gate verification", href: "/gate-entry/vehicle-exit", module: "M13" },
      { ref: "14", label: "POD captured (signature, CNIC, pieces, photo, timestamp)", href: "/awb/2?tab=dispatch", module: "M14" },
      { ref: "15–16", label: "DLV sent, AWB marked delivered", href: "/awb/2?tab=messaging", module: "M07" },
      { ref: "17–19", label: "Finance reconciled, documents archived, file closed", href: "/awb/6?tab=audit", module: "M20" },
    ],
  },
  {
    id: "FC-09",
    title: "Transhipment Cargo Bonded Transfer",
    subtitle: "Transit cargo under customs bond awaiting onward carriage",
    docNo: "SAPS-ACMS-FC-09",
    rev: "Rev 1.0",
    amendment:
      "RFID-tracked bonded zone with digital customs-bond supervision. If the onward leg goes to another SAPS site, an inter-station ownership handoff moves the owning site via HQ with bond continuity preserved.",
    steps: [
      { ref: "01–02", label: "Received from flight, identified as transhipment", href: "/awb/24", module: "M15" },
      { ref: "03", label: "Indexed in AirVault", href: "/awb/24", module: "M03" },
      { ref: "04", label: "Stored in bonded transhipment zone", href: null, module: "M15", note: "Module does not exist — P8-1" },
      { ref: "05", label: "RCT message sent", href: "/awb/24?tab=messaging", module: "M07" },
      { ref: "06–07", label: "Transhipment permit (PSW), bond supervision", href: null, module: "M15", note: "P8-1" },
      { ref: "08–09", label: "Await connecting flight; storage charges on over-dwell", href: null, module: "M15", note: "P8-1" },
      { ref: "10", label: "Re-tender to onward carrier", href: null, module: "M15", note: "P8-1" },
      { ref: "—", label: "Onward leg to another SAPS site? → ownership handoff", href: null, module: "M15", note: "P8-2" },
      { ref: "11–13", label: "TFD, DEP, file closed", href: null, module: "M15", note: "P8-1" },
    ],
  },
  {
    id: "FC-10",
    title: "Exception Cargo Flow",
    subtitle: "Mishandled, re-export and long-stay / abandoned cargo",
    docNo: "SAPS-ACMS-FC-10-02",
    rev: "Rev 2.0",
    amendment:
      "Aging-driven: the dwell clock auto-fires the long-stay alert and drives the Section 82 statutory timeline, with notices scheduled automatically. Exception holds are RFID-tracked and surfaced on an aging dashboard.",
    steps: [
      { ref: "A1–A2", label: "Misrouted → exception hold", href: "/exceptions/mishandled", module: "M17" },
      { ref: "A3–A5", label: "Create DIS/CDR, notify airline, recovery instruction", href: "/exceptions/mishandled", module: "M17" },
      { ref: "A6–A8", label: "Recovery action, re-tender, close as forwarded", href: "/exceptions/mishandled", module: "M17", note: "Three recovery options, each with its own field set" },
      { ref: "B1–B3", label: "Cannot clear → re-export hold → request raised", href: "/exceptions/re-export", module: "M16" },
      { ref: "B4–B6", label: "Re-export SD (PSW), permission, charges settled", href: "/exceptions/re-export", module: "M16", note: "PSW-primary — no WeBOC path on this branch" },
      { ref: "B7–B8", label: "Re-tender as export, close import AWB", href: "/exceptions/re-export", module: "M16", note: "Blocked until §B6 settles — the lien depends on the order" },
      { ref: "C1–C2", label: "Not cleared after period → long-stay alert", href: "/exceptions/long-stay", module: "M18", note: "Alert is auto-fired by the FC-07 dwell clock" },
      { ref: "C3–C4", label: "Notify parties, escalate to customs", href: "/exceptions/long-stay", module: "M18" },
      { ref: "C5–C7", label: "Section 82 → release / auction / disposal → closed", href: "/exceptions/long-stay", module: "M18" },
      { ref: "aging", label: "Cross-branch aging dashboard", href: "/exceptions/queue", module: "M18", note: "The FC-10 amendment's unified exception queue — six kinds, six thresholds" },
    ],
  },
];

export function flow(id: string): FlowDef | undefined {
  return FLOWS.find((f) => f.id === id);
}
