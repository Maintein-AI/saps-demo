/**
 * AirVault domain — storage & warehouse (M05, FC-03).
 *
 * CMTS sources:
 *   `IMPORTAWBBOUNDEDAREA` (21)  bonded-area handover — 0 hits in the demo
 *   `CARGOSUBCLASSLOCATION` (4)  the subclass → location rules (in masters.ts)
 *
 * AirVault additions (FC-03 amendment):
 *   RFID/barcode tag binding at putaway — the identity FC-08 reads at
 *   retrieval and gate-out. CMTS has no tag-to-location relationship.
 */

import type { DomainRecord, SiteCode } from "./common";

/* ================================================================== *
 * SCC → cargo class (P2-6)
 *
 * The IATA Special Cargo Code arrives on the manifest, before indexation.
 * FC-03 says cargo is "Classified by Handling Code" — SCC *is* the
 * handling code, so it can propose a class at flight arrival.
 *
 * Caveat from the reference documents: both pharma AWBs on OD 0131 are
 * coded `GEN` with "PHARMA" only in the goods description. SCC proposes;
 * it does not decide.
 * ================================================================== */

export interface SccMapping {
  /** IATA Special Cargo Code as printed on the manifest. */
  scc: string;
  description: string;
  /** Cargo class this SCC proposes. */
  proposedClassId: number;
  /** Confidence in the mapping — GEN is weak because it is the catch-all. */
  strength: "strong" | "weak";
  note: string | null;
}

export const SCC_MAPPINGS: SccMapping[] = [
  { scc: "GEN", description: "General cargo", proposedClassId: 1, strength: "weak", note: "Catch-all — check the goods description before accepting" },
  { scc: "PER", description: "Perishable", proposedClassId: 6, strength: "strong", note: null },
  { scc: "DGR", description: "Dangerous goods", proposedClassId: 5, strength: "strong", note: "Requires NOTOC and a DGR-certified acceptor" },
  { scc: "RFL", description: "Flammable liquid (DGR class 3)", proposedClassId: 5, strength: "strong", note: null },
  { scc: "RCM", description: "Corrosive (DGR class 8)", proposedClassId: 5, strength: "strong", note: null },
  { scc: "VAL", description: "Valuable cargo", proposedClassId: 7, strength: "strong", note: "Dual custody from acceptance" },
  { scc: "AVI", description: "Live animals", proposedClassId: 8, strength: "strong", note: "Veterinary officer required" },
  { scc: "HUM", description: "Human remains", proposedClassId: 9, strength: "strong", note: null },
  { scc: "AOG", description: "Aircraft on ground", proposedClassId: 10, strength: "strong", note: null },
  { scc: "DIP", description: "Diplomatic mail", proposedClassId: 11, strength: "strong", note: "Sealed — not to be opened" },
  { scc: "VUN", description: "Vulnerable cargo", proposedClassId: 12, strength: "strong", note: null },
  { scc: "PIL", description: "Pharmaceuticals", proposedClassId: 13, strength: "strong", note: null },
  { scc: "COL", description: "Cool room +2 to +8 C", proposedClassId: 6, strength: "strong", note: null },
  { scc: "FRO", description: "Frozen", proposedClassId: 6, strength: "strong", note: null },
  { scc: "ICE", description: "Dry ice", proposedClassId: 5, strength: "strong", note: "DGR — UN1845" },
  { scc: "HEA", description: "Heavy cargo", proposedClassId: 2, strength: "strong", note: null },
  { scc: "BIG", description: "Outsized", proposedClassId: 2, strength: "strong", note: null },
];

export function sccMapping(scc: string): SccMapping | undefined {
  return SCC_MAPPINGS.find((m) => m.scc === scc.toUpperCase());
}

/**
 * Keywords in the goods description that should override a weak SCC.
 * Derived from the reference documents, where "PHARMA" / "PHARMACEUTICAL"
 * appears against SCC `GEN`.
 */
export const DESCRIPTION_OVERRIDES: Array<{ match: RegExp; classId: number; reason: string }> = [
  { match: /pharma|pregabalin|ranelate|medic|vaccine|reagent/i, classId: 13, reason: "Pharmaceutical goods description" },
  { match: /perishable|fresh|flower|seafood|frozen/i, classId: 6, reason: "Perishable goods description" },
  { match: /lithium|battery|flammable|corrosive/i, classId: 5, reason: "Dangerous goods description" },
  { match: /bullion|gold|jewel|currency/i, classId: 7, reason: "Valuable goods description" },
  { match: /aircraft|aog|hydraulic pump|spare/i, classId: 10, reason: "AOG spares description" },
];

export interface ClassificationProposal {
  fromScc: SccMapping | undefined;
  fromDescription: { classId: number; reason: string } | null;
  /** Where the two disagree, the operator must resolve — FC-03/FC-02. */
  disagreement: boolean;
  proposedClassId: number | null;
}

export function proposeClassification(scc: string, description: string): ClassificationProposal {
  const byScc = sccMapping(scc);
  const byDesc = DESCRIPTION_OVERRIDES.find((o) => o.match.test(description));
  const fromDescription = byDesc ? { classId: byDesc.classId, reason: byDesc.reason } : null;

  // A weak SCC (GEN) yields to the description; a strong one disagreeing is
  // an operator decision, not something to resolve silently.
  const disagreement =
    !!byScc && !!fromDescription && byScc.proposedClassId !== fromDescription.classId && byScc.strength === "strong";

  const proposedClassId =
    fromDescription && (!byScc || byScc.strength === "weak")
      ? fromDescription.classId
      : (byScc?.proposedClassId ?? fromDescription?.classId ?? null);

  return { fromScc: byScc, fromDescription, disagreement, proposedClassId };
}

/* ================================================================== *
 * RFID / barcode tag binding — FC-03 amendment
 *
 * "RFID / barcode tag bound to the location; putaway confirmed by scan."
 * This binding is what FC-08 then reads at retrieval and gate-out.
 * ================================================================== */

export type BindingMethod = "rfid" | "barcode" | "manual";

export interface TagBinding {
  id: number;
  pieceId: string;
  awbId: number;
  AWBNO: string;
  /** EPC for RFID, symbol value for barcode, null where manual. */
  tagValue: string | null;
  method: BindingMethod;
  locationId: number;
  boundAt: string;
  boundBy: string;
  /** Set when the piece moves; the previous binding is retained as history. */
  unboundAt: string | null;
  /** Required when method is "manual". */
  manualReason: string | null;
  site: SiteCode;
}

/* ================================================================== *
 * Bonded area handover — CMTS `IMPORTAWBBOUNDEDAREA` (21), all columns
 *
 * FC-03 group C routes "Airline Bonded Cargo → Bonded Storage". Zero
 * occurrences of "Bonded" in the pre-Phase-2 demo. Also the prerequisite
 * for FC-09's bonded transhipment zone.
 * ================================================================== */

export interface BondedHandover extends DomainRecord {
  BoundedAreaId: number;
  AWBId: number;
  IGMNO: string;
  AWBNO: string;
  /** CMTS `NameOfAirLineRepsntive` (sic). */
  NameOfAirLineRepsntive: string;
  AirlineId: string;
  GoodDescription: string;
  HandOverDate: string;
  HandOverTime: string;
  Destination: string;
  DeliverBy: string;
  USERID: string;
  UniqueIdentification: string;

  // ---- AirVault additions ----
  direction: "in" | "out";
  locationId: number;
  site: SiteCode;
}

/* ================================================================== *
 * Allocation decision — FC-03 amendment nodes 153:3476 → 153:3488
 * ================================================================== */

export type AllocationOutcome = "suggested" | "accepted" | "overflow" | "overridden" | "refused";

export interface AllocationDecision {
  id: number;
  awbId: number;
  AWBNO: string;
  cargoClassId: number;
  cargoSubClassId: number;
  needKg: number;
  /** What the engine proposed first. */
  suggestedLocationId: number | null;
  /** Where it actually went. */
  finalLocationId: number | null;
  outcome: AllocationOutcome;
  /** The rule or capacity fact behind the suggestion. */
  reason: string;
  /** Mandatory when outcome is "overridden". */
  overrideReason: string | null;
  decidedAt: string;
  decidedBy: string;
  site: SiteCode;
}
