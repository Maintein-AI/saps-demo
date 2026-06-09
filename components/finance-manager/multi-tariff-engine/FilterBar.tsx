"use client";

import { useState } from "react";

export default function FilterBar({
  filters,
  onFilterChange,
}: {
  filters: {
    tariffSet: string;
    agentContract: string;
    consigneeTier: string;
    route: string;
    cargoClass: string;
    status: string;
  };
  onFilterChange: (f: any) => void;
}) {
  const [showFilters, setShowFilters] = useState(false);

  const agentContracts = [
    "DB Schenker Contract 2026",
    "Kuehne+Nagel Tier A",
    "Gerry's Standard Import",
    "Local Agent Walk-in",
    "Govt Direct Contract",
    "Project X NDA",
    "Pakistan Oilfields Direct",
    "Kuehne+Nagel Standard",
    "DB Schenker Contract 2025",
  ];
  const consigneeTiers = ["Standard", "Preferred", "Government", "Strategic", "Special Approval"];
  const routes = ["DXB-KHI", "DOH-KHI", "IST-KHI", "JED-KHI"];
  const cargoClasses = ["GCR", "DGR", "ICG", "VAL", "AOG"];
  const statuses = ["Draft", "Pending", "Under Review", "Active", "Retired"];

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0] whitespace-nowrap">exc</span>
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
            <label className="text-[12px] font-medium text-[#64748B] mb-1 block">Tariff Set</label>
            <input
              type="text"
              value={filters.tariffSet}
              onChange={(e) => onFilterChange({ ...filters, tariffSet: e.target.value })}
              placeholder="Search tariff set..."
              className="w-full h-9 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 text-[13px] text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/30 focus:border-[#14B8A6]/50"
            />
          </div>
          <div>
            <label className="text-[12px] font-medium text-[#64748B] mb-1 block">Agent Contract</label>
            <select
              value={filters.agentContract}
              onChange={(e) => onFilterChange({ ...filters, agentContract: e.target.value })}
              className="w-full h-9 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 text-[13px] text-[#0F172A] pr-8 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/30 focus:border-[#14B8A6]/50 appearance-none cursor-pointer"
              style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2364748B%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><path d=%22m6 9 6 6 6-6%22/></svg>')", backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center", backgroundSize: "12px" }}
            >
              <option value="">All Contracts</option>
              {agentContracts.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[12px] font-medium text-[#64748B] mb-1 block">Consignee Tier</label>
            <select
              value={filters.consigneeTier}
              onChange={(e) => onFilterChange({ ...filters, consigneeTier: e.target.value })}
              className="w-full h-9 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 text-[13px] text-[#0F172A] pr-8 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/30 focus:border-[#14B8A6]/50 appearance-none cursor-pointer"
              style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2364748B%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><path d=%22m6 9 6 6 6-6%22/></svg>')", backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center", backgroundSize: "12px" }}
            >
              <option value="">All Tiers</option>
              {consigneeTiers.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[12px] font-medium text-[#64748B] mb-1 block">Route</label>
            <select
              value={filters.route}
              onChange={(e) => onFilterChange({ ...filters, route: e.target.value })}
              className="w-full h-9 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 text-[13px] text-[#0F172A] pr-8 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/30 focus:border-[#14B8A6]/50 appearance-none cursor-pointer"
              style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2364748B%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><path d=%22m6 9 6 6 6-6%22/></svg>')", backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center", backgroundSize: "12px" }}
            >
              <option value="">All Routes</option>
              {routes.map(r => <option key={r} value={r}>{r}</option>)}
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
              <option value="">All Classes</option>
              {cargoClasses.map(c => <option key={c} value={c}>{c}</option>)}
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
              <option value="">All Statuses</option>
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      )}
      {!showFilters && (
        <div className="flex items-center gap-2 mt-2">
          {filters.agentContract && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#E2E8F0] text-[11px] text-[#64748B]">
              {filters.agentContract}
              <button onClick={() => onFilterChange({ ...filters, agentContract: "" })} className="cursor-pointer hover:text-[#EF4444]">x</button>
            </span>
          )}
          {filters.consigneeTier && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#E2E8F0] text-[11px] text-[#64748B]">
              {filters.consigneeTier}
              <button onClick={() => onFilterChange({ ...filters, consigneeTier: "" })} className="cursor-pointer hover:text-[#EF4444]">x</button>
            </span>
          )}
          {filters.route && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#E2E8F0] text-[11px] text-[#64748B]">
              {filters.route}
              <button onClick={() => onFilterChange({ ...filters, route: "" })} className="cursor-pointer hover:text-[#EF4444]">x</button>
            </span>
          )}
          {filters.cargoClass && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#E2E8F0] text-[11px] text-[#64748B]">
              {filters.cargoClass}
              <button onClick={() => onFilterChange({ ...filters, cargoClass: "" })} className="cursor-pointer hover:text-[#EF4444]">x</button>
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