import ScopeBadge from "@/components/ScopeBadge";
import { Forklift, Bot, MoveRight, DoorOpen, Radio, ScanLine, AlertTriangle, CheckCircle, WifiOff, Wrench } from "lucide-react";

const assets = [
  { name: "Lifters", total: 12, active: 8, fault: 1, offline: 3, icon: Forklift },
  { name: "AGV", total: 4, active: 3, fault: 0, offline: 1, icon: Bot },
  { name: "Conveyor", total: 6, active: 5, fault: 1, offline: 0, icon: MoveRight },
  { name: "Gates", total: 8, active: 6, fault: 0, offline: 2, icon: DoorOpen },
  { name: "RFID Readers", total: 14, active: 12, fault: 1, offline: 1, icon: Radio },
  { name: "Handheld Scanners", total: 22, active: 18, fault: 2, offline: 2, icon: ScanLine },
];

export default function AssetsPanel() {
  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[15px] font-bold text-[#0F172A]">Assets</h3>
        <ScopeBadge type="inc" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
        {assets.map((a) => {
          const Icon = a.icon;
          return (
            <div key={a.name} className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 hover:border-[#1B4F8B] transition-colors cursor-pointer group">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-[#EBF0F7] flex items-center justify-center text-[#1B4F8B]">
                  <Icon size={18} />
                </div>
                <span className="text-[12px] font-semibold text-[#0F172A]">{a.name}</span>
              </div>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-[24px] font-bold text-[#0F172A]">{a.active}</span>
                <span className="text-[12px] text-[#64748B]">/ {a.total}</span>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-[11px] text-[#16A34A]">
                  <CheckCircle size={12} /> {a.active} active
                </div>
                {a.fault > 0 && (
                  <div className="flex items-center gap-1.5 text-[11px] text-[#DC2626]">
                    <AlertTriangle size={12} /> {a.fault} fault
                  </div>
                )}
                {a.offline > 0 && (
                  <div className="flex items-center gap-1.5 text-[11px] text-[#64748B]">
                    <WifiOff size={12} /> {a.offline} offline
                  </div>
                )}
              </div>
              <div className="mt-3 flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[11px] font-medium text-[#1B4F8B]">View detail</span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#EBF0F7] flex items-center justify-center text-[#1B4F8B]">
              <Wrench size={18} />
            </div>
            <span className="text-[12px] font-semibold text-[#0F172A]">Dolley Status</span>
          </div>
          <ScopeBadge type="exc" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <div className="text-[20px] font-bold text-[#0F172A]">14</div>
            <div className="text-[11px] text-[#64748B]">In-use</div>
          </div>
          <div className="text-center">
            <div className="text-[20px] font-bold text-[#64748B]">6</div>
            <div className="text-[11px] text-[#64748B]">Idle</div>
          </div>
          <div className="text-center">
            <div className="text-[20px] font-bold text-[#DC2626]">2</div>
            <div className="text-[11px] text-[#64748B]">Under maintenance</div>
          </div>
        </div>
      </div>
    </div>
  );
}