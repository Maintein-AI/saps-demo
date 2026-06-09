"use client";

import ScopeBadge from "@/components/ScopeBadge";
import { MapPin, CheckCircle, XCircle, Thermometer, Truck, Package } from "lucide-react";

interface SuggestedLocationProps {
  scanState: "waiting" | "matched" | "unknown" | "duplicate" | "wrong_class" | "full" | "scanning";
  scannedData: any;
}

export default function SuggestedLocation({ scanState, scannedData }: SuggestedLocationProps) {
  if (scanState === "waiting" || scanState === "unknown" || scanState === "duplicate" || scanState === "scanning") {
    return (
      <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-[16px] font-semibold text-[#0F172A]">
            Suggested Location Details
          </h2>
          <ScopeBadge type="inc" />
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#F1F5F9] flex items-center justify-center mb-3">
            <MapPin size={28} className="text-[#94A3B8]" />
          </div>
          <p className="text-[14px] font-semibold text-[#0F172A] mb-1">
            Location details will appear after scan
          </p>
          <p className="text-[12px] text-[#64748B] max-w-[260px]">
            Scan a piece RFID tag to see the suggested storage location.
          </p>
        </div>
      </div>
    );
  }

  const data = scannedData;
  if (!data) return null;

  const isError = scanState === "wrong_class" || scanState === "full";

  const detailRows = [
    { label: "Rack ID", value: data.rack || "—" },
    { label: "Row", value: data.row || "—" },
    { label: "Level", value: data.level || "—" },
    { label: "Bin", value: data.bin || "—" },
    { label: "Zone", value: data.zone || "—" },
    { label: "Occupancy", value: data.occupancy || "—" },
    { label: "Nearest Aisle", value: data.nearestAisle || "—" },
    { label: "Last Stored AWB", value: data.lastStoredAwb || "—" },
    { label: "Cold Chain", value: data.coldChain || "—" },
  ];

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-[16px] font-semibold text-[#0F172A]">
          Suggested Location Details
        </h2>
        <ScopeBadge type="inc" />
      </div>

      {/* Location Header */}
      <div className="flex items-center gap-3 mb-5 p-3 rounded-[12px] border border-[#E2E8F0] bg-[#F8FAFC]">
        <div className="w-10 h-10 rounded-lg bg-[#1B4F8B]/10 flex items-center justify-center">
          <MapPin size={20} className="text-[#1B4F8B]" />
        </div>
        <div>
          <p className="text-[16px] font-bold text-[#0F172A]">
            {data.suggestedLocation || "—"}
          </p>
          <p className="text-[12px] text-[#64748B]">
            {data.zone || "—"} Zone
          </p>
        </div>
      </div>

      {/* Compatibility Badges */}
      <div className="flex flex-col gap-3 mb-5">
        <h4 className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider">
          Compatibility Checks
        </h4>
        <div className="grid grid-cols-1 gap-2">
          <div className="flex items-center gap-2 h-8 px-3 rounded-lg border border-[#E2E8F0]">
            <Package size={14} className={data.cargoClassCompatible ? "text-[#16A34A]" : "text-[#DC2626]"} />
            <span className="text-[12px] font-medium text-[#0F172A] flex-1">Cargo Class</span>
            <span className="text-[12px] font-semibold" style={{ color: data.cargoClassCompatible ? "#16A34A" : "#DC2626" }}>
              {data.cargoClassCompatible ? "Compatible" : "Incompatible"}
            </span>
            {data.cargoClassCompatible ? <CheckCircle size={14} className="text-[#16A34A]" /> : <XCircle size={14} className="text-[#DC2626]" />}
          </div>
          <div className="flex items-center gap-2 h-8 px-3 rounded-lg border border-[#E2E8F0]">
            <Truck size={14} className={data.weightCompatible ? "text-[#16A34A]" : "text-[#DC2626]"} />
            <span className="text-[12px] font-medium text-[#0F172A] flex-1">Weight</span>
            <span className="text-[12px] font-semibold" style={{ color: data.weightCompatible ? "#16A34A" : "#DC2626" }}>
              {data.weightCompatible ? "Compatible" : "Incompatible"}
            </span>
            {data.weightCompatible ? <CheckCircle size={14} className="text-[#16A34A]" /> : <XCircle size={14} className="text-[#DC2626]" />}
          </div>
          <div className="flex items-center gap-2 h-8 px-3 rounded-lg border border-[#E2E8F0]">
            <Package size={14} className={data.handlingCompatible ? "text-[#16A34A]" : "text-[#DC2626]"} />
            <span className="text-[12px] font-medium text-[#0F172A] flex-1">Handling Code</span>
            <span className="text-[12px] font-semibold" style={{ color: data.handlingCompatible ? "#16A34A" : "#DC2626" }}>
              {data.handlingCompatible ? "Compatible" : "Incompatible"}
            </span>
            {data.handlingCompatible ? <CheckCircle size={14} className="text-[#16A34A]" /> : <XCircle size={14} className="text-[#DC2626]" />}
          </div>
          <div className="flex items-center gap-2 h-8 px-3 rounded-lg border border-[#E2E8F0]">
            <Thermometer size={14} className="text-[#64748B]" />
            <span className="text-[12px] font-medium text-[#0F172A] flex-1">Cold Chain</span>
            <span className="text-[12px] font-semibold text-[#64748B]">
              {data.coldChain === "N/A" ? "Not Required" : data.coldChain}
            </span>
            <CheckCircle size={14} className="text-[#16A34A]" />
          </div>
        </div>
      </div>

      {/* Location Details */}
      <div className="space-y-0">
        <h4 className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider mb-3">
          Location Details
        </h4>
        {detailRows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between py-2.5 border-b border-[#E2E8F0] last:border-b-0"
          >
            <span className="text-[13px] text-[#64748B]">{row.label}</span>
            <span className="text-[13px] font-semibold text-[#0F172A]">{row.value}</span>
          </div>
        ))}
      </div>

      {/* Error Alert */}
      {isError && (
        <div className="mt-4 p-3 rounded-[12px] border border-[#DC2626]/20 bg-[#DC2626]/5">
          <div className="flex items-center gap-2">
            <XCircle size={14} className="text-[#DC2626]" />
            <span className="text-[12px] font-semibold text-[#DC2626]">
              {scanState === "wrong_class" ? "Cargo class mismatch" : "Location at capacity"}
            </span>
          </div>
          <p className="text-[12px] text-[#64748B] mt-1">
            {scanState === "wrong_class"
              ? "Use override location to select a compatible rack."
              : "Use override location to select a rack with available space."}
          </p>
        </div>
      )}
    </div>
  );
}