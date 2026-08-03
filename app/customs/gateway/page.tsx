"use client";

/**
 * P4-1 · Customs Gateway console — FC-06's provider abstraction.
 *
 * The FC-06 amendment does not say "use PSW". It says build behind a
 * **provider-abstracted customs gateway**, with PSW primary and WeBOC
 * legacy/parallel-run. The demo's existing customs screens hard-code a
 * single world where filing simply succeeds — which is precisely what a
 * phased migration does not look like.
 *
 * During a parallel run every declaration is filed **twice**. The thing
 * worth watching is not either provider's health, it is **divergence**: PSW
 * accepting while WeBOC rejects means the filing is not settled, no matter
 * what the primary reports. That is BLK-04, and it is the centrepiece here.
 */

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Network,
  Radio,
  XCircle,
} from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import EmptyState from "@/components/EmptyState";
import AwbLink from "@/components/awb/AwbLink";
import { GatewayCard } from "@/components/primitives";
import { useSite } from "@/components/site/SiteContext";
import {
  GATEWAYS,
  formatDateTime,
  listClearances,
  submissionsDiverge,
  type GatewayProvider,
  type SubmissionState,
} from "@/lib/domain";

const STATE_META: Record<
  SubmissionState,
  { label: string; bg: string; fg: string; Icon: typeof CheckCircle2 }
> = {
  accepted: { label: "Accepted", bg: "#DCFCE7", fg: "#16A34A", Icon: CheckCircle2 },
  rejected: { label: "Rejected", bg: "#FEE2E2", fg: "#DC2626", Icon: XCircle },
  queued: { label: "Queued", bg: "#FEF3C7", fg: "#D97706", Icon: Clock },
  "not-filed": { label: "Not filed", bg: "#F1F5F9", fg: "#64748B", Icon: Radio },
};

const PROVIDER_LABEL: Record<GatewayProvider, string> = {
  psw: "PSW",
  weboc: "WeBOC",
};

export default function CustomsGatewayPage() {
  const { scope, isHq } = useSite();
  const clearances = useMemo(() => listClearances(scope), [scope]);

  const [divergentOnly, setDivergentOnly] = useState(false);

  const divergent = clearances.filter((c) => submissionsDiverge(c.submissions));
  const visible = divergentOnly ? divergent : clearances;

  const customsGateways = GATEWAYS.filter((g) => g.code === "psw" || g.code === "weboc");

  const perProvider = (["psw", "weboc"] as GatewayProvider[]).map((p) => {
    const subs = clearances.map((c) => c.submissions.find((s) => s.provider === p)!).filter(Boolean);
    return {
      provider: p,
      accepted: subs.filter((s) => s.state === "accepted").length,
      rejected: subs.filter((s) => s.state === "rejected").length,
      queued: subs.filter((s) => s.state === "queued").length,
      total: subs.length,
    };
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Breadcrumb items={[{ label: "Customs" }, { label: "Gateway Console" }]} />
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="h-[18px] px-1.5 rounded bg-[#EBF0F7] text-[#0B2545] text-[10px] font-bold inline-flex items-center font-mono">
              M09
            </span>
            <span className="h-[18px] px-1.5 rounded bg-[#F1F5F9] text-[#64748B] text-[10px] font-bold inline-flex items-center font-mono">
              FC-06 · provider abstraction
            </span>
            <span className="h-[18px] px-1.5 rounded bg-[#FEF3C7] text-[#D97706] text-[10px] font-bold inline-flex items-center font-mono">
              BLK-04
            </span>
          </div>
          <h1 className="text-[24px] lg:text-[32px] font-bold text-[#0F172A] leading-tight mt-1.5">
            Customs Gateway
          </h1>
          <p className="text-[13px] text-[#64748B] mt-1">
            PSW primary, WeBOC parallel. Every declaration files twice during the rollout — this is
            where the two are reconciled.
            {isHq ? " All sites." : ` ${scope} only.`}
          </p>
        </div>
      </div>

      {/* Provider health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {customsGateways.map((g) => (
          <GatewayCard key={g.code} gateway={g} />
        ))}
      </div>

      {/* Divergence banner — the reason this console exists */}
      <div
        className="rounded-[16px] border px-5 py-4 flex items-start gap-3"
        style={
          divergent.length
            ? { borderColor: "#FCA5A5", backgroundColor: "#FEF2F2" }
            : { borderColor: "#BBF7D0", backgroundColor: "#F0FDF4" }
        }
      >
        {divergent.length ? (
          <AlertTriangle size={18} className="text-[#DC2626] flex-shrink-0 mt-0.5" />
        ) : (
          <CheckCircle2 size={18} className="text-[#16A34A] flex-shrink-0 mt-0.5" />
        )}
        <div className="flex-1">
          <p
            className="text-[14px] font-semibold"
            style={{ color: divergent.length ? "#DC2626" : "#16A34A" }}
          >
            {divergent.length
              ? `${divergent.length} declaration${divergent.length === 1 ? "" : "s"} diverge between providers`
              : "PSW and WeBOC agree on every declaration"}
          </p>
          <p
            className="text-[12px] mt-1 leading-snug"
            style={{ color: divergent.length ? "#991B1B" : "#15803D" }}
          >
            {divergent.length
              ? "The primary accepted while the parallel provider rejected. Until the rollout completes, a filing is only settled when both agree — treating PSW's acceptance as final is what would let a rejected declaration reach release."
              : "Nothing to reconcile. During a parallel run this state is the exception, not the norm — check back as filings accumulate."}
          </p>
        </div>
      </div>

      {/* Per-provider tallies */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {perProvider.map((p) => (
          <div key={p.provider} className="rounded-[16px] border border-[#E2E8F0] bg-white p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Network size={15} className="text-[#64748B]" />
                <h3 className="text-[14px] font-semibold text-[#0F172A]">
                  {PROVIDER_LABEL[p.provider]}
                </h3>
              </div>
              <span
                className="h-[20px] px-2 rounded-full text-[10px] font-bold inline-flex items-center uppercase"
                style={
                  p.provider === "psw"
                    ? { backgroundColor: "#DBEAFE", color: "#1B4F8B" }
                    : { backgroundColor: "#F1F5F9", color: "#64748B" }
                }
              >
                {p.provider === "psw" ? "primary" : "parallel"}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                ["Accepted", p.accepted, "#16A34A"],
                ["Rejected", p.rejected, "#DC2626"],
                ["Queued", p.queued, "#D97706"],
              ].map(([l, v, tone]) => (
                <div key={l as string}>
                  <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
                    {l as string}
                  </p>
                  <p className="text-[20px] font-bold mt-0.5" style={{ color: tone as string }}>
                    {v as number}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-3 h-[8px] rounded-full bg-[#F1F5F9] overflow-hidden flex">
              <div
                className="h-full bg-[#16A34A]"
                style={{ width: `${(p.accepted / Math.max(1, p.total)) * 100}%` }}
              />
              <div
                className="h-full bg-[#DC2626]"
                style={{ width: `${(p.rejected / Math.max(1, p.total)) * 100}%` }}
              />
              <div
                className="h-full bg-[#D97706]"
                style={{ width: `${(p.queued / Math.max(1, p.total)) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {(
          [
            [false, `All filings (${clearances.length})`],
            [true, `Divergent only (${divergent.length})`],
          ] as const
        ).map(([v, label]) => (
          <button
            key={String(v)}
            onClick={() => setDivergentOnly(v)}
            className="h-8 px-3.5 rounded-lg text-[12px] font-semibold border transition-colors cursor-pointer"
            style={{
              backgroundColor: divergentOnly === v ? "#0B2545" : "#FFFFFF",
              color: divergentOnly === v ? "#FFFFFF" : "#475569",
              borderColor: divergentOnly === v ? "#0B2545" : "#E2E8F0",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <EmptyState
          title="No filings match"
          description="Declarations appear here once the CHA files them. Each one is submitted to both providers during the parallel run."
        />
      ) : (
        <div className="rounded-[16px] border border-[#E2E8F0] bg-white overflow-hidden">
          <div className="px-5 py-3.5 border-b border-[#E2E8F0]">
            <h3 className="text-[14px] font-semibold text-[#0F172A]">Submission log</h3>
            <p className="text-[11px] text-[#94A3B8] mt-0.5">
              One row per declaration, both providers side by side.
            </p>
          </div>
          <div className="divide-y divide-[#F1F5F9]">
            {visible.map((c) => {
              const diverges = submissionsDiverge(c.submissions);
              return (
                <div
                  key={c.id}
                  className="px-5 py-4"
                  style={{ backgroundColor: diverges ? "#FEF2F2" : undefined }}
                >
                  <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <AwbLink awbNo={c.AWBNO} awbId={c.awbId} />
                      <span className="text-[11px] text-[#64748B]">{c.cha}</span>
                      {isHq && (
                        <span className="h-[18px] px-1.5 rounded bg-[#F1F5F9] text-[#64748B] text-[10px] font-semibold inline-flex items-center">
                          {c.site}
                        </span>
                      )}
                      {diverges && (
                        <span className="h-[20px] px-2 rounded-full bg-[#FEE2E2] text-[#DC2626] text-[10px] font-bold inline-flex items-center gap-1">
                          <AlertTriangle size={9} />
                          DIVERGENT
                        </span>
                      )}
                    </div>
                    <Link
                      href="/customs/filing"
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1B4F8B] no-underline hover:underline"
                    >
                      Open filing <ArrowUpRight size={11} />
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {c.submissions.map((s) => {
                      const meta = STATE_META[s.state];
                      return (
                        <div
                          key={s.provider}
                          className="rounded-xl border border-[#E2E8F0] bg-white px-4 py-3"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[12px] font-semibold text-[#0F172A]">
                              {PROVIDER_LABEL[s.provider]}
                              <span className="text-[10px] font-normal text-[#94A3B8] ml-1.5">
                                {s.role}
                              </span>
                            </span>
                            <span
                              className="h-[20px] px-2 rounded-full text-[10px] font-bold inline-flex items-center gap-1"
                              style={{ backgroundColor: meta.bg, color: meta.fg }}
                            >
                              <meta.Icon size={9} />
                              {meta.label}
                            </span>
                          </div>
                          <p className="font-mono text-[11px] text-[#475569] mt-1.5">
                            {s.reference ?? "— no reference issued —"}
                          </p>
                          <p className="text-[11px] text-[#94A3B8] mt-0.5">
                            {s.acknowledgedAt
                              ? `Ack ${formatDateTime(s.acknowledgedAt)}`
                              : s.submittedAt
                                ? `Sent ${formatDateTime(s.submittedAt)}`
                                : "Not submitted"}
                          </p>
                          {s.errorText && (
                            <p className="text-[11px] text-[#DC2626] mt-1.5 pt-1.5 border-t border-[#FEE2E2]">
                              <span className="font-mono font-semibold">{s.errorCode}</span> —{" "}
                              {s.errorText}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <p className="text-[11px] text-[#94A3B8]">
        Gateway health above is shared with FC-12&apos;s integration layer — the same
        <code className="mx-1 px-1 rounded bg-[#F1F5F9] font-mono text-[10px]">GatewayCard</code>
        renders on the re-export console, where FC-10-B files through PSW only.
      </p>
    </div>
  );
}
