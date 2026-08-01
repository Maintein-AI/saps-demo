export default function KPIStrip({ data }: { data: { erpMappings: number; successfulPushes: number; failedPushes: number; pendingJournals: number; glExceptions: number; lastSync: string } }) {
  const cards = [
    { label: "ERP Mappings", value: data.erpMappings },
    { label: "Successful Pushes", value: data.successfulPushes },
    { label: "Failed Pushes", value: data.failedPushes },
    { label: "Pending Journals", value: data.pendingJournals },
    { label: "GL Exceptions", value: data.glExceptions },
    { label: "Last Sync", value: data.lastSync, isText: true },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((card) => (
        <div key={card.label} className="rounded-[16px] border border-[#E2E8F0] bg-white p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[12px] font-medium text-[#64748B] block mb-1">{card.label}</span>
            <span className="text-[24px] font-bold text-[#0F172A]">{card.value}</span>
          </div>
        </div>
      ))}
    </div>
  );
}