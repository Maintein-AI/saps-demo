"use client";

import { useState } from "react";
import { Search, Filter, Calendar, ChevronDown, X } from "lucide-react";

export default function FilterBar() {
  const [filters, setFilters] = useState({
    awb: "",
    carrier: "",
    flight: "",
    arrivalDate: "",
    status: "",
    cargoClass: "",
    paymentStatus: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  const updateFilter = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ awb: "", carrier: "", flight: "", arrivalDate: "", status: "", cargoClass: "", paymentStatus: "" });
  };

  const activeCount = Object.values(filters).filter((v) => v !== "").length;

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3 flex-wrap">
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
            value={filters.carrier}
            onChange={(e) => updateFilter("carrier", e.target.value)}
            placeholder="Carrier"
            className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors"
          />
        </div>

        <div className="relative flex-1 min-w-[200px] max-w-[300px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="text"
            value={filters.flight}
            onChange={(e) => updateFilter("flight", e.target.value)}
            placeholder="Flight"
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
            <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="date"
              value={filters.arrivalDate}
              onChange={(e) => updateFilter("arrivalDate", e.target.value)}
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
              <option value="Arrived">Arrived</option>
              <option value="Customs">Customs</option>
              <option value="OOC">OOC</option>
              <option value="Charges Due">Charges Due</option>
              <option value="DO Ready">DO Ready</option>
              <option value="Picked">Picked</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>

          <div className="relative">
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" />
            <select
              value={filters.cargoClass}
              onChange={(e) => updateFilter("cargoClass", e.target.value)}
              className="w-full h-10 pl-3 pr-8 rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors bg-white appearance-none cursor-pointer"
            >
              <option value="">All Cargo Class</option>
              <option value="GCR">GCR</option>
              <option value="PER">PER</option>
              <option value="AFU">AFU</option>
              <option value="VAL">VAL</option>
              <option value="AVI">AVI</option>
            </select>
          </div>

          <div className="relative">
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" />
            <select
              value={filters.paymentStatus}
              onChange={(e) => updateFilter("paymentStatus", e.target.value)}
              className="w-full h-10 pl-3 pr-8 rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors bg-white appearance-none cursor-pointer"
            >
              <option value="">All Payment Status</option>
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
              <option value="Partially Paid">Partially Paid</option>
              <option value="Waived">Waived</option>
              <option value="On Credit">On Credit</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}