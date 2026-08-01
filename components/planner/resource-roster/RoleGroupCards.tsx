import { Users, Truck, Shield, ClipboardCheck, DollarSign, UserCog } from "lucide-react";
import type { RoleGroup } from "./types";

const roleGroups: RoleGroup[] = [
  { role: "Lifter Operators", count: 6, available: 3, busy: 2, offShift: 1, color: "#1B4F8B" },
  { role: "Gate Guards", count: 4, available: 2, busy: 1, offShift: 1, color: "#16A34A" },
  { role: "Warehouse Associates", count: 8, available: 3, busy: 4, offShift: 1, color: "#0B2545" },
  { role: "Compliance Officers", count: 3, available: 1, busy: 2, offShift: 0, color: "#F59E0B" },
  { role: "Finance Users", count: 2, available: 0, busy: 2, offShift: 0, color: "#8B5CF6" },
  { role: "Supervisors", count: 4, available: 0, busy: 4, offShift: 0, color: "#DC2626" },
];

const roleIcons: Record<string, React.ReactNode> = {
  "Lifter Operators": <Truck size={18} />,
  "Gate Guards": <Shield size={18} />,
  "Warehouse Associates": <ClipboardCheck size={18} />,
  "Compliance Officers": <ClipboardCheck size={18} />,
  "Finance Users": <DollarSign size={18} />,
  "Supervisors": <UserCog size={18} />,
};

export default function RoleGroupCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {roleGroups.map((group) => (
        <div key={group.role} className="rounded-xl border border-[#E2E8F0] bg-white p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: group.color + "14", color: group.color }}>
                {roleIcons[group.role]}
              </div>
              <span className="text-[13px] font-bold text-[#0F172A]">{group.role}</span>
            </div>
          </div>
          <div className="text-[22px] font-bold text-[#0F172A] leading-tight mb-3">{group.count}</div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#16A34A" }} />
              <span className="text-[11px] text-[#64748B]">{group.available} avail</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#F59E0B" }} />
              <span className="text-[11px] text-[#64748B]">{group.busy} busy</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#94A3B8" }} />
              <span className="text-[11px] text-[#64748B]">{group.offShift} off</span>
            </div>
          </div>
          <div className="mt-3 h-2 rounded-full bg-[#F1F5F9] overflow-hidden flex">
            <div style={{ width: `${(group.available / group.count) * 100}%`, backgroundColor: "#16A34A" }} />
            <div style={{ width: `${(group.busy / group.count) * 100}%`, backgroundColor: "#F59E0B" }} />
            <div style={{ width: `${(group.offShift / group.count) * 100}%`, backgroundColor: "#94A3B8" }} />
          </div>
        </div>
      ))}
    </div>
  );
}