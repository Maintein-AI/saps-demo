import Link from "next/link";
import { ChevronRight } from "lucide-react";
import KPIStrip from "@/components/cha/do-collection/KPIStrip";
import FilterBar from "@/components/cha/do-collection/FilterBar";
import DOCollectionTable from "@/components/cha/do-collection/DOCollectionTable";
import GateRequirementsPanel from "@/components/cha/do-collection/GateRequirementsPanel";
import RecentCollections from "@/components/cha/do-collection/RecentCollections";

export default function DOCollectionPage() {
  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[12px] text-[#64748B]">
        <Link href="/" className="text-[#1B4F8B] hover:underline no-underline">Home</Link>
        <ChevronRight size={14} />
        <Link href="/cha" className="text-[#1B4F8B] hover:underline no-underline">CHA</Link>
        <ChevronRight size={14} />
        <span className="text-[#0F172A] font-semibold">DO Collection</span>
      </div>

      {/* Page Title */}
      <div className="flex items-center gap-3">
        <h1 className="text-[24px] font-bold text-[#0F172A]">DO Collection</h1>
      </div>

      {/* KPI Strip */}
      <KPIStrip />

      {/* Filter Bar */}
      <FilterBar />

      {/* Main Table */}
      <DOCollectionTable />

      {/* Gate Requirements + Recent Collections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <GateRequirementsPanel />
        </div>
        <div className="lg:col-span-2">
          <RecentCollections />
        </div>
      </div>
    </div>
  );
}