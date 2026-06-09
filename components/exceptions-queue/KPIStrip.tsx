import ScopeBadge from "@/components/ScopeBadge";
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
          <h2 className="text-[16px] font-bold text-[#0F172A]">Exception Summary</h2>
          <ScopeBadge type="inc" />
        </div>
        <LoadingSkeleton rows={2} columns={6} />
      </div>
    );
  }

  const cards = [
    { title: "Open CDRs", value: "34", subtitle: "Across all types", trend: "up" as const, trendValue: "+3 today" },
    { title: "Damage cases", value: "12", subtitle: "Awaiting inspection", trend: "down" as const, trendValue: "-2 vs yesterday" },
    { title: "Shortage cases", value: "7", subtitle: "Under investigation", trend: "neutral" as const, trendValue: "No change" },
    { title: "Overage cases", value: "5", subtitle: "3 resolved today", trend: "up" as const, trendValue: "+1 today" },
    { title: "Avg exception age", value: "4h 12m", subtitle: "SLA target 6h", trend: "down" as const, trendValue: "-18m" },
    { title: "Escalated cases", value: "3", subtitle: "Pending supervisor review", trend: "neutral" as const, trendValue: "No change" },
  ];

  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-white p-5">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-[16px] font-bold text-[#0F172A]">Exception Summary</h2>
        <ScopeBadge type="inc" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
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