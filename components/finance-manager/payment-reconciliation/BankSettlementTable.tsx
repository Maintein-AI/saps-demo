"use client";

import ScopeBadge from "@/components/ScopeBadge";
import { useToast } from "@/components/ToastContext";
import { Payment } from "@/components/finance-manager/payment-reconciliation/types";
import { Zap, Hand, AlertTriangle, Download, FileText, ArrowRight, Search } from "lucide-react";

interface BankSettlementTableProps {
  payments: Payment[];
  onAutoMatch: () => void;
  onManualMatch: (payment: Payment) => void;
  onMarkException: (paymentId: string) => void;
}

function formatPKR(value: number) {
  return `Rs. ${value.toLocaleString("en-PK")}`;
}

const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  Matched: { bg: "#DCFCE7", text: "#16A34A", dot: "#16A34A" },
  Unmatched: { bg: "#FEF3C7", text: "#D97706", dot: "#D97706" },
  Partial: { bg: "#F3E8FF", text: "#7C3AED", dot: "#7C3AED" },
  Excess: { bg: "#DBEAFE", text: "#1B4F8B", dot: "#1B4F8B" },
  Failed: { bg: "#FEE2E2", text: "#DC2626", dot: "#DC2626" },
  "Under Review": { bg: "#F1F5F9", text: "#64748B", dot: "#94A3B8" },
};

export default function BankSettlementTable({
  payments,
  onAutoMatch,
  onManualMatch,
  onMarkException,
}: BankSettlementTableProps) {
  const { addToast } = useToast();

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2.5">
          <h2 className="text-[15px] font-bold text-[#0F172A]">Bank Settlement Queue</h2>
          <ScopeBadge type="inc" />
          <span className="text-[12px] text-[#64748B] ml-1">{payments.length} payments</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onAutoMatch}
            className="h-8 px-3 rounded-lg text-[12px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90 flex items-center gap-2 whitespace-nowrap"
            style={{ backgroundColor: "#0B2545" }}
          >
            <div className="w-4 h-4 flex items-center justify-center">
              <Zap size={14} />
            </div>
            Auto Match
          </button>
          <button
            onClick={() => addToast("Settlement data exported", "success")}
            className="h-8 px-3 rounded-lg border border-[#E2E8F0] text-[12px] font-semibold text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <div className="w-4 h-4 flex items-center justify-center">
              <Download size={14} />
            </div>
            Export
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px]">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
              {["Payment Ref #", "Bank", "Received At", "Payer Name", "Amount PKR", "Linked Invoice", "AWB #", "Status", "Matched By", "Action"].map((h) => (
                <th
                  key={h}
                  className="text-left text-[11px] font-semibold text-[#64748B] uppercase tracking-wider px-4 py-3 whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => {
              const sc = statusConfig[p.status] || statusConfig["Under Review"];
              return (
                <tr key={p.id} className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-4 py-3.5">
                    <span className="text-[13px] font-semibold text-[#0B2545]">{p.refNo}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-[13px] text-[#475569]">{p.bank}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-[13px] text-[#475569]">{p.receivedAt}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-[13px] text-[#475569]">{p.payerName}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-[13px] font-semibold text-[#0F172A]">{formatPKR(p.amount)}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-[13px] font-semibold text-[#0B2545]">{p.invoiceId}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-[13px] text-[#475569]">{p.awb}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full text-[11px] font-semibold whitespace-nowrap"
                      style={{ backgroundColor: sc.bg, color: sc.text }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: sc.dot }} />
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-[13px] text-[#475569]">{p.matchedBy}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1">
                      {(p.status === "Unmatched" || p.status === "Partial" || p.status === "Excess") && (
                        <button
                          onClick={() => onManualMatch(p)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#1B4F8B] cursor-pointer transition-colors"
                          title="Manual Match"
                        >
                          <Hand size={15} />
                        </button>
                      )}
                      <button
                        onClick={() => onMarkException(p.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#DC2626] cursor-pointer transition-colors"
                        title="Mark Exception"
                      >
                        <AlertTriangle size={15} />
                      </button>
                      <button
                        onClick={() => addToast(`Receipt downloaded for ${p.refNo}`, "success")}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#0B2545] cursor-pointer transition-colors"
                        title="Download Receipt"
                      >
                        <Download size={15} />
                      </button>
                      <button
                        onClick={() => addToast(`Audit trail opened for ${p.refNo}`, "success")}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#0B2545] cursor-pointer transition-colors"
                        title="View Audit"
                      >
                        <FileText size={15} />
                      </button>
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