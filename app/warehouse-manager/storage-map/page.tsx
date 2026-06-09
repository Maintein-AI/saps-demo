"use client";

import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import ScopeBadge from "@/components/ScopeBadge";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import ErrorState from "@/components/ErrorState";
import EmptyState from "@/components/EmptyState";
import { useToast } from "@/components/ToastContext";
import FilterBar from "@/components/storage-map/FilterBar";
import WarehouseMap from "@/components/storage-map/WarehouseMap";
import RackDetailDrawer from "@/components/storage-map/RackDetailDrawer";
import ZoneSummary from "@/components/storage-map/ZoneSummary";
import MultiZoneToggle from "@/components/storage-map/MultiZoneToggle";

export type RackStatus = "available" | "partial" | "full" | "blocked";

export interface RackData {
  id: string;
  rackId: string;
  row: string;
  level: string;
  bin: string;
  zone: string;
  occupancy: number;
  status: RackStatus;
  capacity: number;
  currentPieces: number;
  handlingCode: string;
  temperature: string;
  lastScanTime: string;
  awbs: {
    awb: string;
    hawb: string;
    pieceId: string;
    rfid: string;
    cargoClass: string;
    weight: string;
    storedAt: string;
    dwellTime: string;
    status: string;
  }[];
}

function generateRackData(): RackData[] {
  const racks: RackData[] = [];
  const rows = ["R01", "R02", "R03", "R04", "R05", "R06", "R07", "R08", "R09"];
  const levels = ["L1", "L2", "L3"];
  const bins = ["B01", "B02", "B03", "B04", "B05", "B06"];
  const zones = ["AFU", "GCR", "PER", "VAL", "DGR", "COLD"];

  const statuses: RackStatus[] = ["available", "partial", "full", "blocked"];
  const statusWeights = [0.3, 0.35, 0.25, 0.1];

  const handlingCodes = ["GEN", "PER", "VAL", "DGR", "COL", "BUL", "FLW"];
  const cargoClasses = ["AFU", "GCR", "PER", "VAL", "DGR", "COLD"];

  let counter = 1;

  for (let r = 0; r < rows.length; r++) {
    for (let l = 0; l < levels.length; l++) {
      for (let b = 0; b < bins.length; b++) {
        const rand = Math.random();
        let statusIdx = 0;
        let cum = 0;
        for (let i = 0; i < statusWeights.length; i++) {
          cum += statusWeights[i];
          if (rand <= cum) {
            statusIdx = i;
            break;
          }
        }
        const status = statuses[statusIdx];
        const zone = zones[r % zones.length];
        const capacity = 4 + (b % 3);
        const occupancy = status === "available" ? 0 : status === "full" ? 90 + Math.floor(Math.random() * 10) : status === "blocked" ? 100 : Math.floor(Math.random() * 80);
        const currentPieces = status === "available" ? 0 : Math.floor((occupancy / 100) * capacity);
        const temperature = zone === "COLD" ? "-18°C" : zone === "PER" ? "+2-8°C" : "Ambient";

        const awbs = status === "available" ? [] : Array.from({ length: currentPieces }).map((_, i) => ({
          awb: `${200 + Math.floor(Math.random() * 800)}-${Math.floor(Math.random() * 90000000).toString().padStart(8, "0")}`,
          hawb: Math.random() > 0.5 ? `H${Math.floor(Math.random() * 100000)}` : "",
          pieceId: `P-${Math.floor(Math.random() * 900000000)}-${String(i + 1).padStart(2, "0")}`,
          rfid: `EPC-3008-${Math.floor(Math.random() * 900000000000)}-${String(i + 1).padStart(4, "0")}`,
          cargoClass: cargoClasses[Math.floor(Math.random() * cargoClasses.length)],
          weight: `${(40 + Math.floor(Math.random() * 30)).toFixed(1)} kg`,
          storedAt: `2026-05-${Math.floor(Math.random() * 20) + 10}`,
          dwellTime: `${Math.floor(Math.random() * 14) + 1}d`,
          status: "Stored",
        }));

        racks.push({
          id: `${zone}-${rows[r]}-${levels[l]}-${bins[b]}`,
          rackId: `${zone}-${rows[r]}-${levels[l]}-${bins[b]}`,
          row: rows[r],
          level: levels[l],
          bin: bins[b],
          zone,
          occupancy,
          status,
          capacity,
          currentPieces,
          handlingCode: handlingCodes[Math.floor(Math.random() * handlingCodes.length)],
          temperature,
          lastScanTime: `2026-05-${Math.floor(Math.random() * 20) + 10} ${String(Math.floor(Math.random() * 24)).padStart(2, "0")}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}`,
          awbs,
        });

        counter++;
        if (counter > 144) break;
      }
      if (counter > 144) break;
    }
    if (counter > 144) break;
  }

  return racks;
}

export default function StorageMapPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [showError, setShowError] = useState(false);
  const [showEmpty, setShowEmpty] = useState(false);
  const [racks, setRacks] = useState<RackData[]>([]);
  const [selectedRack, setSelectedRack] = useState<RackData | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeZone, setActiveZone] = useState("AFU");
  const [filters, setFilters] = useState({
    zone: "all",
    cargoClass: "all",
    occupancy: "all",
    row: "all",
    handlingCode: "all",
    search: "",
  });
  const { addToast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      setRacks(generateRackData());
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleRetry = () => {
    setShowError(false);
    setIsLoading(true);
    setTimeout(() => {
      setRacks(generateRackData());
      setIsLoading(false);
    }, 800);
  };

  const handleRackClick = (rack: RackData) => {
    setSelectedRack(rack);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedRack(null);
  };

  const filteredRacks = racks.filter((rack) => {
    if (filters.zone !== "all" && rack.zone !== filters.zone) return false;
    if (filters.occupancy !== "all") {
      if (filters.occupancy === "available" && rack.status !== "available") return false;
      if (filters.occupancy === "partial" && rack.status !== "partial") return false;
      if (filters.occupancy === "full" && rack.status !== "full") return false;
      if (filters.occupancy === "blocked" && rack.status !== "blocked") return false;
    }
    if (filters.row !== "all" && rack.row !== filters.row) return false;
    if (filters.handlingCode !== "all" && rack.handlingCode !== filters.handlingCode) return false;
    if (filters.search) {
      const s = filters.search.toLowerCase();
      if (
        !rack.rackId.toLowerCase().includes(s) &&
        !rack.awbs.some((a) => a.awb.toLowerCase().includes(s) || a.rfid.toLowerCase().includes(s))
      ) {
        return false;
      }
    }
    return true;
  });

  const availableCount = racks.filter((r) => r.status === "available").length;
  const partialCount = racks.filter((r) => r.status === "partial").length;
  const fullCount = racks.filter((r) => r.status === "full").length;
  const blockedCount = racks.filter((r) => r.status === "blocked").length;

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb + Title */}
      <div className="flex flex-col gap-3">
        <Breadcrumb
          items={[
            { label: "Warehouse Manager", href: "/warehouse-manager" },
            { label: "Storage Map" },
          ]}
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/warehouse-manager"
              className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#E2E8F0] text-[#64748B] cursor-pointer transition-colors"
            >
              <ArrowLeft size={18} />
            </Link>
            <h1 className="text-[24px] lg:text-[32px] font-bold text-[#0F172A] leading-[32px] lg:leading-[40px]">
              Storage Map
            </h1>
            <ScopeBadge type="inc" />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setShowError(!showError); if (!showError) addToast("Error state simulated", "error"); }}
              className="text-[12px] font-semibold text-[#1B4F8B] hover:text-[#0B2545] cursor-pointer transition-colors"
            >
              {showError ? "Hide Error" : "Simulate Error"}
            </button>
            <button
              onClick={() => { setShowEmpty(!showEmpty); if (!showEmpty) addToast("Empty state shown", "success"); }}
              className="text-[12px] font-semibold text-[#1B4F8B] hover:text-[#0B2545] cursor-pointer transition-colors"
            >
              {showEmpty ? "Show Data" : "Simulate Empty"}
            </button>
          </div>
        </div>
      </div>

      {/* Error State */}
      {showError && (
        <ErrorState
          title="Map data unavailable"
          message="Unable to load warehouse rack configuration. Database connection timeout."
          onRetry={handleRetry}
        />
      )}

      {/* Main Content */}
      {!showError && (
        <>
          {/* Filter Bar */}
          <FilterBar filters={filters} onFilterChange={setFilters} />

          {/* Map + Zone Toggle */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Left: Map */}
            <div className="lg:col-span-4">
              {showEmpty ? (
                <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <h2 className="text-[18px] font-semibold text-[#0F172A] leading-[28px]">
                      AFU Warehouse Map
                    </h2>
                    <ScopeBadge type="inc" />
                  </div>
                  <EmptyState
                    title="No storage locations configured"
                    description="Warehouse rack configuration is not loaded. Contact the admin to initialize the storage map."
                    icon={<ArrowLeft size={28} className="text-[#94A3B8]" />}
                  />
                </div>
              ) : isLoading ? (
                <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-5 w-40 bg-[#F1F5F9] rounded animate-pulse" />
                    <div className="h-5 w-10 bg-[#F1F5F9] rounded animate-pulse" />
                  </div>
                  <div className="grid grid-cols-12 gap-1">
                    {Array.from({ length: 144 }).map((_, i) => (
                      <div key={i} className="h-8 bg-[#F1F5F9] rounded animate-pulse" />
                    ))}
                  </div>
                </div>
              ) : (
                <WarehouseMap
                  racks={filteredRacks}
                  onRackClick={handleRackClick}
                  available={availableCount}
                  partial={partialCount}
                  full={fullCount}
                  blocked={blockedCount}
                />
              )}
            </div>

            {/* Right: Multi-Zone Toggle */}
            <div className="lg:col-span-1">
              <MultiZoneToggle active={activeZone} onChange={setActiveZone} />
            </div>
          </div>

          {/* Zone Utilisation Summary */}
          <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-[18px] font-semibold text-[#0F172A] leading-[28px]">
                Zone Utilisation Summary
              </h2>
              <ScopeBadge type="inc" />
            </div>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-24 bg-[#F1F5F9] rounded animate-pulse" />
                ))}
              </div>
            ) : (
              <ZoneSummary racks={racks} />
            )}
          </div>
        </>
      )}

      {/* Rack Detail Drawer */}
      {drawerOpen && selectedRack && (
        <RackDetailDrawer
          rack={selectedRack}
          onClose={handleCloseDrawer}
        />
      )}
    </div>
  );
}