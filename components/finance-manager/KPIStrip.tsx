"use client";

import ScopeBadge from "@/components/ScopeBadge";

export default function KPIStrip() {
  const kpis = [
    { title: "Today billed PKR", value: "Rs. 2.47M", subtitle: "Including storage, handling, and customs", trend: "up" as const, trendValue: "+Rs. 340K today" },
    { title: "Today collected PKR", value: "Rs. 1.89M", subtitle: "Cash, bank transfer, and card", trend: "up" as const, trendValue: "+Rs. 210K today" },
    { title: "Outstanding PKR", value: "Rs. 8.12M", subtitle: "Across all open invoices", trend: "down" as const, trendValue: "-Rs. 120K today" },
    { title: "Waiver requests pending", value: "7", subtitle: "Awaiting approval", trend: "up" as const, trendValue: "+2 today" },
    { title: "Average DSO", value: "18 days", subtitle: "Days sales outstanding", trend: "down" as const, trendValue: "-2 days" },
    { title: "Invoices generated today", value: "42", subtitle: "Auto + manual generation", trend: "up" as const, trendValue: "+6 today" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
      {kpis.map((kpi) => {
        const trendColor =
          kpi.trend === "up" ? "#16A34A" : kpi.trend === "down" ? "#DC2626" : "#64748B";
        return (
          <div
            key={kpi.title}
            className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[12px] font-semibold text-[#64748B] leading-tight">
                {kpi.title}
              </h3>
              <ScopeBadge type="inc" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-[26px] font-bold text-[#0F172A]">{kpi.value}</span>
              <span className="text-[11px] font-medium" style={{ color: trendColor }}>
                {kpi.trendValue}
              </span>
            </div>
            <p className="text-[11px] text-[#64748B] mt-1">{kpi.subtitle}</p>
          </div>
        );
      })}
    </div>
  );
}