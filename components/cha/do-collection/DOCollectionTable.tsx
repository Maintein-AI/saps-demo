"use client";

import { useState } from "react";
import { useToast } from "@/components/ToastContext";
import {
  CheckCircle,
  Clock,
  Truck,
  Ban,
  Eye,
  Download,
  CreditCard,
  Calendar,
  User,
  FileCheck,
  X,
  RefreshCw,
  ArrowRight,
  Save,
  Send,
  FileText,
  AlertTriangle,
  ChevronDown,
} from "lucide-react";

interface DOCollectionItem {
  id: string;
  doNo: string;
  awb: string;
  consignee: string;
  pieces: number;
  chargesStatus: "Paid" | "Unpaid" | "Waived" | "On Credit" | "Disputed";
  driver: string;
  vehicle: string;
  collectionSlot: string;
  status: "DO Ready" | "Driver Assigned" | "Vehicle Assigned" | "Scheduled" | "Collected" | "Cancelled";
  gatePass: string;
  notes: string;
}

const doItems: DOCollectionItem[] = [
  {
    id: "DC-001",
    doNo: "DO-90912",
    awb: "214-77890123",
    consignee: "Gerry's Dnata",
    pieces: 42,
    chargesStatus: "Paid",
    driver: "Ahmed Raza",
    vehicle: "KHI-4582",
    collectionSlot: "01 Jun 2026, 14:00",
    status: "DO Ready",
    gatePass: "",
    notes: "Priority pharma shipment",
  },
  {
    id: "DC-002",
    doNo: "DO-90913",
    awb: "157-66778899",
    consignee: "DB Schenker Pakistan",
    pieces: 24,
    chargesStatus: "Unpaid",
    driver: "Imran Ali",
    vehicle: "BJU-7721",
    collectionSlot: "01 Jun 2026, 15:00",
    status: "Driver Assigned",
    gatePass: "",
    notes: "Awaiting payment clearance",
  },
  {
    id: "DC-003",
    doNo: "DO-90914",
    awb: "074-55443322",
    consignee: "Kuehne+Nagel KHI",
    pieces: 18,
    chargesStatus: "Waived",
    driver: "Kashif Khan",
    vehicle: "KHI-9934",
    collectionSlot: "01 Jun 2026, 16:00",
    status: "Vehicle Assigned",
    gatePass: "",
    notes: "Govt waiver approved",
  },
  {
    id: "DC-004",
    doNo: "DO-90915",
    awb: "117-99887766",
    consignee: "Agility Pakistan",
    pieces: 36,
    chargesStatus: "On Credit",
    driver: "Bilal Ahmed",
    vehicle: "LHE-2217",
    collectionSlot: "02 Jun 2026, 09:00",
    status: "Scheduled",
    gatePass: "GP-2026-00412",
    notes: "Credit account active",
  },
  {
    id: "DC-005",
    doNo: "DO-90916",
    awb: "214-11223344",
    consignee: "Pakistan Cargo Services",
    pieces: 55,
    chargesStatus: "Paid",
    driver: "Nadeem Hussain",
    vehicle: "KHI-9921",
    collectionSlot: "02 Jun 2026, 10:00",
    status: "Scheduled",
    gatePass: "GP-2026-00413",
    notes: "General cargo - urgent",
  },
  {
    id: "DC-006",
    doNo: "DO-90917",
    awb: "074-44556677",
    consignee: "Gerry's Dnata",
    pieces: 12,
    chargesStatus: "Disputed",
    driver: "Rashid Mehmood",
    vehicle: "KHI-7788",
    collectionSlot: "02 Jun 2026, 11:00",
    status: "Collected",
    gatePass: "GP-2026-00414",
    notes: "Dispute raised on demurrage",
  },
  {
    id: "DC-007",
    doNo: "DO-90918",
    awb: "157-22334455",
    consignee: "DB Schenker Pakistan",
    pieces: 30,
    chargesStatus: "Paid",
    driver: "Faisal Qureshi",
    vehicle: "BJU-8834",
    collectionSlot: "02 Jun 2026, 13:00",
    status: "DO Ready",
    gatePass: "",
    notes: "Electronics shipment",
  },
  {
    id: "DC-008",
    doNo: "DO-90919",
    awb: "117-55667788",
    consignee: "Kuehne+Nagel KHI",
    pieces: 22,
    chargesStatus: "Unpaid",
    driver: "",
    vehicle: "",
    collectionSlot: "",
    status: "DO Ready",
    gatePass: "",
    notes: "Awaiting driver assignment",
  },
];

const statusConfig: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  "DO Ready": { bg: "#DCFCE7", text: "#16A34A", icon: <CheckCircle size={12} /> },
  "Driver Assigned": { bg: "#DBEAFE", text: "#1D4ED8", icon: <User size={12} /> },
  "Vehicle Assigned": { bg: "#DBEAFE", text: "#1D4ED8", icon: <Truck size={12} /> },
  Scheduled: { bg: "#FEF3C7", text: "#D97706", icon: <Calendar size={12} /> },
  Collected: { bg: "#F1F5F9", text: "#64748B", icon: <FileCheck size={12} /> },
  Cancelled: { bg: "#FEE2E2", text: "#DC2626", icon: <Ban size={12} /> },
};

const chargesConfig: Record<string, { bg: string; text: string }> = {
  Paid: { bg: "#DCFCE7", text: "#16A34A" },
  Unpaid: { bg: "#FEE2E2", text: "#DC2626" },
  Waived: { bg: "#FEF3C7", text: "#D97706" },
  "On Credit": { bg: "#DBEAFE", text: "#1D4ED8" },
  Disputed: { bg: "#F1F5F9", text: "#64748B" },
};

const driverOptions = [
  "Ahmed Raza",
  "Imran Ali",
  "Kashif Khan",
  "Bilal Ahmed",
  "Nadeem Hussain",
  "Rashid Mehmood",
  "Faisal Qureshi",
  "Tariq Jameel",
];

const vehicleOptions = [
  "KHI-4582",
  "BJU-7721",
  "KHI-9934",
  "LHE-2217",
  "KHI-9921",
  "KHI-7788",
  "BJU-8834",
  "KHI-5543",
];

export default function DOCollectionTable() {
  const { addToast } = useToast();
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [items, setItems] = useState<DOCollectionItem[]>(doItems);

  const [assignment, setAssignment] = useState({
    driver: "",
    vehicle: "",
    collectionDate: "",
    collectionTime: "",
    notes: "",
  });

  const [driverDropdown, setDriverDropdown] = useState(false);
  const [vehicleDropdown, setVehicleDropdown] = useState(false);

  const handleRetry = () => {
    setLoading(true);
    setError(false);
    setTimeout(() => {
      setLoading(false);
      setItems(doItems);
      addToast("DO collection updated.", "success");
    }, 1500);
  };

  const activeItem = items.find((t) => t.id === selectedItem);

  const handleAssignDriver = () => {
    if (!assignment.driver.trim()) {
      addToast("Please select a driver.", "error");
      return;
    }
    addToast(`Driver ${assignment.driver} assigned.`, "success");
    setItems((prev) =>
      prev.map((i) =>
        i.id === selectedItem
          ? { ...i, driver: assignment.driver, status: "Driver Assigned" as const }
          : i
      )
    );
  };

  const handleAssignVehicle = () => {
    if (!assignment.vehicle.trim()) {
      addToast("Please select a vehicle.", "error");
      return;
    }
    addToast(`Vehicle ${assignment.vehicle} assigned.`, "success");
    setItems((prev) =>
      prev.map((i) =>
        i.id === selectedItem
          ? { ...i, vehicle: assignment.vehicle, status: "Vehicle Assigned" as const }
          : i
      )
    );
  };

  const handleConfirmCollection = () => {
    if (!assignment.collectionDate || !assignment.collectionTime) {
      addToast("Please select collection date and time.", "error");
      return;
    }
    addToast("Collection confirmed and scheduled.", "success");
    setItems((prev) =>
      prev.map((i) =>
        i.id === selectedItem
          ? {
              ...i,
              collectionSlot: `${assignment.collectionDate}, ${assignment.collectionTime}`,
              status: "Scheduled" as const,
            }
          : i
      )
    );
    setAssignment({ driver: "", vehicle: "", collectionDate: "", collectionTime: "", notes: "" });
  };

  const handleDownloadDO = () => {
    addToast("DO PDF downloaded.", "success");
  };

  const handleViewPayment = () => {
    addToast("Payment status opened.", "success");
  };

  const handleSchedulePickup = () => {
    addToast("Pickup schedule dialog opened.", "success");
  };

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2">
          <h2 className="text-[15px] font-bold text-[#0F172A]">DO Collection Queue</h2>
        </div>
        <span className="text-[12px] text-[#64748B]">{items.length} DOs</span>
      </div>

      <div className="p-5">
        {error && (
          <div className="flex items-center gap-3 mb-4 p-4 rounded-xl bg-[#FEE2E2] border border-[#FCA5A5]">
            <AlertTriangle size={16} className="text-[#DC2626]" />
            <span className="text-[13px] font-semibold text-[#DC2626]">Failed to load DO collection data. Please try again.</span>
            <button
              onClick={handleRetry}
              className="flex items-center gap-2 h-8 px-3 rounded-lg text-[12px] font-semibold bg-[#DC2626] text-white hover:opacity-90 cursor-pointer transition-opacity"
            >
              <RefreshCw size={14} />
              Retry
            </button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left">
            <thead>
              <tr className="border-b border-[#E2E8F0]">
                <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">DO #</th>
                <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">AWB #</th>
                <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Consignee</th>
                <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Pieces</th>
                <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Charges Status</th>
                <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Driver</th>
                <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Vehicle</th>
                <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Collection Slot</th>
                <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Status</th>
                <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-[#F1F5F9]">
                    {Array.from({ length: 10 }).map((_, j) => (
                      <td key={j} className="py-3 px-3">
                        <div className="h-4 bg-[#F1F5F9] rounded animate-pulse" style={{ width: j === 0 ? "70px" : j === 1 ? "90px" : j === 2 ? "110px" : j === 3 ? "40px" : j === 7 ? "90px" : j === 8 ? "80px" : "60px" }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[#F1F5F9] flex items-center justify-center">
                        <FileCheck size={24} className="text-[#94A3B8]" />
                      </div>
                      <p className="text-[13px] font-semibold text-[#64748B]">No DOs ready for collection.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                items.map((item) => {
                  const sc = statusConfig[item.status];
                  const cc = chargesConfig[item.chargesStatus];
                  return (
                    <tr
                      key={item.id}
                      className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                      onClick={() => setSelectedItem(selectedItem === item.id ? null : item.id)}
                    >
                      <td className="py-3 px-3 text-[12px] font-semibold text-[#0F172A] font-mono">{item.doNo}</td>
                      <td className="py-3 px-3 text-[12px] font-mono text-[#1B4F8B]">{item.awb}</td>
                      <td className="py-3 px-3 text-[12px] text-[#64748B]">{item.consignee}</td>
                      <td className="py-3 px-3 text-[12px] font-bold text-[#0F172A]">{item.pieces}</td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center h-5 px-2 rounded-full text-[11px] font-semibold" style={{ backgroundColor: cc.bg, color: cc.text }}>
                          {item.chargesStatus}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-[12px] text-[#0F172A]">{item.driver || "—"}</td>
                      <td className="py-3 px-3 text-[12px] font-mono text-[#64748B]">{item.vehicle || "—"}</td>
                      <td className="py-3 px-3 text-[12px] text-[#64748B]">{item.collectionSlot || "—"}</td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center gap-1 h-5 px-2 rounded-full text-[11px] font-semibold" style={{ backgroundColor: sc.bg, color: sc.text }}>
                          {sc.icon}
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => { e.stopPropagation(); setSelectedItem(item.id); }}
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors"
                            title="View Detail"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); addToast(`DO ${item.doNo} downloaded.`, "success"); }}
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors"
                            title="Download DO"
                          >
                            <Download size={14} />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); addToast(`Payment status for ${item.doNo} opened.`, "success"); }}
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors"
                            title="View Payment Status"
                          >
                            <CreditCard size={14} />
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

        {activeItem && (
          <div className="mt-5 p-5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Truck size={16} className="text-[#1B4F8B]" />
                <h3 className="text-[13px] font-bold text-[#0F172A]">Assign DO Collection</h3>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#E2E8F0] text-[#64748B] cursor-pointer transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">DO #</label>
                <input type="text" value={activeItem.doNo} readOnly className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] bg-[#F1F5F9]" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">AWB #</label>
                <input type="text" value={activeItem.awb} readOnly className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] bg-[#F1F5F9]" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">Current Status</label>
                <span className="inline-flex items-center gap-1 h-9 px-3 rounded-lg text-[12px] font-semibold" style={{ backgroundColor: statusConfig[activeItem.status].bg, color: statusConfig[activeItem.status].text }}>
                  {statusConfig[activeItem.status].icon}
                  {activeItem.status}
                </span>
              </div>

              <div className="relative">
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">Driver</label>
                <div className="relative">
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" />
                  <input
                    type="text"
                    value={assignment.driver || activeItem.driver}
                    onChange={(e) => { setAssignment((p) => ({ ...p, driver: e.target.value })); setDriverDropdown(true); }}
                    onFocus={() => setDriverDropdown(true)}
                    onBlur={() => setTimeout(() => setDriverDropdown(false), 200)}
                    placeholder="Select driver"
                    className="w-full h-10 pl-3 pr-8 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors bg-white"
                  />
                  {driverDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E2E8F0] rounded-xl shadow-lg z-20 max-h-48 overflow-y-auto">
                      {driverOptions
                        .filter((d) => d.toLowerCase().includes(assignment.driver.toLowerCase()) || d.toLowerCase().includes(activeItem.driver.toLowerCase()))
                        .map((d) => (
                          <button
                            key={d}
                            onMouseDown={() => { setAssignment((p) => ({ ...p, driver: d })); setDriverDropdown(false); }}
                            className="w-full text-left px-4 py-2 hover:bg-[#F8FAFC] transition-colors text-[13px] text-[#0F172A]"
                          >
                            {d}
                          </button>
                        ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="relative">
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">Vehicle</label>
                <div className="relative">
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" />
                  <input
                    type="text"
                    value={assignment.vehicle || activeItem.vehicle}
                    onChange={(e) => { setAssignment((p) => ({ ...p, vehicle: e.target.value })); setVehicleDropdown(true); }}
                    onFocus={() => setVehicleDropdown(true)}
                    onBlur={() => setTimeout(() => setVehicleDropdown(false), 200)}
                    placeholder="Select vehicle"
                    className="w-full h-10 pl-3 pr-8 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors bg-white"
                  />
                  {vehicleDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E2E8F0] rounded-xl shadow-lg z-20 max-h-48 overflow-y-auto">
                      {vehicleOptions
                        .filter((v) => v.toLowerCase().includes(assignment.vehicle.toLowerCase()) || v.toLowerCase().includes(activeItem.vehicle.toLowerCase()))
                        .map((v) => (
                          <button
                            key={v}
                            onMouseDown={() => { setAssignment((p) => ({ ...p, vehicle: v })); setVehicleDropdown(false); }}
                            className="w-full text-left px-4 py-2 hover:bg-[#F8FAFC] transition-colors text-[13px] text-[#0F172A]"
                          >
                            {v}
                          </button>
                        ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">Collection Date</label>
                <input
                  type="date"
                  value={assignment.collectionDate}
                  onChange={(e) => setAssignment((p) => ({ ...p, collectionDate: e.target.value }))}
                  className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">Collection Time</label>
                <input
                  type="time"
                  value={assignment.collectionTime}
                  onChange={(e) => setAssignment((p) => ({ ...p, collectionTime: e.target.value }))}
                  className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors"
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">Notes</label>
                <textarea
                  value={assignment.notes || activeItem.notes}
                  onChange={(e) => setAssignment((p) => ({ ...p, notes: e.target.value }))}
                  placeholder="Enter collection notes"
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors resize-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-[#E2E8F0]">
              <button
                onClick={handleAssignDriver}
                className="flex items-center gap-2 h-9 px-4 rounded-xl text-[13px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90"
                style={{ backgroundColor: "#0B2545" }}
              >
                <User size={14} />
                Assign Driver
              </button>
              <button
                onClick={handleAssignVehicle}
                className="flex items-center gap-2 h-9 px-4 rounded-xl text-[13px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90"
                style={{ backgroundColor: "#0B2545" }}
              >
                <Truck size={14} />
                Assign Vehicle
              </button>
              <button
                onClick={handleConfirmCollection}
                className="flex items-center gap-2 h-9 px-4 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] cursor-pointer transition-colors hover:bg-[#F8FAFC]"
              >
                <CheckCircle size={14} />
                Confirm Collection
              </button>
              <button
                onClick={handleDownloadDO}
                className="flex items-center gap-2 h-9 px-4 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] cursor-pointer transition-colors hover:bg-[#F8FAFC]"
              >
                <Download size={14} />
                Download DO
              </button>
              <button
                onClick={handleViewPayment}
                className="flex items-center gap-2 h-9 px-4 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] cursor-pointer transition-colors hover:bg-[#F8FAFC]"
              >
                <CreditCard size={14} />
                View Payment Status
              </button>
              <button
                onClick={handleSchedulePickup}
                className="flex items-center gap-2 h-9 px-4 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] cursor-pointer transition-colors hover:bg-[#F8FAFC]"
              >
                <Calendar size={14} />
                Schedule Pickup
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}