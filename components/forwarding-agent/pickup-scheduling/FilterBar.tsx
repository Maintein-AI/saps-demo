"use client";

import { useState } from "react";
import { Search, Filter, Truck, Calendar, Hash, Package } from "lucide-react";

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
      <div className="relative flex-1 min-w-[160px]">
        <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
        <input
          type="date"
          value={filters.date || ""}
          onChange={(e) => handleChange("date", e.target.value)}
          className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors bg-white"
        />
      </div>

      <div className="relative flex-1 min-w-[180px]">
        <Hash size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
        <input
          type="text"
          placeholder="AWB #"
          value={filters.awb || ""}
          onChange={(e) => handleChange("awb", e.target.value)}
          className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] placeholder:text-[#94A3B8] outline-none focus:border-[#1B4F8B] transition-colors bg-white"
        />
      </div>

      <div className="relative flex-1 min-w-[180px]">
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
        <Truck size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
        <select
          value={filters.vehicleType || ""}
          onChange={(e) => handleChange("vehicleType", e.target.value)}
          className="w-full h-10 pl-9 pr-8 rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors appearance-none bg-white"
        >
          <option value="">All Vehicle Types</option>
          <option value="Pickup">Pickup</option>
          <option value="Truck">Truck</option>
          <option value="Container">Container</option>
          <option value="Bike">Bike</option>
          <option value="Car">Car</option>
          <option value="Van">Van</option>
        </select>
      </div>

      <div className="relative flex-1 min-w-[160px]">
        <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
        <select
          value={filters.slotStatus || ""}
          onChange={(e) => handleChange("slotStatus", e.target.value)}
          className="w-full h-10 pl-9 pr-8 rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors appearance-none bg-white"
        >
          <option value="">All Slot Statuses</option>
          <option value="Available">Available</option>
          <option value="Booked">Booked</option>
          <option value="Pending Approval">Pending Approval</option>
          <option value="Completed">Completed</option>
          <option value="Blocked">Blocked</option>
        </select>
      </div>

      <div className="relative flex-1 min-w-[160px]">
        <Package size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
        <select
          value={filters.cargoClass || ""}
          onChange={(e) => handleChange("cargoClass", e.target.value)}
          className="w-full h-10 pl-9 pr-8 rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors appearance-none bg-white"
        >
          <option value="">All Cargo Classes</option>
          <option value="General">General</option>
          <option value="Perishable">Perishable</option>
          <option value="DGR">DGR</option>
          <option value="Pharma">Pharma</option>
          <option value="Valuable">Valuable</option>
          <option value="Live Animals">Live Animals</option>
        </select>
      </div>
    </div>
  );
}