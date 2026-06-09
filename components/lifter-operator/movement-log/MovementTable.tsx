"use client";

import { useState } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Clock,
  Package,
  Hash,
  ScanLine,
  MapPin,
  Timer,
} from "lucide-react";
import ScopeBadge from "../../ScopeBadge";
import { useToast } from "../../ToastContext";
import MovementDetailDrawer from "./MovementDetailDrawer";

interface MovementEntry {
  id: string;
  time: string;
  taskType: string;
  awb: string;
  pieceId: string;
  rfid: string;
  fromLocation: string;
  toLocation: string;
  scanResult: string;
  duration: string;
  lifterAsset: string;
  status: string;
  operator: string;
  startTime: string;
  endTime: string;
  exceptionNotes: string;
  evidence: string;
}

const movementData: MovementEntry[] = [
  {
    id: "M-2026-0047",
    time: "11:42",
    taskType: "Putaway",
    awb: "214-45678901",
    pieceId: "P-21445678901-07",
    rfid: "EPC-3008-21445678901-0007",
    fromLocation: "Receiving Bay 02",
    toLocation: "AFU-R02-L1-B04",
    scanResult: "Matched",
    duration: "7 min",
    lifterAsset: "FL-03",
    status: "Completed",
    operator: "Imran Ali",
    startTime: "11:35",
    endTime: "11:42",
    exceptionNotes: "",
    evidence: "",
  },
  {
    id: "M-2026-0046",
    time: "11:28",
    taskType: "Pick",
    awb: "157-90811223",
    pieceId: "P-15790811223-03",
    rfid: "EPC-3008-15790811223-0003",
    fromLocation: "Cold-COL-01",
    toLocation: "Vehicle Bay 03",
    scanResult: "Matched",
    duration: "9 min",
    lifterAsset: "FL-03",
    status: "Completed",
    operator: "Imran Ali",
    startTime: "11:19",
    endTime: "11:28",
    exceptionNotes: "",
    evidence: "",
  },
  {
    id: "M-2026-0045",
    time: "11:15",
    taskType: "Move",
    awb: "074-88219033",
    pieceId: "P-07488219033-09",
    rfid: "EPC-3008-07488219033-0009",
    fromLocation: "GCR-R05-L2-B01",
    toLocation: "Inspection Bay",
    scanResult: "Mismatch",
    duration: "12 min",
    lifterAsset: "FL-03",
    status: "Exception",
    operator: "Imran Ali",
    startTime: "11:03",
    endTime: "11:15",
    exceptionNotes: "RFID scan did not match expected piece. Rescanned and corrected.",
    evidence: "Photo-20260531-1115.jpg",
  },
  {
    id: "M-2026-0044",
    time: "10:58",
    taskType: "Putaway",
    awb: "214-45678901",
    pieceId: "P-21445678901-06",
    rfid: "EPC-3008-21445678901-0006",
    fromLocation: "Receiving Bay 02",
    toLocation: "AFU-R02-L1-B03",
    scanResult: "Matched",
    duration: "6 min",
    lifterAsset: "FL-03",
    status: "Completed",
    operator: "Imran Ali",
    startTime: "10:52",
    endTime: "10:58",
    exceptionNotes: "",
    evidence: "",
  },
  {
    id: "M-2026-0043",
    time: "10:42",
    taskType: "Charge",
    awb: "089-33445566",
    pieceId: "P-08933445566-01",
    rfid: "EPC-3008-08933445566-0001",
    fromLocation: "Charging Station A",
    toLocation: "Cold-COL-02",
    scanResult: "Matched",
    duration: "11 min",
    lifterAsset: "FL-03",
    status: "Completed",
    operator: "Imran Ali",
    startTime: "10:31",
    endTime: "10:42",
    exceptionNotes: "",
    evidence: "",
  },
  {
    id: "M-2026-0042",
    time: "10:28",
    taskType: "Pick",
    awb: "157-90811223",
    pieceId: "P-15790811223-02",
    rfid: "EPC-3008-15790811223-0002",
    fromLocation: "Cold-COL-01",
    toLocation: "Vehicle Bay 02",
    scanResult: "Matched",
    duration: "8 min",
    lifterAsset: "FL-03",
    status: "Completed",
    operator: "Imran Ali",
    startTime: "10:20",
    endTime: "10:28",
    exceptionNotes: "",
    evidence: "",
  },
  {
    id: "M-2026-0041",
    time: "10:15",
    taskType: "Move",
    awb: "074-88219033",
    pieceId: "P-07488219033-08",
    rfid: "EPC-3008-07488219033-0008",
    fromLocation: "GCR-R05-L2-B01",
    toLocation: "GCR-R05-L3-B02",
    scanResult: "Matched",
    duration: "5 min",
    lifterAsset: "FL-03",
    status: "Completed",
    operator: "Imran Ali",
    startTime: "10:10",
    endTime: "10:15",
    exceptionNotes: "",
    evidence: "",
  },
  {
    id: "M-2026-0040",
    time: "09:55",
    taskType: "Putaway",
    awb: "214-45678901",
    pieceId: "P-21445678901-05",
    rfid: "EPC-3008-21445678901-0005",
    fromLocation: "Receiving Bay 02",
    toLocation: "AFU-R02-L1-B02",
    scanResult: "Matched",
    duration: "6 min",
    lifterAsset: "FL-03",
    status: "Completed",
    operator: "Imran Ali",
    startTime: "09:49",
    endTime: "09:55",
    exceptionNotes: "",
    evidence: "",
  },
  {
    id: "M-2026-0039",
    time: "09:42",
    taskType: "Pick",
    awb: "157-90811223",
    pieceId: "P-15790811223-01",
    rfid: "EPC-3008-15790811223-0001",
    fromLocation: "Cold-COL-01",
    toLocation: "Vehicle Bay 01",
    scanResult: "Matched",
    duration: "7 min",
    lifterAsset: "FL-03",
    status: "Completed",
    operator: "Imran Ali",
    startTime: "09:35",
    endTime: "09:42",
    exceptionNotes: "",
    evidence: "",
  },
  {
    id: "M-2026-0038",
    time: "09:30",
    taskType: "Putaway",
    awb: "214-45678901",
    pieceId: "P-21445678901-04",
    rfid: "EPC-3008-21445678901-0004",
    fromLocation: "Receiving Bay 02",
    toLocation: "AFU-R02-L1-B01",
    scanResult: "Matched",
    duration: "5 min",
    lifterAsset: "FL-03",
    status: "Completed",
    operator: "Imran Ali",
    startTime: "09:25",
    endTime: "09:30",
    exceptionNotes: "",
    evidence: "",
  },
  {
    id: "M-2026-0037",
    time: "09:18",
    taskType: "Move",
    awb: "074-88219033",
    pieceId: "P-07488219033-07",
    rfid: "EPC-3008-07488219033-0007",
    fromLocation: "GCR-R05-L1-B04",
    toLocation: "GCR-R05-L2-B01",
    scanResult: "Matched",
    duration: "4 min",
    lifterAsset: "FL-03",
    status: "Completed",
    operator: "Imran Ali",
    startTime: "09:14",
    endTime: "09:18",
    exceptionNotes: "",
    evidence: "",
  },
  {
    id: "M-2026-0036",
    time: "09:05",
    taskType: "Charge",
    awb: "089-33445566",
    pieceId: "P-08933445566-02",
    rfid: "EPC-3008-08933445566-0002",
    fromLocation: "Charging Station B",
    toLocation: "Cold-COL-03",
    scanResult: "Matched",
    duration: "10 min",
    lifterAsset: "FL-03",
    status: "Completed",
    operator: "Imran Ali",
    startTime: "08:55",
    endTime: "09:05",
    exceptionNotes: "",
    evidence: "",
  },
];

const taskTypeConfig: Record<string, { icon: any; color: string; bg: string }> = {
  Putaway: { icon: ArrowDownRight, color: "#1B4F8B", bg: "#DBEAFE" },
  Pick: { icon: ArrowUpRight, color: "#7C3AED", bg: "#F3E8FF" },
  Move: { icon: ArrowRight, color: "#D97706", bg: "#FEF3C7" },
  Charge: { icon: ArrowRight, color: "#16A34A", bg: "#DCFCE7" },
};

const scanResultConfig: Record<string, { icon: any; color: string; bg: string }> = {
  Matched: { icon: CheckCircle2, color: "#16A34A", bg: "#DCFCE7" },
  Mismatch: { icon: XCircle, color: "#DC2626", bg: "#FEE2E2" },
  Unknown: { icon: AlertTriangle, color: "#D97706", bg: "#FEF3C7" },
  Duplicate: { icon: AlertTriangle, color: "#D97706", bg: "#FEF3C7" },
};

function getStatusConfig(status: string) {
  if (status === "Completed") return { color: "#16A34A", bg: "#DCFCE7" };
  if (status === "Exception") return { color: "#DC2626", bg: "#FEE2E2" };
  return { color: "#D97706", bg: "#FEF3C7" };
}

export default function MovementTable() {
  const { addToast } = useToast();
  const [selectedEntry, setSelectedEntry] = useState<MovementEntry | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleViewDetail = (entry: MovementEntry) => {
    setSelectedEntry(entry);
    setDrawerOpen(true);
  };

  const handleReportCorrection = (entry: MovementEntry) => {
    addToast(`Correction reported for ${entry.id}`, "success");
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setTimeout(() => setSelectedEntry(null), 300);
  };

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2.5">
          <h2 className="text-[16px] font-bold text-[#0F172A]">Movement History</h2>
          <ScopeBadge type="inc" />
        </div>
        <div className="flex items-center gap-1.5 text-[12px] text-[#94A3B8] font-medium">
          <Package size={14} />
          <span>{movementData.length} entries</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">Time</th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">Task Type</th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">AWB #</th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider hidden md:table-cell">Piece ID</th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider hidden lg:table-cell">RFID EPC</th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">From → To</th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">Scan</th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider hidden sm:table-cell">Duration</th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider hidden lg:table-cell">Lifter</th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">Status</th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody>
            {movementData.map((entry) => {
              const typeConfig = taskTypeConfig[entry.taskType] || taskTypeConfig.Move;
              const TypeIcon = typeConfig.icon;
              const scanConfig = scanResultConfig[entry.scanResult] || scanResultConfig.Matched;
              const ScanIcon = scanConfig.icon;
              const entryStatusConfig = getStatusConfig(entry.status);

              return (
                <tr key={entry.id} className="border-b border-[#E2E8F0] last:border-0 hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-4 py-3 text-[13px] font-medium text-[#0F172A] whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Clock size={12} className="text-[#94A3B8]" />
                      {entry.time}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full text-[11px] font-semibold"
                      style={{ backgroundColor: typeConfig.bg, color: typeConfig.color }}
                    >
                      <TypeIcon size={12} />
                      {entry.taskType}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[13px] font-medium text-[#0F172A] whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Hash size={12} className="text-[#94A3B8]" />
                      {entry.awb}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[13px] font-medium text-[#64748B] hidden md:table-cell whitespace-nowrap">
                    {entry.pieceId}
                  </td>
                  <td className="px-4 py-3 text-[12px] font-mono text-[#64748B] hidden lg:table-cell max-w-[140px] truncate">
                    {entry.rfid}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-[12px] text-[#64748B]">
                      <span className="text-[#0F172A] font-medium">{entry.fromLocation}</span>
                      <ArrowRight size={12} className="text-[#94A3B8] flex-shrink-0" />
                      <span className="text-[#0F172A] font-medium">{entry.toLocation}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="inline-flex items-center gap-1 h-5 px-2 rounded-full text-[11px] font-semibold"
                      style={{ backgroundColor: scanConfig.bg, color: scanConfig.color }}
                    >
                      <ScanIcon size={10} />
                      {entry.scanResult}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[13px] font-medium text-[#64748B] hidden sm:table-cell whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Timer size={12} className="text-[#94A3B8]" />
                      {entry.duration}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[13px] font-medium text-[#64748B] hidden lg:table-cell whitespace-nowrap">
                    {entry.lifterAsset}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="inline-flex items-center gap-1 h-5 px-2 rounded-full text-[11px] font-semibold"
                      style={{ backgroundColor: entryStatusConfig.bg, color: entryStatusConfig.color }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: entryStatusConfig.color }} />
                      {entry.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleViewDetail(entry)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] hover:text-[#0B2545] cursor-pointer transition-colors"
                        title="View Detail"
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        onClick={() => handleReportCorrection(entry)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] hover:text-[#D97706] cursor-pointer transition-colors"
                        title="Report Correction"
                      >
                        <AlertTriangle size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <MovementDetailDrawer
        isOpen={drawerOpen}
        onClose={handleCloseDrawer}
        entry={selectedEntry}
      />
    </div>
  );
}