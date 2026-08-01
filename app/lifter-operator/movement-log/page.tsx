"use client";

import { useState } from "react";
import { Home, Move, Download, FileText } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";
import { useToast } from "@/components/ToastContext";
import KPIStrip from "@/components/lifter-operator/movement-log/KPIStrip";
import FilterBar from "@/components/lifter-operator/movement-log/FilterBar";
import QuickFilterChips from "@/components/lifter-operator/movement-log/QuickFilterChips";
import MovementTable from "@/components/lifter-operator/movement-log/MovementTable";
import DailyTimeline from "@/components/lifter-operator/movement-log/DailyTimeline";
import LogLoadingSkeleton from "@/components/lifter-operator/movement-log/LogLoadingSkeleton";

export default function MovementLogPage() {
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [activeQuickFilter, setActiveQuickFilter] = useState("Today");

  const breadcrumbItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Lifter Operator", href: "/lifter-operator" },
    { label: "Movement Log", href: "#" },
  ];

  const handleExport = () => {
    addToast("Movement log exported to CSV", "success");
  };

  return (
    <div className="space-y-5">
      <Breadcrumb items={breadcrumbItems} />

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0B2545] flex items-center justify-center">
            <Move size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-[22px] font-bold text-[#0F172A] tracking-tight">
              Movement Log
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="h-10 px-4 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <Download size={16} />
            Export Log
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => { setIsLoading(false); setIsError(false); setIsEmpty(false); }}
          className="h-7 px-3 rounded-lg text-[11px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer transition-colors"
        >
          Normal
        </button>
        <button
          onClick={() => { setIsLoading(true); setIsError(false); setIsEmpty(false); }}
          className="h-7 px-3 rounded-lg text-[11px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer transition-colors"
        >
          Loading
        </button>
        <button
          onClick={() => { setIsLoading(false); setIsError(true); setIsEmpty(false); }}
          className="h-7 px-3 rounded-lg text-[11px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer transition-colors"
        >
          Error
        </button>
        <button
          onClick={() => { setIsLoading(false); setIsError(false); setIsEmpty(true); }}
          className="h-7 px-3 rounded-lg text-[11px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer transition-colors"
        >
          Empty
        </button>
      </div>

      <KPIStrip />

      <FilterBar />

      <QuickFilterChips
        activeFilter={activeQuickFilter}
        onFilterChange={setActiveQuickFilter}
      />

      {isLoading && <LogLoadingSkeleton />}

      {isError && (
        <div className="space-y-5">
          <ErrorState
            title="Movement log failed to load"
            message="Unable to fetch movement history from the server. This may be due to a network issue or the server is temporarily unavailable."
            onRetry={() => setIsError(false)}
          />
          <LogLoadingSkeleton />
        </div>
      )}

      {isEmpty && (
        <EmptyState
          title="No movements recorded"
          description="No movements recorded for selected filter. Adjust your date range or shift selection to see results."
          icon={<FileText size={28} className="text-[#94A3B8]" />}
        />
      )}

      {!isLoading && !isError && !isEmpty && (
        <div className="space-y-5">
          <MovementTable />
          <DailyTimeline />
        </div>
      )}
    </div>
  );
}