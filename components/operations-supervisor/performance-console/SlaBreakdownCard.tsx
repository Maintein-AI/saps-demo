import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";

const slaItems = [
  { name: "Putaway SLA", target: "8m", actual: "7m 12s", percent: 94, status: "Met" as const },
  { name: "Picking SLA", target: "7m", actual: "5m 48s", percent: 97, status: "Met" as const },
  { name: "Gate dwell SLA", target: "15m", actual: "12m 30s", percent: 89, status: "At Risk" as const },
  { name: "Customs clearance coordination SLA", target: "2h", actual: "1h 45m", percent: 92, status: "Met" as const },
  { name: "Payment release SLA", target: "4h", actual: "4h 12m", percent: 86, status: "At Risk" as const },
  { name: "POD capture SLA", target: "30m", actual: "22m", percent: 96, status: "Met" as const },
];

const statusIcon = {
  Met: <CheckCircle size={14} className="text-[#16A34A]" />,
  "At Risk": <AlertTriangle size={14} className="text-[#D97706]" />,
  Missed: <XCircle size={14} className="text-[#DC2626]" />,
};

const statusColor = {
  Met: { bar: "#16A34A", bg: "#DCFCE7" },
  "At Risk": { bar: "#D97706", bg: "#FEF3C7" },
  Missed: { bar: "#DC2626", bg: "#FEE2E2" },
};

export default function SlaBreakdownCard() {
  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[15px] font-bold text-[#0F172A]">SLA Breakdown</h3>
      </div>
      <div className="space-y-4">
        {slaItems.map((s) => {
          const c = statusColor[s.status];
          return (
            <div key={s.name} className="flex items-center gap-4">
              <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">{statusIcon[s.status]}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[12px] font-semibold text-[#0F172A] truncate">{s.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[#64748B]">Target: {s.target}</span>
                    <span className="text-[11px] font-medium text-[#0F172A]">Actual: {s.actual}</span>
                  </div>
                </div>
                <div className="h-2 rounded-full bg-[#F1F5F9] overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(s.percent, 100)}%`, backgroundColor: c.bar }} />
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[11px] font-medium" style={{ color: c.bar }}>{s.status}</span>
                  <span className="text-[11px] text-[#64748B]">{s.percent}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}