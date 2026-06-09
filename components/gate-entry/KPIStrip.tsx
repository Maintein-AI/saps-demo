import KPICard from "@/components/KPICard";

export default function KPIStrip() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      <KPICard
        title="Vehicles inside"
        value="18"
        subtitle="5 on dock, 13 in yard"
        trend="neutral"
        trendValue=""
      />
      <KPICard
        title="Vehicles waiting"
        value="3"
        subtitle="At Gate 1 & Gate 2"
        trend="up"
        trendValue="+1"
      />
      <KPICard
        title="Average dwell"
        value="42 min"
        subtitle="Target: 35 min"
        trend="down"
        trendValue="-8 min"
      />
      <KPICard
        title="Today entries"
        value="47"
        subtitle="Since 06:00 AM"
        trend="up"
        trendValue="+12 vs yesterday"
      />
      <KPICard
        title="Today exits"
        value="39"
        subtitle="Since 06:00 AM"
        trend="neutral"
        trendValue=""
      />
      <KPICard
        title="Vehicles on hold"
        value="2"
        subtitle="Awaiting verification"
        trend="neutral"
        trendValue=""
      />
    </div>
  );
}