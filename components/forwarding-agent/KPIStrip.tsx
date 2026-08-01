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
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[13px] font-semibold text-[#64748B]">{title}</h3>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-[28px] font-bold text-[#0F172A]">{value}</span>
        {trend && trendValue && (
          <span className="text-[12px] font-medium" style={{ color: trendColor }}>
            {trendValue}
          </span>
        )}
      </div>
      {subtitle && (
        <p className="text-[12px] text-[#64748B] mt-1">{subtitle}</p>
      )}
    </div>
  );
}

export default function KPIStrip() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <KPI title="My open AWBs" value="14" subtitle="3 priority" trend="up" trendValue="+2" />
      <KPI title="AWBs awaiting docs" value="6" subtitle="2 customs-related" trend="down" trendValue="-1" />
      <KPI title="Outstanding payments" value="PKR 1.24M" subtitle="4 invoices" trend="up" trendValue="+PKR 340K" />
      <KPI title="Vehicles scheduled today" value="3" subtitle="2 approved, 1 pending" trend="neutral" trendValue="0" />
      <KPI title="DOs ready" value="5" subtitle="2 collected" trend="down" trendValue="-1" />
      <KPI title="Notifications pending" value="7" subtitle="2 critical" trend="up" trendValue="+3" />
    </div>
  );
}