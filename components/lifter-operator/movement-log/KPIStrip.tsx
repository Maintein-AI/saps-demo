import KPICard from "../../KPICard";

export default function KPIStrip() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      <KPICard
        title="Tasks Completed"
        value="14"
        subtitle="Today, 31 May 2026"
        trend="up"
        trendValue="+2 vs yesterday"
      />
      <KPICard
        title="Active Tasks"
        value="2"
        subtitle="In progress now"
        trend="neutral"
        trendValue=""
      />
      <KPICard
        title="Avg Task Time"
        value="8.2 min"
        subtitle="Median: 7 min"
        trend="down"
        trendValue="-1.1 min"
      />
      <KPICard
        title="Exceptions Reported"
        value="1"
        subtitle="RFID mismatch resolved"
        trend="neutral"
        trendValue=""
      />
      <KPICard
        title="Total Movements"
        value="16"
        subtitle="3.8 km total distance"
        trend="up"
        trendValue="+4 vs yesterday"
      />
    </div>
  );
}