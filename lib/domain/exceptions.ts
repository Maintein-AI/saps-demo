/**
 * AirVault domain — CDR, holds, and the three FC-10 exception branches.
 *
 * CMTS sources:
 *   `DamageDetail` (8)
 *   `HOLDINGSTATUS` (29)   — note the seven release-side columns
 *   `AWBSECTION82` (22)
 *   `AWBTRANSFER` (25)     — carries mishandled/re-export in CMTS
 *   `Section82Days` (2)
 */

import type { Amount, DocNumberRef, DomainRecord, SiteCode, Variance } from "./common";

/* ================================================================== *
 * CDR — FC-04
 * ================================================================== */

/** FC-04 §02 — the nine discrepancy types, verbatim from the flow. */
export type DiscrepancyType =
  | "shortage"
  | "overage"
  | "damage"
  | "leakage-wet"
  | "tampering"
  | "pilferage"
  | "missing-documents"
  | "wrong-weight"
  | "misrouted";

export const DISCREPANCY_LABEL: Record<DiscrepancyType, string> = {
  shortage: "Shortage",
  overage: "Overage",
  damage: "Damage",
  "leakage-wet": "Leakage / Wet Cargo",
  tampering: "Tampering",
  pilferage: "Pilferage",
  "missing-documents": "Missing Documents",
  "wrong-weight": "Wrong Weight",
  misrouted: "Misrouted Cargo",
};

/** These three fall straight out of FC-01/02 variance per the FC-04 amendment. */
export const VARIANCE_DERIVED_TYPES: DiscrepancyType[] = ["shortage", "overage", "wrong-weight"];

/** FC-04 §03 — the six evidence items. */
export type EvidenceKind =
  | "photo"
  | "weight"
  | "piece-count"
  | "package-condition"
  | "seal-condition"
  | "remarks";

export const EVIDENCE_LABEL: Record<EvidenceKind, string> = {
  photo: "Photos",
  weight: "Weight",
  "piece-count": "Piece count",
  "package-condition": "Package condition",
  "seal-condition": "Seal condition",
  remarks: "Remarks",
};

/**
 * FC-04 amendment — "Evidence pack captured digitally: scan / photos,
 * RFID/AWB-linked, timestamped, attached to the CDR (doc mgmt M02) —
 * vs remarks-only in CMTS."
 */
export interface EvidenceItem {
  id: number;
  kind: EvidenceKind;
  /** Free text, a measurement, or a document reference depending on kind. */
  value: string;
  documentId: string | null;
  /** RFID/AWB linkage is what makes the pack defensible. */
  linkedAwbNo: string;
  linkedRfid: string | null;
  capturedAt: string;
  capturedBy: string;
}

/** FC-04 §11 — the five final actions. */
export type CdrFinalAction =
  | "F1-release-after-correction"
  | "F2-adjust-pieces-weight"
  | "F3-forward-mishandled"
  | "F4-re-export"
  | "F5-claim-liability";

export const CDR_FINAL_ACTION_LABEL: Record<CdrFinalAction, string> = {
  "F1-release-after-correction": "F1. Release after correction",
  "F2-adjust-pieces-weight": "F2. Adjust pieces / weight",
  "F3-forward-mishandled": "F3. Forward as mishandled (FC-10-A)",
  "F4-re-export": "F4. Re-export (FC-10-B)",
  "F5-claim-liability": "F5. Claim / liability process",
};

export type CdrStatus =
  | "draft"
  | "evidence"
  | "notified"
  | "on-hold"
  | "awaiting-instruction"
  | "action-selected"
  | "closed";

export interface CDR extends DomainRecord {
  id: number;
  /** FC-04 §05 — reference number continuing the CMTS sequence. */
  cdrRef: string;
  docNumber: DocNumberRef;
  awbId: number;
  IGMNO: string;
  AWBNO: string;
  HWBNO: string | null;

  type: DiscrepancyType;
  /** True when the FC-04 amendment's variance rule raised this automatically. */
  autoRaised: boolean;
  variance: Variance | null;

  raisedAt: string;
  raisedBy: string;
  status: CdrStatus;

  evidence: EvidenceItem[];

  /** FC-04 §06–08 */
  airlineNotifiedAt: string | null;
  customsNotifiedAt: string | null;
  disMessageSentAt: string | null;

  /** FC-04 §09 — quarantine hold zone. */
  holdLocationId: number | null;
  /** FC-04 §10 — instruction loop; increments each time it returns to hold. */
  escalationCount: number;
  instructionReceivedAt: string | null;
  instructionText: string | null;

  finalAction: CdrFinalAction | null;
  closedAt: string | null;
  site: SiteCode;
}

/* ================================================================== *
 * Damage — CMTS `DamageDetail` (8)
 * ================================================================== */

export interface DamageDetail {
  DamageId: number;
  AWBId: number;
  HWBId: number | null;
  TypeofPack: string;
  TypeofDamage: string;
  DamagedPcs: number;
  DamageWeight: number;
  Remarks: string | null;
  /** AirVault addition — link back to the CDR that recorded it. */
  cdrRef: string | null;
  photos: string[];
}

export const PACK_TYPES = ["Carton", "Wooden Crate", "Pallet", "Drum", "Bag", "Loose", "ULD"] as const;
export const DAMAGE_TYPES = [
  "Crushed",
  "Torn",
  "Punctured",
  "Wet",
  "Leaking",
  "Seal broken",
  "Contents exposed",
  "Temperature excursion",
] as const;

/* ================================================================== *
 * Holds — CMTS `HOLDINGSTATUS` (29), both sides fully attributed
 * ================================================================== */

export type HoldType = "customs" | "cdr-osd" | "discrepancy" | "security" | "payment";

export const HOLD_TYPE_LABEL: Record<HoldType, string> = {
  customs: "Customs hold",
  "cdr-osd": "CDR / OSD hold",
  discrepancy: "Discrepancy",
  security: "Security",
  payment: "Payment",
};

export interface HoldRecord extends DomainRecord {
  SEQUENCE: number;
  AWBNo: string;
  IGMNO: string;
  HWBNo: string | null;
  CARGOCLASSID: number;
  STATUS: string;
  type: HoldType;

  // Hold side
  HeldBy: string;
  NameOfPerson: string;
  NIC: string;
  HoldingCompany: string;
  Designation: string;
  Date: string;
  REMARKS: string;

  // Release side — the seven CMTS release columns
  Release: boolean;
  ReleasePersonName: string | null;
  ReleaseCompany: string | null;
  ReleaseBy: string | null;
  ReleasePersonDesignation: string | null;
  ReleasePersonNic: string | null;
  ReleaseRemarks: string | null;
  ReleaseDateTime: string | null;

  site: SiteCode;
}

export function isHoldLive(h: HoldRecord): boolean {
  return !h.Release && !h.IsDeleted;
}

/* ================================================================== *
 * FC-10-A — Mishandled / misrouted. No dedicated CMTS table.
 * ================================================================== */

export type MishandledStage =
  | "A1-identified"
  | "A2-exception-hold"
  | "A3-cdr-raised"
  | "A4-airline-notified"
  | "A5-instruction-received"
  | "A6-recovery-selected"
  | "A7-re-tendered"
  | "A8-closed";

export const MISHANDLED_STAGE_LABEL: Record<MishandledStage, string> = {
  "A1-identified": "A1. Wrong destination / misrouted / offloaded in error",
  "A2-exception-hold": "A2. Move to exception hold",
  "A3-cdr-raised": "A3. Create DIS / CDR",
  "A4-airline-notified": "A4. Notify airline",
  "A5-instruction-received": "A5. Airline issues recovery instruction",
  "A6-recovery-selected": "A6. Recovery action by customs",
  "A7-re-tendered": "A7. Re-tender to outbound carrier",
  "A8-closed": "A8. Close as mishandled-forwarded",
};

/** FC-10-A's three recovery options, each with its own required fields. */
export type RecoveryAction = "forward-correct-destination" | "reroute-original-awb" | "corrective-awb";

export const RECOVERY_ACTION_LABEL: Record<RecoveryAction, string> = {
  "forward-correct-destination": "Forward to correct destination",
  "reroute-original-awb": "Re-route under original AWB",
  "corrective-awb": "Corrective AWB / endorsement",
};

export interface MishandledCase extends DomainRecord {
  id: number;
  awbId: number;
  AWBNO: string;
  IGMNO: string;
  stage: MishandledStage;
  cdrRef: string | null;
  identifiedAt: string;
  holdLocationId: number | null;

  airlineNotifiedAt: string | null;
  instructionRef: string | null;
  instructionAt: string | null;
  instructionText: string | null;

  recoveryAction: RecoveryAction | null;
  correctiveAwbNo: string | null;
  endorsementRef: string | null;
  onwardRouting: string | null;

  reTenderedAt: string | null;
  reTenderCarrier: string | null;
  closedAt: string | null;
  /** Days in exception hold — drives the aging dashboard. */
  ageDays: number;
  site: SiteCode;
}

/* ================================================================== *
 * FC-10-B — Re-export
 * ================================================================== */

export type ReExportStage =
  | "B1-cannot-clear"
  | "B2-re-export-hold"
  | "B3-request-raised"
  | "B4-sd-lodged"
  | "B5-permission-granted"
  | "B6-charges-settled"
  | "B7-re-tendered"
  | "B8-closed";

export const REEXPORT_STAGE_LABEL: Record<ReExportStage, string> = {
  "B1-cannot-clear": "B1. Cannot be cleared / consignee refuses / customs rejects",
  "B2-re-export-hold": "B2. Move to re-export hold",
  "B3-request-raised": "B3. Re-export request raised",
  "B4-sd-lodged": "B4. Re-export SD lodged in PSW",
  "B5-permission-granted": "B5. Customs permission granted",
  "B6-charges-settled": "B6. Charges / demurrage settled",
  "B7-re-tendered": "B7. Re-tender as export",
  "B8-closed": "B8. Close import AWB as re-exported",
};

export type ReExportCause = "cannot-clear" | "consignee-refused" | "customs-rejected";

export interface ReExportCase extends DomainRecord {
  id: number;
  awbId: number;
  AWBNO: string;
  IGMNO: string;
  stage: ReExportStage;
  cause: ReExportCause;
  raisedAt: string;
  holdLocationId: number | null;

  /** PSW-primary per the FC-10-B amendment — no WeBOC path. */
  sdRef: string | null;
  sdLodgedAt: string | null;
  permissionRef: string | null;
  permissionGrantedAt: string | null;

  outstandingCharges: Amount;
  chargesSettledAt: string | null;

  reTenderedAt: string | null;
  exportAwbNo: string | null;
  closedAt: string | null;
  ageDays: number;
  site: SiteCode;
}

/* ================================================================== *
 * FC-10-C — Long-stay / Section 82. CMTS `AWBSECTION82` (22)
 * ================================================================== */

export type LongStayStage =
  | "C1-not-cleared"
  | "C2-alert-triggered"
  | "C3-parties-notified"
  | "C4-escalated-customs"
  | "C5-section-82"
  | "C6-disposition-recorded"
  | "C7-closed";

export const LONGSTAY_STAGE_LABEL: Record<LongStayStage, string> = {
  "C1-not-cleared": "C1. Not cleared after allowed period",
  "C2-alert-triggered": "C2. Long-stay alert triggered",
  "C3-parties-notified": "C3. Notify consignee / CHA / airline",
  "C4-escalated-customs": "C4. Escalate to customs",
  "C5-section-82": "C5. Section 82",
  "C6-disposition-recorded": "C6. Final disposition recorded",
  "C7-closed": "C7. File closed",
};

/** FC-10-C's three dispositions. */
export type Disposition = "release-after-clearance" | "auction" | "disposal-destruction";

export const DISPOSITION_LABEL: Record<Disposition, string> = {
  "release-after-clearance": "Release after clearance",
  auction: "Auction",
  "disposal-destruction": "Disposal / destruction",
};

/** FC-10 amendment — "notices to consignee / CHA / airline scheduled automatically". */
export interface StatutoryNotice {
  id: number;
  noticeNo: string;
  docNumber: DocNumberRef;
  /** Days before the statutory deadline this notice is due. */
  dueOffsetDays: number;
  dueAt: string;
  recipients: Array<"consignee" | "cha" | "airline">;
  sentAt: string | null;
  status: "scheduled" | "sent" | "overdue";
}

export interface LongStayCase extends DomainRecord {
  id: number;
  awbId: number;
  AWBNO: string;
  IGMNO: string;
  HWBNo: string | null;
  stage: LongStayStage;

  arrivedAt: string;
  /** From Section82Days — configurable per site pending BLK-07. */
  section82Days: number;
  ageDays: number;
  daysToDeadline: number;

  notices: StatutoryNotice[];
  escalatedToCustomsAt: string | null;

  // CMTS `AWBSECTION82` specifics
  Examiner: string | null;
  ReceivingPerson: string | null;
  DCNumber: string | null;
  Sequences: string | null;
  SubIndex: string | null;
  Lock: boolean;

  disposition: Disposition | null;
  /** Auction specifics. */
  auctionLotNo: string | null;
  auctionReserve: Amount | null;
  auctionDate: string | null;
  auctionProceeds: Amount | null;
  /** Disposal specifics. */
  disposalMethod: string | null;
  disposalAuthorisedBy: string | null;
  disposalCertificateNo: string | null;

  closedAt: string | null;
  site: SiteCode;
}

/* ================================================================== *
 * Unified exception queue — FC-10 amendment asks for one aging
 * dashboard across all hold states, not just long-stay.
 * ================================================================== */

export type ExceptionKind = "cdr" | "hold" | "mishandled" | "re-export" | "long-stay" | "detend";

export interface ExceptionQueueRow {
  kind: ExceptionKind;
  ref: string;
  awbId: number;
  AWBNO: string;
  summary: string;
  ageDays: number;
  /** Escalation threshold in days for this kind. */
  thresholdDays: number;
  overThreshold: boolean;
  locationId: number | null;
  site: SiteCode;
  href: string;
}

export const EXCEPTION_THRESHOLD_DAYS: Record<ExceptionKind, number> = {
  cdr: 3,
  hold: 7,
  mishandled: 5,
  "re-export": 14,
  "long-stay": 30,
  detend: 10,
};
