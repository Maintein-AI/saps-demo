import Link from "next/link";
import { ChevronRight } from "lucide-react";
import ScopeBadge from "@/components/ScopeBadge";
import KPIStrip from "@/components/cha/ooc-tracking/KPIStrip";
import FilterBar from "@/components/cha/ooc-tracking/FilterBar";
import OOCTrackingTable from "@/components/cha/ooc-tracking/OOCTrackingTable";
import CustomsStatusTimeline from "@/components/cha/ooc-tracking/CustomsStatusTimeline";

export default function OocTrackingPage() {
  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[12px] text-[#64748B]">
        <Link href="/" className="text-[#1B4F8B] hover:underline no-underline">Home</Link>
        <ChevronRight size={14} />
        <Link href="/cha" className="text-[#1B4F8B] hover:underline no-underline">CHA</Link>
        <ChevronRight size={14} />
        <span className="text-[#0F172A] font-semibold">OOC Tracking</span>
      </div>

      {/* Page Title */}
      <div className="flex items-center gap-3">
        <h1 className="text-[24px] font-bold text-[#0F172A]">OOC Tracking</h1>
        <ScopeBadge type="exc" />
      </div>

      {/* KPI Strip */}
      <KPIStrip />

      {/* Filter Bar */}
      <FilterBar />

      {/* Main Table */}
      <OOCTrackingTable />

      {/* Timeline Card */}
      <CustomsStatusTimeline />
    </div>
  );
}