"use client";

import ScopeBadge from "@/components/ScopeBadge";
import { MultiTariffSet } from "@/components/finance-manager/multi-tariff-engine/types";

export default function ApprovalDrawer({
  isOpen,
  onClose,
  tariffSet,
}: {
  isOpen: boolean;
  onClose: () => void;
  tariffSet: MultiTariffSet | null;
}) {
  return (
    <div
      className={`fixed inset-0 z-50 transition-all duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
    >
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div
        className={`absolute right-0 top-0 h-full w-full max-w-[420px] bg-white shadow-2xl transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"} overflow-y-auto`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <h2 className="text-[18px] font-bold text-[#0F172A]">Multi-Tariff Approval</h2>
              <ScopeBadge type="exc" />
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center text-[#64748B] hover:text-[#0F172A] cursor-pointer rounded-lg hover:bg-[#F8FAFC] transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
          {tariffSet ? (
            <div className="flex flex-col gap-5">
              <div className="rounded-[16px] border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] font-medium text-[#64748B]">Tariff Set</span>
                    <span className="text-[13px] font-semibold text-[#0F172A]">{tariffSet.tariffSetName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] font-medium text-[#64748B]">Requested By</span>
                    <span className="text-[13px] text-[#0F172A]">{tariffSet.requestedBy || "—"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] font-medium text-[#64748B]">Approval Required</span>
                    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap">
                      {tariffSet.approvalRequired ? (
                        <span className="bg-[#FEF3C7] text-[#D97706] border border-[#FEF3C7] px-2 py-0.5 rounded-full">Yes</span>
                      ) : (
                        <span className="bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0] px-2 py-0.5 rounded-full">No</span>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] font-medium text-[#64748B]">Approver</span>
                    <span className="text-[13px] text-[#0F172A]">{tariffSet.approver || "—"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] font-medium text-[#64748B]">Approval Status</span>
                    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap">
                      {tariffSet.approvalStatus === "Approved" && (
                        <span className="bg-[#D1FAE5] text-[#10B981] border border-[#D1FAE5] px-2 py-0.5 rounded-full">Approved</span>
                      )}
                      {tariffSet.approvalStatus === "Pending" && (
                        <span className="bg-[#FEF3C7] text-[#D97706] border border-[#FEF3C7] px-2 py-0.5 rounded-full">Pending</span>
                      )}
                      {tariffSet.approvalStatus === "Under Review" && (
                        <span className="bg-[#E0F2FE] text-[#1B4F8B] border border-[#E0F2FE] px-2 py-0.5 rounded-full">Under Review</span>
                      )}
                      {tariffSet.approvalStatus === "Auto-approved" && (
                        <span className="bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0] px-2 py-0.5 rounded-full">Auto-approved</span>
                      )}
                      {(!tariffSet.approvalStatus || tariffSet.approvalStatus === "") && (
                        <span className="bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0] px-2 py-0.5 rounded-full">—</span>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] font-medium text-[#64748B]">Approved At</span>
                    <span className="text-[13px] text-[#0F172A]">{tariffSet.approvedAt || "—"}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[12px] font-medium text-[#64748B] mb-1 block">Approval Notes</label>
                <div className="rounded-[12px] border border-[#E2E8F0] bg-[#F8FAFC] p-3 text-[13px] text-[#0F172A] min-h-[80px]">
                  {tariffSet.approvalNotes || "No approval notes recorded."}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => onClose()}
                  className="h-9 px-4 rounded-xl text-[13px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90 whitespace-nowrap"
                  style={{ backgroundColor: "#0B2545" }}
                >
                  Approve
                </button>
                <button
                  onClick={() => onClose()}
                  className="h-9 px-3 rounded-xl border border-[#E2E8F0] text-[13px] font-semibold text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer transition-colors whitespace-nowrap"
                >
                  Reject
                </button>
                <button
                  onClick={() => onClose()}
                  className="h-9 px-3 rounded-xl border border-[#E2E8F0] text-[13px] font-semibold text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer transition-colors whitespace-nowrap"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-[13px] text-[#64748B]">
              Select a tariff set to view approval details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}