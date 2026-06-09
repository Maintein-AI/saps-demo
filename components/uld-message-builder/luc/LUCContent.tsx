"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ToastContext";
import ScopeBadge from "@/components/ScopeBadge";
import {
  Eye,
  Search,
  Download,
  ArrowLeft,
  Plus,
  HelpCircle,
  AlertTriangle,
  RefreshCw,
  Clock,
  CheckCircle,
  FileEdit,
  XCircle,
  FileText,
  Boxes,
} from "lucide-react";

interface LUCMessage {
  id: string;
  station: string;
  reference: string;
  createdAt: string;
  submittedAt: string;
  status: "Draft" | "Sent" | "Correction" | "Failed";
  createdBy: string;
}

const lucMessages: LUCMessage[] = [
  { id: "LUC-0031", station: "LHE", reference: "LUC-EK-624-15JUN26", createdAt: "15 Jun 2026 11:03", submittedAt: "15 Jun 2026 11:05", status: "Sent", createdBy: "Kamran Sheikh" },
  { id: "LUC-0030", station: "LHE", reference: "LUC-PA-213-13JUN26", createdAt: "13 Jun 2026 12:55", submittedAt: "13 Jun 2026 12:58", status: "Failed", createdBy: "Kamran Sheikh" },
  { id: "LUC-0029", station: "KHI", reference: "LUC-EK-626-12JUN26", createdAt: "12 Jun 2026 10:20", submittedAt: "", status: "Draft", createdBy: "Bilal Ahmed" },
  { id: "LUC-0028", station: "KHI", reference: "LUC-GF-752-09JUN26", createdAt: "09 Jun 2026 14:40", submittedAt: "09 Jun 2026 14:42", status: "Sent", createdBy: "Nadeem Hussain" },
  { id: "LUC-0027", station: "KHI", reference: "LUC-SV-732-08JUN26", createdAt: "08 Jun 2026 10:15", submittedAt: "08 Jun 2026 10:18", status: "Sent", createdBy: "Bilal Ahmed" },
  { id: "LUC-0026", station: "KHI", reference: "LUC-QR-606-07JUN26", createdAt: "07 Jun 2026 16:00", submittedAt: "07 Jun 2026 16:03", status: "Sent", createdBy: "Asim Tariq" },
  { id: "LUC-0025", station: "LHE", reference: "LUC-EK-624-06JUN26", createdAt: "06 Jun 2026 09:45", submittedAt: "06 Jun 2026 09:48", status: "Sent", createdBy: "Kamran Sheikh" },
  { id: "LUC-0024", station: "LHE", reference: "LUC-PK-304-05JUN26", createdAt: "05 Jun 2026 15:30", submittedAt: "05 Jun 2026 15:33", status: "Correction", createdBy: "Asim Tariq" },
  { id: "LUC-0023", station: "LHE", reference: "LUC-SV-730-04JUN26", createdAt: "04 Jun 2026 13:10", submittedAt: "04 Jun 2026 13:12", status: "Sent", createdBy: "Kamran Sheikh" },
  { id: "LUC-0022", station: "LHE", reference: "LUC-EK-628-03JUN26", createdAt: "03 Jun 2026 07:20", submittedAt: "", status: "Draft", createdBy: "Bilal Ahmed" },
];

const statusConfig: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  Draft: { bg: "#F1F5F9", text: "#64748B", icon: <Clock size={12} /> },
  Sent: { bg: "#DCFCE7", text: "#16A34A", icon: <CheckCircle size={12} /> },
  Correction: { bg: "#FEF3C7", text: "#D97706", icon: <FileEdit size={12} /> },
  Failed: { bg: "#FEE2E2", text: "#DC2626", icon: <XCircle size={12} /> },
};

export default function LUCContent() {
  const router = useRouter();
  const { addToast } = useToast();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [messages] = useState<LUCMessage[]>(lucMessages);

  const handleRetry = () => {
    setLoading(true);
    setError(false);
    setTimeout(() => {
      setLoading(false);
      addToast("LUC messages refreshed.", "success");
    }, 1200);
  };

  const handleViewMessage = (msg: LUCMessage) => {
    addToast(`Viewing ${msg.id} — ${msg.reference}`, "success");
  };

  const handleDownloadMessage = (msg: LUCMessage) => {
    addToast(`${msg.id} downloaded.`, "success");
  };

  const handleSearchLog = () => {
    router.push("/uld-message-builder/message-log");
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#FEF3C7] animate-pulse" />
            <div className="flex-1">
              <div className="h-5 w-40 bg-[#F1F5F9] rounded animate-pulse mb-2" />
              <div className="h-4 w-full max-w-[500px] bg-[#F1F5F9] rounded animate-pulse" />
            </div>
          </div>
        </div>
        <div className="rounded-[16px] border border-[#E2E8F0] bg-white shadow-sm p-6">
          <div className="h-5 w-32 bg-[#F1F5F9] rounded animate-pulse mb-4" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 bg-[#F1F5F9] rounded-lg animate-pulse mb-2" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && !loading && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-[#FEE2E2] border border-[#FCA5A5]">
          <AlertTriangle size={16} className="text-[#DC2626] flex-shrink-0" />
          <span className="text-[13px] font-semibold text-[#DC2626] flex-1">Failed to load LUC messages. Please try again.</span>
          <button
            onClick={handleRetry}
            className="flex items-center gap-2 h-8 px-3 rounded-lg text-[12px] font-semibold bg-[#DC2626] text-white hover:opacity-90 cursor-pointer transition-opacity whitespace-nowrap"
          >
            <RefreshCw size={14} />
            Retry
          </button>
        </div>
      )}

      <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#FEF3C7] flex items-center justify-center flex-shrink-0">
            <Boxes size={24} className="text-[#B45309]" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-[17px] font-bold text-[#0F172A]">LUC Message Builder</h2>
              <ScopeBadge type="exc" />
            </div>
            <p className="text-[13px] text-[#64748B] leading-relaxed mb-3">
              Message code: <span className="font-bold font-mono text-[#0F172A]">LUC</span>
            </p>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-[#F59E0B]/5 border border-[#F59E0B]/20">
              <div className="w-8 h-8 rounded-lg bg-[#F59E0B]/10 flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={16} className="text-[#F59E0B]" />
              </div>
              <div className="flex-1">
                <p className="text-[13px] font-semibold text-[#B45309] mb-1">Awaiting Client Confirmation</p>
                <p className="text-[12px] text-[#92400E]/80 leading-relaxed">
                  The LUC builder structure is awaiting confirmation from the existing client system. No fields have been generated to avoid changing the legacy workflow.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[16px] border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-2">
            <h2 className="text-[15px] font-bold text-[#0F172A]">Recent LUC Messages</h2>
            <ScopeBadge type="exc" />
          </div>
          <span className="text-[12px] text-[#64748B]">{messages.length} messages</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead>
              <tr className="border-b border-[#E2E8F0]">
                <th className="py-2.5 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Message ID</th>
                <th className="py-2.5 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Station</th>
                <th className="py-2.5 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Reference</th>
                <th className="py-2.5 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Created At</th>
                <th className="py-2.5 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Submitted At</th>
                <th className="py-2.5 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Status</th>
                <th className="py-2.5 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Created By</th>
                <th className="py-2.5 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody>
              {messages.length === 0 && !loading && !error ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-[#F1F5F9] flex items-center justify-center">
                        <FileText size={28} className="text-[#94A3B8]" />
                      </div>
                      <p className="text-[14px] font-semibold text-[#64748B]">No LUC messages available.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                messages.map((msg) => {
                  const sc = statusConfig[msg.status];
                  return (
                    <tr key={msg.id} className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors">
                      <td className="py-3 px-3 text-[12px] font-mono font-bold text-[#0F172A]">{msg.id}</td>
                      <td className="py-3 px-3 text-[12px] font-bold font-mono text-[#0F172A]">{msg.station}</td>
                      <td className="py-3 px-3 text-[12px] font-mono text-[#1B4F8B]">{msg.reference}</td>
                      <td className="py-3 px-3 text-[12px] text-[#64748B] whitespace-nowrap">{msg.createdAt}</td>
                      <td className="py-3 px-3 text-[12px] text-[#64748B] whitespace-nowrap">{msg.submittedAt || "—"}</td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center gap-1 h-5 px-2 rounded-full text-[11px] font-semibold whitespace-nowrap" style={{ backgroundColor: sc.bg, color: sc.text }}>
                          {sc.icon}
                          {msg.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-[12px] text-[#0F172A]">{msg.createdBy}</td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleViewMessage(msg)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors"
                            title="View Existing Message"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => handleDownloadMessage(msg)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors"
                            title="Download Existing Message"
                          >
                            <Download size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative group">
          <button
            disabled
            className="flex items-center gap-2 h-10 px-4 rounded-xl text-[13px] font-semibold text-[#94A3B8] bg-[#F1F5F9] border border-[#E2E8F0] cursor-not-allowed whitespace-nowrap opacity-60"
          >
            <Plus size={16} />
            Create New LUC Message
          </button>
          <div className="absolute bottom-full left-0 mb-2 w-[280px] p-3 rounded-lg bg-[#0F172A] text-white text-[12px] leading-relaxed shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
            <div className="flex items-start gap-2">
              <HelpCircle size={14} className="text-[#F59E0B] mt-0.5 flex-shrink-0" />
              <span>LUC form specification or reference screen is required before generation.</span>
            </div>
            <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#0F172A]" />
          </div>
        </div>

        <button
          onClick={handleSearchLog}
          className="flex items-center gap-2 h-10 px-4 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer transition-colors whitespace-nowrap"
        >
          <Search size={16} />
          Search LUC Log
        </button>

        <button
          onClick={() => router.push("/uld-message-builder")}
          className="flex items-center gap-2 h-10 px-4 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer transition-colors whitespace-nowrap"
        >
          <ArrowLeft size={16} />
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}