"use client";

import { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import ScopeBadge from "@/components/ScopeBadge";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";
import { useToast } from "@/components/ToastContext";
import ViewSwitcher from "@/components/planner/capacity-dashboard/ViewSwitcher";
import FilterBar from "@/components/planner/capacity-dashboard/FilterBar";
import KPIStrip from "@/components/planner/capacity-dashboard/KPIStrip";
import CapacityByZone from "@/components/planner/capacity-dashboard/CapacityByZone";
import CapacityByHandlingCode from "@/components/planner/capacity-dashboard/CapacityByHandlingCode";
import ForecastVsActual from "@/components/planner/capacity-dashboard/ForecastVsActual";
import CapacityRiskAlerts from "@/components/planner/capacity-dashboard/CapacityRiskAlerts";
import CapacityTable from "@/components/planner/capacity-dashboard/CapacityTable";
import { ZoneCapacity } from "@/components/planner/capacity-dashboard/types";

const sampleData: ZoneCapacity[] = [
  { zone: "Standard Pallet", handlingClass: "GCR", totalLocations: 450, occupied: 310, available: 126, blocked: 14, utilization: 69, forecastInbound: 120, riskLevel: "Medium", used: 310 },
  { zone: "Wide-bay 2-level", handlingClass: "GCR", totalLocations: 285, occupied: 180, available: 95, blocked: 10, utilization: 63, forecastInbound: 85, riskLevel: "Low", used: 180 },
  { zone: "Cantilever", handlingClass: "ICG", totalLocations: 145, occupied: 92, available: 48, blocked: 5, utilization: 63, forecastInbound: 42, riskLevel: "Low", used: 92 },
  { zone: "ODC Block-stacking", handlingClass: "AFU", totalLocations: 32, occupied: 27, available: 4, blocked: 1, utilization: 84, forecastInbound: 10, riskLevel: "High", used: 27 },
  { zone: "Vertical Carousel", handlingClass: "VAL", totalLocations: 70, occupied: 48, available: 22, blocked: 0, utilization: 69, forecastInbound: 18, riskLevel: "Medium", used: 48 },
  { zone: "Drive-in", handlingClass: "UAB", totalLocations: 102, occupied: 65, available: 35, blocked: 2, utilization: 64, forecastInbound: 30, riskLevel: "Low", used: 65 },
  { zone: "Cold Room COL", handlingClass: "PER", totalLocations: 48, occupied: 41, available: 5, blocked: 2, utilization: 85, forecastInbound: 18, riskLevel: "High", used: 41 },
  { zone: "ULD Pits", handlingClass: "AOG", totalLocations: 22, occupied: 12, available: 8, blocked: 2, utilization: 55, forecastInbound: 6, riskLevel: "Low", used: 12 },
  { zone: "DGR Segregation", handlingClass: "DGR", totalLocations: 45, occupied: 28, available: 15, blocked: 2, utilization: 62, forecastInbound: 8, riskLevel: "Medium", used: 28 },
  { zone: "HUM Facility", handlingClass: "HUM", totalLocations: 12, occupied: 5, available: 6, blocked: 1, utilization: 42, forecastInbound: 2, riskLevel: "Low", used: 5 },
  { zone: "DIP Vault", handlingClass: "DIP", totalLocations: 20, occupied: 8, available: 11, blocked: 1, utilization: 40, forecastInbound: 3, riskLevel: "Low", used: 8 },
  { zone: "AVI Zone", handlingClass: "AVI", totalLocations: 10, occupied: 3, available: 6, blocked: 1, utilization: 30, forecastInbound: 1, riskLevel: "Low", used: 3 },
  { zone: "VUN Secure", handlingClass: "VUN", totalLocations: 25, occupied: 12, available: 12, blocked: 1, utilization: 48, forecastInbound: 4, riskLevel: "Low", used: 12 },
  { zone: "Standard Pallet", handlingClass: "AFU", totalLocations: 120, occupied: 85, available: 30, blocked: 5, utilization: 71, forecastInbound: 35, riskLevel: "Medium", used: 85 },
  { zone: "Cold Room B", handlingClass: "PER", totalLocations: 24, occupied: 18, available: 4, blocked: 2, utilization: 75, forecastInbound: 9, riskLevel: "Medium", used: 18 },
];

export default function CapacityDashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [showError, setShowError] = useState(false);
  const [showEmpty, setShowEmpty] = useState(false);
  const [activeView, setActiveView] = useState("Today");
  const [filters, setFilters] = useState({
    date: "2026-06-04",
    zone: "",
    cargoClass: "",
    handlingCode: "",
    airline: "",
    status: "",
  });
  const [filteredData, setFilteredData] = useState<ZoneCapacity[]>(sampleData);
  const { addToast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let filtered = [...sampleData];
    if (filters.zone) filtered = filtered.filter(d => d.zone === filters.zone);
    if (filters.handlingCode) filtered = filtered.filter(d => d.handlingClass === filters.handlingCode);
    if (filters.cargoClass) filtered = filtered.filter(d => d.handlingClass === filters.cargoClass);
    setFilteredData(filtered);
  }, [filters]);

  const handleViewMap = (z: ZoneCapacity) => {
    addToast(`Storage map for ${z.zone} opened`, "success");
  };

  const handleOpenSlot = (z: ZoneCapacity) => {
    addToast(`Slot planner for ${z.zone} opened`, "success");
  };

  const handleRetry = () => {
    setShowError(false);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const kpiData = {
    totalStorageCapacity: "1,189",
    occupiedCapacity: "824",
    availableCapacity: "339",
    forecastInboundPieces: 310,
    highRiskZones: 3,
    coldChainRemaining: "9",
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb + Title */}
      <div className="flex flex-col gap-3">
        <Breadcrumb
          items={[
            { label: "Planner", href: "#" },
            { label: "Capacity Dashboard" },
          ]}
        />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h1 className="text-[24px] lg:text-[32px] font-bold text-[#0F172A] leading-[32px] lg:leading-[40px]">
              Capacity Dashboard
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

      {/* Error Banner */}
      {showError && (
        <ErrorState
          title="Capacity data unavailable"
          message="Planner service could not retrieve capacity data. Last successful sync: 09:30 AM."
          onRetry={handleRetry}
        />
      )}

      {/* Main Content */}
      {showEmpty ? (
        <EmptyState
          title="No capacity data available for selected period"
          description="Adjust filters or refresh forecast to load capacity data for the selected zone and date range."
          actionLabel="Refresh Forecast"
          onAction={() => {
            setShowEmpty(false);
            setIsLoading(true);
            setTimeout(() => setIsLoading(false), 1000);
          }}
        />
      ) : (
        <>
          {/* Actions + View Switcher */}
          {!isLoading && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => addToast("Slot planner opened", "success")}
                  className="h-9 px-4 rounded-xl text-[13px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90 flex items-center gap-2 whitespace-nowrap"
                  style={{ backgroundColor: "#0B2545" }}
                >
                  Open Slot Planner
                </button>
                <button
                  onClick={() => addToast("Storage map opened", "success")}
                  className="h-9 px-3 rounded-xl border border-[#E2E8F0] text-[13px] font-semibold text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer transition-colors whitespace-nowrap"
                >
                  View Storage Map
                </button>
                <button
                  onClick={() => addToast("Capacity report exported", "success")}
                  className="h-9 px-3 rounded-xl border border-[#E2E8F0] text-[13px] font-semibold text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer transition-colors whitespace-nowrap"
                >
                  Export Capacity Report
                </button>
                <button
                  onClick={() => {
                    setIsLoading(true);
                    setTimeout(() => {
                      setIsLoading(false);
                      addToast("Capacity data refreshed", "success");
                    }, 1000);
                  }}
                  className="h-9 px-3 rounded-xl border border-[#E2E8F0] text-[13px] font-semibold text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer transition-colors whitespace-nowrap"
                >
                  Refresh Forecast
                </button>
              </div>
              <ViewSwitcher active={activeView} onChange={setActiveView} />
            </div>
          )}

          {/* KPI Strip */}
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-[16px] border border-[#E2E8F0] bg-white p-4 shadow-sm">
                  <div className="h-3 w-20 bg-[#F1F5F9] rounded animate-pulse mb-2" />
                  <div className="h-7 w-16 bg-[#F1F5F9] rounded animate-pulse" />
                </div>
              ))}
            </div>
          ) : (
            <KPIStrip data={kpiData} />
          )}

          {/* Filter Bar */}
          {isLoading ? (
            <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-4 shadow-sm">
              <div className="h-10 w-full bg-[#F1F5F9] rounded animate-pulse" />
            </div>
          ) : (
            <FilterBar filters={filters} onFilterChange={setFilters} />
          )}

          {/* Main Dashboard Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {isLoading ? (
              <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
                <div className="h-5 w-36 bg-[#F1F5F9] rounded animate-pulse mb-4" />
                <div className="flex flex-col gap-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-8 w-full bg-[#F1F5F9] rounded animate-pulse" />
                  ))}
                </div>
              </div>
            ) : (
              <CapacityByZone />
            )}
            {isLoading ? (
              <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
                <div className="h-5 w-40 bg-[#F1F5F9] rounded animate-pulse mb-4" />
                <div className="grid grid-cols-3 gap-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-16 w-full bg-[#F1F5F9] rounded animate-pulse" />
                  ))}
                </div>
              </div>
            ) : (
              <CapacityByHandlingCode />
            )}
            {isLoading ? (
              <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
                <div className="h-5 w-32 bg-[#F1F5F9] rounded animate-pulse mb-4" />
                <div className="h-24 w-full bg-[#F1F5F9] rounded animate-pulse" />
              </div>
            ) : (
              <ForecastVsActual />
            )}
            {isLoading ? (
              <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
                <div className="h-5 w-36 bg-[#F1F5F9] rounded animate-pulse mb-4" />
                <div className="flex flex-col gap-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-12 w-full bg-[#F1F5F9] rounded animate-pulse" />
                  ))}
                </div>
              </div>
            ) : (
              <CapacityRiskAlerts />
            )}
          </div>

          {/* Capacity Table */}
          {isLoading ? (
            <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
              <div className="h-5 w-40 bg-[#F1F5F9] rounded animate-pulse mb-4" />
              <LoadingSkeleton rows={5} columns={10} />
            </div>
          ) : (
            <CapacityTable
              data={filteredData}
              onViewMap={handleViewMap}
              onOpenSlot={handleOpenSlot}
            />
          )}
        </>
      )}
    </div>
  );
}