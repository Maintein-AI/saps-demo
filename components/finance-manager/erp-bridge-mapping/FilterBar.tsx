"use client";

import { useState } from "react";

export default function FilterBar({
  filters,
  onFilterChange,
}: {
  filters: {
    chargeType: string;
    glAccount: string;
    syncStatus: string;
    erpTarget: string;
    invoiceNo: string;
  };
  onFilterChange: (f: any) => void;
}) {
  const [showFilters, setShowFilters] = useState(false);

  const chargeTypes = [
    "Handling Charges",
    "Storage Charges",
    "Customs Clearance",
    "Transport",
    "Demurrage",
    "Bond Fee",
    "Documentation",
    "Insurance",
    "Fuel Surcharge",
    "Security Fee",
  ];
  const syncStatuses = ["Pending", "Success", "Failed", "Retrying", "Skipped"];
  const erpTargets = ["SAP", "Oracle"];

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 mt-2">
          <div>
            <label className="text-[12px] font-medium text-[#64748B] mb-1 block">Charge Type</label>
            <select
              value={filters.chargeType}
              onChange={(e) => onFilterChange({ ...filters, chargeType: e.target.value })}
              className="w-full h-9 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 text-[13px] text-[#0F172A] pr-8 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/30 focus:border-[#14B8A6]/50 appearance-none cursor-pointer"
              style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2364748B%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><path d=%22m6 9 6 6 6-6%22/></svg>')", backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center", backgroundSize: "12px" }}
            >
              <option value="">All Types</option>
              {chargeTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[12px] font-medium text-[#64748B] mb-1 block">GL Account</label>
            <input
              type="text"
              value={filters.glAccount}
              onChange={(e) => onFilterChange({ ...filters, glAccount: e.target.value })}
              placeholder="Search GL account..."
              className="w-full h-9 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 text-[13px] text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/30 focus:border-[#14B8A6]/50"
            />
          </div>
          <div>
            <label className="text-[12px] font-medium text-[#64748B] mb-1 block">Sync Status</label>
            <select
              value={filters.syncStatus}
              onChange={(e) => onFilterChange({ ...filters, syncStatus: e.target.value })}
              className="w-full h-9 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 text-[13px] text-[#0F172A] pr-8 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/30 focus:border-[#14B8A6]/50 appearance-none cursor-pointer"
              style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2364748B%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><path d=%22m6 9 6 6 6-6%22/></svg>')", backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center", backgroundSize: "12px" }}
            >
              <option value="">All Statuses</option>
              {syncStatuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[12px] font-medium text-[#64748B] mb-1 block">ERP Target</label>
            <select
              value={filters.erpTarget}
              onChange={(e) => onFilterChange({ ...filters, erpTarget: e.target.value })}
              className="w-full h-9 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 text-[13px] text-[#0F172A] pr-8 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/30 focus:border-[#14B8A6]/50 appearance-none cursor-pointer"
              style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2364748B%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><path d=%22m6 9 6 6 6-6%22/></svg>')", backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center", backgroundSize: "12px" }}
            >
              <option value="">All ERPs</option>
              {erpTargets.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[12px] font-medium text-[#64748B] mb-1 block">Invoice #</label>
            <input
              type="text"
              value={filters.invoiceNo}
              onChange={(e) => onFilterChange({ ...filters, invoiceNo: e.target.value })}
              placeholder="Search invoice..."
              className="w-full h-9 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 text-[13px] text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/30 focus:border-[#14B8A6]/50"
            />
          </div>
        </div>
      )}
      {!showFilters && (
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          {filters.chargeType && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#E2E8F0] text-[11px] text-[#64748B]">
              {filters.chargeType}
              <button onClick={() => onFilterChange({ ...filters, chargeType: "" })} className="cursor-pointer hover:text-[#EF4444]">x</button>
            </span>
          )}
          {filters.syncStatus && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#E2E8F0] text-[11px] text-[#64748B]">
              {filters.syncStatus}
              <button onClick={() => onFilterChange({ ...filters, syncStatus: "" })} className="cursor-pointer hover:text-[#EF4444]">x</button>
            </span>
          )}
          {filters.erpTarget && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#E2E8F0] text-[11px] text-[#64748B]">
              {filters.erpTarget}
              <button onClick={() => onFilterChange({ ...filters, erpTarget: "" })} className="cursor-pointer hover:text-[#EF4444]">x</button>
            </span>
          )}
          {filters.invoiceNo && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#E2E8F0] text-[11px] text-[#64748B]">
              Inv: {filters.invoiceNo}
              <button onClick={() => onFilterChange({ ...filters, invoiceNo: "" })} className="cursor-pointer hover:text-[#EF4444]">x</button>
            </span>
          )}
          {filters.glAccount && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#E2E8F0] text-[11px] text-[#64748B]">
              GL: {filters.glAccount}
              <button onClick={() => onFilterChange({ ...filters, glAccount: "" })} className="cursor-pointer hover:text-[#EF4444]">x</button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}