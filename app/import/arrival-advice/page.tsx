"use client";

/**
 * P1-8 · Arrival Advice & NOA generation.
 *
 * FC-01 §18 "Notice of Arrival (NOA) to Consignee / CHA" — the trigger that
 * starts FC-06 (`01. NOA Sent to Consignee / CHA`) and appears in FC-05's
 * customer notification group.
 *
 * `AWBARRIVALADVICE` (15 cols) is the CMTS document and was **entirely
 * absent** — "Arrival Advice" returned 0 hits. The demo had the consignee's
 * NOA inbox but nothing that issues the advice.
 */

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Mail, MessageSquare, Send, Smartphone } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import AwbLink from "@/components/awb/AwbLink";
import { DocNumber } from "@/components/primitives";
import { useSite } from "@/components/site/SiteContext";
import {
  ARRIVAL_ADVICES,
  PARTIES,
  formatDate,
  formatDateTime,
  formatKg,
  listAwbs,
  type Channel,
} from "@/lib/domain";

const CHANNEL_ICON: Record<Channel, typeof Mail> = {
  email: Mail,
  sms: Smartphone,
  whatsapp: MessageSquare,
};

export default function ArrivalAdvicePage() {
  const { scope } = useSite();
  const scoped = useMemo(() => listAwbs({ scope }), [scope]);
  const scopedNos = useMemo(() => new Set(scoped.map((a) => a.AWBNO)), [scoped]);

  const issued = useMemo(
    () => ARRIVAL_ADVICES.filter((a) => scopedNos.has(a.AWBNO)),
    [scopedNos],
  );

  // Awaiting issue: stored but not yet notified.
  const pending = useMemo(
    () => scoped.filter((a) => a.stage === "stored" && !issued.some((x) => x.AWBNO === a.AWBNO)),
    [scoped, issued],
  );

  const [selected, setSelected] = useState<number>(issued[0]?.AdviceNumber ?? 0);
  const advice = issued.find((a) => a.AdviceNumber === selected) ?? issued[0];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Breadcrumb items={[{ label: "Import Documentation" }, { label: "Arrival Advice / NOA" }]} />
        <div>
          <div className="flex items-center gap-2">
            <span className="h-[18px] px-1.5 rounded bg-[#EBF0F7] text-[#0B2545] text-[10px] font-bold inline-flex items-center font-mono">
              M03 → M08
            </span>
            <span className="h-[18px] px-1.5 rounded bg-[#F1F5F9] text-[#64748B] text-[10px] font-bold inline-flex items-center font-mono">
              FC-01 §18 · FC-06 §01
            </span>
          </div>
          <h1 className="text-[24px] lg:text-[32px] font-bold text-[#0F172A] leading-tight mt-1.5">
            Arrival Advice &amp; NOA
          </h1>
          <p className="text-[13px] text-[#64748B] mt-1">
            Generated from the indexed AWB and dispatched to consignee, CHA and agent — the event
            that starts the customs clearance clock.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Advices issued", value: issued.length, tone: "#0F172A" },
          { label: "Awaiting issue", value: pending.length, tone: pending.length ? "#D97706" : "#16A34A" },
          { label: "Dispatches", value: issued.reduce((n, a) => n + a.dispatchedTo.length, 0), tone: "#1B4F8B" },
          {
            label: "Read receipts",
            value: issued.reduce((n, a) => n + a.dispatchedTo.filter((d) => d.readAt).length, 0),
            tone: "#7C3AED",
          },
        ].map((k) => (
          <div key={k.label} className="rounded-[16px] border border-[#E2E8F0] bg-white p-5">
            <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
              {k.label}
            </p>
            <p className="text-[26px] font-bold mt-1" style={{ color: k.tone }}>
              {k.value}
            </p>
          </div>
        ))}
      </div>

      {/* Awaiting issue */}
      {pending.length > 0 && (
        <div className="rounded-[16px] border border-[#FDE68A] bg-[#FFFBEB] p-5">
          <p className="text-[14px] font-semibold text-[#D97706]">
            {pending.length} stored AWB{pending.length === 1 ? "" : "s"} without an arrival advice
          </p>
          <p className="text-[12px] text-[#92400E] mt-1">
            FC-05 wires &ldquo;Cargo Warehoused&rdquo; to both NFD and NOA — the advice should follow storage.
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            {pending.map((a) => (
              <div
                key={a.AWBId}
                className="flex items-center gap-2 h-9 pl-3 pr-1 rounded-lg bg-white border border-[#FDE68A]"
              >
                <AwbLink awbNo={a.AWBNO} awbId={a.AWBId} className="font-mono text-[12px] font-semibold text-[#92400E] no-underline" />
                <button className="h-7 px-2.5 rounded-md bg-[#0B2545] text-white text-[11px] font-semibold cursor-pointer inline-flex items-center gap-1">
                  <Send size={11} /> Issue
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {issued.length === 0 ? (
        <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-8 text-center">
          <p className="text-[14px] font-semibold text-[#0F172A]">No advices issued at {scope}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Register */}
          <div className="rounded-[16px] border border-[#E2E8F0] bg-white overflow-hidden lg:col-span-1">
            <div className="px-5 py-3.5 border-b border-[#E2E8F0]">
              <h3 className="text-[14px] font-semibold text-[#0F172A]">Issued advices</h3>
            </div>
            <div className="max-h-[520px] overflow-y-auto">
              {issued.map((a) => (
                <button
                  key={a.AdviceNumber}
                  onClick={() => setSelected(a.AdviceNumber)}
                  className="w-full text-left px-5 py-3 border-b border-[#F1F5F9] last:border-0 hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                  style={{ backgroundColor: selected === a.AdviceNumber ? "#EBF0F7" : undefined }}
                >
                  <p className="font-mono text-[12px] font-semibold text-[#0F172A]">
                    {a.docNumber.value}
                  </p>
                  <p className="text-[12px] text-[#64748B] mt-0.5 truncate">{a.ConsigneeName}</p>
                  <p className="text-[11px] text-[#94A3B8] mt-0.5">
                    {a.AWBNO} · {formatDate(a.ADVICEDATE)}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Detail */}
          {advice && (
            <div className="lg:col-span-2 flex flex-col gap-5">
              <div className="rounded-[16px] border border-[#E2E8F0] bg-white overflow-hidden">
                <div className="px-5 py-3.5 border-b border-[#E2E8F0] flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <h3 className="text-[14px] font-semibold text-[#0F172A]">Arrival advice</h3>
                    <p className="text-[11px] text-[#94A3B8] mt-0.5">
                      CMTS AWBARRIVALADVICE — 15 columns
                    </p>
                  </div>
                  <DocNumber doc={advice.docNumber} />
                </div>

                <div className="p-5 grid grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-4">
                  {(
                    [
                      ["AdviceNumber", String(advice.AdviceNumber)],
                      ["ADVICEDATE", formatDate(advice.ADVICEDATE)],
                      ["SAPSNO", advice.SAPSNO],
                      ["IGMNO", advice.IGMNO],
                      ["AWBNO", advice.AWBNO],
                      ["SEQUENCE", advice.SEQUENCE],
                      ["AIRLINENAME", advice.AIRLINENAME],
                      ["FLIGHT", advice.FLIGHT],
                      ["ArrivalDate", formatDate(advice.ArrivalDate)],
                      ["TOTALPCS", String(advice.TOTALPCS)],
                      ["TOTALWEIGHT", formatKg(advice.TOTALWEIGHT)],
                      ["Cityid", String(advice.Cityid)],
                      ["ConsigneeName", advice.ConsigneeName],
                      ["ConsigneeAdd", advice.ConsigneeAdd],
                      ["Goods", advice.Goods],
                    ] as const
                  ).map(([k, v]) => (
                    <div key={k} className="flex flex-col gap-1">
                      <span className="text-[9px] font-mono text-[#CBD5E1]">{k}</span>
                      <span className="text-[13px] font-medium text-[#0F172A] break-words">{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dispatch — FC-05 multi-channel with receipts */}
              <div className="rounded-[16px] border border-[#E2E8F0] bg-white overflow-hidden">
                <div className="px-5 py-3.5 border-b border-[#E2E8F0]">
                  <h3 className="text-[14px] font-semibold text-[#0F172A]">Dispatch</h3>
                  <p className="text-[11px] text-[#94A3B8] mt-0.5">
                    FC-05 amendment — multi-channel Email / SMS / WhatsApp with delivery and read
                    receipts, per recipient
                  </p>
                </div>
                <div className="p-5 flex flex-col gap-2">
                  {advice.dispatchedTo.map((d, i) => {
                    const party = PARTIES.find((p) => p.ID === d.partyId);
                    const Icon = CHANNEL_ICON[d.channel];
                    return (
                      <div
                        key={i}
                        className="flex items-center gap-3 rounded-xl border border-[#E2E8F0] px-4 py-3"
                      >
                        <Icon size={15} className="text-[#64748B] flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-medium text-[#0F172A] truncate">
                            {party?.NAME ?? `Party ${d.partyId}`}
                          </p>
                          <p className="text-[11px] text-[#94A3B8]">
                            {d.channel} · sent {formatDateTime(d.sentAt)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span
                            className="h-[20px] px-2 rounded text-[10px] font-bold inline-flex items-center"
                            style={{
                              backgroundColor: d.deliveredAt ? "#DCFCE7" : "#FEF3C7",
                              color: d.deliveredAt ? "#16A34A" : "#D97706",
                            }}
                          >
                            {d.deliveredAt ? "delivered" : "pending"}
                          </span>
                          {d.readAt && (
                            <span className="h-[20px] px-2 rounded text-[10px] font-bold inline-flex items-center bg-[#DBEAFE] text-[#1B4F8B]">
                              read
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="px-5 pb-5 flex items-center gap-3 flex-wrap">
                  <Link
                    href="/consignee/notice-of-arrival"
                    className="inline-flex items-center gap-1 h-9 px-3 rounded-lg border border-[#E2E8F0] text-[12px] font-semibold text-[#1B4F8B] no-underline"
                  >
                    Consignee NOA inbox <ArrowUpRight size={12} />
                  </Link>
                  <Link
                    href="/import/documents"
                    className="inline-flex items-center gap-1 h-9 px-3 rounded-lg border border-[#E2E8F0] text-[12px] font-semibold text-[#1B4F8B] no-underline"
                  >
                    Document repository <ArrowUpRight size={12} />
                  </Link>
                  <button className="h-9 px-3 rounded-lg border border-[#E2E8F0] text-[12px] font-semibold text-[#64748B] cursor-pointer">
                    Re-issue with reason
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
