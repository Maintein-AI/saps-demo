import ScopeBadge from "@/components/ScopeBadge";
import { CheckCircle, XCircle, UserPlus, ArrowUpRight, StickyNote, Clock, User } from "lucide-react";

const events = [
  { timestamp: "01 Jun 2026 11:10", user: "Tariq Mehmood", action: "Created escalation", remarks: "Gate mismatch detected at Gate-03" },
  { timestamp: "01 Jun 2026 11:12", user: "System", action: "Auto-assigned", remarks: "Assigned to Nadeem Shah based on zone" },
  { timestamp: "01 Jun 2026 11:25", user: "Nadeem Shah", action: "Reviewed", remarks: "Verified discrepancy. Awaiting supervisor decision." },
  { timestamp: "01 Jun 2026 11:40", user: "Imran Ali", action: "Added note", remarks: "Check with gate authority letter register." },
  { timestamp: "01 Jun 2026 12:00", user: "Nadeem Shah", action: "Escalated", remarks: "Further escalation to Operations Supervisor." },
];

const actionIcon: Record<string, React.ReactNode> = {
  "Created escalation": <Clock size={12} className="text-[#1B4F8B]" />,
  "Auto-assigned": <User size={12} className="text-[#64748B]" />,
  Reviewed: <CheckCircle size={12} className="text-[#16A34A]" />,
  "Added note": <StickyNote size={12} className="text-[#D97706]" />,
  Escalated: <ArrowUpRight size={12} className="text-[#DC2626]" />,
  Approved: <CheckCircle size={12} className="text-[#16A34A]" />,
  Rejected: <XCircle size={12} className="text-[#DC2626]" />,
  Reassigned: <UserPlus size={12} className="text-[#1B4F8B]" />,
};

export default function Timeline() {
  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[15px] font-bold text-[#0F172A]">Escalation Timeline</h3>
        <ScopeBadge type="inc" />
      </div>
      <div className="space-y-4">
        {events.map((e, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#EBF0F7] flex items-center justify-center mt-0.5">
              {actionIcon[e.action] || <Clock size={12} className="text-[#64748B]" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[12px] font-semibold text-[#0F172A]">{e.action}</span>
                <span className="text-[11px] text-[#64748B]">by {e.user}</span>
              </div>
              <div className="text-[11px] text-[#94A3B8] mt-0.5">{e.timestamp}</div>
              <div className="text-[12px] text-[#334155] mt-1">{e.remarks}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}