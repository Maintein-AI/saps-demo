import ScopeBadge from "@/components/ScopeBadge";

export default function BoardKPIStrip() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {[
        { title: "Vehicles inside", value: "18", subtitle: "5 on dock, 13 in yard", trend: "neutral" as const, trendValue: "" },
        { title: "Vehicles waiting", value: "3", subtitle: "At Gate 1 & Gate 2", trend: "up" as const, trendValue: "+1" },
        { title: "Average dwell", value: "42 min", subtitle: "Target: 35 min", trend: "down" as const, trendValue: "-8 min" },
        { title: "Long dwell alerts", value: "2", subtitle: "Over 90 min", trend: "up" as const, trendValue: "+1" },
        { title: "Today entries", value: "47", subtitle: "Since 06:00 AM", trend: "up" as const, trendValue: "+12 vs yesterday" },
        { title: "Today exits", value: "39", subtitle: "Since 06:00 AM", trend: "neutral" as const, trendValue: "" },
      ].map((kpi) => (
        <div key={kpi.title} className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">{kpi.title}</h3>
            <ScopeBadge type="inc" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[28px] font-bold text-[#0F172A]">{kpi.value}</span>
            {kpi.trendValue && (
              <span
                className="text-[12px] font-semibold"
                style={{
                  color: kpi.trend === "up" ? "#16A34A" : kpi.trend === "down" ? "#DC2626" : "#64748B",
                }}
              >
                {kpi.trendValue}
              </span>
            )}
          </div>
          {kpi.subtitle && (
            <p className="text-[11px] text-[#94A3B8] mt-1">{kpi.subtitle}</p>
          )}
        </div>
      ))}
    </div>
  );
}