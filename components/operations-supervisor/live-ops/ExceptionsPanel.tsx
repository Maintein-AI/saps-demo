import ScopeBadge from "@/components/ScopeBadge";
import { AlertTriangle, Ban, PackageX, Scan, DoorOpen, Clock, ArrowRight, UserPlus } from "lucide-react";

const exceptions = [
  { type: "Open CDRs", count: 7, severity: "High" as const, oldestAge: "2h 15m", owner: "Compliance" },
  { type: "Customs Holds", count: 12, severity: "Medium" as const, oldestAge: "4h 30m", owner: "Customs" },
  { type: "Damage Cases", count: 3, severity: "Low" as const, oldestAge: "1h 05m", owner: "Warehouse" },
  { type: "RFID Anomalies", count: 5, severity: "Medium" as const, oldestAge: "45m", owner: "IT Ops" },
  { type: "Gate Mismatches", count: 2, severity: "High" as const, oldestAge: "15m", owner: "Gate" },
  { type: "Overstay Alerts", count: 8, severity: "Medium" as const, oldestAge: "3h 20m", owner: "Planner" },
];

const severityColor = {
  High: "#DC2626",
  Medium: "#D97706",
  Low: "#16A34A",
};

export default function ExceptionsPanel() {
  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[15px] font-bold text-[#0F172A]">Exceptions</h3>
        <ScopeBadge type="inc" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {exceptions.map((e) => (
          <div key={e.type} className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 hover:border-[#1B4F8B] transition-colors cursor-pointer group">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#EBF0F7] flex items-center justify-center text-[#1B4F8B]">
                  {e.type === "Open CDRs" && <AlertTriangle size={18} />}
                  {e.type === "Customs Holds" && <Ban size={18} />}
                  {e.type === "Damage Cases" && <PackageX size={18} />}
                  {e.type === "RFID Anomalies" && <Scan size={18} />}
                  {e.type === "Gate Mismatches" && <DoorOpen size={18} />}
                  {e.type === "Overstay Alerts" && <Clock size={18} />}
                </div>
                <span className="text-[12px] font-semibold text-[#0F172A]">{e.type}</span>
              </div>
              <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: severityColor[e.severity] + "20" }}>
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: severityColor[e.severity] }} />
              </div>
            </div>
            <div className="text-[24px] font-bold text-[#0F172A] mb-1">{e.count}</div>
            <div className="text-[11px] text-[#64748B] mb-2">Oldest: {e.oldestAge} • Owner: {e.owner}</div>
            <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="h-7 px-2 rounded-lg bg-[#0B2545] text-white text-[11px] font-semibold flex items-center gap-1 cursor-pointer hover:opacity-90">
                <ArrowRight size={12} /> Open
              </button>
              <button className="h-7 px-2 rounded-lg border border-[#E2E8F0] text-[#64748B] text-[11px] font-semibold flex items-center gap-1 cursor-pointer hover:bg-[#F1F5F9]">
                <UserPlus size={12} /> Assign
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}