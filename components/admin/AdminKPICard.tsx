import { TrendingUp, TrendingDown } from "lucide-react";

interface AdminKPICardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
}

export default function AdminKPICard({ title, value, subtitle, trend, trendValue }: AdminKPICardProps) {
  const trendColor =
    trend === "up" ? "#16A34A" : trend === "down" ? "#DC2626" : "#64748B";

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[13px] font-semibold text-[#64748B]">{title}</h3>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-[28px] font-bold text-[#0F172A]">{value}</span>
        {trend && trendValue && (
          <span className="flex items-center gap-0.5 text-[12px] font-medium" style={{ color: trendColor }}>
            {trend === "up" ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
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