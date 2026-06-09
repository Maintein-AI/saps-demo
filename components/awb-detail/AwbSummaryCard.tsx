import ScopeBadge from "@/components/ScopeBadge";
import StatusBadge from "@/components/StatusBadge";

export default function AwbSummaryCard() {
  const items = [
    { label: "AWB Number", value: "214-45678901" },
    { label: "Current State", value: <StatusBadge status="Stored" /> },
    { label: "Cargo Class", value: "AFU" },
    { label: "Pieces", value: "24" },
    { label: "Actual Weight", value: "1,240 kg" },
    { label: "Chargeable Weight", value: "1,240 kg" },
    { label: "Status", value: <span className="text-[13px] font-semibold text-[#16A34A]">Active</span> },
    { label: "Holding Status", value: <span className="text-[13px] font-semibold text-[#64748B]">None</span> },
  ];

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-[16px] font-semibold text-[#0F172A]">
            AWB Summary
          </h2>
          <ScopeBadge type="inc" />
        </div>
        <span className="text-[12px] text-[#94A3B8] font-medium">Last updated: 14:32</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-x-6 gap-y-4">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col gap-1">
            <span className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
              {item.label}
            </span>
            <span className="text-[14px] font-semibold text-[#0F172A]">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}