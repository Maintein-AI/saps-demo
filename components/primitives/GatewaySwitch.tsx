"use client";

/**
 * P0-4 · Integration gateway indicator / provider switch.
 *
 * FC-06 amendment:
 *   "Build behind a provider-abstracted 'customs gateway' — PSW primary,
 *    WeBOC parallel-run during phased rollout; flip primary without re-plumbing."
 *
 * FC-12 lists five gateways: PSW customs · SITA (IATA) · Payment ·
 * RFID/HW · Notify. The same component serves all of them.
 */

import { Activity, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { formatDateTime, type GatewayState } from "@/lib/domain";

const STATUS = {
  healthy: { fg: "#16A34A", bg: "#DCFCE7", Icon: CheckCircle2, label: "Healthy" },
  degraded: { fg: "#D97706", bg: "#FEF3C7", Icon: AlertTriangle, label: "Degraded" },
  down: { fg: "#DC2626", bg: "#FEE2E2", Icon: XCircle, label: "Down" },
} as const;

const ROLE_STYLE = {
  primary: { fg: "#1B4F8B", bg: "#DBEAFE", label: "Primary" },
  parallel: { fg: "#7C3AED", bg: "#EDE9FE", label: "Parallel-run" },
  single: { fg: "#64748B", bg: "#F1F5F9", label: "Single provider" },
} as const;

export function GatewayCard({
  gateway,
  onSelectPrimary,
}: {
  gateway: GatewayState;
  /** Provided only where the provider is genuinely switchable (PSW ↔ WeBOC). */
  onSelectPrimary?: (code: GatewayState["code"]) => void;
}) {
  const s = STATUS[gateway.status];
  const r = ROLE_STYLE[gateway.role];

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: s.bg }}
          >
            <s.Icon size={16} style={{ color: s.fg }} />
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-[#0F172A] truncate">{gateway.label}</p>
            <p className="text-[11px] text-[#94A3B8]">Last sync {formatDateTime(gateway.lastSyncAt)}</p>
          </div>
        </div>
        <span
          className="h-[20px] px-2 rounded text-[10px] font-bold inline-flex items-center flex-shrink-0"
          style={{ backgroundColor: r.bg, color: r.fg }}
        >
          {r.label}
        </span>
      </div>

      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[#F1F5F9]">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.fg }} />
          <span className="text-[11px] font-medium" style={{ color: s.fg }}>
            {s.label}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Activity size={12} className="text-[#94A3B8]" />
          <span className="text-[11px] text-[#64748B]">{gateway.queueDepth} queued</span>
        </div>
        {onSelectPrimary && gateway.role !== "primary" && (
          <button
            onClick={() => onSelectPrimary(gateway.code)}
            className="ml-auto text-[11px] font-semibold text-[#1B4F8B] hover:underline cursor-pointer"
          >
            Make primary
          </button>
        )}
      </div>

      {gateway.note && (
        <p className="text-[11px] text-[#64748B] mt-2 pt-2 border-t border-[#F1F5F9]">
          {gateway.note}
        </p>
      )}
    </div>
  );
}

/** Compact inline badge, for headers on screens that consume a gateway. */
export default function GatewaySwitch({ gateway }: { gateway: GatewayState }) {
  const s = STATUS[gateway.status];
  const r = ROLE_STYLE[gateway.role];
  return (
    <span
      className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full text-[11px] font-semibold"
      style={{ backgroundColor: r.bg, color: r.fg }}
      title={`${gateway.label} — ${s.label}, ${gateway.queueDepth} queued`}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.fg }} />
      {gateway.label.split("—")[0].trim()} · {r.label}
    </span>
  );
}
