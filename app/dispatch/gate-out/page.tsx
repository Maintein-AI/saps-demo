"use client";

/**
 * P6-3 / P6-4 · Gate-out verification and digital POD.
 *
 * The FC-08 amendment's strongest claim lives here: at the gate the tags on
 * the vehicle are matched against the gate pass **and the FC-07 release
 * conditions are re-evaluated**. A release that was valid when the pass was
 * issued can have gone stale by the time the truck reaches the exit — a
 * customs hold placed an hour later is exactly that case, and the only
 * place it can still be caught is here.
 *
 * The POD amendment replaces a signature on paper with six evidence items:
 * e-signature, receiver name, CNIC (matched against the DO), piece count,
 * photos, timestamp — plus **geo**, which the amendment adds and CMTS has
 * nowhere to store.
 */

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  CheckCircle2,
  Fingerprint,
  MapPin,
  Radio,
  ShieldAlert,
  XCircle,
} from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import EmptyState from "@/components/EmptyState";
import AwbLink from "@/components/awb/AwbLink";
import { useSite } from "@/components/site/SiteContext";
import {
  awbById,
  awbByNo,
  formatDateTime,
  gateOutFor,
  listGateOutChecks,
  listGatePasses,
  listPods,
} from "@/lib/domain";

export default function GateOutPage() {
  const { scope, isHq } = useSite();
  const checks = useMemo(() => listGateOutChecks(scope), [scope]);
  const passes = useMemo(() => listGatePasses(scope), [scope]);
  const pods = useMemo(() => listPods(scope), [scope]);

  const [tab, setTab] = useState<"gate" | "pod">("gate");
  const [selected, setSelected] = useState<number | null>(checks[0]?.gatePassNo ?? null);
  const c = checks.find((x) => x.gatePassNo === selected) ?? checks[0] ?? null;
  const gp = c ? passes.find((p) => p.GATEPASSNO === c.gatePassNo) : null;
  const awb = gp ? awbByNo(gp.AWBNO) : null;

  const blocked = checks.filter((x) => x.outcome === "blocked");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Breadcrumb items={[{ label: "Dispatch" }, { label: "Gate-out & POD" }]} />
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="h-[18px] px-1.5 rounded bg-[#EBF0F7] text-[#0B2545] text-[10px] font-bold inline-flex items-center font-mono">
              M13 · M14
            </span>
            <span className="h-[18px] px-1.5 rounded bg-[#F1F5F9] text-[#64748B] text-[10px] font-bold inline-flex items-center font-mono">
              FC-08 §12–15
            </span>
          </div>
          <h1 className="text-[24px] lg:text-[32px] font-bold text-[#0F172A] leading-tight mt-1.5">
            Gate-out Verification &amp; POD
          </h1>
          <p className="text-[13px] text-[#64748B] mt-1">
            The last place a stale release can be caught, and the evidence that the cargo actually
            changed hands.
            {isHq ? " All sites." : ` ${scope} only.`}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Gate-out checks", value: String(checks.length), tone: "#0F172A" },
          { label: "Blocked at gate", value: String(blocked.length), tone: "#DC2626" },
          {
            label: "Stale releases caught",
            value: String(checks.filter((x) => !x.releaseStillValid).length),
            tone: "#D97706",
          },
          { label: "PODs captured", value: String(pods.length), tone: "#16A34A" },
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
            ["gate", `Gate-out checks (${checks.length})`],
            ["pod", `Proof of delivery (${pods.length})`],
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

      {/* ---------- Gate-out ---------- */}
      {tab === "gate" &&
        (checks.length === 0 ? (
          <EmptyState
            title="No gate-out checks at this site"
            description="A check runs when a loaded vehicle presents at the exit — FC-08 §12."
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="rounded-[16px] border border-[#E2E8F0] bg-white overflow-hidden h-fit">
              <div className="px-5 py-3.5 border-b border-[#E2E8F0] flex items-center gap-2">
                <Radio size={15} className="text-[#64748B]" />
                <h3 className="text-[14px] font-semibold text-[#0F172A]">Checks</h3>
              </div>
              <div className="max-h-[520px] overflow-y-auto">
                {checks.map((x) => (
                  <button
                    key={x.gatePassNo}
                    onClick={() => setSelected(x.gatePassNo)}
                    className="w-full text-left px-5 py-3 border-b border-[#F1F5F9] last:border-0 hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                    style={{ backgroundColor: c?.gatePassNo === x.gatePassNo ? "#EBF0F7" : undefined }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[12px] font-semibold text-[#0F172A]">
                        GP-{x.gatePassNo}
                      </span>
                      <span
                        className="h-[18px] px-1.5 rounded text-[9px] font-bold inline-flex items-center uppercase"
                        style={
                          x.outcome === "cleared"
                            ? { backgroundColor: "#DCFCE7", color: "#16A34A" }
                            : { backgroundColor: "#FEE2E2", color: "#DC2626" }
                        }
                      >
                        {x.outcome}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#94A3B8] mt-0.5">
                      {x.scannedTags.length}/{x.expectedTags.length} tags ·{" "}
                      {formatDateTime(x.checkedAt)}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {c && (
              <div className="lg:col-span-2 flex flex-col gap-5">
                <div
                  className="rounded-[16px] border px-5 py-4 flex items-start gap-3"
                  style={
                    c.outcome === "cleared"
                      ? { borderColor: "#BBF7D0", backgroundColor: "#F0FDF4" }
                      : { borderColor: "#FCA5A5", backgroundColor: "#FEF2F2" }
                  }
                >
                  {c.outcome === "cleared" ? (
                    <CheckCircle2 size={18} className="text-[#16A34A] flex-shrink-0 mt-0.5" />
                  ) : (
                    <ShieldAlert size={18} className="text-[#DC2626] flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p
                      className="text-[14px] font-semibold"
                      style={{ color: c.outcome === "cleared" ? "#16A34A" : "#DC2626" }}
                    >
                      {c.outcome === "cleared"
                        ? "Cleared to leave"
                        : "Blocked at the gate"}
                    </p>
                    <p
                      className="text-[12px] mt-0.5"
                      style={{ color: c.outcome === "cleared" ? "#15803D" : "#991B1B" }}
                    >
                      {c.blockReason ??
                        "Tags matched the gate pass and the release conditions still hold."}
                    </p>
                    {awb && (
                      <div className="mt-2">
                        <AwbLink awbNo={awb.AWBNO} awbId={awb.AWBId} />
                      </div>
                    )}
                  </div>
                </div>

                {/* Two independent checks */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                  <div className="rounded-[16px] border border-[#E2E8F0] bg-white overflow-hidden">
                    <div className="px-5 py-3.5 border-b border-[#E2E8F0] flex items-center justify-between gap-2">
                      <h3 className="text-[14px] font-semibold text-[#0F172A]">Tag match</h3>
                      <span
                        className="h-[20px] px-2 rounded-full text-[10px] font-bold inline-flex items-center"
                        style={
                          c.tagsMatched
                            ? { backgroundColor: "#DCFCE7", color: "#16A34A" }
                            : { backgroundColor: "#FEE2E2", color: "#DC2626" }
                        }
                      >
                        {c.scannedTags.length} / {c.expectedTags.length}
                      </span>
                    </div>
                    <div className="p-5">
                      {c.missingTags.length === 0 && c.extraTags.length === 0 ? (
                        <p className="text-[12px] text-[#15803D]">
                          Every tag on the gate pass was read on the vehicle, and nothing extra.
                        </p>
                      ) : (
                        <div className="flex flex-col gap-2">
                          {c.missingTags.map((t) => (
                            <div key={t} className="flex items-center gap-2">
                              <XCircle size={13} className="text-[#DC2626] flex-shrink-0" />
                              <span className="font-mono text-[10px] text-[#991B1B] break-all">
                                {t}
                              </span>
                              <span className="text-[10px] text-[#DC2626] font-semibold">
                                not on vehicle
                              </span>
                            </div>
                          ))}
                          {c.extraTags.map((t) => (
                            <div key={t} className="flex items-center gap-2">
                              <ShieldAlert size={13} className="text-[#D97706] flex-shrink-0" />
                              <span className="font-mono text-[10px] text-[#92400E] break-all">
                                {t}
                              </span>
                              <span className="text-[10px] text-[#D97706] font-semibold">
                                not on the pass
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="rounded-[16px] border border-[#E2E8F0] bg-white overflow-hidden">
                    <div className="px-5 py-3.5 border-b border-[#E2E8F0] flex items-center justify-between gap-2">
                      <h3 className="text-[14px] font-semibold text-[#0F172A]">
                        Release re-evaluated
                      </h3>
                      <span
                        className="h-[20px] px-2 rounded-full text-[10px] font-bold inline-flex items-center"
                        style={
                          c.releaseStillValid
                            ? { backgroundColor: "#DCFCE7", color: "#16A34A" }
                            : { backgroundColor: "#FEE2E2", color: "#DC2626" }
                        }
                      >
                        {c.releaseStillValid ? "STILL VALID" : "STALE"}
                      </span>
                    </div>
                    <div className="p-5">
                      {c.releaseStillValid ? (
                        <p className="text-[12px] text-[#15803D]">
                          All five FC-07 conditions still pass at the moment of exit.
                        </p>
                      ) : (
                        <>
                          <p className="text-[12px] text-[#991B1B]">
                            These conditions passed at issuance and fail now:
                          </p>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {c.newlyFailedConditions.map((f) => (
                              <span
                                key={f}
                                className="h-[22px] px-2.5 rounded-full bg-[#FEE2E2] text-[#DC2626] text-[10px] font-bold font-mono inline-flex items-center"
                              >
                                {f}
                              </span>
                            ))}
                          </div>
                          <p className="text-[11px] text-[#64748B] mt-3">
                            Re-evaluating here is the whole point of the amendment — a pass printed
                            an hour ago is not evidence that release is still lawful.
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-[#94A3B8]">
                  Checked {formatDateTime(c.checkedAt)} by {c.checkedBy}.
                </p>
              </div>
            )}
          </div>
        ))}

      {/* ---------- POD ---------- */}
      {tab === "pod" &&
        (pods.length === 0 ? (
          <EmptyState
            title="No PODs captured at this site"
            description="A POD is captured at hand-over — FC-08 §14 — and triggers the DLV message."
          />
        ) : (
          <div className="flex flex-col gap-5">
            {pods.map((p) => {
              const a = awbById(p.awbId);
              const evidence: Array<[string, boolean, string]> = [
                ["E-signature", !!p.receiverSignature, p.receiverSignature ? "Captured" : "Missing"],
                ["Receiver name", !!p.receiverName, p.receiverName || "—"],
                [
                  "CNIC vs DO",
                  p.cnicMatchesDo,
                  p.receiverCnic ? `${p.receiverCnic} · ${p.cnicMatchesDo ? "matches" : "MISMATCH"}` : "Not captured",
                ],
                [
                  "Piece count",
                  p.piecesDelivered === p.piecesOnDo,
                  `${p.piecesDelivered} of ${p.piecesOnDo} on DO`,
                ],
                ["Photos", p.photos.length > 0, `${p.photos.length} attached`],
                ["Geo", !!p.geo, p.geo ? `${p.geo.lat.toFixed(4)}, ${p.geo.lng.toFixed(4)} ±${p.geo.accuracyM}m` : "Not captured"],
              ];
              return (
                <div key={p.id} className="rounded-[16px] border border-[#E2E8F0] bg-white overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-[#E2E8F0] flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Fingerprint size={14} className="text-[#64748B]" />
                        {a && <AwbLink awbNo={a.AWBNO} awbId={a.AWBId} />}
                        <span className="font-mono text-[11px] text-[#94A3B8]">
                          GP-{p.gatePassNo}
                        </span>
                      </div>
                      <p className="text-[12px] text-[#64748B] mt-1.5">
                        Captured {formatDateTime(p.capturedAt)} by {p.capturedBy}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {p.partial && (
                        <span className="h-[22px] px-2.5 rounded-full bg-[#FEF3C7] text-[#D97706] text-[10px] font-bold inline-flex items-center">
                          PARTIAL
                        </span>
                      )}
                      <span
                        className="h-[22px] px-2.5 rounded-full text-[10px] font-bold inline-flex items-center"
                        style={
                          p.complete
                            ? { backgroundColor: "#DCFCE7", color: "#16A34A" }
                            : { backgroundColor: "#FEE2E2", color: "#DC2626" }
                        }
                      >
                        {p.complete ? "COMPLETE" : "INCOMPLETE"}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-3">
                    {evidence.map(([label, ok, detail]) => (
                      <div
                        key={label}
                        className="rounded-xl border px-4 py-3"
                        style={{
                          borderColor: ok ? "#E2E8F0" : "#FCA5A5",
                          backgroundColor: ok ? "#FFFFFF" : "#FEF2F2",
                        }}
                      >
                        <div className="flex items-center gap-2">
                          {ok ? (
                            <CheckCircle2 size={13} className="text-[#16A34A] flex-shrink-0" />
                          ) : (
                            <XCircle size={13} className="text-[#DC2626] flex-shrink-0" />
                          )}
                          <span className="text-[12px] font-semibold text-[#0F172A]">{label}</span>
                        </div>
                        <p
                          className="text-[11px] mt-1 break-words"
                          style={{ color: ok ? "#64748B" : "#991B1B" }}
                        >
                          {detail}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="px-5 py-3 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-between gap-3 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 text-[11px] text-[#64748B]">
                      <MapPin size={12} />
                      Geo is an AirVault addition — CMTS has nowhere to store it.
                    </span>
                    <span className="text-[11px] text-[#64748B]">
                      DLV {p.dlvSentAt ? `sent ${formatDateTime(p.dlvSentAt)}` : "not sent"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ))}

      <div className="flex items-center gap-3 flex-wrap">
        <Link
          href="/dispatch/gate-pass"
          className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#1B4F8B] no-underline hover:underline"
        >
          Gate pass &amp; picking <ArrowUpRight size={12} />
        </Link>
        <Link
          href="/dispatch/closure"
          className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#1B4F8B] no-underline hover:underline"
        >
          AWB closure <ArrowUpRight size={12} />
        </Link>
      </div>
    </div>
  );
}
