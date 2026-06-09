import ScopeBadge from "./ScopeBadge";

interface KPICardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
}

export default function KPICard({ title, value, subtitle, trend, trendValue }: KPICardProps) {
  const trendColor =
    trend === "up" ? "#16A34A" : trend === "down" ? "#DC2626" : "#64748B";

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[13px] font-semibold text-[#64748B]">{title}</h3>
        <ScopeBadge type="inc" />
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