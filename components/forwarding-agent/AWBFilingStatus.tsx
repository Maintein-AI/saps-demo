import ScopeBadge from "@/components/ScopeBadge";
import { FileText, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";

const statuses = [
  { label: "Draft", count: 3, color: "#64748B", bg: "#F1F5F9", icon: <FileText size={14} /> },
  { label: "Submitted", count: 5, color: "#1B4F8B", bg: "#DBEAFE", icon: <FileText size={14} /> },
  { label: "Under Review", count: 2, color: "#D97706", bg: "#FEF3C7", icon: <Clock size={14} /> },
  { label: "Accepted", count: 8, color: "#16A34A", bg: "#DCFCE7", icon: <CheckCircle size={14} /> },
  { label: "Rejected", count: 1, color: "#DC2626", bg: "#FEE2E2", icon: <XCircle size={14} /> },
];

export default function AWBFilingStatus() {
  const total = statuses.reduce((s, c) => s + c.count, 0);
  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <h3 className="text-[15px] font-bold text-[#0F172A]">AWB Filing Status</h3>
          <ScopeBadge type="exc" />
        </div>
        <span className="text-[12px] text-[#64748B]">{total} total</span>
      </div>
      <div className="space-y-3">
        {statuses.map((s, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: s.bg, color: s.color }}>
              {s.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[12px] font-semibold text-[#0F172A]">{s.label}</span>
                <span className="text-[12px] font-bold text-[#0F172A]">{s.count}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#F1F5F9] overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${total > 0 ? (s.count / total) * 100 : 0}%`, backgroundColor: s.color }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}