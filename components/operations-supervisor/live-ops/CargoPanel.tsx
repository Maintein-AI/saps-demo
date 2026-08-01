import { Package, ClipboardList, Archive, Shield, FileText, Truck, CheckCircle, ArrowRight } from "lucide-react";

const cargoStates = [
  { state: "Received", count: 42, avgDwell: "38m", trend: "up" as const, trendValue: "+12% vs prev shift", icon: Package },
  { state: "Indexed", count: 38, avgDwell: "52m", trend: "down" as const, trendValue: "-5% vs prev shift", icon: ClipboardList },
  { state: "Stored", count: 118, avgDwell: "1d 4h", trend: "up" as const, trendValue: "+3% vs prev shift", icon: Archive },
  { state: "Customs", count: 36, avgDwell: "6h 20m", trend: "neutral" as const, trendValue: "0% vs prev shift", icon: Shield },
  { state: "DO Issued", count: 24, avgDwell: "1h 15m", trend: "down" as const, trendValue: "-8% vs prev shift", icon: FileText },
  { state: "Picked", count: 19, avgDwell: "45m", trend: "up" as const, trendValue: "+22% vs prev shift", icon: Truck },
  { state: "Delivered", count: 67, avgDwell: "12m", trend: "down" as const, trendValue: "-2% vs prev shift", icon: CheckCircle },
];

export default function CargoPanel() {
  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[15px] font-bold text-[#0F172A]">Cargo</h3>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-3">
        {cargoStates.map((s) => {
          const Icon = s.icon;
          const trendColor = s.trend === "up" ? "#16A34A" : s.trend === "down" ? "#DC2626" : "#64748B";
          return (
            <div key={s.state} className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 hover:border-[#1B4F8B] transition-colors cursor-pointer group">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-[#EBF0F7] flex items-center justify-center text-[#1B4F8B]">
                  <Icon size={18} />
                </div>
                <span className="text-[12px] font-semibold text-[#0F172A]">{s.state}</span>
              </div>
              <div className="text-[24px] font-bold text-[#0F172A] mb-1">{s.count}</div>
              <div className="text-[11px] text-[#64748B] mb-1">avg dwell {s.avgDwell}</div>
              <div className="text-[11px] font-medium" style={{ color: trendColor }}>{s.trendValue}</div>
              <div className="mt-3 flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight size={14} className="text-[#1B4F8B]" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}