"use client";

import { useState } from "react";
import { useToast } from "@/components/ToastContext";
import ScopeBadge from "@/components/ScopeBadge";
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  Ban,
  Eye,
  Download,
  FileText,
  X,
  RefreshCw,
  ArrowRight,
  FileUp,
  Send,
  Package,
} from "lucide-react";

interface LongStayCase {
  id: string;
  caseNo: string;
  awb: string;
  consignee: string;
  daysInStorage: number;
  noticeStatus: "Sent" | "Pending" | "Acknowledged" | "Overdue";
  customsDecision: string;
  finalDisposition: "Auction" | "Disposal" | "Release" | "Re-export" | "";
  owner: string;
  status: "Open" | "Pending" | "Closed" | "On Hold";
  hawb: string;
  caseType: string;
  currentStage: string;
  customsGD: string;
  permissionStatus: string;
  remarks: string;
  timeline: { stage: string; date: string; completed: boolean }[];
}

const longStayCases: LongStayCase[] = [
  {
    id: "LS-001",
    caseNo: "LS-2026-00234",
    awb: "074-55443322",
    consignee: "Kuehne+Nagel KHI",
    daysInStorage: 92,
    noticeStatus: "Acknowledged",
    customsDecision: "Approved for auction",
    finalDisposition: "Auction",
    owner: "Fatima Rizvi",
    status: "Pending",
    hawb: "HAWB-55443322-01",
    caseType: "Section 82",
    currentStage: "Customs Decision",
    customsGD: "GD-2026-08920",
    permissionStatus: "Granted",
    remarks: "Auction scheduled for 05 Jun 2026",
    timeline: [
      { stage: "Notify", date: "01 Mar 2026", completed: true },
      { stage: "Escalate", date: "15 Mar 2026", completed: true },
      { stage: "Customs Decision", date: "20 May 2026", completed: true },
      { stage: "Final Disposition", date: "", completed: false },
    ],
  },
  {
    id: "LS-002",
    caseNo: "LS-2026-00235",
    awb: "117-99887766",
    consignee: "Agility Pakistan",
    daysInStorage: 78,
    noticeStatus: "Sent",
    customsDecision: "",
    finalDisposition: "",
    owner: "Ahmed Khan",
    status: "Open",
    hawb: "HAWB-99887766-01",
    caseType: "Long-Stay",
    currentStage: "Escalate",
    customsGD: "",
    permissionStatus: "Not Required",
    remarks: "First notice sent to consignee",
    timeline: [
      { stage: "Notify", date: "10 Apr 2026", completed: true },
      { stage: "Escalate", date: "25 Apr 2026", completed: true },
      { stage: "Customs Decision", date: "", completed: false },
      { stage: "Final Disposition", date: "", completed: false },
    ],
  },
  {
    id: "LS-003",
    caseNo: "LS-2026-00236",
    awb: "214-11223344",
    consignee: "Pakistan Cargo Services",
    daysInStorage: 65,
    noticeStatus: "Overdue",
    customsDecision: "Approved for disposal",
    finalDisposition: "Disposal",
    owner: "Fatima Rizvi",
    status: "Pending",
    hawb: "HAWB-11223344-01",
    caseType: "Section 82",
    currentStage: "Final Disposition",
    customsGD: "GD-2026-08921",
    permissionStatus: "Granted",
    remarks: "Disposal contractor assigned",
    timeline: [
      { stage: "Notify", date: "20 Feb 2026", completed: true },
      { stage: "Escalate", date: "05 Mar 2026", completed: true },
      { stage: "Customs Decision", date: "15 May 2026", completed: true },
      { stage: "Final Disposition", date: "28 May 2026", completed: true },
    ],
  },
  {
    id: "LS-004",
    caseNo: "LS-2026-00237",
    awb: "157-22334455",
    consignee: "DB Schenker Pakistan",
    daysInStorage: 55,
    noticeStatus: "Pending",
    customsDecision: "",
    finalDisposition: "",
    owner: "Ahmed Khan",
    status: "Open",
    hawb: "HAWB-22334455-01",
    caseType: "Long-Stay",
    currentStage: "Notify",
    customsGD: "",
    permissionStatus: "Not Required",
    remarks: "Notice to be sent within 48 hours",
    timeline: [
      { stage: "Notify", date: "", completed: false },
      { stage: "Escalate", date: "", completed: false },
      { stage: "Customs Decision", date: "", completed: false },
      { stage: "Final Disposition", date: "", completed: false },
    ],
  },
  {
    id: "LS-005",
    caseNo: "LS-2026-00238",
    awb: "117-55667788",
    consignee: "Gerry's Dnata",
    daysInStorage: 110,
    noticeStatus: "Acknowledged",
    customsDecision: "Release approved",
    finalDisposition: "Release",
    owner: "Fatima Rizvi",
    status: "Closed",
    hawb: "HAWB-55667788-01",
    caseType: "Section 82",
    currentStage: "Final Disposition",
    customsGD: "GD-2026-08922",
    permissionStatus: "Granted",
    remarks: "Consignee cleared all dues, DO issued",
    timeline: [
      { stage: "Notify", date: "01 Jan 2026", completed: true },
      { stage: "Escalate", date: "15 Jan 2026", completed: true },
      { stage: "Customs Decision", date: "10 Apr 2026", completed: true },
      { stage: "Final Disposition", date: "20 May 2026", completed: true },
    ],
  },
];

const statusConfig: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  Open: { bg: "#FEF3C7", text: "#D97706", icon: <Clock size={12} /> },
  Pending: { bg: "#FEF3C7", text: "#D97706", icon: <Clock size={12} /> },
  Closed: { bg: "#DCFCE7", text: "#16A34A", icon: <CheckCircle size={12} /> },
  "On Hold": { bg: "#FEE2E2", text: "#DC2626", icon: <Ban size={12} /> },
};

const noticeConfig: Record<string, { bg: string; text: string }> = {
  Sent: { bg: "#FEF3C7", text: "#D97706" },
  Pending: { bg: "#FEE2E2", text: "#DC2626" },
  Acknowledged: { bg: "#DCFCE7", text: "#16A34A" },
  Overdue: { bg: "#FEE2E2", text: "#DC2626" },
};

const dispositionConfig: Record<string, { bg: string; text: string }> = {
  Auction: { bg: "#FEF3C7", text: "#D97706" },
  Disposal: { bg: "#FEE2E2", text: "#DC2626" },
  Release: { bg: "#DCFCE7", text: "#16A34A" },
  "Re-export": { bg: "#F1F5F9", text: "#64748B" },
};

const stages = ["Notify", "Escalate", "Customs Decision", "Final Disposition"];

export default function LongStayTab() {
  const { addToast } = useToast();
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [items, setItems] = useState<LongStayCase[]>(longStayCases);
  const [newRemark, setNewRemark] = useState("");

  const handleRetry = () => {
    setLoading(true);
    setError(false);
    setTimeout(() => {
      setLoading(false);
      setItems(longStayCases);
      addToast("Case updated.", "success");
    }, 1500);
  };

  const activeItem = items.find((t) => t.id === selectedItem);

  const handleUpdateStage = () => {
    if (!activeItem) return;
    const currentIdx = stages.indexOf(activeItem.currentStage);
    const nextStage = stages[currentIdx + 1] || activeItem.currentStage;
    setItems((prev) =>
      prev.map((i) =>
        i.id === selectedItem
          ? {
              ...i,
              currentStage: nextStage,
              timeline: i.timeline.map((t) =>
                t.stage === nextStage ? { ...t, date: "01 Jun 2026", completed: true } : t
              ),
            }
          : i
      )
    );
    addToast("Stage updated to " + nextStage + ".", "success");
  };

  const handleAddRemark = () => {
    if (!newRemark.trim() || !activeItem) return;
    setItems((prev) =>
      prev.map((i) => (i.id === selectedItem ? { ...i, remarks: i.remarks + " | " + newRemark } : i))
    );
    setNewRemark("");
    addToast("Remark added.", "success");
  };

  const handleCloseCase = () => {
    if (!activeItem) return;
    setItems((prev) =>
      prev.map((i) =>
        i.id === selectedItem
          ? {
              ...i,
              status: "Closed" as const,
              currentStage: "Final Disposition",
              timeline: i.timeline.map((t) =>
                t.stage === "Final Disposition" ? { ...t, date: "01 Jun 2026", completed: true } : t
              ),
            }
          : i
      )
    );
    addToast("Case closed.", "success");
  };

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2">
          <h2 className="text-[15px] font-bold text-[#0F172A]">Long-Stay / Section 82 Cases</h2>
          <ScopeBadge type="exc" />
        </div>
        <span className="text-[12px] text-[#64748B]">{items.length} cases</span>
      </div>

      <div className="p-5">
        {error && (
          <div className="flex items-center gap-3 mb-4 p-4 rounded-xl bg-[#FEE2E2] border border-[#FCA5A5]">
            <AlertTriangle size={16} className="text-[#DC2626]" />
            <span className="text-[13px] font-semibold text-[#DC2626]">Failed to load case data. Please try again.</span>
            <button
              onClick={handleRetry}
              className="flex items-center gap-2 h-8 px-3 rounded-lg text-[12px] font-semibold bg-[#DC2626] text-white hover:opacity-90 cursor-pointer transition-opacity"
            >
              <RefreshCw size={14} />
              Retry
            </button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left">
            <thead>
              <tr className="border-b border-[#E2E8F0]">
                <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Case #</th>
                <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">AWB #</th>
                <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Consignee</th>
                <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Days in Storage</th>
                <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Notice Status</th>
                <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Customs Decision</th>
                <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Final Disposition</th>
                <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Owner</th>
                <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Status</th>
                <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-[#F1F5F9]">
                    {Array.from({ length: 10 }).map((_, j) => (
                      <td key={j} className="py-3 px-3">
                        <div className="h-4 bg-[#F1F5F9] rounded animate-pulse" style={{ width: j === 0 ? "100px" : j === 1 ? "90px" : j === 2 ? "120px" : j === 3 ? "60px" : j === 4 ? "70px" : j === 5 ? "110px" : j === 6 ? "70px" : j === 7 ? "90px" : j === 8 ? "70px" : "60px" }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[#F1F5F9] flex items-center justify-center">
                        <FileText size={24} className="text-[#94A3B8]" />
                      </div>
                      <p className="text-[13px] font-semibold text-[#64748B]">No re-export or long-stay cases found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                items.map((item) => {
                  const sc = statusConfig[item.status];
                  const nc = noticeConfig[item.noticeStatus];
                  const dc = item.finalDisposition ? dispositionConfig[item.finalDisposition] : null;
                  return (
                    <tr
                      key={item.id}
                      className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                      onClick={() => setSelectedItem(selectedItem === item.id ? null : item.id)}
                    >
                      <td className="py-3 px-3 text-[12px] font-semibold text-[#0F172A] font-mono">{item.caseNo}</td>
                      <td className="py-3 px-3 text-[12px] font-mono text-[#1B4F8B]">{item.awb}</td>
                      <td className="py-3 px-3 text-[12px] text-[#64748B]">{item.consignee}</td>
                      <td className="py-3 px-3 text-[12px] font-bold text-[#DC2626]">{item.daysInStorage}</td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center h-5 px-2 rounded-full text-[11px] font-semibold" style={{ backgroundColor: nc.bg, color: nc.text }}>
                          {item.noticeStatus}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-[12px] text-[#64748B]">{item.customsDecision || "—"}</td>
                      <td className="py-3 px-3">
                        {dc ? (
                          <span className="inline-flex items-center h-5 px-2 rounded-full text-[11px] font-semibold" style={{ backgroundColor: dc.bg, color: dc.text }}>
                            {item.finalDisposition}
                          </span>
                        ) : (
                          <span className="text-[12px] text-[#94A3B8]">—</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-[12px] text-[#64748B]">{item.owner}</td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center gap-1 h-5 px-2 rounded-full text-[11px] font-semibold" style={{ backgroundColor: sc.bg, color: sc.text }}>
                          {sc.icon}
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => { e.stopPropagation(); setSelectedItem(item.id); }}
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors"
                            title="View Detail"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); addToast(`Case ${item.caseNo} PDF downloaded.`, "success"); }}
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors"
                            title="Download Case PDF"
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

        {activeItem && (
          <div className="mt-5 p-5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileUp size={16} className="text-[#1B4F8B]" />
                <h3 className="text-[13px] font-bold text-[#0F172A]">Case Detail</h3>
                <ScopeBadge type="exc" />
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#E2E8F0] text-[#64748B] cursor-pointer transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">Case #</label>
                <input type="text" value={activeItem.caseNo} readOnly className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] bg-[#F1F5F9]" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">AWB #</label>
                <input type="text" value={activeItem.awb} readOnly className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] bg-[#F1F5F9]" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">HAWB #</label>
                <input type="text" value={activeItem.hawb} readOnly className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] bg-[#F1F5F9]" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">Consignee</label>
                <input type="text" value={activeItem.consignee} readOnly className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] bg-[#F1F5F9]" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">Case Type</label>
                <span className="inline-flex items-center h-9 px-3 rounded-lg text-[12px] font-semibold bg-[#FEE2E2] text-[#DC2626]">
                  {activeItem.caseType}
                </span>
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">Current Stage</label>
                <input type="text" value={activeItem.currentStage} readOnly className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] font-semibold text-[#0F172A] bg-[#F1F5F9]" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">Customs GD #</label>
                <input type="text" value={activeItem.customsGD || "—"} readOnly className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] bg-[#F1F5F9]" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">Permission Status</label>
                <input type="text" value={activeItem.permissionStatus} readOnly className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] bg-[#F1F5F9]" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">Days in Storage</label>
                <input type="text" value={activeItem.daysInStorage.toString()} readOnly className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] font-bold text-[#DC2626] bg-[#F1F5F9]" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">Customs Decision</label>
                <input type="text" value={activeItem.customsDecision || "—"} readOnly className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] bg-[#F1F5F9]" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">Final Disposition</label>
                {activeItem.finalDisposition ? (
                  <span className="inline-flex items-center h-9 px-3 rounded-lg text-[12px] font-semibold" style={{ backgroundColor: dispositionConfig[activeItem.finalDisposition].bg, color: dispositionConfig[activeItem.finalDisposition].text }}>
                    {activeItem.finalDisposition}
                  </span>
                ) : (
                  <input type="text" value="—" readOnly className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] bg-[#F1F5F9]" />
                )}
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">Owner</label>
                <input type="text" value={activeItem.owner} readOnly className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] bg-[#F1F5F9]" />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">Remarks</label>
              <textarea
                value={activeItem.remarks}
                readOnly
                rows={2}
                className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] bg-[#F1F5F9] resize-none"
              />
            </div>

            <div className="mb-4">
              <label className="block text-[12px] font-semibold text-[#64748B] mb-2">Timeline</label>
              <div className="flex items-center gap-0">
                {activeItem.timeline.map((t, idx) => (
                  <div key={t.stage} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${t.completed ? "bg-[#DCFCE7]" : "bg-[#F1F5F9]"}`}>
                        {t.completed ? <CheckCircle size={14} className="text-[#16A34A]" /> : <Clock size={14} className="text-[#94A3B8]" />}
                      </div>
                      <span className={`text-[10px] font-medium mt-1 text-center w-20 ${t.completed ? "text-[#16A34A]" : "text-[#94A3B8]"}`}>{t.stage}</span>
                      {t.date && <span className="text-[9px] text-[#64748B] mt-0.5">{t.date}</span>}
                    </div>
                    {idx < activeItem.timeline.length - 1 && (
                      <div className={`w-12 h-[2px] mb-5 ${t.completed ? "bg-[#16A34A]" : "bg-[#E2E8F0]"}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-[#E2E8F0]">
              <button
                onClick={handleUpdateStage}
                className="flex items-center gap-2 h-9 px-4 rounded-xl text-[13px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90"
                style={{ backgroundColor: "#0B2545" }}
              >
                <ArrowRight size={14} />
                Update Stage
              </button>
              <button
                onClick={() => addToast("Permission document uploaded.", "success")}
                className="flex items-center gap-2 h-9 px-4 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] cursor-pointer transition-colors hover:bg-[#F8FAFC]"
              >
                <FileUp size={14} />
                Upload Permission
              </button>
              <button
                onClick={() => addToast("AWB detail opened.", "success")}
                className="flex items-center gap-2 h-9 px-4 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] cursor-pointer transition-colors hover:bg-[#F8FAFC]"
              >
                <Package size={14} />
                View AWB
              </button>
              <button
                onClick={() => addToast(`Case ${activeItem.caseNo} PDF downloaded.`, "success")}
                className="flex items-center gap-2 h-9 px-4 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] cursor-pointer transition-colors hover:bg-[#F8FAFC]"
              >
                <Download size={14} />
                Download Case PDF
              </button>
              {activeItem.status !== "Closed" && (
                <button
                  onClick={handleCloseCase}
                  className="flex items-center gap-2 h-9 px-4 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#16A34A] cursor-pointer transition-colors hover:bg-[#DCFCE7]"
                >
                  <CheckCircle size={14} />
                  Close Case
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 mt-3">
              <input
                type="text"
                value={newRemark}
                onChange={(e) => setNewRemark(e.target.value)}
                placeholder="Add remark..."
                className="flex-1 h-10 px-3 rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors"
              />
              <button
                onClick={handleAddRemark}
                className="flex items-center gap-2 h-10 px-4 rounded-xl text-[13px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90"
                style={{ backgroundColor: "#0B2545" }}
              >
                <Send size={14} />
                Add Remark
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}