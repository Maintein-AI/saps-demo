"use client";

import { useToast } from "@/components/ToastContext";
import ScopeBadge from "@/components/ScopeBadge";
import {
  Eye,
  FileText,
  Download,
  Edit3,
  Upload,
  Clock,
  CheckCircle,
  XCircle,
  FileEdit,
} from "lucide-react";

interface LogEntry {
  id: string;
  type: "UCM" | "SCM" | "LUC";
  reference: string;
  station: string;
  flight: string;
  createdAt: string;
  submittedAt: string;
  status: "Draft" | "Sent" | "Correction" | "Failed";
  createdBy: string;
  correctionOf: string;
}

interface MessageLogTableProps {
  entries: LogEntry[];
  loading: boolean;
  error: boolean;
  onRetry: () => void;
  onViewIataSyntax: (entry: LogEntry) => void;
  onCreateCorrection: (entry: LogEntry) => void;
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

export default function MessageLogTable({ entries, loading, error, onRetry, onViewIataSyntax, onCreateCorrection }: MessageLogTableProps) {
  const { addToast } = useToast();

  const handleView = (e: LogEntry) => {
    addToast(`Viewing ${e.type} message ${e.reference}.`, "success");
  };

  const handleDownload = (e: LogEntry) => {
    addToast(`${e.type} message ${e.reference} downloaded.`, "success");
  };

  const handleExport = (e: LogEntry) => {
    addToast(`${e.type} ULDs from ${e.reference} exported.`, "success");
  };

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1300px] text-left">
          <thead>
            <tr className="border-b border-[#E2E8F0]">
              <th className="py-2.5 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Message ID</th>
              <th className="py-2.5 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Type</th>
              <th className="py-2.5 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Reference</th>
              <th className="py-2.5 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Station</th>
              <th className="py-2.5 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Flight</th>
              <th className="py-2.5 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Created At</th>
              <th className="py-2.5 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Submitted At</th>
              <th className="py-2.5 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Status</th>
              <th className="py-2.5 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Created By</th>
              <th className="py-2.5 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Correction Of</th>
              <th className="py-2.5 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody>
            {error && (
              <tr>
                <td colSpan={11} className="py-4 px-3">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[#FEE2E2] border border-[#FCA5A5]">
                    <span className="text-[13px] font-semibold text-[#DC2626] flex-1">Failed to load message log.</span>
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
                  {Array.from({ length: 11 }).map((_, j) => (
                    <td key={j} className="py-3 px-3">
                      <div className="h-4 bg-[#F1F5F9] rounded animate-pulse" style={{ width: j === 2 ? "120px" : "65px" }} />
                    </td>
                  ))}
                </tr>
              ))
            )}

            {!error && !loading && entries.length === 0 && (
              <tr>
                <td colSpan={11} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-[#F1F5F9] flex items-center justify-center">
                      <FileText size={28} className="text-[#94A3B8]" />
                    </div>
                    <p className="text-[14px] font-semibold text-[#64748B]">No messages in this log.</p>
                  </div>
                </td>
              </tr>
            )}

            {!error && !loading && entries.map((e) => {
              const sc = statusConfig[e.status];
              const tc = typeConfig[e.type];
              return (
                <tr key={e.id} className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-3 px-3 text-[12px] font-mono text-[#94A3B8]">{e.id}</td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center h-5 px-2 rounded-full text-[11px] font-bold whitespace-nowrap" style={{ backgroundColor: tc.bg, color: tc.text }}>
                      {e.type}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-[12px] font-mono text-[#1B4F8B] font-semibold">{e.reference}</td>
                  <td className="py-3 px-3 text-[12px] font-bold font-mono text-[#0F172A]">{e.station}</td>
                  <td className="py-3 px-3 text-[12px] font-mono text-[#1B4F8B]">{e.flight}</td>
                  <td className="py-3 px-3 text-[12px] text-[#64748B] whitespace-nowrap">{e.createdAt}</td>
                  <td className="py-3 px-3 text-[12px] text-[#64748B] whitespace-nowrap">{e.submittedAt || "—"}</td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 h-5 px-2 rounded-full text-[11px] font-semibold whitespace-nowrap" style={{ backgroundColor: sc.bg, color: sc.text }}>
                      {sc.icon}
                      {e.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-[12px] text-[#0F172A]">{e.createdBy}</td>
                  <td className="py-3 px-3 text-[12px] text-[#94A3B8]">{e.correctionOf || "—"}</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-0.5">
                      <button onClick={() => handleView(e)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors" title="View Message">
                        <Eye size={14} />
                      </button>
                      <button onClick={() => onViewIataSyntax(e)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#1B4F8B] cursor-pointer transition-colors" title="View IATA Syntax">
                        <FileText size={14} />
                      </button>
                      <button onClick={() => handleDownload(e)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors" title="Download Message">
                        <Download size={14} />
                      </button>
                      <button onClick={() => onCreateCorrection(e)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#D97706] cursor-pointer transition-colors" title="Create Correction">
                        <Edit3 size={14} />
                      </button>
                      <button onClick={() => handleExport(e)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#16A34A] cursor-pointer transition-colors" title="Export ULDs">
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