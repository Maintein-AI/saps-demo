import ScopeBadge from "@/components/ScopeBadge";

interface KPIProps {
  title: string;
  value: string;
  subtitle?: string;
}

function KPI({ title, value, subtitle }: KPIProps) {
  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[13px] font-semibold text-[#64748B]">{title}</h3>
        <ScopeBadge type="exc" />
      </div>
      <p className="text-[26px] font-bold text-[#0F172A]">{value}</p>
      {subtitle && <p className="text-[12px] text-[#64748B] mt-1">{subtitle}</p>}
    </div>
  );
}

export default function KPIStrip() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <KPI title="Draft Messages" value="14" subtitle="Pending submission" />
      <KPI title="Sent Today" value="8" subtitle="Across 4 stations" />
      <KPI title="Corrections Pending" value="3" subtitle="Awaiting review" />
      <KPI title="Imported ULDs" value="247" subtitle="Last 30 days" />
      <KPI title="Failed Messages" value="2" subtitle="Requires attention" />
      <KPI title="Messages This Month" value="186" subtitle="June 2026" />
    </div>
  );
}