"use client";

import { useState } from "react";
import { Search, Filter, Calendar } from "lucide-react";

interface FilterBarProps {
  onFilter: (filters: Record<string, string>) => void;
}

export default function FilterBar({ onFilter }: FilterBarProps) {
  const [filters, setFilters] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    const next = { ...filters, [field]: value };
    setFilters(next);
    onFilter(next);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-[180px]">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
        <input
          type="text"
          placeholder="AWB #"
          value={filters.awb || ""}
          onChange={(e) => handleChange("awb", e.target.value)}
          className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] placeholder:text-[#94A3B8] outline-none focus:border-[#1B4F8B] transition-colors bg-white"
        />
      </div>

      <div className="relative flex-1 min-w-[180px]">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
        <input
          type="text"
          placeholder="DO #"
          value={filters.do || ""}
          onChange={(e) => handleChange("do", e.target.value)}
          className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] placeholder:text-[#94A3B8] outline-none focus:border-[#1B4F8B] transition-colors bg-white"
        />
      </div>

      <div className="relative flex-1 min-w-[180px]">
        <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
        <select
          value={filters.docType || ""}
          onChange={(e) => handleChange("docType", e.target.value)}
          className="w-full h-10 pl-9 pr-8 rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors appearance-none bg-white"
        >
          <option value="">All Document Types</option>
          <option value="DO Endorsement">DO Endorsement</option>
          <option value="Authority Letter">Authority Letter</option>
          <option value="Vehicle Entry Pre-registration">Vehicle Entry Pre-registration</option>
          <option value="Driver Assignment">Driver Assignment</option>
          <option value="Pickup Slot">Pickup Slot</option>
        </select>
      </div>

      <div className="relative flex-1 min-w-[160px]">
        <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
        <select
          value={filters.status || ""}
          onChange={(e) => handleChange("status", e.target.value)}
          className="w-full h-10 pl-9 pr-8 rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors appearance-none bg-white"
        >
          <option value="">All Statuses</option>
          <option value="Draft">Draft</option>
          <option value="Submitted">Submitted</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <div className="relative flex-1 min-w-[160px]">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
        <input
          type="text"
          placeholder="Driver"
          value={filters.driver || ""}
          onChange={(e) => handleChange("driver", e.target.value)}
          className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] placeholder:text-[#94A3B8] outline-none focus:border-[#1B4F8B] transition-colors bg-white"
        />
      </div>

      <div className="relative flex-1 min-w-[160px]">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
        <input
          type="text"
          placeholder="Vehicle"
          value={filters.vehicle || ""}
          onChange={(e) => handleChange("vehicle", e.target.value)}
          className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] placeholder:text-[#94A3B8] outline-none focus:border-[#1B4F8B] transition-colors bg-white"
        />
      </div>

      <div className="relative flex-1 min-w-[180px]">
        <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
        <input
          type="date"
          value={filters.dateFrom || ""}
          onChange={(e) => handleChange("dateFrom", e.target.value)}
          className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors bg-white"
        />
      </div>
    </div>
  );
}