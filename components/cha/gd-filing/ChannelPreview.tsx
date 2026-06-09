import { ArrowRight, CheckCircle, Clock, AlertTriangle, ShieldAlert } from "lucide-react";
import ScopeBadge from "@/components/ScopeBadge";

interface ChannelPreviewProps {
  channel: string;
}

export default function ChannelPreview({ channel }: ChannelPreviewProps) {
  const previews: Record<string, { title: string; subtitle: string; icon: React.ReactNode; bg: string; text: string; steps: string[] }> = {
    Green: {
      title: "OOC Tracking",
      subtitle: "Green channel — auto-clearance path",
      icon: <CheckCircle size={20} />,
      bg: "#DCFCE7",
      text: "#16A34A",
      steps: [
        "GD auto-cleared by WeBOC",
        "OOC auto-generated within 30 mins",
        "SAPS notified of clearance",
        "DO released for collection",
      ],
    },
    Yellow: {
      title: "Query & Document Review",
      subtitle: "Yellow channel — document verification required",
      icon: <Clock size={20} />,
      bg: "#FEF3C7",
      text: "#D97706",
      steps: [
        "Customs officer assigns query code",
        "Respond with supporting documents",
        "WeBOC status updates to Under Review",
        "Await clearance or escalation",
      ],
    },
    Red: {
      title: "Physical Exam Scheduling",
      subtitle: "Red channel — mandatory physical examination",
      icon: <ShieldAlert size={20} />,
      bg: "#FEE2E2",
      text: "#DC2626",
      steps: [
        "Exam officer assigns date/time",
        "SAPS notified to stage cargo",
        "Physical inspection at exam shed",
        "Post-exam: OOC or hold determination",
      ],
    },
  };

  if (!channel || !previews[channel]) {
    return (
      <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-5">
          <h3 className="text-[15px] font-bold text-[#0F172A]">Channel Preview</h3>
          <ScopeBadge type="exc" />
        </div>
        <div className="text-center py-8">
          <div className="w-12 h-12 rounded-xl bg-[#F1F5F9] flex items-center justify-center mx-auto mb-3">
            <ArrowRight size={24} className="text-[#94A3B8]" />
          </div>
          <p className="text-[13px] text-[#94A3B8]">Select a channel to see next steps</p>
        </div>
      </div>
    );
  }

  const p = previews[channel];

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <h3 className="text-[15px] font-bold text-[#0F172A]">Channel Preview</h3>
          <ScopeBadge type="exc" />
        </div>
        <span
          className="inline-flex items-center gap-1 h-5 px-2 rounded-full text-[11px] font-semibold"
          style={{ backgroundColor: p.bg, color: p.text }}
        >
          {channel}
        </span>
      </div>

      <div className="flex items-start gap-3 p-4 rounded-xl mb-4" style={{ backgroundColor: p.bg + "60", border: `1px solid ${p.bg}` }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: p.bg, color: p.text }}>
          {p.icon}
        </div>
        <div>
          <p className="text-[14px] font-bold text-[#0F172A]">{p.title}</p>
          <p className="text-[12px] text-[#64748B]">{p.subtitle}</p>
        </div>
      </div>

      <div className="space-y-2">
        {p.steps.map((step, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-[#E2E8F0]">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
              style={{ backgroundColor: p.bg, color: p.text }}
            >
              {i + 1}
            </div>
            <span className="text-[12px] text-[#0F172A]">{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
}