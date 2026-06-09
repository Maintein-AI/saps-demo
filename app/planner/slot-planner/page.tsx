"use client";

import { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import ScopeBadge from "@/components/ScopeBadge";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";
import { useToast } from "@/components/ToastContext";
import ViewSwitcher from "@/components/planner/slot-planner/ViewSwitcher";
import FilterBar from "@/components/planner/slot-planner/FilterBar";
import CalendarGrid from "@/components/planner/slot-planner/CalendarGrid";
import ConflictPanel from "@/components/planner/slot-planner/ConflictPanel";
import SlotDetailDrawer from "@/components/planner/slot-planner/SlotDetailDrawer";
import { Slot, SlotConflict } from "@/components/planner/slot-planner/types";

export default function SlotPlannerPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [showError, setShowError] = useState(false);
  const [showEmpty, setShowEmpty] = useState(false);
  const [activeView, setActiveView] = useState("Day");
  const [filters, setFilters] = useState({
    date: "2026-06-04",
    zone: "",
    resourceType: "",
    cargoClass: "",
    search: "",
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const { addToast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleSlotClick = (slot: Slot) => {
    setSelectedSlot(slot);
    setDrawerOpen(true);
  };

  const handleResolveConflict = (conflict: SlotConflict) => {
    addToast(`Conflict ${conflict.conflictId} marked for resolution`, "success");
  };

  const handleRetry = () => {
    setShowError(false);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb + Title */}
      <div className="flex flex-col gap-3">
        <Breadcrumb
          items={[
            { label: "Planner", href: "#" },
            { label: "Slot Planner" },
          ]}
        />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h1 className="text-[24px] lg:text-[32px] font-bold text-[#0F172A] leading-[32px] lg:leading-[40px]">
              Slot Planner
            </h1>
            <ScopeBadge type="inc" />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setShowError(!showError);
                if (!showError) addToast("Error state simulated", "error");
              }}
              className="text-[12px] font-semibold text-[#1B4F8B] hover:text-[#0B2545] cursor-pointer transition-colors"
            >
              {showError ? "Hide Error" : "Simulate Error"}
            </button>
            <button
              onClick={() => {
                setShowEmpty(!showEmpty);
                if (!showEmpty) addToast("Empty state shown", "success");
              }}
              className="text-[12px] font-semibold text-[#1B4F8B] hover:text-[#0B2545] cursor-pointer transition-colors"
            >
              {showEmpty ? "Show Data" : "Simulate Empty"}
            </button>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {showError && (
        <ErrorState
          title="Slot planner unavailable"
          message="Planner service could not load slot data. Last successful sync: 09:30 AM."
          onRetry={handleRetry}
        />
      )}

      {/* Main Content */}
      {showEmpty ? (
        <EmptyState
          title="No slots planned for selected date"
          description="Create slots to allocate resources for inbound cargo processing."
          actionLabel="Create Slot"
          onAction={() => {
            setShowEmpty(false);
            setIsLoading(true);
            setTimeout(() => setIsLoading(false), 1000);
          }}
        />
      ) : (
        <>
          {/* Actions + View Switcher */}
          {!isLoading && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => addToast("Slot created", "success")}
                  className="h-9 px-4 rounded-xl text-[13px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90 flex items-center gap-2 whitespace-nowrap"
                  style={{ backgroundColor: "#0B2545" }}
                >
                  Create Slot
                </button>
                <button
                  onClick={() => addToast("Slot moved", "success")}
                  className="h-9 px-3 rounded-xl border border-[#E2E8F0] text-[13px] font-semibold text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer transition-colors whitespace-nowrap"
                >
                  Move Slot
                </button>
                <button
                  onClick={() => addToast("Slot cancelled", "error")}
                  className="h-9 px-3 rounded-xl border border-[#E2E8F0] text-[13px] font-semibold text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer transition-colors whitespace-nowrap"
                >
                  Cancel Slot
                </button>
                <button
                  onClick={() => addToast("Conflict resolved", "success")}
                  className="h-9 px-3 rounded-xl border border-[#E2E8F0] text-[13px] font-semibold text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer transition-colors whitespace-nowrap"
                >
                  Resolve Conflict
                </button>
                <button
                  onClick={() => addToast("Slot data refreshed", "success")}
                  className="h-9 px-3 rounded-xl border border-[#E2E8F0] text-[13px] font-semibold text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer transition-colors whitespace-nowrap"
                >
                  Refresh
                </button>
              </div>
              <ViewSwitcher active={activeView} onChange={setActiveView} />
            </div>
          )}

          {/* Filter Bar */}
          {isLoading ? (
            <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-4 shadow-sm">
              <div className="h-10 w-full bg-[#F1F5F9] rounded animate-pulse" />
            </div>
          ) : (
            <FilterBar filters={filters} onFilterChange={setFilters} />
          )}

          {/* Calendar Grid */}
          {isLoading ? (
            <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
              <div className="h-5 w-40 bg-[#F1F5F9] rounded animate-pulse mb-4" />
              <LoadingSkeleton rows={6} columns={8} />
            </div>
          ) : (
            <CalendarGrid onSlotClick={handleSlotClick} />
          )}

          {/* Conflict Panel */}
          {isLoading ? (
            <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
              <div className="h-5 w-32 bg-[#F1F5F9] rounded animate-pulse mb-4" />
              <LoadingSkeleton rows={4} columns={8} />
            </div>
          ) : (
            <ConflictPanel onResolve={handleResolveConflict} />
          )}
        </>
      )}

      {/* Slot Detail Drawer */}
      <SlotDetailDrawer
        isOpen={drawerOpen}
        onClose={() => { setDrawerOpen(false); setSelectedSlot(null); }}
        slot={selectedSlot}
      />
    </div>
  );
}