"use client";

export default function ViewSwitcher({
  active,
  onChange,
}: {
  active: string;
  onChange: (v: string) => void;
}) {
  const views = ["Day", "Week"];

  return (
    <div className="inline-flex items-center gap-0 bg-[#F8FAFC] border border-[#E2E8F0] rounded-full p-1">
      {views.map((v) => (
        <button
          key={v}
          onClick={() => onChange(v)}
          className={`px-3 py-1.5 rounded-full text-[13px] font-semibold cursor-pointer transition-colors whitespace-nowrap ${
            active === v
              ? "text-white shadow-sm"
              : "text-[#64748B] hover:text-[#0F172A]"
          }`}
          style={{ backgroundColor: active === v ? "#0B2545" : "transparent" }}
        >
          {v}
        </button>
      ))}
    </div>
  );
}