"use client";

import { useState } from "react";
import { Search, Filter, Calendar, Truck, ChevronDown, X, User } from "lucide-react";

export default function FilterBar() {
  const [filters, setFilters] = useState({
    doNo: "",
    awb: "",
    consignee: "",
    driver: "",
    vehicle: "",
    collectionSlot: "",
    status: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  const updateFilter = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      doNo: "",
      awb: "",
      consignee: "",
      driver: "",
      vehicle: "",
      collectionSlot: "",
      status: "",
    });
  };

  const activeCount = Object.values(filters).filter((v) => v !== "").length;

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-[300px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="text"
            value={filters.doNo}
            onChange={(e) => updateFilter("doNo", e.target.value)}
            placeholder="DO #"
            className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors"
          />
        </div>

        <div className="relative flex-1 min-w-[200px] max-w-[300px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="text"
            value={filters.awb}
            onChange={(e) => updateFilter("awb", e.target.value)}
            placeholder="AWB #"
            className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors"
          />
        </div>

        <div className="relative flex-1 min-w-[200px] max-w-[300px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="text"
            value={filters.consignee}
            onChange={(e) => updateFilter("consignee", e.target.value)}
            placeholder="Consignee"
            className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors"
          />
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 h-10 px-4 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer transition-colors whitespace-nowrap"
        >
          <Filter size={14} />
          More Filters
          {activeCount > 0 && (
            <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-[#0B2545] text-white text-[11px] font-bold">
              {activeCount}
            </span>
          )}
          <ChevronDown size={14} className={`transition-transform ${showFilters ? "rotate-180" : ""}`} />
        </button>

        {activeCount > 0 && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 h-10 px-4 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#DC2626] hover:bg-[#FEE2E2] cursor-pointer transition-colors whitespace-nowrap"
          >
            <X size={14} />
            Clear
          </button>
        )}
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4 pt-4 border-t border-[#E2E8F0]">
          <div className="relative">
            <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="text"
              value={filters.driver}
              onChange={(e) => updateFilter("driver", e.target.value)}
              placeholder="Driver"
              className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors"
            />
          </div>

          <div className="relative">
            <Truck size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="text"
              value={filters.vehicle}
              onChange={(e) => updateFilter("vehicle", e.target.value)}
              placeholder="Vehicle"
              className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors"
            />
          </div>

          <div className="relative">
            <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="text"
              value={filters.collectionSlot}
              onChange={(e) => updateFilter("collectionSlot", e.target.value)}
              placeholder="Collection Slot"
              className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors"
            />
          </div>

          <div className="relative">
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" />
            <select
              value={filters.status}
              onChange={(e) => updateFilter("status", e.target.value)}
              className="w-full h-10 pl-3 pr-8 rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors bg-white appearance-none cursor-pointer"
            >
              <option value="">All Status</option>
              <option value="DO Ready">DO Ready</option>
              <option value="Driver Assigned">Driver Assigned</option>
              <option value="Vehicle Assigned">Vehicle Assigned</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Collected">Collected</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}