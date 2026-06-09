"use client";

import { useState } from "react";
import ScopeBadge from "@/components/ScopeBadge";
import { ERPMapping } from "@/components/finance-manager/erp-bridge-mapping/types";

const statusMap: Record<string, { color: string; bg: string; border: string }> = {
  "Pending": { color: "#D97706", bg: "#FEF3C7", border: "#FEF3C7" },
  "Success": { color: "#10B981", bg: "#D1FAE5", border: "#D1FAE5" },
  "Failed": { color: "#EF4444", bg: "#FEE2E2", border: "#FEE2E2" },
  "Retrying": { color: "#1B4F8B", bg: "#E0F2FE", border: "#E0F2FE" },
  "Skipped": { color: "#64748B", bg: "#F8FAFC", border: "#E2E8F0" },
};

export default function PostingMappingsTable({
  mappings,
  onEdit,
  onDelete,
  onPush,
  onRetry,
}: {
  mappings: ERPMapping[];
  onEdit: (m: ERPMapping) => void;
  onDelete: (id: string) => void;
  onPush: (m: ERPMapping) => void;
  onRetry: (m: ERPMapping) => void;
}) {
  const [actionMenu, setActionMenu] = useState<string | null>(null);

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
      <div className="p-4 border-b border-[#E2E8F0] flex items-center gap-2">
        <h2 className="text-[16px] font-semibold text-[#0F172A]">ERP Posting Mappings</h2>
        <ScopeBadge type="exc" />
        <span className="text-[12px] text-[#94A3B8] ml-2">{mappings.length} mappings</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
              <th className="px-4 py-3 text-left font-medium text-[#64748B] whitespace-nowrap">Mapping ID</th>
              <th className="px-4 py-3 text-left font-medium text-[#64748B] whitespace-nowrap">Charge Type</th>
              <th className="px-4 py-3 text-left font-medium text-[#64748B] whitespace-nowrap">GL Account</th>
              <th className="px-4 py-3 text-left font-medium text-[#64748B] whitespace-nowrap">Tax Account</th>
              <th className="px-4 py-3 text-left font-medium text-[#64748B] whitespace-nowrap">Cost Center</th>
              <th className="px-4 py-3 text-left font-medium text-[#64748B] whitespace-nowrap">Posting Rule</th>
              <th className="px-4 py-3 text-left font-medium text-[#64748B] whitespace-nowrap">Dr/Cr</th>
              <th className="px-4 py-3 text-left font-medium text-[#64748B] whitespace-nowrap">Sync Status</th>
              <th className="px-4 py-3 text-left font-medium text-[#64748B] whitespace-nowrap">Last Updated</th>
              <th className="px-4 py-3 text-left font-medium text-[#64748B] whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody>
            {mappings.map((m) => {
              const statusStyle = statusMap[m.syncStatus] || statusMap["Pending"];
              return (
                <tr key={m.id} className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-4 py-3">
                    <span className="text-[13px] font-medium text-[#0F172A] font-mono">{m.mappingId}</span>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[#64748B]">{m.chargeType}</td>
                  <td className="px-4 py-3 text-[13px] text-[#64748B] font-mono">{m.glAccount}</td>
                  <td className="px-4 py-3 text-[13px] text-[#64748B] font-mono">{m.taxAccount}</td>
                  <td className="px-4 py-3 text-[13px] text-[#64748B]">{m.costCenter}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0] whitespace-nowrap">{m.postingRule}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap ${m.debitCredit === "Debit" ? "bg-[#FEF3C7] text-[#D97706] border border-[#FEF3C7]" : "bg-[#D1FAE5] text-[#10B981] border border-[#D1FAE5]"}`}>
                      {m.debitCredit}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap" style={{ color: statusStyle.color, backgroundColor: statusStyle.bg, borderColor: statusStyle.border, border: "1px solid" }}>
                      {m.syncStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[#64748B]">{m.lastUpdated}</td>
                  <td className="px-4 py-3">
                    <div className="relative">
                      <button
                        onClick={(e) => { e.stopPropagation(); setActionMenu(actionMenu === m.id ? null : m.id); }}
                        className="w-6 h-6 flex items-center justify-center text-[#64748B] hover:text-[#0F172A] cursor-pointer rounded hover:bg-[#E2E8F0] transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                      </button>
                      {actionMenu === m.id && (
                        <div className="absolute right-0 mt-1 w-44 rounded-xl border border-[#E2E8F0] bg-white shadow-lg z-50 py-1">
                          <button onClick={(e) => { e.stopPropagation(); onEdit(m); setActionMenu(null); }} className="w-full text-left px-3 py-2 text-[12px] text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                            Edit
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); onPush(m); setActionMenu(null); }} className="w-full text-left px-3 py-2 text-[12px] text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                            Push to ERP
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); onRetry(m); setActionMenu(null); }} className="w-full text-left px-3 py-2 text-[12px] text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                            Retry
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); onDelete(m.id); setActionMenu(null); }} className="w-full text-left px-3 py-2 text-[12px] text-[#EF4444] hover:bg-[#FEE2E2] cursor-pointer flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}