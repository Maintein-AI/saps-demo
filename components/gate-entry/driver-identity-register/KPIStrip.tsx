import ScopeBadge from "@/components/ScopeBadge";

export default function KPIStrip() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      {[
        { title: "Registered drivers", value: "124", subtitle: "Across all agents", trend: "neutral", trendValue: "" },
        { title: "Active drivers", value: "98", subtitle: "Clear to enter", trend: "up", trendValue: "+3" },
        { title: "Blocked drivers", value: "8", subtitle: "Suspended access", trend: "neutral", trendValue: "" },
        { title: "Expiring licenses", value: "6", subtitle: "Within 30 days", trend: "up", trendValue: "+2" },
        { title: "Recent visits", value: "47", subtitle: "Today since 06:00", trend: "up", trendValue: "+12" },
      ].map((kpi) => (
        <div key={kpi.title} className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">{kpi.title}</h3>
            <ScopeBadge type="exc" />
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