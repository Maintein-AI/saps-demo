"use client";

import { useState } from "react";
import { Filter, Hash, Calendar, Bell, AlertTriangle, Eye } from "lucide-react";

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
      <div className="relative flex-1 min-w-[200px]">
        <Bell size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
        <select
          value={filters.type || ""}
          onChange={(e) => handleChange("type", e.target.value)}
          className="w-full h-10 pl-9 pr-8 rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors appearance-none bg-white"
        >
          <option value="">All Notification Types</option>
          <option value="Free-period expiry">Free-period expiry</option>
          <option value="Customs hold">Customs hold</option>
          <option value="Documents missing">Documents missing</option>
          <option value="Payment due">Payment due</option>
          <option value="DO ready">DO ready</option>
          <option value="Pickup approved">Pickup approved</option>
          <option value="Pickup rejected">Pickup rejected</option>
          <option value="Gate entry rejected">Gate entry rejected</option>
          <option value="Authority letter expiring">Authority letter expiring</option>
          <option value="OOC issued">OOC issued</option>
          <option value="Delivered">Delivered</option>
        </select>
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

      <div className="relative flex-1 min-w-[160px]">
        <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
        <select
          value={filters.status || ""}
          onChange={(e) => handleChange("status", e.target.value)}
          className="w-full h-10 pl-9 pr-8 rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors appearance-none bg-white"
        >
          <option value="">All Statuses</option>
          <option value="Unread">Unread</option>
          <option value="Read">Read</option>
          <option value="Action Required">Action Required</option>
          <option value="Resolved">Resolved</option>
        </select>
      </div>

      <div className="relative flex-1 min-w-[160px]">
        <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
        <input
          type="date"
          value={filters.dateFrom || ""}
          onChange={(e) => handleChange("dateFrom", e.target.value)}
          className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors bg-white"
        />
      </div>

      <div className="relative flex-1 min-w-[160px]">
        <Eye size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
        <select
          value={filters.read || ""}
          onChange={(e) => handleChange("read", e.target.value)}
          className="w-full h-10 pl-9 pr-8 rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors appearance-none bg-white"
        >
          <option value="">Read / Unread</option>
          <option value="unread">Unread</option>
          <option value="read">Read</option>
        </select>
      </div>

      <div className="relative flex-1 min-w-[160px]">
        <AlertTriangle size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
        <select
          value={filters.priority || ""}
          onChange={(e) => handleChange("priority", e.target.value)}
          className="w-full h-10 pl-9 pr-8 rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors appearance-none bg-white"
        >
          <option value="">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Critical">Critical</option>
        </select>
      </div>
    </div>
  );
}