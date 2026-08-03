"use client";

/**
 * P3-6 · Long-stay / Section 82 — FC-10-C. (M18)
 *
 * CMTS carries `AWBSECTION82` (22 cols) and a `Section82Days` config table,
 * but nothing schedules the statutory notices and nothing records what
 * finally happened to the cargo. The FC-10 amendment closes both gaps:
 *
 *   • "The dwell clock (FC-07) auto-fires the long-stay alert and drives
 *      the Section 82 statutory timeline" — the alert is derived, not typed.
 *   • "Notices to consignee / CHA / airline scheduled automatically" — each
 *      notice has a due date and goes overdue on its own.
 *   • Three final dispositions, two of which (auction, disposal) need
 *      fields CMTS has nowhere to put.
 *
 * Section82Days is per-site configurable and still open as BLK-07.
 */

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertOctagon,
  ArrowUpRight,
  Building2,
  CalendarClock,
  Gavel,
  Trash2,
  Unlock,
} from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import EmptyState from "@/components/EmptyState";
import AwbLink from "@/components/awb/AwbLink";
import StageRail, { type RailStep } from "@/components/exceptions/StageRail";
import { AgingBadge, AuditStrip, DocNumber } from "@/components/primitives";
import { useSite } from "@/components/site/SiteContext";
import {
  DISPOSITION_LABEL,
  LONGSTAY_STAGE_LABEL,
  awbById,
  cargoClass,
  formatDate,
  formatDateTime,
  formatPkr,
  listLongStay,
  type Disposition,
  type LongStayStage,
} from "@/lib/domain";

const STAGE_ORDER: LongStayStage[] = [
  "C1-not-cleared",
  "C2-alert-triggered",
  "C3-parties-notified",
  "C4-escalated-customs",
  "C5-section-82",
  "C6-disposition-recorded",
  "C7-closed",
];

const DISPOSITION_META: Record<
  Disposition,
  { Icon: typeof Gavel; tone: string; bg: string; fields: string[] }
> = {
  "release-after-clearance": {
    Icon: Unlock,
    tone: "#16A34A",
    bg: "#F0FDF4",
    fields: [],
  },
  auction: {
    Icon: Gavel,
    tone: "#D97706",
    bg: "#FFFBEB",
    fields: ["auctionLotNo", "auctionReserve", "auctionDate", "auctionProceeds"],
  },
  "disposal-destruction": {
    Icon: Trash2,
    tone: "#DC2626",
    bg: "#FEF2F2",
    fields: ["disposalMethod", "disposalAuthorisedBy", "disposalCertificateNo"],
  },
};

/** The 22-column `AWBSECTION82` specifics that have no other home. */
const S82_COLUMNS = [
  "Examiner",
  "ReceivingPerson",
  "DCNumber",
  "Sequences",
  "SubIndex",
  "Lock",
] as const;

export default function LongStayPage() {
  const { scope, isHq } = useSite();
  const cases = useMemo(() => listLongStay(scope), [scope]);

  const [selectedId, setSelectedId] = useState<number | null>(cases[0]?.id ?? null);
  const c = cases.find((x) => x.id === selectedId) ?? cases[0] ?? null;

  const [draftDisposition, setDraftDisposition] = useState<Disposition | null>(null);
  const disposition = c?.disposition ?? draftDisposition;

  const overdueNotices = cases.reduce(
    (n, x) => n + x.notices.filter((v) => v.status === "overdue").length,
    0,
  );
  const pastDeadline = cases.filter((x) => x.daysToDeadline < 0);

  const rail: RailStep[] = c
    ? STAGE_ORDER.map((s) => ({
        key: s,
        label: LONGSTAY_STAGE_LABEL[s],
        detail:
          s === "C1-not-cleared"
            ? `Arrived ${formatDate(c.arrivedAt)} · ${c.ageDays} days ago`
            : s === "C2-alert-triggered"
              ? `Auto-fired by the FC-07 dwell clock at ${c.section82Days} days`
              : s === "C3-parties-notified"
                ? `${c.notices.filter((n) => n.sentAt).length} of ${c.notices.length} notices sent`
                : s === "C4-escalated-customs" && c.escalatedToCustomsAt
                  ? formatDateTime(c.escalatedToCustomsAt)
                  : s === "C5-section-82" && c.DCNumber
                    ? `DC ${c.DCNumber} · examiner ${c.Examiner ?? "—"}`
                    : s === "C6-disposition-recorded" && c.disposition
                      ? DISPOSITION_LABEL[c.disposition]
                      : s === "C7-closed" && c.closedAt
                        ? formatDateTime(c.closedAt)
                        : null,
      }))
    : [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Breadcrumb items={[{ label: "Exceptions" }, { label: "Long-stay / Section 82" }]} />
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="h-[18px] px-1.5 rounded bg-[#EBF0F7] text-[#0B2545] text-[10px] font-bold inline-flex items-center font-mono">
              M18
            </span>
            <span className="h-[18px] px-1.5 rounded bg-[#F1F5F9] text-[#64748B] text-[10px] font-bold inline-flex items-center font-mono">
              FC-10-C · AWBSECTION82 (22 cols)
            </span>
          </div>
          <h1 className="text-[24px] lg:text-[32px] font-bold text-[#0F172A] leading-tight mt-1.5">
            Long-stay &amp; Section 82
          </h1>
          <p className="text-[13px] text-[#64748B] mt-1">
            Cargo past the statutory clearance period. Notices schedule themselves; the final
            disposition is recorded against the AWB.
            {isHq ? " All sites." : ` ${scope} only.`}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Long-stay cases", value: String(cases.length), tone: "#0F172A" },
          { label: "Past statutory deadline", value: String(pastDeadline.length), tone: "#DC2626" },
          { label: "Overdue notices", value: String(overdueNotices), tone: "#D97706" },
          {
            label: "Awaiting disposition",
            value: String(cases.filter((x) => !x.disposition).length),
            tone: "#7C3AED",
          },
        ].map((k) => (
          <div key={k.label} className="rounded-[16px] border border-[#E2E8F0] bg-white p-5">
            <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
              {k.label}
            </p>
            <p className="text-[24px] font-bold mt-1" style={{ color: k.tone }}>
              {k.value}
            </p>
          </div>
        ))}
      </div>

      {cases.length === 0 ? (
        <EmptyState
          title="No long-stay cases at this site"
          description="The FC-07 dwell clock fires this branch automatically once an AWB passes its site's Section 82 threshold."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="rounded-[16px] border border-[#E2E8F0] bg-white overflow-hidden">
            <div className="px-5 py-3.5 border-b border-[#E2E8F0] flex items-center gap-2">
              <CalendarClock size={15} className="text-[#64748B]" />
              <h3 className="text-[14px] font-semibold text-[#0F172A]">Case register</h3>
            </div>
            <div className="max-h-[560px] overflow-y-auto">
              {cases.map((x) => {
                const awb = awbById(x.awbId);
                return (
                  <button
                    key={x.id}
                    onClick={() => {
                      setSelectedId(x.id);
                      setDraftDisposition(null);
                    }}
                    className="w-full text-left px-5 py-3 border-b border-[#F1F5F9] last:border-0 hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                    style={{ backgroundColor: c?.id === x.id ? "#EBF0F7" : undefined }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[12px] font-semibold text-[#0F172A]">
                        {x.AWBNO}
                      </span>
                      {awb && (
                        <AgingBadge
                          totalDays={x.ageDays}
                          freeDays={cargoClass(awb.CARGOCLASSID).freeDays}
                          section82Days={x.section82Days}
                          compact
                        />
                      )}
                    </div>
                    <p className="text-[11px] text-[#64748B] mt-1 leading-snug">
                      {LONGSTAY_STAGE_LABEL[x.stage]}
                    </p>
                    <p className="text-[11px] text-[#94A3B8] mt-0.5">
                      {x.ageDays}d dwell ·{" "}
                      {x.daysToDeadline < 0
                        ? `${Math.abs(x.daysToDeadline)}d past deadline`
                        : `${x.daysToDeadline}d to deadline`}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {c && (
            <div className="lg:col-span-2 flex flex-col gap-5">
              {/* Statutory clock */}
              <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <AwbLink awbNo={c.AWBNO} awbId={c.awbId} />
                    <p className="text-[12px] text-[#64748B] mt-1.5">
                      IGM {c.IGMNO} · arrived {formatDate(c.arrivedAt)}
                      {c.HWBNo ? ` · HAWB ${c.HWBNo}` : ""}
                    </p>
                  </div>
                  <span
                    className="h-[26px] px-3 rounded-full text-[11px] font-bold inline-flex items-center gap-1.5"
                    style={{
                      backgroundColor: c.daysToDeadline < 0 ? "#FEE2E2" : "#FEF3C7",
                      color: c.daysToDeadline < 0 ? "#DC2626" : "#D97706",
                    }}
                  >
                    <AlertOctagon size={12} />
                    {c.daysToDeadline < 0
                      ? `${Math.abs(c.daysToDeadline)} days past deadline`
                      : `${c.daysToDeadline} days remaining`}
                  </span>
                </div>

                {/* Dwell bar against the statutory threshold */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-[11px] text-[#64748B] mb-1.5">
                    <span>Dwell {c.ageDays} days</span>
                    <span>Section 82 at {c.section82Days} days</span>
                  </div>
                  <div className="relative h-[10px] rounded-full bg-[#F1F5F9] overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 bg-[#D97706]"
                      style={{
                        width: `${Math.min(100, (c.section82Days / Math.max(c.ageDays, c.section82Days)) * 100)}%`,
                      }}
                    />
                    <div
                      className="absolute inset-y-0 bg-[#DC2626]"
                      style={{
                        left: `${Math.min(100, (c.section82Days / Math.max(c.ageDays, c.section82Days)) * 100)}%`,
                        width: `${Math.max(0, ((c.ageDays - c.section82Days) / Math.max(c.ageDays, c.section82Days)) * 100)}%`,
                      }}
                    />
                  </div>
                  <p className="text-[11px] text-[#94A3B8] mt-1.5">
                    Threshold comes from CMTS `Section82Days`, configurable per site. The per-site
                    value is still open as BLK-07 — the demo applies {c.section82Days} days
                    everywhere.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                <StageRail
                  steps={rail}
                  currentKey={c.stage}
                  title="FC-10-C progress"
                  tone="#D97706"
                  note="C2 is fired by the FC-07 dwell clock, not typed by an operator. C3 fans out through the notification engine (M08)."
                />

                {/* AWBSECTION82 specifics */}
                <div className="rounded-[16px] border border-[#E2E8F0] bg-white overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-[#E2E8F0] flex items-center gap-2">
                    <Building2 size={15} className="text-[#64748B]" />
                    <div>
                      <h3 className="text-[14px] font-semibold text-[#0F172A]">
                        Section 82 record
                      </h3>
                      <p className="text-[11px] text-[#94A3B8]">CMTS AWBSECTION82 specifics</p>
                    </div>
                  </div>
                  <div className="p-5 grid grid-cols-2 gap-x-5 gap-y-4">
                    {S82_COLUMNS.map((k) => {
                      const raw = c[k];
                      const v = typeof raw === "boolean" ? String(raw) : raw;
                      return (
                        <div key={k} className="flex flex-col gap-1">
                          <span className="text-[9px] font-mono text-[#CBD5E1]">{k}</span>
                          <span
                            className="text-[13px] font-medium break-words"
                            style={{ color: v ? "#0F172A" : "#CBD5E1" }}
                          >
                            {v ?? "null"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Auto-scheduled statutory notices */}
              <div className="rounded-[16px] border border-[#E2E8F0] bg-white overflow-hidden">
                <div className="px-5 py-3.5 border-b border-[#E2E8F0]">
                  <h3 className="text-[14px] font-semibold text-[#0F172A]">
                    Statutory notices — §C3
                  </h3>
                  <p className="text-[11px] text-[#94A3B8] mt-0.5">
                    Scheduled automatically off the statutory deadline. Each carries its own
                    document number continuing the CMTS sequence.
                  </p>
                </div>
                <div className="divide-y divide-[#F1F5F9]">
                  {c.notices.map((n) => {
                    const tone =
                      n.status === "sent"
                        ? { bg: "#DCFCE7", fg: "#16A34A" }
                        : n.status === "overdue"
                          ? { bg: "#FEE2E2", fg: "#DC2626" }
                          : { bg: "#F1F5F9", fg: "#64748B" };
                    return (
                      <div
                        key={n.id}
                        className="px-5 py-3.5 flex items-start justify-between gap-3 flex-wrap"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <DocNumber doc={n.docNumber} />
                            <span
                              className="h-[20px] px-2 rounded-full text-[10px] font-bold inline-flex items-center uppercase"
                              style={{ backgroundColor: tone.bg, color: tone.fg }}
                            >
                              {n.status}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#64748B] mt-1">
                            Due {formatDate(n.dueAt)} ({n.dueOffsetDays}d before deadline) ·
                            recipients: {n.recipients.join(", ")}
                          </p>
                        </div>
                        <span className="text-[11px] text-[#94A3B8] whitespace-nowrap">
                          {n.sentAt ? `Sent ${formatDate(n.sentAt)}` : "Not sent"}
                        </span>
                      </div>
                    );
                  })}
                </div>
                {c.notices.some((n) => n.status === "overdue") && (
                  <div className="px-5 py-3 bg-[#FEF2F2] border-t border-[#FECACA]">
                    <p className="text-[12px] text-[#B91C1C]">
                      An overdue statutory notice is a compliance exposure, not a reminder — the
                      disposition cannot be defended without a complete notice trail.
                    </p>
                  </div>
                )}
              </div>

              {/* §C6 disposition */}
              <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5">
                <h3 className="text-[14px] font-semibold text-[#0F172A]">
                  Final disposition — §C6
                </h3>
                <p className="text-[11px] text-[#94A3B8] mt-0.5 mb-3">
                  Three outcomes. Auction and disposal each need a field set that CMTS has nowhere
                  to record.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                  {(Object.keys(DISPOSITION_LABEL) as Disposition[]).map((d) => {
                    const meta = DISPOSITION_META[d];
                    const active = disposition === d;
                    return (
                      <button
                        key={d}
                        onClick={() => setDraftDisposition(d)}
                        className="text-left rounded-xl border px-4 py-3 transition-colors cursor-pointer hover:border-[#94A3B8]"
                        style={{
                          borderColor: active ? meta.tone : "#E2E8F0",
                          backgroundColor: active ? meta.bg : "#FFFFFF",
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <meta.Icon size={14} style={{ color: active ? meta.tone : "#94A3B8" }} />
                          <p
                            className="text-[13px] font-semibold"
                            style={{ color: active ? meta.tone : "#0F172A" }}
                          >
                            {DISPOSITION_LABEL[d]}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {meta.fields.length === 0 ? (
                            <span className="text-[11px] text-[#94A3B8]">
                              No extra fields — rejoins FC-07 charging
                            </span>
                          ) : (
                            meta.fields.map((f) => (
                              <span
                                key={f}
                                className="h-[18px] px-1.5 rounded bg-[#F1F5F9] text-[#64748B] text-[9px] font-mono inline-flex items-center"
                              >
                                {f}
                              </span>
                            ))
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Field detail for whichever disposition is in play */}
                {disposition && DISPOSITION_META[disposition].fields.length > 0 && (
                  <div className="mt-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                    <p className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-3">
                      {DISPOSITION_LABEL[disposition]} record
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-4">
                      {disposition === "auction"
                        ? (
                            [
                              ["auctionLotNo", c.auctionLotNo],
                              [
                                "auctionReserve",
                                c.auctionReserve === null ? null : formatPkr(c.auctionReserve),
                              ],
                              ["auctionDate", c.auctionDate ? formatDate(c.auctionDate) : null],
                              [
                                "auctionProceeds",
                                c.auctionProceeds === null ? null : formatPkr(c.auctionProceeds),
                              ],
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
                          ))
                        : (
                            [
                              ["disposalMethod", c.disposalMethod],
                              ["disposalAuthorisedBy", c.disposalAuthorisedBy],
                              ["disposalCertificateNo", c.disposalCertificateNo],
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
                )}

                {!c.disposition && (
                  <p className="text-[11px] text-[#D97706] mt-3 pt-3 border-t border-[#F1F5F9]">
                    No disposition recorded — the case is at{" "}
                    {LONGSTAY_STAGE_LABEL[c.stage].split(". ")[0]}. Selecting above previews the
                    required field set; nothing is persisted.
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <Link
                  href="/exceptions/queue"
                  className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#1B4F8B] no-underline hover:underline"
                >
                  Aging dashboard <ArrowUpRight size={12} />
                </Link>
                <Link
                  href="/flows/FC-10"
                  className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#1B4F8B] no-underline hover:underline"
                >
                  FC-10 walkthrough <ArrowUpRight size={12} />
                </Link>
              </div>

              <AuditStrip record={c} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
