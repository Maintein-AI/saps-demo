"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import KPIStrip from "@/components/consignee/pod-history/KPIStrip";
import FilterBar from "@/components/consignee/pod-history/FilterBar";
import PODContent from "@/components/consignee/pod-history/PODContent";

export default function PODHistoryPage() {
  const [filters, setFilters] = useState<Record<string, string>>({});

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-1.5 text-[12px] text-[#94A3B8]">
        <Link href="/" className="hover:text-[#64748B] transition-colors">Home</Link>
        <ChevronRight size={12} />
        <Link href="/consignee/dashboard" className="hover:text-[#64748B] transition-colors">Consignee</Link>
        <ChevronRight size={12} />
        <span className="text-[#64748B]">POD History</span>
      </div>

      <div className="flex items-center gap-2">
        <h1 className="text-[22px] font-bold text-[#0F172A]">POD History</h1>
      </div>

      <KPIStrip />

      <FilterBar onFilter={setFilters} />

      <PODContent filters={filters} />
    </div>
  );
}