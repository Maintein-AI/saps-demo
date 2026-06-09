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
      <KPI title="My Shipments" value="42" subtitle="12 active" trend="up" trendValue="+5" />
      <KPI title="Customs Pending" value="8" subtitle="3 Red channel" trend="down" trendValue="-2" />
      <KPI title="Charges Due" value="PKR 1.86M" subtitle="6 invoices" trend="up" trendValue="+PKR 420K" />
      <KPI title="DO Ready" value="11" subtitle="3 ready today" trend="down" trendValue="-1" />
      <KPI title="Pickups Scheduled" value="6" subtitle="2 today" trend="up" trendValue="+2" />
      <KPI title="Delivered Shipments" value="28" subtitle="This month" trend="up" trendValue="+4" />
    </div>
  );
}