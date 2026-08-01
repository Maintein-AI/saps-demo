"use client";

import { useEffect } from "react";
import {
  X,
  CheckCircle2,
  AlertTriangle,
  Hash,
  Package,
  ScanLine,
  Clock,
  MapPin,
  Timer,
  User,
  FileText,
  Camera,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { useToast } from "../../ToastContext";

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

interface MovementDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  entry: MovementEntry | null;
}

export default function MovementDetailDrawer({ isOpen, onClose, entry }: MovementDetailDrawerProps) {
  const { addToast } = useToast();

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

  const handleReportCorrection = () => {
    if (entry) {
      addToast(`Correction reported for ${entry.id}`, "success");
    }
  };

  const handleLinkToAWB = () => {
    if (entry) {
      addToast(`Linked to AWB ${entry.awb}`, "success");
    }
  };

  if (!entry) return null;

  const TypeIcon = entry.taskType === "Putaway" ? ArrowDownRight : entry.taskType === "Pick" ? ArrowUpRight : ArrowRight;
  const typeColor = entry.taskType === "Putaway" ? "#1B4F8B" : entry.taskType === "Pick" ? "#7C3AED" : entry.taskType === "Charge" ? "#16A34A" : "#D97706";
  const typeBg = entry.taskType === "Putaway" ? "#DBEAFE" : entry.taskType === "Pick" ? "#F3E8FF" : entry.taskType === "Charge" ? "#DCFCE7" : "#FEF3C7";

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
          <div className="flex items-center gap-2.5">
            <h2 className="text-[16px] font-bold text-[#0F172A]">Movement Detail</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Header Card */}
          <div className="bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: typeBg }}>
                <TypeIcon size={20} color={typeColor} />
              </div>
              <div>
                <p className="text-[12px] text-[#94A3B8] font-medium">{entry.id}</p>
                <p className="text-[16px] font-bold text-[#0F172A]">{entry.taskType}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="inline-flex items-center gap-1 h-6 px-2.5 rounded-full text-[11px] font-semibold"
                style={{
                  backgroundColor: entry.status === "Completed" ? "#DCFCE7" : entry.status === "Exception" ? "#FEE2E2" : "#FEF3C7",
                  color: entry.status === "Completed" ? "#16A34A" : entry.status === "Exception" ? "#DC2626" : "#D97706",
                }}
              >
                {entry.status === "Completed" ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
                {entry.status}
              </span>
              <span className="inline-flex items-center gap-1 h-6 px-2.5 rounded-full text-[11px] font-semibold bg-[#DBEAFE] text-[#1B4F8B]">
                <ScanLine size={12} />
                {entry.scanResult}
              </span>
            </div>
          </div>

          {/* Route */}
          <div>
            <p className="text-[12px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-3">Route</p>
            <div className="flex items-center gap-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] p-4">
              <div className="flex-1">
                <p className="text-[11px] text-[#94A3B8] mb-1">From</p>
                <p className="text-[14px] font-bold text-[#0F172A] flex items-center gap-1.5">
                  <MapPin size={14} className="text-[#DC2626]" />
                  {entry.fromLocation}
                </p>
              </div>
              <ArrowRight size={18} className="text-[#94A3B8] flex-shrink-0" />
              <div className="flex-1">
                <p className="text-[11px] text-[#94A3B8] mb-1">To</p>
                <p className="text-[14px] font-bold text-[#0F172A] flex items-center gap-1.5">
                  <MapPin size={14} className="text-[#16A34A]" />
                  {entry.toLocation}
                </p>
              </div>
            </div>
          </div>

          {/* Piece Details */}
          <div>
            <p className="text-[12px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-3">Piece Details</p>
            <div className="bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-[#64748B] flex items-center gap-2">
                  <Hash size={14} className="text-[#94A3B8]" />AWB #
                </span>
                <span className="text-[13px] font-bold text-[#0F172A]">{entry.awb}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-[#64748B] flex items-center gap-2">
                  <Package size={14} className="text-[#94A3B8]" />Piece ID
                </span>
                <span className="text-[13px] font-bold text-[#0F172A]">{entry.pieceId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-[#64748B] flex items-center gap-2">
                  <ScanLine size={14} className="text-[#94A3B8]" />RFID EPC
                </span>
                <span className="text-[12px] font-mono text-[#64748B] max-w-[180px] truncate">{entry.rfid}</span>
              </div>
            </div>
          </div>

          {/* Execution Details */}
          <div>
            <p className="text-[12px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-3">Execution</p>
            <div className="bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-[#64748B] flex items-center gap-2">
                  <User size={14} className="text-[#94A3B8]" />Operator
                </span>
                <span className="text-[13px] font-bold text-[#0F172A]">{entry.operator}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-[#64748B] flex items-center gap-2">
                  <Hash size={14} className="text-[#94A3B8]" />Lifter Asset
                </span>
                <span className="text-[13px] font-bold text-[#0F172A]">{entry.lifterAsset}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-[#64748B] flex items-center gap-2">
                  <Clock size={14} className="text-[#94A3B8]" />Start Time
                </span>
                <span className="text-[13px] font-bold text-[#0F172A]">{entry.startTime}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-[#64748B] flex items-center gap-2">
                  <Clock size={14} className="text-[#94A3B8]" />End Time
                </span>
                <span className="text-[13px] font-bold text-[#0F172A]">{entry.endTime}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-[#64748B] flex items-center gap-2">
                  <Timer size={14} className="text-[#94A3B8]" />Duration
                </span>
                <span className="text-[13px] font-bold text-[#0F172A]">{entry.duration}</span>
              </div>
            </div>
          </div>

          {/* Exception Notes */}
          {entry.exceptionNotes && (
            <div>
              <p className="text-[12px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-3">Exception Notes</p>
              <div className="bg-[#FEE2E2]/30 rounded-xl border border-[#DC2626]/20 p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle size={16} className="text-[#DC2626] mt-0.5 flex-shrink-0" />
                  <p className="text-[13px] text-[#334155] leading-relaxed">{entry.exceptionNotes}</p>
                </div>
              </div>
            </div>
          )}

          {/* Evidence */}
          {entry.evidence && (
            <div>
              <p className="text-[12px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-3">Evidence</p>
              <div className="bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#EBF0F7] flex items-center justify-center">
                    <Camera size={18} className="text-[#0B2545]" />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-[#0F172A]">{entry.evidence}</p>
                    <p className="text-[12px] text-[#64748B]">Photo captured during movement</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Audit Trail */}
          <div>
            <p className="text-[12px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-3">Audit Trail</p>
            <div className="bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] p-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-[#16A34A] mt-1.5 flex-shrink-0" />
                <div>
                  <p className="text-[13px] font-semibold text-[#0F172A]">Task started</p>
                  <p className="text-[12px] text-[#64748B]">{entry.startTime} — {entry.operator}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-[#2E75B6] mt-1.5 flex-shrink-0" />
                <div>
                  <p className="text-[13px] font-semibold text-[#0F172A]">RFID scan at source</p>
                  <p className="text-[12px] text-[#64748B]">{entry.scanResult} — {entry.startTime}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-[#7C3AED] mt-1.5 flex-shrink-0" />
                <div>
                  <p className="text-[13px] font-semibold text-[#0F172A]">Piece picked and moved</p>
                  <p className="text-[12px] text-[#64748B]">Duration: {entry.duration}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-[#16A34A] mt-1.5 flex-shrink-0" />
                <div>
                  <p className="text-[13px] font-semibold text-[#0F172A]">Task completed</p>
                  <p className="text-[12px] text-[#64748B]">{entry.endTime} — {entry.toLocation}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-4 border-t border-[#E2E8F0] flex-shrink-0 space-y-2">
          <button
            onClick={handleReportCorrection}
            className="w-full h-12 rounded-xl text-[14px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90 whitespace-nowrap"
            style={{ backgroundColor: "#D97706" }}
          >
            <span className="flex items-center justify-center gap-2">
              <AlertTriangle size={16} />
              Report Correction
            </span>
          </button>
          <button
            onClick={handleLinkToAWB}
            className="w-full h-12 rounded-xl text-[14px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer transition-colors whitespace-nowrap"
          >
            <span className="flex items-center justify-center gap-2">
              <FileText size={16} />
              Link to AWB Detail
            </span>
          </button>
        </div>
      </div>
    </>
  );
}