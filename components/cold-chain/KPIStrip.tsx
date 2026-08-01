import KPICard from "@/components/KPICard";
import LoadingSkeleton from "@/components/LoadingSkeleton";

interface KPIStripProps {
  loading?: boolean;
}

export default function KPIStrip({ loading }: KPIStripProps) {
  if (loading) {
    return (
      <div className="rounded-xl border border-[#E2E8F0] bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-[16px] font-bold text-[#0F172A]">Cold Chain Summary</h2>
        </div>
        <LoadingSkeleton rows={2} columns={5} />
      </div>
    );
  }

  const cards = [
    { title: "Cold-chain AWBs", value: "47", subtitle: "Across 4 regimes", trend: "up" as const, trendValue: "+3 today" },
    { title: "Active temp zones", value: "12", subtitle: "8 cold rooms, 4 deep freeze", trend: "neutral" as const, trendValue: "No change" },
    { title: "Current anomalies", value: "3", subtitle: "2 acknowledged, 1 active", trend: "down" as const, trendValue: "-1 vs yesterday" },
    { title: "Avg temperature compliance", value: "98.2%", subtitle: "SLA target 95%", trend: "up" as const, trendValue: "+1.2%" },
    { title: "Sensor health", value: "42 / 44", subtitle: "2 sensors offline", trend: "neutral" as const, trendValue: "Check maintenance" },
  ];

  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-white p-5">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-[16px] font-bold text-[#0F172A]">Cold Chain Summary</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {cards.map((card) => (
          <KPICard
            key={card.title}
            title={card.title}
            value={card.value}
            subtitle={card.subtitle}
            trend={card.trend}
            trendValue={card.trendValue}
          />
        ))}
      </div>
    </div>
  );
}