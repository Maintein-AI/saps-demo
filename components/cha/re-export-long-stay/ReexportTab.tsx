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
  Plus,
  Send,
  Pencil,
  Package,
} from "lucide-react";

interface ReexportCase {
  id: string;
  caseNo: string;
  awb: string;
  consignee: string;
  reexportReason: string;
  customsGD: string;
  permissionStatus: "Pending" | "Granted" | "Denied" | "Not Required";
  currentStage: string;
  owner: string;
  status: "Open" | "Pending" | "Closed" | "On Hold";
  hawb: string;
  daysInStorage: number;
  customsDecision: string;
  finalDisposition: string;
  remarks: string;
  timeline: { stage: string; date: string; completed: boolean }[];
}

const reexportCases: ReexportCase[] = [
  {
    id: "RE-001",
    caseNo: "RE-2026-00112",
    awb: "214-77890123",
    consignee: "Gerry's Dnata",
    reexportReason: "Consignee refusal",
    customsGD: "GD-2026-08912",
    permissionStatus: "Granted",
    currentStage: "Settled",
    owner: "Ahmed Khan",
    status: "Open",
    hawb: "HAWB-77890123-01",
    daysInStorage: 45,
    customsDecision: "Permission granted for re-export",
    finalDisposition: "",
    remarks: "Awaiting airline confirmation for re-tender",
    timeline: [
      { stage: "Re-export Request", date: "15 May 2026", completed: true },
      { stage: "Customs GD", date: "16 May 2026", completed: true },
      { stage: "Permission", date: "20 May 2026", completed: true },
      { stage: "Settled", date: "22 May 2026", completed: true },
      { stage: "Re-tendered", date: "", completed: false },
      { stage: "Closed", date: "", completed: false },
    ],
  },
  {
    id: "RE-002",
    caseNo: "RE-2026-00113",
    awb: "157-66778899",
    consignee: "DB Schenker Pakistan",
    reexportReason: "Wrong destination",
    customsGD: "GD-2026-08913",
    permissionStatus: "Pending",
    currentStage: "Customs GD",
    owner: "Fatima Rizvi",
    status: "Pending",
    hawb: "HAWB-66778899-01",
    daysInStorage: 12,
    customsDecision: "",
    finalDisposition: "",
    remarks: "GD filed, awaiting customs review",
    timeline: [
      { stage: "Re-export Request", date: "25 May 2026", completed: true },
      { stage: "Customs GD", date: "26 May 2026", completed: true },
      { stage: "Permission", date: "", completed: false },
      { stage: "Settled", date: "", completed: false },
      { stage: "Re-tendered", date: "", completed: false },
      { stage: "Closed", date: "", completed: false },
    ],
  },
  {
    id: "RE-003",
    caseNo: "RE-2026-00114",
    awb: "074-55443322",
    consignee: "Kuehne+Nagel KHI",
    reexportReason: "Damaged goods",
    customsGD: "GD-2026-08914",
    permissionStatus: "Denied",
    currentStage: "Permission",
    owner: "Ahmed Khan",
    status: "On Hold",
    hawb: "HAWB-55443322-01",
    daysInStorage: 28,
    customsDecision: "Denied - requires further inspection",
    finalDisposition: "",
    remarks: "Appeal filed with additional documentation",
    timeline: [
      { stage: "Re-export Request", date: "01 May 2026", completed: true },
      { stage: "Customs GD", date: "02 May 2026", completed: true },
      { stage: "Permission", date: "10 May 2026", completed: true },
      { stage: "Settled", date: "", completed: false },
      { stage: "Re-tendered", date: "", completed: false },
      { stage: "Closed", date: "", completed: false },
    ],
  },
  {
    id: "RE-004",
    caseNo: "RE-2026-00115",
    awb: "117-99887766",
    consignee: "Agility Pakistan",
    reexportReason: "Customs hold cleared",
    customsGD: "GD-2026-08915",
    permissionStatus: "Granted",
    currentStage: "Re-tendered",
    owner: "Fatima Rizvi",
    status: "Open",
    hawb: "HAWB-99887766-01",
    daysInStorage: 8,
    customsDecision: "Permission granted",
    finalDisposition: "Re-tendered to EK-603",
    remarks: "AWB re-tendered on 28 May 2026",
    timeline: [
      { stage: "Re-export Request", date: "20 May 2026", completed: true },
      { stage: "Customs GD", date: "21 May 2026", completed: true },
      { stage: "Permission", date: "24 May 2026", completed: true },
      { stage: "Settled", date: "25 May 2026", completed: true },
      { stage: "Re-tendered", date: "28 May 2026", completed: true },
      { stage: "Closed", date: "", completed: false },
    ],
  },
  {
    id: "RE-005",
    caseNo: "RE-2026-00116",
    awb: "214-11223344",
    consignee: "Pakistan Cargo Services",
    reexportReason: "Shipper request",
    customsGD: "",
    permissionStatus: "Not Required",
    currentStage: "Re-export Request",
    owner: "Ahmed Khan",
    status: "Open",
    hawb: "HAWB-11223344-01",
    daysInStorage: 3,
    customsDecision: "",
    finalDisposition: "",
    remarks: "New case, GD to be filed",
    timeline: [
      { stage: "Re-export Request", date: "30 May 2026", completed: true },
      { stage: "Customs GD", date: "", completed: false },
      { stage: "Permission", date: "", completed: false },
      { stage: "Settled", date: "", completed: false },
      { stage: "Re-tendered", date: "", completed: false },
      { stage: "Closed", date: "", completed: false },
    ],
  },
];

const statusConfig: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  Open: { bg: "#FEF3C7", text: "#D97706", icon: <Clock size={12} /> },
  Pending: { bg: "#FEF3C7", text: "#D97706", icon: <Clock size={12} /> },
  Closed: { bg: "#DCFCE7", text: "#16A34A", icon: <CheckCircle size={12} /> },
  "On Hold": { bg: "#FEE2E2", text: "#DC2626", icon: <Ban size={12} /> },
};

const permissionConfig: Record<string, { bg: string; text: string }> = {
  Pending: { bg: "#FEF3C7", text: "#D97706" },
  Granted: { bg: "#DCFCE7", text: "#16A34A" },
  Denied: { bg: "#FEE2E2", text: "#DC2626" },
  "Not Required": { bg: "#F1F5F9", text: "#64748B" },
};

const stages = ["Re-export Request", "Customs GD", "Permission", "Settled", "Re-tendered", "Closed"];

export default function ReexportTab() {
  const { addToast } = useToast();
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [items, setItems] = useState<ReexportCase[]>(reexportCases);
  const [newRemark, setNewRemark] = useState("");

  const handleRetry = () => {
    setLoading(true);
    setError(false);
    setTimeout(() => {
      setLoading(false);
      setItems(reexportCases);
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
              currentStage: "Closed",
              timeline: i.timeline.map((t) =>
                t.stage === "Closed" ? { ...t, date: "01 Jun 2026", completed: true } : t
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
          <h2 className="text-[15px] font-bold text-[#0F172A]">Re-export Cases</h2>
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
                <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Re-export Reason</th>
                <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Customs GD #</th>
                <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Permission Status</th>
                <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Current Stage</th>
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
                        <div className="h-4 bg-[#F1F5F9] rounded animate-pulse" style={{ width: j === 0 ? "100px" : j === 1 ? "90px" : j === 2 ? "120px" : j === 3 ? "110px" : j === 4 ? "100px" : j === 5 ? "80px" : j === 6 ? "80px" : j === 7 ? "90px" : j === 8 ? "70px" : "60px" }} />
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
                  const pc = permissionConfig[item.permissionStatus];
                  return (
                    <tr
                      key={item.id}
                      className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                      onClick={() => setSelectedItem(selectedItem === item.id ? null : item.id)}
                    >
                      <td className="py-3 px-3 text-[12px] font-semibold text-[#0F172A] font-mono">{item.caseNo}</td>
                      <td className="py-3 px-3 text-[12px] font-mono text-[#1B4F8B]">{item.awb}</td>
                      <td className="py-3 px-3 text-[12px] text-[#64748B]">{item.consignee}</td>
                      <td className="py-3 px-3 text-[12px] text-[#64748B]">{item.reexportReason}</td>
                      <td className="py-3 px-3 text-[12px] font-mono text-[#64748B]">{item.customsGD || "—"}</td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center h-5 px-2 rounded-full text-[11px] font-semibold" style={{ backgroundColor: pc.bg, color: pc.text }}>
                          {item.permissionStatus}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-[12px] font-semibold text-[#0F172A]">{item.currentStage}</td>
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
                <span className="inline-flex items-center h-9 px-3 rounded-lg text-[12px] font-semibold bg-[#FEF3C7] text-[#D97706]">
                  Re-export
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
                <span className="inline-flex items-center h-9 px-3 rounded-lg text-[12px] font-semibold" style={{ backgroundColor: permissionConfig[activeItem.permissionStatus].bg, color: permissionConfig[activeItem.permissionStatus].text }}>
                  {activeItem.permissionStatus}
                </span>
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">Days in Storage</label>
                <input type="text" value={activeItem.daysInStorage.toString()} readOnly className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] bg-[#F1F5F9]" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">Customs Decision</label>
                <input type="text" value={activeItem.customsDecision || "—"} readOnly className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] bg-[#F1F5F9]" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">Final Disposition</label>
                <input type="text" value={activeItem.finalDisposition || "—"} readOnly className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] bg-[#F1F5F9]" />
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
                      <div className={`w-8 h-[2px] mb-5 ${t.completed ? "bg-[#16A34A]" : "bg-[#E2E8F0]"}`} />
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