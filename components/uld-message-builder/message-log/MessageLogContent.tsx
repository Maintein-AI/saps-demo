"use client";

import { useState, useMemo, useCallback } from "react";
import { useToast } from "@/components/ToastContext";
import ScopeBadge from "@/components/ScopeBadge";
import MessageLogTable from "./MessageLogTable";
import IATASyntaxDrawer from "../IATASyntaxDrawer";
import CorrectionDrawer from "../ucm/CorrectionDrawer";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface LogEntry {
  id: string;
  type: "UCM" | "SCM" | "LUC";
  reference: string;
  station: string;
  flight: string;
  createdAt: string;
  submittedAt: string;
  status: "Draft" | "Sent" | "Correction" | "Failed";
  createdBy: string;
  correctionOf: string;
}

const ucmLog: LogEntry[] = [
  { id: "UCM-0142", type: "UCM", reference: "UCM-TG345-01JUN26", station: "LHE", flight: "TG345/TG346", createdAt: "01 Jun 2026 16:12", submittedAt: "01 Jun 2026 16:14", status: "Sent", createdBy: "Asim Tariq", correctionOf: "" },
  { id: "UCM-0141", type: "UCM", reference: "UCM-EY241-14JUN26", station: "KHI", flight: "EY-241", createdAt: "14 Jun 2026 08:10", submittedAt: "14 Jun 2026 08:12", status: "Sent", createdBy: "Bilal Ahmed", correctionOf: "" },
  { id: "UCM-0140", type: "UCM", reference: "UCM-QR604-14JUN26", station: "KHI", flight: "QR-604", createdAt: "14 Jun 2026 14:20", submittedAt: "14 Jun 2026 14:25", status: "Correction", createdBy: "Nadeem Hussain", correctionOf: "UCM-0138" },
  { id: "UCM-0139", type: "UCM", reference: "UCM-PK306-12JUN26", station: "LHE", flight: "PK-306", createdAt: "12 Jun 2026 07:45", submittedAt: "12 Jun 2026 07:48", status: "Sent", createdBy: "Asim Tariq", correctionOf: "" },
  { id: "UCM-0138", type: "UCM", reference: "UCM-QR604-13JUN26", station: "KHI", flight: "QR-604", createdAt: "13 Jun 2026 09:30", submittedAt: "13 Jun 2026 09:32", status: "Sent", createdBy: "Nadeem Hussain", correctionOf: "" },
  { id: "UCM-0137", type: "UCM", reference: "UCM-SV730-11JUN26", station: "LHE", flight: "SV-730", createdAt: "11 Jun 2026 13:10", submittedAt: "11 Jun 2026 13:15", status: "Sent", createdBy: "Kamran Sheikh", correctionOf: "" },
  { id: "UCM-0136", type: "UCM", reference: "UCM-TK708-10JUN26", station: "LHE", flight: "TK-708", createdAt: "10 Jun 2026 09:15", submittedAt: "", status: "Draft", createdBy: "Bilal Ahmed", correctionOf: "" },
  { id: "UCM-0135", type: "UCM", reference: "UCM-PK304-08JUN26", station: "LHE", flight: "PK-304", createdAt: "08 Jun 2026 15:30", submittedAt: "08 Jun 2026 15:35", status: "Sent", createdBy: "Asim Tariq", correctionOf: "" },
  { id: "UCM-0134", type: "UCM", reference: "UCM-EK624-07JUN26", station: "KHI", flight: "EK-624", createdAt: "07 Jun 2026 11:20", submittedAt: "07 Jun 2026 11:22", status: "Failed", createdBy: "Kamran Sheikh", correctionOf: "" },
  { id: "UCM-0133", type: "UCM", reference: "UCM-GF752-06JUN26", station: "KHI", flight: "GF-752", createdAt: "06 Jun 2026 08:45", submittedAt: "06 Jun 2026 08:48", status: "Sent", createdBy: "Nadeem Hussain", correctionOf: "" },
];

const scmLog: LogEntry[] = [
  { id: "SCM-0056", type: "SCM", reference: "SCM-OPSADMINLHE.02JUN26", station: "LHE", flight: "N/A", createdAt: "02 Jun 2026 09:03", submittedAt: "", status: "Draft", createdBy: "Asim Tariq", correctionOf: "" },
  { id: "SCM-0055", type: "SCM", reference: "SCM-OPSADMINKHI.15JUN26", station: "KHI", flight: "N/A", createdAt: "15 Jun 2026 10:15", submittedAt: "15 Jun 2026 10:18", status: "Sent", createdBy: "Bilal Ahmed", correctionOf: "" },
  { id: "SCM-0054", type: "SCM", reference: "SCM-OPSADMINLHE.14JUN26", station: "LHE", flight: "N/A", createdAt: "14 Jun 2026 16:45", submittedAt: "", status: "Draft", createdBy: "Asim Tariq", correctionOf: "" },
  { id: "SCM-0053", type: "SCM", reference: "SCM-OPSADMINKHI.13JUN26", station: "KHI", flight: "N/A", createdAt: "13 Jun 2026 15:30", submittedAt: "13 Jun 2026 15:33", status: "Sent", createdBy: "Nadeem Hussain", correctionOf: "" },
  { id: "SCM-0052", type: "SCM", reference: "SCM-OPSADMINKHI.11JUN26", station: "KHI", flight: "N/A", createdAt: "11 Jun 2026 16:00", submittedAt: "11 Jun 2026 16:05", status: "Correction", createdBy: "Asim Tariq", correctionOf: "SCM-0051" },
  { id: "SCM-0051", type: "SCM", reference: "SCM-OPSADMINKHI.10JUN26", station: "KHI", flight: "N/A", createdAt: "10 Jun 2026 11:20", submittedAt: "10 Jun 2026 11:22", status: "Sent", createdBy: "Asim Tariq", correctionOf: "" },
  { id: "SCM-0050", type: "SCM", reference: "SCM-OPSADMINLHE.09JUN26", station: "LHE", flight: "N/A", createdAt: "09 Jun 2026 14:10", submittedAt: "09 Jun 2026 14:12", status: "Sent", createdBy: "Kamran Sheikh", correctionOf: "" },
  { id: "SCM-0049", type: "SCM", reference: "SCM-OPSADMINKHI.08JUN26", station: "KHI", flight: "N/A", createdAt: "08 Jun 2026 08:30", submittedAt: "", status: "Draft", createdBy: "Bilal Ahmed", correctionOf: "" },
];

const lucLog: LogEntry[] = [
  { id: "LUC-0031", type: "LUC", reference: "LUC-EK-624-15JUN26", station: "LHE", flight: "EK-624", createdAt: "15 Jun 2026 11:03", submittedAt: "15 Jun 2026 11:05", status: "Sent", createdBy: "Kamran Sheikh", correctionOf: "" },
  { id: "LUC-0030", type: "LUC", reference: "LUC-PA-213-13JUN26", station: "LHE", flight: "PA-213", createdAt: "13 Jun 2026 12:55", submittedAt: "13 Jun 2026 12:58", status: "Failed", createdBy: "Kamran Sheikh", correctionOf: "" },
  { id: "LUC-0029", type: "LUC", reference: "LUC-EK-626-12JUN26", station: "KHI", flight: "EK-626", createdAt: "12 Jun 2026 10:20", submittedAt: "", status: "Draft", createdBy: "Bilal Ahmed", correctionOf: "" },
  { id: "LUC-0028", type: "LUC", reference: "LUC-GF-752-09JUN26", station: "KHI", flight: "GF-752", createdAt: "09 Jun 2026 14:40", submittedAt: "09 Jun 2026 14:42", status: "Sent", createdBy: "Nadeem Hussain", correctionOf: "" },
  { id: "LUC-0027", type: "LUC", reference: "LUC-SV-732-08JUN26", station: "KHI", flight: "SV-732", createdAt: "08 Jun 2026 10:15", submittedAt: "08 Jun 2026 10:18", status: "Sent", createdBy: "Bilal Ahmed", correctionOf: "" },
  { id: "LUC-0026", type: "LUC", reference: "LUC-QR-606-07JUN26", station: "KHI", flight: "QR-606", createdAt: "07 Jun 2026 16:00", submittedAt: "07 Jun 2026 16:03", status: "Sent", createdBy: "Asim Tariq", correctionOf: "" },
  { id: "LUC-0025", type: "LUC", reference: "LUC-EK-624-06JUN26", station: "LHE", flight: "EK-624", createdAt: "06 Jun 2026 09:45", submittedAt: "06 Jun 2026 09:48", status: "Sent", createdBy: "Kamran Sheikh", correctionOf: "" },
];

function generateMockSyntax(e: LogEntry): string {
  return `${e.type}\n${e.reference}\nStation: ${e.station}\nFlight: ${e.flight}\nCreated: ${e.createdAt}\nSubmitted: ${e.submittedAt || "N/A"}\nStatus: ${e.status}\nCreated By: ${e.createdBy}${e.correctionOf ? `\nCorrection Of: ${e.correctionOf}` : ""}`;
}

type TabKey = "UCM" | "SCM" | "LUC";

export default function MessageLogContent() {
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState<TabKey>("UCM");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [syntaxDrawerOpen, setSyntaxDrawerOpen] = useState(false);
  const [syntaxContent, setSyntaxContent] = useState("");
  const [syntaxType, setSyntaxType] = useState("ULD");

  const [correctionOpen, setCorrectionOpen] = useState(false);
  const [correctionRef, setCorrectionRef] = useState("");

  const entries = useMemo(() => {
    if (activeTab === "UCM") return ucmLog;
    if (activeTab === "SCM") return scmLog;
    return lucLog;
  }, [activeTab]);

  const handleTabChange = useCallback((tab: TabKey) => {
    setLoading(true);
    setError(false);
    setActiveTab(tab);
    setTimeout(() => setLoading(false), 400);
  }, []);

  const handleRetry = () => {
    setLoading(true);
    setError(false);
    setTimeout(() => setLoading(false), 1000);
  };

  const handleViewIataSyntax = (e: LogEntry) => {
    setSyntaxContent(generateMockSyntax(e));
    setSyntaxType(e.type);
    setSyntaxDrawerOpen(true);
  };

  const handleCreateCorrection = (e: LogEntry) => {
    if (e.status === "Draft") {
      addToast("Cannot create a correction for a Draft. Edit the draft directly.", "error");
      return;
    }
    setCorrectionRef(e.reference);
    setCorrectionOpen(true);
  };

  const tabs: { key: TabKey; label: string; count: number }[] = [
    { key: "UCM", label: "UCM Log", count: ucmLog.length },
    { key: "SCM", label: "SCM Log", count: scmLog.length },
    { key: "LUC", label: "LUC Log", count: lucLog.length },
  ];

  return (
    <>
      <div className="space-y-5">
        {error && !loading && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-[#FEE2E2] border border-[#FCA5A5]">
            <AlertTriangle size={16} className="text-[#DC2626] flex-shrink-0" />
            <span className="text-[13px] font-semibold text-[#DC2626] flex-1">Failed to load message log. Please try again.</span>
            <button
              onClick={handleRetry}
              className="flex items-center gap-2 h-8 px-3 rounded-lg text-[12px] font-semibold bg-[#DC2626] text-white hover:opacity-90 cursor-pointer transition-opacity whitespace-nowrap"
            >
              <RefreshCw size={14} />
              Retry
            </button>
          </div>
        )}

        <div className="rounded-[16px] border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
            <div className="flex items-center gap-2">
              <h2 className="text-[15px] font-bold text-[#0F172A]">Message Log</h2>
              <ScopeBadge type="exc" />
            </div>
            <span className="text-[12px] text-[#64748B]">{entries.length} messages</span>
          </div>

          <div className="flex items-center gap-1 bg-[#F1F5F9] mx-4 mt-3 rounded-xl p-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`flex-1 flex items-center justify-center gap-2 h-9 rounded-lg text-[13px] font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab.key
                    ? "bg-white text-[#0F172A] shadow-sm"
                    : "text-[#64748B] hover:text-[#0F172A]"
                }`}
              >
                {tab.label}
                <span className={`text-[11px] px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.key ? "bg-[#1B4F8B] text-white" : "bg-[#E2E8F0] text-[#64748B]"
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-3">
            <MessageLogTable
              entries={entries}
              loading={loading}
              error={error}
              onRetry={handleRetry}
              onViewIataSyntax={handleViewIataSyntax}
              onCreateCorrection={handleCreateCorrection}
            />
          </div>
        </div>
      </div>

      <IATASyntaxDrawer
        open={syntaxDrawerOpen}
        onClose={() => setSyntaxDrawerOpen(false)}
        syntax={syntaxContent}
        messageType={syntaxType}
      />

      <CorrectionDrawer
        open={correctionOpen}
        onClose={() => setCorrectionOpen(false)}
        messageRef={correctionRef}
      />
    </>
  );
}