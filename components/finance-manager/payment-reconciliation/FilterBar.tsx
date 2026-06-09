"use client";

import { useState } from "react";
import { Search, Filter, X } from "lucide-react";

interface FilterBarProps {
  filters: {
    dateRange: string;
    bank: string;
    paymentMode: string;
    invoiceId: string;
    awb: string;
    payerName: string;
    status: string;
  };
  onFilterChange: (filters: any) => void;
}

export default function FilterBar({ filters, onFilterChange }: FilterBarProps) {
  const [showAll, setShowAll] = useState(false);

  const updateFilter = (key: string, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({
      dateRange: "",
      bank: "",
      paymentMode: "",
      invoiceId: "",
      awb: "",
      payerName: "",
      status: "",
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
          <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">Date Range</label>
          <select
            value={filters.dateRange}
            onChange={(e) => updateFilter("dateRange", e.target.value)}
            className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] bg-white text-[12px] text-[#0F172A] focus:outline-none focus:border-[#1B4F8B] pr-8"
          >
            <option value="">All dates</option>
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="week">Last 7 days</option>
            <option value="month">This month</option>
          </select>
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">Bank</label>
          <select
            value={filters.bank}
            onChange={(e) => updateFilter("bank", e.target.value)}
            className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] bg-white text-[12px] text-[#0F172A] focus:outline-none focus:border-[#1B4F8B] pr-8"
          >
            <option value="">All banks</option>
            <option value="HBL">HBL</option>
            <option value="Meezan">Meezan</option>
            <option value="UBL">UBL</option>
            <option value="Askari">Askari</option>
          </select>
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">Payment Mode</label>
          <select
            value={filters.paymentMode}
            onChange={(e) => updateFilter("paymentMode", e.target.value)}
            className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] bg-white text-[12px] text-[#0F172A] focus:outline-none focus:border-[#1B4F8B] pr-8"
          >
            <option value="">All modes</option>
            <option value="bank">Bank Transfer</option>
            <option value="cheque">Cheque</option>
            <option value="cash">Cash Deposit</option>
            <option value="online">Online</option>
          </select>
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">Status</label>
          <select
            value={filters.status}
            onChange={(e) => updateFilter("status", e.target.value)}
            className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] bg-white text-[12px] text-[#0F172A] focus:outline-none focus:border-[#1B4F8B] pr-8"
          >
            <option value="">All statuses</option>
            <option value="Matched">Matched</option>
            <option value="Unmatched">Unmatched</option>
            <option value="Partial">Partial</option>
            <option value="Excess">Excess</option>
            <option value="Failed">Failed</option>
            <option value="Under Review">Under Review</option>
          </select>
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">Invoice #</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 flex items-center justify-center">
              <Search size={12} className="text-[#94A3B8]" />
            </div>
            <input
              type="text"
              value={filters.invoiceId}
              onChange={(e) => updateFilter("invoiceId", e.target.value)}
              placeholder="Search invoice..."
              className="w-full h-9 pl-8 pr-3 rounded-lg border border-[#E2E8F0] bg-white text-[12px] text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#1B4F8B]"
            />
          </div>
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">AWB #</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 flex items-center justify-center">
              <Search size={12} className="text-[#94A3B8]" />
            </div>
            <input
              type="text"
              value={filters.awb}
              onChange={(e) => updateFilter("awb", e.target.value)}
              placeholder="Search AWB..."
              className="w-full h-9 pl-8 pr-3 rounded-lg border border-[#E2E8F0] bg-white text-[12px] text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#1B4F8B]"
            />
          </div>
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">Payer Name</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 flex items-center justify-center">
              <Search size={12} className="text-[#94A3B8]" />
            </div>
            <input
              type="text"
              value={filters.payerName}
              onChange={(e) => updateFilter("payerName", e.target.value)}
              placeholder="Search payer..."
              className="w-full h-9 pl-8 pr-3 rounded-lg border border-[#E2E8F0] bg-white text-[12px] text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#1B4F8B]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}