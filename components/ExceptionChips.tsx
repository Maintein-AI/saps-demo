const exceptions = [
  { name: "Misrouted", count: 2 },
  { name: "Shortage", count: 1 },
  { name: "Overage", count: 0 },
  { name: "Damage", count: 1 },
  { name: "Leakage / Wet Cargo", count: 0 },
  { name: "Tampering", count: 0 },
  { name: "Pilferage", count: 1 },
  { name: "Missing Documents", count: 2 },
  { name: "Wrong Weight", count: 0 },
];

export default function ExceptionChips() {
  return (
    <div className="flex flex-wrap gap-2">
      {exceptions.map((ex) => (
        <div
          key={ex.name}
          className={`flex items-center gap-2 h-8 px-3 rounded-full border text-[12px] font-medium cursor-pointer transition-colors ${
            ex.count > 0
              ? "bg-[#DC2626]/10 border-[#DC2626]/30 text-[#DC2626] hover:bg-[#DC2626]/20"
              : "bg-[#F8FAFC] border-[#E2E8F0] text-[#64748B]"
          }`}
        >
          <span>{ex.name}</span>
          <span
            className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold ${
              ex.count > 0 ? "bg-[#DC2626] text-white" : "bg-[#E2E8F0] text-[#64748B]"
            }`}
          >
            {ex.count}
          </span>
        </div>
      ))}
    </div>
  );
}