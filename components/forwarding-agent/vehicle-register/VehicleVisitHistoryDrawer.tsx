"use client";

import { X, Clock, Shield, Ban, AlertTriangle, Truck } from "lucide-react";
import { useEffect } from "react";

interface Visit {
  visitDate: string;
  driver: string;
  awb: string;
  do: string;
  entryTime: string;
  exitTime: string;
  gateStatus: string;
  remarks: string;
}

interface Vehicle {
  id: string;
  plate: string;
  type: string;
}

interface VehicleVisitHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle?: Vehicle;
}

const visits: Visit[] = [
  { visitDate: "01 Jun 2026", driver: "Ahmed Raza", awb: "214-45678901", do: "DO-90871", entryTime: "13:45", exitTime: "15:20", gateStatus: "Approved", remarks: "Cold chain cargo, no issues" },
  { visitDate: "28 May 2026", driver: "Imran Ali", awb: "157-90811223", do: "DO-90872", entryTime: "10:15", exitTime: "11:50", gateStatus: "Approved", remarks: "Standard pickup" },
  { visitDate: "22 May 2026", driver: "Kashif Khan", awb: "074-88219033", do: "DO-90873", entryTime: "09:30", exitTime: "11:10", gateStatus: "Approved", remarks: "DGR inspection passed" },
  { visitDate: "15 May 2026", driver: "Bilal Ahmed", awb: "117-55443321", do: "DO-90874", entryTime: "14:00", exitTime: "16:30", gateStatus: "Delayed", remarks: "Customs hold extended" },
  { visitDate: "08 May 2026", driver: "Ahmed Raza", awb: "117-98765432", do: "DO-90875", entryTime: "08:45", exitTime: "10:20", gateStatus: "Approved", remarks: "Quick turnaround" },
  { visitDate: "01 May 2026", driver: "Ahmed Raza", awb: "214-99887766", do: "DO-90877", entryTime: "11:30", exitTime: "13:00", gateStatus: "Approved", remarks: "VIP cargo handled" },
  { visitDate: "24 Apr 2026", driver: "Faisal Khan", awb: "117-44556677", do: "DO-90878", entryTime: "16:00", exitTime: "17:45", gateStatus: "Approved", remarks: "Routine pickup" },
  { visitDate: "17 Apr 2026", driver: "Javed Iqbal", awb: "074-55667788", do: "DO-90879", entryTime: "07:30", exitTime: "09:00", gateStatus: "Rejected", remarks: "Authority letter expired" },
];

const gateStatusConfig: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  Approved: { bg: "#DCFCE7", text: "#16A34A", icon: <Shield size={12} /> },
  Delayed: { bg: "#FEF3C7", text: "#D97706", icon: <Clock size={12} /> },
  Rejected: { bg: "#FEE2E2", text: "#DC2626", icon: <Ban size={12} /> },
};

export default function VehicleVisitHistoryDrawer({ isOpen, onClose, vehicle }: VehicleVisitHistoryDrawerProps) {
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
          maxWidth: 480,
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
        }}
      >
        <div className="flex items-center justify-between px-5 h-[64px] border-b border-[#E2E8F0] flex-shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="text-[16px] font-bold text-[#0F172A]">Vehicle Visit History</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-5 py-3 border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#EBF0F7] flex items-center justify-center">
              <Truck size={18} className="text-[#1B4F8B]" />
            </div>
            <div>
              <p className="text-[14px] font-bold text-[#0F172A]">{vehicle?.plate || "Select a vehicle"}</p>
              <p className="text-[12px] text-[#64748B]">{vehicle?.type || ""}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left">
              <thead>
                <tr className="border-b border-[#E2E8F0]">
                  <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Visit Date</th>
                  <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Driver</th>
                  <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">AWB #</th>
                  <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">DO #</th>
                  <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Entry</th>
                  <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Exit</th>
                  <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Gate Status</th>
                  <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {visits.map((visit, i) => {
                  const sc = gateStatusConfig[visit.gateStatus] || gateStatusConfig["Delayed"];
                  return (
                    <tr key={i} className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors">
                      <td className="py-3 px-3 text-[12px] text-[#64748B]">{visit.visitDate}</td>
                      <td className="py-3 px-3 text-[12px] text-[#0F172A]">{visit.driver}</td>
                      <td className="py-3 px-3 text-[12px] font-semibold text-[#1B4F8B]">{visit.awb}</td>
                      <td className="py-3 px-3 text-[12px] text-[#0F172A]">{visit.do}</td>
                      <td className="py-3 px-3 text-[12px] text-[#0F172A]">{visit.entryTime}</td>
                      <td className="py-3 px-3 text-[12px] text-[#0F172A]">{visit.exitTime}</td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center gap-1 h-5 px-2 rounded-full text-[11px] font-semibold" style={{ backgroundColor: sc.bg, color: sc.text }}>
                          {sc.icon}
                          {visit.gateStatus}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-[12px] text-[#64748B] max-w-[180px] truncate">{visit.remarks}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}