const stats = [
  {
    title: "Cargo in-house",
    values: [
      { label: "pieces", value: "14,237" },
      { label: "kg", value: "892,450" },
      { label: "pallets", value: "1,204" },
      { label: "ULDs", value: "47" },
    ],
    badge: "inc" as const,
  },
  {
    title: "Customs queue",
    values: [
      { label: "Green", value: "342", color: "#16A34A" },
      { label: "Yellow", value: "89", color: "#D97706" },
      { label: "Red", value: "23", color: "#DC2626" },
    ],
    badge: "inc" as const,
  },
  {
    title: "Outstanding charges",
    values: [
      { label: "PKR", value: "8,450,000" },
      { label: "invoices", value: "124" },
    ],
    badge: "inc" as const,
  },
  {
    title: "Active handling equipment",
    values: [
      { label: "stackers", value: "3" },
      { label: "lifters", value: "12" },
      { label: "uptime %", value: "94%" },
    ],
    badge: "inc" as const,
  },
];

export default function QuickStatsStrip() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[14px] font-bold text-[#0F172A]">
              {stat.title}
            </h3>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {stat.values.map((v, i) => (
              <div key={i}>
                <span className="text-[20px] font-bold text-[#0F172A]">
                  {v.value}
                </span>
                <span
                  className="text-[12px] font-medium text-[#64748B] ml-1"
                  style={"color" in v && v.color ? { color: v.color } : undefined}
                >
                  {v.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}