"use client";

import { useState, useEffect } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import KPIStrip from "@/components/operations-supervisor/live-ops/KPIStrip";
import CargoPanel from "@/components/operations-supervisor/live-ops/CargoPanel";
import AssetsPanel from "@/components/operations-supervisor/live-ops/AssetsPanel";
import ExceptionsPanel from "@/components/operations-supervisor/live-ops/ExceptionsPanel";
import EventStream from "@/components/operations-supervisor/live-ops/EventStream";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";
import { useToast } from "@/components/ToastContext";
import { RefreshCw, Zap, AlertTriangle, ArrowRight, Map, FileSearch, UserPlus, CheckCircle } from "lucide-react";

export default function LiveOpsViewPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [empty, setEmpty] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setError(false);
    setEmpty(false);
    setTimeout(() => {
      setLoading(false);
      addToast("Live ops refreshed.", "success");
    }, 1200);
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
          <Breadcrumb items={[{ label: "Operations Supervisor", href: "/operations-supervisor" }, { label: "Live Ops View" }]} />
          <div className="flex items-center gap-3 mt-3">
            <h1 className="text-[24px] font-bold text-[#0F172A]">Live Ops View</h1>
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
        <ErrorState title="Failed to load live ops" message="Could not retrieve live operations data. Please try again." onRetry={handleRefresh} />
      )}

      {empty && !error && !loading && (
        <EmptyState title="No live operations data" description="No live operations data available for the current shift." icon={<Zap size={28} className="text-[#94A3B8]" />} actionLabel="Refresh" onAction={handleRefresh} />
      )}

      {loading && !error && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-32 rounded-[16px] bg-[#F1F5F9] animate-pulse" />
            ))}
          </div>
          <div className="h-64 rounded-[16px] bg-[#F1F5F9] animate-pulse" />
          <div className="h-64 rounded-[16px] bg-[#F1F5F9] animate-pulse" />
          <div className="h-64 rounded-[16px] bg-[#F1F5F9] animate-pulse" />
          <div className="h-80 rounded-[16px] bg-[#F1F5F9] animate-pulse" />
        </div>
      )}

      {!loading && !error && !empty && (
        <div className="space-y-6">
          <KPIStrip />
          <CargoPanel />
          <AssetsPanel />
          <ExceptionsPanel />
          <EventStream />

          <div className="flex flex-wrap items-center gap-3">
            <button onClick={() => addToast("Exception opened.", "success")} className="flex items-center gap-2 h-9 px-4 rounded-xl text-[13px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90" style={{ backgroundColor: "#0B2545" }}>
              <AlertTriangle size={16} /> Open Exception
            </button>
            <button onClick={() => addToast("Owner assigned.", "success")} className="flex items-center gap-2 h-9 px-4 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F1F5F9] cursor-pointer transition-colors">
              <UserPlus size={16} /> Assign Owner
            </button>
            <button onClick={() => addToast("Escalated.", "success")} className="flex items-center gap-2 h-9 px-4 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F1F5F9] cursor-pointer transition-colors">
              <Zap size={16} /> Escalate
            </button>
            <button onClick={() => addToast("Resolved.", "success")} className="flex items-center gap-2 h-9 px-4 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F1F5F9] cursor-pointer transition-colors">
              <CheckCircle size={16} /> Resolve
            </button>
            <button onClick={() => addToast("AWB opened.", "success")} className="flex items-center gap-2 h-9 px-4 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F1F5F9] cursor-pointer transition-colors">
              <FileSearch size={16} /> View AWB
            </button>
            <button onClick={() => addToast("Gate board opened.", "success")} className="flex items-center gap-2 h-9 px-4 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F1F5F9] cursor-pointer transition-colors">
              <Map size={16} /> Open Gate Board
            </button>
            <button onClick={() => addToast("Storage map opened.", "success")} className="flex items-center gap-2 h-9 px-4 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F1F5F9] cursor-pointer transition-colors">
              <Map size={16} /> Open Storage Map
            </button>
          </div>
        </div>
      )}
    </div>
  );
}