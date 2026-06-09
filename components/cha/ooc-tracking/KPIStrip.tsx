import ScopeBadge from "@/components/ScopeBadge";

interface KPIProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
}

function KPI({ title, value, subtitle, trend, trendValue }: KPIProps) {
  const trendColor = trend === "up" ? "#16A34A" : trend === "down" ? "#DC2626" : "#64748B";
  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[13px] font-semibold text-[#64748B]">{title}</h3>
        <ScopeBadge type="exc" />
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-[26px] font-bold text-[#0F172A]">{value}</span>
        {trend && trendValue && (
          <span className="text-[12px] font-medium" style={{ color: trendColor }}>
            {trendValue}
          </span>
        )}
      </div>
      {subtitle && <p className="text-[12px] text-[#64748B] mt-1">{subtitle}</p>}
    </div>
  );
}

export default function KPIStrip() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <KPI title="Filed" value="32" subtitle="12 filed today" trend="up" trendValue="+3" />
      <KPI title="Under Review" value="18" subtitle="Awaiting examiner" trend="neutral" trendValue="0" />
      <KPI title="Query" value="11" subtitle="4 new queries" trend="up" trendValue="+2" />
      <KPI title="Examined" value="8" subtitle="5 cleared today" trend="down" trendValue="-1" />
      <KPI title="OOC Issued" value="14" subtitle="3 today" trend="up" trendValue="+2" />
      <KPI title="Released" value="24" subtitle="6 DOs collected" trend="up" trendValue="+5" />
    </div>
  );
}