import ScopeBadge from "@/components/ScopeBadge";
import { CheckCircle, AlertCircle, Clock, Shield, FileText } from "lucide-react";

const customsData = {
  gdNumber: "GD-KHI-2026-034521",
  gdStatus: "Filed",
  gdChannel: "Green",
  oocStatus: "Cleared",
  oocDate: "31 May 2026, 12:45",
  holdStatus: "None",
  examination: "Not Required",
  dutyAmount: "PKR 0",
  wecoStatus: "Approved",
  wecoRef: "WECO-2026-88712",
};

const statusConfig: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  Filed: { icon: <FileText size={16} />, color: "#1B4F8B", bg: "#DBEAFE" },
  Cleared: { icon: <CheckCircle size={16} />, color: "#16A34A", bg: "#DCFCE7" },
  None: { icon: <Shield size={16} />, color: "#64748B", bg: "#F1F5F9" },
  Green: { icon: <CheckCircle size={16} />, color: "#16A34A", bg: "#DCFCE7" },
  Approved: { icon: <CheckCircle size={16} />, color: "#16A34A", bg: "#DCFCE7" },
  "Not Required": { icon: <Shield size={16} />, color: "#64748B", bg: "#F1F5F9" },
};

function StatusPill({ label, value }: { label: string; value: string }) {
  const config = statusConfig[value] || { icon: <Clock size={16} />, color: "#94A3B8", bg: "#F1F5F9" };

  return (
    <div className="flex items-center justify-between py-3 border-b border-[#E2E8F0] last:border-b-0">
      <div className="flex items-center gap-2">
        <span className="text-[13px] text-[#64748B]">{label}</span>
      </div>
      <div
        className="flex items-center gap-1.5 h-7 px-2.5 rounded-full text-[12px] font-semibold"
        style={{ backgroundColor: config.bg, color: config.color }}
      >
        {config.icon}
        {value}
      </div>
    </div>
  );
}

export default function CustomsTab() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-[16px] font-semibold text-[#0F172A]">
            Customs Status
          </h3>
          <ScopeBadge type="inc" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* GD Info */}
        <div className="rounded-[12px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <FileText size={16} className="text-[#1B4F8B]" />
            <h4 className="text-[14px] font-bold text-[#0F172A]">Goods Declaration</h4>
          </div>
          <div className="space-y-0">
            <StatusPill label="GD Number" value={customsData.gdNumber} />
            <StatusPill label="GD Status" value={customsData.gdStatus} />
            <StatusPill label="Channel" value={customsData.gdChannel} />
          </div>
        </div>

        {/* OOC Info */}
        <div className="rounded-[12px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle size={16} className="text-[#16A34A]" />
            <h4 className="text-[14px] font-bold text-[#0F172A]">Out of Customs (OOC)</h4>
          </div>
          <div className="space-y-0">
            <StatusPill label="OOC Status" value={customsData.oocStatus} />
            <div className="flex items-center justify-between py-3 border-b border-[#E2E8F0]">
              <span className="text-[13px] text-[#64748B]">OOC Date</span>
              <span className="text-[13px] font-semibold text-[#0F172A]">{customsData.oocDate}</span>
            </div>
            <StatusPill label="Hold Status" value={customsData.holdStatus} />
          </div>
        </div>

        {/* Examination */}
        <div className="rounded-[12px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle size={16} className="text-[#D97706]" />
            <h4 className="text-[14px] font-bold text-[#0F172A]">Examination</h4>
          </div>
          <div className="space-y-0">
            <StatusPill label="Examination" value={customsData.examination} />
            <div className="flex items-center justify-between py-3 border-b border-[#E2E8F0]">
              <span className="text-[13px] text-[#64748B]">Duty Amount</span>
              <span className="text-[13px] font-semibold text-[#0F172A]">{customsData.dutyAmount}</span>
            </div>
          </div>
        </div>

        {/* WECO */}
        <div className="rounded-[12px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Shield size={16} className="text-[#1B4F8B]" />
            <h4 className="text-[14px] font-bold text-[#0F172A]">WECO</h4>
          </div>
          <div className="space-y-0">
            <StatusPill label="WECO Status" value={customsData.wecoStatus} />
            <div className="flex items-center justify-between py-3 border-b border-[#E2E8F0]">
              <span className="text-[13px] text-[#64748B]">WECO Reference</span>
              <span className="text-[13px] font-semibold text-[#0F172A]">{customsData.wecoRef}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}