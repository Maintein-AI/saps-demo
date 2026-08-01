"use client";
import { WaiverRequest } from "@/app/finance-manager/waiver-workflow/page";
import { CheckCircle, XCircle, HelpCircle, FileText, Eye } from "lucide-react";

interface ApproverPanelProps {
  waiver: WaiverRequest;
  approvalNotes: string;
  onNotesChange: (v: string) => void;
  approvedAmount: string;
  onAmountChange: (v: string) => void;
  onApprove: () => void;
  onReject: () => void;
  onClarification: () => void;
}

function formatPKR(value: number) {
  return `Rs. ${value.toLocaleString("en-PK")}`;
}

export default function ApproverPanel({
  waiver,
  approvalNotes,
  onNotesChange,
  approvedAmount,
  onAmountChange,
  onApprove,
  onReject,
  onClarification,
}: ApproverPanelProps) {
  const isPending = waiver.status === "Pending";
  const isClarification = waiver.status === "Clarification";

  const statusConfig: Record<string, { bg: string; text: string }> = {
    Pending: { bg: "#FEF3C7", text: "#D97706" },
    Approved: { bg: "#DCFCE7", text: "#16A34A" },
    Rejected: { bg: "#FEE2E2", text: "#DC2626" },
    Clarification: { bg: "#DBEAFE", text: "#1B4F8B" },
  };
  const sc = statusConfig[waiver.status] || statusConfig.Pending;

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2.5">
          <h2 className="text-[15px] font-bold text-[#0F172A]">Finance Head Approval</h2>
        </div>
        <span
          className="inline-flex items-center h-6 px-2.5 rounded-full text-[11px] font-semibold"
          style={{ backgroundColor: sc.bg, color: sc.text }}
        >
          {waiver.status}
        </span>
      </div>
      <div className="p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div>
            <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
              Approver
            </label>
            <div className="text-[13px] font-medium text-[#0F172A]">
              {waiver.approver || "Awaiting assignment"}
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
              Approval Status
            </label>
            <div className="text-[13px] font-medium text-[#0F172A]">
              {waiver.approvalStatus || "Not reviewed"}
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
              Approved Waiver Amount
            </label>
            <div className="text-[13px] font-semibold text-[#0F172A]">
              {waiver.approvedAmount !== undefined
                ? formatPKR(waiver.approvedAmount)
                : "Not set"}
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
              Credit Note #
            </label>
            <div className="text-[13px] font-medium text-[#0F172A]">
              {waiver.creditNoteId || "Pending"}
            </div>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
              Approval Timestamp
            </label>
            <div className="text-[13px] font-medium text-[#0F172A]">
              {waiver.approvalTimestamp || "Not yet approved"}
            </div>
          </div>
        </div>

        {/* Approval notes input */}
        {(isPending || isClarification) && (
          <div className="mb-4">
            <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
              Approval Notes
            </label>
            <textarea
              value={approvalNotes}
              onChange={(e) => onNotesChange(e.target.value)}
              maxLength={500}
              placeholder="Enter approval notes..."
              className="w-full h-24 px-3 py-2 rounded-xl border border-[#E2E8F0] bg-white text-[13px] text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#1B4F8B] focus:ring-1 focus:ring-[#1B4F8B]/20 transition-all resize-none"
            />
            <div className="text-[11px] text-[#94A3B8] mt-1 text-right">
              {approvalNotes.length}/500
            </div>
          </div>
        )}

        {/* Approved amount input */}
        {(isPending || isClarification) && (
          <div className="mb-5">
            <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
              Approved Waiver Amount (PKR)
            </label>
            <input
              type="number"
              value={approvedAmount}
              onChange={(e) => onAmountChange(e.target.value)}
              placeholder="Enter approved amount"
              className="w-full h-10 px-3 rounded-xl border border-[#E2E8F0] bg-white text-[13px] text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#1B4F8B] focus:ring-1 focus:ring-[#1B4F8B]/20 transition-all"
            />
          </div>
        )}

        {/* Existing approval notes when not editable */}
        {!isPending && !isClarification && waiver.approvalNotes && (
          <div className="mb-5">
            <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
              Approval Notes
            </label>
            <div className="text-[13px] font-medium text-[#0F172A] leading-relaxed bg-[#F8FAFC] rounded-lg p-3">
              {waiver.approvalNotes}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onApprove}
            disabled={!isPending && !isClarification}
            className="h-9 px-4 rounded-xl text-[13px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90 flex items-center gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: "#16A34A" }}
          >
            <div className="w-4 h-4 flex items-center justify-center">
              <CheckCircle size={14} />
            </div>
            Approve
          </button>
          <button
            onClick={onReject}
            disabled={!isPending && !isClarification}
            className="h-9 px-4 rounded-xl text-[13px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90 flex items-center gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: "#DC2626" }}
          >
            <div className="w-4 h-4 flex items-center justify-center">
              <XCircle size={14} />
            </div>
            Reject
          </button>
          <button
            onClick={onClarification}
            disabled={!isPending && !isClarification}
            className="h-9 px-4 rounded-xl border border-[#E2E8F0] text-[13px] font-semibold text-[#1B4F8B] hover:bg-[#DBEAFE] cursor-pointer transition-colors flex items-center gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="w-4 h-4 flex items-center justify-center">
              <HelpCircle size={14} />
            </div>
            Request Clarification
          </button>
          <button className="h-9 px-3 rounded-xl border border-[#E2E8F0] text-[13px] font-semibold text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer transition-colors flex items-center gap-2 whitespace-nowrap">
            <div className="w-4 h-4 flex items-center justify-center">
              <Eye size={14} />
            </div>
            View Invoice
          </button>
          <button className="h-9 px-3 rounded-xl border border-[#E2E8F0] text-[13px] font-semibold text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer transition-colors flex items-center gap-2 whitespace-nowrap">
            <div className="w-4 h-4 flex items-center justify-center">
              <FileText size={14} />
            </div>
            View Document
          </button>
        </div>
      </div>
    </div>
  );
}