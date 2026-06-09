"use client";

import { useState } from "react";
import { RefreshCw, FileSpreadsheet, Flag, CalendarDays } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import ScopeBadge from "@/components/ScopeBadge";
import { useToast } from "@/components/ToastContext";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";
import KPIStrip from "@/components/planner/demand-forecast/KPIStrip";
import FilterBar from "@/components/planner/demand-forecast/FilterBar";
import ForecastChart from "@/components/planner/demand-forecast/ForecastChart";
import CargoMixCard from "@/components/planner/demand-forecast/CargoMixCard";
import InboundFlightsTable from "@/components/planner/demand-forecast/InboundFlightsTable";
import MessageGapPanel from "@/components/planner/demand-forecast/MessageGapPanel";
import DetailDrawer from "@/components/planner/demand-forecast/DetailDrawer";
import type { FilterState, FlightForecast, MessageGap } from "@/components/planner/demand-forecast/types";

export default function DemandForecastPage() {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [empty, setEmpty] = useState(false);
  const [error, setError] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState<FlightForecast | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    date: "",
    airline: "",
    originAirport: "",
    flightNumber: "",
    cargoClass: "",
    messageSource: "",
    etaWindow: "",
  });

  const handleRefresh = () => {
    setLoading(true);
    setError(false);
    setTimeout(() => {
      setLoading(false);
      addToast("Forecast refreshed.", "success");
    }, 1200);
  };

  const handleSimulateEmpty = () => {
    setEmpty(true);
  };

  const handleSimulateError = () => {
    setError(true);
  };

  const handleExport = () => {
    addToast("Forecast exported to CSV.", "success");
  };

  const handleFlagGap = (gap: MessageGap) => {
    addToast(`Gap flagged for ${gap.flightNumber}: ${gap.gapType}`, "success");
  };

  const handleViewDetail = (flight: FlightForecast) => {
    setSelectedFlight(flight);
  };

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Home" },
          { label: "Planner" },
          { label: "Demand Forecast" },
        ]}
      />

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-[24px] font-bold text-[#0F172A]">Demand Forecast</h1>
          <ScopeBadge type="inc" />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSimulateEmpty}
            className="h-9 px-3 rounded-lg text-[12px] font-medium border border-[#E2E8F0] text-[#64748B] hover:bg-[#F1F5F9] cursor-pointer transition-colors"
          >
            Simulate Empty
          </button>
          <button
            onClick={handleSimulateError}
            className="h-9 px-3 rounded-lg text-[12px] font-medium border border-[#E2E8F0] text-[#64748B] hover:bg-[#F1F5F9] cursor-pointer transition-colors"
          >
            Simulate Error
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 h-9 px-4 rounded-lg text-[13px] font-semibold border border-[#E2E8F0] text-[#0F172A] hover:bg-[#F1F5F9] cursor-pointer transition-colors"
          >
            <FileSpreadsheet size={16} />
            Export Forecast
          </button>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 h-9 px-4 rounded-lg text-[13px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90"
            style={{ backgroundColor: "#0B2545" }}
          >
            <RefreshCw size={16} />
            Refresh Messages
          </button>
        </div>
      </div>

      {error && (
        <ErrorState
          title="Failed to load forecast"
          message="Could not fetch inbound flight forecast data from airline messaging systems. Please retry."
          onRetry={() => {
            setError(false);
            handleRefresh();
          }}
        />
      )}

      <KPIStrip />

      <FilterBar filters={filters} onChange={setFilters} />

      {loading ? (
        <LoadingSkeleton rows={5} columns={8} />
      ) : empty ? (
        <EmptyState
          title="No inbound forecast available"
          description="No inbound forecast data available for the selected filters. Try adjusting the date or airline filter."
          icon={<CalendarDays size={28} className="text-[#94A3B8]" />}
          actionLabel="Refresh Forecast"
          onAction={handleRefresh}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ForecastChart />
            <CargoMixCard />
          </div>

          <InboundFlightsTable
            filters={{
              airline: filters.airline,
              originAirport: filters.originAirport,
              flightNumber: filters.flightNumber,
              cargoClass: filters.cargoClass,
              messageSource: filters.messageSource,
            }}
            onViewDetail={handleViewDetail}
          />

          <MessageGapPanel onFlagGap={handleFlagGap} />
        </>
      )}

      <DetailDrawer
        flight={selectedFlight}
        onClose={() => setSelectedFlight(null)}
      />
    </div>
  );
}