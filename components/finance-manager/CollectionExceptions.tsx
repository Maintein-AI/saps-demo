"use client";

import { useState } from "react";
import ScopeBadge from "@/components/ScopeBadge";
import { useToast } from "@/components/ToastContext";
import { Eye, Link, Wrench, MoreHorizontal } from "lucide-react";

const exceptions = [
  { id: "PAY-2026-00112", invoice: "INV-2026-00480", amount: 125000, type: "Partial Payment", age: "3 days", details: "Paid Rs. 85,000 of Rs. 125,000" },
  { id: "PAY-2026-00113", invoice: "INV-2026-00481", amount: 78000, type: "Unmatched Settlement", age: "5 days", details: "Bank transfer ref not matched to invoice" },
  { id: "PAY-2026-00114", invoice: "INV-2026-00482", amount: 240000, type: "Failed Payment", age: "1 day", details: "Card declined — insufficient funds" },
  { id: "PAY-2026-00115", invoice: "INV-2026-00483", amount: 45000, type: "Partial Payment", age: "7 days", details: "Paid Rs. 30,000 of Rs. 45,000" },
  { id: "PAY-2026-00116", invoice: "INV-2026-00484", amount: 320000, type: "Unmatched Settlement", age: "2 days", details: "UAN deposit without invoice reference" },
  { id: "PAY-2026-00117", invoice: "INV-2026-00485", amount: 18000, type: "Failed Payment", age: "1 day", details: "Bank transfer bounced — invalid account" },
];

const typeConfig: Record<string, { bg: string; text: string; dot: string }> = {
  "Partial Payment": { bg: "#FEF3C7", text: "#D97706", dot: "#D97706" },
  "Unmatched Settlement": { bg: "#DBEAFE", text: "#1B4F8B", dot: "#2E75B6" },
  "Failed Payment": { bg: "#FEE2E2", text: "#DC2626", dot: "#DC2626" },
};

function formatPKR(value: number) {
  return `Rs. ${value.toLocaleString("en-PK")}`;
}

export default function CollectionExceptions() {
  const { addToast } = useToast();
  const [actionOpenRow, setActionOpenRow] = useState<number | null>(null);

  const handleAction = (action: string, id: string) => {
    addToast(`${action} for ${id}`, "success");
  };

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2.5">
          <h2 className="text-[15px] font-bold text-[#0F172A]">Collection Exceptions</h2>
          <ScopeBadge type="inc" />
          <span className="text-[12px] text-[#64748B] ml-1">{exceptions.length} open</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
              {["Ref #", "Invoice #", "Amount", "Exception Type", "Age", "Action"].map((h) => (
                <th key={h} className="text-left text-[11px] font-semibold text-[#64748B] uppercase tracking-wider px-4 py-3 whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {exceptions.map((ex, idx) => {
              const tc = typeConfig[ex.type] || typeConfig["Partial Payment"];
              return (
                <tr key={ex.id} className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-4 py-3.5">
                    <span className="text-[13px] font-semibold text-[#0B2545]">{ex.id}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-[13px] text-[#475569]">{ex.invoice}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-[13px] font-semibold text-[#0F172A]">{formatPKR(ex.amount)}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full text-[11px] font-semibold whitespace-nowrap" style={{ backgroundColor: tc.bg, color: tc.text }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: tc.dot }} />
                      {ex.type}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-[13px] text-[#475569]">{ex.age}</span>
                  </td>
                  <td className="px-4 py-3.5 relative">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleAction("Viewed", ex.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#0B2545] cursor-pointer transition-colors"
                        title="View"
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        onClick={() => handleAction("Matched", ex.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#1B4F8B] cursor-pointer transition-colors"
                        title="Match to Invoice"
                      >
                        <Link size={15} />
                      </button>
                      <button
                        onClick={() => handleAction("Resolved", ex.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#16A34A] cursor-pointer transition-colors"
                        title="Resolve"
                      >
                        <Wrench size={15} />
                      </button>
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
                          <Link size={14} className="text-[#64748B]" /> Match Invoice
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