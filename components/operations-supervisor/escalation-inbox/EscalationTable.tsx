"use client";

import { useState } from "react";
import { MoreHorizontal, FileSearch, CheckCircle, XCircle, UserPlus, ArrowUpRight, StickyNote, Clock, AlertTriangle, Shield, Package, DollarSign, Bot, Truck, Warehouse, Radio, Archive, Ban } from "lucide-react";

const escalations = [
  { id: "ESC-2026-00101", sourceModule: "Warehouse", awb: "214-45678901", issueType: "Damage", priority: "High" as const, createdAt: "01 Jun 2026 10:45", age: "2h", assignedTo: "Imran Ali", status: "Awaiting Decision" as const, description: "Visible damage to outer packaging on 4 pieces during putaway scan.", createdBy: "Ahmed Khan", slaDeadline: "01 Jun 2026 14:45", relatedEntity: "Piece-4421", evidenceCount: 3, decisionNotes: "" },
  { id: "ESC-2026-00102", sourceModule: "Gate Entry", awb: "157-90811223", issueType: "Gate Mismatch", priority: "Critical" as const, createdAt: "01 Jun 2026 11:10", age: "1h 30m", assignedTo: "Nadeem Shah", status: "Open" as const, description: "Vehicle manifest does not match gate pass entry. Discrepancy of 2 pieces.", createdBy: "Tariq Mehmood", slaDeadline: "01 Jun 2026 13:10", relatedEntity: "Gate-03", evidenceCount: 2, decisionNotes: "" },
  { id: "ESC-2026-00103", sourceModule: "Finance", awb: "074-88219033", issueType: "Payment Hold", priority: "Medium" as const, createdAt: "01 Jun 2026 11:35", age: "1h", assignedTo: "Sana Khan", status: "Reassigned" as const, description: "Invoice holds due to missing tariff mapping for AFU cargo class.", createdBy: "Faisal Qureshi", slaDeadline: "01 Jun 2026 15:35", relatedEntity: "INV-2026-05231", evidenceCount: 1, decisionNotes: "Reassigned to Finance Manager for tariff review" },
  { id: "ESC-2026-00104", sourceModule: "Excise", awb: "117-55443321", issueType: "Customs Hold", priority: "High" as const, createdAt: "01 Jun 2026 09:20", age: "3h 30m", assignedTo: "Imran Ali", status: "Open" as const, description: "Section 82 applied due to missing FWB message. Customs coordination needed.", createdBy: "Compliance Officer", slaDeadline: "01 Jun 2026 12:20", relatedEntity: "Customs-CHK-44", evidenceCount: 2, decisionNotes: "" },
  { id: "ESC-2026-00105", sourceModule: "Planner", awb: "117-98765432", issueType: "Rack Conflict", priority: "Medium" as const, createdAt: "01 Jun 2026 12:00", age: "45m", assignedTo: "Kamran Hussain", status: "Awaiting Decision" as const, description: "Double-booked rack location in Cold Chain zone. Pick pending.", createdBy: "System", slaDeadline: "01 Jun 2026 15:00", relatedEntity: "Rack-COL-A12", evidenceCount: 1, decisionNotes: "" },
  { id: "ESC-2026-00106", sourceModule: "Lifter", awb: "117-11223344", issueType: "RFID Mismatch", priority: "Low" as const, createdAt: "01 Jun 2026 08:30", age: "4h", assignedTo: "Faisal Qureshi", status: "Closed" as const, description: "RFID scan returned different piece ID than expected during movement.", createdBy: "Bilal Raza", slaDeadline: "01 Jun 2026 10:30", relatedEntity: "Piece-8842", evidenceCount: 2, decisionNotes: "Resolved via manual override. Verified by supervisor." },
  { id: "ESC-2026-00107", sourceModule: "Warehouse", awb: "214-66778899", issueType: "Shortage", priority: "High" as const, createdAt: "01 Jun 2026 10:15", age: "2h 15m", assignedTo: "Nadeem Shah", status: "Open" as const, description: "Physical count shows 38 pieces vs expected 42. Shortage of 4 pieces.", createdBy: "Sana Iqbal", slaDeadline: "01 Jun 2026 14:15", relatedEntity: "AWB-214-66778899", evidenceCount: 4, decisionNotes: "" },
  { id: "ESC-2026-00108", sourceModule: "Gate Entry", awb: "157-00112233", issueType: "Missing Docs", priority: "Medium" as const, createdAt: "01 Jun 2026 11:50", age: "55m", assignedTo: "Imran Ali", status: "Awaiting Decision" as const, description: "Driver arrived without authority letter. Vehicle cannot enter premises.", createdBy: "Zubair Ahmed", slaDeadline: "01 Jun 2026 13:50", relatedEntity: "Vehicle-TK-708", evidenceCount: 1, decisionNotes: "" },
  { id: "ESC-2026-00109", sourceModule: "Warehouse", awb: "214-33445566", issueType: "Cold-chain Anomaly", priority: "Critical" as const, createdAt: "01 Jun 2026 09:45", age: "3h", assignedTo: "Sana Khan", status: "Open" as const, description: "Cold room temperature exceeded 8°C for 12 minutes during storage.", createdBy: "System", slaDeadline: "01 Jun 2026 11:45", relatedEntity: "Cold Room COL", evidenceCount: 3, decisionNotes: "" },
  { id: "ESC-2026-00110", sourceModule: "Excise", awb: "117-77889900", issueType: "Long-stay Alert", priority: "Medium" as const, createdAt: "01 Jun 2026 08:00", age: "4h 45m", assignedTo: "Kamran Hussain", status: "Reassigned" as const, description: "AWB has exceeded 72 hours in storage without customs clearance. Section 82 triggered.", createdBy: "System", slaDeadline: "01 Jun 2026 12:00", relatedEntity: "AWB-117-77889900", evidenceCount: 2, decisionNotes: "Reassigned to Customs Coordination team" },
  { id: "ESC-2026-00111", sourceModule: "Finance", awb: "074-12345678", issueType: "Payment Hold", priority: "Low" as const, createdAt: "01 Jun 2026 12:20", age: "30m", assignedTo: "Faisal Qureshi", status: "Awaiting Decision" as const, description: "Partial payment received. Balance pending for waiver approval.", createdBy: "Finance User", slaDeadline: "01 Jun 2026 16:20", relatedEntity: "INV-2026-05240", evidenceCount: 1, decisionNotes: "" },
  { id: "ESC-2026-00112", sourceModule: "Warehouse", awb: "214-55667788", issueType: "Damage", priority: "Medium" as const, createdAt: "01 Jun 2026 10:00", age: "2h 45m", assignedTo: "Imran Ali", status: "Approved" as const, description: "Crush damage on ULD detected during offload. Photos attached.", createdBy: "Owais Khan", slaDeadline: "01 Jun 2026 14:00", relatedEntity: "ULD-03", evidenceCount: 5, decisionNotes: "Approved for insurance claim. Forwarded to Finance." },
  { id: "ESC-2026-00113", sourceModule: "Planner", awb: "117-00998877", issueType: "Rack Conflict", priority: "High" as const, createdAt: "01 Jun 2026 11:30", age: "1h 15m", assignedTo: "Nadeem Shah", status: "Open" as const, description: "Two AWBs assigned to same ULD Bay 02 slot. Conflict requires resolution.", createdBy: "System", slaDeadline: "01 Jun 2026 13:30", relatedEntity: "ULD Bay 02", evidenceCount: 2, decisionNotes: "" },
  { id: "ESC-2026-00114", sourceModule: "Gate Entry", awb: "157-44556677", issueType: "Gate Mismatch", priority: "Low" as const, createdAt: "01 Jun 2026 12:45", age: "15m", assignedTo: "Kamran Hussain", status: "Closed" as const, description: "Minor weight discrepancy on gate weighbridge. Within tolerance.", createdBy: "Tariq Mehmood", slaDeadline: "01 Jun 2026 14:45", relatedEntity: "Gate-01", evidenceCount: 1, decisionNotes: "Closed. Within 2% tolerance. No action required." },
  { id: "ESC-2026-00115", sourceModule: "Excise", awb: "117-22334455", issueType: "Customs Hold", priority: "High" as const, createdAt: "01 Jun 2026 09:00", age: "3h 45m", assignedTo: "Sana Khan", status: "Rejected" as const, description: "Request for early release without complete FHL documentation.", createdBy: "Compliance Officer", slaDeadline: "01 Jun 2026 11:00", relatedEntity: "Customs-CHK-51", evidenceCount: 2, decisionNotes: "Rejected. Full FHL required before release." },
];

const priorityColor: Record<string, { bg: string; text: string }> = {
  Low: { bg: "#F1F5F9", text: "#64748B" },
  Medium: { bg: "#FEF3C7", text: "#D97706" },
  High: { bg: "#FEE2E2", text: "#DC2626" },
  Critical: { bg: "#DC2626", text: "#FFFFFF" },
};

const statusColor: Record<string, { bg: string; text: string }> = {
  Open: { bg: "#FEE2E2", text: "#DC2626" },
  "Awaiting Decision": { bg: "#FEF3C7", text: "#D97706" },
  Reassigned: { bg: "#DBEAFE", text: "#1B4F8B" },
  Approved: { bg: "#DCFCE7", text: "#16A34A" },
  Rejected: { bg: "#F1F5F9", text: "#64748B" },
  Closed: { bg: "#F1F5F9", text: "#64748B" },
};

const moduleIcon: Record<string, React.ReactNode> = {
  Warehouse: <Warehouse size={14} className="text-[#1B4F8B]" />,
  "Gate Entry": <Truck size={14} className="text-[#1B4F8B]" />,
  Finance: <DollarSign size={14} className="text-[#1B4F8B]" />,
  Excise: <Shield size={14} className="text-[#1B4F8B]" />,
  Planner: <Archive size={14} className="text-[#1B4F8B]" />,
  Lifter: <Bot size={14} className="text-[#1B4F8B]" />,
};

const issueIcon: Record<string, React.ReactNode> = {
  Damage: <AlertTriangle size={14} className="text-[#DC2626]" />,
  Shortage: <Package size={14} className="text-[#D97706]" />,
  "Missing Docs": <FileSearch size={14} className="text-[#64748B]" />,
  "Customs Hold": <Ban size={14} className="text-[#DC2626]" />,
  "Payment Hold": <DollarSign size={14} className="text-[#D97706]" />,
  "Gate Mismatch": <Truck size={14} className="text-[#DC2626]" />,
  "RFID Mismatch": <Radio size={14} className="text-[#D97706]" />,
  "Rack Conflict": <Archive size={14} className="text-[#D97706]" />,
  "Cold-chain Anomaly": <AlertTriangle size={14} className="text-[#DC2626]" />,
  "Long-stay Alert": <Clock size={14} className="text-[#D97706]" />,
};

export default function EscalationTable({ onViewDetail }: { onViewDetail: (id: string) => void }) {
  const [actionRow, setActionRow] = useState<number | null>(null);

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[15px] font-bold text-[#0F172A]">Escalation Inbox</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] text-left">
          <thead>
            <tr className="border-b border-[#E2E8F0]">
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Escalation ID</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Source</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">AWB #</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Issue Type</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Priority</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Created At</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Age</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Assigned To</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Status</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody>
            {escalations.map((e, i) => {
              const pc = priorityColor[e.priority];
              const sc = statusColor[e.status];
              return (
                <tr key={i} className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-3 px-3 text-[12px] font-semibold text-[#0F172A]">{e.id}</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5 text-[12px] text-[#0F172A]">
                      {moduleIcon[e.sourceModule] || <Shield size={14} className="text-[#1B4F8B]" />}
                      {e.sourceModule}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-[12px] text-[#1B4F8B] font-medium">{e.awb}</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5 text-[12px] text-[#0F172A]">
                      {issueIcon[e.issueType] || <AlertTriangle size={14} className="text-[#64748B]" />}
                      {e.issueType}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center h-5 px-2 rounded-full text-[11px] font-semibold" style={{ backgroundColor: pc.bg, color: pc.text }}>
                      {e.priority}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-[12px] text-[#64748B]">{e.createdAt}</td>
                  <td className="py-3 px-3 text-[12px] font-medium text-[#0F172A]">{e.age}</td>
                  <td className="py-3 px-3 text-[12px] text-[#0F172A]">{e.assignedTo}</td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center h-5 px-2 rounded-full text-[11px] font-semibold" style={{ backgroundColor: sc.bg, color: sc.text }}>
                      {e.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 relative">
                    <button onClick={() => setActionRow(actionRow === i ? null : i)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors">
                      <MoreHorizontal size={16} />
                    </button>
                    {actionRow === i && (
                      <div className="absolute right-3 top-10 z-10 w-[180px] bg-white rounded-xl shadow-lg border border-[#E2E8F0] overflow-hidden">
                        <button onClick={() => { setActionRow(null); onViewDetail(e.id); }} className="w-full text-left px-3 py-2 text-[12px] font-medium text-[#0F172A] hover:bg-[#F8FAFC] flex items-center gap-2 cursor-pointer">
                          <FileSearch size={14} /> View Detail
                        </button>
                        <button onClick={() => setActionRow(null)} className="w-full text-left px-3 py-2 text-[12px] font-medium text-[#16A34A] hover:bg-[#F8FAFC] flex items-center gap-2 cursor-pointer">
                          <CheckCircle size={14} /> Approve
                        </button>
                        <button onClick={() => setActionRow(null)} className="w-full text-left px-3 py-2 text-[12px] font-medium text-[#DC2626] hover:bg-[#F8FAFC] flex items-center gap-2 cursor-pointer">
                          <XCircle size={14} /> Reject
                        </button>
                        <button onClick={() => setActionRow(null)} className="w-full text-left px-3 py-2 text-[12px] font-medium text-[#0F172A] hover:bg-[#F8FAFC] flex items-center gap-2 cursor-pointer">
                          <UserPlus size={14} /> Reassign
                        </button>
                        <button onClick={() => setActionRow(null)} className="w-full text-left px-3 py-2 text-[12px] font-medium text-[#D97706] hover:bg-[#F8FAFC] flex items-center gap-2 cursor-pointer">
                          <ArrowUpRight size={14} /> Escalate
                        </button>
                        <button onClick={() => setActionRow(null)} className="w-full text-left px-3 py-2 text-[12px] font-medium text-[#0F172A] hover:bg-[#F8FAFC] flex items-center gap-2 cursor-pointer">
                          <StickyNote size={14} /> Add Note
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