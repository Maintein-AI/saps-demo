import { CheckCircle, AlertTriangle, Clock, TrendingUp, TrendingDown, Minus } from "lucide-react";

const periods = [
  { label: "Today", completedTasks: 347, slaPercent: 94.2, exceptionRate: 2.1, avgTaskTime: "6m 42s", trend: "up" },
  { label: "This Week", completedTasks: "2,184", slaPercent: 93.8, exceptionRate: 2.4, avgTaskTime: "7m 05s", trend: "up" },
  { label: "This Month", completedTasks: "8,420", slaPercent: 92.1, exceptionRate: 3.2, avgTaskTime: "7m 38s", trend: "down" },
];

export default function TrendCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {periods.map((p) => (
        <div key={p.label} className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[14px] font-bold text-[#0F172A]">{p.label}</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <CheckCircle size={14} className="text-[#16A34A]" />
                <span className="text-[11px] text-[#64748B]">Completed</span>
              </div>
              <div className="text-[18px] font-bold text-[#0F172A]">{p.completedTasks}</div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <AlertTriangle size={14} className="text-[#D97706]" />
                <span className="text-[11px] text-[#64748B]">SLA %</span>
              </div>
              <div className="text-[18px] font-bold text-[#0F172A]">{p.slaPercent}%</div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <AlertTriangle size={14} className="text-[#DC2626]" />
                <span className="text-[11px] text-[#64748B]">Exception Rate</span>
              </div>
              <div className="text-[18px] font-bold text-[#0F172A]">{p.exceptionRate}%</div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <Clock size={14} className="text-[#1B4F8B]" />
                <span className="text-[11px] text-[#64748B]">Avg Time</span>
              </div>
              <div className="text-[18px] font-bold text-[#0F172A]">{p.avgTaskTime}</div>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-[12px] font-medium">
            {p.trend === "up" && (
              <>
                <TrendingUp size={14} className="text-[#16A34A]" />
                <span className="text-[#16A34A]">Improving</span>
              </>
            )}
            {p.trend === "down" && (
              <>
                <TrendingDown size={14} className="text-[#DC2626]" />
                <span className="text-[#DC2626]">Declining</span>
              </>
            )}
            {p.trend === "neutral" && (
              <>
                <Minus size={14} className="text-[#64748B]" />
                <span className="text-[#64748B]">Stable</span>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}