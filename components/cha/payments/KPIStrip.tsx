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
      <KPI title="Outstanding PKR" value="Rs 4,850,000" subtitle="Across 28 invoices" trend="down" trendValue="-12%" />
      <KPI title="Invoices Due" value="18" subtitle="5 due today" trend="up" trendValue="+3" />
      <KPI title="Paid This Month" value="Rs 8,200,000" subtitle="42 invoices settled" trend="up" trendValue="+18%" />
      <KPI title="Overdue" value="7" subtitle="Rs 1,425,000" trend="down" trendValue="-2" />
      <KPI title="Receipts Available" value="35" subtitle="This month" trend="up" trendValue="+8" />
      <KPI title="Disputed Invoices" value="3" subtitle="Rs 450,000" trend="neutral" trendValue="0" />
    </div>
  );
}