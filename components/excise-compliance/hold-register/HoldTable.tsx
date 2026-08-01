"use client";

import { useState } from "react";
import { useToast } from "@/components/ToastContext";
import {
  Eye,
  FileText,
  Unlock,
  ArrowUp,
  MessageSquare,
  ClipboardList,
  CheckCircle,
  Clock,
  AlertTriangle,
  Shield,
  Lock,
  X,
} from "lucide-react";

interface HoldRow {
  id: string;
  holdNum: string;
  awb: string;
  hawb: string;
  holdType: string;
  reason: string;
  createdAt: string;
  createdBy: string;
  owner: string;
  status: string;
  age: string;
  cargoClass: string;
}

interface HoldTableProps {
  rows: HoldRow[];
  onRelease: (row: HoldRow) => void;
  onEscalate: (row: HoldRow) => void;
  onViewAudit: (row: HoldRow) => void;
}

const holdTypeConfig: Record<string, { bg: string; text: string; dot: string }> = {
  Customs: { bg: "#DBEAFE", text: "#1B4F8B", dot: "#2E75B6" },
  ANF: { bg: "#FEF3C7", text: "#D97706", dot: "#D97706" },
  ASF: { bg: "#F3E8FF", text: "#7C3AED", dot: "#7C3AED" },
  Internal: { bg: "#F1F5F9", text: "#64748B", dot: "#94A3B8" },
  Discrepancy: { bg: "#FEE2E2", text: "#DC2626", dot: "#DC2626" },
};

const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  Active: { bg: "#FEE2E2", text: "#DC2626", dot: "#DC2626" },
  "Under Review": { bg: "#FEF3C7", text: "#D97706", dot: "#D97706" },
  Escalated: { bg: "#DBEAFE", text: "#1B4F8B", dot: "#2E75B6" },
  Resolved: { bg: "#DCFCE7", text: "#16A34A", dot: "#16A34A" },
  Released: { bg: "#DCFCE7", text: "#16A34A", dot: "#16A34A" },
};

export default function HoldTable({
  rows,
  onRelease,
  onEscalate,
  onViewAudit,
}: HoldTableProps) {
  const { addToast } = useToast();
  const [selectedRow, setSelectedRow] = useState<string | null>(null);

  const handleAddNote = (row: HoldRow) => {
    addToast(`Note added to ${row.holdNum}`, "success");
  };

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2.5">
          <h2 className="text-[15px] font-bold text-[#0F172A]">Held Cargo</h2>
          <span className="text-[12px] text-[#64748B] ml-1">{rows.length} records</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px]">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
              {[
                "Hold #",
                "AWB #",
                "HAWB #",
                "Hold Type",
                "Reason",
                "Created At",
                "Created By",
                "Owner",
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
            {rows.map((row) => {
              const ht = holdTypeConfig[row.holdType] || holdTypeConfig.Customs;
              const st = statusConfig[row.status] || statusConfig.Active;
              return (
                <tr
                  key={row.id}
                  className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors"
                >
                  <td className="px-4 py-3.5">
                    <span className="text-[13px] font-semibold text-[#0B2545]">
                      {row.holdNum}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-[13px] font-medium text-[#475569]">
                      {row.awb}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-[13px] font-medium text-[#475569]">
                      {row.hawb}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full text-[11px] font-semibold whitespace-nowrap"
                      style={{ backgroundColor: ht.bg, color: ht.text }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ht.dot }} />
                      {row.holdType}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-[13px] text-[#475569] max-w-[200px] truncate block">
                      {row.reason}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-[13px] text-[#475569]">{row.createdAt}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-[13px] text-[#475569]">{row.createdBy}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-[13px] text-[#475569]">{row.owner}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full text-[11px] font-semibold whitespace-nowrap"
                      style={{ backgroundColor: st.bg, color: st.text }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: st.dot }} />
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-[13px] font-semibold text-[#475569]">{row.age}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => addToast(`Viewing AWB ${row.awb}`, "success")}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#0B2545] cursor-pointer transition-colors"
                        title="View AWB"
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedRow(selectedRow === row.id ? null : row.id);
                        }}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#1B4F8B] cursor-pointer transition-colors"
                        title="View Hold Detail"
                      >
                        <FileText size={15} />
                      </button>
                      {row.status !== "Released" && row.status !== "Resolved" && (
                        <button
                          onClick={() => onRelease(row)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#16A34A] cursor-pointer transition-colors"
                          title="Release Hold"
                        >
                          <Unlock size={15} />
                        </button>
                      )}
                      <button
                        onClick={() => onEscalate(row)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#D97706] cursor-pointer transition-colors"
                        title="Escalate"
                      >
                        <ArrowUp size={15} />
                      </button>
                      <button
                        onClick={() => handleAddNote(row)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#7C3AED] cursor-pointer transition-colors"
                        title="Add Note"
                      >
                        <MessageSquare size={15} />
                      </button>
                      <button
                        onClick={() => onViewAudit(row)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#0B2545] cursor-pointer transition-colors"
                        title="View Audit"
                      >
                        <ClipboardList size={15} />
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