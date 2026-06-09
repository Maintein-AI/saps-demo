import ScopeBadge from "@/components/ScopeBadge";

interface KPIStripProps {
  active: number;
  customs: number;
  anf: number;
  asf: number;
  internal: number;
  discrepancy: number;
}

export default function KPIStrip({
  active,
  customs,
  anf,
  asf,
  internal,
  discrepancy,
}: KPIStripProps) {
  const items = [
    { title: "Active Holds", value: active.toString(), color: "#DC2626" },
    { title: "Customs Holds", value: customs.toString(), color: "#1B4F8B" },
    { title: "ANF Holds", value: anf.toString(), color: "#D97706" },
    { title: "ASF Holds", value: asf.toString(), color: "#7C3AED" },
    { title: "Internal Holds", value: internal.toString(), color: "#0B2545" },
    { title: "Discrepancy Holds", value: discrepancy.toString(), color: "#DC2626" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {items.map((item) => (
        <div
          key={item.title}
          className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[12px] font-semibold text-[#64748B]">
              {item.title}
            </h3>
            <ScopeBadge type="inc" />
          </div>
          <div className="flex items-baseline gap-2">
            <span
              className="text-[26px] font-bold"
              style={{ color: item.color }}
            >
              {item.value}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}