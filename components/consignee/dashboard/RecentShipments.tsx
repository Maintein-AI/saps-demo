"use client";

import { useState } from "react";
import ScopeBadge from "@/components/ScopeBadge";
import { Eye, Download, CreditCard, Truck, FileText } from "lucide-react";

const shipments = [
  { awb: "117-23456789", carrier: "Emirates SkyCargo", flight: "EK-604", arrival: "08 Jun 2026", pieces: 24, weight: "1,234 kg", status: "Customs" },
  { awb: "117-23456812", carrier: "Qatar Airways Cargo", flight: "QR-630", arrival: "07 Jun 2026", pieces: 18, weight: "876 kg", status: "OOC" },
  { awb: "117-23456755", carrier: "Turkish Cargo", flight: "TK-708", arrival: "06 Jun 2026", pieces: 42, weight: "2,110 kg", status: "DO Ready" },
  { awb: "117-23456890", carrier: "Etihad Cargo", flight: "EY-241", arrival: "05 Jun 2026", pieces: 12, weight: "640 kg", status: "Picked" },
  { awb: "117-23456901", carrier: "Saudia Cargo", flight: "SV-732", arrival: "04 Jun 2026", pieces: 8, weight: "320 kg", status: "Delivered" },
  { awb: "117-23456955", carrier: "Emirates SkyCargo", flight: "EK-606", arrival: "03 Jun 2026", pieces: 31, weight: "1,540 kg", status: "Arrived" },
  { awb: "117-23457001", carrier: "Qatar Airways Cargo", flight: "QR-632", arrival: "02 Jun 2026", pieces: 15, weight: "750 kg", status: "Delivered" },
];

const statusColors: Record<string, string> = {
  Arrived: "#1B4F8B",
  Customs: "#D97706",
  OOC: "#DC2626",
  "DO Ready": "#16A34A",
  Picked: "#0EA5E9",
  Delivered: "#059669",
};

interface RecentShipmentsProps {
  onViewShipment: (s: typeof shipments[0]) => void;
  onPayCharges: (s: typeof shipments[0]) => void;
  onDownloadDO: (s: typeof shipments[0]) => void;
  onSchedulePickup: (s: typeof shipments[0]) => void;
  onViewPOD: (s: typeof shipments[0]) => void;
}

export default function RecentShipments({
  onViewShipment,
  onPayCharges,
  onDownloadDO,
  onSchedulePickup,
  onViewPOD,
}: RecentShipmentsProps) {
  const [actionOpenRow, setActionOpenRow] = useState<number | null>(null);

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[16px] font-bold text-[#0F172A]">Recent Shipments</h3>
        <ScopeBadge type="exc" />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px]">
          <thead>
            <tr className="border-b border-[#E2E8F0]">
              <th className="text-left text-[11px] font-bold uppercase tracking-wider text-[#64748B] px-3 py-2">AWB #</th>
              <th className="text-left text-[11px] font-bold uppercase tracking-wider text-[#64748B] px-3 py-2">Carrier</th>
              <th className="text-left text-[11px] font-bold uppercase tracking-wider text-[#64748B] px-3 py-2">Flight</th>
              <th className="text-left text-[11px] font-bold uppercase tracking-wider text-[#64748B] px-3 py-2">Arrival</th>
              <th className="text-left text-[11px] font-bold uppercase tracking-wider text-[#64748B] px-3 py-2">Pieces</th>
              <th className="text-left text-[11px] font-bold uppercase tracking-wider text-[#64748B] px-3 py-2">Weight</th>
              <th className="text-left text-[11px] font-bold uppercase tracking-wider text-[#64748B] px-3 py-2">Status</th>
              <th className="text-left text-[11px] font-bold uppercase tracking-wider text-[#64748B] px-3 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {shipments.map((s, i) => (
              <tr key={i} className="border-b border-[#E2E8F0] last:border-b-0 hover:bg-[#F8FAFC] transition-colors">
                <td className="px-3 py-3 text-[13px] font-medium text-[#0F172A]">{s.awb}</td>
                <td className="px-3 py-3 text-[13px] text-[#334155]">{s.carrier}</td>
                <td className="px-3 py-3 text-[13px] text-[#334155]">{s.flight}</td>
                <td className="px-3 py-3 text-[13px] text-[#334155]">{s.arrival}</td>
                <td className="px-3 py-3 text-[13px] text-[#334155]">{s.pieces}</td>
                <td className="px-3 py-3 text-[13px] text-[#334155]">{s.weight}</td>
                <td className="px-3 py-3">
                  <span
                    className="inline-flex items-center h-[22px] px-2 rounded-full text-[11px] font-bold"
                    style={{ backgroundColor: `${statusColors[s.status]}15`, color: statusColors[s.status] }}
                  >
                    {s.status}
                  </span>
                </td>
                <td className="px-3 py-3 relative">
                  <button
                    onClick={() => setActionOpenRow(actionOpenRow === i ? null : i)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F1F5F9] text-[#64748B] cursor-pointer transition-colors"
                  >
                    <Eye size={14} />
                  </button>
                  {actionOpenRow === i && (
                    <div className="absolute right-0 top-10 z-10 w-[180px] bg-white rounded-xl shadow-lg border border-[#E2E8F0] overflow-hidden">
                      <button
                        onClick={() => { onViewShipment(s); setActionOpenRow(null); }}
                        className="w-full flex items-center gap-2 px-3 py-2.5 text-[13px] text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer transition-colors"
                      >
                        <Eye size={14} /> View Shipment
                      </button>
                      <button
                        onClick={() => { onPayCharges(s); setActionOpenRow(null); }}
                        className="w-full flex items-center gap-2 px-3 py-2.5 text-[13px] text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer transition-colors"
                      >
                        <CreditCard size={14} /> Pay Charges
                      </button>
                      <button
                        onClick={() => { onDownloadDO(s); setActionOpenRow(null); }}
                        className="w-full flex items-center gap-2 px-3 py-2.5 text-[13px] text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer transition-colors"
                      >
                        <Download size={14} /> Download DO
                      </button>
                      <button
                        onClick={() => { onSchedulePickup(s); setActionOpenRow(null); }}
                        className="w-full flex items-center gap-2 px-3 py-2.5 text-[13px] text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer transition-colors"
                      >
                        <Truck size={14} /> Schedule Pickup
                      </button>
                      <button
                        onClick={() => { onViewPOD(s); setActionOpenRow(null); }}
                        className="w-full flex items-center gap-2 px-3 py-2.5 text-[13px] text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer transition-colors"
                      >
                        <FileText size={14} /> View POD
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}