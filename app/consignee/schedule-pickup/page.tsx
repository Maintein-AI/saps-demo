"use client";

import { useState } from "react";
import { RefreshCw, AlertTriangle, X } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import ScopeBadge from "@/components/ScopeBadge";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import ErrorState from "@/components/ErrorState";
import { useToast } from "@/components/ToastContext";
import KPIStrip from "@/components/consignee/schedule-pickup/KPIStrip";
import SchedulePickupContent from "@/components/consignee/schedule-pickup/SchedulePickupContent";

export default function SchedulePickupPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { addToast } = useToast();

  const handleRefresh = () => {
    setLoading(true);
    setError(false);
    setTimeout(() => {
      setLoading(false);
      addToast("Data refreshed.", "success");
    }, 1000);
  };

  const handleSimulateError = () => {
    setLoading(false);
    setError(true);
  };

  if (error) {
    return (
      <div className="space-y-4">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Consignee", href: "/consignee/dashboard" }, { label: "Schedule Pickup" }]} />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-[20px] font-bold text-[#0F172A]">Schedule Pickup</h1>
            <ScopeBadge type="exc" />
          </div>
        </div>
        <ErrorState message="Unable to load pickup data. Please try again." onRetry={handleRefresh} />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Consignee", href: "/consignee/dashboard" }, { label: "Schedule Pickup" }]} />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-[20px] font-bold text-[#0F172A]">Schedule Pickup</h1>
            <ScopeBadge type="exc" />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm animate-pulse">
              <div className="h-3 w-20 bg-[#E2E8F0] rounded mb-3" />
              <div className="h-7 w-16 bg-[#E2E8F0] rounded" />
            </div>
          ))}
        </div>
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Consignee", href: "/consignee/dashboard" }, { label: "Schedule Pickup" }]} />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-[20px] font-bold text-[#0F172A]">Schedule Pickup</h1>
          <ScopeBadge type="exc" />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 h-9 px-4 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer transition-colors whitespace-nowrap"
          >
            <RefreshCw size={14} /> Refresh
          </button>
          <button
            onClick={handleSimulateError}
            className="flex items-center gap-2 h-9 px-4 rounded-xl text-[13px] font-semibold border border-[#FCA5A5] text-[#DC2626] hover:bg-[#FEE2E2] cursor-pointer transition-colors whitespace-nowrap"
          >
            <AlertTriangle size={14} /> Simulate Error
          </button>
        </div>
      </div>

      <KPIStrip />
      <SchedulePickupContent />
    </div>
  );
}