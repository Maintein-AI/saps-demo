import KPICard from "@/components/KPICard";

export default function KPIStrip() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <KPICard title="Open escalations" value="23" subtitle="Across all modules" trend="down" trendValue="-2%" />
      <KPICard title="High priority" value="7" subtitle="3 critical" trend="up" trendValue="+1%" />
      <KPICard title="SLA breached" value="4" subtitle="Overdue since 1h" trend="up" trendValue="+1" />
      <KPICard title="Awaiting decision" value="12" subtitle="Need supervisor action" trend="neutral" trendValue="0%" />
      <KPICard title="Reassigned today" value="3" subtitle="2 in progress" trend="down" trendValue="-1" />
      <KPICard title="Closed today" value="8" subtitle="4 approved, 4 rejected" trend="up" trendValue="+2" />
    </div>
  );
}