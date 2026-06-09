"use client";

import { useState } from "react";
import ScopeBadge from "@/components/ScopeBadge";

export default function FilterBar({
  filters,
  onFilterChange,
}: {
  filters: {
    date: string;
    zone: string;
    cargoClass: string;
    handlingCode: string;
    airline: string;
    status: string;
  };
  onFilterChange: (f: any) => void;
}) {
  const [showFilters, setShowFilters] = useState(true);

  const zones = [
    "All",
    "Standard Pallet",
    "Wide-bay 2-level",
    "Cantilever",
    "ODC Block",
    "Vertical Carousel",
    "Drive-in",
    "Cold Room COL",
    "ULD pits",
  ];
  const cargoClasses = ["All", "GCR", "AFU", "UAB", "DGR", "VAL", "HUM", "DIP", "PER", "AOG", "VUN", "AVI"];
  const handlingCodes = [
    "All",
    "ICG",
    "GCR",
    "AFU",
    "UAB",
    "DGR",
    "VAL",
    "HUM",
    "DIP",
    "PER",
    "AOG",
    "VUN",
    "AVI",
  ];
  const airlines = [
    "All",
    "PK-306",
    "QR-234",
    "EK-412",
    "SV-780",
    "GF-765",
    "WY-501",
  ];
  const statuses = ["All", "Active", "Blocked", "Over-capacity", "Maintenance"];

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <ScopeBadge type="inc" />
          <span className="text-[12px] font-medium text-[#64748B]">Filters</span>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="text-[12px] font-semibold text-[#1B4F8B] hover:text-[#0B2545] cursor-pointer transition-colors"
        >
          {showFilters ? "Collapse" : "Expand"}
        </button>
      </div>
      {showFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 mt-2">
          <div>
            <label className="text-[12px] font-medium text-[#64748B] mb-1 block">Date</label>
            <input
              type="date"
              value={filters.date}
              onChange={(e) => onFilterChange({ ...filters, date: e.target.value })}
              className="w-full h-9 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 text-[13px] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/30 focus:border-[#14B8A6]/50"
            />
          </div>
          <div>
            <label className="text-[12px] font-medium text-[#64748B] mb-1 block">Zone</label>
            <select
              value={filters.zone}
              onChange={(e) => onFilterChange({ ...filters, zone: e.target.value })}
              className="w-full h-9 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 text-[13px] text-[#0F172A] pr-8 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/30 focus:border-[#14B8A6]/50 appearance-none cursor-pointer"
              style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2364748B%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><path d=%22m6 9 6 6 6-6%22/></svg>')", backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center", backgroundSize: "12px" }}
            >
              {zones.map(z => <option key={z} value={z === "All" ? "" : z}>{z}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[12px] font-medium text-[#64748B] mb-1 block">Cargo Class</label>
            <select
              value={filters.cargoClass}
              onChange={(e) => onFilterChange({ ...filters, cargoClass: e.target.value })}
              className="w-full h-9 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 text-[13px] text-[#0F172A] pr-8 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/30 focus:border-[#14B8A6]/50 appearance-none cursor-pointer"
              style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2364748B%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><path d=%22m6 9 6 6 6-6%22/></svg>')", backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center", backgroundSize: "12px" }}
            >
              {cargoClasses.map(c => <option key={c} value={c === "All" ? "" : c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[12px] font-medium text-[#64748B] mb-1 block">Handling Code</label>
            <select
              value={filters.handlingCode}
              onChange={(e) => onFilterChange({ ...filters, handlingCode: e.target.value })}
              className="w-full h-9 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 text-[13px] text-[#0F172A] pr-8 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/30 focus:border-[#14B8A6]/50 appearance-none cursor-pointer"
              style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2364748B%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><path d=%22m6 9 6 6 6-6%22/></svg>')", backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center", backgroundSize: "12px" }}
            >
              {handlingCodes.map(h => <option key={h} value={h === "All" ? "" : h}>{h}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[12px] font-medium text-[#64748B] mb-1 block">Airline</label>
            <select
              value={filters.airline}
              onChange={(e) => onFilterChange({ ...filters, airline: e.target.value })}
              className="w-full h-9 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 text-[13px] text-[#0F172A] pr-8 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/30 focus:border-[#14B8A6]/50 appearance-none cursor-pointer"
              style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2364748B%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><path d=%22m6 9 6 6 6-6%22/></svg>')", backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center", backgroundSize: "12px" }}
            >
              {airlines.map(a => <option key={a} value={a === "All" ? "" : a}>{a}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[12px] font-medium text-[#64748B] mb-1 block">Status</label>
            <select
              value={filters.status}
              onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
              className="w-full h-9 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 text-[13px] text-[#0F172A] pr-8 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/30 focus:border-[#14B8A6]/50 appearance-none cursor-pointer"
              style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2364748B%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><path d=%22m6 9 6 6 6-6%22/></svg>')", backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center", backgroundSize: "12px" }}
            >
              {statuses.map(s => <option key={s} value={s === "All" ? "" : s}>{s}</option>)}
            </select>
          </div>
        </div>
      )}
      {!showFilters && (
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          {filters.date && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#E2E8F0] text-[11px] text-[#64748B]">
              {filters.date}
              <button onClick={() => onFilterChange({ ...filters, date: "" })} className="cursor-pointer hover:text-[#EF4444]">x</button>
            </span>
          )}
          {filters.zone && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#E2E8F0] text-[11px] text-[#64748B]">
              {filters.zone}
              <button onClick={() => onFilterChange({ ...filters, zone: "" })} className="cursor-pointer hover:text-[#EF4444]">x</button>
            </span>
          )}
          {filters.cargoClass && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#E2E8F0] text-[11px] text-[#64748B]">
              {filters.cargoClass}
              <button onClick={() => onFilterChange({ ...filters, cargoClass: "" })} className="cursor-pointer hover:text-[#EF4444]">x</button>
            </span>
          )}
          {filters.handlingCode && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#E2E8F0] text-[11px] text-[#64748B]">
              {filters.handlingCode}
              <button onClick={() => onFilterChange({ ...filters, handlingCode: "" })} className="cursor-pointer hover:text-[#EF4444]">x</button>
            </span>
          )}
          {filters.airline && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#E2E8F0] text-[11px] text-[#64748B]">
              {filters.airline}
              <button onClick={() => onFilterChange({ ...filters, airline: "" })} className="cursor-pointer hover:text-[#EF4444]">x</button>
            </span>
          )}
          {filters.status && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#E2E8F0] text-[11px] text-[#64748B]">
              {filters.status}
              <button onClick={() => onFilterChange({ ...filters, status: "" })} className="cursor-pointer hover:text-[#EF4444]">x</button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}