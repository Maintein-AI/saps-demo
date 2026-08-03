"use client";

/**
 * P4-2 · SD / GD filing workbench + the two customs document tables.
 *
 * Gap G13: `CUSTOMIGM` (17) and `AWBINFORMATION` (35) have **no screen at
 * all** in the demo. That is the whole commercial layer customs assesses
 * on — PCT heading, value per unit, country of origin, insurance, LC and
 * import-licence numbers. An AWB screen that cannot show a PCT code cannot
 * support a duty conversation, and every existing customs screen in the
 * demo is exactly that screen.
 *
 * FC-06 amendment: **Single Declaration replaces GD.** Both references are
 * shown — SD is the live one, the GD number is kept so an operator reading
 * a CMTS-era document can still find the record.
 */

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, FileText, Landmark, Plane, ScrollText } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import EmptyState from "@/components/EmptyState";
import AwbLink from "@/components/awb/AwbLink";
import { AuditStrip, DocNumber } from "@/components/primitives";
import { useSite } from "@/components/site/SiteContext";
import {
  RISK_CHANNEL_LABEL,
  SD_STATUS_LABEL,
  awbInformationFor,
  awbById,
  formatDate,
  formatPkr,
  listClearances,
  listCustomsIgms,
  type RiskChannel,
} from "@/lib/domain";

const CHANNEL_TONE: Record<RiskChannel, { bg: string; fg: string }> = {
  green: { bg: "#DCFCE7", fg: "#16A34A" },
  yellow: { bg: "#FEF3C7", fg: "#D97706" },
  red: { bg: "#FEE2E2", fg: "#DC2626" },
};

/** `AWBINFORMATION` grouped the way an assessing officer reads it. */
const INFO_GROUPS: Array<{ title: string; fields: Array<[string, "text" | "money" | "num"]> }> = [
  {
    title: "Declaration identity",
    fields: [
      ["DOCUMENTNO", "text"],
      ["AIRWAYBILLNO", "text"],
      ["INDEXNO", "text"],
      ["TYPE", "text"],
      ["CARGOTYPE", "text"],
      ["TYPEBL", "text"],
      ["SERIALTYPE", "text"],
    ],
  },
  {
    title: "Licences & tax identity",
    fields: [
      ["LCNUMBER", "text"],
      ["IMPORTLICENCENO", "text"],
      ["NATIONALTAXNO", "text"],
    ],
  },
  {
    title: "Parties",
    fields: [
      ["CONSIGNEE", "text"],
      ["IMPORTNAME", "text"],
      ["ADDRESS", "text"],
      ["SHIPPERNAME", "text"],
      ["SHIPPERADDRESS", "text"],
    ],
  },
  {
    title: "Routing",
    fields: [
      ["ORIGIN", "text"],
      ["PORTOFSHIPMENT", "text"],
      ["PORTDISCHARGE", "text"],
      ["PORTOFDELIVERY", "text"],
      ["DESTINATIONPORT", "text"],
      ["COUNTRYOFORIGIN", "text"],
    ],
  },
  {
    title: "Valuation — what duty is assessed on",
    fields: [
      ["PCTCODE", "text"],
      ["CONSIGNMENTVALUE", "money"],
      ["VALUEPERUNIT", "money"],
      ["QUANTITY", "num"],
      ["UNITOFMEASURE", "text"],
      ["INSURANCEAMOUNT", "money"],
      ["AMOUNTOFFREIGHT", "money"],
    ],
  },
  {
    title: "Goods & packing",
    fields: [
      ["DESCRIPTION", "text"],
      ["UNITOFPACKING", "text"],
      ["NUMBEROFPACKS", "num"],
      ["WEIGHT", "num"],
      ["NETWEIGHT", "num"],
      ["CASEMARKINGS", "text"],
      ["REMARKS", "text"],
    ],
  },
];

export default function CustomsFilingPage() {
  const { scope, isHq } = useSite();
  const clearances = useMemo(() => listClearances(scope), [scope]);
  const igms = useMemo(() => listCustomsIgms(scope), [scope]);

  const [selectedId, setSelectedId] = useState<number | null>(clearances[0]?.id ?? null);
  const c = clearances.find((x) => x.id === selectedId) ?? clearances[0] ?? null;

  const info = c ? awbInformationFor(c.awbId) : null;
  const awb = c ? awbById(c.awbId) : null;
  const igm = c ? igms.find((g) => g.IGMNO === c.IGMNO) ?? null : null;

  const [tab, setTab] = useState<"sd" | "info" | "igm">("sd");

  const fmt = (v: unknown, kind: "text" | "money" | "num") => {
    if (v === null || v === undefined || v === "") return null;
    if (kind === "money") return formatPkr(v as number);
    if (kind === "num") return String(v);
    return String(v);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Breadcrumb items={[{ label: "Customs" }, { label: "SD / GD Filing" }]} />
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="h-[18px] px-1.5 rounded bg-[#EBF0F7] text-[#0B2545] text-[10px] font-bold inline-flex items-center font-mono">
              M09
            </span>
            <span className="h-[18px] px-1.5 rounded bg-[#F1F5F9] text-[#64748B] text-[10px] font-bold inline-flex items-center font-mono">
              CUSTOMIGM (17) · AWBINFORMATION (35)
            </span>
            <span className="h-[18px] px-1.5 rounded bg-[#F5F3FF] text-[#7C3AED] text-[10px] font-bold inline-flex items-center font-mono">
              GAP G13
            </span>
          </div>
          <h1 className="text-[24px] lg:text-[32px] font-bold text-[#0F172A] leading-tight mt-1.5">
            Declaration Filing
          </h1>
          <p className="text-[13px] text-[#64748B] mt-1">
            Single Declaration, customs IGM header, and the 35-column commercial detail customs
            assesses on — none of which the demo has ever carried.
            {isHq ? " All sites." : ` ${scope} only.`}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Declarations", value: String(clearances.length), tone: "#0F172A" },
          { label: "Customs IGM headers", value: String(igms.length), tone: "#1B4F8B" },
          {
            label: "Total consignment value",
            value: formatPkr(
              clearances.reduce(
                (n, x) => n + (awbInformationFor(x.awbId)?.CONSIGNMENTVALUE ?? 0),
                0,
              ),
            ),
            tone: "#16A34A",
          },
          {
            label: "Distinct PCT headings",
            value: String(
              new Set(
                clearances
                  .map((x) => awbInformationFor(x.awbId)?.PCTCODE)
                  .filter(Boolean),
              ).size,
            ),
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

      {clearances.length === 0 ? (
        <EmptyState
          title="No declarations at this site"
          description="A declaration is filed by the CHA once the NOA is issued and documents are collected — FC-06 §01–03."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="rounded-[16px] border border-[#E2E8F0] bg-white overflow-hidden">
            <div className="px-5 py-3.5 border-b border-[#E2E8F0] flex items-center gap-2">
              <ScrollText size={15} className="text-[#64748B]" />
              <h3 className="text-[14px] font-semibold text-[#0F172A]">Declarations</h3>
            </div>
            <div className="max-h-[600px] overflow-y-auto">
              {clearances.map((x) => (
                <button
                  key={x.id}
                  onClick={() => setSelectedId(x.id)}
                  className="w-full text-left px-5 py-3 border-b border-[#F1F5F9] last:border-0 hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                  style={{ backgroundColor: c?.id === x.id ? "#EBF0F7" : undefined }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[12px] font-semibold text-[#0F172A]">
                      {x.AWBNO}
                    </span>
                    {x.channel && (
                      <span
                        className="h-[18px] px-1.5 rounded text-[9px] font-bold inline-flex items-center"
                        style={{
                          backgroundColor: CHANNEL_TONE[x.channel].bg,
                          color: CHANNEL_TONE[x.channel].fg,
                        }}
                      >
                        {RISK_CHANNEL_LABEL[x.channel].toUpperCase()}
                      </span>
                    )}
                  </div>
                  <p className="font-mono text-[11px] text-[#64748B] mt-0.5 truncate">
                    {x.sdRef}
                  </p>
                  <p className="text-[11px] text-[#94A3B8] mt-0.5 truncate">
                    {x.cha} · {SD_STATUS_LABEL[x.status]}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {c && (
            <div className="lg:col-span-2 flex flex-col gap-5">
              {/* Header */}
              <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <AwbLink awbNo={c.AWBNO} awbId={c.awbId} />
                      {c.channel && (
                        <span
                          className="h-[22px] px-2.5 rounded-full text-[10px] font-bold inline-flex items-center"
                          style={{
                            backgroundColor: CHANNEL_TONE[c.channel].bg,
                            color: CHANNEL_TONE[c.channel].fg,
                          }}
                        >
                          {RISK_CHANNEL_LABEL[c.channel]} channel
                        </span>
                      )}
                    </div>
                    <p className="text-[12px] text-[#64748B] mt-1.5">
                      {SD_STATUS_LABEL[c.status]} · filed by{" "}
                      <span className="font-medium text-[#0F172A]">{c.cha}</span>
                      {c.filedAt ? ` on ${formatDate(c.filedAt)}` : ""}
                    </p>
                  </div>
                  <Link
                    href="/customs/channels"
                    className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#1B4F8B] no-underline hover:underline"
                  >
                    Channel workflow <ArrowUpRight size={12} />
                  </Link>
                </div>

                {/* SD replaces GD — both references visible */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="rounded-xl border border-[#C7D7EC] bg-[#EBF0F7] px-4 py-3">
                    <p className="text-[10px] font-bold text-[#1B4F8B] uppercase tracking-wider">
                      Single Declaration — current
                    </p>
                    <div className="mt-1">
                      {c.docNumber ? (
                        <DocNumber doc={c.docNumber} />
                      ) : (
                        <span className="font-mono text-[12px]">{c.sdRef}</span>
                      )}
                    </div>
                  </div>
                  <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3">
                    <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">
                      Legacy GD — CMTS vocabulary
                    </p>
                    <p className="font-mono text-[12px] text-[#475569] mt-1">
                      {c.gdNo ?? "— not issued —"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-2 flex-wrap">
                {(
                  [
                    ["sd", "Declaration"],
                    ["info", "AWBINFORMATION (35)"],
                    ["igm", "CUSTOMIGM (17)"],
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

              {tab === "sd" && (
                <div className="rounded-[16px] border border-[#E2E8F0] bg-white overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-[#E2E8F0] flex items-center gap-2">
                    <FileText size={15} className="text-[#64748B]" />
                    <h3 className="text-[14px] font-semibold text-[#0F172A]">Declaration record</h3>
                  </div>
                  <div className="p-5 grid grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-4">
                    {(
                      [
                        ["SD reference", c.sdRef],
                        ["Legacy GD no.", c.gdNo],
                        ["IGM no.", c.IGMNO],
                        ["Index no.", c.INDEXNO],
                        ["CHA", c.cha],
                        ["Filed", c.filedAt ? formatDate(c.filedAt) : null],
                        [
                          "Channel",
                          c.channel ? RISK_CHANNEL_LABEL[c.channel] : null,
                        ],
                        [
                          "Channel assigned",
                          c.channelAssignedAt ? formatDate(c.channelAssignedAt) : null,
                        ],
                        [
                          "Channel source",
                          c.channelFetchedFrom
                            ? `${c.channelFetchedFrom.toUpperCase()} (fetched electronically)`
                            : null,
                        ],
                      ] as const
                    ).map(([k, v]) => (
                      <div key={k} className="flex flex-col gap-1">
                        <span className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
                          {k}
                        </span>
                        <span
                          className="text-[13px] font-medium break-words"
                          style={{ color: v ? "#0F172A" : "#CBD5E1" }}
                        >
                          {v ?? "—"}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="px-5 pb-5">
                    <p className="text-[11px] text-[#94A3B8]">
                      The channel is <strong>fetched</strong>, not typed — FC-06&apos;s amendment
                      makes SD status, risk channel and OOC electronic. A typed channel would be an
                      operator&apos;s opinion of a customs decision.
                    </p>
                  </div>
                </div>
              )}

              {tab === "info" && info && (
                <div className="flex flex-col gap-4">
                  {INFO_GROUPS.map((g) => (
                    <div
                      key={g.title}
                      className="rounded-[16px] border border-[#E2E8F0] bg-white overflow-hidden"
                    >
                      <div className="px-5 py-3 border-b border-[#E2E8F0] bg-[#F8FAFC]">
                        <h3 className="text-[13px] font-semibold text-[#0F172A]">{g.title}</h3>
                      </div>
                      <div className="p-5 grid grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-4">
                        {g.fields.map(([k, kind]) => {
                          const v = fmt(
                            (info as unknown as Record<string, unknown>)[k],
                            kind,
                          );
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
                  ))}
                  {awb && (
                    <div className="rounded-[16px] border border-[#FDE68A] bg-[#FFFBEB] px-5 py-4">
                      <p className="text-[12px] text-[#92400E]">
                        <strong>Cross-check.</strong> AWBINFORMATION declares{" "}
                        {info.NUMBEROFPACKS} packs / {info.WEIGHT} kg; the AWB record carries{" "}
                        {awb.TOTALPCS} pcs / {awb.TOTALWEIGHT} kg. These are two different
                        declarations of the same consignment and CMTS never reconciles them — a
                        divergence here is a duty exposure, not a data-entry nit.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {tab === "igm" && (
                <div className="rounded-[16px] border border-[#E2E8F0] bg-white overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-[#E2E8F0] flex items-center gap-2">
                    <Plane size={15} className="text-[#64748B]" />
                    <div>
                      <h3 className="text-[14px] font-semibold text-[#0F172A]">
                        Customs IGM header
                      </h3>
                      <p className="text-[11px] text-[#94A3B8]">
                        CMTS CUSTOMIGM — all 17 columns
                      </p>
                    </div>
                  </div>
                  {igm ? (
                    <>
                      <div className="p-5 grid grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-4">
                        {(
                          [
                            ["DOCUMENTNO", igm.DOCUMENTNO],
                            ["PORT", igm.PORT],
                            ["SHIPPINGAGENTNO", igm.SHIPPINGAGENTNO],
                            ["FLIGHTNO", igm.FLIGHTNO],
                            ["VOYAGE", igm.VOYAGE],
                            ["COUNTRY", igm.COUNTRY],
                            ["ORIGIN", igm.ORIGIN],
                            ["CAPTAINNAME", igm.CAPTAINNAME],
                            ["AIRPORTNAME", igm.AIRPORTNAME],
                            ["SAMEBOTTOMCARGO", igm.SAMEBOTTOMCARGO],
                            ["IGMNO", igm.IGMNO],
                            ["IGMYEAR", String(igm.IGMYEAR)],
                            ["TOTALCONSIGNMENTS", String(igm.TOTALCONSIGNMENTS)],
                            ["INDEXNO", igm.INDEXNO],
                            ["ARRIVALDATE", formatDate(igm.ARRIVALDATE)],
                            ["FILINGDATE", formatDate(igm.FILINGDATE)],
                            ["SHIPPINGCOMPANY", igm.SHIPPINGCOMPANY],
                          ] as const
                        ).map(([k, v]) => (
                          <div key={k} className="flex flex-col gap-1">
                            <span className="text-[9px] font-mono text-[#CBD5E1]">{k}</span>
                            <span className="text-[13px] font-medium text-[#0F172A] break-words">
                              {v}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="px-5 pb-5">
                        <p className="text-[11px] text-[#94A3B8]">
                          <span className="font-mono">SAMEBOTTOMCARGO</span> flags cargo staying on
                          the aircraft — it is manifested but never landed here, so it must not
                          enter the storage or charging flows.
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="p-5">
                      <p className="text-[12px] text-[#94A3B8]">
                        No customs IGM header matched {c.IGMNO} at this site.
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center gap-3 flex-wrap">
                <Link
                  href="/customs/gateway"
                  className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#1B4F8B] no-underline hover:underline"
                >
                  <Landmark size={12} /> Gateway submissions
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
