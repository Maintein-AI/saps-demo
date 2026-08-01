"use client";

const alerts = [
  { id: "1", message: "AFU zone above 85%", severity: "high", zone: "AFU", utilization: 85 },
  { id: "2", message: "Cold room COL has limited capacity", severity: "high", zone: "Cold Room COL", utilization: 85 },
  { id: "3", message: "ODC block-stacking approaching limit", severity: "medium", zone: "ODC Block", utilization: 84 },
  { id: "4", message: "ULD pit 3 blocked", severity: "medium", zone: "ULD Pits", utilization: 0 },
  { id: "5", message: "DGR segregation capacity low", severity: "high", zone: "DGR", utilization: 62 },
];

const severityIcon: Record<string, { color: string; bg: string }> = {
  high: { color: "#EF4444", bg: "#FEE2E2" },
  medium: { color: "#D97706", bg: "#FEF3C7" },
  low: { color: "#10B981", bg: "#D1FAE5" },
};

export default function CapacityRiskAlerts() {
  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-5">
        <h2 className="text-[16px] font-semibold text-[#0F172A]">Capacity Risk Alerts</h2>
      </div>
      <div className="flex flex-col gap-2">
        {alerts.map((a) => {
          const style = severityIcon[a.severity] || severityIcon.low;
          return (
            <div key={a.id} className="flex items-start gap-3 rounded-[12px] border border-[#E2E8F0] bg-[#F8FAFC] p-3 hover:shadow-sm transition-shadow">
              <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: style.bg }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={style.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[13px] font-semibold text-[#0F172A]">{a.message}</span>
                  <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold whitespace-nowrap" style={{ color: style.color, backgroundColor: style.bg }}>
                    {a.severity === "high" ? "High" : a.severity === "medium" ? "Medium" : "Low"}
                  </span>
                </div>
                <span className="text-[12px] text-[#64748B]">Zone: {a.zone} &middot; Utilization: {a.utilization}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}