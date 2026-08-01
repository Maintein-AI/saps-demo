const statusCounts = [
  { label: "Arrived", count: 14, color: "#1B4F8B" },
  { label: "Customs", count: 8, color: "#D97706" },
  { label: "OOC", count: 3, color: "#DC2626" },
  { label: "Charges Due", count: 6, color: "#7C3AED" },
  { label: "DO Ready", count: 11, color: "#16A34A" },
  { label: "Picked", count: 7, color: "#0EA5E9" },
];

export default function ShipmentSummary() {
  const total = statusCounts.reduce((sum, s) => sum + s.count, 0);

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[16px] font-bold text-[#0F172A]">Shipment Status Summary</h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
        {statusCounts.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 text-center"
          >
            <span
              className="inline-block w-3 h-3 rounded-full mb-2"
              style={{ backgroundColor: s.color }}
            />
            <p className="text-[24px] font-bold text-[#0F172A]">{s.count}</p>
            <p className="text-[12px] text-[#64748B] font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="w-full h-2 rounded-full bg-[#F1F5F9] overflow-hidden flex">
        {statusCounts.map((s) => {
          const pct = (s.count / total) * 100;
          return (
            <div
              key={s.label}
              className="h-full transition-all"
              style={{ width: `${pct}%`, backgroundColor: s.color }}
              title={`${s.label}: ${s.count}`}
            />
          );
        })}
      </div>

      <div className="flex flex-wrap gap-3 mt-3">
        {statusCounts.map((s) => (
          <div key={s.label} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
            <span className="text-[11px] text-[#64748B] font-medium">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}