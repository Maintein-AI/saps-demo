"use client";

import { useState } from "react";
import { Package, ScanLine, CheckCircle2 } from "lucide-react";
import StatusBadge from "../../StatusBadge";

interface PieceDetailCardProps {
  scanState: string;
  scannedData: any;
}

export default function PieceDetailCard({ scanState, scannedData }: PieceDetailCardProps) {
  const [expanded, setExpanded] = useState(true);

  if (scanState !== "matched" || !scannedData) {
    return (
      <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-2.5">
            <h2 className="text-[16px] font-bold text-[#0F172A]">Piece Details</h2>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#F1F5F9] flex items-center justify-center mb-3">
            <Package size={28} className="text-[#94A3B8]" />
          </div>
          <p className="text-[14px] text-[#64748B]">Scan an RFID tag to view piece details</p>
        </div>
      </div>
    );
  }

  const detailFields = [
    { label: "AWB #", value: scannedData.awb },
    { label: "Piece ID", value: scannedData.pieceId },
    { label: "RFID EPC", value: scannedData.rfid },
    { label: "Weight", value: scannedData.weight },
    { label: "Cargo Class", value: scannedData.cargoClass },
    { label: "Handling Code", value: scannedData.handlingCode },
    { label: "Current State", value: scannedData.currentState },
    { label: "Last Movement", value: scannedData.lastMovement },
    { label: "Assigned Task", value: scannedData.assignedTask },
    { label: "Storage Location", value: scannedData.storageLocation },
  ];

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2.5">
          <h2 className="text-[16px] font-bold text-[#0F172A]">Piece Details</h2>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={scannedData.currentState} />
          <CheckCircle2 size={18} className="text-[#16A34A]" />
        </div>
      </div>
      <div className="p-5">
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          {detailFields.map((field) => (
            <div key={field.label}>
              <p className="text-[11px] text-[#94A3B8] uppercase font-semibold tracking-wider mb-1">
                {field.label}
              </p>
              <p className={`text-[14px] font-semibold ${field.label === "RFID EPC" ? "font-mono text-[#64748B] text-[12px] break-all" : "text-[#0F172A]"}`}>
                {field.value || "—"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}