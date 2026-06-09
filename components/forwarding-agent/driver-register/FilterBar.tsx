"use client";

import { useState } from "react";
import { Search, Filter, Phone, Hash, Calendar } from "lucide-react";

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
          placeholder="Driver Name"
          value={filters.name || ""}
          onChange={(e) => handleChange("name", e.target.value)}
          className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] placeholder:text-[#94A3B8] outline-none focus:border-[#1B4F8B] transition-colors bg-white"
        />
      </div>

      <div className="relative flex-1 min-w-[180px]">
        <Hash size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
        <input
          type="text"
          placeholder="CNIC"
          value={filters.cnic || ""}
          onChange={(e) => handleChange("cnic", e.target.value)}
          className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] placeholder:text-[#94A3B8] outline-none focus:border-[#1B4F8B] transition-colors bg-white"
        />
      </div>

      <div className="relative flex-1 min-w-[160px]">
        <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
        <input
          type="text"
          placeholder="Mobile"
          value={filters.mobile || ""}
          onChange={(e) => handleChange("mobile", e.target.value)}
          className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] placeholder:text-[#94A3B8] outline-none focus:border-[#1B4F8B] transition-colors bg-white"
        />
      </div>

      <div className="relative flex-1 min-w-[160px]">
        <Hash size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
        <input
          type="text"
          placeholder="License #"
          value={filters.license || ""}
          onChange={(e) => handleChange("license", e.target.value)}
          className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] placeholder:text-[#94A3B8] outline-none focus:border-[#1B4F8B] transition-colors bg-white"
        />
      </div>

      <div className="relative flex-1 min-w-[160px]">
        <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
        <select
          value={filters.status || ""}
          onChange={(e) => handleChange("status", e.target.value)}
          className="w-full h-10 pl-9 pr-8 rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors appearance-none bg-white"
        >
          <option value="">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Blocked">Blocked</option>
          <option value="License Expired">License Expired</option>
          <option value="Verification Required">Verification Required</option>
        </select>
      </div>

      <div className="relative flex-1 min-w-[180px]">
        <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
        <input
          type="date"
          placeholder="Last Visit"
          value={filters.lastVisit || ""}
          onChange={(e) => handleChange("lastVisit", e.target.value)}
          className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors bg-white"
        />
      </div>

      <div className="relative flex-1 min-w-[180px]">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
        <input
          type="text"
          placeholder="Allowed AWB / DO"
          value={filters.allowed || ""}
          onChange={(e) => handleChange("allowed", e.target.value)}
          className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] placeholder:text-[#94A3B8] outline-none focus:border-[#1B4F8B] transition-colors bg-white"
        />
      </div>
    </div>
  );
}