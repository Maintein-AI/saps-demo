"use client";

import { useState } from "react";
import { useToast } from "@/components/ToastContext";
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
  Mail,
  MailOpen,
  Calendar,
  Plane,
  Package,
  MapPin,
  ChevronRight,
  User,
} from "lucide-react";

interface NOA {
  id: string;
  noticeId: string;
  awb: string;
  hawb: string;
  carrier: string;
  flight: string;
  origin: string;
  originFull: string;
  destination: string;
  destinationFull: string;
  arrivalDate: string;
  arrivalTime: string;
  pieces: number;
  weight: string;
  cargoClass: string;
  freePeriodStart: string;
  freePeriodExpiry: string;
  customsChannel: string | null;
  customsStatus: string;
  chargesStatus: "Paid" | "Unpaid" | "Partially Paid" | "Waived" | "On Credit";
  noticeStatus: "Unread" | "Read" | "Action Required" | "Resolved";
  documentsRequired: string[];
  contactNote: string;
  consignee: string;
}

const notices: NOA[] = [
  {
    id: "NOA-001", noticeId: "NOA-2026-00142", awb: "157-90811223", hawb: "HAWB-001234",
    carrier: "Qatar Airways Cargo", flight: "QR-604", origin: "DOH", originFull: "Hamad Intl, Doha",
    destination: "KHI", destinationFull: "Jinnah Intl, Karachi",
    arrivalDate: "31 May 2026", arrivalTime: "11:25", pieces: 8, weight: "420 kg", cargoClass: "PER",
    freePeriodStart: "31 May 2026", freePeriodExpiry: "05 Jun 2026", customsChannel: "Green",
    customsStatus: "Cleared", chargesStatus: "Unpaid", noticeStatus: "Unread",
    documentsRequired: ["Packing List", "Commercial Invoice", "Certificate of Origin"],
    contactNote: "Please settle charges before collecting DO. Contact CHA desk at +92-21-3456-7890.",
    consignee: "Karachi Pharma Imports"
  },
  {
    id: "NOA-002", noticeId: "NOA-2026-00141", awb: "214-45678901", hawb: "HAWB-005678",
    carrier: "Emirates SkyCargo", flight: "EK-604", origin: "DXB", originFull: "Dubai Intl, UAE",
    destination: "KHI", destinationFull: "Jinnah Intl, Karachi",
    arrivalDate: "31 May 2026", arrivalTime: "09:15", pieces: 24, weight: "1,240 kg", cargoClass: "AFU",
    freePeriodStart: "31 May 2026", freePeriodExpiry: "04 Jun 2026", customsChannel: "Yellow",
    customsStatus: "Under Review", chargesStatus: "Paid", noticeStatus: "Action Required",
    documentsRequired: ["Packing List", "Commercial Invoice", "MSDS", "Certificate of Analysis"],
    contactNote: "Customs has flagged this shipment for Yellow channel. Provide MSDS urgently.",
    consignee: "Al Noor Traders"
  },
  {
    id: "NOA-003", noticeId: "NOA-2026-00140", awb: "074-88219033", hawb: "HAWB-009012",
    carrier: "Turkish Cargo", flight: "TK-708", origin: "IST", originFull: "Istanbul Airport, Turkey",
    destination: "KHI", destinationFull: "Jinnah Intl, Karachi",
    arrivalDate: "31 May 2026", arrivalTime: "13:40", pieces: 16, weight: "680 kg", cargoClass: "GCR",
    freePeriodStart: "31 May 2026", freePeriodExpiry: "07 Jun 2026", customsChannel: "Green",
    customsStatus: "Cleared", chargesStatus: "Paid", noticeStatus: "Read",
    documentsRequired: ["Packing List", "Commercial Invoice"],
    contactNote: "All charges cleared. DO is ready for collection.",
    consignee: "Metro Engineering"
  },
  {
    id: "NOA-004", noticeId: "NOA-2026-00139", awb: "117-55667788", hawb: "HAWB-003456",
    carrier: "Etihad Cargo", flight: "EY-241", origin: "AUH", originFull: "Abu Dhabi Intl, UAE",
    destination: "KHI", destinationFull: "Jinnah Intl, Karachi",
    arrivalDate: "30 May 2026", arrivalTime: "16:20", pieces: 42, weight: "2,110 kg", cargoClass: "GCR",
    freePeriodStart: "30 May 2026", freePeriodExpiry: "03 Jun 2026", customsChannel: null,
    customsStatus: "Pending", chargesStatus: "Unpaid", noticeStatus: "Unread",
    documentsRequired: ["Packing List", "Commercial Invoice", "Certificate of Origin", "Health Certificate"],
    contactNote: "Shipment arrived without IGM filing. Customs clearance is on hold until IGM is filed.",
    consignee: "Karachi Pharma Imports"
  },
  {
    id: "NOA-005", noticeId: "NOA-2026-00138", awb: "214-99887766", hawb: "HAWB-007890",
    carrier: "Saudia Cargo", flight: "SV-732", origin: "JED", originFull: "King Abdulaziz Intl, Jeddah",
    destination: "KHI", destinationFull: "Jinnah Intl, Karachi",
    arrivalDate: "29 May 2026", arrivalTime: "08:50", pieces: 12, weight: "540 kg", cargoClass: "PER",
    freePeriodStart: "29 May 2026", freePeriodExpiry: "02 Jun 2026", customsChannel: "Green",
    customsStatus: "Cleared", chargesStatus: "Paid", noticeStatus: "Resolved",
    documentsRequired: ["Packing List", "Commercial Invoice"],
    contactNote: "DO has been collected. Pickup completed on 01 Jun 2026.",
    consignee: "Al Noor Traders"
  },
  {
    id: "NOA-006", noticeId: "NOA-2026-00137", awb: "157-33445566", hawb: "HAWB-002345",
    carrier: "Emirates SkyCargo", flight: "EK-606", origin: "DXB", originFull: "Dubai Intl, UAE",
    destination: "KHI", destinationFull: "Jinnah Intl, Karachi",
    arrivalDate: "28 May 2026", arrivalTime: "10:15", pieces: 20, weight: "980 kg", cargoClass: "VAL",
    freePeriodStart: "28 May 2026", freePeriodExpiry: "01 Jun 2026", customsChannel: "Green",
    customsStatus: "Cleared", chargesStatus: "Paid", noticeStatus: "Read",
    documentsRequired: ["Packing List", "Commercial Invoice", "Insurance Certificate", "CITES Permit"],
    contactNote: "Valuable cargo. Coordinate with security team for pickup escort.",
    consignee: "Metro Engineering"
  },
  {
    id: "NOA-007", noticeId: "NOA-2026-00136", awb: "074-11229944", hawb: "HAWB-004567",
    carrier: "Qatar Airways Cargo", flight: "QR-606", origin: "DOH", originFull: "Hamad Intl, Doha",
    destination: "KHI", destinationFull: "Jinnah Intl, Karachi",
    arrivalDate: "27 May 2026", arrivalTime: "14:30", pieces: 6, weight: "280 kg", cargoClass: "AFU",
    freePeriodStart: "27 May 2026", freePeriodExpiry: "01 Jun 2026", customsChannel: "Red",
    customsStatus: "Detained", chargesStatus: "Partially Paid", noticeStatus: "Action Required",
    documentsRequired: ["Packing List", "Commercial Invoice", "MSDS", "NOC from MoD", "End-Use Certificate"],
    contactNote: "Red channel detention. Customs has requested physical examination. Contact Excise dept immediately.",
    consignee: "Karachi Pharma Imports"
  },
  {
    id: "NOA-008", noticeId: "NOA-2026-00135", awb: "214-11228844", hawb: "HAWB-008901",
    carrier: "Turkish Cargo", flight: "TK-710", origin: "IST", originFull: "Istanbul Airport, Turkey",
    destination: "KHI", destinationFull: "Jinnah Intl, Karachi",
    arrivalDate: "26 May 2026", arrivalTime: "09:40", pieces: 10, weight: "460 kg", cargoClass: "PER",
    freePeriodStart: "26 May 2026", freePeriodExpiry: "31 May 2026", customsChannel: "Yellow",
    customsStatus: "Documents Requested", chargesStatus: "Unpaid", noticeStatus: "Unread",
    documentsRequired: ["Packing List", "Commercial Invoice", "Certificate of Origin", "FDA Certificate"],
    contactNote: "Yellow channel — additional documents required for pharma clearance.",
    consignee: "Al Noor Traders"
  },
  {
    id: "NOA-009", noticeId: "NOA-2026-00134", awb: "157-77669933", hawb: "HAWB-005690",
    carrier: "Saudia Cargo", flight: "SV-736", origin: "RUH", originFull: "King Khalid Intl, Riyadh",
    destination: "KHI", destinationFull: "Jinnah Intl, Karachi",
    arrivalDate: "25 May 2026", arrivalTime: "15:10", pieces: 32, weight: "1,560 kg", cargoClass: "GCR",
    freePeriodStart: "25 May 2026", freePeriodExpiry: "30 May 2026", customsChannel: "Green",
    customsStatus: "Cleared", chargesStatus: "Paid", noticeStatus: "Resolved",
    documentsRequired: ["Packing List", "Commercial Invoice"],
    contactNote: "All completed. Shipment delivered on 29 May 2026.",
    consignee: "Metro Engineering"
  },
  {
    id: "NOA-010", noticeId: "NOA-2026-00133", awb: "074-55668877", hawb: "HAWB-002233",
    carrier: "Etihad Cargo", flight: "EY-245", origin: "AUH", originFull: "Abu Dhabi Intl, UAE",
    destination: "KHI", destinationFull: "Jinnah Intl, Karachi",
    arrivalDate: "01 Jun 2026", arrivalTime: "06:30", pieces: 14, weight: "720 kg", cargoClass: "AFU",
    freePeriodStart: "01 Jun 2026", freePeriodExpiry: "08 Jun 2026", customsChannel: null,
    customsStatus: "Awaiting Filing", chargesStatus: "Unpaid", noticeStatus: "Unread",
    documentsRequired: ["Packing List", "Commercial Invoice", "Cerificate of Analysis"],
    contactNote: "New arrival. IGM under filing. Contact CHA for GD filing status.",
    consignee: "Karachi Pharma Imports"
  },
];

const noticeStatusConfig: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  Unread: { bg: "#DBEAFE", text: "#1D4ED8", icon: <Mail size={13} /> },
  Read: { bg: "#F1F5F9", text: "#64748B", icon: <MailOpen size={13} /> },
  "Action Required": { bg: "#FEF3C7", text: "#D97706", icon: <AlertTriangle size={13} /> },
  Resolved: { bg: "#DCFCE7", text: "#16A34A", icon: <CheckCircle size={13} /> },
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

export default function NOAInbox() {
  const { addToast } = useToast();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const active = notices.find((n) => n.id === selectedId);

  const handleRetry = () => {
    setLoading(true);
    setError(false);
    setTimeout(() => {
      setLoading(false);
      addToast("Notice data loaded.", "success");
    }, 1500);
  };

  const handleViewDetail = (n: NOA) => {
    setSelectedId(n.id);
  };

  const handleMarkAsRead = (n: NOA) => {
    addToast(`Notice ${n.noticeId} marked as read.`, "success");
  };

  const handleDownloadPDF = (n: NOA) => {
    addToast(`Notice PDF downloaded for ${n.awb}.`, "success");
  };

  const handlePayCharges = (n: NOA) => {
    addToast(`Payment gateway opened for ${n.awb}.`, "success");
  };

  const handleViewShipment = (n: NOA) => {
    addToast(`Shipment detail opened for ${n.awb}.`, "success");
  };

  const handleSchedulePickup = (n: NOA) => {
    addToast(`Pickup scheduling opened for ${n.awb}.`, "success");
  };

  const getFreePeriodStatus = (expiry: string): { label: string; bg: string; text: string } => {
    const exp = new Date(expiry);
    const now = new Date("2026-05-29");
    const diffDays = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return { label: "Expired", bg: "#FEE2E2", text: "#DC2626" };
    if (diffDays <= 2) return { label: "Expiring", bg: "#FEF3C7", text: "#D97706" };
    return { label: "Active", bg: "#DCFCE7", text: "#16A34A" };
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[16px] border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-2">
            <h2 className="text-[15px] font-bold text-[#0F172A]">Notice of Arrival Inbox</h2>
          </div>
          <span className="text-[12px] text-[#64748B]">{notices.length} notices</span>
        </div>

        <div className="p-5">
          {error && (
            <div className="flex items-center gap-3 mb-4 p-4 rounded-xl bg-[#FEE2E2] border border-[#FCA5A5]">
              <AlertTriangle size={16} className="text-[#DC2626]" />
              <span className="text-[13px] font-semibold text-[#DC2626]">Failed to load notice data. Please try again.</span>
              <button onClick={handleRetry} className="flex items-center gap-2 h-8 px-3 rounded-lg text-[12px] font-semibold bg-[#DC2626] text-white hover:opacity-90 cursor-pointer">
                <RefreshCw size={14} /> Retry
              </button>
            </div>
          )}

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-[140px] rounded-xl bg-[#F1F5F9] animate-pulse" />
              ))}
            </div>
          ) : notices.length === 0 ? (
            <div className="py-12 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#F1F5F9] flex items-center justify-center">
                  <Bell size={24} className="text-[#94A3B8]" />
                </div>
                <p className="text-[13px] font-semibold text-[#64748B]">No Notice of Arrival messages found.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {notices.map((n) => {
                const nsc = noticeStatusConfig[n.noticeStatus];
                const csc = chargesConfig[n.chargesStatus];
                const fps = getFreePeriodStatus(n.freePeriodExpiry);
                const isSelected = selectedId === n.id;
                return (
                  <div key={n.id}>
                    <div
                      onClick={() => setSelectedId(isSelected ? null : n.id)}
                      className={`rounded-xl border p-4 cursor-pointer transition-colors ${
                        isSelected ? "border-[#1B4F8B] bg-[#F0F4FA]" : "border-[#E2E8F0] bg-white hover:bg-[#F8FAFC]"
                      } ${n.noticeStatus === "Unread" ? "border-l-[3px] border-l-[#1D4ED8]" : ""}`}
                    >
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-[13px] font-bold font-mono text-[#0F172A]">{n.awb}</span>
                            <span className="inline-flex items-center gap-1 h-[22px] px-2 rounded-full text-[11px] font-bold" style={{ backgroundColor: nsc.bg, color: nsc.text }}>
                              {nsc.icon}
                              {n.noticeStatus}
                            </span>
                            <span className="text-[12px] text-[#94A3B8]">{n.noticeId}</span>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
                            <div>
                              <label className="text-[10px] font-semibold text-[#94A3B8] uppercase">Carrier</label>
                              <p className="text-[12px] text-[#334155]">{n.carrier}</p>
                            </div>
                            <div>
                              <label className="text-[10px] font-semibold text-[#94A3B8] uppercase">Flight</label>
                              <p className="text-[12px] font-mono text-[#1B4F8B]">{n.flight}</p>
                            </div>
                            <div>
                              <label className="text-[10px] font-semibold text-[#94A3B8] uppercase">Arrival</label>
                              <p className="text-[12px] text-[#334155]">{n.arrivalDate} {n.arrivalTime}</p>
                            </div>
                            <div>
                              <label className="text-[10px] font-semibold text-[#94A3B8] uppercase">Origin</label>
                              <p className="text-[12px] font-medium text-[#0F172A]">{n.origin}</p>
                            </div>
                            <div>
                              <label className="text-[10px] font-semibold text-[#94A3B8] uppercase">Pieces/Wt</label>
                              <p className="text-[12px] text-[#334155]">{n.pieces} / {n.weight}</p>
                            </div>
                            <div>
                              <label className="text-[10px] font-semibold text-[#94A3B8] uppercase">Cargo Class</label>
                              <p className="text-[12px] font-mono font-semibold text-[#64748B]">{n.cargoClass}</p>
                            </div>
                            <div>
                              <label className="text-[10px] font-semibold text-[#94A3B8] uppercase">Free Period</label>
                              <span className="inline-flex items-center h-[20px] px-1.5 rounded-full text-[10px] font-bold" style={{ backgroundColor: fps.bg, color: fps.text }}>
                                {fps.label}: {n.freePeriodExpiry}
                              </span>
                            </div>
                            <div>
                              <label className="text-[10px] font-semibold text-[#94A3B8] uppercase">Customs</label>
                              {n.customsChannel ? (
                                <span className="inline-flex items-center h-[20px] px-1.5 rounded-full text-[10px] font-bold" style={{ backgroundColor: channelConfig[n.customsChannel].bg, color: channelConfig[n.customsChannel].text }}>
                                  {n.customsChannel}
                                </span>
                              ) : (
                                <span className="text-[12px] text-[#94A3B8]">—</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleViewDetail(n); }}
                            className="flex items-center gap-2 h-9 px-4 rounded-xl text-[13px] font-semibold text-white hover:opacity-90 cursor-pointer transition-colors whitespace-nowrap"
                            style={{ backgroundColor: "#0B2545" }}
                          >
                            <Eye size={14} /> View Details
                          </button>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="mt-5 pt-5 border-t border-[#E2E8F0]">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <Eye size={16} className="text-[#1B4F8B]" />
                              <h3 className="text-[13px] font-bold text-[#0F172A]">Notice of Arrival Detail</h3>
                            </div>
                            <button onClick={() => setSelectedId(null)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#E2E8F0] text-[#64748B] cursor-pointer transition-colors">
                              <X size={14} />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-5">
                            <div>
                              <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">Notice ID</label>
                              <p className="text-[13px] font-mono font-bold text-[#0F172A]">{n.noticeId}</p>
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">AWB #</label>
                              <p className="text-[13px] font-bold font-mono text-[#0F172A]">{n.awb}</p>
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">HAWB #</label>
                              <p className="text-[13px] font-mono text-[#334155]">{n.hawb}</p>
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">Carrier</label>
                              <p className="text-[13px] text-[#334155]">{n.carrier}</p>
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">Flight #</label>
                              <p className="text-[13px] font-mono text-[#1B4F8B]">{n.flight}</p>
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">Origin</label>
                              <p className="text-[13px] text-[#334155]">{n.originFull}</p>
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">Destination</label>
                              <p className="text-[13px] text-[#334155]">{n.destinationFull}</p>
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">Arrival Date</label>
                              <p className="text-[13px] text-[#334155]">{n.arrivalDate}</p>
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">Arrival Time</label>
                              <p className="text-[13px] text-[#334155]">{n.arrivalTime}</p>
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">Pieces</label>
                              <p className="text-[13px] font-bold text-[#0F172A]">{n.pieces}</p>
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">Weight</label>
                              <p className="text-[13px] text-[#334155]">{n.weight}</p>
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">Cargo Class</label>
                              <p className="text-[13px] font-mono font-semibold text-[#64748B]">{n.cargoClass}</p>
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">Free Period Start</label>
                              <p className="text-[13px] text-[#334155]">{n.freePeriodStart}</p>
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">Free Period Expiry</label>
                              <p className="text-[13px] font-semibold" style={{ color: fps.text }}>{n.freePeriodExpiry}</p>
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">Customs Channel</label>
                              {n.customsChannel ? (
                                <span className="inline-flex items-center h-[22px] px-2 rounded-full text-[11px] font-bold" style={{ backgroundColor: channelConfig[n.customsChannel].bg, color: channelConfig[n.customsChannel].text }}>
                                  {n.customsChannel}
                                </span>
                              ) : (
                                <span className="text-[13px] text-[#94A3B8]">—</span>
                              )}
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">Documents Required</label>
                              <div className="flex flex-wrap gap-1">
                                {n.documentsRequired.map((doc) => (
                                  <span key={doc} className="inline-flex items-center h-[22px] px-2 rounded-full text-[10px] font-medium bg-[#F1F5F9] text-[#64748B]">
                                    {doc}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">Charges Status</label>
                              <span className="inline-flex items-center h-[22px] px-2 rounded-full text-[11px] font-bold" style={{ backgroundColor: csc.bg, color: csc.text }}>
                                {n.chargesStatus}
                              </span>
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">Support Contact</label>
                              <p className="text-[12px] text-[#64748B] leading-relaxed">{n.contactNote}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 pt-4 border-t border-[#E2E8F0] flex-wrap">
                            <button onClick={() => handleViewDetail(n)} className="flex items-center gap-2 h-9 px-4 rounded-xl text-[13px] font-semibold text-white hover:opacity-90 cursor-pointer transition-colors whitespace-nowrap" style={{ backgroundColor: "#0B2545" }}>
                              <Eye size={14} /> View Details
                            </button>
                            <button onClick={() => handleMarkAsRead(n)} className="flex items-center gap-2 h-9 px-4 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer transition-colors whitespace-nowrap">
                              <MailOpen size={14} /> Mark as Read
                            </button>
                            <button onClick={() => handleDownloadPDF(n)} className="flex items-center gap-2 h-9 px-4 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer transition-colors whitespace-nowrap">
                              <Download size={14} /> Download Notice PDF
                            </button>
                            <button onClick={() => handlePayCharges(n)} className="flex items-center gap-2 h-9 px-4 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer transition-colors whitespace-nowrap">
                              <CreditCard size={14} /> Pay Charges
                            </button>
                            <button onClick={() => handleViewShipment(n)} className="flex items-center gap-2 h-9 px-4 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer transition-colors whitespace-nowrap">
                              <Package size={14} /> View Shipment
                            </button>
                            <button
                              onClick={() => handleSchedulePickup(n)}
                              className={`flex items-center gap-2 h-9 px-4 rounded-xl text-[13px] font-semibold border whitespace-nowrap cursor-pointer transition-colors ${
                                n.chargesStatus === "Paid" && n.customsStatus === "Cleared"
                                  ? "border-[#16A34A]/30 text-[#16A34A] hover:bg-[#16A34A]/10"
                                  : "border-[#E2E8F0] text-[#94A3B8] cursor-not-allowed"
                              }`}
                              disabled={!(n.chargesStatus === "Paid" && n.customsStatus === "Cleared")}
                            >
                              <Truck size={14} /> Schedule Pickup
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-[16px] border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 flex items-center justify-center">
              <AlertTriangle size={14} className="text-[#D97706]" />
            </div>
            <h2 className="text-[15px] font-bold text-[#0F172A]">Free Period Alerts</h2>
          </div>
          <span className="text-[12px] text-[#64748B]">{notices.filter((n) => getFreePeriodStatus(n.freePeriodExpiry).label !== "Active").length} alerts</span>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notices.filter((n) => getFreePeriodStatus(n.freePeriodExpiry).label !== "Active").map((n) => {
              const fps = getFreePeriodStatus(n.freePeriodExpiry);
              const exp = new Date(n.freePeriodExpiry);
              const now = new Date("2026-05-29");
              const diffDays = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
              return (
                <div key={n.id} className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[13px] font-bold font-mono text-[#0F172A]">{n.awb}</span>
                    <span className="inline-flex items-center h-[22px] px-2 rounded-full text-[11px] font-bold" style={{ backgroundColor: fps.bg, color: fps.text }}>
                      {fps.label}
                    </span>
                  </div>
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-[#64748B]">Free Period Expiry</span>
                      <span className="text-[12px] font-semibold text-[#0F172A]">{n.freePeriodExpiry}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-[#64748B]">Time Remaining</span>
                      <span className="text-[12px] font-bold" style={{ color: fps.text }}>
                        {diffDays <= 0 ? "Expired" : `${diffDays} day${diffDays > 1 ? "s" : ""}`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-[#64748B]">Current Status</span>
                      <span className="text-[12px] text-[#334155]">{n.customsStatus}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-[#64748B]">Charges</span>
                      <span className="inline-flex items-center h-[20px] px-1.5 rounded-full text-[10px] font-bold" style={{ backgroundColor: chargesConfig[n.chargesStatus].bg, color: chargesConfig[n.chargesStatus].text }}>
                        {n.chargesStatus}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="block text-[11px] font-semibold text-[#64748B] uppercase mb-1">Recommended Action</span>
                    <p className="text-[12px] text-[#334155] leading-relaxed">
                      {n.chargesStatus === "Unpaid" ? "Clear outstanding charges immediately to avoid storage fees." :
                       n.customsStatus !== "Cleared" ? "Expedite customs clearance before free period expires." :
                       "Download DO and schedule pickup before free period expiry."}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          {notices.filter((n) => getFreePeriodStatus(n.freePeriodExpiry).label !== "Active").length === 0 && (
            <div className="py-8 text-center">
              <div className="flex flex-col items-center gap-2">
                <CheckCircle size={24} className="text-[#16A34A]" />
                <p className="text-[13px] font-semibold text-[#64748B]">No free period alerts. All shipments are within active free period.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}