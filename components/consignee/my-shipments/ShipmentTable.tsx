"use client";

import { useState } from "react";
import { useToast } from "@/components/ToastContext";
import ScopeBadge from "@/components/ScopeBadge";
import {
  Eye,
  Bell,
  CreditCard,
  Download,
  Truck,
  FileText,
  X,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Package,
  ChevronRight,
  MapPin,
  Calendar,
  Plane,
} from "lucide-react";

interface Shipment {
  id: string;
  awb: string;
  hawb: string;
  carrier: string;
  flight: string;
  arrival: string;
  flightDate: string;
  origin: string;
  originFull: string;
  dest: string;
  destFull: string;
  pieces: number;
  weight: string;
  chargeableWeight: string;
  cargoClass: string;
  status: "Arrived" | "Customs" | "OOC" | "Charges Due" | "DO Ready" | "Picked" | "Delivered";
  customsChannel: "Green" | "Yellow" | "Red" | null;
  oocStatus: string;
  chargesStatus: "Paid" | "Unpaid" | "Partially Paid" | "Waived" | "On Credit";
  doStatus: string;
  pickupStatus: string;
  consignee: string;
}

const shipments: Shipment[] = [
  {
    id: "SHP-001", awb: "157-90811223", hawb: "HAWB-001234", carrier: "Qatar Airways Cargo", flight: "QR-604",
    arrival: "31 May 2026, 11:25", flightDate: "30 May 2026", origin: "DOH", originFull: "Hamad Intl, Doha",
    dest: "KHI", destFull: "Jinnah Intl, Karachi", pieces: 8, weight: "420 kg", chargeableWeight: "450 kg",
    cargoClass: "PER", status: "Charges Due", customsChannel: "Green", oocStatus: "Clear",
    chargesStatus: "Unpaid", doStatus: "Pending", pickupStatus: "Not Scheduled", consignee: "Karachi Pharma Imports"
  },
  {
    id: "SHP-002", awb: "214-45678901", hawb: "HAWB-005678", carrier: "Emirates SkyCargo", flight: "EK-604",
    arrival: "31 May 2026, 09:15", flightDate: "30 May 2026", origin: "DXB", originFull: "Dubai Intl, UAE",
    dest: "KHI", destFull: "Jinnah Intl, Karachi", pieces: 24, weight: "1,240 kg", chargeableWeight: "1,380 kg",
    cargoClass: "AFU", status: "Customs", customsChannel: "Yellow", oocStatus: "Clear",
    chargesStatus: "Paid", doStatus: "Pending", pickupStatus: "Not Scheduled", consignee: "Al Noor Traders"
  },
  {
    id: "SHP-003", awb: "074-88219033", hawb: "HAWB-009012", carrier: "Turkish Cargo", flight: "TK-708",
    arrival: "31 May 2026, 13:40", flightDate: "30 May 2026", origin: "IST", originFull: "Istanbul Airport, Turkey",
    dest: "KHI", destFull: "Jinnah Intl, Karachi", pieces: 16, weight: "680 kg", chargeableWeight: "720 kg",
    cargoClass: "GCR", status: "DO Ready", customsChannel: "Green", oocStatus: "Clear",
    chargesStatus: "Paid", doStatus: "Issued", pickupStatus: "Scheduled", consignee: "Metro Engineering"
  },
  {
    id: "SHP-004", awb: "117-55667788", hawb: "HAWB-003456", carrier: "Etihad Cargo", flight: "EY-241",
    arrival: "30 May 2026, 16:20", flightDate: "29 May 2026", origin: "AUH", originFull: "Abu Dhabi Intl, UAE",
    dest: "KHI", destFull: "Jinnah Intl, Karachi", pieces: 42, weight: "2,110 kg", chargeableWeight: "2,310 kg",
    cargoClass: "GCR", status: "Arrived", customsChannel: null, oocStatus: "Pending",
    chargesStatus: "Unpaid", doStatus: "Pending", pickupStatus: "Not Scheduled", consignee: "Karachi Pharma Imports"
  },
  {
    id: "SHP-005", awb: "214-99887766", hawb: "HAWB-007890", carrier: "Saudia Cargo", flight: "SV-732",
    arrival: "29 May 2026, 08:50", flightDate: "28 May 2026", origin: "JED", originFull: "King Abdulaziz Intl, Jeddah",
    dest: "KHI", destFull: "Jinnah Intl, Karachi", pieces: 12, weight: "540 kg", chargeableWeight: "580 kg",
    cargoClass: "PER", status: "Picked", customsChannel: "Green", oocStatus: "Clear",
    chargesStatus: "Paid", doStatus: "Collected", pickupStatus: "Completed", consignee: "Al Noor Traders"
  },
  {
    id: "SHP-006", awb: "157-33445566", hawb: "HAWB-002345", carrier: "Emirates SkyCargo", flight: "EK-606",
    arrival: "28 May 2026, 10:15", flightDate: "27 May 2026", origin: "DXB", originFull: "Dubai Intl, UAE",
    dest: "KHI", destFull: "Jinnah Intl, Karachi", pieces: 20, weight: "980 kg", chargeableWeight: "1,050 kg",
    cargoClass: "VAL", status: "Delivered", customsChannel: "Green", oocStatus: "Clear",
    chargesStatus: "Paid", doStatus: "Collected", pickupStatus: "Completed", consignee: "Metro Engineering"
  },
  {
    id: "SHP-007", awb: "074-11229944", hawb: "HAWB-004567", carrier: "Qatar Airways Cargo", flight: "QR-606",
    arrival: "27 May 2026, 14:30", flightDate: "26 May 2026", origin: "DOH", originFull: "Hamad Intl, Doha",
    dest: "KHI", destFull: "Jinnah Intl, Karachi", pieces: 6, weight: "280 kg", chargeableWeight: "300 kg",
    cargoClass: "AFU", status: "OOC", customsChannel: "Red", oocStatus: "Under Investigation",
    chargesStatus: "Partially Paid", doStatus: "On Hold", pickupStatus: "Not Scheduled", consignee: "Karachi Pharma Imports"
  },
];

const statusConfig: Record<string, { bg: string; text: string }> = {
  Arrived: { bg: "#DBEAFE", text: "#1D4ED8" },
  Customs: { bg: "#FEF3C7", text: "#D97706" },
  OOC: { bg: "#FEE2E2", text: "#DC2626" },
  "Charges Due": { bg: "#EDE9FE", text: "#7C3AED" },
  "DO Ready": { bg: "#DCFCE7", text: "#16A34A" },
  Picked: { bg: "#CFFAFE", text: "#0EA5E9" },
  Delivered: { bg: "#D1FAE5", text: "#059669" },
};

const chargesConfig: Record<string, { bg: string; text: string }> = {
  Paid: { bg: "#DCFCE7", text: "#16A34A" },
  Unpaid: { bg: "#FEE2E2", text: "#DC2626" },
  "Partially Paid": { bg: "#FEF3C7", text: "#D97706" },
  Waived: { bg: "#F1F5F9", text: "#64748B" },
  "On Credit": { bg: "#DBEAFE", text: "#1D4ED8" },
};

const channelConfig: Record<string, { bg: string; text: string }> = {
  Green: { bg: "#DCFCE7", text: "#16A34A" },
  Yellow: { bg: "#FEF3C7", text: "#D97706" },
  Red: { bg: "#FEE2E2", text: "#DC2626" },
};

const timelineStages = [
  { key: "Arrived", label: "Arrived", icon: <Plane size={14} /> },
  { key: "Customs", label: "Customs", icon: <Clock size={14} /> },
  { key: "OOC", label: "OOC", icon: <AlertTriangle size={14} /> },
  { key: "Charges Due", label: "Charges Due", icon: <CreditCard size={14} /> },
  { key: "DO Ready", label: "DO Ready", icon: <FileText size={14} /> },
  { key: "Picked", label: "Picked", icon: <Truck size={14} /> },
  { key: "Delivered", label: "Delivered", icon: <CheckCircle size={14} /> },
];

const stageOrder = ["Arrived", "Customs", "OOC", "Charges Due", "DO Ready", "Picked", "Delivered"];

function getTimelineStageIndex(status: string): number {
  return stageOrder.indexOf(status);
}

export default function ShipmentTable() {
  const { addToast } = useToast();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const active = shipments.find((s) => s.id === selectedId);
  const currentStageIndex = active ? getTimelineStageIndex(active.status) : -1;

  const handleRetry = () => {
    setLoading(true);
    setError(false);
    setTimeout(() => {
      setLoading(false);
      addToast("Shipment data loaded.", "success");
    }, 1500);
  };

  const handleViewDetail = (s: Shipment) => {
    setSelectedId(s.id);
  };

  const handleViewNotice = (s: Shipment) => {
    addToast(`Notice of Arrival for ${s.awb} opened.`, "success");
  };

  const handlePayCharges = (s: Shipment) => {
    addToast(`Payment gateway opened for ${s.awb}.`, "success");
  };

  const handleDownloadDO = (s: Shipment) => {
    addToast(`DO downloaded for ${s.awb}.`, "success");
  };

  const handleSchedulePickup = (s: Shipment) => {
    addToast(`Pickup scheduling opened for ${s.awb}.`, "success");
  };

  const handleViewPOD = (s: Shipment) => {
    addToast(`POD downloaded for ${s.awb}.`, "success");
  };

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2">
          <h2 className="text-[15px] font-bold text-[#0F172A]">Shipment List</h2>
          <ScopeBadge type="exc" />
        </div>
        <span className="text-[12px] text-[#64748B]">{shipments.length} shipments</span>
      </div>

      <div className="p-5">
        {error && (
          <div className="flex items-center gap-3 mb-4 p-4 rounded-xl bg-[#FEE2E2] border border-[#FCA5A5]">
            <AlertTriangle size={16} className="text-[#DC2626]" />
            <span className="text-[13px] font-semibold text-[#DC2626]">Failed to load shipment data. Please try again.</span>
            <button onClick={handleRetry} className="flex items-center gap-2 h-8 px-3 rounded-lg text-[12px] font-semibold bg-[#DC2626] text-white hover:opacity-90 cursor-pointer">
              <RefreshCw size={14} /> Retry
            </button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left">
            <thead>
              <tr className="border-b border-[#E2E8F0]">
                <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">AWB #</th>
                <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Carrier</th>
                <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Flight</th>
                <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Arrival</th>
                <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Origin</th>
                <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Pieces</th>
                <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Weight</th>
                <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Cargo Class</th>
                <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Status</th>
                <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Charges</th>
                <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-[#F1F5F9]">
                    {Array.from({ length: 11 }).map((_, j) => (
                      <td key={j} className="py-3 px-3">
                        <div className="h-4 bg-[#F1F5F9] rounded animate-pulse" style={{ width: j === 0 ? "90px" : j === 1 ? "100px" : j === 3 ? "110px" : j === 4 ? "40px" : j === 7 ? "50px" : "70px" }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : shipments.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[#F1F5F9] flex items-center justify-center">
                        <Package size={24} className="text-[#94A3B8]" />
                      </div>
                      <p className="text-[13px] font-semibold text-[#64748B]">No shipments found for selected filters.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                shipments.map((s) => {
                  const sc = statusConfig[s.status];
                  const cc = chargesConfig[s.chargesStatus];
                  return (
                    <tr
                      key={s.id}
                      className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                      onClick={() => setSelectedId(selectedId === s.id ? null : s.id)}
                    >
                      <td className="py-3 px-3 text-[12px] font-semibold text-[#0F172A] font-mono">{s.awb}</td>
                      <td className="py-3 px-3 text-[12px] text-[#334155]">{s.carrier}</td>
                      <td className="py-3 px-3 text-[12px] font-mono text-[#1B4F8B]">{s.flight}</td>
                      <td className="py-3 px-3 text-[12px] text-[#64748B]">{s.arrival}</td>
                      <td className="py-3 px-3 text-[12px] font-medium text-[#0F172A]">{s.origin}</td>
                      <td className="py-3 px-3 text-[12px] font-bold text-[#0F172A]">{s.pieces}</td>
                      <td className="py-3 px-3 text-[12px] text-[#334155]">{s.weight}</td>
                      <td className="py-3 px-3 text-[12px] font-mono font-semibold text-[#64748B]">{s.cargoClass}</td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center h-[22px] px-2 rounded-full text-[11px] font-bold" style={{ backgroundColor: sc.bg, color: sc.text }}>
                          {s.status}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center h-[22px] px-2 rounded-full text-[11px] font-bold" style={{ backgroundColor: cc.bg, color: cc.text }}>
                          {s.chargesStatus}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1">
                          <button onClick={(e) => { e.stopPropagation(); handleViewDetail(s); }} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F1F5F9] text-[#64748B] cursor-pointer transition-colors" title="View Details">
                            <Eye size={14} />
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); handlePayCharges(s); }} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F1F5F9] text-[#64748B] cursor-pointer transition-colors" title="Pay Charges">
                            <CreditCard size={14} />
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); handleDownloadDO(s); }} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F1F5F9] text-[#64748B] cursor-pointer transition-colors" title="Download DO">
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

        {active && (
          <div className="mt-5 border-t border-[#E2E8F0] pt-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Eye size={16} className="text-[#1B4F8B]" />
                <h3 className="text-[13px] font-bold text-[#0F172A]">Shipment Detail</h3>
                <ScopeBadge type="exc" />
              </div>
              <button onClick={() => setSelectedId(null)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#E2E8F0] text-[#64748B] cursor-pointer transition-colors">
                <X size={14} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-5">
              <div>
                <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">AWB #</label>
                <p className="text-[13px] font-bold font-mono text-[#0F172A]">{active.awb}</p>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">HAWB #</label>
                <p className="text-[13px] font-mono text-[#334155]">{active.hawb}</p>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">Carrier</label>
                <p className="text-[13px] text-[#334155]">{active.carrier}</p>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">Flight #</label>
                <p className="text-[13px] font-mono text-[#1B4F8B]">{active.flight}</p>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">Flight Date</label>
                <p className="text-[13px] text-[#334155]">{active.flightDate}</p>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">Origin</label>
                <p className="text-[13px] text-[#334155]">{active.originFull}</p>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">Destination</label>
                <p className="text-[13px] text-[#334155]">{active.destFull}</p>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">Pieces</label>
                <p className="text-[13px] font-bold text-[#0F172A]">{active.pieces}</p>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">Actual Weight</label>
                <p className="text-[13px] text-[#334155]">{active.weight}</p>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">Charg. Weight</label>
                <p className="text-[13px] text-[#334155]">{active.chargeableWeight}</p>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">Cargo Class</label>
                <p className="text-[13px] font-mono font-semibold text-[#64748B]">{active.cargoClass}</p>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">Status</label>
                <span className="inline-flex items-center h-[22px] px-2 rounded-full text-[11px] font-bold" style={{ backgroundColor: statusConfig[active.status].bg, color: statusConfig[active.status].text }}>
                  {active.status}
                </span>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">Customs Channel</label>
                {active.customsChannel ? (
                  <span className="inline-flex items-center h-[22px] px-2 rounded-full text-[11px] font-bold" style={{ backgroundColor: channelConfig[active.customsChannel].bg, color: channelConfig[active.customsChannel].text }}>
                    {active.customsChannel}
                  </span>
                ) : (
                  <span className="text-[13px] text-[#94A3B8]">—</span>
                )}
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">OOC Status</label>
                <p className="text-[13px] text-[#334155]">{active.oocStatus}</p>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">Charges Status</label>
                <span className="inline-flex items-center h-[22px] px-2 rounded-full text-[11px] font-bold" style={{ backgroundColor: chargesConfig[active.chargesStatus].bg, color: chargesConfig[active.chargesStatus].text }}>
                  {active.chargesStatus}
                </span>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">DO Status</label>
                <p className="text-[13px] text-[#334155]">{active.doStatus}</p>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">Pickup Status</label>
                <p className="text-[13px] text-[#334155]">{active.pickupStatus}</p>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] mb-4">
              <div className="flex items-center gap-2 mb-4">
                <Clock size={14} className="text-[#1B4F8B]" />
                <h4 className="text-[12px] font-bold text-[#0F172A] uppercase tracking-wider">Shipment Timeline</h4>
                <ScopeBadge type="exc" />
              </div>
              <div className="flex items-start gap-0 overflow-x-auto pb-2">
                {timelineStages.map((stage, i) => {
                  const isComplete = i <= currentStageIndex;
                  const isCurrent = i === currentStageIndex;
                  const stageColor = isComplete ? "#0B2545" : "#CBD5E1";
                  const iconBg = isComplete ? "#0B2545" : "#F1F5F9";
                  const iconColor = isComplete ? "white" : "#94A3B8";
                  return (
                    <div key={stage.key} className="flex-1 min-w-[100px] flex flex-col items-center relative">
                      {i > 0 && (
                        <div className="absolute top-[12px] right-1/2 w-full h-[2px]" style={{ backgroundColor: isComplete ? "#0B2545" : "#E2E8F0" }} />
                      )}
                      <div className="w-6 h-6 rounded-full flex items-center justify-center relative z-10" style={{ backgroundColor: iconBg, color: iconColor }}>
                        {isComplete ? <CheckCircle size={14} /> : stage.icon}
                      </div>
                      <span className="text-[10px] font-semibold mt-1 text-center leading-tight" style={{ color: isCurrent ? "#0B2545" : isComplete ? "#334155" : "#94A3B8" }}>
                        {stage.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-[#E2E8F0]">
              <button onClick={() => handleViewDetail(active)} className="flex items-center gap-2 h-9 px-4 rounded-xl text-[13px] font-semibold text-white cursor-pointer hover:opacity-90 transition-colors" style={{ backgroundColor: "#0B2545" }}>
                <Eye size={14} /> View Details
              </button>
              <button onClick={() => handleViewNotice(active)} className="flex items-center gap-2 h-9 px-4 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer transition-colors">
                <Bell size={14} /> View Notice of Arrival
              </button>
              <button onClick={() => handlePayCharges(active)} className="flex items-center gap-2 h-9 px-4 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer transition-colors">
                <CreditCard size={14} /> Pay Charges
              </button>
              <button onClick={() => handleDownloadDO(active)} className="flex items-center gap-2 h-9 px-4 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer transition-colors">
                <Download size={14} /> Download DO
              </button>
              <button onClick={() => handleSchedulePickup(active)} className="flex items-center gap-2 h-9 px-4 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer transition-colors">
                <Truck size={14} /> Schedule Pickup
              </button>
              <button onClick={() => handleViewPOD(active)} className="flex items-center gap-2 h-9 px-4 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer transition-colors">
                <FileText size={14} /> View POD
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}