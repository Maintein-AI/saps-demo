import { TrendingUp, TrendingDown, Minus, ArrowRight } from "lucide-react";

const zones = [
  { zone: "AFU Zone A", taskCount: 312, slaPercent: 95, exceptions: 3, trend: "up" as const },
  { zone: "GCR Zone", taskCount: 284, slaPercent: 93, exceptions: 5, trend: "up" as const },
  { zone: "Cold Chain", taskCount: 156, slaPercent: 97, exceptions: 1, trend: "neutral" as const },
  { zone: "Gate Entry", taskCount: 198, slaPercent: 88, exceptions: 8, trend: "down" as const },
  { zone: "Customs Coordination", taskCount: 142, slaPercent: 91, exceptions: 4, trend: "up" as const },
  { zone: "Dispatch", taskCount: 223, slaPercent: 94, exceptions: 2, trend: "up" as const },
];

export default function TeamPerformanceCard() {
  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[15px] font-bold text-[#0F172A]">Team Performance by Zone</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {zones.map((z) => (
          <div key={z.zone} className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 hover:border-[#1B4F8B] transition-colors cursor-pointer group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[13px] font-semibold text-[#0F172A]">{z.zone}</span>
              <div className="flex items-center gap-1 text-[11px] font-medium">
                {z.trend === "up" && <TrendingUp size={14} className="text-[#16A34A]" />}
                {z.trend === "down" && <TrendingDown size={14} className="text-[#DC2626]" />}
                {z.trend === "neutral" && <Minus size={14} className="text-[#64748B]" />}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <div className="text-[18px] font-bold text-[#0F172A]">{z.taskCount}</div>
                <div className="text-[10px] text-[#64748B]">Tasks</div>
              </div>
              <div>
                <div className="text-[18px] font-bold text-[#0F172A]">{z.slaPercent}%</div>
                <div className="text-[10px] text-[#64748B]">SLA</div>
              </div>
              <div>
                <div className="text-[18px] font-bold text-[#DC2626]">{z.exceptions}</div>
                <div className="text-[10px] text-[#64748B]">Exceptions</div>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowRight size={14} className="text-[#1B4F8B]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}