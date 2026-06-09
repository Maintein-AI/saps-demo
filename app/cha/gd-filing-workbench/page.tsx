"use client";

import { useState, useEffect } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import ScopeBadge from "@/components/ScopeBadge";
import CoordinationNote from "@/components/cha/gd-filing/CoordinationNote";
import GDForm from "@/components/cha/gd-filing/GDForm";
import AWBSummaryPanel from "@/components/cha/gd-filing/AWBSummaryPanel";
import ChannelPreview from "@/components/cha/gd-filing/ChannelPreview";
import RecentGDRecords from "@/components/cha/gd-filing/RecentGDRecords";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";
import { useToast } from "@/components/ToastContext";
import {
  RefreshCw,
  ArrowRight,
  AlertTriangle,
  FileText,
} from "lucide-react";

export default function GDFilingWorkbenchPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [empty, setEmpty] = useState(false);
  const [selectedAWB, setSelectedAWB] = useState<any>(null);
  const [selectedChannel, setSelectedChannel] = useState("");
  const { addToast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setError(false);
    setEmpty(false);
    setSelectedAWB(null);
    setSelectedChannel("");
    setTimeout(() => {
      setLoading(false);
      addToast("Workbench refreshed.", "success");
    }, 1000);
  };

  const handleSimulateError = () => {
    setError(true);
    setLoading(false);
  };

  const handleSimulateEmpty = () => {
    setEmpty(true);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <Breadcrumb
            items={[
              { label: "CHA", href: "/cha" },
              { label: "GD Filing Workbench", href: "/cha/gd-filing-workbench" },
            ]}
          />
          <div className="flex items-center gap-3 mt-3">
            <h1 className="text-[24px] font-bold text-[#0F172A]">
              GD Filing Workbench
            </h1>
            <ScopeBadge type="exc" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 h-9 px-4 rounded-xl text-[13px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90"
            style={{ backgroundColor: "#0B2545" }}
          >
            <RefreshCw size={16} /> Refresh
          </button>
          <button
            onClick={handleSimulateError}
            className="flex items-center gap-2 h-9 px-4 rounded-xl text-[13px] font-semibold border border-[#DC2626]/30 text-[#DC2626] hover:bg-[#DC2626]/10 cursor-pointer transition-colors"
          >
            <AlertTriangle size={16} /> Simulate Error
          </button>
          <button
            onClick={handleSimulateEmpty}
            className="flex items-center gap-2 h-9 px-4 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F1F5F9] cursor-pointer transition-colors"
          >
            <ArrowRight size={16} /> Simulate Empty
          </button>
        </div>
      </div>

      {error && (
        <ErrorState
          title="Failed to load workbench"
          message="Could not retrieve GD filing data. Please try again."
          onRetry={handleRefresh}
        />
      )}

      {empty && !error && !loading && (
        <EmptyState
          title="Select AWB to begin GD capture"
          description="No AWB selected. Search and select an AWB to populate GD details."
          icon={<FileText size={28} className="text-[#94A3B8]" />}
          actionLabel="Refresh"
          onAction={handleRefresh}
        />
      )}

      {loading && !error && (
        <div className="space-y-6">
          <div className="h-20 rounded-[16px] bg-[#F1F5F9] animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-[600px] rounded-[16px] bg-[#F1F5F9] animate-pulse" />
            <div className="space-y-6">
              <div className="h-80 rounded-[16px] bg-[#F1F5F9] animate-pulse" />
              <div className="h-80 rounded-[16px] bg-[#F1F5F9] animate-pulse" />
            </div>
          </div>
          <div className="h-72 rounded-[16px] bg-[#F1F5F9] animate-pulse" />
        </div>
      )}

      {!loading && !error && !empty && (
        <div className="space-y-6">
          <CoordinationNote />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <GDForm
                onAwbSelect={(awb) => setSelectedAWB(awb)}
                onChannelChange={(ch) => setSelectedChannel(ch)}
              />
            </div>
            <div className="space-y-6">
              <AWBSummaryPanel awb={selectedAWB} />
              <ChannelPreview channel={selectedChannel} />
            </div>
          </div>

          <RecentGDRecords />
        </div>
      )}
    </div>
  );
}