"use client";

import { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";
import { useToast } from "@/components/ToastContext";
import KPIStrip from "@/components/gate-entry/KPIStrip";
import AtGateTable from "@/components/gate-entry/AtGateTable";
import InsidePremisesTable from "@/components/gate-entry/InsidePremisesTable";
import GateExceptions from "@/components/gate-entry/GateExceptions";
import QuickActions from "@/components/gate-entry/QuickActions";

export default function GateEntryDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [showError, setShowError] = useState(false);
  const [showEmpty, setShowEmpty] = useState(false);
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

  const handleQuickAction = (action: string) => {
    addToast(`${action} initiated`, "success");
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Breadcrumb + Title */}
      <div className="flex flex-col gap-3">
        <Breadcrumb
          items={[
            { label: "Gate Entry", href: "#" },
            { label: "Dashboard" },
          ]}
        />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h1 className="text-[24px] lg:text-[32px] font-bold text-[#0F172A] leading-[32px] lg:leading-[40px]">
              Gate Entry Dashboard
            </h1>
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
                setShowEmpty(!showEmpty);
                if (!showEmpty) addToast("Empty state shown", "success");
              }}
              className="text-[12px] font-semibold text-[#1B4F8B] hover:text-[#0B2545] cursor-pointer transition-colors"
            >
              {showEmpty ? "Show Data" : "Simulate Empty"}
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <QuickActions onAction={handleQuickAction} />

      {/* KPI Strip */}
      {showError ? (
        <ErrorState
          title="Gate data unavailable"
          message="KPI feed could not be refreshed. Last successful sync: 10:45 AM."
          onRetry={handleRetry}
        />
      ) : isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
              <div className="h-4 w-24 bg-[#F1F5F9] rounded animate-pulse mb-4" />
              <div className="h-8 w-16 bg-[#F1F5F9] rounded animate-pulse" />
            </div>
          ))}
        </div>
      ) : (
        <KPIStrip />
      )}

      {/* Main Content */}
      {showEmpty ? (
        <EmptyState
          title="No vehicles currently waiting at gate"
          description="All vehicles have been processed. New arrivals will appear here automatically."
          actionLabel="Refresh Queue"
          onAction={() => setShowEmpty(false)}
        />
      ) : (
        <>
          {/* Two Column Tables */}
          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
                <div className="h-5 w-40 bg-[#F1F5F9] rounded animate-pulse mb-5" />
                <LoadingSkeleton rows={4} columns={8} />
              </div>
              <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
                <div className="h-5 w-40 bg-[#F1F5F9] rounded animate-pulse mb-5" />
                <LoadingSkeleton rows={4} columns={8} />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AtGateTable />
              <InsidePremisesTable />
            </div>
          )}

          {/* Gate Exceptions */}
          {isLoading ? (
            <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
              <div className="h-5 w-40 bg-[#F1F5F9] rounded animate-pulse mb-5" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className="h-32 rounded-xl bg-[#F1F5F9] animate-pulse" />
                ))}
              </div>
            </div>
          ) : (
            <GateExceptions />
          )}
        </>
      )}
    </div>
  );
}