"use client";

/**
 * P5-3 / P5-4 · Godown Rent voucher — CMTS `GODOWNRENT` (75 cols) +
 * `GODOWNRENTDETAIL` (26) + `GODOWNRENTDUPLICATE` (10).
 *
 * Gap G9: the whole godown-rent calculation chain — six CMTS tables, 165
 * columns — had no screen. `/cmts-absorption/godown-rent-history` lists
 * vouchers but cannot open one.
 *
 * Three things this makes visible that the header alone cannot:
 *   • the **detail lines** the `sum*` columns are the sum of. A consignment
 *     split across two zones is charged at two location rates.
 *   • the **payment block** — CHALLANNO, PAYORDERNO, CHEQUENO, BANKNAME,
 *     ACCTITLE and friends had 0 occurrences in the pre-P0 demo.
 *   • **duplicates** — a reprint is a sequenced, chargeable event with a
 *     recorded reason, not a silent re-print.
 */

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Copy, FileText, Receipt, Wallet } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import EmptyState from "@/components/EmptyState";
import AwbLink from "@/components/awb/AwbLink";
import { AuditStrip, DocNumber } from "@/components/primitives";
import { useSite } from "@/components/site/SiteContext";
import {
  awbByNo,
  cargoClass,
  duplicatesFor,
  formatDate,
  formatKg,
  formatPkr,
  grDetailsFor,
  listGodownRents,
  storageLocation,
} from "@/lib/domain";

const BILL_TONE: Record<string, { bg: string; fg: string }> = {
  NORMAL: { bg: "#F1F5F9", fg: "#64748B" },
  SUPPLIMENT: { bg: "#FEF3C7", fg: "#D97706" },
  DUPLICATE: { bg: "#F5F3FF", fg: "#7C3AED" },
  FREEHAND: { bg: "#DBEAFE", fg: "#1B4F8B" },
};

export default function GodownRentPage() {
  const { scope, isHq } = useSite();
  const rents = useMemo(() => listGodownRents(scope), [scope]);

  const [selected, setSelected] = useState<string | null>(rents[0]?.VOUCHERNO ?? null);
  const g = rents.find((x) => x.VOUCHERNO === selected) ?? rents[0] ?? null;
  const lines = g ? grDetailsFor(g.VOUCHERNO) : [];
  const dups = g ? duplicatesFor(g.VOUCHERNO) : [];
  const awb = g ? awbByNo(g.AWBNO) : null;

  const [tab, setTab] = useState<"lines" | "payment" | "duplicates">("lines");

  const unpaid = rents.filter((r) => !r.PAID);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Breadcrumb items={[{ label: "Billing" }, { label: "Godown Rent" }]} />
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="h-[18px] px-1.5 rounded bg-[#EBF0F7] text-[#0B2545] text-[10px] font-bold inline-flex items-center font-mono">
              M11
            </span>
            <span className="h-[18px] px-1.5 rounded bg-[#F1F5F9] text-[#64748B] text-[10px] font-bold inline-flex items-center font-mono">
              GODOWNRENT 75 · DETAIL 26 · DUPLICATE 10
            </span>
            <span className="h-[18px] px-1.5 rounded bg-[#F5F3FF] text-[#7C3AED] text-[10px] font-bold inline-flex items-center font-mono">
              GAP G9
            </span>
          </div>
          <h1 className="text-[24px] lg:text-[32px] font-bold text-[#0F172A] leading-tight mt-1.5">
            Godown Rent Voucher
          </h1>
          <p className="text-[13px] text-[#64748B] mt-1">
            The voucher, its line breakdown, and how it was paid.
            {isHq ? " All sites." : ` ${scope} only.`}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Vouchers", value: String(rents.length), tone: "#0F172A" },
          { label: "Unpaid", value: String(unpaid.length), tone: "#DC2626" },
          {
            label: "Outstanding",
            value: formatPkr(unpaid.reduce((n, r) => n + r.NETPAYABLE, 0)),
            tone: "#D97706",
          },
          {
            label: "Waived",
            value: String(rents.filter((r) => r.WAIVEOFF).length),
            tone: "#7C3AED",
          },
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

      {rents.length === 0 ? (
        <EmptyState
          title="No vouchers at this site"
          description="A GR voucher issues once FC-07 charges are computed and the five release conditions are evaluated."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="rounded-[16px] border border-[#E2E8F0] bg-white overflow-hidden h-fit">
            <div className="px-5 py-3.5 border-b border-[#E2E8F0] flex items-center gap-2">
              <Receipt size={15} className="text-[#64748B]" />
              <h3 className="text-[14px] font-semibold text-[#0F172A]">Vouchers</h3>
            </div>
            <div className="max-h-[560px] overflow-y-auto">
              {rents.map((r) => (
                <button
                  key={r.VOUCHERNO}
                  onClick={() => setSelected(r.VOUCHERNO)}
                  className="w-full text-left px-5 py-3 border-b border-[#F1F5F9] last:border-0 hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                  style={{ backgroundColor: g?.VOUCHERNO === r.VOUCHERNO ? "#EBF0F7" : undefined }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[12px] font-semibold text-[#0F172A]">
                      {r.VOUCHERNO}
                    </span>
                    <span
                      className="h-[18px] px-1.5 rounded text-[9px] font-bold inline-flex items-center"
                      style={
                        r.PAID
                          ? { backgroundColor: "#DCFCE7", color: "#16A34A" }
                          : { backgroundColor: "#FEE2E2", color: "#DC2626" }
                      }
                    >
                      {r.PAID ? "PAID" : "UNPAID"}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#64748B] mt-0.5">
                    {r.AWBNO} · {formatPkr(r.NETPAYABLE)}
                  </p>
                  <p className="text-[11px] text-[#94A3B8] mt-0.5">
                    {formatDate(r.GRDATE)} · {r.DAYS}d
                  </p>
                </button>
              ))}
            </div>
          </div>

          {g && (
            <div className="lg:col-span-2 flex flex-col gap-5">
              {/* Header */}
              <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <DocNumber doc={g.docNumber} />
                      <span
                        className="h-[22px] px-2.5 rounded-full text-[10px] font-bold inline-flex items-center"
                        style={{
                        backgroundColor: BILL_TONE[g.BILLTYPE].bg,
                        color: BILL_TONE[g.BILLTYPE].fg,
                      }}
                      >
                        {g.BILLTYPE}
                      </span>
                      {g.WAIVEOFF && (
                        <span className="h-[22px] px-2.5 rounded-full bg-[#F5F3FF] text-[#7C3AED] text-[10px] font-bold inline-flex items-center">
                          WAIVED {g.WAIVEOFFPERCENT}%
                        </span>
                      )}
                    </div>
                    <p className="text-[12px] text-[#64748B] mt-1.5">
                      {awb && <AwbLink awbNo={awb.AWBNO} awbId={awb.AWBId} />}
                      {" · "}IGM {g.IGMNO} · {formatDate(g.FROMDATE)} → {formatDate(g.TODATE)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
                      Net payable
                    </p>
                    <p className="text-[22px] font-bold text-[#0B2545] font-mono">
                      {formatPkr(g.NETPAYABLE)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-4 pt-4 border-t border-[#F1F5F9]">
                  {(
                    [
                      ["CHALLANNO", g.CHALLANNO],
                      ["TOTALWEIGHT", formatKg(g.TOTALWEIGHT)],
                      ["CHARGEABLEWEIGHT", formatKg(g.CHARGEABLEWEIGHT)],
                      ["DAYS", String(g.DAYS)],
                      ["SUPPLIMENTDAYS", String(g.SUPPLIMENTDAYS)],
                      ["TOTALPIECES", String(g.TOTALPIECES)],
                      ["NTN", g.NTN],
                      ["STN", g.STN],
                    ] as const
                  ).map(([k, v]) => (
                    <div key={k} className="flex flex-col gap-1">
                      <span className="text-[9px] font-mono text-[#CBD5E1]">{k}</span>
                      <span
                        className="text-[13px] font-medium break-words"
                        style={{ color: v ? "#0F172A" : "#CBD5E1" }}
                      >
                        {v ?? "null"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-2 flex-wrap">
                {(
                  [
                    ["lines", `Detail lines (${lines.length})`],
                    ["payment", "Payment block"],
                    ["duplicates", `Duplicates (${dups.length})`],
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

              {tab === "lines" && (
                <div className="rounded-[16px] border border-[#E2E8F0] bg-white overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-[#E2E8F0]">
                    <h3 className="text-[14px] font-semibold text-[#0F172A]">
                      GODOWNRENTDETAIL — what the sum* columns are the sum of
                    </h3>
                    <p className="text-[11px] text-[#94A3B8] mt-0.5">
                      One line per class / subclass / location the consignment occupied.
                    </p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[860px]">
                      <thead>
                        <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                          {["Zone", "Class / Subclass", "Days", "Weight", "Handling", "Storage", "Location", "Ex-tax", "Tax", "Total"].map((h) => (
                            <th
                              key={h}
                              className="text-left px-3 py-2.5 text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider whitespace-nowrap"
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {lines.map((d) => (
                          <tr key={d.Id} className="border-b border-[#F1F5F9] last:border-0">
                            <td className="px-3 py-2.5 text-[12px] text-[#0F172A] font-medium whitespace-nowrap">
                              {storageLocation(d.LOCATIONID)?.ABBREVATION ?? d.LOCATIONID}
                            </td>
                            <td className="px-3 py-2.5 text-[12px] text-[#475569] whitespace-nowrap">
                              {cargoClass(d.CLASSID).ABBREVATION}
                              <span className="text-[#94A3B8]">
                                {" "}
                                / #{d.SUBCLASSID}
                              </span>
                            </td>
                            <td className="px-3 py-2.5 font-mono text-[12px] text-[#475569]">{d.DAYS}</td>
                            <td className="px-3 py-2.5 font-mono text-[12px] text-[#475569] whitespace-nowrap">
                              {formatKg(d.WEIGHT)}
                            </td>
                            <td className="px-3 py-2.5 font-mono text-[12px] text-[#475569] whitespace-nowrap">
                              {formatPkr(d.HandlingCharges)}
                            </td>
                            <td className="px-3 py-2.5 font-mono text-[12px] text-[#475569] whitespace-nowrap">
                              {formatPkr(d.StorgeUnitCharges)}
                            </td>
                            <td className="px-3 py-2.5 font-mono text-[12px] text-[#475569] whitespace-nowrap">
                              {formatPkr(d.LocationCharges)}
                            </td>
                            <td className="px-3 py-2.5 font-mono text-[12px] text-[#475569] whitespace-nowrap">
                              {formatPkr(d.TotalAmountWithoutTax)}
                            </td>
                            <td className="px-3 py-2.5 font-mono text-[12px] text-[#475569] whitespace-nowrap">
                              {formatPkr(d.Tax)}
                            </td>
                            <td className="px-3 py-2.5 font-mono text-[13px] font-semibold text-[#0F172A] whitespace-nowrap">
                              {formatPkr(d.TotalAmountWithTax)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="px-5 py-3 bg-[#F8FAFC] border-t border-[#E2E8F0] grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-2">
                    {(
                      [
                        ["sumHandlingCharges", g.sumHandlingCharges],
                        ["sumStorgeUnitCharges", g.sumStorgeUnitCharges],
                        ["sumLocationChargesAmount", g.sumLocationChargesAmount],
                        ["sumTax", g.sumTax],
                      ] as const
                    ).map(([k, v]) => (
                      <div key={k}>
                        <p className="text-[9px] font-mono text-[#CBD5E1]">{k}</p>
                        <p className="font-mono text-[12px] font-semibold text-[#0F172A]">
                          {formatPkr(v)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {tab === "payment" && (
                <div className="rounded-[16px] border border-[#E2E8F0] bg-white overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-[#E2E8F0] flex items-center gap-2">
                    <Wallet size={15} className="text-[#64748B]" />
                    <div>
                      <h3 className="text-[14px] font-semibold text-[#0F172A]">Payment block</h3>
                      <p className="text-[11px] text-[#94A3B8]">
                        These CMTS columns had 0 occurrences in the demo before Phase 5
                      </p>
                    </div>
                  </div>
                  <div className="p-5 grid grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-4">
                    {(
                      [
                        ["PAID", g.PAID ? "true" : "false"],
                        ["Paymode", g.Paymode],
                        ["PAYDATE", g.PAYDATE ? formatDate(g.PAYDATE) : null],
                        ["CASHAMOUNT", g.CASH ? formatPkr(g.CASHAMOUNT) : null],
                        ["PAYORDERNO", g.PAYORDERNO],
                        ["PAYORDERAMOUNT", g.PayOrder ? formatPkr(g.PAYORDERAMOUNT) : null],
                        ["CHEQUENO", g.CHEQUENO ? String(g.CHEQUENO) : null],
                        ["CHEQUEDATE", g.CHEQUEDATE ? formatDate(g.CHEQUEDATE) : null],
                        ["BANKNAME", g.BANKNAME],
                        ["BANKBRANCHNAME", g.BANKBRANCHNAME],
                        ["ACCTITLE", g.ACCTITLE],
                        ["ACCNO", g.ACCNO],
                        ["CREDITCARD", g.CREDITCARD],
                        ["RECIEVEDBY", g.RECIEVEDBY],
                        ["OverPaidAmount", g.OverPaidAmount ? formatPkr(g.OverPaidAmount) : null],
                      ] as const
                    ).map(([k, v]) => (
                      <div key={k} className="flex flex-col gap-1">
                        <span className="text-[9px] font-mono text-[#CBD5E1]">{k}</span>
                        <span
                          className="text-[13px] font-medium break-words"
                          style={{ color: v ? "#0F172A" : "#CBD5E1" }}
                        >
                          {v ?? "null"}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="px-5 py-3 bg-[#F8FAFC] border-t border-[#E2E8F0]">
                    <p className="text-[11px] text-[#64748B]">
                      FC-07 adds cash-less payment via gateway with auto-reconciliation. The legacy
                      instruments above still need manual reconciliation — both paths coexist during
                      the rollout.
                    </p>
                  </div>
                </div>
              )}

              {tab === "duplicates" && (
                <div className="rounded-[16px] border border-[#E2E8F0] bg-white overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-[#E2E8F0] flex items-center gap-2">
                    <Copy size={15} className="text-[#64748B]" />
                    <div>
                      <h3 className="text-[14px] font-semibold text-[#0F172A]">
                        Duplicate reprints — GODOWNRENTDUPLICATE
                      </h3>
                      <p className="text-[11px] text-[#94A3B8]">
                        DUPLICATECOUNT on the header: {g.DUPLICATECOUNT}
                      </p>
                    </div>
                  </div>
                  {dups.length === 0 ? (
                    <p className="p-5 text-[12px] text-[#94A3B8]">
                      No reprints issued against this voucher.
                    </p>
                  ) : (
                    <div className="divide-y divide-[#F1F5F9]">
                      {dups.map((d) => (
                        <div key={d.SEQUENCENO} className="px-5 py-3.5">
                          <div className="flex items-center justify-between gap-3 flex-wrap">
                            <span className="text-[12px] font-semibold text-[#0F172A]">
                              Sequence #{d.SEQUENCENO} · {formatDate(d.DUPLICATEDATE)}
                            </span>
                            <span className="font-mono text-[13px] font-semibold text-[#0F172A]">
                              {formatPkr(d.DuplicateTotalAmount)}
                            </span>
                          </div>
                          <p className="text-[12px] text-[#475569] mt-1">{d.COMMENTS}</p>
                          <p className="text-[11px] text-[#94A3B8] mt-0.5">
                            {formatPkr(d.DuplicateAmount)} + {d.DuplicateTaxPercen}% tax ·{" "}
                            {d.USERID}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="px-5 py-3 bg-[#F8FAFC] border-t border-[#E2E8F0]">
                    <p className="text-[11px] text-[#64748B]">
                      A reprint is a sequenced, chargeable event with a recorded reason — not a
                      silent re-print. That is what makes the count on the header defensible.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 flex-wrap">
                <Link
                  href="/billing/calculator"
                  className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#1B4F8B] no-underline hover:underline"
                >
                  <FileText size={12} /> How this was calculated <ArrowUpRight size={12} />
                </Link>
                <Link
                  href="/billing/delivery-order"
                  className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#1B4F8B] no-underline hover:underline"
                >
                  Delivery order & release gate <ArrowUpRight size={12} />
                </Link>
              </div>

              <AuditStrip record={g} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
