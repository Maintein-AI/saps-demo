export default function KPIStrip({ data }: { data: { tariffSets: number; agentContracts: number; consigneeTiers: number; routeOverrides: number; pendingApprovals: number; } }) {
  const cards = [
    { label: "Tariff Sets", value: data.tariffSets },
    { label: "Agent Contracts", value: data.agentContracts },
    { label: "Consignee Tiers", value: data.consigneeTiers },
    { label: "Route Overrides", value: data.routeOverrides },
    { label: "Pending Approvals", value: data.pendingApprovals },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {cards.map((card) => (
        <div key={card.label} className="rounded-[16px] border border-[#E2E8F0] bg-white p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[12px] font-medium text-[#64748B] block mb-1">{card.label}</span>
            <span className="text-[24px] font-bold text-[#0F172A]">{card.value}</span>
          </div>
          <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0] whitespace-nowrap">exc</span>
        </div>
      ))}
    </div>
  );
}