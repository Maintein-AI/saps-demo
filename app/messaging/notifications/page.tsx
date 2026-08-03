"use client";

/**
 * P7-2 / P7-3 / P7-4 · Notification engine, trigger map, and the notify
 * party — M08, FC-05.
 *
 * Three things here.
 *
 * **Templates (P7-2).** CMTS has no template table; notifications were free
 * text typed per send, which is why no two NOAs ever read the same. They are
 * versioned, because a template edit must not retroactively change what a
 * dispatch three months ago actually said.
 *
 * **Trigger map (P7-3).** FC-05 wires nine operational events to their
 * message fan-out. Three group-C notifications appear on the board but are
 * never wired to a trigger — rendering them as an explicit gap is more
 * useful than reproducing the chart faithfully and leaving them dangling.
 *
 * **Notify party (P7-4).** AWB 816-00034156 in the SAPS document set carries
 * TWO notify parties: Relizon Pharmaceuticals (the operating company) and
 * Meezan Bank (the financing party). FC-05 addresses the NOA to
 * "Consignee / CHA" and has no concept of either, and CMTS has no notify
 * party column at all — so on a financed import the people actually waiting
 * for the cargo are not on the notification list.
 */

import { useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowUpRight, Bell, CheckCheck, Send, Users, Zap } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import EmptyState from "@/components/EmptyState";
import AwbLink from "@/components/awb/AwbLink";
import { useSite } from "@/components/site/SiteContext";
import {
  CHANNEL_LABEL,
  CUSTOMER_NOTIFICATION_LABEL,
  IATA_MESSAGE_LABEL,
  NOTIFICATION_TEMPLATES,
  REFERENCE_AWB_DOCUMENTS,
  TRIGGER_MAP,
  UNWIRED_NOTIFICATIONS,
  formatDateTime,
  listNotifications,
  type Channel,
  type CustomerNotification,
} from "@/lib/domain";

const STATUS_TONE: Record<string, { bg: string; fg: string }> = {
  queued: { bg: "#F1F5F9", fg: "#64748B" },
  sent: { bg: "#DBEAFE", fg: "#1B4F8B" },
  delivered: { bg: "#DCFCE7", fg: "#16A34A" },
  read: { bg: "#EBF0F7", fg: "#0B2545" },
  failed: { bg: "#FEE2E2", fg: "#DC2626" },
};

export default function NotificationsPage() {
  const { scope, isHq } = useSite();
  const dispatches = useMemo(() => listNotifications(scope), [scope]);

  const [tab, setTab] = useState<"triggers" | "templates" | "history" | "notify">("triggers");
  const [tplNotification, setTplNotification] = useState<CustomerNotification>("NOA");

  const failed = dispatches.filter((d) => d.status === "failed");
  const read = dispatches.filter((d) => d.status === "read");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Breadcrumb items={[{ label: "Messaging" }, { label: "Notification Engine" }]} />
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="h-[18px] px-1.5 rounded bg-[#EBF0F7] text-[#0B2545] text-[10px] font-bold inline-flex items-center font-mono">
              M07 · M08
            </span>
            <span className="h-[18px] px-1.5 rounded bg-[#F1F5F9] text-[#64748B] text-[10px] font-bold inline-flex items-center font-mono">
              FC-05
            </span>
          </div>
          <h1 className="text-[24px] lg:text-[32px] font-bold text-[#0F172A] leading-tight mt-1.5">
            Notification Engine
          </h1>
          <p className="text-[13px] text-[#64748B] mt-1">
            What fires what, what it says, who received it — and who should have.
            {isHq ? " All sites." : ` ${scope} only.`}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Triggers wired", value: `${TRIGGER_MAP.length}`, tone: "#0F172A" },
          { label: "Unwired notifications", value: `${UNWIRED_NOTIFICATIONS.length}`, tone: "#D97706" },
          { label: "Dispatches", value: String(dispatches.length), tone: "#1B4F8B" },
          { label: "Failed", value: String(failed.length), tone: "#DC2626" },
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

      <div className="flex items-center gap-2 flex-wrap">
        {(
          [
            ["triggers", "Trigger map"],
            ["templates", `Templates (${NOTIFICATION_TEMPLATES.length})`],
            ["history", `History (${dispatches.length})`],
            ["notify", "Notify party"],
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

      {/* ---------- Trigger map ---------- */}
      {tab === "triggers" && (
        <div className="flex flex-col gap-5">
          <div className="rounded-[16px] border border-[#E2E8F0] bg-white overflow-hidden">
            <div className="px-5 py-3.5 border-b border-[#E2E8F0] flex items-center gap-2">
              <Zap size={15} className="text-[#64748B]" />
              <div>
                <h3 className="text-[14px] font-semibold text-[#0F172A]">
                  Nine operational events and their fan-out
                </h3>
                <p className="text-[11px] text-[#94A3B8] mt-0.5">
                  One event can raise both an IATA message and a customer notification.
                </p>
              </div>
            </div>
            <div className="divide-y divide-[#F1F5F9]">
              {TRIGGER_MAP.map((t) => (
                <div key={t.trigger} className="px-5 py-4">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[13px] font-semibold text-[#0F172A]">{t.label}</span>
                        <span className="h-[18px] px-1.5 rounded bg-[#F1F5F9] text-[#64748B] text-[10px] font-semibold inline-flex items-center">
                          {t.source}
                        </span>
                        {!t.enabled && (
                          <span className="h-[18px] px-1.5 rounded bg-[#FEE2E2] text-[#DC2626] text-[10px] font-bold inline-flex items-center">
                            DISABLED
                          </span>
                        )}
                      </div>
                      <p className="font-mono text-[10px] text-[#CBD5E1] mt-0.5">{t.trigger}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {t.iata.map((m) => (
                        <span
                          key={m}
                          title={IATA_MESSAGE_LABEL[m]}
                          className="h-[24px] px-2.5 rounded-full bg-[#EBF0F7] text-[#1B4F8B] text-[11px] font-bold font-mono inline-flex items-center gap-1"
                        >
                          <Send size={10} />
                          {m}
                        </span>
                      ))}
                      {t.customer.map((c) => (
                        <span
                          key={c}
                          className="h-[24px] px-2.5 rounded-full bg-[#DCFCE7] text-[#16A34A] text-[11px] font-semibold inline-flex items-center gap-1"
                        >
                          <Bell size={10} />
                          {CUSTOMER_NOTIFICATION_LABEL[c]}
                        </span>
                      ))}
                      {t.iata.length === 0 && t.customer.length === 0 && (
                        <span className="text-[11px] text-[#94A3B8]">no fan-out</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[16px] border border-[#FDE68A] bg-[#FFFBEB] overflow-hidden">
            <div className="px-5 py-3.5 border-b border-[#FDE68A] flex items-center gap-2">
              <AlertTriangle size={15} className="text-[#D97706]" />
              <div>
                <h3 className="text-[14px] font-semibold text-[#D97706]">
                  Listed on the board but never wired to a trigger
                </h3>
                <p className="text-[11px] text-[#92400E] mt-0.5">
                  FC-05 names these three group-C notifications but no event raises them. Proposed
                  sources below — needs SAPS confirmation.
                </p>
              </div>
            </div>
            <div className="divide-y divide-[#FDE68A]">
              {UNWIRED_NOTIFICATIONS.map((u) => (
                <div key={u.notification} className="px-5 py-3.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="h-[22px] px-2.5 rounded-full bg-white text-[#D97706] text-[11px] font-semibold inline-flex items-center border border-[#FDE68A]">
                      {CUSTOMER_NOTIFICATION_LABEL[u.notification]}
                    </span>
                    <span className="text-[11px] text-[#92400E]">→ {u.proposedSource}</span>
                  </div>
                  <p className="text-[12px] text-[#92400E] mt-1">{u.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ---------- Templates ---------- */}
      {tab === "templates" && (
        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap gap-2">
            {(Object.keys(CUSTOMER_NOTIFICATION_LABEL) as CustomerNotification[]).map((n) => (
              <button
                key={n}
                onClick={() => setTplNotification(n)}
                className="h-8 px-3 rounded-lg text-[11px] font-semibold border transition-colors cursor-pointer"
                style={{
                  backgroundColor: tplNotification === n ? "#1B4F8B" : "#FFFFFF",
                  color: tplNotification === n ? "#FFFFFF" : "#475569",
                  borderColor: tplNotification === n ? "#1B4F8B" : "#E2E8F0",
                }}
              >
                {CUSTOMER_NOTIFICATION_LABEL[n]}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {(["email", "sms", "whatsapp"] as Channel[]).map((ch) => {
              const t = NOTIFICATION_TEMPLATES.find(
                (x) => x.notification === tplNotification && x.channel === ch,
              );
              if (!t) return null;
              return (
                <div key={ch} className="rounded-[16px] border border-[#E2E8F0] bg-white overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-[#E2E8F0] flex items-center justify-between gap-2">
                    <h3 className="text-[13px] font-semibold text-[#0F172A]">
                      {CHANNEL_LABEL[ch]}
                    </h3>
                    <span className="h-[20px] px-2 rounded bg-[#F1F5F9] text-[#64748B] text-[10px] font-bold font-mono inline-flex items-center">
                      v{t.version}
                    </span>
                  </div>
                  <div className="p-5">
                    {t.Subject && (
                      <>
                        <p className="text-[10px] font-mono text-[#CBD5E1]">SUBJECT</p>
                        <p className="text-[12px] font-semibold text-[#0F172A] mb-3">{t.Subject}</p>
                      </>
                    )}
                    <p className="text-[10px] font-mono text-[#CBD5E1]">BODY</p>
                    <pre className="text-[11px] text-[#475569] whitespace-pre-wrap font-sans mt-1 leading-relaxed">
                      {t.Body}
                    </pre>
                    <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-[#F1F5F9]">
                      {t.variables.map((v) => (
                        <span
                          key={v}
                          className="h-[18px] px-1.5 rounded bg-[#EBF0F7] text-[#1B4F8B] text-[9px] font-mono inline-flex items-center"
                        >
                          {`{{${v}}}`}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-[11px] text-[#94A3B8]">
            Templates are versioned and a dispatch records the template it used — so editing a
            template never changes what an earlier notification actually said. CMTS has no template
            table; this is an AirVault addition.
          </p>
        </div>
      )}

      {/* ---------- History ---------- */}
      {tab === "history" &&
        (dispatches.length === 0 ? (
          <EmptyState title="No dispatches at this site" description="Notifications fire from the trigger map." />
        ) : (
          <div className="rounded-[16px] border border-[#E2E8F0] bg-white overflow-hidden">
            <div className="px-5 py-3.5 border-b border-[#E2E8F0] flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <CheckCheck size={15} className="text-[#64748B]" />
                <div>
                  <h3 className="text-[14px] font-semibold text-[#0F172A]">
                    Dispatch history &amp; receipts
                  </h3>
                  <p className="text-[11px] text-[#94A3B8]">
                    Delivery and read receipts — CMTS records neither
                  </p>
                </div>
              </div>
              <span className="text-[11px] text-[#64748B]">
                {read.length} read · {failed.length} failed
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                    {["Notification", "Channel", "AWB", "Recipient", "Destination", "Status", "Sent", "Read"].map((h) => (
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
                  {dispatches.slice(0, 50).map((d) => {
                    const tone = STATUS_TONE[d.status] ?? STATUS_TONE.queued;
                    return (
                      <tr
                        key={d.Id}
                        className="border-b border-[#F1F5F9] last:border-0"
                        style={{ backgroundColor: d.status === "failed" ? "#FEF2F2" : undefined }}
                      >
                        <td className="px-4 py-2.5 text-[12px] text-[#0F172A] whitespace-nowrap">
                          {CUSTOMER_NOTIFICATION_LABEL[d.notification]}
                        </td>
                        <td className="px-4 py-2.5 text-[11px] text-[#64748B]">
                          {CHANNEL_LABEL[d.channel]}
                        </td>
                        <td className="px-4 py-2.5">
                          {d.awbId && d.AWBNO ? <AwbLink awbNo={d.AWBNO} awbId={d.awbId} /> : "—"}
                        </td>
                        <td className="px-4 py-2.5 text-[12px] text-[#475569] max-w-[180px] truncate">
                          {d.recipientName}
                        </td>
                        <td className="px-4 py-2.5 font-mono text-[10px] text-[#94A3B8] max-w-[160px] truncate">
                          {d.destination}
                        </td>
                        <td className="px-4 py-2.5">
                          <span
                            className="h-[22px] px-2.5 rounded-full text-[10px] font-bold inline-flex items-center uppercase"
                            style={{ backgroundColor: tone.bg, color: tone.fg }}
                          >
                            {d.status}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-[11px] text-[#94A3B8] whitespace-nowrap">
                          {d.sentAt ? formatDateTime(d.sentAt) : "—"}
                        </td>
                        <td className="px-4 py-2.5 text-[11px] text-[#94A3B8] whitespace-nowrap">
                          {d.readAt ? formatDateTime(d.readAt) : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))}

      {/* ---------- Notify party (P7-4) ---------- */}
      {tab === "notify" && (
        <div className="flex flex-col gap-5">
          <div className="rounded-[16px] border border-[#FCA5A5] bg-[#FEF2F2] px-5 py-4 flex items-start gap-3">
            <Users size={17} className="text-[#DC2626] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[13px] font-semibold text-[#DC2626]">
                The NOA has no notify party at all
              </p>
              <p className="text-[12px] text-[#991B1B] mt-1">
FC-05 addresses the arrival notice to &ldquo;Consignee / CHA&rdquo;. Real
                AWBs carry <strong>notify parties</strong> as well — often two: the operating
                company and its financing bank. Neither is a consignee and neither is a CHA, so
                neither is notified. CMTS has no notify party column, so today there is nowhere to
                record them even if the flow asked.
              </p>
            </div>
          </div>

          <div className="rounded-[16px] border border-[#E2E8F0] bg-white overflow-hidden">
            <div className="px-5 py-3.5 border-b border-[#E2E8F0]">
              <h3 className="text-[14px] font-semibold text-[#0F172A]">
                Evidence — from the SAPS document set
              </h3>
              <p className="text-[11px] text-[#94A3B8] mt-0.5">
                Transcribed verbatim from the four scanned documents supplied for review.
              </p>
            </div>
            <div className="divide-y divide-[#F1F5F9]">
              {REFERENCE_AWB_DOCUMENTS.map((doc) => {
                const parties = [doc.notifyParty1, doc.notifyParty2].filter(
                  (x): x is string => !!x,
                );
                const sameAsConsignee = parties.some((p) => /same as consignee/i.test(p));
                const distinct = parties.filter((p) => !/same as consignee/i.test(p));
                return (
                  <div
                    key={doc.AWBNO}
                    className="px-5 py-4"
                    style={{ backgroundColor: distinct.length > 0 ? "#FFFBEB" : undefined }}
                  >
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className="font-mono text-[12px] font-semibold text-[#0F172A]">
                        {doc.AWBNO}
                      </span>
                      {distinct.length > 0 ? (
                        <span className="h-[20px] px-2 rounded-full bg-[#FEE2E2] text-[#DC2626] text-[10px] font-bold inline-flex items-center">
                          {distinct.length} NOTIFY PARTY{distinct.length > 1 ? "S" : ""} — NOT NOTIFIED
                        </span>
                      ) : (
                        <span className="h-[20px] px-2 rounded-full bg-[#F1F5F9] text-[#64748B] text-[10px] font-bold inline-flex items-center">
                          {sameAsConsignee ? "SAME AS CONSIGNEE" : "NONE DECLARED"}
                        </span>
                      )}
                    </div>
                    {parties.length === 0 ? (
                      <p className="text-[12px] text-[#94A3B8]">
                        No notify party on this air waybill.
                      </p>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {parties.map((pty, pi) => (
                          <div key={pi}>
                            <p className="text-[10px] font-mono text-[#CBD5E1]">
                              NOTIFY PARTY {pi + 1}
                            </p>
                            <p
                              className="text-[12px] mt-0.5"
                              style={{
                                color: /same as consignee/i.test(pty) ? "#64748B" : "#991B1B",
                              }}
                            >
                              {pty}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="px-5 py-3 bg-[#F8FAFC] border-t border-[#E2E8F0]">
              <p className="text-[11px] text-[#64748B]">
                Proposed FC-05 amendment: the NOA recipient set becomes{" "}
                <strong>consignee + CHA + every declared notify party</strong>. On 816-00034156
                that is Relizon Pharmaceuticals (the operating company) and Meezan Bank (the
                financing party) — two organisations that today receive nothing. Requires a
                notify-party field on the AWB, an AirVault addition since CMTS has none.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 flex-wrap">
        <Link
          href="/messaging/iata"
          className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#1B4F8B] no-underline hover:underline"
        >
          IATA Cargo-IMP console <ArrowUpRight size={12} />
        </Link>
        <Link
          href="/import/arrival-advice"
          className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#1B4F8B] no-underline hover:underline"
        >
          Arrival advice / NOA <ArrowUpRight size={12} />
        </Link>
      </div>
    </div>
  );
}
