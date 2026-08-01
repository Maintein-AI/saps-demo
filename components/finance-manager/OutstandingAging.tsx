"use client";

const buckets = [
  { label: "0–7 days", count: 18, amount: 1200000, color: "#16A34A", bg: "#DCFCE7" },
  { label: "8–14 days", count: 14, amount: 2100000, color: "#D97706", bg: "#FEF3C7" },
  { label: "15–30 days", count: 9, amount: 2800000, color: "#D97706", bg: "#FEF3C7" },
  { label: "31–60 days", count: 5, amount: 1500000, color: "#DC2626", bg: "#FEE2E2" },
  { label: "60+ days", count: 3, amount: 520000, color: "#DC2626", bg: "#FEE2E2" },
];

const total = buckets.reduce((s, b) => s + b.amount, 0);

function formatPKR(value: number) {
  if (value >= 1_000_000) return `Rs. ${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `Rs. ${(value / 1_000).toFixed(0)}K`;
  return `Rs. ${value}`;
}

export default function OutstandingAging() {
  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2.5">
          <h2 className="text-[15px] font-bold text-[#0F172A]">Outstanding Aging</h2>
        </div>
      </div>
      <div className="p-5">
        <div className="space-y-4">
          {buckets.map((b) => {
            const pct = Math.round((b.amount / total) * 100);
            return (
              <div key={b.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-semibold text-[#0F172A]">{b.label}</span>
                    <span
                      className="inline-flex items-center h-5 px-2 rounded-full text-[11px] font-semibold"
                      style={{ backgroundColor: b.bg, color: b.color }}
                    >
                      {b.count} invoices
                    </span>
                  </div>
                  <span className="text-[13px] font-bold text-[#0F172A]">{formatPKR(b.amount)}</span>
                </div>
                <div className="h-2 rounded-full bg-[#F1F5F9] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${pct}%`, backgroundColor: b.color }}
                  />
                </div>
                <div className="text-right mt-0.5">
                  <span className="text-[11px] text-[#94A3B8]">{pct}%</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-5 pt-4 border-t border-[#E2E8F0]">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-semibold text-[#0F172A]">Total Outstanding</span>
            <span className="text-[18px] font-bold text-[#0B2545]">{formatPKR(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}