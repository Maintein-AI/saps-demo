"use client";

import ScopeBadge from "@/components/ScopeBadge";
import { ERPSyncLog } from "@/components/finance-manager/erp-bridge-mapping/types";

export default function DetailDrawer({
  isOpen,
  onClose,
  log,
}: {
  isOpen: boolean;
  onClose: () => void;
  log: ERPSyncLog | null;
}) {
  return (
    <div className={`fixed inset-0 z-50 transition-all duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className={`absolute right-0 top-0 h-full w-full max-w-[480px] bg-white shadow-2xl transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"} overflow-y-auto`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <h2 className="text-[18px] font-bold text-[#0F172A]">ERP Journal Detail</h2>
              <ScopeBadge type="exc" />
            </div>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center text-[#64748B] hover:text-[#0F172A] cursor-pointer rounded-lg hover:bg-[#F8FAFC] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
          {log ? (
            <div className="flex flex-col gap-5">
              <div className="rounded-[16px] border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] font-medium text-[#64748B]">Invoice #</span>
                    <span className="text-[13px] font-semibold text-[#1B4F8B]">{log.invoiceNo}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] font-medium text-[#64748B]">AWB #</span>
                    <span className="text-[13px] text-[#0F172A]">{log.awbNo}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] font-medium text-[#64748B]">Charge Type</span>
                    <span className="text-[13px] text-[#0F172A]">{log.chargeType}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] font-medium text-[#64748B]">Amount</span>
                    <span className="text-[13px] font-semibold text-[#0F172A]">Rs. {log.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] font-medium text-[#64748B]">Tax</span>
                    <span className="text-[13px] text-[#0F172A]">Rs. {log.tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] font-medium text-[#64748B]">GL Account</span>
                    <span className="text-[13px] text-[#0F172A] font-mono">{log.glAccount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] font-medium text-[#64748B]">Cost Center</span>
                    <span className="text-[13px] text-[#0F172A]">{log.costCenter}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] font-medium text-[#64748B]">Journal Ref</span>
                    <span className="text-[13px] text-[#0F172A] font-mono">{log.journalRef}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] font-medium text-[#64748B]">ERP Target</span>
                    <span className="text-[13px] text-[#0F172A]">{log.erpTarget}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] font-medium text-[#64748B]">Sent At</span>
                    <span className="text-[13px] text-[#0F172A]">{log.sentAt}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[12px] font-medium text-[#64748B] mb-1 block">Payload Preview</label>
                <div className="rounded-[12px] border border-[#E2E8F0] bg-[#F8FAFC] p-3 text-[12px] text-[#0F172A] font-mono whitespace-pre-wrap overflow-x-auto max-h-[160px] overflow-y-auto">
                  {log.payload || "No payload recorded."}
                </div>
              </div>

              <div>
                <label className="text-[12px] font-medium text-[#64748B] mb-1 block">ERP Response</label>
                <div className={`rounded-[12px] border p-3 text-[12px] ${log.status === "Failed" ? "border-[#EF4444]/20 bg-[#FEE2E2]/50 text-[#EF4444]" : "border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A]"} font-mono whitespace-pre-wrap overflow-x-auto max-h-[120px] overflow-y-auto`}>
                  {log.response || "No response recorded."}
                </div>
              </div>

              <div>
                <label className="text-[12px] font-medium text-[#64748B] mb-1 block">Audit Trail</label>
                <div className="rounded-[12px] border border-[#E2E8F0] bg-[#F8FAFC] p-3 text-[12px] text-[#0F172A] whitespace-pre-wrap">
                  {log.auditTrail || "No audit trail recorded."}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button onClick={onClose} className="h-9 px-4 rounded-xl text-[13px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90 whitespace-nowrap" style={{ backgroundColor: "#0B2545" }}>
                  Retry Push
                </button>
                <button onClick={onClose} className="h-9 px-3 rounded-xl border border-[#E2E8F0] text-[13px] font-semibold text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer transition-colors whitespace-nowrap">
                  Close
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-[13px] text-[#64748B]">
              Select a sync log entry to view detail.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}