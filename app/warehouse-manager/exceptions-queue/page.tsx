"use client";

import { useState } from "react";
import { Tag } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import { useToast } from "@/components/ToastContext";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";
import KPIStrip from "@/components/exceptions-queue/KPIStrip";
import FilterChips from "@/components/exceptions-queue/FilterChips";
import FilterBar from "@/components/exceptions-queue/FilterBar";
import ExceptionsTable from "@/components/exceptions-queue/ExceptionsTable";
import CdrDetailDrawer from "@/components/exceptions-queue/CdrDetailDrawer";

export default function ExceptionsQueuePage() {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [empty, setEmpty] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [selectedCdr, setSelectedCdr] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleFilterToggle = (filter: string) => {
    setActiveFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    );
  };

  const handleViewDetail = (cdrId: string) => {
    setSelectedCdr(cdrId);
    setDrawerOpen(true);
  };

  const handleAssign = (cdrId: string) => {
    addToast("Owner assigned to CDR " + cdrId, "success");
  };

  const handleMarkResolved = (cdrId: string) => {
    addToast("CDR " + cdrId + " marked as resolved", "success");
  };

  const handleEscalate = (cdrId: string) => {
    addToast("CDR " + cdrId + " escalated to supervisor", "success");
  };

  const handleAddNote = (cdrId: string) => {
    addToast("Note added to CDR " + cdrId, "success");
  };

  const handleLinkToAWB = (awb: string) => {
    addToast("Navigating to AWB " + awb, "success");
  };

  return (
    <div className="min-h-screen bg-white p-6 lg:p-8">
      <div className="mb-6">
        <Breadcrumb
          items={[
            { label: "Warehouse Manager", href: "/warehouse-manager" },
            { label: "Exceptions Queue" },
          ]}
        />
      </div>

      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-[24px] font-bold text-[#0F172A]">Exceptions Queue</h1>
      </div>

      <div className="mb-4">
        <KPIStrip loading={loading} />
      </div>

      <div className="mb-4">
        <FilterChips activeFilters={activeFilters} onToggle={handleFilterToggle} />
      </div>

      <div className="mb-6">
        <FilterBar />
      </div>

      <div className="mb-8">
        {error && (
          <div className="mb-4">
            <ErrorState
              message="Failed to load exceptions queue. Please check your connection and retry."
              onRetry={() => setError(false)}
            />
          </div>
        )}

        {empty && !error && (
          <div className="rounded-xl border border-[#E2E8F0] bg-white">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-[#E2E8F0]">
              <h2 className="text-[16px] font-bold text-[#0F172A]">Open Exceptions</h2>
            </div>
            <EmptyState
              title="No open exceptions"
              description="All CDRs have been resolved or closed. New exceptions will appear here when reported."
              icon={<Tag size={28} className="text-[#94A3B8]" />}
            />
          </div>
        )}

        {loading && !error && !empty && (
          <div className="rounded-xl border border-[#E2E8F0] bg-white">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-[#E2E8F0]">
              <h2 className="text-[16px] font-bold text-[#0F172A]">Open Exceptions</h2>
            </div>
            <div className="p-5">
              <LoadingSkeleton rows={6} columns={8} />
            </div>
          </div>
        )}

        {!loading && !error && !empty && (
          <ExceptionsTable
            onViewDetail={handleViewDetail}
            onAssign={handleAssign}
            onMarkResolved={handleMarkResolved}
            onEscalate={handleEscalate}
            onAddNote={handleAddNote}
            onLinkToAWB={handleLinkToAWB}
          />
        )}
      </div>

      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => setLoading((l) => !l)}
          className="h-8 px-3 rounded-lg border border-[#E2E8F0] text-[12px] font-medium text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer transition-colors"
        >
          {loading ? "Stop Loading" : "Simulate Loading"}
        </button>
        <button
          onClick={() => setError((e) => !e)}
          className="h-8 px-3 rounded-lg border border-[#E2E8F0] text-[12px] font-medium text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer transition-colors"
        >
          {error ? "Clear Error" : "Simulate Error"}
        </button>
        <button
          onClick={() => setEmpty((e) => !e)}
          className="h-8 px-3 rounded-lg border border-[#E2E8F0] text-[12px] font-medium text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer transition-colors"
        >
          {empty ? "Show Data" : "Simulate Empty"}
        </button>
      </div>

      <CdrDetailDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        cdrId={selectedCdr}
      />
    </div>
  );
}