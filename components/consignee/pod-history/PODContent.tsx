"use client";

import { useState } from "react";
import { useToast } from "@/components/ToastContext";
import ScopeBadge from "@/components/ScopeBadge";
import {
  Eye,
  Download,
  AlertTriangle,
  FileText,
  X,
  User,
  Truck,
  Calendar,
  Clock,
  Shield,
  FileDown,
  Camera,
  RefreshCw,
  MessageSquare,
  ChevronLeft,
  ClipboardList,
} from "lucide-react";

interface PODRecord {
  id: string;
  awb: string;
  doNumber: string;
  driver: string;
  driverCNIC: string;
  vehicle: string;
  pickupDate: string;
  pieces: number;
  piecesReleased: number;
  gatePass: string;
  podStatus: "Available" | "Pending" | "Under Review" | "Disputed";
  signedPdfName: string;
  exitTimestamp: string;
  sapsGuard: string;
  deliveryStatus: string;
  remarks: string;
}

const podRecords: PODRecord[] = [
  {
    id: "POD-2026-001",
    awb: "157-90811223",
    doNumber: "DO-90872",
    driver: "Ahmed Raza",
    driverCNIC: "42101-1234567-1",
    vehicle: "KHI-4582",
    pickupDate: "31 May 2026",
    pieces: 8,
    piecesReleased: 8,
    gatePass: "GP-2026-05131",
    podStatus: "Available",
    signedPdfName: "POD-2026-001-signed.pdf",
    exitTimestamp: "31 May 2026, 14:35",
    sapsGuard: "Shahid Iqbal",
    deliveryStatus: "Delivered Complete",
    remarks: "All 8 pieces released. No damage reported. Driver signature verified by SAPS gate guard.",
  },
  {
    id: "POD-2026-002",
    awb: "214-45678901",
    doNumber: "DO-90871",
    driver: "Imran Ali",
    driverCNIC: "35201-2345678-3",
    vehicle: "BJU-7721",
    pickupDate: "30 May 2026",
    pieces: 24,
    piecesReleased: 24,
    gatePass: "GP-2026-05129",
    podStatus: "Available",
    signedPdfName: "POD-2026-002-signed.pdf",
    exitTimestamp: "30 May 2026, 16:10",
    sapsGuard: "Adeel Malik",
    deliveryStatus: "Delivered Complete",
    remarks: "Cargo cleared gate. All inspection passed. No anomalies.",
  },
  {
    id: "POD-2026-003",
    awb: "074-88219033",
    doNumber: "DO-90874",
    driver: "Kashif Khan",
    driverCNIC: "42101-3456789-5",
    vehicle: "KHI-9934",
    pickupDate: "29 May 2026",
    pieces: 16,
    piecesReleased: 16,
    gatePass: "GP-2026-05127",
    podStatus: "Available",
    signedPdfName: "POD-2026-003-signed.pdf",
    exitTimestamp: "29 May 2026, 11:45",
    sapsGuard: "Naveed Akram",
    deliveryStatus: "Delivered Complete",
    remarks: "Routine delivery. All documents in order.",
  },
  {
    id: "POD-2026-004",
    awb: "117-55443321",
    doNumber: "DO-90873",
    driver: "Bilal Ahmed",
    driverCNIC: "36401-4567890-7",
    vehicle: "LHE-2217",
    pickupDate: "28 May 2026",
    pieces: 20,
    piecesReleased: 19,
    gatePass: "GP-2026-05125",
    podStatus: "Under Review",
    signedPdfName: "POD-2026-004-signed.pdf",
    exitTimestamp: "28 May 2026, 15:20",
    sapsGuard: "Shahid Iqbal",
    deliveryStatus: "Partial — 1 piece held",
    remarks: "1 piece held back for customs re-inspection. Remaining 19 cleared. Awaiting resolution.",
  },
  {
    id: "POD-2026-005",
    awb: "214-99887766",
    doNumber: "DO-90877",
    driver: "Nadeem Hussain",
    driverCNIC: "35201-6789012-1",
    vehicle: "KHI-9921",
    pickupDate: "27 May 2026",
    pieces: 12,
    piecesReleased: 12,
    gatePass: "GP-2026-05122",
    podStatus: "Available",
    signedPdfName: "POD-2026-005-signed.pdf",
    exitTimestamp: "27 May 2026, 09:55",
    sapsGuard: "Adeel Malik",
    deliveryStatus: "Delivered Complete",
    remarks: "Early morning exit. No issues.",
  },
  {
    id: "POD-2026-006",
    awb: "157-11223344",
    doNumber: "DO-90880",
    driver: "Rashid Mehmood",
    driverCNIC: "42101-7890123-9",
    vehicle: "KHI-7788",
    pickupDate: "26 May 2026",
    pieces: 6,
    piecesReleased: 6,
    gatePass: "GP-2026-05118",
    podStatus: "Available",
    signedPdfName: "POD-2026-006-signed.pdf",
    exitTimestamp: "26 May 2026, 13:10",
    sapsGuard: "Naveed Akram",
    deliveryStatus: "Delivered Complete",
    remarks: "Small consignment. All cleared.",
  },
  {
    id: "POD-2026-007",
    awb: "074-55667788",
    doNumber: "DO-90879",
    driver: "Kamran Khan",
    driverCNIC: "36401-8901234-2",
    vehicle: "BJU-5544",
    pickupDate: "25 May 2026",
    pieces: 30,
    piecesReleased: 30,
    gatePass: "GP-2026-05115",
    podStatus: "Available",
    signedPdfName: "POD-2026-007-signed.pdf",
    exitTimestamp: "25 May 2026, 17:40",
    sapsGuard: "Shahid Iqbal",
    deliveryStatus: "Delivered Complete",
    remarks: "Evening dispatch. All pieces accounted for.",
  },
  {
    id: "POD-2026-008",
    awb: "117-44556677",
    doNumber: "DO-90878",
    driver: "Javed Iqbal",
    driverCNIC: "42101-5678901-4",
    vehicle: "KHI-1122",
    pickupDate: "24 May 2026",
    pieces: 15,
    piecesReleased: 15,
    gatePass: "GP-2026-05110",
    podStatus: "Available",
    signedPdfName: "POD-2026-008-signed.pdf",
    exitTimestamp: "24 May 2026, 10:30",
    sapsGuard: "Adeel Malik",
    deliveryStatus: "Delivered Complete",
    remarks: "Standard delivery.",
  },
  {
    id: "POD-2026-009",
    awb: "214-44556677",
    doNumber: "DO-90881",
    driver: "Saad Qureshi",
    driverCNIC: "35201-4321098-6",
    vehicle: "KHI-4455",
    pickupDate: "23 May 2026",
    pieces: 22,
    piecesReleased: 22,
    gatePass: "GP-2026-05106",
    podStatus: "Pending",
    signedPdfName: "",
    exitTimestamp: "",
    sapsGuard: "Naveed Akram",
    deliveryStatus: "Awaiting Exit",
    remarks: "Cargo loaded — waiting for SAPS gate clearance sign-off.",
  },
  {
    id: "POD-2026-010",
    awb: "157-33445566",
    doNumber: "DO-90882",
    driver: "Faisal Khan",
    driverCNIC: "36401-1234509-8",
    vehicle: "KHI-3344",
    pickupDate: "22 May 2026",
    pieces: 18,
    piecesReleased: 16,
    gatePass: "GP-2026-05102",
    podStatus: "Disputed",
    signedPdfName: "POD-2026-010-signed.pdf",
    exitTimestamp: "22 May 2026, 14:15",
    sapsGuard: "Shahid Iqbal",
    deliveryStatus: "Disputed — Missing Pieces",
    remarks: "2 pieces reported missing at delivery. Dispute raised. Investigation ongoing.",
  },
];

const podStatusConfig: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  Available: { bg: "#DCFCE7", text: "#16A34A", icon: <FileText size={12} /> },
  Pending: { bg: "#FEF3C7", text: "#D97706", icon: <Clock size={12} /> },
  "Under Review": { bg: "#DBEAFE", text: "#1D4ED8", icon: <Shield size={12} /> },
  Disputed: { bg: "#FEE2E2", text: "#DC2626", icon: <AlertTriangle size={12} /> },
};

const disputeReasons = [
  "Missing Pieces",
  "Damaged Cargo",
  "Wrong Quantity",
  "Driver Mismatch",
  "Signature Mismatch",
  "Gate Guard Discrepancy",
  "Timestamp Anomaly",
  "Document Discrepancy",
  "Other",
];

interface PODContentProps {
  filters: Record<string, string>;
}

export default function PODContent({ filters }: PODContentProps) {
  const { addToast } = useToast();
  const [records] = useState<PODRecord[]>(podRecords);
  const [selected, setSelected] = useState<PODRecord | null>(null);
  const [drawerMode, setDrawerMode] = useState<"detail" | "dispute" | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [dispute, setDispute] = useState({
    reason: "",
    description: "",
    contactPerson: "",
    notes: "",
  });

  const filtered = records.filter((r) => {
    if (filters.awb && !r.awb.toLowerCase().includes(filters.awb.toLowerCase())) return false;
    if (filters.do && !r.doNumber.toLowerCase().includes(filters.do.toLowerCase())) return false;
    if (filters.pickupDate && !r.pickupDate.includes(filters.pickupDate)) return false;
    if (filters.driver && r.driver !== filters.driver) return false;
    if (filters.vehicle && r.vehicle !== filters.vehicle) return false;
    if (filters.podStatus && r.podStatus !== filters.podStatus) return false;
    return true;
  });

  const handleViewDetail = (record: PODRecord) => {
    setSelected(record);
    setDrawerMode("detail");
  };

  const handleRaiseDispute = (record: PODRecord) => {
    setSelected(record);
    setDispute({ reason: "", description: "", contactPerson: "", notes: "" });
    setDrawerMode("dispute");
  };

  const handleCloseDrawer = () => {
    setDrawerMode(null);
    setSelected(null);
  };

  const handleDownloadPOD = (record: PODRecord) => {
    if (record.podStatus !== "Available" && record.podStatus !== "Under Review") {
      addToast("POD not yet available for download.", "error");
      return;
    }
    addToast("POD downloaded.", "success");
  };

  const handleDownloadEvidence = (record: PODRecord) => {
    addToast("Evidence bundle downloaded.", "success");
  };

  const handleRetry = () => {
    setLoading(true);
    setError(false);
    setTimeout(() => {
      setLoading(false);
      addToast("POD data refreshed.", "success");
    }, 1500);
  };

  const handleSubmitDispute = () => {
    if (!dispute.reason) { addToast("Please select a dispute reason.", "error"); return; }
    if (!dispute.description.trim()) { addToast("Please provide a description.", "error"); return; }
    if (dispute.description.length > 500) { addToast("Description exceeds 500 character limit.", "error"); return; }
    addToast("Dispute raised successfully.", "success");
    handleCloseDrawer();
  };

  return (
    <div className="space-y-5">
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-[#FEE2E2] border border-[#FCA5A5]">
          <AlertTriangle size={16} className="text-[#DC2626] flex-shrink-0" />
          <span className="text-[13px] font-semibold text-[#DC2626]">Failed to load POD history. Please try again.</span>
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
            <h2 className="text-[15px] font-bold text-[#0F172A]">Proof of Delivery History</h2>
            <ScopeBadge type="exc" />
          </div>
          <span className="text-[12px] text-[#64748B]">{filtered.length} records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px] text-left">
            <thead>
              <tr className="border-b border-[#E2E8F0]">
                <th className="py-2.5 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Pickup Date</th>
                <th className="py-2.5 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">AWB #</th>
                <th className="py-2.5 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">DO #</th>
                <th className="py-2.5 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Driver</th>
                <th className="py-2.5 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Vehicle</th>
                <th className="py-2.5 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Pieces</th>
                <th className="py-2.5 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Gate Pass #</th>
                <th className="py-2.5 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">POD Status</th>
                <th className="py-2.5 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Signed POD PDF</th>
                <th className="py-2.5 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-b border-[#F1F5F9]">
                    {Array.from({ length: 10 }).map((_, j) => (
                      <td key={j} className="py-3 px-3">
                        <div className="h-4 bg-[#F1F5F9] rounded animate-pulse" style={{ width: j === 3 ? "90px" : j === 7 ? "80px" : "70px" }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-[#F1F5F9] flex items-center justify-center">
                        <ClipboardList size={28} className="text-[#94A3B8]" />
                      </div>
                      <p className="text-[14px] font-semibold text-[#64748B]">No completed pickups or POD records found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((r) => {
                  const sc = podStatusConfig[r.podStatus];
                  return (
                    <tr key={r.id} className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors">
                      <td className="py-3 px-3 text-[12px] text-[#64748B] whitespace-nowrap">{r.pickupDate}</td>
                      <td className="py-3 px-3 text-[12px] font-mono text-[#1B4F8B]">{r.awb}</td>
                      <td className="py-3 px-3 text-[12px] font-mono text-[#64748B]">{r.doNumber}</td>
                      <td className="py-3 px-3 text-[12px] text-[#0F172A]">{r.driver}</td>
                      <td className="py-3 px-3 text-[12px] font-mono text-[#64748B]">{r.vehicle}</td>
                      <td className="py-3 px-3 text-[12px] font-semibold text-[#0F172A]">{r.pieces}</td>
                      <td className="py-3 px-3 text-[12px] font-mono text-[#0B2545]">{r.gatePass}</td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center gap-1 h-5 px-2 rounded-full text-[11px] font-semibold whitespace-nowrap" style={{ backgroundColor: sc.bg, color: sc.text }}>
                          {sc.icon}
                          {r.podStatus}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        {r.podStatus === "Available" || r.podStatus === "Under Review" ? (
                          <button
                            onClick={() => handleDownloadPOD(r)}
                            className="flex items-center gap-1.5 h-7 px-2.5 rounded-lg text-[11px] font-semibold text-[#1B4F8B] bg-[#DBEAFE] hover:bg-[#BFDBFE] cursor-pointer transition-colors whitespace-nowrap"
                          >
                            <FileDown size={12} />
                            {r.signedPdfName}
                          </button>
                        ) : (
                          <span className="text-[12px] text-[#94A3B8]">—</span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleViewDetail(r)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors"
                            title="View POD Detail"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => handleDownloadEvidence(r)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors"
                            title="Download Evidence"
                          >
                            <Download size={14} />
                          </button>
                          <button
                            onClick={() => handleRaiseDispute(r)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#FEE2E2] text-[#DC2626] cursor-pointer transition-colors"
                            title="Raise Delivery Dispute"
                          >
                            <MessageSquare size={14} />
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
      </div>

      {drawerMode && (
        <div className="fixed inset-0 z-[60] flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={handleCloseDrawer} />
          <div className="relative w-full max-w-[640px] bg-white h-full overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white z-10 border-b border-[#E2E8F0] px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button onClick={handleCloseDrawer} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F1F5F9] text-[#64748B] cursor-pointer transition-colors">
                  <ChevronLeft size={18} />
                </button>
                <h2 className="text-[16px] font-bold text-[#0F172A]">
                  {drawerMode === "detail" ? "POD Detail" : "Raise Delivery Dispute"}
                </h2>
                <ScopeBadge type="exc" />
              </div>
              <button onClick={handleCloseDrawer} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F1F5F9] text-[#64748B] cursor-pointer transition-colors">
                <X size={18} />
              </button>
            </div>

            {drawerMode === "detail" && selected && (
              <div className="p-5 space-y-5">
                <div className="rounded-[16px] border border-[#E2E8F0] bg-[#F8FAFC] p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-[13px] font-bold text-[#0F172A]">POD Detail</h3>
                    <ScopeBadge type="exc" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-semibold text-[#94A3B8] uppercase block mb-1">POD ID</label>
                      <p className="text-[13px] font-bold font-mono text-[#0F172A]">{selected.id}</p>
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-[#94A3B8] uppercase block mb-1">AWB #</label>
                      <p className="text-[13px] font-mono text-[#1B4F8B]">{selected.awb}</p>
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-[#94A3B8] uppercase block mb-1">DO #</label>
                      <p className="text-[13px] font-mono text-[#64748B]">{selected.doNumber}</p>
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-[#94A3B8] uppercase block mb-1">Gate Pass #</label>
                      <p className="text-[13px] font-mono text-[#0B2545]">{selected.gatePass}</p>
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-[#94A3B8] uppercase block mb-1">Pickup Date</label>
                      <p className="text-[13px] text-[#334155]">{selected.pickupDate}</p>
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-[#94A3B8] uppercase block mb-1">Driver Name</label>
                      <p className="text-[13px] text-[#0F172A]">{selected.driver}</p>
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-[#94A3B8] uppercase block mb-1">Driver CNIC</label>
                      <p className="text-[13px] font-mono text-[#64748B]">{selected.driverCNIC}</p>
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-[#94A3B8] uppercase block mb-1">Vehicle Number</label>
                      <p className="text-[13px] font-mono text-[#64748B]">{selected.vehicle}</p>
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-[#94A3B8] uppercase block mb-1">Pieces Released</label>
                      <p className="text-[13px] font-semibold text-[#0F172A]">{selected.piecesReleased} / {selected.pieces}</p>
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-[#94A3B8] uppercase block mb-1">Exit Timestamp</label>
                      <p className="text-[13px] text-[#334155]">{selected.exitTimestamp || "—"}</p>
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-[#94A3B8] uppercase block mb-1">SAPS Gate Guard</label>
                      <p className="text-[13px] text-[#0F172A]">{selected.sapsGuard}</p>
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-[#94A3B8] uppercase block mb-1">Delivery Status</label>
                      <span className="inline-flex items-center gap-1 h-6 px-2 rounded-full text-[11px] font-semibold" style={{ backgroundColor: selected.deliveryStatus.includes("Complete") ? "#DCFCE7" : selected.deliveryStatus.includes("Disputed") ? "#FEE2E2" : "#FEF3C7", color: selected.deliveryStatus.includes("Complete") ? "#16A34A" : selected.deliveryStatus.includes("Disputed") ? "#DC2626" : "#D97706" }}>
                        {selected.deliveryStatus}
                      </span>
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-[#94A3B8] uppercase block mb-1">Driver Signature</label>
                      <p className="text-[13px] text-[#16A34A] font-semibold">Verified ✓</p>
                    </div>
                    <div className="col-span-2">
                      <label className="text-[10px] font-semibold text-[#94A3B8] uppercase block mb-1">Vehicle Loaded Photo</label>
                      <p className="text-[13px] text-[#16A34A] font-semibold">Captured ✓</p>
                    </div>
                    <div className="col-span-2">
                      <label className="text-[10px] font-semibold text-[#94A3B8] uppercase block mb-1">Remarks</label>
                      <p className="text-[12px] text-[#64748B]">{selected.remarks}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[16px] border border-[#E2E8F0] bg-[#F8FAFC] p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-[13px] font-bold text-[#0F172A]">Evidence</h3>
                    <ScopeBadge type="exc" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center gap-3 p-3 rounded-xl border border-[#E2E8F0] bg-white">
                      <div className="w-10 h-10 rounded-lg bg-[#DBEAFE] flex items-center justify-center flex-shrink-0">
                        <FileText size={18} className="text-[#1B4F8B]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-semibold text-[#0F172A]">Signed POD PDF</p>
                        <p className="text-[11px] text-[#94A3B8] truncate">{selected.signedPdfName || "Pending"}</p>
                      </div>
                      <button
                        onClick={() => handleDownloadPOD(selected)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors flex-shrink-0"
                      >
                        <FileDown size={16} />
                      </button>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-xl border border-[#E2E8F0] bg-white">
                      <div className="w-10 h-10 rounded-lg bg-[#DCFCE7] flex items-center justify-center flex-shrink-0">
                        <User size={18} className="text-[#16A34A]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-semibold text-[#0F172A]">Driver Signature</p>
                        <p className="text-[11px] text-[#16A34A]">Verified on {selected.pickupDate}</p>
                      </div>
                      <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                        <div className="w-5 h-5 rounded-full bg-[#DCFCE7] flex items-center justify-center">
                          <FileText size={10} className="text-[#16A34A]" />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-xl border border-[#E2E8F0] bg-white">
                      <div className="w-10 h-10 rounded-lg bg-[#FEF3C7] flex items-center justify-center flex-shrink-0">
                        <Camera size={18} className="text-[#D97706]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-semibold text-[#0F172A]">Vehicle Loaded Photo</p>
                        <p className="text-[11px] text-[#94A3B8]">Captured by SAPS guard</p>
                      </div>
                      <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                        <div className="w-5 h-5 rounded-full bg-[#DCFCE7] flex items-center justify-center">
                          <FileText size={10} className="text-[#16A34A]" />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-xl border border-[#E2E8F0] bg-white">
                      <div className="w-10 h-10 rounded-lg bg-[#F1F5F9] flex items-center justify-center flex-shrink-0">
                        <Clock size={18} className="text-[#64748B]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-semibold text-[#0F172A]">Gate Exit Timestamp</p>
                        <p className="text-[11px] text-[#94A3B8]">{selected.exitTimestamp || "Pending"}</p>
                      </div>
                      <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                        <div className="w-5 h-5 rounded-full bg-[#DCFCE7] flex items-center justify-center">
                          <FileText size={10} className="text-[#16A34A]" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 p-3 rounded-xl border border-[#E2E8F0] bg-white">
                    <p className="text-[11px] font-semibold text-[#64748B] mb-1">Delivery Evidence Files</p>
                    <p className="text-[12px] text-[#94A3B8]">
                      {selected.podStatus === "Available"
                        ? "2 evidence files attached — Signed POD, Gate exit photo"
                        : selected.podStatus === "Pending"
                        ? "Evidence not yet compiled — Awaiting gate exit"
                        : "Evidence available with dispute flag"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => handleViewDetail(selected)}
                    className="flex items-center gap-2 h-10 px-5 rounded-xl text-[13px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90 whitespace-nowrap"
                    style={{ backgroundColor: "#0B2545" }}
                  >
                    <Eye size={16} /> View POD
                  </button>
                  <button
                    onClick={() => handleDownloadPOD(selected)}
                    className="flex items-center gap-2 h-10 px-4 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer transition-colors whitespace-nowrap"
                  >
                    <FileDown size={16} /> Download POD PDF
                  </button>
                  <button
                    onClick={() => handleDownloadEvidence(selected)}
                    className="flex items-center gap-2 h-10 px-4 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer transition-colors whitespace-nowrap"
                  >
                    <Download size={16} /> Download Evidence
                  </button>
                  <button
                    onClick={() => handleRaiseDispute(selected)}
                    className="flex items-center gap-2 h-10 px-4 rounded-xl text-[13px] font-semibold border border-[#FCA5A5] text-[#DC2626] hover:bg-[#FEF2F2] cursor-pointer transition-colors whitespace-nowrap"
                  >
                    <MessageSquare size={16} /> Raise Delivery Dispute
                  </button>
                </div>
              </div>
            )}

            {drawerMode === "dispute" && selected && (
              <div className="p-5 space-y-5">
                <div className="rounded-[16px] border border-[#E2E8F0] bg-[#F8FAFC] p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-[13px] font-bold text-[#0F172A]">Raise Delivery Dispute</h3>
                    <ScopeBadge type="exc" />
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-semibold text-[#94A3B8] uppercase block mb-1">AWB #</label>
                        <input
                          type="text"
                          value={selected.awb}
                          readOnly
                          className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] bg-[#F1F5F9] font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-[#94A3B8] uppercase block mb-1">POD ID</label>
                        <input
                          type="text"
                          value={selected.id}
                          readOnly
                          className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] bg-[#F1F5F9] font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-semibold text-[#94A3B8] uppercase block mb-1">Dispute Reason</label>
                      <div className="relative">
                        <select
                          value={dispute.reason}
                          onChange={(e) => setDispute((p) => ({ ...p, reason: e.target.value }))}
                          className="w-full h-10 px-3 pr-8 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors appearance-none bg-white"
                        >
                          <option value="">Select a reason</option>
                          {disputeReasons.map((r) => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-semibold text-[#94A3B8] uppercase block mb-1">
                        Description <span className="text-[#DC2626]">*</span>
                      </label>
                      <textarea
                        value={dispute.description}
                        onChange={(e) => setDispute((p) => ({ ...p, description: e.target.value }))}
                        placeholder="Provide detailed description of the dispute"
                        rows={4}
                        maxLength={500}
                        className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors resize-none"
                      />
                      <p className="text-[11px] text-[#94A3B8] mt-1 text-right">{dispute.description.length}/500</p>
                    </div>

                    <div>
                      <label className="text-[10px] font-semibold text-[#94A3B8] uppercase block mb-1">Supporting Documents</label>
                      <div className="flex items-center gap-3 p-3 rounded-xl border border-dashed border-[#CBD5E1] bg-white">
                        <Camera size={16} className="text-[#94A3B8]" />
                        <span className="text-[12px] text-[#94A3B8]">Upload evidence files (images, scanned documents)</span>
                        <button className="ml-auto h-8 px-3 rounded-lg text-[12px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer transition-colors whitespace-nowrap">
                          Browse
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-semibold text-[#94A3B8] uppercase block mb-1">Contact Person</label>
                      <input
                        type="text"
                        value={dispute.contactPerson}
                        onChange={(e) => setDispute((p) => ({ ...p, contactPerson: e.target.value }))}
                        placeholder="Name and contact details"
                        className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-semibold text-[#94A3B8] uppercase block mb-1">Notes</label>
                      <textarea
                        value={dispute.notes}
                        onChange={(e) => setDispute((p) => ({ ...p, notes: e.target.value }))}
                        placeholder="Additional notes or instructions"
                        rows={2}
                        maxLength={500}
                        className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors resize-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleSubmitDispute}
                    className="flex items-center gap-2 h-10 px-5 rounded-xl text-[13px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90 whitespace-nowrap"
                    style={{ backgroundColor: "#DC2626" }}
                  >
                    <MessageSquare size={16} /> Submit Dispute
                  </button>
                  <button
                    onClick={handleCloseDrawer}
                    className="flex items-center gap-2 h-10 px-4 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer transition-colors whitespace-nowrap"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}