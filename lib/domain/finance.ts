/**
 * AirVault domain — charges, godown rent, invoicing, waiver and DO.
 *
 * CMTS sources:
 *   `GODOWNRENT` (75)        the widest table in the schema
 *   `GODOWNRENTDETAIL` (26)  per-line working
 *   `GODOWNRENTDUPLICATE` (10)
 *   `grCharges` (48)         calculation scratch
 *   `AWBDELEIVERYORDER` (39) delivery order
 *   `CARGOSUBCLASSCHARGES` (15), `LOCATIONCHARGES` (10), `TaxType` (12)
 */

import type { Amount, DocNumberRef, DomainRecord, SiteCode } from "./common";
import { round2 } from "./common";
import { CATEGORY_SURCHARGES, TARIFF_SLABS, cargoClass, cargoSubClass } from "./masters";

/* ================================================================== *
 * Charge calculation — FC-07 §01–08, rendered step by step
 * ================================================================== */

export interface SlabLine {
  label: string;
  DAYFROM: number;
  DAYTO: number | null;
  daysInBand: number;
  ratePerKgPerDay: Amount;
  chargeableKg: number;
  amount: Amount;
}

export interface ChargeCalculation {
  awbId: number;
  /** Which tariff version produced this — provenance is a P5-1 requirement. */
  tariffVersion: string;
  calculatedAt: string;

  // FC-07 §01–03
  arrivalAt: string;
  freeDays: number;
  totalDays: number;
  chargeableDays: number;
  supplementDays: number;

  // FC-07 §04–06
  actualKg: number;
  volumetricKg: number;
  chargeableKg: number;

  // FC-07 §07 — category surcharge
  surcharges: Array<{ code: string; label: string; percent: number; amount: Amount }>;

  // FC-07 §08 — tariff slab
  slabLines: SlabLine[];

  // Components (CMTS `GODOWNRENTDETAIL` / `grCharges`)
  storageAmount: Amount;
  handlingAmount: Amount;
  locationChargesAmount: Amount;
  documentationCharges: Amount;
  deconsolidationCharges: Amount;
  specialHandlingCharges: Amount;
  miscellaneousCharges: Amount;
  minimumCharges: Amount;

  subTotal: Amount;
  taxPercent: number;
  taxAmount: Amount;
  total: Amount;
}

/**
 * FC-07 §08 — apply the tariff slabs across the chargeable days.
 * A stay crossing a band boundary is split across bands.
 */
export function slabBreakdown(chargeableDays: number, chargeableKg: number): SlabLine[] {
  const lines: SlabLine[] = [];
  for (const slab of TARIFF_SLABS) {
    const bandStart = slab.DAYFROM;
    const bandEnd = slab.DAYTO ?? Number.POSITIVE_INFINITY;
    // Days 1..chargeableDays are billable days after the free period.
    const from = Math.max(bandStart, 1);
    const to = Math.min(bandEnd, chargeableDays);
    const daysInBand = Math.max(0, to - from + 1);
    if (daysInBand === 0) continue;
    lines.push({
      label: slab.label,
      DAYFROM: slab.DAYFROM,
      DAYTO: slab.DAYTO,
      daysInBand,
      ratePerKgPerDay: slab.ratePerKgPerDay,
      chargeableKg,
      amount: round2(daysInBand * slab.ratePerKgPerDay * chargeableKg),
    });
  }
  return lines;
}

/** FC-07 §07 — surcharges that apply to a cargo class. */
export function surchargesFor(cargoClassId: number, base: Amount) {
  return CATEGORY_SURCHARGES.filter((s) => s.classIds.includes(cargoClassId)).map((s) => ({
    code: s.code,
    label: s.label,
    percent: s.percent,
    amount: round2((base * s.percent) / 100),
  }));
}

/**
 * The FC-07 §01–08 chain, computed end to end. Every intermediate is kept
 * so the calculator screen can show each step rather than just a total.
 */
export function calculateCharges(input: {
  awbId: number;
  arrivalAt: string;
  totalDays: number;
  cargoClassId: number;
  cargoSubClassId: number;
  actualKg: number;
  volumetricKg: number;
  supplementDays?: number;
  handlingRatePerKg?: number;
  locationChargePerDay?: number;
  miscellaneous?: number;
  tariffVersion?: string;
  calculatedAt?: string;
  taxPercent?: number;
}): ChargeCalculation {
  const cls = cargoClass(input.cargoClassId);
  const sub = cargoSubClass(input.cargoSubClassId);

  const freeDays = cls.freeDays;
  const supplementDays = input.supplementDays ?? 0;
  const chargeableDays = Math.max(0, input.totalDays - freeDays) + supplementDays;
  const chargeableKg = round2(Math.max(input.actualKg, input.volumetricKg));

  const slabLines = slabBreakdown(chargeableDays, chargeableKg);
  const storageAmount = round2(slabLines.reduce((n, l) => n + l.amount, 0));

  const handlingAmount = round2(chargeableKg * (input.handlingRatePerKg ?? 12));
  const locationChargesAmount = round2(chargeableDays * (input.locationChargePerDay ?? 0));

  const surcharges = surchargesFor(input.cargoClassId, storageAmount);
  const surchargeTotal = round2(surcharges.reduce((n, s) => n + s.amount, 0));

  const raw = round2(
    storageAmount +
      handlingAmount +
      locationChargesAmount +
      surchargeTotal +
      cls.DOCUMENTATIONCHARGES +
      cls.DECONSOLIDATIONCHARGES +
      cls.SPECIALHANDLINGCHARGES +
      (input.miscellaneous ?? 0),
  );

  // CMTS `CARGOSUBCLASS.MINCHARGES` — the floor.
  const subTotal = round2(Math.max(raw, sub.MINCHARGES));
  const taxPercent = input.taxPercent ?? 15;
  const taxAmount = round2((subTotal * taxPercent) / 100);

  return {
    awbId: input.awbId,
    tariffVersion: input.tariffVersion ?? "TARIFF-2026.2",
    calculatedAt: input.calculatedAt ?? input.arrivalAt,
    arrivalAt: input.arrivalAt,
    freeDays,
    totalDays: input.totalDays,
    chargeableDays,
    supplementDays,
    actualKg: round2(input.actualKg),
    volumetricKg: round2(input.volumetricKg),
    chargeableKg,
    surcharges,
    slabLines,
    storageAmount,
    handlingAmount,
    locationChargesAmount,
    documentationCharges: cls.DOCUMENTATIONCHARGES,
    deconsolidationCharges: cls.DECONSOLIDATIONCHARGES,
    specialHandlingCharges: cls.SPECIALHANDLINGCHARGES,
    miscellaneousCharges: input.miscellaneous ?? 0,
    minimumCharges: sub.MINCHARGES,
    subTotal,
    taxPercent,
    taxAmount,
    total: round2(subTotal + taxAmount),
  };
}

/* ================================================================== *
 * Godown rent voucher — CMTS `GODOWNRENT` (75), all columns
 * ================================================================== */

export type BillType = "NORMAL" | "SUPPLIMENT" | "DUPLICATE" | "FREEHAND";
export type PayMode = "CASH" | "PAYORDER" | "CHEQUE" | "CARD" | "BANK_TRANSFER" | "GATEWAY";

export interface GodownRent extends DomainRecord {
  GodownId: number;
  /** CMTS `VOUCHERNO` — continues the CMTS series. */
  VOUCHERNO: string;
  docNumber: DocNumberRef;
  GRDATE: string;
  CHALLANNO: string | null;
  IGMNO: string;
  AWBNO: string;
  SUBAWBNO: string | null;
  INDEXNO: string | null;
  SUBINDEXNO: string | null;
  TOTALWEIGHT: number;
  CHARGEABLEWEIGHT: number;
  DONO: string | null;
  ARRIVALDATE: string;
  DAYS: number;
  FREE: boolean;
  BILLTYPE: BillType;
  FROMDATE: string;
  TODATE: string;
  DELIVERYDATE: string | null;
  SUPPLIMENTDAYS: number;
  GRREFERENCE: string | null;
  TOTALPIECES: number;

  // Charge block
  HANDLING: Amount;
  DEMURRAGE: Amount;
  DOCUMENTATION: Amount;
  DECONSOLIDATION: Amount;
  MISCELLANEOUS: Amount;
  SPECIALHANDLING: Amount;
  TOTALAMOUNT: Amount;
  NETPAYABLE: Amount;

  // The seven CMTS `sum*` aggregates
  sumTotalAmountWithoutTax: Amount;
  sumLocationChargesAmount: Amount;
  sumHandlingCharges: Amount;
  sumStorgeUnitCharges: Amount;
  sumAFUAmount: Amount;
  sumMinimumCharges: Amount;
  sumTax: Amount;

  // Waiver block — FC-07 §10–12
  WAIVEOFF: boolean;
  WAIVEOFFPERCENT: number;
  WAIVEOFFAMOUNT: Amount;
  WAIVEOFFREASON: string | null;
  /** CMTS `WaivOfStorageOrAmount` — waive storage only, or the total. */
  WaivOfStorageOrAmount: "STORAGE" | "AMOUNT" | null;

  // Payment block — FC-07 §13
  PAID: boolean;
  CASH: boolean;
  CASHAMOUNT: Amount;
  PAYORDERNO: string | null;
  PAYORDERDATE: string | null;
  PAYORDERAMOUNT: Amount;
  PayOrder: boolean;
  Paymode: PayMode | null;
  CREDITCARD: string | null;
  MASTERCARD: string | null;
  ACCTITLE: string | null;
  ACCNO: string | null;
  BANKNAME: string | null;
  BANKBRANCHNAME: string | null;
  CHEQUENO: number | null;
  CHEQUEDATE: string | null;
  RECIEVEDBY: string | null;
  PAYDATE: string | null;
  OverPaidAmount: Amount;

  DUPLICATECOUNT: number;
  NTN: string | null;
  STN: string | null;
  GdUniqueIdentification: string;
  DetendUniqueIdentification: string | null;
  clearingAgent: string | null;
  GDNum: string | null;
  site: SiteCode;
}

/** CMTS `GODOWNRENTDETAIL` (26) — one row per class/subclass/location/day band. */
export interface GodownRentDetail {
  Id: number;
  GRNO: string;
  CLASSID: number;
  SUBCLASSID: number;
  LOCATIONID: number;
  INDEXNO: number | null;
  DAYS: number;
  WEIGHT: number;
  HandlingUnit: string;
  HandlingCharges: Amount;
  StorgeUnit: string;
  StorgeUnitCharges: Amount;
  LocationUnit: string;
  LocationCharges: Amount;
  MinimumCharges: Amount;
  SpecialCharges: Amount;
  Deconsolidation: Amount;
  DocCharges: Amount;
  AFUAmount: Amount;
  Freedays: number;
  TaxPercentage: string;
  Tax: Amount;
  TaxAmount: Amount;
  TotalAmountWithoutTax: Amount;
  TotalAmountWithTax: Amount;
  GodownId: number;
}

/** CMTS `GODOWNRENTDUPLICATE` (10) */
export interface GodownRentDuplicate {
  VOUCHERNO: string;
  SEQUENCENO: number;
  COMMENTS: string;
  DUPLICATEDATE: string;
  USERID: string;
  CityId: number;
  DuplicateAmount: Amount;
  DuplicateTax: Amount;
  DuplicateTotalAmount: Amount;
  DuplicateTaxPercen: number;
}

/* ================================================================== *
 * Waiver — FC-07 §10–12
 * ================================================================== */

export type WaiverReason =
  | "airline-delay"
  | "customs-hold"
  | "force-majeure"
  | "concession"
  | "govt-cargo"
  | "billing-correction";

export const WAIVER_REASON_LABEL: Record<WaiverReason, string> = {
  "airline-delay": "Airline delay",
  "customs-hold": "Customs hold",
  "force-majeure": "Force majeure",
  concession: "Concession",
  "govt-cargo": "Government cargo",
  "billing-correction": "Billing correction",
};

export type ApprovalDecision = "pending" | "approved" | "rejected";

export interface ApprovalLevel {
  level: number;
  role: string;
  approver: string | null;
  decision: ApprovalDecision;
  comment: string | null;
  decidedAt: string | null;
}

export interface WaiverRequest {
  id: number;
  voucherNo: string;
  awbId: number;
  requestedBy: string;
  requestedAt: string;
  reason: WaiverReason;
  note: string;
  /** Percent or amount — CMTS carries both. */
  mode: "percent" | "amount";
  percent: number;
  amount: Amount;
  /** CMTS `WaivOfStorageOrAmount` */
  scope: "STORAGE" | "AMOUNT";
  originalTotal: Amount;
  revisedTotal: Amount;
  levels: ApprovalLevel[];
  status: ApprovalDecision;
  /** Set once approved — FC-07 §12. */
  creditNoteNo: string | null;
  site: SiteCode;
}

export function waiverStatus(levels: ApprovalLevel[]): ApprovalDecision {
  if (levels.some((l) => l.decision === "rejected")) return "rejected";
  if (levels.every((l) => l.decision === "approved")) return "approved";
  return "pending";
}

/* ================================================================== *
 * Delivery Order — CMTS `AWBDELEIVERYORDER` (39), all columns
 * ================================================================== */

export interface DeliveryOrder extends DomainRecord {
  DoId: number;
  IGMNO: string;
  AWBNO: string;
  HWBNO: string | null;
  DONO: string;
  docNumber: DocNumberRef;
  DODATE: string;
  DOTYPE: string;
  DOCARGOCLASSID: number;
  AMOUNT: Amount;
  Tax: number;
  REMARKS: string | null;
  SHIFT: string;
  CHALLANNO: string | null;

  // Receiver identity
  RECIEVEDBY: string;
  NIC: string | null;
  PASSPORT: string | null;

  // Authorised agent block — entirely absent from the pre-P0 demo
  AuthAgentName: string | null;
  AuthAgentCNIC: string | null;
  AuthAgentPhone: string | null;
  AuthAgentEmail: string | null;
  AuthLetterNo: string | null;
  AuthAgentPic: string | null;

  NTN: string | null;
  STN: string | null;

  FREE: boolean;
  FREECAUSE: string | null;

  IsDuplicate: boolean;
  DuplicateReason: string | null;
  Reason: string | null;
  FIRdate: string | null;
  IsLock: boolean;
  DetendIdentification: string | null;
  site: SiteCode;
}

/* ================================================================== *
 * DO release gate — FC-07 "Godown Rent Verification"
 *
 * The flow fans out to five conditions that all converge on
 * "G.Rent Voucher issued". Treated as AND pending BLK-10.
 * ================================================================== */

export type ReleaseConditionCode =
  | "ooc-available"
  | "authority-verified"
  | "charges-paid"
  | "not-on-hold"
  | "special-clearance";

export interface ReleaseCondition {
  code: ReleaseConditionCode;
  label: string;
  /** True = satisfied. */
  pass: boolean;
  /** Why it failed, or the evidence that it passed. */
  detail: string;
  /** Where to go to fix it. */
  href: string | null;
  /** Conditional conditions show as N/A rather than blocking — see BLK-10. */
  applicable: boolean;
}

export interface ReleaseGate {
  awbId: number;
  conditions: ReleaseCondition[];
  /** All applicable conditions pass. */
  canRelease: boolean;
  blockedBy: ReleaseCondition[];
}

export function evaluateReleaseGate(
  awbId: number,
  facts: {
    oocIssued: boolean;
    oocRef?: string | null;
    authorityLetterNo?: string | null;
    chargesPaid: boolean;
    outstanding?: Amount;
    onHold: boolean;
    holdReason?: string | null;
    cargoClassId: number;
    specialClearanceDone: boolean;
  },
): ReleaseGate {
  const cls = cargoClass(facts.cargoClassId);

  const conditions: ReleaseCondition[] = [
    {
      code: "ooc-available",
      label: "OOC available",
      pass: facts.oocIssued,
      detail: facts.oocIssued
        ? `Out-of-Charge ${facts.oocRef ?? ""} verified against the declaration`
        : "No Out-of-Charge recorded against this AWB",
      href: "/excise-compliance/ooc-capture",
      applicable: true,
    },
    {
      code: "authority-verified",
      label: "AWB authority verified",
      pass: !!facts.authorityLetterNo,
      detail: facts.authorityLetterNo
        ? `Authority letter ${facts.authorityLetterNo} on file`
        : "No authority letter or endorsement on file",
      href: "/gate-entry/authority-letter-digitisation",
      applicable: true,
    },
    {
      code: "charges-paid",
      label: "DO charges paid",
      pass: facts.chargesPaid,
      detail: facts.chargesPaid
        ? "All charges settled"
        : `Outstanding balance ${facts.outstanding ?? 0}`,
      href: "/finance-manager/payment-reconciliation",
      applicable: true,
    },
    {
      code: "not-on-hold",
      label: "Cargo not on hold",
      pass: !facts.onHold,
      detail: facts.onHold ? (facts.holdReason ?? "Hold is live") : "No live hold",
      href: "/excise-compliance/hold-register",
      applicable: true,
    },
    {
      code: "special-clearance",
      label: "Special clearance completed",
      // BLK-10: treated as conditional on cargo class rather than universal,
      // because the FC-07 amendment lists only four conditions.
      pass: cls.requiresSpecialClearance ? facts.specialClearanceDone : true,
      detail: cls.requiresSpecialClearance
        ? facts.specialClearanceDone
          ? "ANF / ASF / agency clearance recorded"
          : `${cls.ABBREVATION} requires special clearance — not recorded`
        : `Not required for ${cls.ABBREVATION}`,
      href: "/excise-compliance/customs-queue",
      applicable: cls.requiresSpecialClearance,
    },
  ];

  const blockedBy = conditions.filter((c) => c.applicable && !c.pass);
  return { awbId, conditions, canRelease: blockedBy.length === 0, blockedBy };
}

/* ================================================================== *
 * Invoice & payment
 * ================================================================== */

export interface Invoice {
  id: number;
  invoiceNo: string;
  docNumber: DocNumberRef;
  awbId: number;
  IGMNO: string;
  AWBNO: string;
  issuedAt: string;
  dueAt: string;
  subTotal: Amount;
  taxAmount: Amount;
  total: Amount;
  paid: Amount;
  outstanding: Amount;
  status: "draft" | "issued" | "part-paid" | "paid" | "overdue" | "credited";
  payerPartyId: number;
  site: SiteCode;
}

export interface PaymentRecord {
  id: number;
  invoiceNo: string;
  paidAt: string;
  amount: Amount;
  mode: PayMode;
  /** Gateway transactions auto-reconcile (FC-07 amendment). */
  gatewayRef: string | null;
  reconciled: boolean;
  /** Populated for legacy instruments. */
  challanNo: string | null;
  payOrderNo: string | null;
  chequeNo: number | null;
  bankName: string | null;
  receivedBy: string;
  site: SiteCode;
}
