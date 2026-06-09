import KPICard from "@/components/KPICard";

export default function KPIStrip() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <KPICard title="AWBs in process" value="324" subtitle="Across all zones" trend="up" trendValue="+12%" />
      <KPICard title="Open exceptions" value="37" subtitle="6 high severity" trend="down" trendValue="-3%" />
      <KPICard title="SLA at risk" value="14" subtitle="Due within 1 hour" trend="up" trendValue="+5%" />
      <KPICard title="Active lifters" value="8" subtitle="4 idle, 1 fault" trend="neutral" trendValue="0%" />
      <KPICard title="Vehicles inside" value="23" subtitle="5 at gate, 2 long dwell" trend="up" trendValue="+2%" />
      <KPICard title="Shift productivity" value="87%" subtitle="Target: 90%" trend="down" trendValue="-2%" />
    </div>
  );
}