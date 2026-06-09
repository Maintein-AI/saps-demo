"use client";

import { useState, useMemo } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import ScopeBadge from "@/components/ScopeBadge";
import { useToast } from "@/components/ToastContext";
import ErrorState from "@/components/ErrorState";
import EmptyState from "@/components/EmptyState";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import FilterBar from "@/components/forwarding-agent/dispatch-documents/FilterBar";
import KPIStrip from "@/components/forwarding-agent/dispatch-documents/KPIStrip";
import DocumentCardGrid from "@/components/forwarding-agent/dispatch-documents/DocumentCardGrid";
import DocumentQueueTable from "@/components/forwarding-agent/dispatch-documents/DocumentQueueTable";
import AuthorityLetterDrawer from "@/components/forwarding-agent/dispatch-documents/AuthorityLetterDrawer";
import VehiclePreRegDrawer from "@/components/forwarding-agent/dispatch-documents/VehiclePreRegDrawer";
import { Plus, Upload, Shield, Truck } from "lucide-react";

interface DrawerState {
  type: "authority" | "vehicle" | "upload" | null;
  data?: { awb?: string; do?: string; driver?: string; vehicle?: string };
}

export default function DispatchDocumentsPage() {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [drawer, setDrawer] = useState<DrawerState>({ type: null });
  const [searchFilters, setSearchFilters] = useState<Record<string, string>>({});

  const handleFilter = (filters: Record<string, string>) => {
    setSearchFilters(filters);
  };

  const handleGenerateAuthority = (data: { awb?: string; do?: string; driver?: string; vehicle?: string }) => {
    setDrawer({ type: "authority", data });
  };

  const handlePreReg = (data: { awb?: string; do?: string; driver?: string; vehicle?: string }) => {
    setDrawer({ type: "vehicle", data });
  };

  const handleUpload = (data: { awb?: string; do?: string }) => {
    setDrawer({ type: "upload", data });
    addToast("Upload dialog would open for this document.", "success");
    setDrawer({ type: null });
  };

  const handleNewDocument = () => {
    addToast("Create new document dialog would open.", "success");
  };

  const hasActiveFilters = useMemo(() => {
    return Object.values(searchFilters).some((v) => v.trim() !== "");
  }, [searchFilters]);

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton rows={5} columns={6} />
        <LoadingSkeleton rows={8} columns={10} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Breadcrumb
          items={[
            { label: "Home" },
            { label: "Forwarding Agent" },
            { label: "Dispatch Documents" },
          ]}
        />
        <div className="flex items-center gap-2.5">
          <h1 className="text-[22px] font-bold text-[#0F172A]">Dispatch Documents</h1>
          <ScopeBadge type="exc" />
        </div>
      </div>

      {error && (
        <ErrorState
          title="Failed to load documents"
          message={error}
          onRetry={() => {
            setError(null);
            setLoading(true);
            setTimeout(() => setLoading(false), 500);
          }}
        />
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={handleNewDocument}
          className="flex items-center gap-2 h-10 px-4 rounded-xl text-[13px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90"
          style={{ backgroundColor: "#0B2545" }}
        >
          <Plus size={16} />
          Upload Document
        </button>
        <button
          onClick={() => setDrawer({ type: "authority", data: {} })}
          className="flex items-center gap-2 h-10 px-4 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer transition-colors"
        >
          <Shield size={16} />
          Generate Authority Letter
        </button>
        <button
          onClick={() => setDrawer({ type: "vehicle", data: {} })}
          className="flex items-center gap-2 h-10 px-4 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer transition-colors"
        >
          <Truck size={16} />
          Vehicle Pre-registration
        </button>
      </div>

      <FilterBar onFilter={handleFilter} />

      <KPIStrip />

      <DocumentCardGrid
        onGenerateAuthority={handleGenerateAuthority}
        onPreReg={handlePreReg}
        onUpload={handleUpload}
      />

      <DocumentQueueTable
        onGenerateAuthority={handleGenerateAuthority}
        onPreReg={handlePreReg}
      />

      {hasActiveFilters && (
        <div className="flex items-center justify-center py-8">
          <p className="text-[13px] text-[#64748B]">
            Showing filtered results. Clear filters to see all documents.
          </p>
        </div>
      )}

      <AuthorityLetterDrawer
        isOpen={drawer.type === "authority"}
        onClose={() => setDrawer({ type: null })}
        defaultData={drawer.data}
      />

      <VehiclePreRegDrawer
        isOpen={drawer.type === "vehicle"}
        onClose={() => setDrawer({ type: null })}
        defaultData={drawer.data}
      />
    </div>
  );
}