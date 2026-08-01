"use client";

import { useState } from "react";
import { useToast } from "@/components/ToastContext";
import {
  Eye,
  FileText,
  Pencil,
  RefreshCw,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  FileEdit,
} from "lucide-react";

interface Message {
  id: string;
  type: "UCM" | "SCM" | "LUC";
  station: string;
  flightRef: string;
  date: string;
  time: string;
  status: "Draft" | "Sent" | "Correction" | "Failed";
  createdBy: string;
  uldCount?: number;
}

const messages: Message[] = [
  { id: "MSG-001", type: "UCM", station: "LHE", flightRef: "PK-304", date: "15 Jun 2026", time: "09:32", status: "Sent", createdBy: "Asim Tariq", uldCount: 14 },
  { id: "MSG-002", type: "SCM", station: "KHI", flightRef: "SV-732", date: "15 Jun 2026", time: "10:15", status: "Sent", createdBy: "Bilal Ahmed", uldCount: 8 },
  { id: "MSG-003", type: "LUC", station: "LHE", flightRef: "EK-624", date: "15 Jun 2026", time: "11:03", status: "Sent", createdBy: "Kamran Sheikh", uldCount: 22 },
  { id: "MSG-004", type: "UCM", station: "KHI", flightRef: "QR-604", date: "14 Jun 2026", time: "14:20", status: "Correction", createdBy: "Nadeem Hussain", uldCount: 18 },
  { id: "MSG-005", type: "SCM", station: "LHE", flightRef: "TK-708", date: "14 Jun 2026", time: "16:45", status: "Draft", createdBy: "Asim Tariq", uldCount: 6 },
  { id: "MSG-006", type: "UCM", station: "KHI", flightRef: "EY-241", date: "14 Jun 2026", time: "08:10", status: "Sent", createdBy: "Bilal Ahmed", uldCount: 31 },
  { id: "MSG-007", type: "LUC", station: "LHE", flightRef: "PA-213", date: "13 Jun 2026", time: "12:55", status: "Failed", createdBy: "Kamran Sheikh", uldCount: 16 },
  { id: "MSG-008", type: "SCM", station: "KHI", flightRef: "GF-752", date: "13 Jun 2026", time: "15:30", status: "Sent", createdBy: "Nadeem Hussain", uldCount: 11 },
  { id: "MSG-009", type: "UCM", station: "LHE", flightRef: "PK-306", date: "12 Jun 2026", time: "07:45", status: "Sent", createdBy: "Asim Tariq", uldCount: 20 },
  { id: "MSG-010", type: "LUC", station: "KHI", flightRef: "EK-626", date: "12 Jun 2026", time: "10:20", status: "Draft", createdBy: "Bilal Ahmed", uldCount: 9 },
  { id: "MSG-011", type: "UCM", station: "LHE", flightRef: "SV-730", date: "11 Jun 2026", time: "13:10", status: "Sent", createdBy: "Kamran Sheikh", uldCount: 24 },
  { id: "MSG-012", type: "SCM", station: "KHI", flightRef: "QR-606", date: "11 Jun 2026", time: "16:00", status: "Correction", createdBy: "Asim Tariq", uldCount: 5 },
];

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

export default function RecentMessagesTable() {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [msgList] = useState<Message[]>(messages);

  const handleRetry = () => {
    setLoading(true);
    setError(false);
    setTimeout(() => {
      setLoading(false);
      addToast("Messages refreshed.", "success");
    }, 1500);
  };

  const handleView = (msg: Message) => {
    addToast(`Viewing ${msg.type} message ${msg.id}.`, "success");
  };

  const handleEdit = (msg: Message) => {
    if (msg.status === "Sent") {
      addToast(`Cannot edit a sent message. Use correction workflow.`, "error");
      return;
    }
    addToast(`Editing ${msg.type} draft ${msg.id}.`, "success");
  };

  const handleDownload = (msg: Message) => {
    addToast(`${msg.type} message ${msg.id} downloaded.`, "success");
  };

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2">
          <h2 className="text-[15px] font-bold text-[#0F172A]">Recent Messages</h2>
        </div>
        <span className="text-[12px] text-[#64748B]">{msgList.length} messages</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] text-left">
          <thead>
            <tr className="border-b border-[#E2E8F0]">
              <th className="py-2.5 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Message Type</th>
              <th className="py-2.5 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Station</th>
              <th className="py-2.5 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Flight / Reference</th>
              <th className="py-2.5 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Date</th>
              <th className="py-2.5 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Time</th>
              <th className="py-2.5 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Status</th>
              <th className="py-2.5 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Created By</th>
              <th className="py-2.5 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody>
            {error && (
              <tr>
                <td colSpan={8} className="py-4 px-3">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[#FEE2E2] border border-[#FCA5A5]">
                    <AlertTriangle size={16} className="text-[#DC2626] flex-shrink-0" />
                    <span className="text-[13px] font-semibold text-[#DC2626]">Failed to load messages. Please try again.</span>
                    <button
                      onClick={handleRetry}
                      className="flex items-center gap-2 h-8 px-3 rounded-lg text-[12px] font-semibold bg-[#DC2626] text-white hover:opacity-90 cursor-pointer transition-opacity whitespace-nowrap"
                    >
                      <RefreshCw size={14} />
                      Retry
                    </button>
                  </div>
                </td>
              </tr>
            )}

            {!error && loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="border-b border-[#F1F5F9]">
                  {Array.from({ length: 8 }).map((_, j) => (
                    <td key={j} className="py-3 px-3">
                      <div className="h-4 bg-[#F1F5F9] rounded animate-pulse" style={{ width: j === 2 ? "100px" : j === 6 ? "80px" : "60px" }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : !error && !loading && msgList.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-[#F1F5F9] flex items-center justify-center">
                      <FileText size={28} className="text-[#94A3B8]" />
                    </div>
                    <p className="text-[14px] font-semibold text-[#64748B]">No recent messages.</p>
                  </div>
                </td>
              </tr>
            ) : !error && !loading && (
              msgList.map((msg) => {
                const sc = statusConfig[msg.status];
                const tc = typeConfig[msg.type];
                return (
                  <tr key={msg.id} className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center h-5 px-2 rounded-full text-[11px] font-bold whitespace-nowrap" style={{ backgroundColor: tc.bg, color: tc.text }}>
                        {msg.type}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[12px] font-bold font-mono text-[#0F172A]">{msg.station}</td>
                    <td className="py-3 px-3 text-[12px] font-mono text-[#1B4F8B]">{msg.flightRef}</td>
                    <td className="py-3 px-3 text-[12px] text-[#64748B] whitespace-nowrap">{msg.date}</td>
                    <td className="py-3 px-3 text-[12px] text-[#64748B] font-mono">{msg.time}</td>
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
                          onClick={() => handleView(msg)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors"
                          title="View"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => handleEdit(msg)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors"
                          title="Edit / Correct"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDownload(msg)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors"
                          title="Download"
                        >
                          <FileText size={14} />
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
  );
}