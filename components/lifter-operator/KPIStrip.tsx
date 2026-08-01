import KPICard from "@/components/KPICard";

export default function KPIStrip() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      <KPICard
        title="Assigned Tasks"
        value="8"
        subtitle="3 due within 20 min"
        trend="neutral"
        trendValue=""
      />
      <KPICard
        title="In Progress"
        value="2"
        subtitle="2 tasks active"
        trend="neutral"
        trendValue=""
      />
      <KPICard
        title="Completed Today"
        value="14"
        subtitle="Last: 31 May 10:42"
        trend="up"
        trendValue="+3 vs yesterday"
      />
      <KPICard
        title="Urgent Tasks"
        value="2"
        subtitle="Requires immediate action"
        trend="down"
        trendValue="1 new urgent"
      />
      <KPICard
        title="Exceptions Reported"
        value="1"
        subtitle="RFID mismatch at Gate 3"
        trend="neutral"
        trendValue=""
      />
    </div>
  );
}