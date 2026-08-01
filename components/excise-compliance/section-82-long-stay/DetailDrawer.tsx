"use client";

import { useState } from "react";
import { useToast } from "@/components/ToastContext";
import { X, FileText, Bell, ArrowUpRight, Gavel, CheckCircle, FileDown, Paperclip, Eye, Calendar, Clock, AlertTriangle } from "lucide-react";

interface LongStayRow {
  id: string;
  caseNum: string;
  awb: string;
  hawb: string;
  consignee: string;
  cargoClass: string;
  pieces: string;
  weight: string;
  arrivalDate: string;
  daysInStorage: number;
  noticeStatus: string;
  currentStage: string;
  customsDecision: string;
  finalDisposition: string;
  owner: string;
  freePeriodExpiry: string;
  escalationDate: string;
  remarks: string;
}

interface DetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  row: LongStayRow | null;
}

export default function DetailDrawer({ isOpen, onClose, row }: DetailDrawerProps) {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  if (!row) return null;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[60] transition-opacity"
          onClick={onClose}
        />
      )}
      <div
        className="fixed top-0 right-0 h-full bg-white shadow-xl z-[70] transition-transform duration-300 ease-out flex flex-col"
        style={{
          width: "100%",
          maxWidth: 440,
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
        }}
      >
        <div className="flex items-center justify-between px-5 h-[64px] border-b border-[#E2E8F0] flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <h2 className="text-[16px] font-bold text-[#0F172A]">Long-Stay Case Detail</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-shrink-0 px-5 pt-4 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-1 mb-4">
            {[
              { key: "overview", label: "Overview" },
              { key: "actions", label: "Actions" },
              { key: "documents", label: "Documents" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="h-9 px-4 rounded-lg text-[13px] font-semibold cursor-pointer transition-colors whitespace-nowrap"
                style={{
                  backgroundColor: activeTab === tab.key ? "#EBF0F7" : "transparent",
                  color: activeTab === tab.key ? "#0B2545" : "#64748B",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {activeTab === "overview" && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle size={14} className="text-[#DC2626]" />
                  <span className="text-[12px] font-semibold text-[#64748B] uppercase">Case Number</span>
                </div>
                <span className="text-[15px] font-bold text-[#0F172A]">{row.caseNum}</span>
              </div>

              <div className="p-4 rounded-xl border border-[#E2E8F0]">
                <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider mb-3">
                  General Information
                </p>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-[13px] text-[#64748B]">AWB #</span>
                    <span className="text-[13px] font-semibold text-[#0F172A]">{row.awb}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[13px] text-[#64748B]">HAWB #</span>
                    <span className="text-[13px] font-semibold text-[#0F172A]">{row.hawb}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[13px] text-[#64748B]">Consignee</span>
                    <span className="text-[13px] font-semibold text-[#0F172A]">{row.consignee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[13px] text-[#64748B]">Cargo Class</span>
                    <span className="text-[13px] font-semibold text-[#64748B] bg-[#F1F5F9] px-2 py-0.5 rounded-lg">{row.cargoClass}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[13px] text-[#64748B]">Pieces</span>
                    <span className="text-[13px] font-semibold text-[#0F172A]">{row.pieces}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[13px] text-[#64748B]">Weight</span>
                    <span className="text-[13px] font-semibold text-[#0F172A]">{row.weight}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-[#E2E8F0]">
                <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider mb-3">
                  Storage & Timeline
                </p>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-[13px] text-[#64748B]">Arrival Date</span>
                    <span className="text-[13px] font-semibold text-[#0F172A]">{row.arrivalDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[13px] text-[#64748B]">Days in Storage</span>
                    <span className="text-[13px] font-bold text-[#DC2626]">{row.daysInStorage} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[13px] text-[#64748B]">Free Period Expiry</span>
                    <span className="text-[13px] font-semibold text-[#0F172A]">{row.freePeriodExpiry}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[13px] text-[#64748B]">Escalation Date</span>
                    <span className="text-[13px] font-semibold text-[#0F172A]">{row.escalationDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[13px] text-[#64748B]">Owner</span>
                    <span className="text-[13px] font-semibold text-[#0F172A]">{row.owner}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-[#E2E8F0]">
                <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider mb-3">
                  Status & Decisions
                </p>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-[13px] text-[#64748B]">Notice Status</span>
                    <span className="text-[13px] font-semibold text-[#0F172A]">{row.noticeStatus}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[13px] text-[#64748B]">Current Stage</span>
                    <span className="text-[13px] font-semibold text-[#0F172A]">{row.currentStage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[13px] text-[#64748B]">Customs Decision</span>
                    <span className="text-[13px] font-semibold text-[#0F172A]">{row.customsDecision}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[13px] text-[#64748B]">Final Disposition</span>
                    <span className="text-[13px] font-semibold text-[#0F172A]">{row.finalDisposition}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[13px] text-[#64748B]">Remarks</span>
                    <span className="text-[13px] font-semibold text-[#0F172A] max-w-[200px] text-right">{row.remarks}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "actions" && (
            <div className="space-y-3">
              <button
                onClick={() => {
                  addToast(`Notice generated for ${row.caseNum}`, "success");
                }}
                className="w-full flex items-center gap-3 h-12 px-4 rounded-xl border border-[#E2E8F0] hover:bg-[#F8FAFC] text-left cursor-pointer transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-[#FEF3C7] flex items-center justify-center">
                  <Bell size={16} className="text-[#D97706]" />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-[#0F172A]">Generate Notice</p>
                  <p className="text-[11px] text-[#64748B]">Send formal notice to consignee</p>
                </div>
              </button>

              <button
                onClick={() => {
                  addToast(`Case ${row.caseNum} marked as notified`, "success");
                }}
                className="w-full flex items-center gap-3 h-12 px-4 rounded-xl border border-[#E2E8F0] hover:bg-[#F8FAFC] text-left cursor-pointer transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-[#DCFCE7] flex items-center justify-center">
                  <CheckCircle size={16} className="text-[#16A34A]" />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-[#0F172A]">Mark Notified</p>
                  <p className="text-[11px] text-[#64748B]">Record consignee notification</p>
                </div>
              </button>

              <button
                onClick={() => {
                  addToast(`Case ${row.caseNum} escalated to customs`, "success");
                }}
                className="w-full flex items-center gap-3 h-12 px-4 rounded-xl border border-[#E2E8F0] hover:bg-[#F8FAFC] text-left cursor-pointer transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-[#DBEAFE] flex items-center justify-center">
                  <ArrowUpRight size={16} className="text-[#1B4F8B]" />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-[#0F172A]">Escalate to Customs</p>
                  <p className="text-[11px] text-[#64748B]">Forward case to customs authority</p>
                </div>
              </button>

              <button
                onClick={() => {
                  addToast(`Customs decision recorded for ${row.caseNum}`, "success");
                }}
                className="w-full flex items-center gap-3 h-12 px-4 rounded-xl border border-[#E2E8F0] hover:bg-[#F8FAFC] text-left cursor-pointer transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-[#F3E8FF] flex items-center justify-center">
                  <Gavel size={16} className="text-[#7C3AED]" />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-[#0F172A]">Record Customs Decision</p>
                  <p className="text-[11px] text-[#64748B]">Log customs authority decision</p>
                </div>
              </button>

              <button
                onClick={() => {
                  addToast(`Final disposition recorded for ${row.caseNum}`, "success");
                }}
                className="w-full flex items-center gap-3 h-12 px-4 rounded-xl border border-[#E2E8F0] hover:bg-[#F8FAFC] text-left cursor-pointer transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-[#DCFCE7] flex items-center justify-center">
                  <CheckCircle size={16} className="text-[#16A34A]" />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-[#0F172A]">Record Final Disposition</p>
                  <p className="text-[11px] text-[#64748B]">Set final outcome (release, auction, disposal)</p>
                </div>
              </button>

              <button
                onClick={() => {
                  addToast(`Exporting case ${row.caseNum}`, "success");
                }}
                className="w-full flex items-center gap-3 h-12 px-4 rounded-xl border border-[#E2E8F0] hover:bg-[#F8FAFC] text-left cursor-pointer transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-[#F1F5F9] flex items-center justify-center">
                  <FileDown size={16} className="text-[#64748B]" />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-[#0F172A]">Export Case PDF</p>
                  <p className="text-[11px] text-[#64748B]">Download case report as PDF</p>
                </div>
              </button>
            </div>
          )}

          {activeTab === "documents" && (
            <div className="space-y-3">
              <div className="p-4 rounded-xl border border-[#E2E8F0] flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#DBEAFE] flex items-center justify-center">
                  <FileText size={18} className="text-[#1B4F8B]" />
                </div>
                <div className="flex-1">
                  <p className="text-[13px] font-semibold text-[#0F172A]">notice-001.pdf</p>
                  <p className="text-[11px] text-[#64748B]">First notice — 20 May 2026</p>
                </div>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F1F5F9] text-[#64748B] cursor-pointer transition-colors">
                  <Eye size={14} />
                </button>
              </div>

              <div className="p-4 rounded-xl border border-[#E2E8F0] flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#FEF3C7] flex items-center justify-center">
                  <FileText size={18} className="text-[#D97706]" />
                </div>
                <div className="flex-1">
                  <p className="text-[13px] font-semibold text-[#0F172A]">notice-002.pdf</p>
                  <p className="text-[11px] text-[#64748B]">Final notice — 28 May 2026</p>
                </div>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F1F5F9] text-[#64748B] cursor-pointer transition-colors">
                  <Eye size={14} />
                </button>
              </div>

              <div className="p-4 rounded-xl border border-[#E2E8F0] flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#F1F5F9] flex items-center justify-center">
                  <Paperclip size={18} className="text-[#64748B]" />
                </div>
                <div className="flex-1">
                  <p className="text-[13px] font-semibold text-[#0F172A]">escalation-form.pdf</p>
                  <p className="text-[11px] text-[#64748B]">Escalation to customs — 31 May 2026</p>
                </div>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F1F5F9] text-[#64748B] cursor-pointer transition-colors">
                  <Eye size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}