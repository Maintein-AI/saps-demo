"use client";

import { X, CheckCircle, XCircle, UserPlus, ArrowUpRight, StickyNote, FileSearch, Clock, History, Shield, Package, DollarSign, Bot, Truck, Warehouse, Archive, AlertTriangle, Ban, Radio } from "lucide-react";
import ScopeBadge from "@/components/ScopeBadge";

const detailData: Record<string, {
  id: string; sourceModule: string; awb: string; relatedEntity: string; issueType: string;
  priority: string; description: string; createdBy: string; createdAt: string;
  assignedTo: string; slaDeadline: string; status: string; decisionNotes: string; evidenceCount: number;
}> = {
  "ESC-2026-00101": {
    id: "ESC-2026-00101", sourceModule: "Warehouse", awb: "214-45678901", relatedEntity: "Piece-4421", issueType: "Damage",
    priority: "High", description: "Visible damage to outer packaging on 4 pieces during putaway scan. Photos captured at bay 02.", createdBy: "Ahmed Khan", createdAt: "01 Jun 2026 10:45",
    assignedTo: "Imran Ali", slaDeadline: "01 Jun 2026 14:45", status: "Awaiting Decision", decisionNotes: "", evidenceCount: 3,
  },
  "ESC-2026-00102": {
    id: "ESC-2026-00102", sourceModule: "Gate Entry", awb: "157-90811223", relatedEntity: "Gate-03", issueType: "Gate Mismatch",
    priority: "Critical", description: "Vehicle manifest does not match gate pass entry. Discrepancy of 2 pieces detected at weighbridge.", createdBy: "Tariq Mehmood", createdAt: "01 Jun 2026 11:10",
    assignedTo: "Nadeem Shah", slaDeadline: "01 Jun 2026 13:10", status: "Open", decisionNotes: "", evidenceCount: 2,
  },
  "ESC-2026-00103": {
    id: "ESC-2026-00103", sourceModule: "Finance", awb: "074-88219033", relatedEntity: "INV-2026-05231", issueType: "Payment Hold",
    priority: "Medium", description: "Invoice holds due to missing tariff mapping for AFU cargo class. Awaiting tariff master update.", createdBy: "Faisal Qureshi", createdAt: "01 Jun 2026 11:35",
    assignedTo: "Sana Khan", slaDeadline: "01 Jun 2026 15:35", status: "Reassigned", decisionNotes: "Reassigned to Finance Manager for tariff review", evidenceCount: 1,
  },
};

const moduleIcon: Record<string, React.ReactNode> = {
  Warehouse: <Warehouse size={16} className="text-[#1B4F8B]" />,
  "Gate Entry": <Truck size={16} className="text-[#1B4F8B]" />,
  Finance: <DollarSign size={16} className="text-[#1B4F8B]" />,
  Excise: <Shield size={16} className="text-[#1B4F8B]" />,
  Planner: <Archive size={16} className="text-[#1B4F8B]" />,
  Lifter: <Bot size={16} className="text-[#1B4F8B]" />,
};

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

interface DetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  escalationId: string;
}

export default function DetailDrawer({ isOpen, onClose, escalationId }: DetailDrawerProps) {
  const data = detailData[escalationId] || detailData["ESC-2026-00101"];
  const pc = priorityColor[data.priority];
  const sc = statusColor[data.status] || { bg: "#F1F5F9", text: "#64748B" };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300" onClick={onClose} />
      )}
      <div className="fixed top-0 right-0 h-full bg-white shadow-xl z-[70] transition-transform duration-300 ease-out flex flex-col" style={{ width: "100%", maxWidth: 460, transform: isOpen ? "translateX(0)" : "translateX(100%)" }}>
        <div className="flex items-center justify-between px-5 h-[64px] border-b border-[#E2E8F0] flex-shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="text-[16px] font-bold text-[#0F172A]">Escalation Detail</h2>
            <ScopeBadge type="inc" />
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#EBF0F7] flex items-center justify-center text-[#1B4F8B]">
              {moduleIcon[data.sourceModule] || <Shield size={24} />}
            </div>
            <div>
              <div className="text-[16px] font-bold text-[#0F172A]">{data.id}</div>
              <div className="text-[12px] text-[#64748B]">{data.sourceModule} • {data.issueType}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center h-6 px-2.5 rounded-full text-[11px] font-semibold" style={{ backgroundColor: pc.bg, color: pc.text }}>
              {data.priority}
            </span>
            <span className="inline-flex items-center h-6 px-2.5 rounded-full text-[11px] font-semibold" style={{ backgroundColor: sc.bg, color: sc.text }}>
              {data.status}
            </span>
          </div>

          <div className="rounded-xl border border-[#E2E8F0] p-4 space-y-3">
            <div className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider mb-2">Details</div>
            <div className="flex justify-between">
              <span className="text-[12px] text-[#64748B]">AWB #</span>
              <span className="text-[12px] font-medium text-[#1B4F8B]">{data.awb}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[12px] text-[#64748B]">Related Entity</span>
              <span className="text-[12px] font-medium text-[#0F172A]">{data.relatedEntity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[12px] text-[#64748B]">Created By</span>
              <span className="text-[12px] font-medium text-[#0F172A]">{data.createdBy}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[12px] text-[#64748B]">Created At</span>
              <span className="text-[12px] font-medium text-[#0F172A]">{data.createdAt}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[12px] text-[#64748B]">Assigned To</span>
              <span className="text-[12px] font-medium text-[#0F172A]">{data.assignedTo}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[12px] text-[#64748B]">SLA Deadline</span>
              <span className="text-[12px] font-medium text-[#DC2626]">{data.slaDeadline}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[12px] text-[#64748B]">Evidence</span>
              <span className="text-[12px] font-medium text-[#0F172A]">{data.evidenceCount} items</span>
            </div>
          </div>

          <div className="rounded-xl border border-[#E2E8F0] p-4">
            <div className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider mb-2">Description</div>
            <p className="text-[13px] text-[#334155] leading-relaxed">{data.description}</p>
          </div>

          {data.decisionNotes && (
            <div className="rounded-xl border border-[#E2E8F0] p-4">
              <div className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider mb-2">Decision Notes</div>
              <p className="text-[13px] text-[#334155] leading-relaxed">{data.decisionNotes}</p>
            </div>
          )}

          <div className="rounded-xl border border-[#E2E8F0] p-4">
            <div className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider mb-3">Evidence / Documents</div>
            <div className="space-y-2">
              {Array.from({ length: data.evidenceCount }).map((_, i) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                  <FileSearch size={14} className="text-[#64748B]" />
                  <span className="text-[12px] text-[#0F172A]">Evidence_{data.id}_{String(i + 1).padStart(2, "0")}.jpg</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-5 py-4 border-t border-[#E2E8F0] flex flex-wrap items-center gap-2">
          <button className="flex items-center gap-2 h-9 px-3 rounded-xl text-[12px] font-semibold text-white cursor-pointer hover:opacity-90 transition-colors" style={{ backgroundColor: "#16A34A" }}>
            <CheckCircle size={14} /> Approve
          </button>
          <button className="flex items-center gap-2 h-9 px-3 rounded-xl text-[12px] font-semibold text-white cursor-pointer hover:opacity-90 transition-colors" style={{ backgroundColor: "#DC2626" }}>
            <XCircle size={14} /> Reject
          </button>
          <button className="flex items-center gap-2 h-9 px-3 rounded-xl text-[12px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F1F5F9] cursor-pointer transition-colors">
            <UserPlus size={14} /> Reassign
          </button>
          <button className="flex items-center gap-2 h-9 px-3 rounded-xl text-[12px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F1F5F9] cursor-pointer transition-colors">
            <ArrowUpRight size={14} /> Escalate
          </button>
          <button className="flex items-center gap-2 h-9 px-3 rounded-xl text-[12px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F1F5F9] cursor-pointer transition-colors">
            <StickyNote size={14} /> Note
          </button>
          <button className="flex items-center gap-2 h-9 px-3 rounded-xl text-[12px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F1F5F9] cursor-pointer transition-colors">
            <FileSearch size={14} /> View AWB
          </button>
          <button className="flex items-center gap-2 h-9 px-3 rounded-xl text-[12px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F1F5F9] cursor-pointer transition-colors">
            <History size={14} /> View Audit
          </button>
          <button className="flex items-center gap-2 h-9 px-3 rounded-xl text-[12px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F1F5F9] cursor-pointer transition-colors">
            <X size={14} /> Close
          </button>
        </div>
      </div>
    </>
  );
}