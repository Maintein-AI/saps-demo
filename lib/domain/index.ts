/**
 * AirVault domain — public API.
 *
 * Every screen reads from here. No screen should declare its own inline
 * mock data after Phase 0.
 *
 *   import { getAwb, listAwbs, useSite } from "@/lib/domain";
 */

export * from "./common";
export * from "./masters";
export * from "./cargo";
export * from "./finance";
export * from "./dispatch";
export * from "./exceptions";
export * from "./messaging";
export * from "./documents";
export * from "./storage";
export * from "./customs";
export * from "./awbdoc";
export * from "./reference";
export * from "./fixtures";

import { DEMO_NOW, daysBetween, type SiteCode, type SiteScope } from "./common";
import { SECTION_82_DAYS, cargoClass } from "./masters";
import {
  ARRIVAL_ADVICES,
  AWBS,
  AWB_DETAILS,
  AWB_LOCATIONS,
  AWB_INFORMATION,
  CDRS,
  CHARGE_CALCULATIONS,
  CLOSURES,
  CUSTOMS_CLEARANCES,
  CUSTOMS_IGMS,
  DAMAGE_DETAILS,
  DELIVERY_ORDERS,
  DETENDS,
  DOCUMENTS,
  EXCEPTION_QUEUE,
  GATE_OUT_CHECKS,
  GATE_PASSES,
  GODOWN_RENTS,
  GR_DUPLICATES,
  HOLDS,
  HOUSE_AWBS,
  IATA_MESSAGES,
  INVOICES,
  LONGSTAY_CASES,
  MANIFESTS,
  MISHANDLED_CASES,
  NOTIFICATION_DISPATCHES,
  PAYMENTS,
  PICK_SESSIONS,
  PIECES,
  PODS,
  REEXPORT_CASES,
  WAIVER_REQUESTS,
  awbById,
  awbByNo,
  chargesFor,
  clearanceFor,
  releaseGateFor,
} from "./fixtures";
import { LIFECYCLE_ORDER, hasReached, stageIndex, type AWB, type LifecycleStage } from "./cargo";
import { evaluateClearance, type RiskChannel } from "./customs";
import { waiverStatus } from "./finance";

/* ------------------------------------------------------------------ *
 * Site scoping
 *
 * "HQ" means all sites — the FC-12 cross-site oversight view.
 * ------------------------------------------------------------------ */

function inScope<T extends { site: SiteCode }>(rows: T[], scope: SiteScope): T[] {
  return scope === "HQ" ? rows : rows.filter((r) => r.site === scope);
}

/* ------------------------------------------------------------------ *
 * AWB queries
 * ------------------------------------------------------------------ */

export interface AwbFilter {
  scope?: SiteScope;
  stage?: LifecycleStage;
  branch?: AWB["branch"];
  cargoClassId?: number;
  /** Matches AWB no, IGM no, consignee or flight. */
  q?: string;
  onHold?: boolean;
}

export function listAwbs(filter: AwbFilter = {}): AWB[] {
  let rows = inScope(AWBS, filter.scope ?? "HQ");
  if (filter.stage) rows = rows.filter((a) => a.stage === filter.stage);
  if (filter.branch !== undefined) rows = rows.filter((a) => a.branch === filter.branch);
  if (filter.cargoClassId) rows = rows.filter((a) => a.CARGOCLASSID === filter.cargoClassId);
  if (filter.onHold !== undefined) rows = rows.filter((a) => a.HOLDINGSTATUS === filter.onHold);
  if (filter.q) {
    const q = filter.q.toLowerCase();
    rows = rows.filter(
      (a) =>
        a.AWBNO.toLowerCase().includes(q) ||
        a.IGMNO.toLowerCase().includes(q) ||
        a.CONSIGNEE1.toLowerCase().includes(q) ||
        a.FLIGHT.toLowerCase().includes(q),
    );
  }
  return rows;
}

/**
 * Everything the AWB hub (`/awb/[awbId]`) needs, assembled in one call so
 * each tab does not have to know where its data lives.
 */
export function getAwb(awbId: number) {
  const awb = awbById(awbId);
  if (!awb) return null;

  const manifest = MANIFESTS.find((m) => m.ManifiestId === awb.ManifiestId) ?? null;
  const totalDays = daysBetween(awb.arrivedAt, DEMO_NOW);
  const cls = cargoClass(awb.CARGOCLASSID);

  return {
    awb,
    manifest,
    cargoClass: cls,
    details: AWB_DETAILS.filter((d) => d.AWBId === awbId),
    pieces: PIECES.filter((p) => p.awbId === awbId),
    location: AWB_LOCATIONS.find((l) => l.AWBNO === awb.AWBNO) ?? null,
    houses: awb.IsHwb ? HOUSE_AWBS.filter((h) => h.AWBNO === awb.AWBNO) : [],
    detends: DETENDS.filter((d) => d.AwbId === awbId),
    arrivalAdvice: ARRIVAL_ADVICES.find((x) => x.AWBNO === awb.AWBNO) ?? null,
    documents: DOCUMENTS.filter((d) => d.awbId === awbId),

    charges: chargesFor(awbId) ?? null,
    godownRent: GODOWN_RENTS.find((g) => g.AWBNO === awb.AWBNO) ?? null,
    invoice: INVOICES.find((i) => i.awbId === awbId) ?? null,
    waivers: WAIVER_REQUESTS.filter((w) => w.awbId === awbId),
    deliveryOrder: DELIVERY_ORDERS.find((d) => d.AWBNO === awb.AWBNO) ?? null,
    releaseGate: releaseGateFor(awbId),

    gatePass: GATE_PASSES.find((g) => g.AWBNO === awb.AWBNO) ?? null,
    pod: PODS.find((p) => p.awbId === awbId) ?? null,

    cdrs: CDRS.filter((c) => c.awbId === awbId),
    damage: DAMAGE_DETAILS.filter((d) => d.AWBId === awbId),
    holds: HOLDS.filter((h) => h.AWBNo === awb.AWBNO),
    mishandled: MISHANDLED_CASES.filter((m) => m.awbId === awbId),
    reExport: REEXPORT_CASES.filter((r) => r.awbId === awbId),
    longStay: LONGSTAY_CASES.filter((l) => l.awbId === awbId),

    messages: IATA_MESSAGES.filter((m) => m.awbId === awbId),
    notifications: NOTIFICATION_DISPATCHES.filter((n) => n.awbId === awbId),

    dwell: {
      arrivedAt: awb.arrivedAt,
      totalDays,
      freeDays: cls.freeDays,
      chargeableDays: Math.max(0, totalDays - cls.freeDays),
      section82Days: SECTION_82_DAYS,
      daysToSection82: SECTION_82_DAYS - totalDays,
      longStay: totalDays >= SECTION_82_DAYS,
    },
  };
}

export type AwbBundle = NonNullable<ReturnType<typeof getAwb>>;

/** FC-01 lifecycle bar — which stages are done, current, and not yet reached. */
export function lifecycleSteps(awb: AWB) {
  const current = stageIndex(awb.stage);
  return LIFECYCLE_ORDER.map((stage, i) => ({
    stage,
    state: i < current ? ("done" as const) : i === current ? ("current" as const) : ("pending" as const),
  }));
}

/* ------------------------------------------------------------------ *
 * Cross-module queries
 * ------------------------------------------------------------------ */

export function listManifests(scope: SiteScope = "HQ") {
  return inScope(MANIFESTS, scope);
}

export function listExceptionQueue(scope: SiteScope = "HQ") {
  return inScope(EXCEPTION_QUEUE, scope);
}

export function listGodownRents(scope: SiteScope = "HQ") {
  return inScope(GODOWN_RENTS, scope);
}

export function listInvoices(scope: SiteScope = "HQ") {
  return inScope(INVOICES, scope);
}

export function listDeliveryOrders(scope: SiteScope = "HQ") {
  return inScope(DELIVERY_ORDERS, scope);
}

export function listGatePasses(scope: SiteScope = "HQ") {
  return inScope(GATE_PASSES, scope);
}

export function listHolds(scope: SiteScope = "HQ", liveOnly = false) {
  const rows = inScope(HOLDS, scope);
  return liveOnly ? rows.filter((h) => !h.Release) : rows;
}

/* ---- Phase 3 · exception registers (FC-04, FC-10) ---- */

export function listCdrs(scope: SiteScope = "HQ", openOnly = false) {
  const rows = inScope(CDRS, scope);
  return openOnly ? rows.filter((c) => c.status !== "closed") : rows;
}

/**
 * `DamageDetail` carries no site column in CMTS — it hangs off the AWB.
 * Scope through the parent rather than inventing a column the legacy
 * schema does not have.
 */
export function listDamage(scope: SiteScope = "HQ") {
  const ids = new Set(inScope(AWBS, scope).map((a) => a.AWBId));
  return DAMAGE_DETAILS.filter((d) => ids.has(d.AWBId));
}

export function listMishandled(scope: SiteScope = "HQ", openOnly = false) {
  const rows = inScope(MISHANDLED_CASES, scope);
  return openOnly ? rows.filter((m) => m.stage !== "A8-closed") : rows;
}

export function listReExport(scope: SiteScope = "HQ", openOnly = false) {
  const rows = inScope(REEXPORT_CASES, scope);
  return openOnly ? rows.filter((r) => r.stage !== "B8-closed") : rows;
}

export function listLongStay(scope: SiteScope = "HQ", openOnly = false) {
  const rows = inScope(LONGSTAY_CASES, scope);
  return openOnly ? rows.filter((l) => l.stage !== "C7-closed") : rows;
}

/* ---- Phase 6 · dispatch, POD & closure (FC-08) ---- */

export function listPickSessions(scope: SiteScope = "HQ") {
  const ids = new Set(inScope(AWBS, scope).map((a) => a.AWBId));
  return PICK_SESSIONS.filter((s) => ids.has(s.awbId));
}

export function pickSessionFor(gatePassNo: number) {
  return PICK_SESSIONS.find((s) => s.gatePassNo === gatePassNo) ?? null;
}

export function listGateOutChecks(scope: SiteScope = "HQ", blockedOnly = false) {
  const passes = new Set(inScope(GATE_PASSES, scope).map((g) => g.GATEPASSNO));
  const rows = GATE_OUT_CHECKS.filter((c) => passes.has(c.gatePassNo));
  return blockedOnly ? rows.filter((c) => c.outcome === "blocked") : rows;
}

export function gateOutFor(gatePassNo: number) {
  return GATE_OUT_CHECKS.find((c) => c.gatePassNo === gatePassNo) ?? null;
}

export function listPods(scope: SiteScope = "HQ") {
  return inScope(PODS, scope);
}

export function listClosures(scope: SiteScope = "HQ") {
  const ids = new Set(inScope(AWBS, scope).map((a) => a.AWBId));
  return CLOSURES.filter((c) => ids.has(c.awbId));
}

/* ---- Phase 5 · charges, invoice, waiver, DO (FC-07) ---- */

export function listChargeCalculations(scope: SiteScope = "HQ") {
  const ids = new Set(inScope(AWBS, scope).map((a) => a.AWBId));
  return CHARGE_CALCULATIONS.filter((c) => ids.has(c.awbId));
}

export function listWaivers(scope: SiteScope = "HQ", pendingOnly = false) {
  const ids = new Set(inScope(AWBS, scope).map((a) => a.AWBId));
  const rows = WAIVER_REQUESTS.filter((w) => ids.has(w.awbId));
  return pendingOnly ? rows.filter((w) => waiverStatus(w.levels) === "pending") : rows;
}

export function listPayments(scope: SiteScope = "HQ", unreconciledOnly = false) {
  const rows = inScope(PAYMENTS, scope);
  return unreconciledOnly ? rows.filter((p) => !p.reconciled) : rows;
}

/** GR reprints — CMTS `GODOWNRENTDUPLICATE`, keyed by voucher not site. */
export function duplicatesFor(voucherNo: string) {
  return GR_DUPLICATES.filter((d) => d.VOUCHERNO === voucherNo);
}

export function paymentsFor(invoiceNo: string) {
  return PAYMENTS.filter((p) => p.invoiceNo === invoiceNo);
}

/* ---- Phase 4 · customs (FC-06) ---- */

export function listClearances(scope: SiteScope = "HQ", channel?: RiskChannel) {
  const rows = inScope(CUSTOMS_CLEARANCES, scope);
  return channel ? rows.filter((c) => c.channel === channel) : rows;
}

export function listCustomsIgms(scope: SiteScope = "HQ") {
  return inScope(CUSTOMS_IGMS, scope);
}

/** `AWBINFORMATION` has no site column — scope through the parent AWB. */
export function listAwbInformation(scope: SiteScope = "HQ") {
  const ids = new Set(inScope(AWBS, scope).map((a) => a.AWBId));
  return AWB_INFORMATION.filter((x) => ids.has(x.awbId));
}

/** Detend rows are the customs-detained sub-identities (CMTS `AwbDetendDetail`). */
export function listDetends(scope: SiteScope = "HQ", liveOnly = false) {
  const ids = new Set(inScope(AWBS, scope).map((a) => a.AWBId));
  const rows = DETENDS.filter((d) => ids.has(d.AwbId));
  return liveOnly ? rows.filter((d) => !d.releasedAt) : rows;
}

/** True when any part of this AWB is still detained — feeds the release gate. */
export function isDetained(awbId: number): boolean {
  return DETENDS.some((d) => d.AwbId === awbId && !d.releasedAt);
}

/** The FC-06 "eligible for release" gate for one AWB. */
export function clearanceGateFor(awbId: number) {
  const c = clearanceFor(awbId);
  if (!c) return null;
  return { clearance: c, ...evaluateClearance(c, { isDetained: isDetained(awbId) }) };
}

export function listIataMessages(scope: SiteScope = "HQ") {
  return inScope(IATA_MESSAGES, scope);
}

export function listNotifications(scope: SiteScope = "HQ") {
  return inScope(NOTIFICATION_DISPATCHES, scope);
}

export function listDocuments(scope: SiteScope = "HQ") {
  return inScope(DOCUMENTS, scope);
}

export function listPieces(scope: SiteScope = "HQ") {
  const ids = new Set(inScope(AWBS, scope).map((a) => a.AWBId));
  return PIECES.filter((p) => ids.has(p.awbId));
}

/** Storage divergence queue — logical ≠ physical (BLK-08). */
export function listDivergedLocations(scope: SiteScope = "HQ") {
  const inScopeAwbs = new Set(inScope(AWBS, scope).map((a) => a.AWBNO));
  return AWB_LOCATIONS.filter(
    (l) => inScopeAwbs.has(l.AWBNO) && l.LOGICALLOCATIONID !== l.PHYSICALLOCATIONID,
  );
}

/* ------------------------------------------------------------------ *
 * Portal KPIs — every dashboard should read these rather than
 * hard-coding numbers that then drift from the tables beneath them.
 * ------------------------------------------------------------------ */

export function portalKpis(scope: SiteScope = "HQ") {
  const awbs = inScope(AWBS, scope);
  const invoices = inScope(INVOICES, scope);
  const queue = inScope(EXCEPTION_QUEUE, scope);

  return {
    awbsTotal: awbs.length,
    awbsInWarehouse: awbs.filter((a) => hasReached(a.stage, "stored") && !hasReached(a.stage, "dispatched")).length,
    awbsAwaitingCustoms: awbs.filter((a) => a.stage === "customs").length,
    awbsOnHold: awbs.filter((a) => a.HOLDINGSTATUS).length,
    awbsDelivered: awbs.filter((a) => a.DELIVERED).length,
    piecesStored: listPieces(scope).filter((p) => p.scanState === "bound").length,
    exceptionsOpen: queue.length,
    exceptionsOverThreshold: queue.filter((q) => q.overThreshold).length,
    outstandingAmount: invoices.reduce((n, i) => n + i.outstanding, 0),
    collectedAmount: invoices.reduce((n, i) => n + i.paid, 0),
  };
}
