import ScopeBadge from "@/components/ScopeBadge";
import { Bell, ArrowUpRight, Gavel, CheckCircle } from "lucide-react";

const stages = [
  {
    label: "Notify",
    icon: Bell,
    description: "Send notice to consignee",
    count: 3,
    color: "#D97706",
    bg: "#FEF3C7",
  },
  {
    label: "Escalate",
    icon: ArrowUpRight,
    description: "Escalate to customs",
    count: 2,
    color: "#1B4F8B",
    bg: "#DBEAFE",
  },
  {
    label: "Customs Decision",
    icon: Gavel,
    description: "Await customs decision",
    count: 4,
    color: "#7C3AED",
    bg: "#F3E8FF",
  },
  {
    label: "Final Disposition",
    icon: CheckCircle,
    description: "Release, auction, or disposal",
    count: 2,
    color: "#16A34A",
    bg: "#DCFCE7",
  },
];

export default function WorkflowStageCards() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stages.map((stage) => {
        const Icon = stage.icon;
        return (
          <div
            key={stage.label}
            className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: stage.bg }}
                >
                  <Icon size={16} style={{ color: stage.color }} />
                </div>
                <h3 className="text-[13px] font-bold text-[#0F172A]">
                  {stage.label}
                </h3>
              </div>
              <ScopeBadge type="inc" />
            </div>
            <p className="text-[12px] text-[#64748B] mb-2">{stage.description}</p>
            <div className="flex items-center gap-2">
              <span className="text-[22px] font-bold" style={{ color: stage.color }}>
                {stage.count}
              </span>
              <span className="text-[11px] text-[#64748B]">cases</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}