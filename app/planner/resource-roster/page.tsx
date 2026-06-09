"use client";

import { useState } from "react";
import { RefreshCw, ExternalLink, FileSpreadsheet, ClipboardList } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import ScopeBadge from "@/components/ScopeBadge";
import { useToast } from "@/components/ToastContext";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";
import KPIStrip from "@/components/planner/resource-roster/KPIStrip";
import FilterBar from "@/components/planner/resource-roster/FilterBar";
import RosterTable from "@/components/planner/resource-roster/RosterTable";
import RoleGroupCards from "@/components/planner/resource-roster/RoleGroupCards";
import AssetAssignmentCard from "@/components/planner/resource-roster/AssetAssignmentCard";
import type { FilterState } from "@/components/planner/resource-roster/types";

export default function ResourceRosterPage() {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [empty, setEmpty] = useState(false);
  const [error, setError] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    date: "",
    shift: "",
    role: "",
    zone: "",
    assetType: "",
    availability: "",
    supervisor: "",
  });

  const handleRefresh = () => {
    setLoading(true);
    setError(false);
    setTimeout(() => {
      setLoading(false);
      addToast("Roster refreshed.", "success");
    }, 1200);
  };

  const handleSimulateEmpty = () => {
    setEmpty(true);
  };

  const handleSimulateError = () => {
    setError(true);
  };

  const handleExport = () => {
    addToast("Roster exported to CSV.", "success");
  };

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Home" },
          { label: "Planner" },
          { label: "Resource Roster" },
        ]}
      />

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-[24px] font-bold text-[#0F172A]">Resource Roster</h1>
          <ScopeBadge type="inc" />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSimulateEmpty}
            className="h-9 px-3 rounded-lg text-[12px] font-medium border border-[#E2E8F0] text-[#64748B] hover:bg-[#F1F5F9] cursor-pointer transition-colors"
          >
            Simulate Empty
          </button>
          <button
            onClick={handleSimulateError}
            className="h-9 px-3 rounded-lg text-[12px] font-medium border border-[#E2E8F0] text-[#64748B] hover:bg-[#F1F5F9] cursor-pointer transition-colors"
          >
            Simulate Error
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 h-9 px-4 rounded-lg text-[13px] font-semibold border border-[#E2E8F0] text-[#0F172A] hover:bg-[#F1F5F9] cursor-pointer transition-colors"
          >
            <FileSpreadsheet size={16} />
            Export Roster
          </button>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 h-9 px-4 rounded-lg text-[13px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90"
            style={{ backgroundColor: "#0B2545" }}
          >
            <RefreshCw size={16} />
            Refresh Availability
          </button>
        </div>
      </div>

      <div className="flex items-start gap-3 p-4 rounded-xl border border-[#3B82F6]/20 bg-[#3B82F6]/5">
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#3B82F6]/10 flex items-center justify-center">
          <ClipboardList size={16} className="text-[#3B82F6]" />
        </div>
        <div className="flex-1">
          <p className="text-[13px] text-[#1B4F8B] font-medium">
            Roster is read-only in Planner. To edit employee assignment, open HR &amp; Payroll portal.
          </p>
        </div>
        <button
          onClick={() => addToast("Opening HR portal...", "success")}
          className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-[12px] font-semibold border border-[#3B82F6]/30 text-[#3B82F6] hover:bg-[#3B82F6]/10 cursor-pointer transition-colors whitespace-nowrap"
        >
          <ExternalLink size={14} />
          Open HR Portal
        </button>
      </div>

      {error && (
        <ErrorState
          title="Failed to load roster"
          message="Could not fetch resource roster data from the shift management system. Please try again."
          onRetry={() => {
            setError(false);
            handleRefresh();
          }}
        />
      )}

      <KPIStrip />

      <FilterBar filters={filters} onChange={setFilters} />

      {loading ? (
        <LoadingSkeleton rows={5} columns={8} />
      ) : empty ? (
        <EmptyState
          title="No roster configured"
          description="No roster data available for the selected shift. Try changing the date or shift filter."
          icon={<ClipboardList size={28} className="text-[#94A3B8]" />}
          actionLabel="Refresh Roster"
          onAction={handleRefresh}
        />
      ) : (
        <>
          <RoleGroupCards />

          <RosterTable
            filters={{
              role: filters.role,
              zone: filters.zone,
              shift: filters.shift,
              availability: filters.availability,
              supervisor: filters.supervisor,
            }}
          />

          <AssetAssignmentCard
            filters={{
              assetType: filters.assetType,
              zone: filters.zone,
            }}
          />
        </>
      )}
    </div>
  );
}