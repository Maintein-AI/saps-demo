"use client";

import { useState } from "react";
import { useToast } from "@/components/ToastContext";
import {
  Search,
  Check,
  X,
  Clock,
  Ban,
  CheckCircle2,
  CheckCircle,
  XCircle,
  User,
  Truck,
  Calendar,
  Hash,
  FileText,
  Save,
  FileDown,
  Shield,
  Eye,
  ChevronDown,
  AlertTriangle,
  RefreshCw,
  Plus,
} from "lucide-react";

interface Shipment {
  awb: string;
  hawb: string;
  doNumber: string;
  consignee: string;
  carrier: string;
  flight: string;
  arrival: string;
  pieces: number;
  weight: string;
  cargoClass: string;
  customsOoc: boolean;
  chargesCleared: boolean;
  doIssued: boolean;
  activeHold: boolean;
}

interface Driver {
  id: string;
  name: string;
  cnic: string;
  mobile: string;
  licenseNo: string;
  licenseExpiry: string;
}

interface Vehicle {
  id: string;
  number: string;
  type: string;
  capacity: string;
  owner: string;
}

interface Slot {
  id: string;
  bay: string;
  hour: string;
  status: "Available" | "Booked" | "Pending Approval" | "Blocked";
  awb?: string;
}

interface PickupRecord {
  id: string;
  awb: string;
  doNumber: string;
  driver: string;
  vehicle: string;
  pickupDate: string;
  slot: string;
  bay: string;
  status: "Draft" | "Pending Approval" | "Approved" | "Rejected" | "Completed" | "Cancelled";
}

const shipments: Shipment[] = [
  { awb: "157-90811223", hawb: "HAWB-001234", doNumber: "DO-90872", consignee: "Karachi Pharma Imports", carrier: "Qatar Airways Cargo", flight: "QR-604", arrival: "31 May 2026, 11:25", pieces: 8, weight: "420 kg", cargoClass: "PER", customsOoc: true, chargesCleared: true, doIssued: true, activeHold: false },
  { awb: "214-45678901", hawb: "HAWB-005678", doNumber: "DO-90871", consignee: "Al Noor Traders", carrier: "Emirates SkyCargo", flight: "EK-604", arrival: "31 May 2026, 09:15", pieces: 24, weight: "1,240 kg", cargoClass: "AFU", customsOoc: false, chargesCleared: false, doIssued: true, activeHold: true },
  { awb: "074-88219033", hawb: "HAWB-009012", doNumber: "DO-90873", consignee: "Metro Engineering", carrier: "Turkish Cargo", flight: "TK-708", arrival: "31 May 2026, 13:40", pieces: 16, weight: "680 kg", cargoClass: "GCR", customsOoc: true, chargesCleared: true, doIssued: true, activeHold: false },
  { awb: "117-55667788", hawb: "HAWB-003456", doNumber: "DO-90874", consignee: "Karachi Pharma Imports", carrier: "Etihad Cargo", flight: "EY-241", arrival: "30 May 2026, 16:20", pieces: 42, weight: "2,110 kg", cargoClass: "GCR", customsOoc: false, chargesCleared: false, doIssued: false, activeHold: true },
  { awb: "214-99887766", hawb: "HAWB-007890", doNumber: "DO-90877", consignee: "Al Noor Traders", carrier: "Saudia Cargo", flight: "SV-732", arrival: "29 May 2026, 08:50", pieces: 12, weight: "540 kg", cargoClass: "PER", customsOoc: true, chargesCleared: true, doIssued: true, activeHold: false },
  { awb: "157-33445566", hawb: "HAWB-002345", doNumber: "DO-90878", consignee: "Metro Engineering", carrier: "Emirates SkyCargo", flight: "EK-606", arrival: "28 May 2026, 10:15", pieces: 20, weight: "980 kg", cargoClass: "VAL", customsOoc: true, chargesCleared: true, doIssued: true, activeHold: false },
];

const savedDrivers: Driver[] = [
  { id: "DRV-001", name: "Ahmed Raza", cnic: "42101-1234567-1", mobile: "0300-1234567", licenseNo: "KHI-LIC-88421", licenseExpiry: "15 Dec 2028" },
  { id: "DRV-002", name: "Imran Ali", cnic: "35201-2345678-3", mobile: "0301-2345678", licenseNo: "BJU-LIC-77210", licenseExpiry: "03 Aug 2027" },
  { id: "DRV-003", name: "Kashif Khan", cnic: "42101-3456789-5", mobile: "0302-3456789", licenseNo: "KHI-LIC-99341", licenseExpiry: "22 Mar 2029" },
  { id: "DRV-004", name: "Bilal Ahmed", cnic: "36401-4567890-7", mobile: "0303-4567890", licenseNo: "LHE-LIC-22174", licenseExpiry: "11 Nov 2027" },
  { id: "DRV-005", name: "Nadeem Hussain", cnic: "35201-6789012-1", mobile: "0304-6789012", licenseNo: "KHI-LIC-99213", licenseExpiry: "07 Jul 2028" },
];

const savedVehicles: Vehicle[] = [
  { id: "VEH-001", number: "KHI-4582", type: "Truck", capacity: "3.5 Ton", owner: "Ahmed Raza" },
  { id: "VEH-002", number: "BJU-7721", type: "Pickup", capacity: "1.5 Ton", owner: "Imran Ali" },
  { id: "VEH-003", number: "KHI-9934", type: "Container", capacity: "20 FT", owner: "Kashif Khan" },
  { id: "VEH-004", number: "LHE-2217", type: "Truck", capacity: "5 Ton", owner: "Bilal Ahmed" },
  { id: "VEH-005", number: "KHI-9921", type: "Truck", capacity: "4 Ton", owner: "Nadeem Hussain" },
  { id: "VEH-006", number: "KHI-7788", type: "Van", capacity: "800 kg", owner: "Rashid Mehmood" },
  { id: "VEH-007", number: "KHI-3344", type: "Pickup", capacity: "1.2 Ton", owner: "Faisal Khan" },
];

const bays = ["Vehicle Bay 01", "Vehicle Bay 02", "Vehicle Bay 03", "Special Cargo Bay", "Cold-chain Bay"];

const hours = ["06:00","07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00","23:00"];

const generateSlots = (): Slot[] => {
  const slots: Slot[] = [];
  bays.forEach((bay) => {
    hours.forEach((hour) => {
      const rand = Math.random();
      let status: Slot["status"] = "Available";
      let awb: string | undefined;
      if (rand < 0.12) { status = "Booked"; awb = ["157-90811223","214-45678901","074-88219033","214-99887766","157-33445566"][Math.floor(Math.random()*5)]; }
      else if (rand < 0.18) status = "Pending Approval";
      else if (rand < 0.22) status = "Blocked";
      slots.push({ id: `${bay}-${hour}`, bay, hour, status, awb });
    });
  });
  return slots;
};

const initialSlots = generateSlots();

const pickupRecords: PickupRecord[] = [
  { id: "PU-2026-001", awb: "214-45678901", doNumber: "DO-90871", driver: "Ahmed Raza", vehicle: "KHI-4582", pickupDate: "01 Jun 2026", slot: "06:00", bay: "Vehicle Bay 01", status: "Completed" },
  { id: "PU-2026-002", awb: "117-55443321", doNumber: "DO-90873", driver: "Imran Ali", vehicle: "BJU-7721", pickupDate: "01 Jun 2026", slot: "07:00", bay: "Vehicle Bay 01", status: "Approved" },
  { id: "PU-2026-003", awb: "117-98765432", doNumber: "DO-90875", driver: "Kashif Khan", vehicle: "KHI-9934", pickupDate: "01 Jun 2026", slot: "08:00", bay: "Vehicle Bay 02", status: "Approved" },
  { id: "PU-2026-004", awb: "074-88219033", doNumber: "DO-90874", driver: "Bilal Ahmed", vehicle: "LHE-2217", pickupDate: "01 Jun 2026", slot: "10:00", bay: "Vehicle Bay 01", status: "Pending Approval" },
  { id: "PU-2026-005", awb: "157-90811223", doNumber: "DO-90872", driver: "Nadeem Hussain", vehicle: "KHI-9921", pickupDate: "01 Jun 2026", slot: "12:00", bay: "Vehicle Bay 01", status: "Approved" },
  { id: "PU-2026-006", awb: "214-99887766", doNumber: "DO-90877", driver: "Rashid Mehmood", vehicle: "KHI-7788", pickupDate: "01 Jun 2026", slot: "09:00", bay: "Vehicle Bay 03", status: "Approved" },
  { id: "PU-2026-007", awb: "074-55667788", doNumber: "DO-90879", driver: "Faisal Khan", vehicle: "KHI-3344", pickupDate: "01 Jun 2026", slot: "11:00", bay: "Vehicle Bay 02", status: "Pending Approval" },
  { id: "PU-2026-008", awb: "117-44556677", doNumber: "DO-90878", driver: "Saad Qureshi", vehicle: "KHI-4455", pickupDate: "01 Jun 2026", slot: "16:00", bay: "Vehicle Bay 02", status: "Approved" },
  { id: "PU-2026-009", awb: "214-44556677", doNumber: "DO-90881", driver: "Kamran Khan", vehicle: "BJU-5544", pickupDate: "01 Jun 2026", slot: "13:00", bay: "Vehicle Bay 02", status: "Completed" },
  { id: "PU-2026-010", awb: "157-11223344", doNumber: "DO-90880", driver: "Javed Iqbal", vehicle: "KHI-1122", pickupDate: "01 Jun 2026", slot: "14:00", bay: "Vehicle Bay 03", status: "Draft" },
];

const statusConfig: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  Draft: { bg: "#F1F5F9", text: "#64748B", icon: <Clock size={12} /> },
  "Pending Approval": { bg: "#FEF3C7", text: "#D97706", icon: <Clock size={12} /> },
  Approved: { bg: "#DCFCE7", text: "#16A34A", icon: <CheckCircle size={12} /> },
  Rejected: { bg: "#FEE2E2", text: "#DC2626", icon: <XCircle size={12} /> },
  Completed: { bg: "#DBEAFE", text: "#1D4ED8", icon: <CheckCircle size={12} /> },
  Cancelled: { bg: "#FEE2E2", text: "#DC2626", icon: <Ban size={12} /> },
};

const slotStatusConfig: Record<string, { bg: string; text: string; icon: React.ReactNode; label: string }> = {
  Available: { bg: "#DCFCE7", text: "#16A34A", icon: <Check size={10} />, label: "Available" },
  Booked: { bg: "#DBEAFE", text: "#1D4ED8", icon: <CheckCircle2 size={10} />, label: "Booked" },
  "Pending Approval": { bg: "#FEF3C7", text: "#D97706", icon: <Clock size={10} />, label: "Pending" },
  Blocked: { bg: "#FEE2E2", text: "#DC2626", icon: <Ban size={10} />, label: "Blocked" },
};

const vehicleTypeOptions = ["Pickup", "Truck", "Container", "Bike", "Car", "Van"];

export default function SchedulePickupContent() {
  const { addToast } = useToast();
  const [searchAWB, setSearchAWB] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selected, setSelected] = useState<Shipment | null>(null);
  const [slots] = useState<Slot[]>(initialSlots);
  const [pickups] = useState<PickupRecord[]>(pickupRecords);

  const [driverMode, setDriverMode] = useState<"saved" | "one-time">("saved");
  const [selectedDriver, setSelectedDriver] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [pickupDate, setPickupDate] = useState("2026-06-01");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [notes, setNotes] = useState("");

  const [oneTimeDriver, setOneTimeDriver] = useState({ name: "", cnic: "", mobile: "", licenseNo: "", licenseExpiry: "" });
  const [oneTimeVehicle, setOneTimeVehicle] = useState({ number: "", type: "Pickup", capacity: "", owner: "" });

  const [gateRequirements] = useState([
    { id: "authority", label: "Authority letter", icon: <FileText size={14} />, checked: false },
    { id: "identity", label: "Driver identity", icon: <User size={14} />, checked: false },
    { id: "registration", label: "Vehicle registration", icon: <Truck size={14} />, checked: false },
    { id: "do", label: "DO", icon: <FileText size={14} />, checked: true },
    { id: "receipt", label: "Payment receipt", icon: <FileText size={14} />, checked: true },
    { id: "confirmation", label: "Pickup confirmation", icon: <CheckCircle size={14} />, checked: false },
  ]);

  const filteredShipments = searchAWB.trim()
    ? shipments.filter((s) => s.awb.toLowerCase().includes(searchAWB.toLowerCase()))
    : shipments;

  const handleSelectAWB = (awb: string) => {
    const found = shipments.find((s) => s.awb === awb);
    setSelected(found || null);
    setSearchAWB(awb);
    setShowDropdown(false);
  };

  const isEligible = selected
    ? selected.customsOoc && selected.chargesCleared && selected.doIssued && !selected.activeHold
    : false;

  const handleSchedule = () => {
    if (!selected) { addToast("Please select an AWB first.", "error"); return; }
    if (!isEligible) { addToast("This shipment is not eligible for pickup.", "error"); return; }
    if (!selectedDriver && driverMode === "saved") { addToast("Please select a driver.", "error"); return; }
    if (driverMode === "one-time" && !oneTimeDriver.name) { addToast("Please enter driver details.", "error"); return; }
    if (!selectedVehicle) { addToast("Please select a vehicle.", "error"); return; }
    if (!selectedSlot) { addToast("Please select a pickup slot.", "error"); return; }
    addToast("Pickup scheduled successfully.", "success");
  };

  const handleSaveDraft = () => {
    if (!selected) { addToast("Please select an AWB first.", "error"); return; }
    addToast("Draft saved.", "success");
  };

  const handleCancelPickup = (id: string) => {
    addToast(`Pickup ${id} cancelled.`, "success");
  };

  const handleDownloadConfirmation = (id: string) => {
    addToast(`Booking confirmation for ${id} downloaded.`, "success");
  };

  const getSlot = (bay: string, hour: string): Slot | undefined => {
    return slots.find((s) => s.bay === bay && s.hour === hour);
  };

  const handleSlotClick = (slot: Slot) => {
    if (slot.status === "Available") {
      setSelectedSlot(`${slot.bay} — ${slot.hour}`);
      addToast(`${slot.bay} at ${slot.hour} selected.`, "success");
    } else if (slot.status === "Blocked") {
      addToast("This slot is blocked by Planner.", "error");
    } else {
      addToast(`Slot ${slot.status.toLowerCase()} — select an available slot.`, "error");
    }
  };

  const handleViewGate = () => {
    addToast("Gate requirements panel shown below.", "success");
  };

  const eligibilityChecks = [
    { label: "Customs OOC issued", passed: selected?.customsOoc ?? false },
    { label: "Charges cleared", passed: selected?.chargesCleared ?? false },
    { label: "DO issued", passed: selected?.doIssued ?? false },
    { label: "No active hold", passed: !(selected?.activeHold ?? true) },
    { label: "Driver available", passed: true },
    { label: "Vehicle available", passed: true },
    { label: "Slot available", passed: true },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-[16px] border border-[#E2E8F0] bg-white shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-[15px] font-bold text-[#0F172A]">Pickup Eligibility</h2>
          </div>
          {selected && (
            isEligible
              ? <span className="inline-flex items-center gap-1 h-6 px-3 rounded-full text-[11px] font-bold bg-[#DCFCE7] text-[#16A34A]"><CheckCircle size={12} />Eligible</span>
              : <span className="inline-flex items-center gap-1 h-6 px-3 rounded-full text-[11px] font-bold bg-[#FEE2E2] text-[#DC2626]"><XCircle size={12} />Not Eligible</span>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {eligibilityChecks.map((check) => (
            <div key={check.label} className="flex items-center gap-2 h-9 px-3 rounded-lg" style={{ backgroundColor: check.passed ? "#F8FAFC" : "#FEF2F2" }}>
              {check.passed
                ? <CheckCircle size={14} className="text-[#16A34A] flex-shrink-0" />
                : <XCircle size={14} className="text-[#DC2626] flex-shrink-0" />
              }
              <span className={`text-[12px] font-medium ${check.passed ? "text-[#334155]" : "text-[#DC2626]"}`}>{check.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[16px] border border-[#E2E8F0] bg-white shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-[15px] font-bold text-[#0F172A]">Schedule Pickup</h2>
          </div>
        </div>

        <div className="relative mb-4">
          <div className="relative max-w-[420px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="text"
              value={searchAWB}
              onChange={(e) => { setSearchAWB(e.target.value); setShowDropdown(true); }}
              onFocus={() => setShowDropdown(true)}
              placeholder="Search AWB #"
              className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors"
            />
            {showDropdown && filteredShipments.length > 0 && (
              <div className="absolute top-10 left-0 z-20 w-full bg-white border border-[#E2E8F0] rounded-xl shadow-lg max-h-[240px] overflow-y-auto">
                {filteredShipments.map((s) => (
                  <button
                    key={s.awb}
                    onClick={() => handleSelectAWB(s.awb)}
                    className="w-full text-left px-4 py-3 hover:bg-[#F8FAFC] cursor-pointer transition-colors border-b border-[#F1F5F9] last:border-0"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] font-bold font-mono text-[#0F172A]">{s.awb}</span>
                      <span className="text-[12px] text-[#64748B]">{s.consignee}</span>
                    </div>
                    <div className="text-[11px] text-[#94A3B8] mt-0.5">{s.carrier} | {s.flight} | {s.arrival}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {selected && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 pt-4 border-t border-[#E2E8F0]">
            <div>
              <label className="text-[10px] font-semibold text-[#94A3B8] uppercase">AWB #</label>
              <p className="text-[13px] font-bold font-mono text-[#0F172A]">{selected.awb}</p>
            </div>
            <div>
              <label className="text-[10px] font-semibold text-[#94A3B8] uppercase">DO #</label>
              <p className="text-[13px] font-mono font-semibold text-[#1B4F8B]">{selected.doNumber}</p>
            </div>
            <div>
              <label className="text-[10px] font-semibold text-[#94A3B8] uppercase">Carrier</label>
              <p className="text-[13px] text-[#334155]">{selected.carrier}</p>
            </div>
            <div>
              <label className="text-[10px] font-semibold text-[#94A3B8] uppercase">Flight</label>
              <p className="text-[13px] font-mono text-[#1B4F8B]">{selected.flight}</p>
            </div>
            <div>
              <label className="text-[10px] font-semibold text-[#94A3B8] uppercase">Arrival</label>
              <p className="text-[13px] text-[#334155]">{selected.arrival}</p>
            </div>
            <div>
              <label className="text-[10px] font-semibold text-[#94A3B8] uppercase">Pieces / Weight</label>
              <p className="text-[13px] font-semibold text-[#0F172A]">{selected.pieces} / {selected.weight}</p>
            </div>
            <div>
              <label className="text-[10px] font-semibold text-[#94A3B8] uppercase">Cargo Class</label>
              <p className="text-[13px] font-mono font-semibold text-[#64748B]">{selected.cargoClass}</p>
            </div>
            <div>
              <label className="text-[10px] font-semibold text-[#94A3B8] uppercase">Consignee</label>
              <p className="text-[13px] text-[#334155]">{selected.consignee}</p>
            </div>
          </div>
        )}

        {selected && isEligible && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4 border-t border-[#E2E8F0]">
            <div className="space-y-4">
              <div>
                <label className="text-[12px] font-semibold text-[#64748B] mb-2 block">Driver</label>
                <div className="flex items-center gap-2 mb-3">
                  <button
                    onClick={() => setDriverMode("saved")}
                    className={`h-8 px-4 rounded-full text-[12px] font-semibold cursor-pointer transition-colors whitespace-nowrap ${driverMode === "saved" ? "bg-[#0B2545] text-white" : "bg-[#F1F5F9] text-[#64748B]"}`}
                  >
                    Saved Driver
                  </button>
                  <button
                    onClick={() => setDriverMode("one-time")}
                    className={`h-8 px-4 rounded-full text-[12px] font-semibold cursor-pointer transition-colors whitespace-nowrap ${driverMode === "one-time" ? "bg-[#0B2545] text-white" : "bg-[#F1F5F9] text-[#64748B]"}`}
                  >
                    One-Time Entry
                  </button>
                </div>

                {driverMode === "saved" ? (
                  <div className="relative">
                    <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                    <select
                      value={selectedDriver}
                      onChange={(e) => setSelectedDriver(e.target.value)}
                      className="w-full h-10 pl-9 pr-8 rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors appearance-none bg-white"
                    >
                      <option value="">Select driver</option>
                      {savedDrivers.map((d) => (
                        <option key={d.id} value={d.id}>{d.name} — {d.cnic}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-semibold text-[#94A3B8] mb-1 block">Driver Name</label>
                        <input
                          type="text"
                          value={oneTimeDriver.name}
                          onChange={(e) => setOneTimeDriver({ ...oneTimeDriver, name: e.target.value })}
                          className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] bg-white"
                          placeholder="Full name"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-[#94A3B8] mb-1 block">Driver CNIC</label>
                        <input
                          type="text"
                          value={oneTimeDriver.cnic}
                          onChange={(e) => setOneTimeDriver({ ...oneTimeDriver, cnic: e.target.value })}
                          className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] bg-white"
                          placeholder="e.g. 42101-1234567-1"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-[#94A3B8] mb-1 block">Driver Mobile</label>
                        <input
                          type="text"
                          value={oneTimeDriver.mobile}
                          onChange={(e) => setOneTimeDriver({ ...oneTimeDriver, mobile: e.target.value })}
                          className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] bg-white"
                          placeholder="e.g. 0300-1234567"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-[#94A3B8] mb-1 block">License #</label>
                        <input
                          type="text"
                          value={oneTimeDriver.licenseNo}
                          onChange={(e) => setOneTimeDriver({ ...oneTimeDriver, licenseNo: e.target.value })}
                          className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] bg-white"
                          placeholder="License number"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-[#94A3B8] mb-1 block">License Expiry</label>
                      <input
                        type="date"
                        value={oneTimeDriver.licenseExpiry}
                        onChange={(e) => setOneTimeDriver({ ...oneTimeDriver, licenseExpiry: e.target.value })}
                        className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] bg-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="text-[12px] font-semibold text-[#64748B] mb-2 block">Vehicle</label>
                <div className="relative mb-3">
                  <Truck size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                  <select
                    value={selectedVehicle}
                    onChange={(e) => setSelectedVehicle(e.target.value)}
                    className="w-full h-10 pl-9 pr-8 rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors appearance-none bg-white"
                  >
                    <option value="">Select vehicle</option>
                    {savedVehicles.map((v) => (
                      <option key={v.id} value={v.id}>{v.number} — {v.type}, {v.capacity}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-semibold text-[#94A3B8] mb-1 block">Vehicle Number</label>
                    <input
                      type="text"
                      value={oneTimeVehicle.number}
                      onChange={(e) => setOneTimeVehicle({ ...oneTimeVehicle, number: e.target.value })}
                      className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] bg-white"
                      placeholder="e.g. KHI-4582"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-[#94A3B8] mb-1 block">Vehicle Type</label>
                    <select
                      value={oneTimeVehicle.type}
                      onChange={(e) => setOneTimeVehicle({ ...oneTimeVehicle, type: e.target.value })}
                      className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] bg-white pr-8"
                    >
                      {vehicleTypeOptions.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-[#94A3B8] mb-1 block">Capacity</label>
                    <input
                      type="text"
                      value={oneTimeVehicle.capacity}
                      onChange={(e) => setOneTimeVehicle({ ...oneTimeVehicle, capacity: e.target.value })}
                      className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] bg-white"
                      placeholder="e.g. 3.5 Ton"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-[#94A3B8] mb-1 block">Owner</label>
                    <input
                      type="text"
                      value={oneTimeVehicle.owner}
                      onChange={(e) => setOneTimeVehicle({ ...oneTimeVehicle, owner: e.target.value })}
                      className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] bg-white"
                      placeholder="Owner name"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[12px] font-semibold text-[#64748B] mb-2 block">Pickup Date</label>
                  <div className="relative">
                    <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                    <input
                      type="date"
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors bg-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[12px] font-semibold text-[#64748B] mb-2 block">Pickup Slot</label>
                  <div className="relative">
                    <Clock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                    <input
                      type="text"
                      value={selectedSlot}
                      readOnly
                      placeholder="Select from grid below"
                      className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none bg-[#F8FAFC] cursor-default"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[12px] font-semibold text-[#64748B] mb-2 block">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full h-24 px-3 py-2 rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors resize-none"
                  placeholder="Special instructions, loading requirements, etc."
                  maxLength={500}
                />
                <p className="text-[11px] text-[#94A3B8] mt-1 text-right">{notes.length}/500</p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleSchedule}
                  className="flex items-center gap-2 h-10 px-5 rounded-xl text-[13px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90 whitespace-nowrap"
                  style={{ backgroundColor: "#0B2545" }}
                >
                  <Save size={16} /> Schedule Pickup
                </button>
                <button
                  onClick={handleSaveDraft}
                  className="flex items-center gap-2 h-10 px-4 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer transition-colors whitespace-nowrap"
                >
                  <FileText size={16} /> Save Draft
                </button>
                <button
                  onClick={handleViewGate}
                  className="flex items-center gap-2 h-10 px-4 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer transition-colors whitespace-nowrap"
                >
                  <Shield size={16} /> Gate Requirements
                </button>
              </div>
            </div>
          </div>
        )}

        {!selected && (
          <div className="py-16 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-[#F1F5F9] flex items-center justify-center">
                <Search size={28} className="text-[#94A3B8]" />
              </div>
              <p className="text-[14px] font-semibold text-[#64748B]">No eligible shipment available for pickup.</p>
              <p className="text-[12px] text-[#94A3B8]">Search for an AWB above to check eligibility and schedule a pickup.</p>
            </div>
          </div>
        )}

        {selected && !isEligible && (
          <div className="py-12 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-[#FEF3C7] flex items-center justify-center">
                <AlertTriangle size={28} className="text-[#D97706]" />
              </div>
              <p className="text-[14px] font-semibold text-[#D97706]">This shipment is not eligible for pickup.</p>
              <p className="text-[12px] text-[#94A3B8]">Ensure all eligibility requirements are met before scheduling.</p>
            </div>
          </div>
        )}
      </div>

      <div className="rounded-[16px] border border-[#E2E8F0] bg-white shadow-sm p-5">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <h2 className="text-[15px] font-bold text-[#0F172A]">Available Pickup Slots</h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[12px] text-[#64748B]">01 Jun 2026</span>
            <div className="flex items-center gap-2">
              {Object.entries(slotStatusConfig).map(([key, cfg]) => (
                <div key={key} className="flex items-center gap-1">
                  <span className="inline-flex items-center gap-1 h-4 px-1.5 rounded text-[10px] font-semibold" style={{ backgroundColor: cfg.bg, color: cfg.text }}>
                    {cfg.icon}
                  </span>
                  <span className="text-[11px] text-[#64748B]">{cfg.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[1100px]">
            <div className="grid" style={{ gridTemplateColumns: `140px repeat(${hours.length}, 1fr)` }}>
              <div className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider border-b border-r border-[#E2E8F0]">Bay</div>
              {hours.map((h) => (
                <div key={h} className="py-2 px-1 text-[11px] font-semibold text-[#64748B] text-center border-b border-r border-[#E2E8F0]">{h}</div>
              ))}

              {bays.map((bay) => (
                <div key={bay} className="contents">
                  <div className="py-2 px-3 text-[12px] font-semibold text-[#0F172A] border-b border-[#F1F5F9] border-r border-[#E2E8F0] flex items-center">{bay}</div>
                  {hours.map((h) => {
                    const slot = getSlot(bay, h);
                    const sc = slot ? slotStatusConfig[slot.status] : slotStatusConfig.Available;
                    const isSelected = selectedSlot === `${bay} — ${h}`;
                    return (
                      <button
                        key={`${bay}-${h}`}
                        onClick={() => slot && handleSlotClick(slot)}
                        className="py-2 px-1 border-b border-[#F1F5F9] border-r border-[#E2E8F0] cursor-pointer transition-all hover:opacity-80 flex items-center justify-center"
                        style={{
                          backgroundColor: isSelected ? "#0B2545" : (slot ? sc.bg : "#F8FAFC"),
                          outline: isSelected ? "2px solid #0B2545" : "none",
                        }}
                        title={slot ? `${slot.status} — ${slot.awb ? `AWB ${slot.awb}` : ""}` : "Available"}
                      >
                        <span style={{ color: isSelected ? "white" : sc.text }}>
                          {isSelected ? <Check size={12} /> : (slot ? sc.icon : <X size={10} className="text-[#E2E8F0]" />)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[16px] border border-[#E2E8F0] bg-white shadow-sm p-5">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <h2 className="text-[15px] font-bold text-[#0F172A]">Scheduled Pickups</h2>
          </div>
          <span className="text-[12px] text-[#64748B]">{pickups.length} pickups</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left">
            <thead>
              <tr className="border-b border-[#E2E8F0]">
                <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Pickup ID</th>
                <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">AWB #</th>
                <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">DO #</th>
                <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Driver</th>
                <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Vehicle</th>
                <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Pickup Date</th>
                <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Slot</th>
                <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Status</th>
                <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody>
              {pickups.map((p) => {
                const sc = statusConfig[p.status];
                return (
                  <tr key={p.id} className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3 px-3 text-[12px] font-semibold text-[#0F172A] font-mono">{p.id}</td>
                    <td className="py-3 px-3 text-[12px] font-mono text-[#1B4F8B]">{p.awb}</td>
                    <td className="py-3 px-3 text-[12px] font-mono text-[#64748B]">{p.doNumber}</td>
                    <td className="py-3 px-3 text-[12px] text-[#0F172A]">{p.driver}</td>
                    <td className="py-3 px-3 text-[12px] font-mono text-[#64748B]">{p.vehicle}</td>
                    <td className="py-3 px-3 text-[12px] text-[#64748B]">{p.pickupDate}</td>
                    <td className="py-3 px-3 text-[12px] text-[#64748B]">{p.slot}</td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 h-5 px-2 rounded-full text-[11px] font-semibold" style={{ backgroundColor: sc.bg, color: sc.text }}>
                        {sc.icon}
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDownloadConfirmation(p.id)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors"
                          title="Download Booking Confirmation"
                        >
                          <FileDown size={14} />
                        </button>
                        <button
                          onClick={() => handleViewGate()}
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors"
                          title="View Gate Requirements"
                        >
                          <Shield size={14} />
                        </button>
                        <button
                          onClick={() => handleCancelPickup(p.id)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#FEE2E2] text-[#DC2626] cursor-pointer transition-colors"
                          title="Cancel Pickup"
                        >
                          <Ban size={14} />
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

      <div className="rounded-[16px] border border-[#E2E8F0] bg-white shadow-sm p-5">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <h2 className="text-[15px] font-bold text-[#0F172A]">Gate Requirements</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[12px] text-[#64748B]">{gateRequirements.filter((g) => g.checked).length}/{gateRequirements.length} ready</span>
            <span className="inline-flex items-center gap-1 h-5 px-2 rounded-full text-[11px] font-semibold bg-[#FEF3C7] text-[#D97706]">
              <Clock size={12} /> Pending
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {gateRequirements.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 h-10 px-3 rounded-xl border transition-colors"
              style={{
                backgroundColor: item.checked ? "#F8FAFC" : "white",
                borderColor: item.checked ? "#16A34A" : "#E2E8F0",
              }}
            >
              <div
                className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor: item.checked ? "#16A34A" : "#F1F5F9",
                  color: item.checked ? "white" : "#94A3B8",
                }}
              >
                {item.checked ? <Check size={12} /> : item.icon}
              </div>
              <span className={`text-[13px] font-medium ${item.checked ? "text-[#16A34A]" : "text-[#0F172A]"}`}>
                {item.label}
              </span>
              {item.checked && <span className="ml-auto text-[11px] font-semibold text-[#16A34A]">Ready</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}