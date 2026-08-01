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
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      <KPI title="Charges Due" value="PKR 1.86M" subtitle="6 invoices" trend="up" trendValue="+PKR 420K" />
      <KPI title="DOs Ready" value="11" subtitle="After payment" trend="down" trendValue="-1" />
      <KPI title="Paid This Month" value="PKR 3.45M" subtitle="18 invoices" trend="up" trendValue="+22%" />
      <KPI title="Overdue" value="3" subtitle="PKR 425,000" trend="down" trendValue="-2" />
      <KPI title="DOs Downloaded" value="24" subtitle="This month" trend="up" trendValue="+4" />
    </div>
  );
}