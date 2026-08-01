"use client";

import { useEffect } from "react";
import { X, User, Clock, FileText, Image as ImageIcon, StickyNote, CheckCircle } from "lucide-react";

const CDR_DATA: Record<string, {
  cdr: string;
  awb: string;
  hawb: string;
  type: string;
  pieces: string;
  description: string;
  createdBy: string;
  createdAt: string;
  assignedOwner: string;
  status: string;
  resolutionNotes: string;
  auditTrail: { time: string; action: string; user: string }[];
}> = {
  "CDR-2026-00091": {
    cdr: "CDR-2026-00091",
    awb: "214-45678901",
    hawb: "HAWB-214-001",
    type: "Damage",
    pieces: "2",
    description: "Crushed corner on two cartons. Visible denting on outer packaging. Inner goods appear intact pending inspection.",
    createdBy: "Ahmed Khan",
    createdAt: "31 May 2026 10:25",
    assignedOwner: "Imran Ali",
    status: "Open",
    resolutionNotes: "Awaiting warehouse inspection report.",
    auditTrail: [
      { time: "31 May 2026 10:25", action: "CDR created", user: "Ahmed Khan" },
      { time: "31 May 2026 10:30", action: "Assigned to Imran Ali", user: "System" },
      { time: "31 May 2026 11:00", action: "Photo evidence uploaded", user: "Imran Ali" },
    ],
  },
  "CDR-2026-00092": {
    cdr: "CDR-2026-00092",
    awb: "157-90811223",
    hawb: "HAWB-157-001",
    type: "Missing Documents",
    pieces: "1",
    description: "Shipper's invoice missing from cargo pouch. Customs declaration present. Fumigation certificate not found.",
    createdBy: "Sana Khan",
    createdAt: "31 May 2026 11:05",
    assignedOwner: "Sana Khan",
    status: "Under Review",
    resolutionNotes: "Contacted forwarder for duplicate invoice.",
    auditTrail: [
      { time: "31 May 2026 11:05", action: "CDR created", user: "Sana Khan" },
      { time: "31 May 2026 11:10", action: "Forwarded to documentation", user: "System" },
      { time: "31 May 2026 11:30", action: "Forwarder contacted", user: "Sana Khan" },
    ],
  },
  "CDR-2026-00093": {
    cdr: "CDR-2026-00093",
    awb: "074-88219033",
    hawb: "HAWB-074-001",
    type: "Wrong Weight",
    pieces: "4",
    description: "Declared weight 210 kg. Actual weighed 247 kg. Variance of +37 kg across 4 pieces.",
    createdBy: "Ahmed Khan",
    createdAt: "31 May 2026 11:40",
    assignedOwner: "Ahmed Khan",
    status: "Escalated",
    resolutionNotes: "Escalated to revenue protection for re-rating.",
    auditTrail: [
      { time: "31 May 2026 11:40", action: "CDR created", user: "Ahmed Khan" },
      { time: "31 May 2026 11:45", action: "Escalated to supervisor", user: "Ahmed Khan" },
      { time: "31 May 2026 12:00", action: "Revenue protection notified", user: "System" },
    ],
  },
};

const DEFAULT_CDR = {
  cdr: "CDR-2026-00091",
  awb: "214-45678901",
  hawb: "HAWB-214-001",
  type: "Damage",
  pieces: "2",
  description: "Crushed corner on two cartons. Visible denting on outer packaging. Inner goods appear intact pending inspection.",
  createdBy: "Ahmed Khan",
  createdAt: "31 May 2026 10:25",
  assignedOwner: "Imran Ali",
  status: "Open",
  resolutionNotes: "Awaiting warehouse inspection report.",
  auditTrail: [
    { time: "31 May 2026 10:25", action: "CDR created", user: "Ahmed Khan" },
    { time: "31 May 2026 10:30", action: "Assigned to Imran Ali", user: "System" },
    { time: "31 May 2026 11:00", action: "Photo evidence uploaded", user: "Imran Ali" },
  ],
};

interface CdrDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cdrId: string | null;
}

export default function CdrDetailDrawer({ isOpen, onClose, cdrId }: CdrDetailDrawerProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const data = cdrId ? (CDR_DATA[cdrId] || DEFAULT_CDR) : DEFAULT_CDR;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300"
          onClick={onClose}
        />
      )}
      <div
        className="fixed top-0 right-0 h-full bg-white shadow-xl z-[70] transition-transform duration-300 ease-out flex flex-col"
        style={{
          width: "100%",
          maxWidth: 420,
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
        }}
      >
        <div className="flex items-center justify-between px-5 h-[64px] border-b border-[#E2E8F0] flex-shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="text-[16px] font-bold text-[#0F172A]">CDR Detail</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <div className="flex flex-col gap-5">
            <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">CDR #</span>
                <span className="text-[14px] font-bold text-[#0B2545] font-mono">{data.cdr}</span>
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">AWB #</span>
                <span className="text-[14px] font-medium text-[#1B4F8B]">{data.awb}</span>
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">HAWB #</span>
                <span className="text-[14px] font-medium text-[#0F172A]">{data.hawb}</span>
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Type</span>
                <span className="text-[14px] font-medium text-[#0F172A]">{data.type}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Pieces Affected</span>
                <span className="text-[14px] font-medium text-[#0F172A]">{data.pieces}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-[#E2E8F0]">
              <div className="flex items-center gap-2 mb-3">
                <FileText size={16} className="text-[#1B4F8B]" />
                <p className="text-[13px] font-bold text-[#0F172A]">Description</p>
              </div>
              <p className="text-[13px] text-[#334155] leading-relaxed">{data.description}</p>
            </div>

            <div className="p-4 rounded-xl border border-[#E2E8F0]">
              <div className="flex items-center gap-2 mb-3">
                <ImageIcon size={16} className="text-[#1B4F8B]" />
                <p className="text-[13px] font-bold text-[#0F172A]">Photos / Evidence</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-lg bg-[#F1F5F9] flex items-center justify-center border border-[#E2E8F0]">
                  <ImageIcon size={20} className="text-[#94A3B8]" />
                </div>
                <div className="w-16 h-16 rounded-lg bg-[#F1F5F9] flex items-center justify-center border border-[#E2E8F0]">
                  <ImageIcon size={20} className="text-[#94A3B8]" />
                </div>
                <div className="w-16 h-16 rounded-lg bg-[#F1F5F9] flex items-center justify-center border border-[#E2E8F0]">
                  <ImageIcon size={20} className="text-[#94A3B8]" />
                </div>
                <span className="text-[12px] text-[#64748B]">3 attachments</span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-[#E2E8F0]">
              <div className="flex items-center gap-2 mb-3">
                <User size={16} className="text-[#1B4F8B]" />
                <p className="text-[13px] font-bold text-[#0F172A]">Assignment & Status</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-[#64748B]">Created by</span>
                  <span className="text-[13px] font-medium text-[#0F172A]">{data.createdBy}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-[#64748B]">Created at</span>
                  <span className="text-[13px] text-[#0F172A]">{data.createdAt}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-[#64748B]">Assigned owner</span>
                  <span className="text-[13px] font-medium text-[#0F172A]">{data.assignedOwner}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-[#64748B]">Current status</span>
                  <span
                    className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full text-[11px] font-semibold"
                    style={{
                      backgroundColor: data.status === "Open" ? "#FEF3C7" : data.status === "Under Review" ? "#DBEAFE" : data.status === "Escalated" ? "#FEE2E2" : "#F1F5F9",
                      color: data.status === "Open" ? "#D97706" : data.status === "Under Review" ? "#1B4F8B" : data.status === "Escalated" ? "#DC2626" : "#64748B",
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: data.status === "Open" ? "#D97706" : data.status === "Under Review" ? "#2E75B6" : data.status === "Escalated" ? "#DC2626" : "#94A3B8" }} />
                    {data.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-[#E2E8F0]">
              <div className="flex items-center gap-2 mb-3">
                <StickyNote size={16} className="text-[#1B4F8B]" />
                <p className="text-[13px] font-bold text-[#0F172A]">Resolution Notes</p>
              </div>
              <p className="text-[13px] text-[#334155] leading-relaxed">{data.resolutionNotes}</p>
            </div>

            <div className="p-4 rounded-xl border border-[#E2E8F0]">
              <div className="flex items-center gap-2 mb-3">
                <Clock size={16} className="text-[#1B4F8B]" />
                <p className="text-[13px] font-bold text-[#0F172A]">Audit Trail</p>
              </div>
              <div className="space-y-3">
                {data.auditTrail.map((entry, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#EBF0F7] flex items-center justify-center mt-0.5">
                      <CheckCircle size={14} className="text-[#1B4F8B]" />
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-[#0F172A]">{entry.action}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[12px] text-[#64748B]">{entry.time}</span>
                        <span className="text-[12px] text-[#94A3B8]">by {entry.user}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}