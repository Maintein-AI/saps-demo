"use client";

/**
 * P7-1 · IATA Cargo-IMP message console — M07, FC-05.
 *
 * The demo covers ULD messaging (UCM/SCM/LUC) on `/uld-message-builder`,
 * but the thirteen Cargo-IMP status messages FC-05 actually wires had no
 * console at all: four pre-arrival (FFM, FWB, FHL, NOTOC) and nine status
 * (RCF, NFD, AWD, DIS, DLV, RCT, TFD, DEP, TGC).
 *
 * Two things the console has to show that a message log does not:
 *   • **pre-arrival completeness per flight** — a missing FHL on a
 *     consolidation means the house breakdown never arrived, so FC-01
 *     indexation cannot proceed. That is a flight-level fact, not a
 *     message-level one.
 *   • **failures**, prominently. A queued FFM that silently failed is the
 *     kind of thing nobody notices until the cargo is on the ramp.
 */

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, PlaneLanding, Radio, RefreshCw, XCircle } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import EmptyState from "@/components/EmptyState";
import AwbLink from "@/components/awb/AwbLink";
import { GatewayCard } from "@/components/primitives";
import { useSite } from "@/components/site/SiteContext";
import {
  GATEWAYS,
  IATA_MESSAGE_LABEL,
  PRE_ARRIVAL_MESSAGES,
  STATUS_MESSAGES,
  formatDateTime,
  listIataMessages,
  listManifests,
  type IataMessageType,
} from "@/lib/domain";

const STATUS_TONE: Record<string, { bg: string; fg: string }> = {
  sent: { bg: "#DCFCE7", fg: "#16A34A" },
  received: { bg: "#DBEAFE", fg: "#1B4F8B" },
  queued: { bg: "#FEF3C7", fg: "#D97706" },
  failed: { bg: "#FEE2E2", fg: "#DC2626" },
  acknowledged: { bg: "#DCFCE7", fg: "#16A34A" },
};

export default function IataConsolePage() {
  const { scope, isHq } = useSite();
  const messages = useMemo(() => listIataMessages(scope), [scope]);
  const manifests = useMemo(() => listManifests(scope), [scope]);

  const [typeFilter, setTypeFilter] = useState<IataMessageType | "all">("all");
  const [failedOnly, setFailedOnly] = useState(false);

  const visible = messages.filter(
    (m) => (typeFilter === "all" || m.type === typeFilter) && (!failedOnly || m.status === "failed"),
  );
  const failed = messages.filter((m) => m.status === "failed");
  const sita = GATEWAYS.find((g) => g.code === "sita");

  const countFor = (t: IataMessageType) => messages.filter((m) => m.type === t).length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Breadcrumb items={[{ label: "Messaging" }, { label: "IATA Cargo-IMP" }]} />
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="h-[18px] px-1.5 rounded bg-[#EBF0F7] text-[#0B2545] text-[10px] font-bold inline-flex items-center font-mono">
              M07
            </span>
            <span className="h-[18px] px-1.5 rounded bg-[#F1F5F9] text-[#64748B] text-[10px] font-bold inline-flex items-center font-mono">
              FC-05 · 13 message types via SITA
            </span>
          </div>
          <h1 className="text-[24px] lg:text-[32px] font-bold text-[#0F172A] leading-tight mt-1.5">
            IATA Cargo-IMP Console
          </h1>
          <p className="text-[13px] text-[#64748B] mt-1">
            Pre-arrival completeness per flight, and every status message with its outcome.
            {isHq ? " All sites." : ` ${scope} only.`}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { label: "Messages", value: String(messages.length), tone: "#0F172A" },
            { label: "Failed", value: String(failed.length), tone: "#DC2626" },
            {
              label: "Queued",
              value: String(messages.filter((m) => m.status === "queued").length),
              tone: "#D97706",
            },
          ].map((k) => (
            <div key={k.label} className="rounded-[16px] border border-[#E2E8F0] bg-white p-5">
              <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
                {k.label}
              </p>
              <p className="text-[22px] font-bold mt-1" style={{ color: k.tone }}>
                {k.value}
              </p>
            </div>
          ))}
        </div>
        {sita && <GatewayCard gateway={sita} />}
      </div>

      {/* Pre-arrival completeness — a flight-level fact */}
      <div className="rounded-[16px] border border-[#E2E8F0] bg-white overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[#E2E8F0] flex items-center gap-2">
          <PlaneLanding size={15} className="text-[#64748B]" />
          <div>
            <h3 className="text-[14px] font-semibold text-[#0F172A]">
              Pre-arrival completeness — FC-05 group A
            </h3>
            <p className="text-[11px] text-[#94A3B8] mt-0.5">
              A missing FHL on a consolidation means the house breakdown never arrived — FC-01
              indexation cannot proceed without it.
            </p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                {["Flight", "IGM", ...PRE_ARRIVAL_MESSAGES, "Complete"].map((h) => (
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
              {manifests.map((m) => {
                const all = PRE_ARRIVAL_MESSAGES.every((t) => m.messages[t].received);
                return (
                  <tr key={m.ManifiestId} className="border-b border-[#F1F5F9] last:border-0">
                    <td className="px-4 py-3 font-mono text-[12px] font-semibold text-[#0F172A]">
                      {m.FLIGHT}
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px] text-[#64748B]">{m.IGMNO}</td>
                    {PRE_ARRIVAL_MESSAGES.map((t) => {
                      const r = m.messages[t];
                      return (
                        <td key={t} className="px-4 py-3">
                          <span
                            className="h-[22px] px-2 rounded-full text-[10px] font-bold inline-flex items-center"
                            style={
                              r.received
                                ? { backgroundColor: "#DCFCE7", color: "#16A34A" }
                                : { backgroundColor: "#FEE2E2", color: "#DC2626" }
                            }
                            title={r.receivedAt ? formatDateTime(r.receivedAt) : "not received"}
                          >
                            {r.received ? "✓" : "—"}
                          </span>
                        </td>
                      );
                    })}
                    <td className="px-4 py-3">
                      <span
                        className="h-[22px] px-2.5 rounded-full text-[10px] font-bold inline-flex items-center"
                        style={
                          all
                            ? { backgroundColor: "#DCFCE7", color: "#16A34A" }
                            : { backgroundColor: "#FEF3C7", color: "#D97706" }
                        }
                      >
                        {all ? "COMPLETE" : "INCOMPLETE"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Type filter */}
      <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5">
        <h3 className="text-[14px] font-semibold text-[#0F172A] mb-1">
          Message types — all thirteen
        </h3>
        <p className="text-[11px] text-[#94A3B8] mb-3">
          Four pre-arrival, nine status. A type with no traffic is still a type the system must be
          able to send.
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setTypeFilter("all")}
            className="h-[28px] px-3 rounded-full text-[11px] font-semibold border transition-colors cursor-pointer"
            style={{
              backgroundColor: typeFilter === "all" ? "#0B2545" : "#FFFFFF",
              color: typeFilter === "all" ? "#FFFFFF" : "#475569",
              borderColor: typeFilter === "all" ? "#0B2545" : "#E2E8F0",
            }}
          >
            All ({messages.length})
          </button>
          {[...PRE_ARRIVAL_MESSAGES, ...STATUS_MESSAGES].map((t) => {
            const n = countFor(t);
            const active = typeFilter === t;
            const pre = (PRE_ARRIVAL_MESSAGES as readonly string[]).includes(t);
            return (
              <button
                key={t}
                onClick={() => setTypeFilter(active ? "all" : t)}
                title={IATA_MESSAGE_LABEL[t]}
                className="h-[28px] px-3 rounded-full text-[11px] font-semibold border transition-colors cursor-pointer font-mono"
                style={{
                  backgroundColor: active ? "#1B4F8B" : n === 0 ? "#F8FAFC" : pre ? "#EBF0F7" : "#FFFFFF",
                  color: active ? "#FFFFFF" : n === 0 ? "#CBD5E1" : "#1B4F8B",
                  borderColor: active ? "#1B4F8B" : "#E2E8F0",
                }}
              >
                {t} {n > 0 && <span className="opacity-70">· {n}</span>}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={() => setFailedOnly(!failedOnly)}
          className="h-8 px-3.5 rounded-lg text-[12px] font-semibold border transition-colors cursor-pointer inline-flex items-center gap-1.5"
          style={{
            backgroundColor: failedOnly ? "#DC2626" : "#FFFFFF",
            color: failedOnly ? "#FFFFFF" : "#475569",
            borderColor: failedOnly ? "#DC2626" : "#E2E8F0",
          }}
        >
          <XCircle size={12} />
          Failed only
        </button>
        <span className="text-[12px] text-[#94A3B8]">
          {visible.length} of {messages.length} shown
        </span>
      </div>

      {visible.length === 0 ? (
        <EmptyState
          title="No messages match"
          description="Messages are raised by the trigger map — nine operational events fan out to IATA and customer notifications."
        />
      ) : (
        <div className="rounded-[16px] border border-[#E2E8F0] bg-white overflow-hidden">
          <div className="px-5 py-3.5 border-b border-[#E2E8F0] flex items-center gap-2">
            <Radio size={15} className="text-[#64748B]" />
            <h3 className="text-[14px] font-semibold text-[#0F172A]">Message log</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[880px]">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                  {["Type", "Dir", "AWB", "Flight", "Trigger", "Status", "Timestamp"].map((h) => (
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
                {visible.slice(0, 60).map((m) => {
                  const tone = STATUS_TONE[m.status] ?? STATUS_TONE.queued;
                  return (
                    <tr
                      key={m.id}
                      className="border-b border-[#F1F5F9] last:border-0"
                      style={{ backgroundColor: m.status === "failed" ? "#FEF2F2" : undefined }}
                    >
                      <td className="px-4 py-2.5">
                        <span
                          className="h-[22px] px-2 rounded text-[11px] font-bold font-mono inline-flex items-center"
                          style={{ backgroundColor: "#EBF0F7", color: "#1B4F8B" }}
                          title={IATA_MESSAGE_LABEL[m.type]}
                        >
                          {m.type}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-[11px] text-[#64748B] uppercase">
                        {m.direction}
                      </td>
                      <td className="px-4 py-2.5">
                        {m.awbId ? (
                          <AwbLink awbNo={m.AWBNO ?? ""} awbId={m.awbId} />
                        ) : (
                          <span className="text-[12px] text-[#94A3B8]">—</span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 font-mono text-[11px] text-[#475569]">
                        {m.FLIGHT ?? "—"}
                      </td>
                      <td className="px-4 py-2.5 text-[11px] text-[#64748B]">{m.trigger ?? "—"}</td>
                      <td className="px-4 py-2.5">
                        <span
                          className="h-[22px] px-2.5 rounded-full text-[10px] font-bold inline-flex items-center uppercase"
                          style={{ backgroundColor: tone.bg, color: tone.fg }}
                        >
                          {m.status}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-[11px] text-[#94A3B8] whitespace-nowrap">
                        {formatDateTime(m.timestamp)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {visible.length > 60 && (
            <div className="px-5 py-3 bg-[#F8FAFC] border-t border-[#E2E8F0]">
              <p className="text-[11px] text-[#64748B]">
                Showing the first 60 of {visible.length}. Filter by type to narrow.
              </p>
            </div>
          )}
        </div>
      )}

      {failed.length > 0 && (
        <div className="rounded-[16px] border border-[#FCA5A5] bg-[#FEF2F2] px-5 py-4 flex items-start gap-3">
          <RefreshCw size={16} className="text-[#DC2626] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-[13px] font-semibold text-[#DC2626]">
              {failed.length} message{failed.length === 1 ? "" : "s"} failed and can be re-sent
            </p>
            <p className="text-[12px] text-[#991B1B] mt-0.5">
              {failed.map((f) => `${f.type} · ${f.failureReason ?? "no reason recorded"}`).join(" — ")}
            </p>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 flex-wrap">
        <Link
          href="/messaging/notifications"
          className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#1B4F8B] no-underline hover:underline"
        >
          Notification engine &amp; trigger map <ArrowUpRight size={12} />
        </Link>
        <Link
          href="/uld-message-builder"
          className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#1B4F8B] no-underline hover:underline"
        >
          ULD messaging (UCM / SCM / LUC) <ArrowUpRight size={12} />
        </Link>
      </div>
    </div>
  );
}
