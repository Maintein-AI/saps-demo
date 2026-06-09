"use client";

import ScopeBadge from "@/components/ScopeBadge";
import { FileText, Save, Send, X, Printer } from "lucide-react";

interface LineItem {
  lineType: string;
  awbHawb: string;
  pieces: number;
  weightBasis: string;
  rate: number;
  days: number;
  amount: number;
}

interface LineItemsTableProps {
  items: LineItem[];
  subtotal: number;
  gst: number;
  grandTotal: number;
  onGenerate: () => void;
  onSaveDraft: () => void;
  onPreviewPDF: () => void;
  onEmail: () => void;
  onClear: () => void;
}

const lineTypeConfig: Record<string, { bg: string; text: string }> = {
  Storage: { bg: "#DBEAFE", text: "#1B4F8B" },
  Demurrage: { bg: "#FEF3C7", text: "#D97706" },
  Surcharge: { bg: "#F3E8FF", text: "#7C3AED" },
  Adjustment: { bg: "#FEE2E2", text: "#DC2626" },
};

function formatPKR(value: number) {
  return `Rs. ${value.toLocaleString("en-PK")}`;
}

export default function LineItemsTable({
  items,
  subtotal,
  gst,
  grandTotal,
  onGenerate,
  onSaveDraft,
  onPreviewPDF,
  onEmail,
  onClear,
}: LineItemsTableProps) {
  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2.5">
          <h2 className="text-[15px] font-bold text-[#0F172A]">Invoice Line Items</h2>
          <ScopeBadge type="inc" />
          <span className="text-[12px] text-[#64748B] ml-1">{items.length} lines</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
              {["Line Type", "AWB / HAWB", "Pieces", "Weight Basis", "Rate PKR / kg / day", "Days", "Amount"].map(
                (h) => (
                  <th
                    key={h}
                    className="text-left text-[11px] font-semibold text-[#64748B] uppercase tracking-wider px-4 py-3 whitespace-nowrap"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => {
              const tc = lineTypeConfig[item.lineType] || lineTypeConfig.Storage;
              return (
                <tr key={idx} className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-4 py-3.5">
                    <span
                      className="inline-flex items-center h-6 px-2.5 rounded-full text-[11px] font-semibold"
                      style={{ backgroundColor: tc.bg, color: tc.text }}
                    >
                      {item.lineType}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-[13px] text-[#475569]">{item.awbHawb}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-[13px] text-[#475569]">{item.pieces}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-[13px] text-[#475569]">{item.weightBasis}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-[13px] text-[#475569]">Rs. {item.rate}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-[13px] text-[#475569]">{item.days}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-[13px] font-semibold text-[#0F172A]">
                      {formatPKR(item.amount)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer Totals */}
      <div className="px-5 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider block">Subtotal</span>
              <span className="text-[18px] font-bold text-[#0F172A]">{formatPKR(subtotal)}</span>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider block">GST 18%</span>
              <span className="text-[18px] font-bold text-[#0F172A]">{formatPKR(gst)}</span>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider block">Grand Total</span>
              <span className="text-[24px] font-bold text-[#0B2545]">{formatPKR(grandTotal)}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClear}
              className="h-9 px-3 rounded-xl border border-[#E2E8F0] text-[13px] font-semibold text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <div className="w-4 h-4 flex items-center justify-center">
                <X size={14} />
              </div>
              Cancel
            </button>
            <button
              onClick={onSaveDraft}
              className="h-9 px-3 rounded-xl border border-[#E2E8F0] text-[13px] font-semibold text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <div className="w-4 h-4 flex items-center justify-center">
                <Save size={14} />
              </div>
              Save Draft
            </button>
            <button
              onClick={onPreviewPDF}
              className="h-9 px-3 rounded-xl border border-[#E2E8F0] text-[13px] font-semibold text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <div className="w-4 h-4 flex items-center justify-center">
                <Printer size={14} />
              </div>
              Preview PDF
            </button>
            <button
              onClick={onEmail}
              className="h-9 px-3 rounded-xl border border-[#E2E8F0] text-[13px] font-semibold text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <div className="w-4 h-4 flex items-center justify-center">
                <Send size={14} />
              </div>
              Email
            </button>
            <button
              onClick={onGenerate}
              className="h-9 px-4 rounded-xl text-[13px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90 flex items-center gap-2 whitespace-nowrap"
              style={{ backgroundColor: "#0B2545" }}
            >
              <div className="w-4 h-4 flex items-center justify-center">
                <FileText size={14} />
              </div>
              Generate Invoice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}