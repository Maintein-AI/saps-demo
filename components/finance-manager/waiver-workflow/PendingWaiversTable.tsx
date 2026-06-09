"use client";

import ScopeBadge from "@/components/ScopeBadge";
import { useToast } from "@/components/ToastContext";
import { WaiverRequest } from "@/app/finance-manager/waiver-workflow/page";
import { Eye, ChevronRight } from "lucide-react";

interface PendingWaiversTableProps {
  waivers: WaiverRequest[];
  selectedId: string;
  onSelect: (waiver: WaiverRequest) => void;
}

function formatPKR(value: number) {
  return `Rs. ${value.toLocaleString("en-PK")}`;
}

const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  Pending: { bg: "#FEF3C7", text: "#D97706", dot: "#D97706" },
  Approved: { bg: "#DCFCE7", text: "#16A34A", dot: "#16A34A" },
  Rejected: { bg: "#FEE2E2", text: "#DC2626", dot: "#DC2626" },
  Clarification: { bg: "#DBEAFE", text: "#1B4F8B", dot: "#1B4F8B" },
};

export default function PendingWaiversTable({
  waivers,
  selectedId,
  onSelect,
}: PendingWaiversTableProps) {
  const { addToast } = useToast();

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2.5">
          <h2 className="text-[15px] font-bold text-[#0F172A]">Waiver Requests</h2>
          <ScopeBadge type="inc" />
          <span className="text-[12px] text-[#64748B] ml-1">
            {waivers.length} requests
          </span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px]">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
              {[
                "Request #",
                "Invoice #",
                "AWB #",
                "Consignee",
                "Reason",
                "Requested Amount",
                "Requested By",
                "Status",
                "Age",
                "Action",
              ].map((h) => (
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
            {waivers.map((w) => {
              const sc = statusConfig[w.status] || statusConfig.Pending;
              const isSelected = w.id === selectedId;
              return (
                <tr
                  key={w.id}
                  className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                  onClick={() => onSelect(w)}
                  style={{
                    backgroundColor: isSelected ? "#EBF0F7" : undefined,
                  }}
                >
                  <td className="px-4 py-3.5">
                    <span className="text-[13px] font-semibold text-[#0B2545]">
                      {w.id}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-[13px] text-[#475569]">
                      {w.invoiceId}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-[13px] text-[#475569]">{w.awb}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-[13px] text-[#475569]">
                      {w.consignee}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-[13px] text-[#475569]">{w.reason}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-[13px] font-semibold text-[#0F172A]">
                      {w.waiverType === "Percentage"
                        ? `${w.waiverValue}%`
                        : formatPKR(w.waiverValue)}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-[13px] text-[#475569]">
                      {w.requestedBy}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full text-[11px] font-semibold whitespace-nowrap"
                      style={{
                        backgroundColor: sc.bg,
                        color: sc.text,
                      }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: sc.dot }}
                      />
                      {w.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-[13px] text-[#475569]">{w.age}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelect(w);
                        }}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#0B2545] cursor-pointer transition-colors"
                      >
                        <Eye size={15} />
                      </button>
                      <ChevronRight
                        size={15}
                        className="text-[#94A3B8]"
                      />
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