"use client";
import { useToast } from "@/components/ToastContext";
import { Calendar, User, FileText, Shield, Truck, DollarSign, Bot, Warehouse, Archive, CheckCircle, Clock, AlertTriangle, Eye, StickyNote, Pin } from "lucide-react";

interface Note {
  id: string;
  title: string;
  date: string;
  module: string;
  awb: string;
  createdBy: string;
  visibility: string;
  followUp: string;
  preview: string;
  type: string;
  pinned: boolean;
}

const notes: Note[] = [
  { id: "NOTE-2026-0061", title: "Morning Shift Briefing", date: "01 Jun 2026 06:30", module: "Operations", awb: "", createdBy: "Kamran Ali", visibility: "Supervisor Team", followUp: "None", preview: "Morning shift briefing covered cold chain status, gate throughput, and 3 priority AWBs requiring urgent putaway.", type: "Shift Note", pinned: true },
  { id: "NOTE-2026-0062", title: "Cold Chain Alert Zone B02", date: "01 Jun 2026 08:15", module: "Warehouse", awb: "214-66778899", createdBy: "Sana Iqbal", visibility: "Operations", followUp: "Open", preview: "Zone B02 temperature exceeded 8°C threshold for 12 minutes. Sensor calibration flagged. Immediate re-check required.", type: "Safety Note", pinned: true },
  { id: "NOTE-2026-0063", title: "Gate Entry Delay", date: "01 Jun 2026 09:10", module: "Gate Entry", awb: "157-44556677", createdBy: "Nadeem Shah", visibility: "Management", followUp: "Completed", preview: "Vehicle TK-708 delayed due to missing authority letter. Resolved with scanned copy. Letter digitised in system.", type: "Operations Remark", pinned: false },
  { id: "NOTE-2026-0064", title: "Invoice Hold Discussion", date: "01 Jun 2026 10:00", module: "Finance", awb: "074-88219033", createdBy: "Faisal Qureshi", visibility: "Operations", followUp: "Open", preview: "Tariff mapping for AFU cargo class is incomplete. Finance team escalated to tariff master editor.", type: "Issue Follow-up", pinned: false },
  { id: "NOTE-2026-0065", title: "Lifter Hydraulic Issue", date: "01 Jun 2026 11:20", module: "Warehouse", awb: "", createdBy: "Imran Ali", visibility: "Supervisor Team", followUp: "Open", preview: "Lifter L-07 showing hydraulic leak. Temporarily removed from service. Vendor scheduled for 02 Jun 2026.", type: "Operations Remark", pinned: false },
  { id: "NOTE-2026-0066", title: "Safety Observation — Floor 3", date: "01 Jun 2026 11:45", module: "Warehouse", awb: "", createdBy: "Kamran Ali", visibility: "Operations", followUp: "Open", preview: "Loose packaging material observed near conveyor C-03. Cleaning team notified. Follow-up in 2 hours.", type: "Safety Note", pinned: false },
  { id: "NOTE-2026-0067", title: "Customs Coordination Call", date: "01 Jun 2026 12:30", module: "Excise", awb: "117-22334455", createdBy: "Sana Iqbal", visibility: "Management", followUp: "Completed", preview: "Spoke with Customs Officer regarding FHL documentation for AWB-117-22334455. Full clearance provided.", type: "Meeting Minutes", pinned: false },
  { id: "NOTE-2026-0068", title: "End of Shift Meeting", date: "01 Jun 2026 13:00", module: "Operations", awb: "", createdBy: "Kamran Ali", visibility: "Supervisor Team", followUp: "None", preview: "Shift summary: 87 AWBs received, 35 vehicles dispatched. 3 open exceptions remain for next shift.", type: "Shift Note", pinned: false },
  { id: "NOTE-2026-0059", title: "RFID Scanner Calibration", date: "31 May 2026 14:20", module: "Warehouse", awb: "", createdBy: "Imran Ali", visibility: "Operations", followUp: "Completed", preview: "All 12 RFID scanners calibrated successfully. Scanner H-19 flagged for battery replacement.", type: "Operations Remark", pinned: false },
  { id: "NOTE-2026-0058", title: "Gate Weighbridge Malfunction", date: "31 May 2026 10:30", module: "Gate Entry", awb: "", createdBy: "Nadeem Shah", visibility: "Management", followUp: "Completed", preview: "Weighbridge at Gate-01 showed 2% variance. Calibrated by vendor. Variance now within tolerance.", type: "Operations Remark", pinned: false },
];

const moduleIcon: Record<string, React.ReactNode> = {
  Warehouse: <Warehouse size={14} className="text-[#1B4F8B]" />,
  "Gate Entry": <Truck size={14} className="text-[#1B4F8B]" />,
  Finance: <DollarSign size={14} className="text-[#1B4F8B]" />,
  Excise: <Shield size={14} className="text-[#1B4F8B]" />,
  Operations: <Archive size={14} className="text-[#1B4F8B]" />,
  Lifter: <Bot size={14} className="text-[#1B4F8B]" />,
};

const visibilityColor: Record<string, { bg: string; text: string }> = {
  Private: { bg: "#F1F5F9", text: "#64748B" },
  "Supervisor Team": { bg: "#DBEAFE", text: "#1B4F8B" },
  Operations: { bg: "#FEF3C7", text: "#D97706" },
  Management: { bg: "#FEE2E2", text: "#DC2626" },
};

const followUpIcon: Record<string, React.ReactNode> = {
  None: <CheckCircle size={12} className="text-[#16A34A]" />,
  Open: <AlertTriangle size={12} className="text-[#D97706]" />,
  Completed: <CheckCircle size={12} className="text-[#16A34A]" />,
  Overdue: <Clock size={12} className="text-[#DC2626]" />,
};

interface NotesListProps {
  onSelectNote: (id: string) => void;
  selectedId: string;
  searchTerm?: string;
}

export default function NotesList({ onSelectNote, selectedId, searchTerm }: NotesListProps) {
  const filtered = searchTerm
    ? notes.filter((n) =>
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.preview.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.createdBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.awb.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : notes;

  const pinned = filtered.filter((n) => n.pinned);
  const unpinned = filtered.filter((n) => !n.pinned);
  const sorted = [...pinned, ...unpinned];

  const highlightText = (text: string) => {
    if (!searchTerm) return text;
    const parts = text.split(new RegExp(`(${searchTerm})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <mark key={i} className="bg-[#FEF3C7] text-[#D97706] rounded-sm px-0.5">{part}</mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-[15px] font-bold text-[#0F172A]">Notes List</h3>
        </div>
        <span className="text-[12px] text-[#64748B]">{sorted.length} notes</span>
      </div>
      <div className="space-y-3 overflow-y-auto flex-1">
        {sorted.map((n) => {
          const vc = visibilityColor[n.visibility] || { bg: "#F1F5F9", text: "#64748B" };
          const isActive = selectedId === n.id;
          return (
            <button
              key={n.id}
              onClick={() => onSelectNote(n.id)}
              className="w-full text-left rounded-xl border p-4 transition-all cursor-pointer"
              style={{
                borderColor: isActive ? "#1B4F8B" : "#E2E8F0",
                backgroundColor: isActive ? "#EBF0F7" : "white",
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  {n.pinned && <Pin size={12} className="text-[#D97706] flex-shrink-0" />}
                  <h4 className="text-[13px] font-bold text-[#0F172A] leading-snug">{highlightText(n.title)}</h4>
                </div>
                <span className="inline-flex items-center h-5 px-2 rounded-full text-[10px] font-semibold flex-shrink-0" style={{ backgroundColor: vc.bg, color: vc.text }}>
                  {n.visibility}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1 text-[11px] text-[#64748B]">
                  <Calendar size={11} />
                  {n.date}
                </div>
                <div className="flex items-center gap-1 text-[11px] text-[#64748B]">
                  <User size={11} />
                  {n.createdBy}
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1 text-[11px] text-[#0F172A]">
                  {moduleIcon[n.module] || <Archive size={14} className="text-[#1B4F8B]" />}
                  {n.module}
                </div>
                {n.awb && (
                  <span className="text-[11px] text-[#1B4F8B] font-medium">{n.awb}</span>
                )}
              </div>
              <p className="text-[12px] text-[#64748B] mt-2 leading-relaxed line-clamp-2">{highlightText(n.preview)}</p>
              <div className="flex items-center gap-2 mt-3">
                <div className="flex items-center gap-1">
                  {followUpIcon[n.followUp] || <Clock size={12} />}
                  <span className="text-[11px] text-[#64748B]">{n.followUp}</span>
                </div>
                <span className="inline-flex items-center h-5 px-2 rounded-full text-[10px] font-semibold" style={{ backgroundColor: "#F1F5F9", color: "#64748B" }}>
                  {n.type}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}