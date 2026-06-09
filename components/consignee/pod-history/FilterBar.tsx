"use client";

import { useState } from "react";
import { Search, Calendar, User, Truck, Hash, Filter } from "lucide-react";

interface FilterBarProps {
  onFilter: (filters: Record<string, string>) => void;
}

export default function FilterBar({ onFilter }: FilterBarProps) {
  const [expanded, setExpanded] = useState(false);
  const [filters, setFilters] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    const next = { ...filters, [field]: value };
    setFilters(next);
    onFilter(next);
  };

  const activeCount = Object.values(filters).filter((v) => v && v.trim()).length;

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[160px]">
          <Hash size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="AWB #"
            value={filters.awb || ""}
            onChange={(e) => handleChange("awb", e.target.value)}
            className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] placeholder:text-[#94A3B8] outline-none focus:border-[#1B4F8B] transition-colors bg-white"
          />
        </div>

        <div className="relative flex-1 min-w-[160px]">
          <Hash size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="DO #"
            value={filters.do || ""}
            onChange={(e) => handleChange("do", e.target.value)}
            className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] placeholder:text-[#94A3B8] outline-none focus:border-[#1B4F8B] transition-colors bg-white"
          />
        </div>

        <div className="relative flex-1 min-w-[160px]">
          <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="date"
            value={filters.pickupDate || ""}
            onChange={(e) => handleChange("pickupDate", e.target.value)}
            className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors bg-white"
          />
        </div>

        <div className="relative flex-1 min-w-[160px]">
          <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <select
            value={filters.driver || ""}
            onChange={(e) => handleChange("driver", e.target.value)}
            className="w-full h-10 pl-9 pr-8 rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors appearance-none bg-white"
          >
            <option value="">All Drivers</option>
            <option value="Ahmed Raza">Ahmed Raza</option>
            <option value="Imran Ali">Imran Ali</option>
            <option value="Kashif Khan">Kashif Khan</option>
            <option value="Bilal Ahmed">Bilal Ahmed</option>
            <option value="Nadeem Hussain">Nadeem Hussain</option>
            <option value="Rashid Mehmood">Rashid Mehmood</option>
            <option value="Kamran Khan">Kamran Khan</option>
          </select>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 h-10 px-4 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer transition-colors whitespace-nowrap"
        >
          <Filter size={14} />
          Filters
          {activeCount > 0 && (
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#0B2545] text-white text-[11px] font-bold">{activeCount}</span>
          )}
        </button>

        {activeCount > 0 && (
          <button
            onClick={() => { setFilters({}); onFilter({}); }}
            className="text-[12px] font-semibold text-[#DC2626] hover:underline cursor-pointer whitespace-nowrap"
          >
            Clear all
          </button>
        )}
      </div>

      {expanded && (
        <div className="flex flex-wrap items-center gap-3 mt-3 pt-3 border-t border-[#E2E8F0]">
          <div className="relative flex-1 min-w-[160px]">
            <Truck size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <select
              value={filters.vehicle || ""}
              onChange={(e) => handleChange("vehicle", e.target.value)}
              className="w-full h-10 pl-9 pr-8 rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors appearance-none bg-white"
            >
              <option value="">All Vehicles</option>
              <option value="KHI-4582">KHI-4582</option>
              <option value="BJU-7721">BJU-7721</option>
              <option value="KHI-9934">KHI-9934</option>
              <option value="LHE-2217">LHE-2217</option>
              <option value="KHI-9921">KHI-9921</option>
              <option value="KHI-7788">KHI-7788</option>
            </select>
          </div>

          <div className="relative flex-1 min-w-[160px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <select
              value={filters.podStatus || ""}
              onChange={(e) => handleChange("podStatus", e.target.value)}
              className="w-full h-10 pl-9 pr-8 rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors appearance-none bg-white"
            >
              <option value="">All POD Statuses</option>
              <option value="Available">Available</option>
              <option value="Pending">Pending</option>
              <option value="Under Review">Under Review</option>
              <option value="Disputed">Disputed</option>
            </select>
          </div>

          <div className="relative flex-1 min-w-[160px]">
            <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <select
              value={filters.dateRange || ""}
              onChange={(e) => handleChange("dateRange", e.target.value)}
              className="w-full h-10 pl-9 pr-8 rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors appearance-none bg-white"
            >
              <option value="">All Time</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="last7">Last 7 Days</option>
              <option value="last30">Last 30 Days</option>
              <option value="thisMonth">This Month</option>
              <option value="lastMonth">Last Month</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}