/**
 * AirVault domain — fields taken from the *actual* documents.
 *
 * Source: four real reference documents supplied by SAPS —
 *   816-00059205  Batik Air MAWB, DEL→LHE via KUL, pharma
 *   816-00034156  Malindo MAWB, DEL→LHE via KUL, pharma raw material
 *   816-00052345  Batik Air MAWB (CONSOL) DAD→LHE + its HAWB GCS26070055
 *   OD-131        Cargo Manifest (ICAO Annex 9), Batik OD 0131, KUL→LHE
 *
 * CMTS does not model most of what is on these documents. `IMPORTAWB` has
 * no ULD, no notify party, no other-charges breakdown, no prepaid/collect
 * code, no HS code pair, no batch/expiry. The manifest's ULD grouping and
 * its "61/145" part-notation have no CMTS equivalent at all.
 *
 * These types are AirVault additions — kept separate from the CMTS-parity
 * types in `cargo.ts` so the parity story stays clean and the additions are
 * individually reviewable.
 */

import type { Amount, DimensionUnit, SiteCode } from "./common";

/* ================================================================== *
 * ULD — from the cargo manifest
 *
 * The manifest groups AWB lines under a ULD, with the ULD's own gross
 * weight. `BULK` is the pseudo-ULD for loose cargo.
 *
 *   BULK          GWGT   344.00   net   344.00   tare   0.00
 *   PAG40387JT    GWGT 1,320.00   net 1,200.00   tare 120.00
 *   PAG40479JT    GWGT 2,078.00   net 1,958.00   tare 120.00
 * ================================================================== */

export interface UldRecord {
  /** "PAG40387JT", or "BULK" for loose cargo. Manifest column ULD-ID. */
  uldId: string;
  /** True for the BULK pseudo-ULD. */
  isBulk: boolean;
  /** Manifest column GWGT — gross weight including the ULD itself. */
  grossWeightKg: number;
  /** Sum of the net weights of the AWB lines on this ULD. */
  netWeightKg: number;
  /** GWGT − net. 120 kg for a PAG pallet in the reference manifest. */
  tareWeightKg: number;
  /** "LOCAL" or the onward station, per the manifest. */
  disposition: string;
  /** Manifest column CNT — contour / configuration. Often blank. */
  contour: string | null;
}

/**
 * One AWB line on the manifest, under a ULD.
 *
 * The key field is `piecesOnUld` / `piecesOnAwb` — the manifest's "61/145"
 * notation. An AWB split across two ULDs on the same flight is normal, not
 * a discrepancy; without this the reconciliation double-counts or
 * false-flags. This is the "total to be received vs what is received"
 * indexing.
 */
export interface ManifestLine {
  id: number;
  ManifiestId: number;
  uldId: string;
  /** Manifest column AWB Number. */
  AWBNO: string;
  /** Pieces of this AWB carried on this ULD. */
  piecesOnUld: number;
  /**
   * Total pieces on the AWB across all ULDs — the denominator in "61/145".
   * Null where the manifest shows a bare count (the AWB is not split).
   */
  piecesOnAwb: number | null;
  /** Manifest column Net Wt Kilogram. */
  netWeightKg: number;
  /** Manifest columns Org / Des — the AWB's true origin, which may sit
   *  upstream of the flight's point of loading (DEL→LHE on a KUL→LHE leg). */
  origin: string;
  destination: string;
  /** Manifest column Description of goods. */
  description: string;
  /** Manifest column SCC — IATA Special Cargo Code (GEN, PER, DGR, VAL…). */
  scc: string;
  /** Manifest column NEXT FLT — onward flight; identifies transhipment. */
  nextFlight: string | null;
  /** Manifest column Customs Status. */
  customsStatus: string | null;
  /** Manifest column MFT REMARKS. */
  remarks: string | null;
}

/** Is this AWB split across more than one ULD on the flight? */
export function isSplitAcrossUlds(lines: ManifestLine[], awbNo: string): boolean {
  return lines.filter((l) => l.AWBNO === awbNo).length > 1;
}

export interface AwbManifestRollup {
  AWBNO: string;
  ulds: string[];
  piecesReceived: number;
  /** From the "/145" denominator, or the sum where not split. */
  piecesExpected: number;
  netWeightKg: number;
  complete: boolean;
  shortPieces: number;
}

/** Roll manifest lines up to AWB level — the second reconciliation tier. */
export function rollupByAwb(lines: ManifestLine[]): AwbManifestRollup[] {
  const byAwb = new Map<string, ManifestLine[]>();
  for (const l of lines) {
    byAwb.set(l.AWBNO, [...(byAwb.get(l.AWBNO) ?? []), l]);
  }
  return [...byAwb.entries()].map(([AWBNO, ls]) => {
    const piecesReceived = ls.reduce((n, l) => n + l.piecesOnUld, 0);
    const declared = ls.find((l) => l.piecesOnAwb !== null)?.piecesOnAwb ?? piecesReceived;
    return {
      AWBNO,
      ulds: ls.map((l) => l.uldId),
      piecesReceived,
      piecesExpected: declared,
      netWeightKg: Math.round(ls.reduce((n, l) => n + l.netWeightKg, 0) * 100) / 100,
      complete: piecesReceived === declared,
      shortPieces: Math.max(0, declared - piecesReceived),
    };
  });
}

/* ================================================================== *
 * IATA "Other Charges" codes
 *
 * The reference AWBs carry coded charges that sum exactly to the
 * "due agent" and "due carrier" totals. CMTS has no structured
 * other-charges model — only flat DOCUMENTATION / MISCELLANEOUS columns.
 * ================================================================== */

export type ChargeDueTo = "agent" | "carrier";

export interface OtherChargeLine {
  /** IATA other-charges code as printed: AWB, AMS, FSC, X-RAY, PCA… */
  code: string;
  description: string;
  amount: Amount;
  dueTo: ChargeDueTo;
}

/** Codes observed across the reference documents, with what they mean. */
export const OTHER_CHARGE_CODES: Record<string, string> = {
  AWB: "Air waybill fee",
  AWC: "Air waybill charge",
  AWF: "Airway bill fee (carrier)",
  AMS: "Automated manifest system",
  FSC: "Fuel surcharge",
  FSCC: "Fuel surcharge (carrier collect)",
  FIH: "Freight in handling",
  FWB: "Electronic AWB (FWB) fee",
  SYS: "System / message fee",
  PCA: "Processing / clearance administration",
  CGST: "Central GST",
  SGST: "State GST",
  "X-RAY": "Security screening (X-ray)",
};

/** Prepaid / collect. Manifest CHGS code column: PP or CC. */
export type ChargeCode = "PP" | "CC";

/* ================================================================== *
 * The AWB document itself
 *
 * Fields printed on the physical AWB that CMTS never captured. Held as an
 * extension rather than folded into IMPORTAWB so the 64-column parity list
 * stays honest.
 * ================================================================== */

export interface RoutingLeg {
  /** Sequence: 1 = first carrier. */
  leg: number;
  to: string;
  byCarrier: string;
  flightNo: string | null;
  flightDate: string | null;
}

export interface PharmaAttributes {
  /** "PGL260053FP" — batch / lot. */
  batchNo: string | null;
  /** "MAY-2026" */
  manufactureDate: string | null;
  /** "APR-2029" — retest or expiry, whichever the document states. */
  retestOrExpiryDate: string | null;
  /** Which of the two the date above represents. */
  dateBasis: "retest" | "expiry" | null;
}

export interface AwbDocument {
  AWBNO: string;

  /** AWB number structure: 816 - DEL - 00059205 */
  airlinePrefix: string;
  originCode: string;
  serialNo: string;

  /** Multi-leg routing. The AWB origin (DEL) can sit upstream of the
   *  flight's point of loading (KUL) — the manifest shows both. */
  airportOfDeparture: string;
  routing: RoutingLeg[];

  /** Agent block. */
  issuingAgentName: string;
  issuingAgentCity: string;
  /** "14-3-5164" — drives commission / revenue share. */
  agentIataCode: string | null;
  shipperAccountNo: string | null;
  consigneeAccountNo: string | null;

  /** Notify parties — distinct from consignee. The NOA in FC-05 should
   *  reach these too; CMTS has no notify party at all. */
  notifyParty1: string | null;
  notifyParty2: string | null;

  /** Charges declaration. */
  currency: string;
  chargeCode: ChargeCode;
  wtValPrepaid: boolean;
  otherPrepaid: boolean;
  /** "NVD" (no value declared) / "NCV" (no commercial value) or an amount. */
  declaredValueCarriage: string;
  declaredValueCustoms: string;
  amountOfInsurance: string;

  /** Rate line. */
  rateClass: string | null;
  commodityItemNo: string | null;
  weightUnit: "K" | "L";
  grossWeightKg: number;
  /** HAWB-level net weight where stated — 3,061.3 vs gross 3,148.3. */
  netWeightKg: number | null;
  chargeableWeightKg: number;
  rate: Amount;
  weightCharge: Amount;

  /** Dimensions as printed, with the unit that decides the divisor. */
  dimensionUnit: DimensionUnit;
  dimensionsText: string | null;
  totalVolume: number | null;
  volumeUnit: "ccm" | "cbm" | "cuin" | null;

  otherCharges: OtherChargeLine[];
  totalOtherChargesDueAgent: Amount;
  totalOtherChargesDueCarrier: Amount;
  totalPrepaid: Amount;
  totalCollect: Amount;

  /** Customs / trade references from the goods description block. */
  exporterHsCode: string | null;
  importerHsCode: string | null;
  commercialInvoiceNo: string | null;
  commercialInvoiceDate: string | null;
  importContractNo: string | null;
  importContractDate: string | null;
  /** Bank contract number — "HMBC/02-07/1152 DT 30.06.2026". */
  bankContractNo: string | null;
  bankContractDate: string | null;
  /** NTN quoted in the handling-information block. */
  handlingNtn: string | null;
  /** Special Customs Information box. */
  sci: string | null;

  /** Pharma / regulated-goods attributes. */
  pharma: PharmaAttributes | null;

  handlingInformation: string | null;
  executedOnDate: string | null;
  executedAtPlace: string | null;
  site: SiteCode;
}

/**
 * The three-level reconciliation the manifest implies:
 *   flight → ULD → AWB → HAWB
 *
 * CMTS and FC-01 §07 both model only two levels (manifest vs physical),
 * which cannot express an AWB arriving on two ULDs.
 */
export interface ReconciliationTier {
  level: "flight" | "uld" | "awb" | "hawb";
  label: string;
  expected: number;
  actual: number;
  unit: "pieces" | "kg";
  balanced: boolean;
  note: string | null;
}
