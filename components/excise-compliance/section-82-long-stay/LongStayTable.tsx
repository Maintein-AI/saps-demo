"use client";

import { useToast } from "@/components/ToastContext";
import {
  Eye,
  FileText,
  Bell,
  ArrowUpRight,
  Gavel,
  CheckCircle,
  FileDown,
} from "lucide-react";

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

interface LongStayTableProps {
  rows: LongStayRow[];
  onViewDetail: (row: LongStayRow) => void;
  onGenerateNotice: (row: LongStayRow) => void;
  onEscalate: (row: LongStayRow) => void;
  onRecordDecision: (row: LongStayRow) => void;
  onRecordDisposition: (row: LongStayRow) => void;
}

const noticeConfig: Record<string, { bg: string; text: string; dot: string }> = {
  "Notice Sent": { bg: "#DBEAFE", text: "#1B4F8B", dot: "#2E75B6" },
  "Escalated": { bg: "#FEF3C7", text: "#D97706", dot: "#D97706" },
  "Final Notice": { bg: "#FEE2E2", text: "#DC2626", dot: "#DC2626" },
};

const stageConfig: Record<string, { bg: string; text: string }> = {
  "Notify": { bg: "#FEF3C7", text: "#D97706" },
  "Escalate": { bg: "#DBEAFE", text: "#1B4F8B" },
  "Customs Decision": { bg: "#F3E8FF", text: "#7C3AED" },
  "Final Disposition": { bg: "#DCFCE7", text: "#16A34A" },
};

const decisionConfig: Record<string, { bg: string; text: string }> = {
  "Pending": { bg: "#F1F5F9", text: "#64748B" },
  "Release Approved": { bg: "#DCFCE7", text: "#16A34A" },
  "Auction": { bg: "#FEE2E2", text: "#DC2626" },
  "Disposal": { bg: "#FEE2E2", text: "#DC2626" },
};

const dispositionConfig: Record<string, { bg: string; text: string }> = {
  "—": { bg: "#F1F5F9", text: "#94A3B8" },
  "Release": { bg: "#DCFCE7", text: "#16A34A" },
  "Auction Pending": { bg: "#FEE2E2", text: "#DC2626" },
  "Disposal Approved": { bg: "#FEE2E2", text: "#DC2626" },
  "Released": { bg: "#DCFCE7", text: "#16A34A" },
};

export default function LongStayTable({
  rows,
  onViewDetail,
  onGenerateNotice,
  onEscalate,
  onRecordDecision,
  onRecordDisposition,
}: LongStayTableProps) {
  const { addToast } = useToast();

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2.5">
          <h2 className="text-[15px] font-bold text-[#0F172A]">Long-Stay Cargo</h2>
          <span className="text-[12px] text-[#64748B] ml-1">{rows.length} records</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1300px]">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
              {[
                "AWB #",
                "HAWB #",
                "Consignee",
                "Cargo Class",
                "Pieces",
                "Weight",
                "Arrival Date",
                "Days in Storage",
                "Notice Status",
                "Current Stage",
                "Customs Decision",
                "Final Disposition",
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
              const nc = noticeConfig[row.noticeStatus] || noticeConfig["Notice Sent"];
              const sc = stageConfig[row.currentStage] || stageConfig["Notify"];
              const dc = decisionConfig[row.customsDecision] || decisionConfig["Pending"];
              const fc = dispositionConfig[row.finalDisposition] || dispositionConfig["—"];
              return (
                <tr
                  key={row.id}
                  className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors"
                >
                  <td className="px-4 py-3.5">
                    <span className="text-[13px] font-semibold text-[#0B2545]">
                      {row.awb}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-[13px] text-[#475569]">{row.hawb}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-[13px] font-medium text-[#475569]">
                      {row.consignee}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-[13px] font-semibold text-[#64748B] bg-[#F1F5F9] px-2 py-0.5 rounded-lg">
                      {row.cargoClass}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-[13px] text-[#475569]">{row.pieces}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-[13px] text-[#475569]">{row.weight}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-[13px] text-[#475569]">{row.arrivalDate}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className="text-[13px] font-bold"
                      style={{
                        color: row.daysInStorage > 60 ? "#DC2626" : row.daysInStorage > 45 ? "#D97706" : "#64748B",
                      }}
                    >
                      {row.daysInStorage} days
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full text-[11px] font-semibold whitespace-nowrap"
                      style={{ backgroundColor: nc.bg, color: nc.text }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: nc.dot }} />
                      {row.noticeStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className="inline-flex items-center h-6 px-2.5 rounded-full text-[11px] font-semibold whitespace-nowrap"
                      style={{ backgroundColor: sc.bg, color: sc.text }}
                    >
                      {row.currentStage}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className="inline-flex items-center h-6 px-2.5 rounded-full text-[11px] font-semibold whitespace-nowrap"
                      style={{ backgroundColor: dc.bg, color: dc.text }}
                    >
                      {row.customsDecision}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className="inline-flex items-center h-6 px-2.5 rounded-full text-[11px] font-semibold whitespace-nowrap"
                      style={{ backgroundColor: fc.bg, color: fc.text }}
                    >
                      {row.finalDisposition}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onViewDetail(row)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#0B2545] cursor-pointer transition-colors"
                        title="View Case Detail"
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        onClick={() => onViewDetail(row)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#1B4F8B] cursor-pointer transition-colors"
                        title="View AWB"
                      >
                        <FileText size={15} />
                      </button>
                      {row.noticeStatus === "Notice Sent" && row.currentStage === "Notify" && (
                        <button
                          onClick={() => onGenerateNotice(row)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#D97706] cursor-pointer transition-colors"
                          title="Generate Notice"
                        >
                          <Bell size={15} />
                        </button>
                      )}
                      {row.noticeStatus === "Notice Sent" && row.currentStage === "Escalate" && (
                        <button
                          onClick={() => onEscalate(row)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#D97706] cursor-pointer transition-colors"
                          title="Escalate to Customs"
                        >
                          <ArrowUpRight size={15} />
                        </button>
                      )}
                      {row.noticeStatus === "Escalated" && row.customsDecision === "Pending" && (
                        <button
                          onClick={() => onRecordDecision(row)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#7C3AED] cursor-pointer transition-colors"
                          title="Record Customs Decision"
                        >
                          <Gavel size={15} />
                        </button>
                      )}
                      {row.customsDecision !== "Pending" && row.customsDecision !== "—" && row.finalDisposition === "—" && (
                        <button
                          onClick={() => onRecordDisposition(row)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#16A34A] cursor-pointer transition-colors"
                          title="Record Final Disposition"
                        >
                          <CheckCircle size={15} />
                        </button>
                      )}
                      <button
                        onClick={() => addToast(`Exporting case ${row.caseNum}`, "success")}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#0B2545] cursor-pointer transition-colors"
                        title="Export Case PDF"
                      >
                        <FileDown size={15} />
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