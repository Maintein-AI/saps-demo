import { Package, Plane, Weight, Hash, Clock, Tag } from "lucide-react";
import ScopeBadge from "@/components/ScopeBadge";

interface AWBData {
  awb: string;
  consignee: string;
  carrier: string;
  flight: string;
  cargoClass: string;
  pieces: number;
  weight: string;
  status: string;
}

interface AWBSummaryPanelProps {
  awb: AWBData | null;
}

export default function AWBSummaryPanel({ awb }: AWBSummaryPanelProps) {
  if (!awb) {
    return (
      <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-5">
          <h3 className="text-[15px] font-bold text-[#0F172A]">AWB Summary</h3>
          <ScopeBadge type="exc" />
        </div>
        <div className="text-center py-8">
          <div className="w-12 h-12 rounded-xl bg-[#F1F5F9] flex items-center justify-center mx-auto mb-3">
            <Package size={24} className="text-[#94A3B8]" />
          </div>
          <p className="text-[13px] text-[#94A3B8]">Select an AWB to view summary</p>
        </div>
      </div>
    );
  }

  const rows = [
    { label: "AWB #", value: awb.awb, icon: <Tag size={14} /> },
    { label: "HAWB #", value: "HAWB-2026-08912", icon: <Tag size={14} /> },
    { label: "Consignee", value: awb.consignee, icon: <Package size={14} /> },
    { label: "Carrier", value: awb.carrier, icon: <Plane size={14} /> },
    { label: "Flight", value: awb.flight, icon: <Plane size={14} /> },
    { label: "Cargo Class", value: awb.cargoClass, icon: <Tag size={14} /> },
    { label: "Pieces", value: awb.pieces.toString(), icon: <Hash size={14} /> },
    { label: "Weight", value: awb.weight, icon: <Weight size={14} /> },
    { label: "Current SAPS Status", value: awb.status, icon: <Clock size={14} /> },
  ];

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <h3 className="text-[15px] font-bold text-[#0F172A]">AWB Summary</h3>
          <ScopeBadge type="exc" />
        </div>
        <span className="inline-flex items-center gap-1 h-5 px-2 rounded-full text-[11px] font-semibold bg-[#EBF0F7] text-[#1B4F8B]">
          {awb.awb}
        </span>
      </div>

      <div className="space-y-3">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between p-3 rounded-xl border border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors"
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#F1F5F9] flex items-center justify-center text-[#64748B]">
                {row.icon}
              </div>
              <span className="text-[12px] font-medium text-[#64748B]">{row.label}</span>
            </div>
            <span className="text-[12px] font-semibold text-[#0F172A]">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}