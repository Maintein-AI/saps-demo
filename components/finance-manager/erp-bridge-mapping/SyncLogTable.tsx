"use client";

import { useState } from "react";
import { ERPSyncLog } from "@/components/finance-manager/erp-bridge-mapping/types";

const statusMap: Record<string, { color: string; bg: string; border: string }> = {
  "Pending": { color: "#D97706", bg: "#FEF3C7", border: "#FEF3C7" },
  "Success": { color: "#10B981", bg: "#D1FAE5", border: "#D1FAE5" },
  "Failed": { color: "#EF4444", bg: "#FEE2E2", border: "#FEE2E2" },
  "Retrying": { color: "#1B4F8B", bg: "#E0F2FE", border: "#E0F2FE" },
  "Skipped": { color: "#64748B", bg: "#F8FAFC", border: "#E2E8F0" },
};

export default function SyncLogTable({
  logs,
  onViewDetail,
  onViewPayload,
  onRetry,
}: {
  logs: ERPSyncLog[];
  onViewDetail: (l: ERPSyncLog) => void;
  onViewPayload: (l: ERPSyncLog) => void;
  onRetry: (l: ERPSyncLog) => void;
}) {
  const [actionMenu, setActionMenu] = useState<string | null>(null);

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
      <div className="p-4 border-b border-[#E2E8F0] flex items-center gap-2">
        <h2 className="text-[16px] font-semibold text-[#0F172A]">ERP Sync Log</h2>
        <span className="text-[12px] text-[#94A3B8] ml-2">{logs.length} entries</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
              <th className="px-4 py-3 text-left font-medium text-[#64748B] whitespace-nowrap">Sync ID</th>
              <th className="px-4 py-3 text-left font-medium text-[#64748B] whitespace-nowrap">Invoice #</th>
              <th className="px-4 py-3 text-left font-medium text-[#64748B] whitespace-nowrap">Journal Ref</th>
              <th className="px-4 py-3 text-left font-medium text-[#64748B] whitespace-nowrap">ERP Target</th>
              <th className="px-4 py-3 text-left font-medium text-[#64748B] whitespace-nowrap">Amount PKR</th>
              <th className="px-4 py-3 text-left font-medium text-[#64748B] whitespace-nowrap">Status</th>
              <th className="px-4 py-3 text-left font-medium text-[#64748B] whitespace-nowrap">Sent At</th>
              <th className="px-4 py-3 text-left font-medium text-[#64748B] whitespace-nowrap">Response</th>
              <th className="px-4 py-3 text-left font-medium text-[#64748B] whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((l) => {
              const statusStyle = statusMap[l.status] || statusMap["Pending"];
              return (
                <tr key={l.id} className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-4 py-3">
                    <span className="text-[13px] font-medium text-[#0F172A] font-mono">{l.syncId}</span>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[#1B4F8B] font-semibold">{l.invoiceNo}</td>
                  <td className="px-4 py-3 text-[13px] text-[#64748B] font-mono">{l.journalRef}</td>
                  <td className="px-4 py-3 text-[13px] text-[#64748B]">{l.erpTarget}</td>
                  <td className="px-4 py-3">
                    <span className="text-[13px] font-semibold text-[#0F172A]">Rs. {l.amount.toLocaleString()}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap" style={{ color: statusStyle.color, backgroundColor: statusStyle.bg, borderColor: statusStyle.border, border: "1px solid" }}>
                      {l.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[#64748B]">{l.sentAt}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[12px] ${l.status === "Failed" ? "text-[#EF4444]" : "text-[#64748B]"} truncate max-w-[120px] block`} title={l.response}>
                      {l.response || "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="relative">
                      <button
                        onClick={(e) => { e.stopPropagation(); setActionMenu(actionMenu === l.id ? null : l.id); }}
                        className="w-6 h-6 flex items-center justify-center text-[#64748B] hover:text-[#0F172A] cursor-pointer rounded hover:bg-[#E2E8F0] transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                      </button>
                      {actionMenu === l.id && (
                        <div className="absolute right-0 mt-1 w-44 rounded-xl border border-[#E2E8F0] bg-white shadow-lg z-50 py-1">
                          <button onClick={(e) => { e.stopPropagation(); onViewDetail(l); setActionMenu(null); }} className="w-full text-left px-3 py-2 text-[12px] text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                            View Detail
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); onViewPayload(l); setActionMenu(null); }} className="w-full text-left px-3 py-2 text-[12px] text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                            View Payload
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); onRetry(l); setActionMenu(null); }} className="w-full text-left px-3 py-2 text-[12px] text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                            Retry
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