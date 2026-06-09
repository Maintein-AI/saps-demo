import KPICard from "@/components/KPICard";

export default function KPIStrip() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <KPICard title="SLA conformance %" value="94.2%" subtitle="Target: 92%" trend="up" trendValue="+1.4%" />
      <KPICard title="Tasks completed" value="1,847" subtitle="Today so far" trend="up" trendValue="+8%" />
      <KPICard title="Average putaway time" value="7m 12s" subtitle="Target: 8m" trend="down" trendValue="-12%" />
      <KPICard title="Average pick time" value="5m 48s" subtitle="Target: 7m" trend="down" trendValue="-18%" />
      <KPICard title="Open exceptions" value="23" subtitle="6 high severity" trend="down" trendValue="-4%" />
      <KPICard title="Operator productivity score" value="89.4" subtitle="Out of 100" trend="up" trendValue="+2.1%" />
    </div>
  );
}