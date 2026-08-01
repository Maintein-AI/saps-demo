"use client";

import Breadcrumb from "@/components/Breadcrumb";
import FinancialTraceContent from "@/components/auditor/financial-trace/FinancialTraceContent";

export default function FinancialTracePage() {
  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Auditor", href: "/auditor" }, { label: "Financial Trace" }]} />
      <div className="flex items-center gap-2">
        <h1 className="text-[22px] font-bold text-[#0F172A]">Financial Trace</h1>
      </div>
      <FinancialTraceContent />
    </div>
  );
}