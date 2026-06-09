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
      shift: "",
      role: "",
      zone: "",
      assetType: "",
      availability: "",
      supervisor: "",
    });
  };

  const hasFilters = Object.values(filters).some((v) => v !== "");

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
          {hasFilters && (
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
            <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">Shift</label>
            <div className="relative">
              <select
                value={filters.shift}
                onChange={(e) => update("shift", e.target.value)}
                className="w-full h-9 px-3 pr-8 rounded-lg border border-[#E2E8F0] bg-white text-[13px] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#1B4F8B]/20 focus:border-[#1B4F8B] appearance-none cursor-pointer"
              >
                <option value="">All Shifts</option>
                <option value="Morning">Morning</option>
                <option value="Evening">Evening</option>
                <option value="Night">Night</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">Role</label>
            <div className="relative">
              <select
                value={filters.role}
                onChange={(e) => update("role", e.target.value)}
                className="w-full h-9 px-3 pr-8 rounded-lg border border-[#E2E8F0] bg-white text-[13px] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#1B4F8B]/20 focus:border-[#1B4F8B] appearance-none cursor-pointer"
              >
                <option value="">All Roles</option>
                <option value="Lifter Operator">Lifter Operator</option>
                <option value="Warehouse Associate">Warehouse Associate</option>
                <option value="Gate Guard">Gate Guard</option>
                <option value="Compliance Officer">Compliance Officer</option>
                <option value="Finance User">Finance User</option>
                <option value="Supervisor">Supervisor</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">Zone</label>
            <div className="relative">
              <select
                value={filters.zone}
                onChange={(e) => update("zone", e.target.value)}
                className="w-full h-9 px-3 pr-8 rounded-lg border border-[#E2E8F0] bg-white text-[13px] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#1B4F8B]/20 focus:border-[#1B4F8B] appearance-none cursor-pointer"
              >
                <option value="">All Zones</option>
                <option value="AFU Zone A">AFU Zone A</option>
                <option value="GCR Zone">GCR Zone</option>
                <option value="Gate 01">Gate 01</option>
                <option value="Cold Room">Cold Room</option>
                <option value="ODC Block">ODC Block</option>
                <option value="ULD Pit">ULD Pit</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">Asset Type</label>
            <div className="relative">
              <select
                value={filters.assetType}
                onChange={(e) => update("assetType", e.target.value)}
                className="w-full h-9 px-3 pr-8 rounded-lg border border-[#E2E8F0] bg-white text-[13px] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#1B4F8B]/20 focus:border-[#1B4F8B] appearance-none cursor-pointer"
              >
                <option value="">All Assets</option>
                <option value="Forklift">Forklift</option>
                <option value="Handheld">Handheld</option>
                <option value="Scanner">Scanner</option>
                <option value="Lifter">Lifter</option>
                <option value="Vehicle">Vehicle</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">Availability</label>
            <div className="relative">
              <select
                value={filters.availability}
                onChange={(e) => update("availability", e.target.value)}
                className="w-full h-9 px-3 pr-8 rounded-lg border border-[#E2E8F0] bg-white text-[13px] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#1B4F8B]/20 focus:border-[#1B4F8B] appearance-none cursor-pointer"
              >
                <option value="">All</option>
                <option value="Available">Available</option>
                <option value="Busy">Busy</option>
                <option value="Off">Off</option>
                <option value="On Break">On Break</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">Supervisor</label>
            <div className="relative">
              <select
                value={filters.supervisor}
                onChange={(e) => update("supervisor", e.target.value)}
                className="w-full h-9 px-3 pr-8 rounded-lg border border-[#E2E8F0] bg-white text-[13px] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#1B4F8B]/20 focus:border-[#1B4F8B] appearance-none cursor-pointer"
              >
                <option value="">All Supervisors</option>
                <option value="Imran Ali">Imran Ali</option>
                <option value="Nadeem Shah">Nadeem Shah</option>
                <option value="Farhan Ahmed">Farhan Ahmed</option>
                <option value="Sadia Malik">Sadia Malik</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}