import { Users, Truck, Shield, AlertTriangle, ClipboardList, CheckCircle } from "lucide-react";
import ScopeBadge from "../../ScopeBadge";

interface KPICardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

function KPICard({ label, value, icon, color }: KPICardProps) {
  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-white p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: color + "14" }}>
            {icon}
          </div>
          <span className="text-[12px] font-semibold text-[#0F172A]">{label}</span>
        </div>
        <ScopeBadge type="inc" />
      </div>
      <div className="text-[22px] font-bold text-[#0F172A] leading-tight">{value}</div>
    </div>
  );
}

export default function KPIStrip() {
  const cards = [
    { label: "Operators assigned", value: "18", icon: <Users size={16} className="text-[#1B4F8B]" />, color: "#1B4F8B" },
    { label: "Lifters assigned", value: "6", icon: <Truck size={16} className="text-[#16A34A]" />, color: "#16A34A" },
    { label: "Supervisors on shift", value: "4", icon: <Shield size={16} className="text-[#0B2545]" />, color: "#0B2545" },
    { label: "Available backup staff", value: "3", icon: <CheckCircle size={16} className="text-[#10B981]" />, color: "#10B981" },
    { label: "Asset shortages", value: "2", icon: <AlertTriangle size={16} className="text-[#DC2626]" />, color: "#DC2626" },
    { label: "Unassigned tasks", value: "7", icon: <ClipboardList size={16} className="text-[#F59E0B]" />, color: "#F59E0B" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((card) => (
        <KPICard key={card.label} {...card} />
      ))}
    </div>
  );
}