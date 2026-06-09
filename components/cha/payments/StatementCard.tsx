import ScopeBadge from "@/components/ScopeBadge";
import { ArrowRight } from "lucide-react";

interface StatementRow {
  label: string;
  value: string;
  isPositive?: boolean;
  isNegative?: boolean;
  isBold?: boolean;
}

const statementRows: StatementRow[] = [
  { label: "Opening Balance", value: "Rs 3,200,000", isBold: true },
  { label: "New Invoices", value: "Rs 4,850,000", isPositive: true },
  { label: "Payments Received", value: "Rs 8,200,000", isNegative: true },
  { label: "Adjustments", value: "Rs 125,000", isPositive: true },
  { label: "Closing Balance", value: "Rs -25,000", isBold: true, isNegative: true },
];

export default function StatementCard() {
  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <h3 className="text-[15px] font-bold text-[#0F172A]">CHA Statement</h3>
          <ScopeBadge type="exc" />
        </div>
        <span className="text-[12px] text-[#64748B]">Jun 2026</span>
      </div>

      <div className="space-y-3">
        {statementRows.map((row) => (
          <div key={row.label} className="flex items-center justify-between py-2 border-b border-[#F1F5F9] last:border-0">
            <span className={`text-[13px] ${row.isBold ? "font-bold text-[#0F172A]" : "text-[#64748B]"}`}>
              {row.label}
            </span>
            <span
              className={`text-[13px] font-mono ${
                row.isBold ? "font-bold text-[#0F172A]" : "text-[#0F172A]"
              }`}
              style={
                row.isPositive && !row.isBold
                  ? { color: "#16A34A" }
                  : row.isNegative && !row.isBold
                    ? { color: "#DC2626" }
                    : undefined
              }
            >
              {row.isNegative && !row.isBold ? "-" : "+"}
              {row.value}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-[#E2E8F0]">
        <button className="flex items-center gap-2 h-9 px-4 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] cursor-pointer transition-colors hover:bg-[#F8FAFC] whitespace-nowrap">
          <ArrowRight size={14} />
          View Full Statement
        </button>
      </div>
    </div>
  );
}