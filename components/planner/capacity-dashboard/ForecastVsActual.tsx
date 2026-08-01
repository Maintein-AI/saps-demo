"use client";

export default function ForecastVsActual() {
  const expected = 1250;
  const received = 940;
  const variance = received - expected;

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-5">
        <h2 className="text-[16px] font-semibold text-[#0F172A]">Forecast vs Actual</h2>
      </div>
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] font-medium text-[#64748B]">Expected</span>
              <span className="text-[14px] font-bold text-[#0F172A]">{expected.toLocaleString()} pieces</span>
            </div>
            <div className="w-full h-4 rounded-full overflow-hidden bg-[#F8FAFC]">
              <div className="h-full rounded-full" style={{ width: "100%", backgroundColor: "#E2E8F0" }} />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] font-medium text-[#64748B]">Received</span>
              <span className="text-[14px] font-bold text-[#1B4F8B]">{received.toLocaleString()} pieces</span>
            </div>
            <div className="w-full h-4 rounded-full overflow-hidden bg-[#F8FAFC]">
              <div className="h-full rounded-full" style={{ width: `${(received / expected) * 100}%`, backgroundColor: "#1B4F8B" }} />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] font-medium text-[#64748B]">Variance</span>
              <span className={`text-[14px] font-bold ${variance < 0 ? "text-[#EF4444]" : "text-[#10B981]"}`}>
                {variance > 0 ? "+" : ""}{variance.toLocaleString()} pieces
              </span>
            </div>
            <div className="w-full h-4 rounded-full overflow-hidden bg-[#F8FAFC]">
              <div className="h-full rounded-full" style={{ width: `${Math.abs((variance / expected) * 100)}%`, backgroundColor: variance < 0 ? "#EF4444" : "#10B981" }} />
            </div>
          </div>
        </div>
        <div className="rounded-[12px] border border-[#FEF3C7] bg-[#FEF3C7]/30 p-3">
          <span className="text-[12px] font-semibold text-[#D97706] block mb-1">Forecast Gap</span>
          <span className="text-[13px] text-[#D97706]/80">
            {Math.abs(variance).toLocaleString()} pieces below expected. Cold-chain perishables may need priority allocation.
          </span>
        </div>
      </div>
    </div>
  );
}