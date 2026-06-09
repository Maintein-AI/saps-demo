import { AlertTriangle, FileX, Clock, PackageOpen, Tag } from "lucide-react";
import ScopeBadge from "../../ScopeBadge";
import type { MessageGap } from "./types";

const messageGaps: MessageGap[] = [
  { id: "G-001", flightNumber: "QR610", gapType: "FWB missing", severity: "High", description: "FWB message not received for flight QR610" },
  { id: "G-002", flightNumber: "SV703", gapType: "FHL pending", severity: "Medium", description: "FHL message expected within 2 hours" },
  { id: "G-003", flightNumber: "EK606", gapType: "FWB missing", severity: "High", description: "FWB missing for 3 expected AWBs" },
  { id: "G-004", flightNumber: "TK712", gapType: "Flight manifest mismatch", severity: "High", description: "FFM message not received" },
  { id: "G-005", flightNumber: "PA410", gapType: "Cargo class incomplete", severity: "Low", description: "One AWB missing cargo class declaration" },
  { id: "G-006", flightNumber: "SV705", gapType: "Expected AWB not received", severity: "Medium", description: "2 AWBs from manifest not yet received" },
];

function getSeverityStyle(severity: string) {
  switch (severity) {
    case "High": return { bg: "#DC2626", text: "white", icon: <AlertTriangle size={14} className="text-[#DC2626]" /> };
    case "Medium": return { bg: "#F59E0B", text: "white", icon: <Clock size={14} className="text-[#F59E0B]" /> };
    case "Low": return { bg: "#3B82F6", text: "white", icon: <Tag size={14} className="text-[#3B82F6]" /> };
    default: return { bg: "#94A3B8", text: "white", icon: <Tag size={14} className="text-[#94A3B8]" /> };
  }
}

function getGapIcon(type: string) {
  if (type.includes("FWB")) return <FileX size={14} />;
  if (type.includes("FHL")) return <Clock size={14} />;
  if (type.includes("manifest")) return <AlertTriangle size={14} />;
  if (type.includes("AWB")) return <PackageOpen size={14} />;
  return <Tag size={14} />;
}

interface MessageGapPanelProps {
  onFlagGap: (gap: MessageGap) => void;
}

export default function MessageGapPanel({ onFlagGap }: MessageGapPanelProps) {
  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-white overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-bold text-[#0F172A]">Message Gaps</span>
          <ScopeBadge type="inc" />
        </div>
        <span className="text-[12px] text-[#64748B]">{messageGaps.length} alerts</span>
      </div>
      <div className="divide-y divide-[#E2E8F0]">
        {messageGaps.map((gap) => {
          const sevStyle = getSeverityStyle(gap.severity);
          return (
            <div key={gap.id} className="px-4 py-3 flex items-start gap-3 hover:bg-[#F8FAFC] transition-colors">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#F1F5F9] flex items-center justify-center mt-0.5">
                {getGapIcon(gap.gapType)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[13px] font-bold text-[#0F172A]">{gap.flightNumber}</span>
                  <span
                    className="inline-flex items-center h-[18px] px-1.5 rounded text-[10px] font-semibold whitespace-nowrap"
                    style={{ backgroundColor: sevStyle.bg, color: sevStyle.text }}
                  >
                    {gap.severity}
                  </span>
                </div>
                <div className="text-[12px] font-medium text-[#1B4F8B] mb-0.5">{gap.gapType}</div>
                <div className="text-[12px] text-[#64748B]">{gap.description}</div>
              </div>
              <button
                onClick={() => onFlagGap(gap)}
                className="flex-shrink-0 h-7 px-2.5 rounded-lg text-[11px] font-medium border border-[#E2E8F0] text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A] cursor-pointer transition-colors whitespace-nowrap"
              >
                Flag Gap
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}