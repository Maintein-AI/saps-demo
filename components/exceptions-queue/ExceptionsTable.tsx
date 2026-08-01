"use client";
import DataTable from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";
import {
  Eye,
  UserPlus,
  CheckCircle,
  ArrowUpCircle,
  FileText,
  ExternalLink,
  StickyNote,
} from "lucide-react";

interface ExceptionsTableProps {
  onViewDetail: (cdrId: string) => void;
  onAssign: (cdrId: string) => void;
  onMarkResolved: (cdrId: string) => void;
  onEscalate: (cdrId: string) => void;
  onAddNote: (cdrId: string) => void;
  onLinkToAWB: (awb: string) => void;
}

const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  Open: { bg: "#FEF3C7", text: "#D97706", dot: "#D97706" },
  "Under Review": { bg: "#DBEAFE", text: "#1B4F8B", dot: "#2E75B6" },
  Assigned: { bg: "#E0E7FF", text: "#4338CA", dot: "#4338CA" },
  Escalated: { bg: "#FEE2E2", text: "#DC2626", dot: "#DC2626" },
  Resolved: { bg: "#DCFCE7", text: "#16A34A", dot: "#16A34A" },
  Closed: { bg: "#F1F5F9", text: "#64748B", dot: "#94A3B8" },
};

const priorityConfig: Record<string, { bg: string; text: string }> = {
  High: { bg: "#FEE2E2", text: "#DC2626" },
  Medium: { bg: "#FEF3C7", text: "#D97706" },
  Low: { bg: "#F1F5F9", text: "#64748B" },
};

function ExceptionStatusBadge({ status }: { status: string }) {
  const c = statusConfig[status] || { bg: "#F1F5F9", text: "#64748B", dot: "#94A3B8" };
  return (
    <span
      className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full text-[11px] font-semibold"
      style={{ backgroundColor: c.bg, color: c.text }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c.dot }} />
      {status}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const c = priorityConfig[priority] || { bg: "#F1F5F9", text: "#64748B" };
  return (
    <span
      className="inline-flex items-center h-6 px-2.5 rounded-full text-[11px] font-semibold"
      style={{ backgroundColor: c.bg, color: c.text }}
    >
      {priority}
    </span>
  );
}

const columns = [
  { key: "cdr", header: "CDR #", width: "130px", sortable: true },
  { key: "awb", header: "AWB #", width: "130px", sortable: true },
  { key: "type", header: "Type", width: "130px", sortable: true },
  { key: "pieces", header: "Pieces", width: "70px", sortable: true },
  { key: "created", header: "Created", width: "160px", sortable: true },
  { key: "owner", header: "Owner", width: "120px", sortable: true },
  { key: "status", header: "Status", width: "110px", sortable: true },
  { key: "age", header: "Age", width: "80px", sortable: true },
  { key: "priority", header: "Priority", width: "80px", sortable: true },
  { key: "action", header: "Action", width: "100px" },
];

const rows = [
  { cdr: "CDR-2026-00091", awb: "214-45678901", type: "Damage", pieces: "2", created: "31 May 2026 10:25", owner: "Imran Ali", status: "Open", age: "2h 15m", priority: "High" },
  { cdr: "CDR-2026-00092", awb: "157-90811223", type: "Missing Documents", pieces: "1", created: "31 May 2026 11:05", owner: "Sana Khan", status: "Under Review", age: "1h 35m", priority: "Medium" },
  { cdr: "CDR-2026-00093", awb: "074-88219033", type: "Wrong Weight", pieces: "4", created: "31 May 2026 11:40", owner: "Ahmed Khan", status: "Escalated", age: "1h 00m", priority: "High" },
  { cdr: "CDR-2026-00094", awb: "214-45678901", type: "Shortage", pieces: "3", created: "31 May 2026 09:15", owner: "Fatima Raza", status: "Assigned", age: "3h 25m", priority: "High" },
  { cdr: "CDR-2026-00095", awb: "382-11100222", type: "Overage", pieces: "1", created: "31 May 2026 08:50", owner: "Bilal Ahmed", status: "Open", age: "3h 50m", priority: "Medium" },
  { cdr: "CDR-2026-00096", awb: "214-45678901", type: "Leakage / Wet Cargo", pieces: "2", created: "31 May 2026 07:30", owner: "Unassigned", status: "Open", age: "5h 10m", priority: "High" },
  { cdr: "CDR-2026-00097", awb: "157-90811223", type: "Tampering", pieces: "1", created: "31 May 2026 10:00", owner: "Imran Ali", status: "Under Review", age: "2h 40m", priority: "High" },
  { cdr: "CDR-2026-00098", awb: "074-88219033", type: "Pilferage", pieces: "2", created: "31 May 2026 09:45", owner: "Sana Khan", status: "Assigned", age: "2h 55m", priority: "High" },
  { cdr: "CDR-2026-00099", awb: "382-11100222", type: "Misrouted", pieces: "5", created: "31 May 2026 08:10", owner: "Ahmed Khan", status: "Open", age: "4h 30m", priority: "Medium" },
  { cdr: "CDR-2026-00100", awb: "214-45678901", type: "Damage", pieces: "1", created: "31 May 2026 11:20", owner: "Unassigned", status: "Open", age: "1h 20m", priority: "Low" },
  { cdr: "CDR-2026-00101", awb: "157-90811223", type: "Missing Documents", pieces: "2", created: "31 May 2026 07:00", owner: "Fatima Raza", status: "Under Review", age: "5h 40m", priority: "Medium" },
  { cdr: "CDR-2026-00102", awb: "074-88219033", type: "Wrong Weight", pieces: "3", created: "31 May 2026 10:30", owner: "Bilal Ahmed", status: "Assigned", age: "2h 10m", priority: "Low" },
  { cdr: "CDR-2026-00103", awb: "382-11100222", type: "Shortage", pieces: "1", created: "31 May 2026 11:00", owner: "Imran Ali", status: "Open", age: "1h 40m", priority: "Medium" },
  { cdr: "CDR-2026-00104", awb: "214-45678901", type: "Overage", pieces: "1", created: "31 May 2026 09:00", owner: "Sana Khan", status: "Resolved", age: "3h 40m", priority: "Low" },
  { cdr: "CDR-2026-00105", awb: "157-90811223", type: "Leakage / Wet Cargo", pieces: "3", created: "31 May 2026 08:30", owner: "Ahmed Khan", status: "Closed", age: "4h 10m", priority: "High" },
  { cdr: "CDR-2026-00106", awb: "074-88219033", type: "Damage", pieces: "2", created: "31 May 2026 10:10", owner: "Fatima Raza", status: "Under Review", age: "2h 30m", priority: "Medium" },
  { cdr: "CDR-2026-00107", awb: "382-11100222", type: "Missing Documents", pieces: "1", created: "31 May 2026 11:30", owner: "Bilal Ahmed", status: "Open", age: "50m", priority: "Low" },
  { cdr: "CDR-2026-00108", awb: "214-45678901", type: "Wrong Weight", pieces: "2", created: "31 May 2026 09:20", owner: "Unassigned", status: "Escalated", age: "3h 20m", priority: "High" },
  { cdr: "CDR-2026-00109", awb: "157-90811223", type: "Tampering", pieces: "1", created: "31 May 2026 10:45", owner: "Imran Ali", status: "Assigned", age: "1h 55m", priority: "Medium" },
  { cdr: "CDR-2026-00110", awb: "074-88219033", type: "Pilferage", pieces: "1", created: "31 May 2026 11:15", owner: "Sana Khan", status: "Open", age: "1h 25m", priority: "High" },
  { cdr: "CDR-2026-00111", awb: "382-11100222", type: "Misrouted", pieces: "2", created: "31 May 2026 08:45", owner: "Ahmed Khan", status: "Under Review", age: "3h 55m", priority: "Medium" },
  { cdr: "CDR-2026-00112", awb: "214-45678901", type: "Overage", pieces: "1", created: "31 May 2026 07:45", owner: "Fatima Raza", status: "Resolved", age: "4h 55m", priority: "Low" },
  { cdr: "CDR-2026-00113", awb: "157-90811223", type: "Damage", pieces: "3", created: "31 May 2026 10:05", owner: "Bilal Ahmed", status: "Open", age: "2h 35m", priority: "High" },
  { cdr: "CDR-2026-00114", awb: "074-88219033", type: "Shortage", pieces: "1", created: "31 May 2026 11:25", owner: "Unassigned", status: "Open", age: "55m", priority: "Medium" },
];

export default function ExceptionsTable({
  onViewDetail,
  onAssign,
  onMarkResolved,
  onEscalate,
  onAddNote,
  onLinkToAWB,
}: ExceptionsTableProps) {
  const tableRows = rows.map((r) => ({
    cdr: <span className="text-[13px] font-semibold text-[#0B2545] font-mono">{r.cdr}</span>,
    awb: (
      <button
        onClick={() => onLinkToAWB(r.awb)}
        className="text-[13px] font-medium text-[#1B4F8B] hover:underline cursor-pointer"
      >
        {r.awb}
      </button>
    ),
    type: <span className="text-[13px] text-[#0F172A]">{r.type}</span>,
    pieces: <span className="text-[13px] text-[#0F172A]">{r.pieces}</span>,
    created: <span className="text-[13px] text-[#64748B]">{r.created}</span>,
    owner: <span className="text-[13px] text-[#0F172A]">{r.owner}</span>,
    status: <ExceptionStatusBadge status={r.status} />,
    age: <span className="text-[13px] text-[#0F172A]">{r.age}</span>,
    priority: <PriorityBadge priority={r.priority} />,
    action: <span className="text-[13px] text-[#1B4F8B] font-medium">View</span>,
  }));

  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-white overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-[#E2E8F0]">
        <h2 className="text-[16px] font-bold text-[#0F172A]">Open Exceptions</h2>
        <span className="ml-auto text-[12px] text-[#64748B]">{rows.length} records</span>
      </div>
      <div className="p-4">
        <DataTable
          columns={columns}
          rows={tableRows}
          zebra
          sortable
          rowActions={(_row, index) => {
            const rowData = rows[index];
            return (
              <div className="flex flex-col">
                <button
                  onClick={() => onViewDetail(rowData.cdr)}
                  className="flex items-center gap-2 px-3 py-2 text-[12px] text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer text-left transition-colors"
                >
                  <Eye size={14} className="text-[#1B4F8B]" />
                  View Detail
                </button>
                <button
                  onClick={() => onAssign(rowData.cdr)}
                  className="flex items-center gap-2 px-3 py-2 text-[12px] text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer text-left transition-colors"
                >
                  <UserPlus size={14} className="text-[#1B4F8B]" />
                  Assign Owner
                </button>
                <button
                  onClick={() => onMarkResolved(rowData.cdr)}
                  className="flex items-center gap-2 px-3 py-2 text-[12px] text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer text-left transition-colors"
                >
                  <CheckCircle size={14} className="text-[#16A34A]" />
                  Mark Resolved
                </button>
                <button
                  onClick={() => onEscalate(rowData.cdr)}
                  className="flex items-center gap-2 px-3 py-2 text-[12px] text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer text-left transition-colors"
                >
                  <ArrowUpCircle size={14} className="text-[#DC2626]" />
                  Escalate
                </button>
                <button
                  onClick={() => onLinkToAWB(rowData.awb)}
                  className="flex items-center gap-2 px-3 py-2 text-[12px] text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer text-left transition-colors"
                >
                  <ExternalLink size={14} className="text-[#1B4F8B]" />
                  Link to AWB
                </button>
                <button
                  onClick={() => onAddNote(rowData.cdr)}
                  className="flex items-center gap-2 px-3 py-2 text-[12px] text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer text-left transition-colors"
                >
                  <StickyNote size={14} className="text-[#64748B]" />
                  Add Note
                </button>
              </div>
            );
          }}
        />
      </div>
    </div>
  );
}