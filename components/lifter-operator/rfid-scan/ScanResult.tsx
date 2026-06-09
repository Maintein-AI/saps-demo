"use client";

import { useState } from "react";
import { Scan, Check, AlertTriangle, AlertCircle, X, ArrowRight, RefreshCw, CheckCircle2, Clock, Battery, Wifi, Signal, Bluetooth, Smartphone } from "lucide-react";
import ScopeBadge from "../../ScopeBadge";
import StatusBadge from "../../StatusBadge";
import { useToast } from "../../ToastContext";

interface ScanResultProps {
  scanState: string;
  setScanState: (s: string) => void;
  scannedData: any;
  setScannedData: (d: any) => void;
  onConfirm: () => void;
  onRescan: () => void;
}

export default function ScanResult({ scanState, scannedData, onConfirm, onRescan }: ScanResultProps) {
  const { addToast } = useToast();

  const handleReportUnknown = () => {
    addToast("Unknown tag reported to warehouse manager", "success");
  };

  const handleAttachToTask = () => {
    addToast("Piece attached to active task T-2026-0041", "success");
  };

  if (scanState === "waiting") {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="w-20 h-20 rounded-2xl bg-[#F1F5F9] flex items-center justify-center mb-4">
          <Scan size={36} className="text-[#94A3B8]" />
        </div>
        <h3 className="text-[18px] font-bold text-[#0F172A] mb-2">Scan an RFID tag</h3>
        <p className="text-[14px] text-[#64748B] max-w-[280px]">
          Point the handheld reader at the RFID tag to verify the piece
        </p>
      </div>
    );
  }

  if (scanState === "matched") {
    return (
      <div className="flex flex-col items-center py-6 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-[#DCFCE7] flex items-center justify-center mb-3">
          <CheckCircle2 size={32} className="text-[#16A34A]" />
        </div>
        <h3 className="text-[18px] font-bold text-[#16A34A] mb-1">RFID matched successfully</h3>
        <p className="text-[13px] text-[#64748B] mb-4">Piece verified and ready for next step</p>

        <div className="w-full text-left bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] p-4 mb-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[11px] text-[#94A3B8] uppercase font-semibold tracking-wider">AWB #</p>
              <p className="text-[14px] font-semibold text-[#0F172A]">{scannedData.awb}</p>
            </div>
            <div>
              <p className="text-[11px] text-[#94A3B8] uppercase font-semibold tracking-wider">Piece ID</p>
              <p className="text-[14px] font-semibold text-[#0F172A]">{scannedData.pieceId}</p>
            </div>
            <div>
              <p className="text-[11px] text-[#94A3B8] uppercase font-semibold tracking-wider">RFID EPC</p>
              <p className="text-[12px] font-mono text-[#64748B] break-all">{scannedData.rfid}</p>
            </div>
            <div>
              <p className="text-[11px] text-[#94A3B8] uppercase font-semibold tracking-wider">Weight</p>
              <p className="text-[14px] font-semibold text-[#0F172A]">{scannedData.weight}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col w-full gap-2">
          <button
            onClick={onConfirm}
            className="w-full h-12 rounded-xl text-[14px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90 whitespace-nowrap"
            style={{ backgroundColor: "#0B2545" }}
          >
            <span className="flex items-center justify-center gap-2">
              <Check size={18} />
              Confirm Scan
            </span>
          </button>
          <div className="flex gap-2">
            <button
              onClick={onRescan}
              className="flex-1 h-12 rounded-xl text-[14px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer transition-colors whitespace-nowrap"
            >
              <span className="flex items-center justify-center gap-2">
                <RefreshCw size={16} />
                Re-scan
              </span>
            </button>
            <button
              onClick={handleAttachToTask}
              className="flex-1 h-12 rounded-xl text-[14px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer transition-colors whitespace-nowrap"
            >
              Attach to Task
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (scanState === "unknown") {
    return (
      <div className="flex flex-col items-center py-6 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-[#FEE2E2] flex items-center justify-center mb-3">
          <AlertTriangle size={32} className="text-[#DC2626]" />
        </div>
        <h3 className="text-[18px] font-bold text-[#DC2626] mb-1">Unknown RFID Tag</h3>
        <p className="text-[13px] text-[#64748B] mb-4">This RFID tag is not bound to any AWB piece in the system</p>

        <div className="w-full bg-[#FEE2E2] rounded-xl border border-[#DC2626]/20 p-4 mb-4">
          <p className="text-[12px] text-[#DC2626] font-semibold mb-1">Scanned EPC</p>
          <p className="text-[13px] font-mono text-[#DC2626] break-all">{scannedData?.rfid || "EPC-UNKNOWN-000000000000-0000"}</p>
        </div>

        <div className="flex flex-col w-full gap-2">
          <button
            onClick={handleReportUnknown}
            className="w-full h-12 rounded-xl text-[14px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90 whitespace-nowrap"
            style={{ backgroundColor: "#D97706" }}
          >
            <span className="flex items-center justify-center gap-2">
              <AlertTriangle size={18} />
              Report Unknown Tag
            </span>
          </button>
          <button
            onClick={onRescan}
            className="w-full h-12 rounded-xl text-[14px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer transition-colors whitespace-nowrap"
          >
            <span className="flex items-center justify-center gap-2">
              <RefreshCw size={16} />
              Re-scan
            </span>
          </button>
        </div>
      </div>
    );
  }

  if (scanState === "wrong-piece") {
    return (
      <div className="flex flex-col items-center py-6 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-[#FEE2E2] flex items-center justify-center mb-3">
          <X size={32} className="text-[#DC2626]" />
        </div>
        <h3 className="text-[18px] font-bold text-[#DC2626] mb-1">Wrong Piece Scanned</h3>
        <p className="text-[13px] text-[#64748B] mb-4">The scanned piece does not match the expected piece</p>

        <div className="w-full bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] p-4 mb-4 text-left">
          <div className="grid grid-cols-2 gap-3 mb-3 pb-3 border-b border-[#E2E8F0]">
            <div>
              <p className="text-[11px] text-[#94A3B8] uppercase font-semibold tracking-wider">Expected Piece</p>
              <p className="text-[14px] font-semibold text-[#0F172A]">P-21445678901-07</p>
            </div>
            <div>
              <p className="text-[11px] text-[#94A3B8] uppercase font-semibold tracking-wider">Scanned Piece</p>
              <p className="text-[14px] font-semibold text-[#DC2626]">{scannedData?.pieceId || "P-UNKNOWN-000000-00"}</p>
            </div>
          </div>
          <div>
            <p className="text-[11px] text-[#94A3B8] uppercase font-semibold tracking-wider">Expected AWB</p>
            <p className="text-[14px] font-semibold text-[#0F172A]">214-45678901</p>
          </div>
        </div>

        <button
          onClick={onRescan}
          className="w-full h-12 rounded-xl text-[14px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90 whitespace-nowrap"
          style={{ backgroundColor: "#0B2545" }}
        >
          <span className="flex items-center justify-center gap-2">
            <RefreshCw size={16} />
            Re-scan
          </span>
        </button>
      </div>
    );
  }

  if (scanState === "wrong-location") {
    return (
      <div className="flex flex-col items-center py-6 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-[#FEF3C7] flex items-center justify-center mb-3">
          <AlertCircle size={32} className="text-[#D97706]" />
        </div>
        <h3 className="text-[18px] font-bold text-[#D97706] mb-1">Wrong Location</h3>
        <p className="text-[13px] text-[#64748B] mb-4">Piece is not at the expected location</p>

        <div className="w-full bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] p-4 mb-4 text-left">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[11px] text-[#94A3B8] uppercase font-semibold tracking-wider">Expected Location</p>
              <p className="text-[14px] font-semibold text-[#0F172A]">AFU-R02-L1-B04</p>
            </div>
            <div>
              <p className="text-[11px] text-[#94A3B8] uppercase font-semibold tracking-wider">Current Location</p>
              <p className="text-[14px] font-semibold text-[#D97706]">Receiving Bay 02</p>
            </div>
          </div>
        </div>

        <button
          onClick={onRescan}
          className="w-full h-12 rounded-xl text-[14px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90 whitespace-nowrap"
          style={{ backgroundColor: "#0B2545" }}
        >
          Re-scan
        </button>
      </div>
    );
  }

  if (scanState === "already-picked") {
    return (
      <div className="flex flex-col items-center py-6 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-[#E0E7FF] flex items-center justify-center mb-3">
          <AlertCircle size={32} className="text-[#4338CA]" />
        </div>
        <h3 className="text-[18px] font-bold text-[#4338CA] mb-1">Already Picked</h3>
        <p className="text-[13px] text-[#64748B] mb-4">This piece has already been picked from storage</p>

        <div className="w-full bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] p-4 mb-4 text-left">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[11px] text-[#94A3B8] uppercase font-semibold tracking-wider">Picked By</p>
              <p className="text-[14px] font-semibold text-[#0F172A]">Imran Ali (FL-02)</p>
            </div>
            <div>
              <p className="text-[11px] text-[#94A3B8] uppercase font-semibold tracking-wider">Picked At</p>
              <p className="text-[14px] font-semibold text-[#0F172A]">14:22 today</p>
            </div>
          </div>
        </div>

        <button
          onClick={onRescan}
          className="w-full h-12 rounded-xl text-[14px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90 whitespace-nowrap"
          style={{ backgroundColor: "#0B2545" }}
        >
          Re-scan
        </button>
      </div>
    );
  }

  if (scanState === "held-piece") {
    return (
      <div className="flex flex-col items-center py-6 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-[#FEE2E2] flex items-center justify-center mb-3">
          <AlertTriangle size={32} className="text-[#DC2626]" />
        </div>
        <h3 className="text-[18px] font-bold text-[#DC2626] mb-1">Held Piece</h3>
        <p className="text-[13px] text-[#64748B] mb-4">This piece is on customs hold and cannot be moved</p>

        <div className="w-full bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] p-4 mb-4 text-left">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[11px] text-[#94A3B8] uppercase font-semibold tracking-wider">Hold Reason</p>
              <p className="text-[14px] font-semibold text-[#DC2626]">Customs Inspection</p>
            </div>
            <div>
              <p className="text-[11px] text-[#94A3B8] uppercase font-semibold tracking-wider">Hold Date</p>
              <p className="text-[14px] font-semibold text-[#0F172A]">2026-05-29</p>
            </div>
          </div>
        </div>

        <button
          onClick={onRescan}
          className="w-full h-12 rounded-xl text-[14px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90 whitespace-nowrap"
          style={{ backgroundColor: "#0B2545" }}
        >
          Re-scan
        </button>
      </div>
    );
  }

  return null;
}