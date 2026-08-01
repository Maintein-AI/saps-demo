"use client";

import { useState, useEffect } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import SummaryCard from "@/components/operations-supervisor/shift-handover/SummaryCard";
import HandoverForm from "@/components/operations-supervisor/shift-handover/HandoverForm";
import HistoryTable from "@/components/operations-supervisor/shift-handover/HistoryTable";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";
import { useToast } from "@/components/ToastContext";
import { RefreshCw, ArrowRight, AlertTriangle, FileClock } from "lucide-react";

export default function ShiftHandoverPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [empty, setEmpty] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setError(false);
    setEmpty(false);
    setTimeout(() => {
      setLoading(false);
      addToast("Shift handover data refreshed.", "success");
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
          <Breadcrumb items={[
            { label: "Operations Supervisor", href: "/operations-supervisor" },
            { label: "Shift Handover" }
          ]} />
          <div className="flex items-center gap-3 mt-3">
            <h1 className="text-[24px] font-bold text-[#0F172A]">Shift Handover</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleRefresh} className="flex items-center gap-2 h-9 px-4 rounded-xl text-[13px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90" style={{ backgroundColor: "#0B2545" }}>
            <RefreshCw size={16} /> Refresh
          </button>
          <button onClick={handleSimulateError} className="flex items-center gap-2 h-9 px-4 rounded-xl text-[13px] font-semibold border border-[#DC2626]/30 text-[#DC2626] hover:bg-[#DC2626]/10 cursor-pointer transition-colors">
            <AlertTriangle size={16} /> Simulate Error
          </button>
          <button onClick={handleSimulateEmpty} className="flex items-center gap-2 h-9 px-4 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F1F5F9] cursor-pointer transition-colors">
            <ArrowRight size={16} /> Simulate Empty
          </button>
        </div>
      </div>

      {error && (
        <ErrorState title="Failed to load shift handover data" message="Could not retrieve shift handover records. Please try again." onRetry={handleRefresh} />
      )}

      {empty && !error && !loading && (
        <EmptyState title="No previous handovers found" description="No shift handover records are available for this period." icon={<FileClock size={28} className="text-[#94A3B8]" />} actionLabel="Refresh" onAction={handleRefresh} />
      )}

      {loading && !error && (
        <div className="space-y-6">
          <div className="h-48 rounded-[16px] bg-[#F1F5F9] animate-pulse" />
          <div className="h-96 rounded-[16px] bg-[#F1F5F9] animate-pulse" />
          <div className="h-72 rounded-[16px] bg-[#F1F5F9] animate-pulse" />
        </div>
      )}

      {!loading && !error && !empty && (
        <div className="space-y-6">
          <SummaryCard />
          <HandoverForm />
          <HistoryTable />
        </div>
      )}
    </div>
  );
}