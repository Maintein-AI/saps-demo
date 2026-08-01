"use client";

import { useState } from "react";
import { useToast } from "@/components/ToastContext";
import { Eye, CheckCircle, XCircle, MoreHorizontal } from "lucide-react";

const waivers = [
  { id: "WVR-2026-00112", invoice: "INV-2026-00491", awb: "214-45678901", reason: "Consignee dispute — overcharged handling", amount: 45000, requestedBy: "Sana Khan", status: "Pending", requestedAt: "30 May 2026" },
  { id: "WVR-2026-00113", invoice: "INV-2026-00492", awb: "157-90811223", reason: "Customs delay not caused by SAPS", amount: 28000, requestedBy: "Imran Ali", status: "Under Review", requestedAt: "30 May 2026" },
  { id: "WVR-2026-00114", invoice: "INV-2026-00493", awb: "074-88219033", reason: "Duplicate storage charge applied", amount: 15000, requestedBy: "Ahmed Khan", status: "Pending", requestedAt: "29 May 2026" },
  { id: "WVR-2026-00115", invoice: "INV-2026-00494", awb: "333-77889900", reason: "Cold chain failure — carrier fault", amount: 62000, requestedBy: "Sana Khan", status: "Pending", requestedAt: "29 May 2026" },
  { id: "WVR-2026-00116", invoice: "INV-2026-00495", awb: "999-11223344", reason: "Incorrect tariff class applied", amount: 12000, requestedBy: "Imran Ali", status: "Under Review", requestedAt: "28 May 2026" },
  { id: "WVR-2026-00117", invoice: "INV-2026-00496", awb: "111-55667788", reason: "Waiver for pharma inspection delay", amount: 35000, requestedBy: "Ahmed Khan", status: "Pending", requestedAt: "28 May 2026" },
  { id: "WVR-2026-00118", invoice: "INV-2026-00497", awb: "555-66778899", reason: "Long-stay charge — customs hold", amount: 85000, requestedBy: "Sana Khan", status: "Pending", requestedAt: "27 May 2026" },
];

const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  Pending: { bg: "#FEF3C7", text: "#D97706", dot: "#D97706" },
  "Under Review": { bg: "#DBEAFE", text: "#1B4F8B", dot: "#2E75B6" },
  Approved: { bg: "#DCFCE7", text: "#16A34A", dot: "#16A34A" },
  Rejected: { bg: "#FEE2E2", text: "#DC2626", dot: "#DC2626" },
};

function formatPKR(value: number) {
  return `Rs. ${value.toLocaleString("en-PK")}`;
}

export default function WaiverRequests() {
  const { addToast } = useToast();
  const [actionOpenRow, setActionOpenRow] = useState<number | null>(null);
  const [waiverData, setWaiverData] = useState(waivers);

  const handleApprove = (id: string) => {
    setWaiverData((prev) => prev.map((w) => (w.id === id ? { ...w, status: "Approved" } : w)));
    addToast(`Waiver ${id} approved`, "success");
  };

  const handleReject = (id: string) => {
    setWaiverData((prev) => prev.map((w) => (w.id === id ? { ...w, status: "Rejected" } : w)));
    addToast(`Waiver ${id} rejected`, "success");
  };

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2.5">
          <h2 className="text-[15px] font-bold text-[#0F172A]">Waiver Requests</h2>
          <span className="text-[12px] text-[#64748B] ml-1">{waiverData.filter((w) => w.status === "Pending" || w.status === "Under Review").length} pending</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
              {["Request #", "Invoice #", "AWB #", "Reason", "Amount", "Requested By", "Status", "Action"].map((h) => (
                <th key={h} className="text-left text-[11px] font-semibold text-[#64748B] uppercase tracking-wider px-4 py-3 whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {waiverData.map((w, idx) => {
              const sc = statusConfig[w.status] || statusConfig.Pending;
              return (
                <tr key={w.id} className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-4 py-3.5">
                    <span className="text-[13px] font-semibold text-[#0B2545]">{w.id}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-[13px] text-[#475569]">{w.invoice}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-[13px] text-[#475569]">{w.awb}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-[13px] text-[#475569] max-w-[200px] block truncate" title={w.reason}>{w.reason}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-[13px] font-semibold text-[#0F172A]">{formatPKR(w.amount)}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-[13px] text-[#475569]">{w.requestedBy}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full text-[11px] font-semibold whitespace-nowrap" style={{ backgroundColor: sc.bg, color: sc.text }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: sc.dot }} />
                      {w.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 relative">
                    <div className="flex items-center gap-1">
                      <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#0B2545] cursor-pointer transition-colors" title="View">
                        <Eye size={15} />
                      </button>
                      {(w.status === "Pending" || w.status === "Under Review") && (
                        <>
                          <button
                            onClick={() => handleApprove(w.id)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#16A34A] cursor-pointer transition-colors"
                            title="Approve"
                          >
                            <CheckCircle size={15} />
                          </button>
                          <button
                            onClick={() => handleReject(w.id)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#DC2626] cursor-pointer transition-colors"
                            title="Reject"
                          >
                            <XCircle size={15} />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => setActionOpenRow(actionOpenRow === idx ? null : idx)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#0B2545] cursor-pointer transition-colors"
                      >
                        <MoreHorizontal size={15} />
                      </button>
                    </div>
                    {actionOpenRow === idx && (
                      <div className="absolute right-4 top-12 z-10 w-[160px] bg-white rounded-xl shadow-lg border border-[#E2E8F0] overflow-hidden">
                        <button className="w-full text-left px-3 py-2 text-[13px] text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer flex items-center gap-2">
                          <Eye size={14} className="text-[#64748B]" /> View Detail
                        </button>
                        <button className="w-full text-left px-3 py-2 text-[13px] text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer flex items-center gap-2">
                          <CheckCircle size={14} className="text-[#64748B]" /> View Invoice
                        </button>
                      </div>
                    )}
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