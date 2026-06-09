"use client";

import { useState, useEffect } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import ScopeBadge from "@/components/ScopeBadge";
import KPIStrip from "@/components/operations-supervisor/performance-console/KPIStrip";
import FilterBar from "@/components/operations-supervisor/performance-console/FilterBar";
import TrendCards from "@/components/operations-supervisor/performance-console/TrendCards";
import OperatorTable from "@/components/operations-supervisor/performance-console/OperatorTable";
import TeamPerformanceCard from "@/components/operations-supervisor/performance-console/TeamPerformanceCard";
import SlaBreakdownCard from "@/components/operations-supervisor/performance-console/SlaBreakdownCard";
import DetailDrawer from "@/components/operations-supervisor/performance-console/DetailDrawer";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";
import { useToast } from "@/components/ToastContext";
import { RefreshCw, Download, ArrowRight, AlertTriangle, BarChart3 } from "lucide-react";

export default function PerformanceConsolePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [empty, setEmpty] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedOperator, setSelectedOperator] = useState("");
  const { addToast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setError(false);
    setEmpty(false);
    setTimeout(() => {
      setLoading(false);
      addToast("Performance report refreshed.", "success");
    }, 1200);
  };

  const handleExport = () => {
    addToast("Performance report exported.", "success");
  };

  const handleSimulateError = () => {
    setError(true);
    setLoading(false);
  };

  const handleSimulateEmpty = () => {
    setEmpty(true);
    setLoading(false);
  };

  const handleViewDetail = (operator: string) => {
    setSelectedOperator(operator);
    setDrawerOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <Breadcrumb items={[{ label: "Operations Supervisor", href: "/operations-supervisor" }, { label: "Performance Console" }]} />
          <div className="flex items-center gap-3 mt-3">
            <h1 className="text-[24px] font-bold text-[#0F172A]">Performance Console</h1>
            <ScopeBadge type="inc" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleExport} className="flex items-center gap-2 h-9 px-4 rounded-xl text-[13px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90" style={{ backgroundColor: "#0B2545" }}>
            <Download size={16} /> Export Report
          </button>
          <button onClick={handleRefresh} className="flex items-center gap-2 h-9 px-4 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F1F5F9] cursor-pointer transition-colors">
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
        <ErrorState title="Failed to load performance data" message="Could not retrieve performance data for the selected filters. Please try again." onRetry={handleRefresh} />
      )}

      {empty && !error && !loading && (
        <EmptyState title="No performance data" description="No performance data available for the selected filters." icon={<BarChart3 size={28} className="text-[#94A3B8]" />} actionLabel="Refresh" onAction={handleRefresh} />
      )}

      {loading && !error && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-32 rounded-[16px] bg-[#F1F5F9] animate-pulse" />
            ))}
          </div>
          <div className="h-16 rounded-[16px] bg-[#F1F5F9] animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-48 rounded-[16px] bg-[#F1F5F9] animate-pulse" />
            ))}
          </div>
          <div className="h-96 rounded-[16px] bg-[#F1F5F9] animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="h-72 rounded-[16px] bg-[#F1F5F9] animate-pulse" />
            <div className="h-72 rounded-[16px] bg-[#F1F5F9] animate-pulse" />
          </div>
        </div>
      )}

      {!loading && !error && !empty && (
        <div className="space-y-6">
          <KPIStrip />
          <FilterBar />
          <TrendCards />
          <OperatorTable onViewDetail={handleViewDetail} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TeamPerformanceCard />
            <SlaBreakdownCard />
          </div>
        </div>
      )}

      <DetailDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} operator={selectedOperator} />
    </div>
  );
}