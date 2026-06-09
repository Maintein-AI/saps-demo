"use client";

import { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import ScopeBadge from "@/components/ScopeBadge";
import ErrorState from "@/components/ErrorState";
import EmptyState from "@/components/EmptyState";
import { useToast } from "@/components/ToastContext";
import BoardKPIStrip from "@/components/gate-entry/live-vehicle-board/BoardKPIStrip";
import InsidePremisesColumn from "@/components/gate-entry/live-vehicle-board/InsidePremisesColumn";
import WaitingAtGateColumn from "@/components/gate-entry/live-vehicle-board/WaitingAtGateColumn";
import LongDwellAlerts from "@/components/gate-entry/live-vehicle-board/LongDwellAlerts";

export default function LiveVehicleBoardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [showError, setShowError] = useState(false);
  const [showEmpty, setShowEmpty] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const { addToast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleRetry = () => {
    setShowError(false);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleAction = (action: string, vehicle: string) => {
    if (action === "release") {
      addToast(`Vehicle ${vehicle} released`, "success");
    } else if (action === "hold") {
      addToast(`Vehicle ${vehicle} held`, "error");
    } else if (action === "call") {
      addToast(`Calling driver for ${vehicle}`, "success");
    } else if (action === "escalate") {
      addToast(`Escalated ${vehicle} to supervisor`, "success");
    } else if (action === "view") {
      addToast(`Viewing detail for ${vehicle}`, "success");
    }
  };

  const filterOptions = ["All", "Pickup", "Truck", "Container", "Cargo pickup", "Cargo drop", "Supplier", "Active", "Waiting", "Hold"];

  return (
    <div className="flex flex-col gap-8">
      {/* Breadcrumb + Title */}
      <div className="flex flex-col gap-3">
        <Breadcrumb
          items={[
            { label: "Gate Entry", href: "#" },
            { label: "Live Vehicle Board" },
          ]}
        />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h1 className="text-[24px] lg:text-[32px] font-bold text-[#0F172A] leading-[32px] lg:leading-[40px]">
              Live Vehicle Board
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
                setIsLoading(true);
                setTimeout(() => setIsLoading(false), 1000);
                addToast("Loading state simulated", "success");
              }}
              className="text-[12px] font-semibold text-[#1B4F8B] hover:text-[#0B2545] cursor-pointer transition-colors"
            >
              Simulate Loading
            </button>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {showError && (
        <ErrorState
          title="Live board unavailable"
          message="Connection to the vehicle tracking system failed. Data may be stale."
          onRetry={handleRetry}
        />
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
                <div className="h-4 w-24 bg-[#F1F5F9] rounded animate-pulse mb-4" />
                <div className="h-8 w-16 bg-[#F1F5F9] rounded animate-pulse" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
              <div className="h-6 w-48 bg-[#F1F5F9] rounded animate-pulse mb-6" />
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-32 rounded-xl bg-[#F1F5F9] animate-pulse" />
                ))}
              </div>
            </div>
            <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
              <div className="h-6 w-48 bg-[#F1F5F9] rounded animate-pulse mb-6" />
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-32 rounded-xl bg-[#F1F5F9] animate-pulse" />
                ))}
              </div>
            </div>
          </div>
          <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
            <div className="h-6 w-48 bg-[#F1F5F9] rounded animate-pulse mb-6" />
            <div className="h-48 rounded-xl bg-[#F1F5F9] animate-pulse" />
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* KPI Strip */}
          <BoardKPIStrip />

          {/* Empty State */}
          {showEmpty ? (
            <EmptyState
              title="No vehicles currently inside or waiting"
              description="The yard is clear. New vehicles will appear automatically as they arrive."
              actionLabel="Simulate Vehicles"
              onAction={() => setShowEmpty(false)}
            />
          ) : (
            <>
              {/* Filter Bar */}
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <div className="flex flex-wrap gap-2">
                  {filterOptions.slice(0, 6).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className="h-9 px-4 rounded-full text-[13px] font-semibold whitespace-nowrap cursor-pointer transition-colors"
                      style={{
                        backgroundColor: activeFilter === filter ? "#0B2545" : "#F1F5F9",
                        color: activeFilter === filter ? "white" : "#64748B",
                      }}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
                <div className="relative ml-auto">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" className="absolute left-3 top-1/2 -translate-y-1/2">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search vehicle / CNIC / AWB"
                    className="h-9 pl-9 pr-4 rounded-full border border-[#E2E8F0] text-[13px] font-medium text-[#0F172A] outline-none w-64"
                  />
                </div>
              </div>

              {/* Two Column Wallboard */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <InsidePremisesColumn onAction={handleAction} />
                <WaitingAtGateColumn onAction={handleAction} />
              </div>

              {/* Long Dwell Alerts */}
              <LongDwellAlerts onAction={handleAction} />
            </>
          )}
        </div>
      )}
    </div>
  );
}