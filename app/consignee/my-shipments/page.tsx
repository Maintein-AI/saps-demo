"use client";

import { useState, useEffect } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import KPIStrip from "@/components/consignee/my-shipments/KPIStrip";
import FilterBar from "@/components/consignee/my-shipments/FilterBar";
import ShipmentTable from "@/components/consignee/my-shipments/ShipmentTable";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";
import { useToast } from "@/components/ToastContext";
import { RefreshCw, ArrowRight, AlertTriangle, Package } from "lucide-react";

export default function MyShipmentsPage() {
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
      addToast("Shipments refreshed.", "success");
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
              { label: "Consignee", href: "/consignee/dashboard" },
              { label: "My Shipments" },
            ]}
          />
          <div className="flex items-center gap-3 mt-3">
            <h1 className="text-[24px] font-bold text-[#0F172A]">My Shipments</h1>
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
          title="Failed to load shipments"
          message="Could not retrieve your shipment data. Please try again."
          onRetry={handleRefresh}
        />
      )}

      {empty && !error && !loading && (
        <EmptyState
          title="No shipments found for selected filters."
          description="Try adjusting your filter criteria or check back later for new shipments."
          icon={<Package size={28} className="text-[#94A3B8]" />}
          actionLabel="Refresh"
          onAction={handleRefresh}
        />
      )}

      {loading && !error && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-32 rounded-[16px] bg-[#F1F5F9] animate-pulse" />
            ))}
          </div>
          <div className="h-16 rounded-[16px] bg-[#F1F5F9] animate-pulse" />
          <div className="h-[500px] rounded-[16px] bg-[#F1F5F9] animate-pulse" />
        </div>
      )}

      {!loading && !error && !empty && (
        <div className="space-y-6">
          <KPIStrip />
          <FilterBar />
          <ShipmentTable />
        </div>
      )}
    </div>
  );
}