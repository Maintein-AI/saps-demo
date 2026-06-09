"use client";

import { useState } from "react";
import { Filter, ChevronDown, ChevronUp, X } from "lucide-react";
import type { FilterState } from "./types";

interface FilterBarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

export default function FilterBar({ filters, onChange }: FilterBarProps) {
  const [expanded, setExpanded] = useState(false);

  const update = (key: keyof FilterState, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  const clearAll = () => {
    onChange({
      date: "",
      airline: "",
      originAirport: "",
      flightNumber: "",
      cargoClass: "",
      messageSource: "",
      etaWindow: "",
    });
  };

  const activeFilterCount = Object.values(filters).filter((v) => v !== "").length;

  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-white">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#F1F5F9] flex items-center justify-center">
            <Filter size={16} className="text-[#64748B]" />
          </div>
          <span className="text-[13px] font-semibold text-[#0F172A]">
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-2 px-1.5 py-0.5 rounded-md text-[11px] font-bold text-white" style={{ backgroundColor: "#1B4F8B" }}>
                {activeFilterCount}
              </span>
            )}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {activeFilterCount > 0 && (
            <button
              onClick={clearAll}
              className="flex items-center gap-1 h-8 px-3 rounded-lg text-[12px] font-medium text-[#64748B] hover:bg-[#F1F5F9] cursor-pointer transition-colors"
            >
              <X size={14} />
              Clear
            </button>
          )}
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 h-8 px-3 rounded-lg text-[12px] font-medium text-[#1B4F8B] hover:bg-[#EBF0F7] cursor-pointer transition-colors"
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {expanded ? "Collapse" : "Expand"}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 border-t border-[#E2E8F0] pt-3">
          <div>
            <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">Date</label>
            <input
              type="date"
              value={filters.date}
              onChange={(e) => update("date", e.target.value)}
              className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] bg-white text-[13px] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#1B4F8B]/20 focus:border-[#1B4F8B] cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">Airline</label>
            <div className="relative">
              <select
                value={filters.airline}
                onChange={(e) => update("airline", e.target.value)}
                className="w-full h-9 px-3 pr-8 rounded-lg border border-[#E2E8F0] bg-white text-[13px] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#1B4F8B]/20 focus:border-[#1B4F8B] appearance-none cursor-pointer"
              >
                <option value="">All Airlines</option>
                <option value="Emirates">Emirates</option>
                <option value="Qatar Airways">Qatar Airways</option>
                <option value="Turkish Cargo">Turkish Cargo</option>
                <option value="Saudi Cargo">Saudi Cargo</option>
                <option value="PIA">PIA</option>
                <option value="AirBlue">AirBlue</option>
                <option value="FlyDubai">FlyDubai</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">Origin Airport</label>
            <div className="relative">
              <select
                value={filters.originAirport}
                onChange={(e) => update("originAirport", e.target.value)}
                className="w-full h-9 px-3 pr-8 rounded-lg border border-[#E2E8F0] bg-white text-[13px] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#1B4F8B]/20 focus:border-[#1B4F8B] appearance-none cursor-pointer"
              >
                <option value="">All Origins</option>
                <option value="DXB">DXB — Dubai</option>
                <option value="DOH">DOH — Doha</option>
                <option value="IST">IST — Istanbul</option>
                <option value="JED">JED — Jeddah</option>
                <option value="KHI">KHI — Karachi</option>
                <option value="RUH">RUH — Riyadh</option>
                <option value="LHE">LHE — Lahore</option>
                <option value="BKK">BKK — Bangkok</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">Flight #</label>
            <input
              type="text"
              value={filters.flightNumber}
              onChange={(e) => update("flightNumber", e.target.value)}
              placeholder="e.g. EK604"
              className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] bg-white text-[13px] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#1B4F8B]/20 focus:border-[#1B4F8B] placeholder:text-[#94A3B8]"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">Cargo Class</label>
            <div className="relative">
              <select
                value={filters.cargoClass}
                onChange={(e) => update("cargoClass", e.target.value)}
                className="w-full h-9 px-3 pr-8 rounded-lg border border-[#E2E8F0] bg-white text-[13px] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#1B4F8B]/20 focus:border-[#1B4F8B] appearance-none cursor-pointer"
              >
                <option value="">All Classes</option>
                <option value="ICG">ICG</option>
                <option value="GCR">GCR</option>
                <option value="AFU">AFU</option>
                <option value="UAB">UAB</option>
                <option value="DGR">DGR</option>
                <option value="VAL">VAL</option>
                <option value="HUM">HUM</option>
                <option value="DIP">DIP</option>
                <option value="PER">PER</option>
                <option value="AOG">AOG</option>
                <option value="VUN">VUN</option>
                <option value="AVI">AVI</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">Message Source</label>
            <div className="relative">
              <select
                value={filters.messageSource}
                onChange={(e) => update("messageSource", e.target.value)}
                className="w-full h-9 px-3 pr-8 rounded-lg border border-[#E2E8F0] bg-white text-[13px] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#1B4F8B]/20 focus:border-[#1B4F8B] appearance-none cursor-pointer"
              >
                <option value="">All Sources</option>
                <option value="FFM">FFM</option>
                <option value="FWB">FWB</option>
                <option value="FHL">FHL</option>
                <option value="SITA">SITA</option>
                <option value="Email">Email</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">ETA Window</label>
            <div className="relative">
              <select
                value={filters.etaWindow}
                onChange={(e) => update("etaWindow", e.target.value)}
                className="w-full h-9 px-3 pr-8 rounded-lg border border-[#E2E8F0] bg-white text-[13px] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#1B4F8B]/20 focus:border-[#1B4F8B] appearance-none cursor-pointer"
              >
                <option value="">All Day</option>
                <option value="06-12">06:00 — 12:00</option>
                <option value="12-18">12:00 — 18:00</option>
                <option value="18-24">18:00 — 24:00</option>
                <option value="00-06">00:00 — 06:00</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}