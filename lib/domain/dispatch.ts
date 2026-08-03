/**
 * AirVault domain — gate pass, physical delivery, POD and closure.
 *
 * CMTS sources:
 *   `GATEPASS` (43)          the cross-reference hub for release
 *   `PHYSICALDELIVERY` (22)
 *   `DELIVERYINFO` (20)
 *
 * Digital POD is an AirVault addition — CMTS holds POD loosely across
 * `GATEPASS.RcvngPersonPic`, `PHYSICALDELIVERY.DELIVERED` and
 * `AWBDELEIVERYORDER.RECIEVEDBY`.
 */

import type { DocNumberRef, DomainRecord, SiteCode } from "./common";

/* ================================================================== *
 * Gate pass — CMTS `GATEPASS` (43), all columns
 * ================================================================== */

export interface GatePass extends DomainRecord {
  GATEPASSNO: number;
  docNumber: DocNumberRef;
  GATEPASSDATE: string;

  // Cross-references — CMTS pairs each document with its date
  IGMNO: string;
  IGMNODate: string;
  AWBNO: string;
  AWBNODate: string;
  HWBNO: string | null;
  HWBNODate: string | null;
  DONo: string;
  DoDate: string;
  GRNo: string;
  GRDate: string;
  BDNo: string | null;
  BDDate: string | null;
  CASHNO: string | null;
  CASHNODate: string | null;
  ChallanNo: string | null;

  ARRIVALDATE: string;
  INDEXNO: number | null;
  PIECES: number;
  WEIGHT: number;
  CARGOCLASSID: number;

  CONSIGNEE: string;
  Agent: string | null;
  RecivingPerson: string;
  NICNO: string;
  /** CMTS `CPNO` — customs pass number. */
  CPNO: string | null;
  RcvngPersonPic: string | null;

  VehicleNo: string;
  ClearingTime: string | null;
  MarksNumber: string | null;
  DeliveryDate: string | null;
  NAMEOFCUSTODIANSHED: string;

  SerialNo: number;
  SerialNoWithYear: string;
  DetendIdentification: string | null;
  site: SiteCode;

  // ---- AirVault additions (FC-08 amendment) ----
  /** Scannable code read at gate-out. */
  scanCode: string;
  status: "issued" | "picking" | "loaded" | "exited" | "cancelled";
}

/* ================================================================== *
 * Picking & retrieval — FC-08 §07–10
 * ================================================================== */

export type PickOutcome = "pending" | "retrieved" | "unavailable" | "short" | "damaged";

export interface PickLine {
  id: number;
  gatePassNo: number;
  awbId: number;
  pieceId: string;
  /** Where the pick list says to go — physical location. */
  locationId: number;
  expectedRfid: string | null;
  scannedRfid: string | null;
  outcome: PickOutcome;
  scannedAt: string | null;
  scannedBy: string | null;
  note: string | null;
}

export interface PickSession {
  gatePassNo: number;
  awbId: number;
  startedAt: string;
  completedAt: string | null;
  lines: PickLine[];
  expectedPieces: number;
  scannedPieces: number;
  /** FC-08 "Piece Count Matched?" */
  countMatched: boolean;
  /** Set when a line came back unavailable — routes to CDR. */
  cdrRef: string | null;
}

/* ================================================================== *
 * Physical delivery — CMTS `PHYSICALDELIVERY` (22) + `DELIVERYINFO` (20)
 * ================================================================== */

export interface PhysicalDelivery extends DomainRecord {
  PHYSICALDELIVERYID: number;
  VOUCHERNO: string;
  DELIVERYDATE: string;
  IGMNO: string;
  AWBNO: string;
  HWBNO: string | null;
  CASHNO: string | null;
  BLNO: string | null;
  BECASHNO: string | null;
  DATE: string;
  TIME: string;
  DELIVERED: boolean;
  classId: number;
  DFLAG: string | null;
  DetendIdentification: string | null;
  site: SiteCode;
}

export interface DeliveryInfo {
  DevId: number;
  AWBId: number;
  AWBNO: string;
  IGMNO: string;
  HWBNO: string | null;
  CargoClassId: number;
  DetendUniqueIdentification: string | null;
  CityId: number;

  ConsigneeName: string;
  ConsigneeAdd: string;
  ConsgneePhone: string;
  ConsigneeEid: string;
  ShipName: string;
  ShipAdd: string;
  ShipPhone: string;
  ShipEid: string;
  AgentName: string | null;
  AgentAdd: string | null;
  AgentPhone: string | null;
  AgentEid: string | null;
}

/* ================================================================== *
 * Gate-out verification — FC-08 §13 + amendment node 168:3591
 *
 * "Gate-out matches the tag to the gate pass + DO and auto-checks OOC,
 *  DO charges paid & no-hold (FC-07 gate)."
 *
 * This is the second evaluation of the release gate, at the physical
 * boundary — a pass printed this morning does not prove the cargo is
 * still releasable this afternoon.
 * ================================================================== */

export interface GateOutCheck {
  gatePassNo: number;
  checkedAt: string;
  checkedBy: string;
  /** Tags read on the vehicle. */
  scannedTags: string[];
  expectedTags: string[];
  tagsMatched: boolean;
  extraTags: string[];
  missingTags: string[];
  /** Re-evaluation of the FC-07 five conditions at exit. */
  releaseStillValid: boolean;
  newlyFailedConditions: string[];
  outcome: "cleared" | "blocked";
  blockReason: string | null;
}

/* ================================================================== *
 * Digital POD — FC-08 §14 + amendment node 168:3594
 *
 * The flow's five evidence items, plus geo which the amendment adds.
 * ================================================================== */

export interface ProofOfDelivery {
  id: number;
  awbId: number;
  AWBNO: string;
  gatePassNo: number;
  capturedAt: string;
  capturedBy: string;

  /** FC-08 §14 evidence items. */
  receiverSignature: string | null;
  receiverName: string;
  /** CNIC scanned and OCR-matched against the DO's named receiver. */
  receiverCnic: string | null;
  cnicMatchesDo: boolean;
  piecesDelivered: number;
  piecesOnDo: number;
  photos: string[];
  timestamp: string;
  /** AirVault addition — geo capture. */
  geo: { lat: number; lng: number; accuracyM: number } | null;

  /** FC-08 "POD Complete?" — all five items plus geo. */
  complete: boolean;
  /** Partial delivery where fewer pieces were handed over than the DO covers. */
  partial: boolean;
  /** DLV dispatched on completion. */
  dlvSentAt: string | null;
  site: SiteCode;
}

export function podComplete(p: Omit<ProofOfDelivery, "complete">): boolean {
  return (
    !!p.receiverSignature &&
    !!p.receiverCnic &&
    p.piecesDelivered > 0 &&
    p.photos.length > 0 &&
    !!p.timestamp
  );
}

/* ================================================================== *
 * Closure — FC-08 §15–19 / FC-01 §27
 * ================================================================== */

export interface ClosureChecklistItem {
  code: "delivered" | "pod" | "charges" | "no-open-cdr" | "no-hold" | "archived";
  label: string;
  pass: boolean;
  detail: string;
  href: string | null;
}

export interface ClosureState {
  awbId: number;
  items: ClosureChecklistItem[];
  canClose: boolean;
  closedAt: string | null;
  closedBy: string | null;
  /** CMTS `Lock` — propagates to houses, splits, detends, DO and gate pass. */
  locked: boolean;
  archiveBundleId: string | null;
}
