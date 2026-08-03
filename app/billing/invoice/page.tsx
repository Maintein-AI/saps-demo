"use client";

/**
 * P5-5 / P5-6 · Invoice, cash-less payment reconciliation, and the waiver
 * approval chain.
 *
 * Two FC-07 amendments drive this screen:
 *
 *   "Payment cash-less via gateway, auto-reconciled."
 *      Gateway transactions reconcile themselves; legacy instruments
 *      (pay order, cheque, challan, bank transfer) do not. Both paths run
 *      during the rollout, so the reconciliation queue is the real output —
 *      not the payment list.
 *
 *   "Waiver / adjustment runs role-based multi-level approval + full audit
 *    → credit note / revised invoice."
 *      A waiver is not a field on the voucher. It is a request that walks an
 *      approval chain, and every level is attributable.
 */

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowLeftRight, BadgePercent, Landmark, ReceiptText } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import EmptyState from "@/components/EmptyState";
import AwbLink from "@/components/awb/AwbLink";
import { ApprovalStepper, DocNumber } from "@/components/primitives";
import { useSite } from "@/components/site/SiteContext";
import {
  WAIVER_REASON_LABEL,
  awbById,
  formatDate,
  formatPkr,
  listInvoices,
  listPayments,
  listWaivers,
  paymentsFor,
  waiverStatus,
} from "@/lib/domain";

const STATUS_TONE: Record<string, { bg: string; fg: string }> = {
  draft: { bg: "#F1F5F9", fg: "#64748B" },
  issued: { bg: "#DBEAFE", fg: "#1B4F8B" },
  "part-paid": { bg: "#FEF3C7", fg: "#D97706" },
  paid: { bg: "#DCFCE7", fg: "#16A34A" },
  overdue: { bg: "#FEE2E2", fg: "#DC2626" },
  credited: { bg: "#F5F3FF", fg: "#7C3AED" },
};

export default function InvoicePage() {
  const { scope, isHq } = useSite();
  const invoices = useMemo(() => listInvoices(scope), [scope]);
  const payments = useMemo(() => listPayments(scope), [scope]);
  const waivers = useMemo(() => listWaivers(scope), [scope]);

  const [tab, setTab] = useState<"invoices" | "reconciliation" | "waivers">("invoices");
  const [selected, setSelected] = useState<string | null>(invoices[0]?.invoiceNo ?? null);
  const inv = invoices.find((x) => x.invoiceNo === selected) ?? invoices[0] ?? null;

  const unreconciled = payments.filter((p) => !p.reconciled);
  const outstanding = invoices.reduce((n, i) => n + i.outstanding, 0);
  const pendingWaivers = waivers.filter((w) => waiverStatus(w.levels) === "pending");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Breadcrumb items={[{ label: "Billing" }, { label: "Invoice & Waiver" }]} />
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="h-[18px] px-1.5 rounded bg-[#EBF0F7] text-[#0B2545] text-[10px] font-bold inline-flex items-center font-mono">
              M11
            </span>
            <span className="h-[18px] px-1.5 rounded bg-[#F1F5F9] text-[#64748B] text-[10px] font-bold inline-flex items-center font-mono">
              FC-07 §09–12
            </span>
          </div>
          <h1 className="text-[24px] lg:text-[32px] font-bold text-[#0F172A] leading-tight mt-1.5">
            Invoice, Payment &amp; Waiver
          </h1>
          <p className="text-[13px] text-[#64748B] mt-1">
            Cash-less payments reconcile themselves; legacy instruments do not — the queue is what
            matters.
            {isHq ? " All sites." : ` ${scope} only.`}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Invoices", value: String(invoices.length), tone: "#0F172A" },
          { label: "Outstanding", value: formatPkr(outstanding), tone: "#DC2626" },
          { label: "Awaiting reconciliation", value: String(unreconciled.length), tone: "#D97706" },
          { label: "Waivers pending approval", value: String(pendingWaivers.length), tone: "#7C3AED" },
        ].map((k) => (
          <div key={k.label} className="rounded-[16px] border border-[#E2E8F0] bg-white p-5">
            <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
              {k.label}
            </p>
            <p className="text-[18px] font-bold mt-1" style={{ color: k.tone }}>
              {k.value}
            </p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {(
          [
            ["invoices", `Invoices (${invoices.length})`],
            ["reconciliation", `Reconciliation (${unreconciled.length} open)`],
            ["waivers", `Waivers (${waivers.length})`],
          ] as const
        ).map(([v, label]) => (
          <button
            key={v}
            onClick={() => setTab(v)}
            className="h-8 px-3.5 rounded-lg text-[12px] font-semibold border transition-colors cursor-pointer"
            style={{
              backgroundColor: tab === v ? "#0B2545" : "#FFFFFF",
              color: tab === v ? "#FFFFFF" : "#475569",
              borderColor: tab === v ? "#0B2545" : "#E2E8F0",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ---------- Invoices ---------- */}
      {tab === "invoices" &&
        (invoices.length === 0 ? (
          <EmptyState title="No invoices at this site" description="An invoice issues from the GR voucher once charges are computed." />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="rounded-[16px] border border-[#E2E8F0] bg-white overflow-hidden h-fit">
              <div className="px-5 py-3.5 border-b border-[#E2E8F0] flex items-center gap-2">
                <ReceiptText size={15} className="text-[#64748B]" />
                <h3 className="text-[14px] font-semibold text-[#0F172A]">Invoices</h3>
              </div>
              <div className="max-h-[520px] overflow-y-auto">
                {invoices.map((x) => (
                  <button
                    key={x.invoiceNo}
                    onClick={() => setSelected(x.invoiceNo)}
                    className="w-full text-left px-5 py-3 border-b border-[#F1F5F9] last:border-0 hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                    style={{ backgroundColor: inv?.invoiceNo === x.invoiceNo ? "#EBF0F7" : undefined }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[12px] font-semibold text-[#0F172A]">
                        {x.invoiceNo}
                      </span>
                      <span
                        className="h-[18px] px-1.5 rounded text-[9px] font-bold inline-flex items-center uppercase"
                        style={{
                          backgroundColor: STATUS_TONE[x.status].bg,
                          color: STATUS_TONE[x.status].fg,
                        }}
                      >
                        {x.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#64748B] mt-0.5">
                      {x.AWBNO} · {formatPkr(x.total)}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {inv && (
              <div className="lg:col-span-2 flex flex-col gap-5">
                <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <DocNumber doc={inv.docNumber} />
                      <p className="text-[12px] text-[#64748B] mt-1.5">
                        <AwbLink awbNo={inv.AWBNO} awbId={inv.awbId} /> · issued{" "}
                        {formatDate(inv.issuedAt)} · due {formatDate(inv.dueAt)}
                      </p>
                    </div>
                    <span
                      className="h-[22px] px-2.5 rounded-full text-[10px] font-bold inline-flex items-center uppercase"
                      style={{
                        backgroundColor: STATUS_TONE[inv.status].bg,
                        color: STATUS_TONE[inv.status].fg,
                      }}
                    >
                      {inv.status}
                    </span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-[#F1F5F9] grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      ["Sub-total", formatPkr(inv.subTotal), "#334155"],
                      ["Tax", formatPkr(inv.taxAmount), "#334155"],
                      ["Total", formatPkr(inv.total), "#0F172A"],
                      [
                        "Outstanding",
                        formatPkr(inv.outstanding),
                        inv.outstanding > 0 ? "#DC2626" : "#16A34A",
                      ],
                    ].map(([l, v, tone]) => (
                      <div key={l as string}>
                        <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
                          {l as string}
                        </p>
                        <p
                          className="text-[16px] font-bold mt-0.5 font-mono"
                          style={{ color: tone as string }}
                        >
                          {v as string}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[16px] border border-[#E2E8F0] bg-white overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-[#E2E8F0]">
                    <h3 className="text-[14px] font-semibold text-[#0F172A]">Payments received</h3>
                  </div>
                  {paymentsFor(inv.invoiceNo).length === 0 ? (
                    <p className="p-5 text-[12px] text-[#94A3B8]">Nothing received yet.</p>
                  ) : (
                    <div className="divide-y divide-[#F1F5F9]">
                      {paymentsFor(inv.invoiceNo).map((p) => (
                        <div key={p.id} className="px-5 py-3.5 flex items-start justify-between gap-3 flex-wrap">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[13px] font-semibold text-[#0F172A]">
                                {formatPkr(p.amount)}
                              </span>
                              <span className="h-[18px] px-1.5 rounded bg-[#F1F5F9] text-[#64748B] text-[9px] font-bold inline-flex items-center">
                                {p.mode}
                              </span>
                              <span
                                className="h-[18px] px-1.5 rounded text-[9px] font-bold inline-flex items-center"
                                style={
                                  p.reconciled
                                    ? { backgroundColor: "#DCFCE7", color: "#16A34A" }
                                    : { backgroundColor: "#FEF3C7", color: "#D97706" }
                                }
                              >
                                {p.reconciled ? "AUTO-RECONCILED" : "NEEDS RECONCILIATION"}
                              </span>
                            </div>
                            <p className="font-mono text-[11px] text-[#94A3B8] mt-1">
                              {p.gatewayRef ?? p.payOrderNo ?? p.challanNo ??
                                (p.chequeNo ? `Cheque ${p.chequeNo}` : "—")}
                              {p.bankName ? ` · ${p.bankName}` : ""}
                            </p>
                          </div>
                          <span className="text-[11px] text-[#94A3B8]">{formatDate(p.paidAt)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

      {/* ---------- Reconciliation ---------- */}
      {tab === "reconciliation" && (
        <div className="rounded-[16px] border border-[#E2E8F0] bg-white overflow-hidden">
          <div className="px-5 py-3.5 border-b border-[#E2E8F0] flex items-center gap-2">
            <ArrowLeftRight size={15} className="text-[#64748B]" />
            <div>
              <h3 className="text-[14px] font-semibold text-[#0F172A]">Reconciliation queue</h3>
              <p className="text-[11px] text-[#94A3B8]">
                Gateway transactions auto-reconcile. Everything below is a legacy instrument that
                does not.
              </p>
            </div>
          </div>
          {unreconciled.length === 0 ? (
            <p className="p-5 text-[12px] text-[#94A3B8]">
              Nothing awaiting reconciliation — every payment at this site came through the gateway.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px]">
                <thead>
                  <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                    {["Invoice", "Amount", "Mode", "Instrument", "Bank", "Received", "Site"].map((h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-2.5 text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {unreconciled.map((p) => (
                    <tr key={p.id} className="border-b border-[#F1F5F9] last:border-0">
                      <td className="px-4 py-3 font-mono text-[12px] text-[#0F172A]">{p.invoiceNo}</td>
                      <td className="px-4 py-3 font-mono text-[12px] font-semibold text-[#0F172A] whitespace-nowrap">
                        {formatPkr(p.amount)}
                      </td>
                      <td className="px-4 py-3">
                        <span className="h-[20px] px-2 rounded bg-[#FEF3C7] text-[#D97706] text-[10px] font-bold inline-flex items-center">
                          {p.mode}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-[11px] text-[#475569]">
                        {p.payOrderNo ?? p.challanNo ?? (p.chequeNo ? String(p.chequeNo) : "—")}
                      </td>
                      <td className="px-4 py-3 text-[12px] text-[#475569]">{p.bankName ?? "—"}</td>
                      <td className="px-4 py-3 text-[12px] text-[#475569] whitespace-nowrap">
                        {formatDate(p.paidAt)}
                      </td>
                      <td className="px-4 py-3 text-[12px] text-[#64748B]">{p.site}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="px-5 py-3 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-start gap-2.5">
            <Landmark size={14} className="text-[#64748B] flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-[#64748B]">
              The FC-07 amendment&apos;s point is that this queue should shrink to zero as payment
              moves to the gateway. Its length is the migration metric.
            </p>
          </div>
        </div>
      )}

      {/* ---------- Waivers ---------- */}
      {tab === "waivers" &&
        (waivers.length === 0 ? (
          <EmptyState
            title="No waiver requests at this site"
            description="A waiver is raised against a GR voucher and walks a role-based approval chain before any credit note issues."
          />
        ) : (
          <div className="flex flex-col gap-5">
            {waivers.map((w) => {
              const status = waiverStatus(w.levels);
              const a = awbById(w.awbId);
              return (
                <div
                  key={w.id}
                  className="rounded-[16px] border border-[#E2E8F0] bg-white overflow-hidden"
                >
                  <div className="px-5 py-3.5 border-b border-[#E2E8F0] flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <BadgePercent size={14} className="text-[#7C3AED]" />
                        {a && <AwbLink awbNo={a.AWBNO} awbId={a.AWBId} />}
                        <span className="h-[20px] px-2 rounded bg-[#F5F3FF] text-[#7C3AED] text-[10px] font-bold inline-flex items-center">
                          {WAIVER_REASON_LABEL[w.reason]}
                        </span>
                      </div>
                      <p className="text-[12px] text-[#64748B] mt-1.5">
                        Voucher{" "}
                        <span className="font-mono font-semibold text-[#0F172A]">{w.voucherNo}</span>{" "}
                        · requested by {w.requestedBy} on {formatDate(w.requestedAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
                        Waiver
                      </p>
                      <p className="text-[16px] font-bold text-[#7C3AED] font-mono">
                        {formatPkr(w.amount)}
                      </p>
                      <span
                        className="h-[18px] px-1.5 rounded text-[9px] font-bold inline-flex items-center uppercase mt-1"
                        style={
                          status === "approved"
                            ? { backgroundColor: "#DCFCE7", color: "#16A34A" }
                            : status === "rejected"
                              ? { backgroundColor: "#FEE2E2", color: "#DC2626" }
                              : { backgroundColor: "#FEF3C7", color: "#D97706" }
                        }
                      >
                        {status}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <ApprovalStepper
                      levels={w.levels}
                      title="Role-based approval chain"
                      note="Every level is attributable. A credit note issues only when the chain completes — FC-07 §12."
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ))}

      <div className="flex items-center gap-3 flex-wrap">
        <Link
          href="/billing/godown-rent"
          className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#1B4F8B] no-underline hover:underline"
        >
          Godown rent vouchers <ArrowUpRight size={12} />
        </Link>
        <Link
          href="/billing/delivery-order"
          className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#1B4F8B] no-underline hover:underline"
        >
          Delivery order & release gate <ArrowUpRight size={12} />
        </Link>
      </div>
    </div>
  );
}
