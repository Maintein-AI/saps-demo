"use client";

import { useState } from "react";
import ScopeBadge from "@/components/ScopeBadge";
import { MultiTariffSet } from "@/components/finance-manager/multi-tariff-engine/types";

const statusMap: Record<string, { color: string; bg: string; border: string }> = {
  "Draft": { color: "#64748B", bg: "#F8FAFC", border: "#E2E8F0" },
  "Pending": { color: "#D97706", bg: "#FEF3C7", border: "#FEF3C7" },
  "Under Review": { color: "#1B4F8B", bg: "#E0F2FE", border: "#E0F2FE" },
  "Active": { color: "#10B981", bg: "#D1FAE5", border: "#D1FAE5" },
  "Retired": { color: "#EF4444", bg: "#FEE2E2", border: "#FEE2E2" },
};

export default function MultiTariffMatrixTable({
  sets,
  onEdit,
  onClone,
  onRetire,
  onSubmitApproval,
  onViewApproval,
}: {
  sets: MultiTariffSet[];
  onEdit: (s: MultiTariffSet) => void;
  onClone: (s: MultiTariffSet) => void;
  onRetire: (id: string) => void;
  onSubmitApproval: (s: MultiTariffSet) => void;
  onViewApproval: (s: MultiTariffSet) => void;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [actionMenu, setActionMenu] = useState<string | null>(null);

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
      <div className="p-4 border-b border-[#E2E8F0] flex items-center gap-2">
        <h2 className="text-[16px] font-semibold text-[#0F172A]">Multi-Tariff Matrix</h2>
        <ScopeBadge type="exc" />
        <span className="text-[12px] text-[#94A3B8] ml-2">{sets.length} sets</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
              <th className="px-4 py-3 text-left font-medium text-[#64748B] whitespace-nowrap">Tariff Set</th>
              <th className="px-4 py-3 text-left font-medium text-[#64748B] whitespace-nowrap">Agent Contract</th>
              <th className="px-4 py-3 text-left font-medium text-[#64748B] whitespace-nowrap">Tier</th>
              <th className="px-4 py-3 text-left font-medium text-[#64748B] whitespace-nowrap">Route</th>
              <th className="px-4 py-3 text-left font-medium text-[#64748B] whitespace-nowrap">Cargo</th>
              <th className="px-4 py-3 text-left font-medium text-[#64748B] whitespace-nowrap">Handling</th>
              <th className="px-4 py-3 text-left font-medium text-[#64748B] whitespace-nowrap">Rate</th>
              <th className="px-4 py-3 text-left font-medium text-[#64748B] whitespace-nowrap">Approval</th>
              <th className="px-4 py-3 text-left font-medium text-[#64748B] whitespace-nowrap">Effective</th>
              <th className="px-4 py-3 text-left font-medium text-[#64748B] whitespace-nowrap">Status</th>
              <th className="px-4 py-3 text-left font-medium text-[#64748B] whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody>
            {sets.map((set) => {
              const statusStyle = statusMap[set.status] || statusMap["Draft"];
              return (
                <>
                  <tr
                    key={set.id}
                    className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                    onClick={() => setExpandedId(expandedId === set.id ? null : set.id)}
                  >
                    <td className="px-4 py-3">
                      <span className="text-[13px] font-medium text-[#0F172A]">{set.tariffSetName}</span>
                    </td>
                    <td className="px-4 py-3 text-[13px] text-[#64748B]">{set.agentContract}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0] whitespace-nowrap">
                        {set.consigneeTier}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[13px] text-[#64748B]">{set.route}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0] whitespace-nowrap">
                        {set.cargoClass}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[13px] text-[#64748B]">{set.specialHandling}</td>
                    <td className="px-4 py-3">
                      <span className="text-[13px] font-semibold text-[#0F172A]">{set.rateOverride}%</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap ${set.approvalRequired ? "bg-[#FEF3C7] text-[#D97706] border border-[#FEF3C7]" : "bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0]"}`}>
                        {set.approvalRequired ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[13px] text-[#64748B]">{set.effectiveDate}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap" style={{ color: statusStyle.color, backgroundColor: statusStyle.bg, borderColor: statusStyle.border, border: "1px solid" }}>
                        {set.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActionMenu(actionMenu === set.id ? null : set.id);
                          }}
                          className="w-6 h-6 flex items-center justify-center text-[#64748B] hover:text-[#0F172A] cursor-pointer rounded hover:bg-[#E2E8F0] transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                        </button>
                        {actionMenu === set.id && (
                          <div className="absolute right-0 mt-1 w-44 rounded-xl border border-[#E2E8F0] bg-white shadow-lg z-50 py-1">
                            <button onClick={(e) => { e.stopPropagation(); onEdit(set); setActionMenu(null); }} className="w-full text-left px-3 py-2 text-[12px] text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer flex items-center gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                              Edit
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); onClone(set); setActionMenu(null); }} className="w-full text-left px-3 py-2 text-[12px] text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer flex items-center gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="13" height="13" x="9" y="9" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                              Clone
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); onSubmitApproval(set); setActionMenu(null); }} className="w-full text-left px-3 py-2 text-[12px] text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer flex items-center gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                              Submit Approval
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); onRetire(set.id); setActionMenu(null); }} className="w-full text-left px-3 py-2 text-[12px] text-[#EF4444] hover:bg-[#FEE2E2] cursor-pointer flex items-center gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                              Retire
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); onViewApproval(set); setActionMenu(null); }} className="w-full text-left px-3 py-2 text-[12px] text-[#1B4F8B] hover:bg-[#F8FAFC] cursor-pointer flex items-center gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                              View Audit
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                  {expandedId === set.id && (
                    <tr>
                      <td colSpan={11} className="px-4 py-3 bg-[#F8FAFC] border-b border-[#E2E8F0]">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-[12px] text-[#64748B]">
                          <div><span className="font-medium text-[#0F172A]">Special Handling:</span> {set.specialHandling}</div>
                          <div><span className="font-medium text-[#0F172A]">Rate Override:</span> {set.rateOverride}%</div>
                          <div><span className="font-medium text-[#0F172A]">Approval Required:</span> {set.approvalRequired ? "Yes" : "No"}</div>
                          <div><span className="font-medium text-[#0F172A]">Requested By:</span> {set.requestedBy || "—"}</div>
                          <div><span className="font-medium text-[#0F172A]">Approver:</span> {set.approver || "—"}</div>
                          <div><span className="font-medium text-[#0F172A]">Approval Status:</span> {set.approvalStatus || "—"}</div>
                          <div className="sm:col-span-2 lg:col-span-3"><span className="font-medium text-[#0F172A]">Notes:</span> {set.notes || "—"}</div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}