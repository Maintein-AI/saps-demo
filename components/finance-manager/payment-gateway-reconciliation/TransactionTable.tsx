"use client";

import { useState } from "react";
import { GatewayTransaction } from "@/components/finance-manager/payment-gateway-reconciliation/types";

const statusMap: Record<string, { color: string; bg: string; border: string }> = {
  "Pending": { color: "#D97706", bg: "#FEF3C7", border: "#FEF3C7" },
  "Success": { color: "#10B981", bg: "#D1FAE5", border: "#D1FAE5" },
  "Failed": { color: "#EF4444", bg: "#FEE2E2", border: "#FEE2E2" },
  "Refunded": { color: "#1B4F8B", bg: "#E0F2FE", border: "#E0F2FE" },
};

const refundStatusMap: Record<string, { color: string; bg: string; border: string }> = {
  "None": { color: "#64748B", bg: "#F8FAFC", border: "#E2E8F0" },
  "Pending": { color: "#D97706", bg: "#FEF3C7", border: "#FEF3C7" },
  "Completed": { color: "#10B981", bg: "#D1FAE5", border: "#D1FAE5" },
  "Rejected": { color: "#EF4444", bg: "#FEE2E2", border: "#FEE2E2" },
};

export default function TransactionTable({
  transactions,
  onViewDetail,
  onRecheck,
  onMatchInvoice,
  onSettlement,
  onRefund,
  onReceipt,
}: {
  transactions: GatewayTransaction[];
  onViewDetail: (t: GatewayTransaction) => void;
  onRecheck: (t: GatewayTransaction) => void;
  onMatchInvoice: (t: GatewayTransaction) => void;
  onSettlement: (t: GatewayTransaction) => void;
  onRefund: (t: GatewayTransaction) => void;
  onReceipt: (t: GatewayTransaction) => void;
}) {
  const [actionMenu, setActionMenu] = useState<string | null>(null);

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
      <div className="p-4 border-b border-[#E2E8F0] flex items-center gap-2">
        <h2 className="text-[16px] font-semibold text-[#0F172A]">Gateway Transactions</h2>
        <span className="text-[12px] text-[#94A3B8] ml-2">{transactions.length} transactions</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
              <th className="px-4 py-3 text-left font-medium text-[#64748B] whitespace-nowrap">Gateway Txn ID</th>
              <th className="px-4 py-3 text-left font-medium text-[#64748B] whitespace-nowrap">Provider</th>
              <th className="px-4 py-3 text-left font-medium text-[#64748B] whitespace-nowrap">Invoice #</th>
              <th className="px-4 py-3 text-left font-medium text-[#64748B] whitespace-nowrap">AWB #</th>
              <th className="px-4 py-3 text-left font-medium text-[#64748B] whitespace-nowrap">Payer</th>
              <th className="px-4 py-3 text-left font-medium text-[#64748B] whitespace-nowrap">Amount PKR</th>
              <th className="px-4 py-3 text-left font-medium text-[#64748B] whitespace-nowrap">Status</th>
              <th className="px-4 py-3 text-left font-medium text-[#64748B] whitespace-nowrap">Webhook Time</th>
              <th className="px-4 py-3 text-left font-medium text-[#64748B] whitespace-nowrap">Settled At</th>
              <th className="px-4 py-3 text-left font-medium text-[#64748B] whitespace-nowrap">Refund Status</th>
              <th className="px-4 py-3 text-left font-medium text-[#64748B] whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => {
              const statusStyle = statusMap[t.status] || statusMap["Pending"];
              const refundStyle = refundStatusMap[t.refundStatus] || refundStatusMap["None"];
              return (
                <tr key={t.id} className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-4 py-3">
                    <span className="text-[13px] font-medium text-[#1B4F8B] cursor-pointer hover:underline" onClick={() => onViewDetail(t)}>
                      {t.gatewayTxnId}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[#64748B]">{t.provider}</td>
                  <td className="px-4 py-3 text-[13px] text-[#64748B]">{t.invoiceNo}</td>
                  <td className="px-4 py-3 text-[13px] text-[#64748B]">{t.awbNo}</td>
                  <td className="px-4 py-3 text-[13px] text-[#64748B]">{t.payer}</td>
                  <td className="px-4 py-3">
                    <span className="text-[13px] font-semibold text-[#0F172A]">Rs. {t.amount.toLocaleString()}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap" style={{ color: statusStyle.color, backgroundColor: statusStyle.bg, borderColor: statusStyle.border, border: "1px solid" }}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[#64748B]">{t.webhookTime}</td>
                  <td className="px-4 py-3 text-[13px] text-[#64748B]">{t.settledAt || "—"}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap" style={{ color: refundStyle.color, backgroundColor: refundStyle.bg, borderColor: refundStyle.border, border: "1px solid" }}>
                      {t.refundStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="relative">
                      <button
                        onClick={(e) => { e.stopPropagation(); setActionMenu(actionMenu === t.id ? null : t.id); }}
                        className="w-6 h-6 flex items-center justify-center text-[#64748B] hover:text-[#0F172A] cursor-pointer rounded hover:bg-[#E2E8F0] transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                      </button>
                      {actionMenu === t.id && (
                        <div className="absolute right-0 mt-1 w-48 rounded-xl border border-[#E2E8F0] bg-white shadow-lg z-50 py-1">
                          <button onClick={(e) => { e.stopPropagation(); onViewDetail(t); setActionMenu(null); }} className="w-full text-left px-3 py-2 text-[12px] text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                            View Detail
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); onRecheck(t); setActionMenu(null); }} className="w-full text-left px-3 py-2 text-[12px] text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                            Recheck Status
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); onMatchInvoice(t); setActionMenu(null); }} className="w-full text-left px-3 py-2 text-[12px] text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                            Match to Invoice
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); onSettlement(t); setActionMenu(null); }} className="w-full text-left px-3 py-2 text-[12px] text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                            Mark Settlement
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); onRefund(t); setActionMenu(null); }} className="w-full text-left px-3 py-2 text-[12px] text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11"/></svg>
                            Initiate Refund
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); onReceipt(t); setActionMenu(null); }} className="w-full text-left px-3 py-2 text-[12px] text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                            Download Receipt
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); setActionMenu(null); }} className="w-full text-left px-3 py-2 text-[12px] text-[#1B4F8B] hover:bg-[#F8FAFC] cursor-pointer flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                            Export Gateway File
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