"use client";

import { useState } from "react";
import { useToast } from "@/components/ToastContext";
import { Save, Send, Plus, Trash2, Upload, FileText, CheckCircle, X, ChevronDown, User, Calendar, FileText as FileTextIcon, Eye, Shield, Users, Building } from "lucide-react";

interface NoteDetail {
  id: string;
  title: string;
  date: string;
  module: string;
  awb: string;
  type: string;
  body: string;
  visibility: string;
  followUpRequired: boolean;
  followUpOwner: string;
  dueDate: string;
  createdBy: string;
}

const noteDetails: Record<string, NoteDetail> = {
  "NOTE-2026-0061": { id: "NOTE-2026-0061", title: "Morning Shift Briefing", date: "2026-06-01", module: "Operations", awb: "", type: "Shift Note", body: "Morning shift briefing covered cold chain status, gate throughput, and 3 priority AWBs requiring urgent putaway. Cold chain Zone B02 sensor showing intermittent drift. Gate team confirmed 4 trucks in queue.\n\nPriority AWBs:\n- 214-45678901 (Damage alert)\n- 157-90811223 (Gate mismatch)\n- 074-88219033 (Payment hold)", visibility: "Supervisor Team", followUpRequired: false, followUpOwner: "", dueDate: "", createdBy: "Kamran Ali" },
  "NOTE-2026-0062": { id: "NOTE-2026-0062", title: "Cold Chain Alert Zone B02", date: "2026-06-01", module: "Warehouse", awb: "214-66778899", type: "Safety Note", body: "Zone B02 temperature exceeded 8°C threshold for 12 minutes at 07:48 AM. Sensor reading peaked at 8.4°C. Cargo in zone is PER (pharmaceuticals) and must be flagged.\n\nImmediate actions taken:\n- Alerted cold chain supervisor\n- Moved cargo to Zone B03\n- Logged incident in cold chain register\n\nFollow-up: Sensor calibration needed by vendor.", visibility: "Operations", followUpRequired: true, followUpOwner: "Sana Iqbal", dueDate: "2026-06-01", createdBy: "Sana Iqbal" },
  "NOTE-2026-0063": { id: "NOTE-2026-0063", title: "Gate Entry Delay", date: "2026-06-01", module: "Gate Entry", awb: "157-44556677", type: "Operations Remark", body: "Vehicle TK-708 delayed by 45 minutes due to missing authority letter. Driver contacted consignee and received scanned copy via WhatsApp. Scanned copy uploaded to system. Original letter to be collected on next visit.", visibility: "Management", followUpRequired: false, followUpOwner: "", dueDate: "", createdBy: "Nadeem Shah" },
  "NOTE-2026-0064": { id: "NOTE-2026-0064", title: "Invoice Hold Discussion", date: "2026-06-01", module: "Finance", awb: "074-88219033", type: "Issue Follow-up", body: "Tariff mapping for AFU cargo class is incomplete in the tariff master. Finance team escalated to tariff master editor. Invoice INV-2026-05231 is on hold pending resolution.\n\nNext steps:\n- Update tariff master with AFU class\n- Re-run invoice generation\n- Notify consignee of expected delay", visibility: "Operations", followUpRequired: true, followUpOwner: "Faisal Qureshi", dueDate: "2026-06-02", createdBy: "Faisal Qureshi" },
  "NOTE-2026-0065": { id: "NOTE-2026-0065", title: "Lifter Hydraulic Issue", date: "2026-06-01", module: "Warehouse", awb: "", type: "Operations Remark", body: "Lifter L-07 showing hydraulic leak near the main lift cylinder. Pooling oil observed under unit during morning inspection. Unit immediately removed from service and tagged.\n\nVendor MHE Services contacted. Technician scheduled for 02 Jun 2026 09:00 AM. Temporary replacement lifter L-12 deployed.", visibility: "Supervisor Team", followUpRequired: true, followUpOwner: "Imran Ali", dueDate: "2026-06-02", createdBy: "Imran Ali" },
  "NOTE-2026-0066": { id: "NOTE-2026-0066", title: "Safety Observation — Floor 3", date: "2026-06-01", module: "Warehouse", awb: "", type: "Safety Note", body: "Loose packaging material (cardboard and shrink wrap) observed accumulating near conveyor C-03. Potential slip and trip hazard.\n\nCleaning team notified. Area cordoned off. Follow-up inspection scheduled for 13:00. Root cause: insufficient waste bins near packing station.", visibility: "Operations", followUpRequired: true, followUpOwner: "Kamran Ali", dueDate: "2026-06-01", createdBy: "Kamran Ali" },
  "NOTE-2026-0067": { id: "NOTE-2026-0067", title: "Customs Coordination Call", date: "2026-06-01", module: "Excise", awb: "117-22334455", type: "Meeting Minutes", body: "Spoke with Customs Officer Bilal regarding FHL documentation for AWB-117-22334455. Full FHL message received and verified. Customs-CHK-51 closed.\n\nOfficer confirmed no further holds. Release order issued. AWB cleared for dispatch.", visibility: "Management", followUpRequired: false, followUpOwner: "", dueDate: "", createdBy: "Sana Iqbal" },
  "NOTE-2026-0068": { id: "NOTE-2026-0068", title: "End of Shift Meeting", date: "2026-06-01", module: "Operations", awb: "", type: "Shift Note", body: "Shift summary for Day Shift A (01 Jun 2026):\n\n- AWBs received: 87\n- Pieces received: 3,420\n- Weight received: 12,450 kg\n- Vehicles dispatched: 35\n- Pieces dispatched: 2,890\n\nOpen exceptions for next shift:\n- 3 open CDRs\n- 2 damage cases pending insurance\n- 1 customs hold (resolved during shift)", visibility: "Supervisor Team", followUpRequired: false, followUpOwner: "", dueDate: "", createdBy: "Kamran Ali" },
  "NOTE-2026-0059": { id: "NOTE-2026-0059", title: "RFID Scanner Calibration", date: "2026-05-31", module: "Warehouse", awb: "", type: "Operations Remark", body: "All 12 RFID scanners calibrated successfully. Calibration performed by vendor RFIT Solutions.\n\nScanner H-19 flagged for battery replacement. Battery life down to 18%. Replacement battery ordered. ETA: 03 Jun 2026.", visibility: "Operations", followUpRequired: false, followUpOwner: "", dueDate: "", createdBy: "Imran Ali" },
  "NOTE-2026-0058": { id: "NOTE-2026-0058", title: "Gate Weighbridge Malfunction", date: "2026-05-31", module: "Gate Entry", awb: "", type: "Operations Remark", body: "Weighbridge at Gate-01 showing 2.3% variance during morning checks. Vendor ScaleTech Pakistan called. Technician arrived and calibrated unit.\n\nPost-calibration variance: 0.4% (within tolerance). Unit signed off and returned to service.", visibility: "Management", followUpRequired: false, followUpOwner: "", dueDate: "", createdBy: "Nadeem Shah" },
};

const noteTypeOptions = ["Shift Note", "Safety Note", "Operations Remark", "Meeting Minutes", "Issue Follow-up", "General"];
const visibilityOptions = ["Private", "Supervisor Team", "Operations", "Management"];
const moduleOptions = ["Warehouse", "Gate Entry", "Finance", "Excise", "Planner", "Lifter", "Operations"];

const visibilityIcon: Record<string, React.ReactNode> = {
  Private: <Eye size={14} className="text-[#64748B]" />,
  "Supervisor Team": <Users size={14} className="text-[#1B4F8B]" />,
  Operations: <Shield size={14} className="text-[#D97706]" />,
  Management: <Building size={14} className="text-[#DC2626]" />,
};

const inputLabel = "text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5 block";
const inputClasses = "w-full h-10 px-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-[13px] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#1B4F8B]/20 focus:border-[#1B4F8B] transition-all";
const textareaClasses = "w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-[13px] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#1B4F8B]/20 focus:border-[#1B4F8B] transition-all resize-none";

function Select({ label, value, onChange, options, icon }: { label: string; value: string; onChange: (v: string) => void; options: string[]; icon?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <label className={inputLabel}>{label}</label>
      <button onClick={() => setOpen(!open)} className="w-full h-10 px-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-[13px] text-[#0F172A] flex items-center justify-between cursor-pointer transition-all hover:border-[#94A3B8]">
        <div className="flex items-center gap-2">
          {icon}
          <span>{value}</span>
        </div>
        <ChevronDown size={14} className="text-[#64748B]" />
      </button>
      {open && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-[#E2E8F0] rounded-xl shadow-lg overflow-hidden">
          {options.map((opt) => (
            <button key={opt} onClick={() => { onChange(opt); setOpen(false); }} className="w-full text-left px-3 py-2 text-[12px] text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer transition-colors">
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function TextInput({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className={inputLabel}>{label}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={inputClasses} />
    </div>
  );
}

function TextArea({ label, value, onChange, rows = 4 }: { label: string; value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <div>
      <label className={inputLabel}>{label}</label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} className={textareaClasses} />
    </div>
  );
}

interface NoteEditorProps {
  noteId: string;
}

export default function NoteEditor({ noteId }: NoteEditorProps) {
  const data = noteDetails[noteId] || noteDetails["NOTE-2026-0061"];
  const { addToast } = useToast();

  const [title, setTitle] = useState(data.title);
  const [date, setDate] = useState(data.date);
  const [module, setModule] = useState(data.module);
  const [awb, setAwb] = useState(data.awb);
  const [type, setType] = useState(data.type);
  const [body, setBody] = useState(data.body);
  const [visibility, setVisibility] = useState(data.visibility);
  const [followUpRequired, setFollowUpRequired] = useState(data.followUpRequired);
  const [followUpOwner, setFollowUpOwner] = useState(data.followUpOwner);
  const [dueDate, setDueDate] = useState(data.dueDate);

  const handleSave = () => {
    addToast("Note saved.", "success");
  };

  const handlePublish = () => {
    addToast("Note published.", "success");
  };

  const handleDelete = () => {
    addToast("Note deleted.", "success");
  };

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <h3 className="text-[15px] font-bold text-[#0F172A]">Note Editor</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-[#64748B]">{data.id}</span>
        </div>
      </div>

      <div className="space-y-4 overflow-y-auto flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextInput label="Note Title" value={title} onChange={setTitle} placeholder="Enter note title..." />
          <TextInput label="Date" value={date} onChange={setDate} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select label="Related Module" value={module} onChange={setModule} options={moduleOptions} />
          <TextInput label="Related AWB" value={awb} onChange={setAwb} placeholder="Enter AWB number..." />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select label="Note Type" value={type} onChange={setType} options={noteTypeOptions} icon={<FileTextIcon size={14} className="text-[#64748B]" />} />
          <Select label="Visibility" value={visibility} onChange={setVisibility} options={visibilityOptions} icon={visibilityIcon[visibility] || <Eye size={14} className="text-[#64748B]" />} />
        </div>

        <TextArea label="Note Body" value={body} onChange={setBody} rows={8} />

        <div>
          <label className={inputLabel}>Attachments</label>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 h-10 px-4 rounded-xl border border-[#E2E8F0] text-[12px] font-medium text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer transition-colors">
              <Upload size={14} /> Attach File
            </button>
            <span className="text-[12px] text-[#94A3B8]">No files attached</span>
          </div>
        </div>

        <div className="flex items-center gap-3 py-2">
          <button
            onClick={() => setFollowUpRequired(!followUpRequired)}
            className="flex items-center gap-2 h-9 px-3 rounded-xl text-[12px] font-semibold border cursor-pointer transition-colors"
            style={{
              borderColor: followUpRequired ? "#16A34A" : "#E2E8F0",
              backgroundColor: followUpRequired ? "#16A34A" : "transparent",
              color: followUpRequired ? "white" : "#64748B",
            }}
          >
            <CheckCircle size={14} /> Follow-up Required
          </button>
        </div>

        {followUpRequired && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput label="Follow-up Owner" value={followUpOwner} onChange={setFollowUpOwner} placeholder="Assign owner..." />
            <TextInput label="Due Date" value={dueDate} onChange={setDueDate} />
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-5 border-t border-[#E2E8F0] mt-5">
        <button onClick={handleSave} className="flex items-center gap-2 h-10 px-5 rounded-xl text-[13px] font-semibold text-white cursor-pointer hover:opacity-90 transition-colors" style={{ backgroundColor: "#0B2545" }}>
          <Save size={16} /> Save Note
        </button>
        <button onClick={handlePublish} className="flex items-center gap-2 h-10 px-5 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F1F5F9] cursor-pointer transition-colors">
          <Send size={16} /> Publish Note
        </button>
        <button className="flex items-center gap-2 h-10 px-5 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F1F5F9] cursor-pointer transition-colors">
          <Plus size={16} /> Add Follow-up
        </button>
        <button className="flex items-center gap-2 h-10 px-5 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F1F5F9] cursor-pointer transition-colors">
          <Upload size={16} /> Attach File
        </button>
        <button className="flex items-center gap-2 h-10 px-5 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F1F5F9] cursor-pointer transition-colors">
          <FileText size={16} /> Export Notes
        </button>
        <button onClick={handleDelete} className="flex items-center gap-2 h-10 px-5 rounded-xl text-[13px] font-semibold border border-[#DC2626]/30 text-[#DC2626] hover:bg-[#DC2626]/10 cursor-pointer transition-colors">
          <Trash2 size={16} /> Delete Draft
        </button>
        <button className="flex items-center gap-2 h-10 px-5 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F1F5F9] cursor-pointer transition-colors">
          <X size={16} /> Cancel
        </button>
      </div>
    </div>
  );
}