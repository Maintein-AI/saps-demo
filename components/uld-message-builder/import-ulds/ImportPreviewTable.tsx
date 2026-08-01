"use client";
import { Trash2, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

export interface ULDImportRow {
  id: string;
  type: string;
  nbr: string;
  owner: string;
  substation: string;
  status: string;
  condition: string;
  destination: string;
  content: string;
  validationResult: "valid" | "invalid" | "warning";
  errorMessage?: string;
}

interface ImportPreviewTableProps {
  rows: ULDImportRow[];
  onRemoveRow: (id: string) => void;
}

const validationConfig: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  valid: { bg: "#DCFCE7", text: "#16A34A", icon: <CheckCircle size={12} /> },
  invalid: { bg: "#FEE2E2", text: "#DC2626", icon: <XCircle size={12} /> },
  warning: { bg: "#FEF3C7", text: "#D97706", icon: <AlertTriangle size={12} /> },
};

export default function ImportPreviewTable({ rows, onRemoveRow }: ImportPreviewTableProps) {
  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2">
          <h2 className="text-[15px] font-bold text-[#0F172A]">Import Preview</h2>
        </div>
        <span className="text-[12px] text-[#64748B]">{rows.length} rows</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1200px] text-left">
          <thead>
            <tr className="border-b border-[#E2E8F0]">
              <th className="py-2.5 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">#</th>
              <th className="py-2.5 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Type</th>
              <th className="py-2.5 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Nbr</th>
              <th className="py-2.5 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Owner</th>
              <th className="py-2.5 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Substation</th>
              <th className="py-2.5 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Status</th>
              <th className="py-2.5 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Condition</th>
              <th className="py-2.5 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Destination</th>
              <th className="py-2.5 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Content</th>
              <th className="py-2.5 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Validation</th>
              <th className="py-2.5 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider w-12"></th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={11} className="py-16 text-center">
                  <p className="text-[14px] font-semibold text-[#64748B]">No ULD rows to preview.</p>
                  <p className="text-[12px] text-[#94A3B8] mt-1">Upload a file, paste rows, or import from an existing message.</p>
                </td>
              </tr>
            )}
            {rows.map((row, idx) => {
              const vc = validationConfig[row.validationResult];
              const isInvalid = row.validationResult === "invalid";
              const isWarning = row.validationResult === "warning";
              return (
                <tr
                  key={row.id}
                  className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors"
                  style={{ backgroundColor: isInvalid ? "#FEF2F2" : isWarning ? "#FFFBEB" : "transparent" }}
                >
                  <td className="py-3 px-3 text-[12px] text-[#94A3B8] font-mono">{idx + 1}</td>
                  <td className="py-3 px-3">
                    <input
                      defaultValue={row.type}
                      className={`w-16 h-7 px-2 rounded border text-[12px] font-mono font-semibold text-[#0F172A] bg-white focus:outline-none focus:ring-1 transition-colors ${isInvalid ? "border-[#FCA5A5]" : "border-[#E2E8F0] focus:border-[#1B4F8B] focus:ring-[#1B4F8B]"}`}
                    />
                  </td>
                  <td className="py-3 px-3">
                    <input
                      defaultValue={row.nbr}
                      className={`w-20 h-7 px-2 rounded border text-[12px] font-mono text-[#0F172A] bg-white focus:outline-none focus:ring-1 transition-colors ${isInvalid ? "border-[#FCA5A5]" : "border-[#E2E8F0] focus:border-[#1B4F8B] focus:ring-[#1B4F8B]"}`}
                    />
                  </td>
                  <td className="py-3 px-3">
                    <input
                      defaultValue={row.owner}
                      className={`w-16 h-7 px-2 rounded border text-[12px] font-mono font-bold text-[#0F172A] bg-white focus:outline-none focus:ring-1 transition-colors ${isInvalid ? "border-[#FCA5A5]" : "border-[#E2E8F0] focus:border-[#1B4F8B] focus:ring-[#1B4F8B]"}`}
                    />
                  </td>
                  <td className="py-3 px-3">
                    <input
                      defaultValue={row.substation}
                      className={`w-24 h-7 px-2 rounded border text-[12px] text-[#0F172A] bg-white focus:outline-none focus:ring-1 transition-colors ${isInvalid ? "border-[#FCA5A5]" : "border-[#E2E8F0] focus:border-[#1B4F8B] focus:ring-[#1B4F8B]"}`}
                    />
                  </td>
                  <td className="py-3 px-3">
                    <input
                      defaultValue={row.status}
                      className={`w-24 h-7 px-2 rounded border text-[12px] text-[#0F172A] bg-white focus:outline-none focus:ring-1 transition-colors ${isInvalid ? "border-[#FCA5A5]" : "border-[#E2E8F0] focus:border-[#1B4F8B] focus:ring-[#1B4F8B]"}`}
                    />
                  </td>
                  <td className="py-3 px-3">
                    <input
                      defaultValue={row.condition}
                      className={`w-28 h-7 px-2 rounded border text-[12px] text-[#0F172A] bg-white focus:outline-none focus:ring-1 transition-colors ${isInvalid ? "border-[#FCA5A5]" : "border-[#E2E8F0] focus:border-[#1B4F8B] focus:ring-[#1B4F8B]"}`}
                    />
                  </td>
                  <td className="py-3 px-3">
                    <input
                      defaultValue={row.destination}
                      className={`w-16 h-7 px-2 rounded border text-[12px] font-mono font-bold text-[#0F172A] bg-white focus:outline-none focus:ring-1 transition-colors ${isInvalid ? "border-[#FCA5A5]" : "border-[#E2E8F0] focus:border-[#1B4F8B] focus:ring-[#1B4F8B]"}`}
                    />
                  </td>
                  <td className="py-3 px-3">
                    <input
                      defaultValue={row.content}
                      className={`w-12 h-7 px-2 rounded border text-[12px] font-mono text-[#0F172A] bg-white focus:outline-none focus:ring-1 transition-colors ${isInvalid ? "border-[#FCA5A5]" : "border-[#E2E8F0] focus:border-[#1B4F8B] focus:ring-[#1B4F8B]"}`}
                    />
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className="inline-flex items-center gap-1 h-5 px-2 rounded-full text-[11px] font-semibold whitespace-nowrap"
                      style={{ backgroundColor: vc.bg, color: vc.text }}
                    >
                      {vc.icon}
                      {row.validationResult === "valid" ? "Valid" : row.validationResult === "warning" ? "Warning" : "Invalid"}
                    </span>
                    {row.errorMessage && (
                      <p className="text-[10px] text-[#DC2626] mt-0.5">{row.errorMessage}</p>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <button
                      onClick={() => onRemoveRow(row.id)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#FEE2E2] text-[#94A3B8] hover:text-[#DC2626] cursor-pointer transition-colors"
                      title="Remove row"
                    >
                      <Trash2 size={14} />
                    </button>
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