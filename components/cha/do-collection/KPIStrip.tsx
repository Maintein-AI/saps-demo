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
      <KPI title="DO Ready" value="18" subtitle="Awaiting assignment" trend="up" trendValue="+4" />
      <KPI title="Driver Assigned" value="12" subtitle="3 today" trend="up" trendValue="+2" />
      <KPI title="Vehicle Assigned" value="9" subtitle="Pending gate pass" trend="neutral" trendValue="0" />
      <KPI title="Scheduled Today" value="7" subtitle="14:00 - 18:00" trend="up" trendValue="+1" />
      <KPI title="Collected" value="24" subtitle="6 today" trend="up" trendValue="+5" />
      <KPI title="Pending Collection" value="14" subtitle="3 overdue" trend="down" trendValue="-2" />
    </div>
  );
}