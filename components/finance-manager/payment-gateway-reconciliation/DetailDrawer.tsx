"use client";
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

export default function DetailDrawer({
  isOpen,
  onClose,
  transaction,
  onRecheck,
  onSettlement,
  onRefund,
  onReceipt,
}: {
  isOpen: boolean;
  onClose: () => void;
  transaction: GatewayTransaction | null;
  onRecheck: (t: GatewayTransaction) => void;
  onSettlement: (t: GatewayTransaction) => void;
  onRefund: (t: GatewayTransaction) => void;
  onReceipt: (t: GatewayTransaction) => void;
}) {
  return (
    <div className={`fixed inset-0 z-50 transition-all duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className={`absolute right-0 top-0 h-full w-full max-w-[480px] bg-white shadow-2xl transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"} overflow-y-auto`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <h2 className="text-[18px] font-bold text-[#0F172A]">Gateway Transaction Detail</h2>
            </div>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center text-[#64748B] hover:text-[#0F172A] cursor-pointer rounded-lg hover:bg-[#F8FAFC] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
          {transaction ? (
            <div className="flex flex-col gap-5">
              <div className="rounded-[16px] border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] font-medium text-[#64748B]">Gateway Txn ID</span>
                    <span className="text-[13px] font-semibold text-[#0F172A] font-mono">{transaction.gatewayTxnId}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] font-medium text-[#64748B]">Provider</span>
                    <span className="text-[13px] font-semibold text-[#0F172A]">{transaction.provider}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] font-medium text-[#64748B]">Invoice #</span>
                    <span className="text-[13px] text-[#1B4F8B] font-semibold">{transaction.invoiceNo}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] font-medium text-[#64748B]">Linked AWB</span>
                    <span className="text-[13px] text-[#0F172A]">{transaction.awbNo}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] font-medium text-[#64748B]">Amount</span>
                    <span className="text-[13px] font-semibold text-[#0F172A]">Rs. {transaction.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] font-medium text-[#64748B]">Convenience Fee %</span>
                    <span className="text-[13px] text-[#0F172A]">{transaction.convenienceFee}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] font-medium text-[#64748B]">Pass-through to payer</span>
                    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap">
                      {transaction.passThrough ? (
                        <span className="bg-[#D1FAE5] text-[#10B981] border border-[#D1FAE5] px-2 py-0.5 rounded-full">Yes</span>
                      ) : (
                        <span className="bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0] px-2 py-0.5 rounded-full">No</span>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] font-medium text-[#64748B]">Payer Name</span>
                    <span className="text-[13px] text-[#0F172A]">{transaction.payer}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] font-medium text-[#64748B]">Payer Mobile</span>
                    <span className="text-[13px] text-[#0F172A]">{transaction.payerMobile}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] font-medium text-[#64748B]">Payer Email</span>
                    <span className="text-[13px] text-[#0F172A]">{transaction.payerEmail}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] font-medium text-[#64748B]">Status</span>
                    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap" style={{ color: statusMap[transaction.status]?.color || "#64748B", backgroundColor: statusMap[transaction.status]?.bg || "#F8FAFC", borderColor: statusMap[transaction.status]?.border || "#E2E8F0", border: "1px solid" }}>
                      {transaction.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] font-medium text-[#64748B]">Webhook URL</span>
                    <span className="text-[13px] text-[#1B4F8B] truncate max-w-[200px]" title={transaction.webhookUrl}>{transaction.webhookUrl}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] font-medium text-[#64748B]">Settled At</span>
                    <span className="text-[13px] text-[#0F172A]">{transaction.settledAt || "—"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] font-medium text-[#64748B]">Refund Status</span>
                    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap" style={{ color: refundStatusMap[transaction.refundStatus]?.color || "#64748B", backgroundColor: refundStatusMap[transaction.refundStatus]?.bg || "#F8FAFC", borderColor: refundStatusMap[transaction.refundStatus]?.border || "#E2E8F0", border: "1px solid" }}>
                      {transaction.refundStatus}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[12px] font-medium text-[#64748B] mb-1 block">Webhook Payload Preview</label>
                <div className="rounded-[12px] border border-[#E2E8F0] bg-[#F8FAFC] p-3 text-[12px] text-[#0F172A] font-mono whitespace-pre-wrap overflow-x-auto max-h-[160px] overflow-y-auto">
                  {transaction.webhookPayload || "No payload recorded."}
                </div>
              </div>

              {transaction.errorMessage && (
                <div>
                  <label className="text-[12px] font-medium text-[#64748B] mb-1 block">Error Message</label>
                  <div className="rounded-[12px] border border-[#EF4444]/20 bg-[#FEE2E2]/50 p-3 text-[12px] text-[#EF4444]">
                    {transaction.errorMessage}
                  </div>
                </div>
              )}

              <div>
                <label className="text-[12px] font-medium text-[#64748B] mb-1 block">Audit Trail</label>
                <div className="rounded-[12px] border border-[#E2E8F0] bg-[#F8FAFC] p-3 text-[12px] text-[#0F172A] whitespace-pre-wrap">
                  {transaction.auditTrail || "No audit trail recorded."}
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap pt-2">
                <button onClick={() => { onRecheck(transaction); onClose(); }} className="h-9 px-4 rounded-xl text-[13px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90 whitespace-nowrap" style={{ backgroundColor: "#0B2545" }}>
                  Recheck Status
                </button>
                <button onClick={() => { onSettlement(transaction); onClose(); }} className="h-9 px-3 rounded-xl border border-[#E2E8F0] text-[13px] font-semibold text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer transition-colors whitespace-nowrap">
                  Mark Settlement
                </button>
                <button onClick={() => { onRefund(transaction); onClose(); }} className="h-9 px-3 rounded-xl border border-[#E2E8F0] text-[13px] font-semibold text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer transition-colors whitespace-nowrap">
                  Initiate Refund
                </button>
                <button onClick={() => { onReceipt(transaction); onClose(); }} className="h-9 px-3 rounded-xl border border-[#E2E8F0] text-[13px] font-semibold text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer transition-colors whitespace-nowrap">
                  Download Receipt
                </button>
                <button onClick={onClose} className="h-9 px-3 rounded-xl border border-[#E2E8F0] text-[13px] font-semibold text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer transition-colors whitespace-nowrap">
                  Close
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-[13px] text-[#64748B]">
              Select a transaction to view detail.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}