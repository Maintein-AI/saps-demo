"use client";

import { useToast } from "@/components/ToastContext";
import {
  Eye,
  Pencil,
  Edit3,
  FileText,
  Upload,
  Clock,
  CheckCircle,
  XCircle,
  FileEdit,
} from "lucide-react";

interface SearchResult {
  id: string;
  type: "UCM" | "SCM" | "LUC";
  messageRef: string;
  originator: string;
  station: string;
  flight: string;
  dateTime: string;
  status: "Draft" | "Sent" | "Correction" | "Failed";
  uldCount: number;
  createdBy: string;
}

interface SearchResultsTableProps {
  results: SearchResult[];
  loading: boolean;
  error: boolean;
  onRetry: () => void;
  onViewIataSyntax: (result: SearchResult) => void;
  onCreateCorrection: (result: SearchResult) => void;
}

const statusConfig: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  Draft: { bg: "#F1F5F9", text: "#64748B", icon: <Clock size={12} /> },
  Sent: { bg: "#DCFCE7", text: "#16A34A", icon: <CheckCircle size={12} /> },
  Correction: { bg: "#FEF3C7", text: "#D97706", icon: <FileEdit size={12} /> },
  Failed: { bg: "#FEE2E2", text: "#DC2626", icon: <XCircle size={12} /> },
};

const typeConfig: Record<string, { bg: string; text: string }> = {
  UCM: { bg: "#DBEAFE", text: "#1B4F8B" },
  SCM: { bg: "#DCFCE7", text: "#16A34A" },
  LUC: { bg: "#FEF3C7", text: "#B45309" },
};

export default function SearchResultsTable({ results, loading, error, onRetry, onViewIataSyntax, onCreateCorrection }: SearchResultsTableProps) {
  const { addToast } = useToast();

  const handleView = (r: SearchResult) => {
    addToast(`Viewing ${r.type} message ${r.messageRef}.`, "success");
  };

  const handleEditDraft = (r: SearchResult) => {
    if (r.status === "Sent") {
      addToast(`Cannot edit a sent message. Use correction workflow.`, "error");
      return;
    }
    addToast(`Opening ${r.type} draft ${r.messageRef} for editing.`, "success");
  };

  const handleExport = (r: SearchResult) => {
    addToast(`${r.type} message ${r.messageRef} exported.`, "success");
  };

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2">
          <h2 className="text-[15px] font-bold text-[#0F172A]">Search Results</h2>
        </div>
        {!loading && !error && (
          <span className="text-[12px] text-[#64748B]">{results.length} messages found</span>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1200px] text-left">
          <thead>
            <tr className="border-b border-[#E2E8F0]">
              <th className="py-2.5 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Message Type</th>
              <th className="py-2.5 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Message Reference</th>
              <th className="py-2.5 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Originator</th>
              <th className="py-2.5 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Station</th>
              <th className="py-2.5 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Flight</th>
              <th className="py-2.5 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Date / Time</th>
              <th className="py-2.5 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Status</th>
              <th className="py-2.5 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">ULD Count</th>
              <th className="py-2.5 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Created By</th>
              <th className="py-2.5 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody>
            {error && (
              <tr>
                <td colSpan={10} className="py-4 px-3">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[#FEE2E2] border border-[#FCA5A5]">
                    <span className="text-[13px] font-semibold text-[#DC2626] flex-1">Failed to load search results.</span>
                    <button
                      onClick={onRetry}
                      className="h-8 px-3 rounded-lg text-[12px] font-semibold bg-[#DC2626] text-white hover:opacity-90 cursor-pointer transition-opacity whitespace-nowrap"
                    >
                      Retry
                    </button>
                  </div>
                </td>
              </tr>
            )}

            {!error && loading && (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="border-b border-[#F1F5F9]">
                  {Array.from({ length: 10 }).map((_, j) => (
                    <td key={j} className="py-3 px-3">
                      <div className="h-4 bg-[#F1F5F9] rounded animate-pulse" style={{ width: j === 1 ? "110px" : "65px" }} />
                    </td>
                  ))}
                </tr>
              ))
            )}

            {!error && !loading && results.length === 0 && (
              <tr>
                <td colSpan={10} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-[#F1F5F9] flex items-center justify-center">
                      <FileText size={28} className="text-[#94A3B8]" />
                    </div>
                    <p className="text-[14px] font-semibold text-[#64748B]">No messages match your search criteria.</p>
                    <p className="text-[12px] text-[#94A3B8]">Try adjusting your filters or use fewer filters.</p>
                  </div>
                </td>
              </tr>
            )}

            {!error && !loading && results.map((r) => {
              const sc = statusConfig[r.status];
              const tc = typeConfig[r.type];
              return (
                <tr key={r.id} className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center h-5 px-2 rounded-full text-[11px] font-bold whitespace-nowrap" style={{ backgroundColor: tc.bg, color: tc.text }}>
                      {r.type}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-[12px] font-mono text-[#1B4F8B] font-semibold">{r.messageRef}</td>
                  <td className="py-3 px-3 text-[12px] text-[#0F172A] font-mono">{r.originator}</td>
                  <td className="py-3 px-3 text-[12px] font-bold font-mono text-[#0F172A]">{r.station}</td>
                  <td className="py-3 px-3 text-[12px] font-mono text-[#1B4F8B]">{r.flight}</td>
                  <td className="py-3 px-3 text-[12px] text-[#64748B] whitespace-nowrap">{r.dateTime}</td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 h-5 px-2 rounded-full text-[11px] font-semibold whitespace-nowrap" style={{ backgroundColor: sc.bg, color: sc.text }}>
                      {sc.icon}
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-[12px] font-semibold text-[#0F172A]">{r.uldCount}</td>
                  <td className="py-3 px-3 text-[12px] text-[#0F172A]">{r.createdBy}</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-0.5">
                      <button onClick={() => handleView(r)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors" title="View">
                        <Eye size={14} />
                      </button>
                      <button onClick={() => handleEditDraft(r)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors" title="Edit Draft">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => onCreateCorrection(r)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#D97706] cursor-pointer transition-colors" title="Create Correction">
                        <Edit3 size={14} />
                      </button>
                      <button onClick={() => onViewIataSyntax(r)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#1B4F8B] cursor-pointer transition-colors" title="View IATA Syntax">
                        <FileText size={14} />
                      </button>
                      <button onClick={() => handleExport(r)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#16A34A] cursor-pointer transition-colors" title="Export ULDs">
                        <Upload size={14} />
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