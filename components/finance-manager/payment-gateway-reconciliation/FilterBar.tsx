"use client";

import { useState } from "react";

export default function FilterBar({
  filters,
  onFilterChange,
}: {
  filters: {
    provider: string;
    txnId: string;
    invoiceNo: string;
    payer: string;
    status: string;
    settlementDate: string;
    refundStatus: string;
  };
  onFilterChange: (f: any) => void;
}) {
  const [showFilters, setShowFilters] = useState(false);

  const providers = ["HBL", "Meezan", "NIFT", "Easypaisa", "JazzCash", "1LINK"];
  const statuses = ["Pending", "Success", "Failed", "Refunded"];
  const refundStatuses = ["None", "Pending", "Completed", "Rejected"];

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-3 mt-2">
          <div>
            <label className="text-[12px] font-medium text-[#64748B] mb-1 block">Provider</label>
            <select
              value={filters.provider}
              onChange={(e) => onFilterChange({ ...filters, provider: e.target.value })}
              className="w-full h-9 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 text-[13px] text-[#0F172A] pr-8 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/30 focus:border-[#14B8A6]/50 appearance-none cursor-pointer"
              style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2364748B%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><path d=%22m6 9 6 6 6-6%22/></svg>')", backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center", backgroundSize: "12px" }}
            >
              <option value="">All Providers</option>
              {providers.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[12px] font-medium text-[#64748B] mb-1 block">Txn ID</label>
            <input
              type="text"
              value={filters.txnId}
              onChange={(e) => onFilterChange({ ...filters, txnId: e.target.value })}
              placeholder="Search txn ID..."
              className="w-full h-9 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 text-[13px] text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/30 focus:border-[#14B8A6]/50"
            />
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
          <div>
            <label className="text-[12px] font-medium text-[#64748B] mb-1 block">Payer</label>
            <input
              type="text"
              value={filters.payer}
              onChange={(e) => onFilterChange({ ...filters, payer: e.target.value })}
              placeholder="Search payer..."
              className="w-full h-9 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 text-[13px] text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/30 focus:border-[#14B8A6]/50"
            />
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
          <div>
            <label className="text-[12px] font-medium text-[#64748B] mb-1 block">Settlement Date</label>
            <input
              type="text"
              value={filters.settlementDate}
              onChange={(e) => onFilterChange({ ...filters, settlementDate: e.target.value })}
              placeholder="DD MMM YYYY"
              className="w-full h-9 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 text-[13px] text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/30 focus:border-[#14B8A6]/50"
            />
          </div>
          <div>
            <label className="text-[12px] font-medium text-[#64748B] mb-1 block">Refund Status</label>
            <select
              value={filters.refundStatus}
              onChange={(e) => onFilterChange({ ...filters, refundStatus: e.target.value })}
              className="w-full h-9 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 text-[13px] text-[#0F172A] pr-8 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/30 focus:border-[#14B8A6]/50 appearance-none cursor-pointer"
              style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2364748B%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><path d=%22m6 9 6 6 6-6%22/></svg>')", backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center", backgroundSize: "12px" }}
            >
              <option value="">All Refund Status</option>
              {refundStatuses.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </div>
      )}
      {!showFilters && (
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          {filters.provider && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#E2E8F0] text-[11px] text-[#64748B]">
              {filters.provider}
              <button onClick={() => onFilterChange({ ...filters, provider: "" })} className="cursor-pointer hover:text-[#EF4444]">x</button>
            </span>
          )}
          {filters.status && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#E2E8F0] text-[11px] text-[#64748B]">
              {filters.status}
              <button onClick={() => onFilterChange({ ...filters, status: "" })} className="cursor-pointer hover:text-[#EF4444]">x</button>
            </span>
          )}
          {filters.refundStatus && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#E2E8F0] text-[11px] text-[#64748B]">
              {filters.refundStatus}
              <button onClick={() => onFilterChange({ ...filters, refundStatus: "" })} className="cursor-pointer hover:text-[#EF4444]">x</button>
            </span>
          )}
          {filters.txnId && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#E2E8F0] text-[11px] text-[#64748B]">
              Txn: {filters.txnId}
              <button onClick={() => onFilterChange({ ...filters, txnId: "" })} className="cursor-pointer hover:text-[#EF4444]">x</button>
            </span>
          )}
          {filters.invoiceNo && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#E2E8F0] text-[11px] text-[#64748B]">
              Inv: {filters.invoiceNo}
              <button onClick={() => onFilterChange({ ...filters, invoiceNo: "" })} className="cursor-pointer hover:text-[#EF4444]">x</button>
            </span>
          )}
          {filters.payer && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#E2E8F0] text-[11px] text-[#64748B]">
              {filters.payer}
              <button onClick={() => onFilterChange({ ...filters, payer: "" })} className="cursor-pointer hover:text-[#EF4444]">x</button>
            </span>
          )}
          {filters.settlementDate && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#E2E8F0] text-[11px] text-[#64748B]">
              {filters.settlementDate}
              <button onClick={() => onFilterChange({ ...filters, settlementDate: "" })} className="cursor-pointer hover:text-[#EF4444]">x</button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}