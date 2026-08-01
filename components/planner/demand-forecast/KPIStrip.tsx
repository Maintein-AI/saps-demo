import { Plane, Package, Weight, AlertTriangle, ClipboardCheck, MessageSquare } from "lucide-react";

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
      </div>
      <div className="text-[22px] font-bold text-[#0F172A] leading-tight">{value}</div>
    </div>
  );
}

export default function KPIStrip() {
  const cards = [
    { label: "Expected flights", value: "12", icon: <Plane size={16} className="text-[#1B4F8B]" />, color: "#1B4F8B" },
    { label: "Expected AWBs", value: "156", icon: <Package size={16} className="text-[#16A34A]" />, color: "#16A34A" },
    { label: "Expected pieces", value: "3,240", icon: <ClipboardCheck size={16} className="text-[#0B2545]" />, color: "#0B2545" },
    { label: "Expected weight", value: "68,200 kg", icon: <Weight size={16} className="text-[#F59E0B]" />, color: "#F59E0B" },
    { label: "Special cargo expected", value: "8", icon: <AlertTriangle size={16} className="text-[#DC2626]" />, color: "#DC2626" },
    { label: "Message gaps", value: "4", icon: <MessageSquare size={16} className="text-[#8B5CF6]" />, color: "#8B5CF6" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((card) => (
        <KPICard key={card.label} {...card} />
      ))}
    </div>
  );
}