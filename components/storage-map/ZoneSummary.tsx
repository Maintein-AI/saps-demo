"use client";
import KPICard from "@/components/KPICard";
import type { RackData } from "@/app/warehouse-manager/storage-map/page";

interface ZoneSummaryProps {
  racks: RackData[];
}

export default function ZoneSummary({ racks }: ZoneSummaryProps) {
  // Calculate zone stats
  const zones = ["AFU", "GCR", "PER", "VAL", "DGR", "COLD"];

  const zoneStats = zones.map((zone) => {
    const zoneRacks = racks.filter((r) => r.zone === zone);
    const total = zoneRacks.length;
    const occupied = zoneRacks.filter((r) => r.status === "full" || r.status === "partial").length;
    const available = zoneRacks.filter((r) => r.status === "available").length;
    const blocked = zoneRacks.filter((r) => r.status === "blocked").length;
    const utilization = total > 0 ? Math.round((occupied / total) * 100) : 0;
    return {
      zone,
      total,
      occupied,
      available,
      blocked,
      utilization,
    };
  });

  const standardPallet = zoneStats.find((z) => z.zone === "AFU");
  const wideBay = zoneStats.find((z) => z.zone === "GCR");
  const coldChain = zoneStats.find((z) => z.zone === "COLD");
  const blockedLocs = racks.filter((r) => r.status === "blocked").length;
  const overCapacity = racks.filter((r) => r.occupancy > 95).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      <KPICard
        title="Standard Pallet"
        value={`${standardPallet?.utilization || 0}%`}
        subtitle={`${standardPallet?.available || 0} / ${standardPallet?.total || 0} available`}
        trend={standardPallet && standardPallet.utilization > 70 ? "down" : "up"}
        trendValue={standardPallet && standardPallet.utilization > 70 ? "High" : "Normal"}
      />
      <KPICard
        title="Wide-Bay 2-Level"
        value={`${wideBay?.utilization || 0}%`}
        subtitle={`${wideBay?.available || 0} / ${wideBay?.total || 0} available`}
        trend={wideBay && wideBay.utilization > 70 ? "down" : "up"}
        trendValue={wideBay && wideBay.utilization > 70 ? "High" : "Normal"}
      />
      <KPICard
        title="Cold-Chain"
        value={`${coldChain?.utilization || 0}%`}
        subtitle={`${coldChain?.available || 0} / ${coldChain?.total || 0} available`}
        trend={coldChain && coldChain.utilization > 70 ? "down" : "up"}
        trendValue={coldChain && coldChain.utilization > 70 ? "High" : "Normal"}
      />
      <KPICard
        title="Blocked Locations"
        value={blockedLocs.toString()}
        subtitle={`${Math.round((blockedLocs / racks.length) * 100)}% of total racks`}
        trend={blockedLocs > 20 ? "down" : "up"}
        trendValue={blockedLocs > 20 ? "Alert" : "OK"}
      />
      <KPICard
        title="Over-Capacity"
        value={overCapacity.toString()}
        subtitle={`${Math.round((overCapacity / racks.length) * 100)}% near full capacity`}
        trend={overCapacity > 10 ? "down" : "up"}
        trendValue={overCapacity > 10 ? "Warning" : "OK"}
      />
    </div>
  );
}