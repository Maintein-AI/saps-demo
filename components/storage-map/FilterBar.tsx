"use client";

import { Search, Filter } from "lucide-react";

interface FilterBarProps {
  filters: {
    zone: string;
    cargoClass: string;
    occupancy: string;
    row: string;
    handlingCode: string;
    search: string;
  };
  onFilterChange: (filters: FilterBarProps["filters"]) => void;
}

const zones = ["all", "AFU", "GCR", "PER", "VAL", "DGR", "COLD"];
const cargoClasses = ["all", "AFU", "GCR", "PER", "VAL", "DGR", "COLD"];
const occupancyStatuses = ["all", "available", "partial", "full", "blocked"];
const rows = ["all", "R01", "R02", "R03", "R04", "R05", "R06", "R07", "R08", "R09"];
const handlingCodes = ["all", "GEN", "PER", "VAL", "DGR", "COL", "BUL", "FLW"];

export default function FilterBar({ filters, onFilterChange }: FilterBarProps) {
  const updateFilter = (key: string, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-[#64748B]" />
          <span className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Filters</span>
        </div>

        <div className="flex items-center gap-2 h-9 px-3 rounded-lg border border-[#E2E8F0] bg-white flex-1 min-w-[200px]">
          <Search size={14} className="text-[#94A3B8]" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            placeholder="Search AWB / RFID / Rack..."
            className="flex-1 text-[13px] font-medium text-[#0F172A] bg-transparent outline-none placeholder:text-[#94A3B8]"
          />
        </div>

        <select
          value={filters.zone}
          onChange={(e) => updateFilter("zone", e.target.value)}
          className="h-9 px-3 pr-8 rounded-lg border border-[#E2E8F0] bg-white text-[13px] font-medium text-[#0F172A] outline-none cursor-pointer appearance-none"
        >
          {zones.map((z) => (
            <option key={z} value={z}>{z === "all" ? "Zone" : z}</option>
          ))}
        </select>

        <select
          value={filters.cargoClass}
          onChange={(e) => updateFilter("cargoClass", e.target.value)}
          className="h-9 px-3 pr-8 rounded-lg border border-[#E2E8F0] bg-white text-[13px] font-medium text-[#0F172A] outline-none cursor-pointer appearance-none"
        >
          {cargoClasses.map((c) => (
            <option key={c} value={c}>{c === "all" ? "Cargo Class" : c}</option>
          ))}
        </select>

        <select
          value={filters.occupancy}
          onChange={(e) => updateFilter("occupancy", e.target.value)}
          className="h-9 px-3 pr-8 rounded-lg border border-[#E2E8F0] bg-white text-[13px] font-medium text-[#0F172A] outline-none cursor-pointer appearance-none"
        >
          {occupancyStatuses.map((o) => (
            <option key={o} value={o}>
              {o === "all" ? "Occupancy" : o.charAt(0).toUpperCase() + o.slice(1)}
            </option>
          ))}
        </select>

        <select
          value={filters.row}
          onChange={(e) => updateFilter("row", e.target.value)}
          className="h-9 px-3 pr-8 rounded-lg border border-[#E2E8F0] bg-white text-[13px] font-medium text-[#0F172A] outline-none cursor-pointer appearance-none"
        >
          {rows.map((r) => (
            <option key={r} value={r}>{r === "all" ? "Row" : r}</option>
          ))}
        </select>

        <select
          value={filters.handlingCode}
          onChange={(e) => updateFilter("handlingCode", e.target.value)}
          className="h-9 px-3 pr-8 rounded-lg border border-[#E2E8F0] bg-white text-[13px] font-medium text-[#0F172A] outline-none cursor-pointer appearance-none"
        >
          {handlingCodes.map((h) => (
            <option key={h} value={h}>{h === "all" ? "Handling Code" : h}</option>
          ))}
        </select>
      </div>
    </div>
  );
}