export default function KPIStrip({ data }: { data: { totalStorageCapacity: string; occupiedCapacity: string; availableCapacity: string; forecastInboundPieces: number; highRiskZones: number; coldChainRemaining: string } }) {
  const cards = [
    { label: "Total Storage Capacity", value: data.totalStorageCapacity },
    { label: "Occupied Capacity", value: data.occupiedCapacity },
    { label: "Available Capacity", value: data.availableCapacity },
    { label: "Forecast Inbound Pieces", value: data.forecastInboundPieces.toLocaleString() },
    { label: "High-Risk Zones", value: data.highRiskZones },
    { label: "Cold-Chain Capacity Remaining", value: data.coldChainRemaining },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((card) => (
        <div key={card.label} className="rounded-[16px] border border-[#E2E8F0] bg-white p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[12px] font-medium text-[#64748B] block mb-1">{card.label}</span>
            <span className="text-[24px] font-bold text-[#0F172A]">{card.value}</span>
          </div>
          <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold bg-[#D1FAE5] text-[#10B981] border border-[#D1FAE5] whitespace-nowrap">inc</span>
        </div>
      ))}
    </div>
  );
}