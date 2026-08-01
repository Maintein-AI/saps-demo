"use client";

import { useState } from "react";
import { useToast } from "@/components/ToastContext";
import { Save, Send, FileText, Mail, X, ChevronDown, ChevronUp, Upload, AlertTriangle } from "lucide-react";

interface FormData {
  shiftDate: string;
  shift: string;
  outgoingSupervisor: string;
  incomingSupervisor: string;
  openAWBs: string;
  pendingPutaway: string;
  pendingPick: string;
  activeHolds: string;
  pendingInvoices: string;
  vehiclesStillInside: string;
  operationalBlockers: string;
  customsBlockers: string;
  financeBlockers: string;
  gateBlockers: string;
  equipmentBlockers: string;
  lifterStatus: string;
  rfidReaderStatus: string;
  handheldScannerStatus: string;
  conveyorStatus: string;
  gateDeviceStatus: string;
  coldChainSensorStatus: string;
  equipmentIssues: string;
  awbsReceived: string;
  piecesReceived: string;
  weightReceived: string;
  specialCargoReceived: string;
  cdrsRaised: string;
  dosIssued: string;
  gatePassesIssued: string;
  vehiclesReleased: string;
  piecesDispatched: string;
  podsCaptured: string;
  openCDRs: string;
  damageCases: string;
  missingDocuments: string;
  gateMismatches: string;
  rfidMismatches: string;
  longStayAlerts: string;
  safetyNotes: string;
  handoverNotes: string;
  attachments: string;
}

const defaultForm: FormData = {
  shiftDate: "2026-06-01",
  shift: "Day Shift A",
  outgoingSupervisor: "Kamran Ali",
  incomingSupervisor: "Sana Iqbal",
  openAWBs: "12",
  pendingPutaway: "4",
  pendingPick: "3",
  activeHolds: "5",
  pendingInvoices: "2",
  vehiclesStillInside: "3",
  operationalBlockers: "Cold chain sensor calibration delayed due to vendor reschedule.",
  customsBlockers: "",
  financeBlockers: "",
  gateBlockers: "",
  equipmentBlockers: "",
  lifterStatus: "5 Operational, 1 Under Maintenance",
  rfidReaderStatus: "All 12 Active",
  handheldScannerStatus: "18 Active, 2 Charging",
  conveyorStatus: "Operational",
  gateDeviceStatus: "All 4 Active",
  coldChainSensorStatus: "3 Active, 1 Alert",
  equipmentIssues: "Lifter L-07 hydraulic leak reported. Scanner H-19 battery degraded.",
  awbsReceived: "87",
  piecesReceived: "3,420",
  weightReceived: "12,450 kg",
  specialCargoReceived: "12 (DG, PER, VAL)",
  cdrsRaised: "3",
  dosIssued: "29",
  gatePassesIssued: "38",
  vehiclesReleased: "35",
  piecesDispatched: "2,890",
  podsCaptured: "31",
  openCDRs: "3",
  damageCases: "2",
  missingDocuments: "1",
  gateMismatches: "1",
  rfidMismatches: "0",
  longStayAlerts: "2",
  safetyNotes: "No incidents reported. All PPE compliance verified.",
  handoverNotes: "Incoming supervisor to prioritize cold chain zone B02 sensor check.",
  attachments: "",
};

const statusOptions = ["All Active", "Operational", "Under Maintenance", "Degraded", "Offline", "Alert"];

const sectionClasses = "rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm";
const sectionTitle = "text-[13px] font-bold text-[#0F172A] mb-4";
const inputLabel = "text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5 block";
const inputClasses = "w-full h-10 px-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-[13px] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#1B4F8B]/20 focus:border-[#1B4F8B] transition-all";
const textareaClasses = "w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-[13px] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#1B4F8B]/20 focus:border-[#1B4F8B] transition-all resize-none";

function TextInput({ label, value, onChange, placeholder, error }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; error?: string }) {
  return (
    <div>
      <label className={inputLabel}>{label}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={inputClasses} />
      {error && <span className="text-[11px] text-[#DC2626] mt-1 block">{error}</span>}
    </div>
  );
}

function NumberInput({ label, value, onChange, error }: { label: string; value: string; onChange: (v: string) => void; error?: string }) {
  return (
    <div>
      <label className={inputLabel}>{label}</label>
      <input type="number" value={value} onChange={(e) => onChange(e.target.value)} className={inputClasses} />
      {error && <span className="text-[11px] text-[#DC2626] mt-1 block">{error}</span>}
    </div>
  );
}

function TextArea({ label, value, onChange, placeholder, rows = 3 }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return (
    <div>
      <label className={inputLabel}>{label}</label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows} className={textareaClasses} />
    </div>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <label className={inputLabel}>{label}</label>
      <button onClick={() => setOpen(!open)} className="w-full h-10 px-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-[13px] text-[#0F172A] flex items-center justify-between cursor-pointer transition-all hover:border-[#94A3B8]">
        <span>{value}</span>
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

export default function HandoverForm() {
  const [form, setForm] = useState<FormData>(defaultForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const { addToast } = useToast();

  const update = (key: keyof FormData) => (val: string) => {
    setForm((prev) => ({ ...prev, [key]: val }));
    if (errors[key as string]) {
      setErrors((prev) => { const n = { ...prev }; delete n[key as string]; return n; });
    }
  };

  const toggleSection = (key: string) => {
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.shiftDate) e.shiftDate = "Shift date is required";
    if (!form.shift) e.shift = "Shift is required";
    if (!form.outgoingSupervisor) e.outgoingSupervisor = "Outgoing supervisor is required";
    if (!form.incomingSupervisor) e.incomingSupervisor = "Incoming supervisor is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      addToast("Please fix validation errors before submitting.", "error");
      return;
    }
    addToast("Shift handover submitted.", "success");
  };

  const handleSaveDraft = () => {
    addToast("Draft saved.", "success");
  };

  const Section = ({ title, sectionKey, children }: { title: string; sectionKey: string; children: React.ReactNode }) => (
    <div className={sectionClasses}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className={sectionTitle}>{title}</h3>
        </div>
        <button onClick={() => toggleSection(sectionKey)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors">
          {collapsed[sectionKey] ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
        </button>
      </div>
      {!collapsed[sectionKey] && children}
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <h2 className="text-[15px] font-bold text-[#0F172A]">Shift Handover Form</h2>
        </div>
      </div>

      <Section title="Shift Information" sectionKey="shiftInfo">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <TextInput label="Shift Date" value={form.shiftDate} onChange={update("shiftDate")} error={errors.shiftDate} />
          <TextInput label="Shift" value={form.shift} onChange={update("shift")} error={errors.shift} />
          <TextInput label="Outgoing Supervisor" value={form.outgoingSupervisor} onChange={update("outgoingSupervisor")} error={errors.outgoingSupervisor} />
          <TextInput label="Incoming Supervisor" value={form.incomingSupervisor} onChange={update("incomingSupervisor")} error={errors.incomingSupervisor} />
        </div>
      </Section>

      <Section title="Open Items" sectionKey="openItems">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <NumberInput label="Open AWBs" value={form.openAWBs} onChange={update("openAWBs")} />
          <NumberInput label="Pending Putaway" value={form.pendingPutaway} onChange={update("pendingPutaway")} />
          <NumberInput label="Pending Pick" value={form.pendingPick} onChange={update("pendingPick")} />
          <NumberInput label="Active Holds" value={form.activeHolds} onChange={update("activeHolds")} />
          <NumberInput label="Pending Invoices" value={form.pendingInvoices} onChange={update("pendingInvoices")} />
          <NumberInput label="Vehicles Still Inside" value={form.vehiclesStillInside} onChange={update("vehiclesStillInside")} />
        </div>
      </Section>

      <Section title="Blockers" sectionKey="blockers">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <TextArea label="Operational Blockers" value={form.operationalBlockers} onChange={update("operationalBlockers")} placeholder="Describe operational blockers..." rows={2} />
          <TextArea label="Customs Blockers" value={form.customsBlockers} onChange={update("customsBlockers")} placeholder="Describe customs blockers..." rows={2} />
          <TextArea label="Finance Blockers" value={form.financeBlockers} onChange={update("financeBlockers")} placeholder="Describe finance blockers..." rows={2} />
          <TextArea label="Gate Blockers" value={form.gateBlockers} onChange={update("gateBlockers")} placeholder="Describe gate blockers..." rows={2} />
          <TextArea label="Equipment Blockers" value={form.equipmentBlockers} onChange={update("equipmentBlockers")} placeholder="Describe equipment blockers..." rows={2} />
        </div>
      </Section>

      <Section title="Equipment Status" sectionKey="equipment">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <TextInput label="Lifter Status Summary" value={form.lifterStatus} onChange={update("lifterStatus")} />
          <TextInput label="RFID Reader Status" value={form.rfidReaderStatus} onChange={update("rfidReaderStatus")} />
          <TextInput label="Handheld Scanner Status" value={form.handheldScannerStatus} onChange={update("handheldScannerStatus")} />
          <TextInput label="Conveyor Status" value={form.conveyorStatus} onChange={update("conveyorStatus")} />
          <TextInput label="Gate Device Status" value={form.gateDeviceStatus} onChange={update("gateDeviceStatus")} />
          <TextInput label="Cold Chain Sensor Status" value={form.coldChainSensorStatus} onChange={update("coldChainSensorStatus")} />
          <div className="md:col-span-2 lg:col-span-3">
            <TextArea label="Equipment Issues" value={form.equipmentIssues} onChange={update("equipmentIssues")} placeholder="Detail equipment issues..." rows={3} />
          </div>
        </div>
      </Section>

      <Section title="Receipts Summary" sectionKey="receipts">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <NumberInput label="AWBs Received" value={form.awbsReceived} onChange={update("awbsReceived")} />
          <NumberInput label="Pieces Received" value={form.piecesReceived} onChange={update("piecesReceived")} />
          <TextInput label="Weight Received" value={form.weightReceived} onChange={update("weightReceived")} />
          <TextInput label="Special Cargo Received" value={form.specialCargoReceived} onChange={update("specialCargoReceived")} />
          <NumberInput label="CDRs Raised" value={form.cdrsRaised} onChange={update("cdrsRaised")} />
        </div>
      </Section>

      <Section title="Dispatch Summary" sectionKey="dispatch">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <NumberInput label="DOs Issued" value={form.dosIssued} onChange={update("dosIssued")} />
          <NumberInput label="Gate Passes Issued" value={form.gatePassesIssued} onChange={update("gatePassesIssued")} />
          <NumberInput label="Vehicles Released" value={form.vehiclesReleased} onChange={update("vehiclesReleased")} />
          <NumberInput label="Pieces Dispatched" value={form.piecesDispatched} onChange={update("piecesDispatched")} />
          <NumberInput label="PODs Captured" value={form.podsCaptured} onChange={update("podsCaptured")} />
        </div>
      </Section>

      <Section title="Exceptions Summary" sectionKey="exceptions">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <NumberInput label="Open CDRs" value={form.openCDRs} onChange={update("openCDRs")} />
          <NumberInput label="Damage Cases" value={form.damageCases} onChange={update("damageCases")} />
          <NumberInput label="Missing Documents" value={form.missingDocuments} onChange={update("missingDocuments")} />
          <NumberInput label="Gate Mismatches" value={form.gateMismatches} onChange={update("gateMismatches")} />
          <NumberInput label="RFID Mismatches" value={form.rfidMismatches} onChange={update("rfidMismatches")} />
          <NumberInput label="Long-Stay Alerts" value={form.longStayAlerts} onChange={update("longStayAlerts")} />
        </div>
      </Section>

      <Section title="Notes" sectionKey="notes">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextArea label="Safety Notes" value={form.safetyNotes} onChange={update("safetyNotes")} placeholder="Safety observations..." rows={3} />
          <TextArea label="Handover Notes" value={form.handoverNotes} onChange={update("handoverNotes")} placeholder="General handover notes..." rows={3} />
        </div>
        <div className="mt-4">
          <label className={inputLabel}>Attachments</label>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 h-10 px-4 rounded-xl border border-[#E2E8F0] text-[12px] font-medium text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer transition-colors">
              <Upload size={14} /> Upload Files
            </button>
            <span className="text-[12px] text-[#94A3B8]">No files selected</span>
          </div>
        </div>
      </Section>

      <div className="flex flex-wrap items-center gap-3 pt-4">
        <button onClick={handleSaveDraft} className="flex items-center gap-2 h-10 px-5 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F1F5F9] cursor-pointer transition-colors">
          <Save size={16} /> Save Draft
        </button>
        <button onClick={handleSubmit} className="flex items-center gap-2 h-10 px-5 rounded-xl text-[13px] font-semibold text-white cursor-pointer hover:opacity-90 transition-colors" style={{ backgroundColor: "#0B2545" }}>
          <Send size={16} /> Submit Handover
        </button>
        <button className="flex items-center gap-2 h-10 px-5 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F1F5F9] cursor-pointer transition-colors">
          <FileText size={16} /> Generate PDF
        </button>
        <button className="flex items-center gap-2 h-10 px-5 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F1F5F9] cursor-pointer transition-colors">
          <Mail size={16} /> Email Incoming Supervisor
        </button>
        <button className="flex items-center gap-2 h-10 px-5 rounded-xl text-[13px] font-semibold border border-[#DC2626]/30 text-[#DC2626] hover:bg-[#DC2626]/10 cursor-pointer transition-colors">
          <X size={16} /> Cancel
        </button>
      </div>
    </div>
  );
}