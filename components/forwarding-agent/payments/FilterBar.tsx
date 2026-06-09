"use client";

import { useState } from "react";
import { Search, Filter, Hash, Calendar } from "lucide-react";

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
          placeholder="Invoice #"
          value={filters.invoice || ""}
          onChange={(e) => handleChange("invoice", e.target.value)}
          className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] placeholder:text-[#94A3B8] outline-none focus:border-[#1B4F8B] transition-colors bg-white"
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
        <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
        <select
          value={filters.status || ""}
          onChange={(e) => handleChange("status", e.target.value)}
          className="w-full h-10 pl-9 pr-8 rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors appearance-none bg-white"
        >
          <option value="">All Statuses</option>
          <option value="Unpaid">Unpaid</option>
          <option value="Partially Paid">Partially Paid</option>
          <option value="Paid">Paid</option>
          <option value="Overdue">Overdue</option>
          <option value="Disputed">Disputed</option>
        </select>
      </div>

      <div className="relative flex-1 min-w-[180px]">
        <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
        <input
          type="date"
          placeholder="Due Date"
          value={filters.dueDate || ""}
          onChange={(e) => handleChange("dueDate", e.target.value)}
          className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors bg-white"
        />
      </div>

      <div className="relative flex-1 min-w-[180px]">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
        <input
          type="text"
          placeholder="Amount Range (e.g. 1000-5000)"
          value={filters.amountRange || ""}
          onChange={(e) => handleChange("amountRange", e.target.value)}
          className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] placeholder:text-[#94A3B8] outline-none focus:border-[#1B4F8B] transition-colors bg-white"
        />
      </div>
    </div>
  );
}