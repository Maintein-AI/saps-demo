import ScopeBadge from "@/components/ScopeBadge";
import { Clock } from "lucide-react";

const events = [
  { timestamp: "09:14:22", module: "Gate Entry", actor: "Ahmed Khan", action: "Vehicle scanned", entity: "TK-708", severity: "Low" as const, scope: "inc" as const },
  { timestamp: "09:12:05", module: "Warehouse", actor: "Sana Iqbal", action: "AWB indexed", entity: "AWB-117-98765432", severity: "Low" as const, scope: "inc" as const },
  { timestamp: "09:08:47", module: "Planner", actor: "System", action: "Slot conflict detected", entity: "ULD Bay 02", severity: "High" as const, scope: "inc" as const },
  { timestamp: "09:05:33", module: "Lifter", actor: "Bilal Raza", action: "Move completed", entity: "Piece-4421", severity: "Low" as const, scope: "inc" as const },
  { timestamp: "09:01:18", module: "Excise", actor: "Imran Ali", action: "Customs hold applied", entity: "AWB-117-55443321", severity: "Medium" as const, scope: "inc" as const },
  { timestamp: "08:58:44", module: "Gate Entry", actor: "Nadeem Shah", action: "Gate mismatch alert", entity: "Gate-03", severity: "High" as const, scope: "inc" as const },
  { timestamp: "08:55:12", module: "Warehouse", actor: "System", action: "Overstay alert", entity: "AWB-117-11223344", severity: "Medium" as const, scope: "inc" as const },
  { timestamp: "08:52:00", module: "Finance", actor: "Faisal Qureshi", action: "Invoice generated", entity: "INV-2026-05231", severity: "Low" as const, scope: "inc" as const },
];

const severityColor = {
  High: "#DC2626",
  Medium: "#D97706",
  Low: "#16A34A",
};

export default function EventStream() {
  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[15px] font-bold text-[#0F172A]">Live Event Stream</h3>
        <ScopeBadge type="inc" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#E2E8F0]">
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Timestamp</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Module</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Actor</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Action</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Entity</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Severity</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Scope</th>
            </tr>
          </thead>
          <tbody>
            {events.map((e, i) => (
              <tr key={i} className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors">
                <td className="py-3 px-3 text-[12px] font-medium text-[#0F172A]">
                  <div className="flex items-center gap-1.5">
                    <Clock size={12} className="text-[#94A3B8]" />
                    {e.timestamp}
                  </div>
                </td>
                <td className="py-3 px-3 text-[12px] text-[#0F172A]">{e.module}</td>
                <td className="py-3 px-3 text-[12px] text-[#0F172A]">{e.actor}</td>
                <td className="py-3 px-3 text-[12px] text-[#1B4F8B] font-medium">{e.action}</td>
                <td className="py-3 px-3 text-[12px] text-[#0F172A]">{e.entity}</td>
                <td className="py-3 px-3">
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: severityColor[e.severity] + "15", color: severityColor[e.severity] }}>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: severityColor[e.severity] }} />
                    {e.severity}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <ScopeBadge type={e.scope} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}