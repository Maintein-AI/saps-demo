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
      <KPI title="GDs filed today" value="24" subtitle="18 cleared, 6 pending" trend="up" trendValue="+4" />
      <KPI title="OOC pending" value="7" subtitle="3 from Red channel" trend="down" trendValue="-2" />
      <KPI title="Yellow channel queries" value="12" subtitle="Awaiting response" trend="up" trendValue="+3" />
      <KPI title="Red channel exams" value="5" subtitle="Scheduled for today" trend="neutral" trendValue="0" />
      <KPI title="DOs ready for collection" value="9" subtitle="3 drivers assigned" trend="down" trendValue="-1" />
      <KPI title="Payments due" value="PKR 2.1M" subtitle="8 invoices" trend="up" trendValue="+PKR 560K" />
    </div>
  );
}