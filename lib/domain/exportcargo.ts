/**
 * AirVault domain — export cargo (FC-11). **M16-adjacent, largely greenfield.**
 *
 * CMTS sources — the only export tables that exist:
 *   `CARGOACCEPTANCE`    (31)  acceptance header — all 31 columns
 *   `CARGOACCEPTANCEHWB` (7)   house breakdown at acceptance
 *   `ACCEPTENCEDETAIL`   (10)  per-line nature/pcs/weight/dimensions
 *   `ExportGodownrent`   (53)  export-side godown rent
 *
 * Everything else FC-11 needs has **no legacy field to inherit**: security
 * screening, chain of custody, ULD build verification against a PFM, the
 * discrepancy note, and the PSW export declaration. The build plan flags
 * this as the highest design-risk area for exactly that reason — here the
 * flow *is* the specification, so this module is a proposal, not a
 * transcription.
 *
 * Two tickets are deliberately absent:
 *   • P9-1 export revenue (`INTERNATIONALCARGO`, SAPS revenue share) — BLK-02
 *   • P9-6 airmail / postal (`AIRMAILDELIVERYBILL` et al.)         — BLK-01
 * Both are parked pending SAPS flow confirmation and are not modelled here.
 */

import type { Amount, DocNumberRef, DomainRecord, FormValue, SiteCode } from "./common";

/* ================================================================== *
 * FC-11 stages
 * ================================================================== */

export type ExportStage =
  | "E01-booked"
  | "E02-accepted"
  | "E03-docs-captured"
  | "E04-weighed"
  | "E05-customs-checked"
  | "E06-screened"
  | "E07-classified"
  | "E08-warehoused"
  | "E09-built-up"
  | "E10-messages-sent"
  | "E11-handed-to-ramp"
  | "E12-onboarded"
  | "E13-closed";

export const EXPORT_STAGE_LABEL: Record<ExportStage, string> = {
  "E01-booked": "E01. Booking received from airline",
  "E02-accepted": "E02. Cargo accepted at the export counter",
  "E03-docs-captured": "E03. Export documents captured (OCR)",
  "E04-weighed": "E04. Weighed — gross / tare / net",
  "E05-customs-checked": "E05. Customs / ANF check",
  "E06-screened": "E06. Security screening",
  "E07-classified": "E07. Classified — special cargo?",
  "E08-warehoused": "E08. Warehoused pending build-up",
  "E09-built-up": "E09. Built up per PFM / load plan",
  "E10-messages-sent": "E10. FFM / FWB / FHL transmitted",
  "E11-handed-to-ramp": "E11. Handed to ramp",
  "E12-onboarded": "E12. Onboarded",
  "E13-closed": "E13. Export invoice raised, file closed",
};

export const EXPORT_STAGE_ORDER: ExportStage[] = [
  "E01-booked", "E02-accepted", "E03-docs-captured", "E04-weighed",
  "E05-customs-checked", "E06-screened", "E07-classified", "E08-warehoused",
  "E09-built-up", "E10-messages-sent", "E11-handed-to-ramp", "E12-onboarded", "E13-closed",
];

/* ================================================================== *
 * Acceptance — CMTS `CARGOACCEPTANCE` (all 31 columns)
 * ================================================================== */

export interface CargoAcceptance {
  CARGODATE: string;
  CARGOID: number;
  REVENUECODE: string;
  CARGOGROUP: string;
  CARGOTYPE: string;
  PAYMENT: string;
  AWBCODE: string;
  BAGNO: string | null;
  LOADEDWEIGHT: number;
  UNLOADEDWEIGHT: number;
  TIMEOFWEIGHMENT: string;
  TIMEOFACCEPTENCE: string;
  VEHICALNO: string;
  AGENTNAME: string;
  CARGOAGENTNAME: string;
  DESTINATION: string;
  ORIGIN: string;
  SHIPPERNAME: string;
  SHIPPERADDRESS: string;
  SHIPPERPHONENO: string;
  CONSIGNEENAME: string;
  CONSIGNEEADDRESS: string;
  CONSIGNEEPHONENO: string;
  REMARKS: string | null;
  STATUS: string;
  PCSAWB: number;
  WEIGHTAWB: number;
  DISCREPANCY: string | null;
  LEASHINGWEIGHT: number;
  PALLETWEIGHT: number;
  AIRLINEABB: string;
}

/** CMTS `ACCEPTENCEDETAIL` (10) */
export interface AcceptanceLine {
  CARGODATE: string;
  CARGOID: number;
  SEQUENCE: number;
  NATUREOFGOODS: string;
  PCS: number;
  WEIGHT: number;
  WIDTH: number;
  HEIGHT: number;
  LENGTH: number;
  UNIT: string;
}

/* ================================================================== *
 * Weighment — the FC-11 amendment's scale integration
 *
 * CMTS has LOADEDWEIGHT / UNLOADEDWEIGHT / LEASHINGWEIGHT / PALLETWEIGHT
 * but nothing that says where the numbers came from. The amendment makes
 * them auto-captured, which means the reading has a provenance and a
 * tolerance rather than being whatever the operator typed.
 * ================================================================== */

export interface Weighment {
  scaleId: string;
  weighedAt: string;
  weighedBy: string;
  /** Vehicle in, vehicle out — net is the difference. */
  grossKg: number;
  tareKg: number;
  netKg: number;
  /** Pallet and lashing deducted separately, per CMTS. */
  palletKg: number;
  lashingKg: number;
  /** What the shipper declared, for the variance check. */
  declaredKg: number;
  varianceKg: number;
  varianceRatio: number;
  withinTolerance: boolean;
  /** True when the reading came off the scale rather than a keyboard. */
  autoCaptured: boolean;
}

/* ================================================================== *
 * Security screening & chain of custody — no CMTS field at all
 * ================================================================== */

export type ScreeningMethod = "x-ray" | "etd" | "edd" | "physical-search" | "known-consignor";

export const SCREENING_METHOD_LABEL: Record<ScreeningMethod, string> = {
  "x-ray": "X-ray",
  etd: "ETD — explosive trace detection",
  edd: "EDD — explosive detection dog",
  "physical-search": "Physical search",
  "known-consignor": "Known-consignor exemption",
};

export type ScreeningResult = "pass" | "fail" | "re-screen" | "referred";

export interface ScreeningRecord {
  id: number;
  method: ScreeningMethod;
  screenedAt: string;
  /** Attributable to a person, not a shift — this is a regulated record. */
  screenerId: string;
  screenerName: string;
  result: ScreeningResult;
  piecesScreened: number;
  notes: string | null;
  /** Tamper-evident seal applied after a pass. */
  sealNo: string | null;
  sealAppliedAt: string | null;
  /** RFID seal tag, per the amendment. */
  sealRfid: string | null;
}

/** ACC3 / known-consignor status the consignment travels under. */
export type CustodyRegime = "ACC3" | "known-consignor" | "account-consignor" | "unknown";

export interface CustodyEvent {
  id: number;
  at: string;
  fromParty: string;
  toParty: string;
  location: string;
  sealIntact: boolean | null;
  sealNo: string | null;
  signedBy: string;
  note: string | null;
}

/* ================================================================== *
 * ULD build-up against the PFM — FC-11's ULD Build Report
 * ================================================================== */

export interface PfmLine {
  uldNo: string;
  uldType: string;
  /** What the load plan says should go on this ULD. */
  plannedAwbs: string[];
  plannedPieces: number;
  plannedWeightKg: number;
  /** What was actually built. */
  actualAwbs: string[];
  actualPieces: number;
  actualWeightKg: number;
  builtAt: string | null;
  builtBy: string | null;
}

export interface BuildDiscrepancy {
  uldNo: string;
  kind: "missing" | "excess" | "weight-variance";
  awbNo: string | null;
  detail: string;
  pieces: number;
}

/** FC-11 — a build that does not match the PFM raises a Discrepancy Note. */
export function buildDiscrepancies(lines: PfmLine[]): BuildDiscrepancy[] {
  const out: BuildDiscrepancy[] = [];
  for (const l of lines) {
    for (const awb of l.plannedAwbs) {
      if (!l.actualAwbs.includes(awb)) {
        out.push({
          uldNo: l.uldNo,
          kind: "missing",
          awbNo: awb,
          detail: `Planned on ${l.uldNo} but not built.`,
          pieces: 0,
        });
      }
    }
    for (const awb of l.actualAwbs) {
      if (!l.plannedAwbs.includes(awb)) {
        out.push({
          uldNo: l.uldNo,
          kind: "excess",
          awbNo: awb,
          detail: `Built onto ${l.uldNo} but not on the load plan.`,
          pieces: 0,
        });
      }
    }
    if (l.actualPieces !== l.plannedPieces) {
      out.push({
        uldNo: l.uldNo,
        kind: "missing",
        awbNo: null,
        detail: `${l.plannedPieces} planned, ${l.actualPieces} built.`,
        pieces: Math.abs(l.plannedPieces - l.actualPieces),
      });
    }
    const wv = Math.abs(l.actualWeightKg - l.plannedWeightKg);
    if (l.plannedWeightKg > 0 && wv / l.plannedWeightKg > 0.02) {
      out.push({
        uldNo: l.uldNo,
        kind: "weight-variance",
        awbNo: null,
        detail: `${l.plannedWeightKg} kg planned vs ${l.actualWeightKg} kg built (${((wv / l.plannedWeightKg) * 100).toFixed(1)}%).`,
        pieces: 0,
      });
    }
  }
  return out;
}

/* ================================================================== *
 * Export declaration — PSW-primary from day one (FC-11 amendment)
 * ================================================================== */

export interface ExportDeclaration {
  /** Single Declaration — the export counterpart of FC-06's import SD. */
  sdRef: string | null;
  sdLodgedAt: string | null;
  /** Form-E / Electronic Form-E — the FX undertaking. */
  formERef: string | null;
  formEBank: string | null;
  formEValue: Amount;
  formEExpiry: string | null;
  /** PSW EDI acknowledgement. */
  pswAckRef: string | null;
  pswAckAt: string | null;
  clearedAt: string | null;
  /** Populated on rejection. */
  rejectionCode: string | null;
  rejectionText: string | null;
}

/* ================================================================== *
 * The consignment
 * ================================================================== */

export interface ExportConsignment extends DomainRecord {
  id: number;
  awbNo: string;
  stage: ExportStage;

  acceptance: CargoAcceptance;
  lines: AcceptanceLine[];
  /**
   * Export documents are **keyed at the acceptance counter**, not scanned.
   * FC-11 drew this as OCR by analogy with the import side; the import
   * scan point is inbound MAWB/HAWB off the flight pouch, which has no
   * export equivalent — the shipper hands paper across a counter and the
   * clerk types it. See the SCOPE note in `common.ts`.
   */
  capturedDocs: Array<{ label: string; value: FormValue<string>; documentId: string | null }>;

  weighment: Weighment | null;
  screening: ScreeningRecord[];
  custodyRegime: CustodyRegime;
  custodyChain: CustodyEvent[];

  flightNo: string | null;
  scheduledDeparture: string | null;
  pfm: PfmLine[];
  discrepancyNoteNo: string | null;
  discrepancyNote: DocNumberRef | null;

  declaration: ExportDeclaration;

  exportCharges: Amount;
  closedAt: string | null;
  site: SiteCode;
}

/* ================================================================== *
 * Ramp-handover gate — what must be true before E11
 * ================================================================== */

export interface RampCondition {
  code: "screened" | "sealed" | "custody-unbroken" | "declaration-cleared" | "build-matches-pfm";
  label: string;
  pass: boolean;
  detail: string;
}

/**
 * FC-11 §E11 — cargo cannot go airside until it is screened and sealed, the
 * custody chain is unbroken, the export declaration has cleared PSW, and the
 * build matches the load plan. Each is independently regulated; passing four
 * of five is not "nearly ready", it is not ready.
 */
export function evaluateRampHandover(c: ExportConsignment) {
  const lastScreen = c.screening[c.screening.length - 1] ?? null;
  const sealed = c.screening.some((s) => s.result === "pass" && s.sealNo);
  const custodyBroken = c.custodyChain.some((e) => e.sealIntact === false);
  const disc = buildDiscrepancies(c.pfm);

  const conditions: RampCondition[] = [
    {
      code: "screened",
      label: "Security screening passed",
      pass: !!lastScreen && lastScreen.result === "pass",
      detail: !lastScreen
        ? "Not screened"
        : lastScreen.result === "pass"
          ? `${SCREENING_METHOD_LABEL[lastScreen.method]} by ${lastScreen.screenerName}`
          : `Last result: ${lastScreen.result}`,
    },
    {
      code: "sealed",
      label: "Tamper-evident seal applied",
      pass: sealed,
      detail: sealed
        ? `Seal ${c.screening.find((s) => s.sealNo)?.sealNo}`
        : "No seal recorded after screening",
    },
    {
      code: "custody-unbroken",
      label: "Chain of custody unbroken",
      pass: !custodyBroken && c.custodyChain.length > 0,
      detail:
        c.custodyChain.length === 0
          ? "No custody events recorded"
          : custodyBroken
            ? "A handover recorded a broken seal — re-screening required"
            : `${c.custodyChain.length} handovers, seals intact · regime ${c.custodyRegime}`,
    },
    {
      code: "declaration-cleared",
      label: "Export declaration cleared (PSW)",
      pass: c.declaration.clearedAt !== null,
      detail: c.declaration.clearedAt
        ? `${c.declaration.sdRef} cleared`
        : c.declaration.rejectionCode
          ? `Rejected ${c.declaration.rejectionCode} — ${c.declaration.rejectionText ?? ""}`
          : c.declaration.sdLodgedAt
            ? "Lodged, awaiting PSW acknowledgement"
            : "Not lodged",
    },
    {
      code: "build-matches-pfm",
      label: "ULD build matches the load plan",
      pass: c.pfm.length > 0 && disc.length === 0,
      detail:
        c.pfm.length === 0
          ? "Not built up"
          : disc.length === 0
            ? `${c.pfm.length} ULD(s) match the PFM`
            : `${disc.length} discrepancy item(s) — Discrepancy Note required`,
    },
  ];

  return {
    conditions,
    canHandOver: conditions.every((x) => x.pass),
    blockedBy: conditions.filter((x) => !x.pass),
    discrepancies: disc,
  };
}
