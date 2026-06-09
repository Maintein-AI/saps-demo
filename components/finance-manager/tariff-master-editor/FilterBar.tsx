"use client";

import { useState } from "react";
import { Filter, X, Search } from "lucide-react";

interface FilterBarProps {
  filters: {
    version: string;
    cargoClass: string;
    handlingCode: string;
    chargeType: string;
    status: string;
    effectiveDate: string;
  };
  onFilterChange: (filters: any) => void;
}

const cargoClasses = ["ICG", "GCR", "AFU", "UAB", "DGR", "VAL", "HUM", "DIP", "PER", "AOG", "VUN", "AVI"];

export default function FilterBar({ filters, onFilterChange }: FilterBarProps) {
  const updateFilter = (key: string, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({
      version: "",
      cargoClass: "",
      handlingCode: "",
      chargeType: "",
      status: "",
      effectiveDate: "",
    });
  };

  const activeCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-4 h-4 flex items-center justify-center">
          <Filter size={16} className="text-[#64748B]" />
        </div>
        <span className="text-[13px] font-semibold text-[#0F172A]">Filters</span>
        {activeCount > 0 && (
          <button
            onClick={clearFilters}
            className="text-[12px] font-semibold text-[#DC2626] hover:text-[#B91C1C] cursor-pointer flex items-center gap-1 ml-auto"
          >
            <div className="w-3 h-3 flex items-center justify-center">
              <X size={12} />
            </div>
            Clear {activeCount}
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        <div>
          <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">Tariff Version</label>
          <select value={filters.version} onChange={(e) => updateFilter("version", e.target.value)} className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] bg-white text-[12px] text-[#0F172A] focus:outline-none focus:border-[#1B4F8B] pr-8">
            <option value="">All versions</option>
            <option value="2026-Q2">2026-Q2</option>
            <option value="2026-Q1">2026-Q1</option>
            <option value="2025-Q4">2025-Q4</option>
          </select>
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">Cargo Class</label>
          <select value={filters.cargoClass} onChange={(e) => updateFilter("cargoClass", e.target.value)} className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] bg-white text-[12px] text-[#0F172A] focus:outline-none focus:border-[#1B4F8B] pr-8">
            <option value="">All classes</option>
            {cargoClasses.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">Handling Code</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 flex items-center justify-center">
              <Search size={12} className="text-[#94A3B8]" />
            </div>
            <input type="text" value={filters.handlingCode} onChange={(e) => updateFilter("handlingCode", e.target.value)} placeholder="Search..." className="w-full h-9 pl-8 pr-3 rounded-lg border border-[#E2E8F0] bg-white text-[12px] text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#1B4F8B]" />
          </div>
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">Charge Type</label>
          <select value={filters.chargeType} onChange={(e) => updateFilter("chargeType", e.target.value)} className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] bg-white text-[12px] text-[#0F172A] focus:outline-none focus:border-[#1B4F8B] pr-8">
            <option value="">All types</option>
            <option value="Storage">Storage</option>
            <option value="Demurrage">Demurrage</option>
            <option value="Surcharge">Surcharge</option>
            <option value="Handling">Handling</option>
          </select>
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">Status</label>
          <select value={filters.status} onChange={(e) => updateFilter("status", e.target.value)} className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] bg-white text-[12px] text-[#0F172A] focus:outline-none focus:border-[#1B4F8B] pr-8">
            <option value="">All statuses</option>
            <option value="Active">Active</option>
            <option value="Draft">Draft</option>
            <option value="Retired">Retired</option>
          </select>
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">Effective Date</label>
          <input type="date" value={filters.effectiveDate} onChange={(e) => updateFilter("effectiveDate", e.target.value)} className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] bg-white text-[12px] text-[#0F172A] focus:outline-none focus:border-[#1B4F8B]" />
        </div>
      </div>
    </div>
  );
}