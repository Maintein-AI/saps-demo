"use client";

import { useState, useRef } from "react";
import ScopeBadge from "@/components/ScopeBadge";
import { CheckCircle, XCircle, AlertTriangle, ScanLine, ArrowRight } from "lucide-react";

interface ScanFormProps {
  scanState: "waiting" | "matched" | "unknown" | "duplicate" | "wrong_class" | "full" | "scanning";
  scannedData: any;
  onSimulateScan: (rfid: string) => void;
  onConfirm: () => void;
  onSkip: () => void;
  onReportDamage: () => void;
}

const lifterOptions = ["FL-01", "FL-02", "FL-03", "FL-04", "FL-05"];
const overrideLocations = [
  "AFU-R01-L1-B01",
  "AFU-R01-L2-B03",
  "AFU-R02-L1-B05",
  "AFU-R02-L2-B02",
  "AFU-R03-L1-B01",
  "GCR-R01-L1-B01",
  "GCR-R02-L1-B02",
  "PER-R01-L1-B01",
  "PER-R01-L2-B03",
  "VAL-R01-L1-B01",
  "Cold-COL-01-B01",
  "Cold-COL-02-B02",
  "DGR-R01-L1-B01",
  "DGR-R02-L1-B02",
];

export default function ScanForm({
  scanState,
  scannedData,
  onSimulateScan,
  onConfirm,
  onSkip,
  onReportDamage,
}: ScanFormProps) {
  const [rfidInput, setRfidInput] = useState("");
  const [overrideLocation, setOverrideLocation] = useState("");
  const [overrideReason, setOverrideReason] = useState("");
  const [lifter, setLifter] = useState("FL-03");
  const [showOverride, setShowOverride] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleScan = () => {
    if (!rfidInput.trim()) return;
    onSimulateScan(rfidInput.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleScan();
    }
  };

  const isMatched = scanState === "matched";
  const isError = scanState === "unknown" || scanState === "duplicate" || scanState === "wrong_class" || scanState === "full";
  const isScanning = scanState === "scanning";

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-[18px] font-semibold text-[#0F172A] leading-[28px]">
            Scan & Confirm Putaway
          </h2>
          <ScopeBadge type="inc" />
        </div>
        {scanState === "waiting" && (
          <span className="text-[12px] text-[#94A3B8] font-medium">Ready to scan</span>
        )}
      </div>

      <div className="flex flex-col gap-5">
        {/* RFID Input */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1">
            <span className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">
              Scanned RFID Tag
            </span>
            <span className="text-[#DC2626] text-[12px] font-bold">*</span>
          </div>
          <div className="flex gap-2">
            <div className="flex-1 flex items-center gap-2 h-10 px-3 rounded-lg border border-[#E2E8F0] bg-white focus-within:border-[#1B4F8B] transition-colors">
              <ScanLine size={16} className="text-[#94A3B8]" />
              <input
                ref={inputRef}
                type="text"
                value={rfidInput}
                onChange={(e) => setRfidInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Scan or type RFID tag..."
                className="flex-1 text-[13px] font-medium text-[#0F172A] bg-transparent outline-none placeholder:text-[#94A3B8]"
                disabled={isScanning}
              />
            </div>
            <button
              onClick={handleScan}
              disabled={!rfidInput.trim() || isScanning}
              className="h-10 px-4 rounded-lg text-[13px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
              style={{ backgroundColor: "#0B2545" }}
            >
              {isScanning ? "Scanning..." : "Scan"}
            </button>
          </div>
          <p className="text-[11px] text-[#94A3B8]">
            Try: EPC-3008-21445678901-0007, UNKNOWN, DUPLICATE, WRONG, FULL
          </p>
        </div>

        {/* Scan State Feedback */}
        {isMatched && scannedData && (
          <div className="flex items-start gap-3 rounded-[12px] border border-[#16A34A]/20 bg-[#16A34A]/5 p-4">
            <div className="w-8 h-8 rounded-full bg-[#16A34A]/10 flex items-center justify-center flex-shrink-0">
              <CheckCircle size={16} className="text-[#16A34A]" />
            </div>
            <div>
              <p className="text-[14px] font-bold text-[#0F172A] mb-0.5">RFID Matched</p>
              <p className="text-[13px] text-[#64748B]">
                Piece {scannedData.pieceId} from AWB {scannedData.awb} identified.
              </p>
            </div>
          </div>
        )}

        {scanState === "unknown" && (
          <div className="flex items-start gap-3 rounded-[12px] border border-[#DC2626]/20 bg-[#DC2626]/5 p-4">
            <div className="w-8 h-8 rounded-full bg-[#DC2626]/10 flex items-center justify-center flex-shrink-0">
              <XCircle size={16} className="text-[#DC2626]" />
            </div>
            <div>
              <p className="text-[14px] font-bold text-[#0F172A] mb-0.5">Unknown RFID</p>
              <p className="text-[13px] text-[#64748B]">
                This RFID tag is not registered in the system.
              </p>
            </div>
          </div>
        )}

        {scanState === "duplicate" && (
          <div className="flex items-start gap-3 rounded-[12px] border border-[#D97706]/20 bg-[#D97706]/5 p-4">
            <div className="w-8 h-8 rounded-full bg-[#D97706]/10 flex items-center justify-center flex-shrink-0">
              <AlertTriangle size={16} className="text-[#D97706]" />
            </div>
            <div>
              <p className="text-[14px] font-bold text-[#0F172A] mb-0.5">Duplicate Scan</p>
              <p className="text-[13px] text-[#64748B]">
                This RFID tag was already scanned and put away.
              </p>
            </div>
          </div>
        )}

        {scanState === "wrong_class" && scannedData && (
          <div className="flex items-start gap-3 rounded-[12px] border border-[#DC2626]/20 bg-[#DC2626]/5 p-4">
            <div className="w-8 h-8 rounded-full bg-[#DC2626]/10 flex items-center justify-center flex-shrink-0">
              <XCircle size={16} className="text-[#DC2626]" />
            </div>
            <div>
              <p className="text-[14px] font-bold text-[#0F172A] mb-0.5">Wrong Cargo Class</p>
              <p className="text-[13px] text-[#64748B]">
                Piece cargo class {scannedData.cargoClass} is incompatible with rack class {scannedData.rackCargoClass}.
              </p>
            </div>
          </div>
        )}

        {scanState === "full" && scannedData && (
          <div className="flex items-start gap-3 rounded-[12px] border border-[#DC2626]/20 bg-[#DC2626]/5 p-4">
            <div className="w-8 h-8 rounded-full bg-[#DC2626]/10 flex items-center justify-center flex-shrink-0">
              <XCircle size={16} className="text-[#DC2626]" />
            </div>
            <div>
              <p className="text-[14px] font-bold text-[#0F172A] mb-0.5">Location Full</p>
              <p className="text-[13px] text-[#64748B]">
                Suggested location is at {scannedData.occupancy} capacity. Select an override.
              </p>
            </div>
          </div>
        )}

        {/* Computed Fields */}
        {isMatched && scannedData && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <span className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">
                  Piece ID
                </span>
                <div className="h-9 px-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] flex items-center text-[13px] font-medium text-[#0F172A]">
                  {scannedData.pieceId}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">
                  AWB
                </span>
                <div className="h-9 px-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] flex items-center text-[13px] font-medium text-[#0F172A]">
                  {scannedData.awb} <span className="text-[#94A3B8] ml-1">({scannedData.awbPieces} pcs)</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1">
                  <span className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">
                    Suggested Location
                  </span>
                  <span className="text-[#DC2626] text-[12px] font-bold">*</span>
                </div>
                <div className="h-9 px-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] flex items-center text-[13px] font-semibold text-[#16A34A]">
                  {scannedData.suggestedLocation}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">
                  Override Location
                </span>
                <div className="relative">
                  <button
                    onClick={() => setShowOverride(!showOverride)}
                    className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] bg-white flex items-center justify-between text-[13px] font-medium text-[#0F172A] cursor-pointer hover:bg-[#F8FAFC] transition-colors"
                  >
                    <span>{overrideLocation || "Select override..."}</span>
                    <span className="text-[#94A3B8] text-[10px]">▼</span>
                  </button>
                  {showOverride && (
                    <div className="absolute z-10 w-full mt-1 max-h-[200px] overflow-y-auto rounded-lg border border-[#E2E8F0] bg-white shadow-lg">
                      <button
                        onClick={() => { setOverrideLocation(""); setShowOverride(false); }}
                        className="w-full text-left px-3 py-2 text-[12px] text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer"
                      >
                        — Clear —
                      </button>
                      {overrideLocations.map((loc) => (
                        <button
                          key={loc}
                          onClick={() => { setOverrideLocation(loc); setShowOverride(false); }}
                          className="w-full text-left px-3 py-2 text-[12px] text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer"
                        >
                          {loc}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Override Reason */}
            {overrideLocation && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1">
                  <span className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">
                    Override Reason
                  </span>
                  <span className="text-[#DC2626] text-[12px] font-bold">*</span>
                </div>
                <textarea
                  value={overrideReason}
                  onChange={(e) => {
                    if (e.target.value.length <= 500) {
                      setOverrideReason(e.target.value);
                    }
                  }}
                  placeholder="Enter reason for location override..."
                  className="w-full h-20 px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-[13px] font-medium text-[#0F172A] outline-none focus:border-[#1B4F8B] resize-none placeholder:text-[#94A3B8]"
                />
                <span className="text-[11px] text-[#94A3B8] text-right">
                  {overrideReason.length}/500
                </span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <span className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">
                  Operator
                </span>
                <div className="h-9 px-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] flex items-center text-[13px] font-medium text-[#0F172A]">
                  {scannedData.operator}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1">
                  <span className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">
                    Lifter Asset
                  </span>
                  <span className="text-[#DC2626] text-[12px] font-bold">*</span>
                </div>
                <div className="relative">
                  <select
                    value={lifter}
                    onChange={(e) => setLifter(e.target.value)}
                    className="w-full h-9 px-3 pr-8 rounded-lg border border-[#E2E8F0] bg-white text-[13px] font-medium text-[#0F172A] outline-none focus:border-[#1B4F8B] cursor-pointer appearance-none"
                  >
                    {lifterOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">
                Timestamp
              </span>
              <div className="h-9 px-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] flex items-center text-[13px] font-medium text-[#0F172A]">
                {scannedData.timestamp}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={onConfirm}
                className="flex items-center gap-2 h-10 px-5 rounded-lg text-[13px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90 whitespace-nowrap"
                style={{ backgroundColor: "#0B2545" }}
              >
                <CheckCircle size={16} />
                Confirm Putaway
              </button>
              <button
                onClick={onSkip}
                className="flex items-center gap-2 h-10 px-5 rounded-lg text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer transition-colors whitespace-nowrap"
              >
                <ArrowRight size={16} />
                Skip / Hold
              </button>
              <button
                onClick={onReportDamage}
                className="flex items-center gap-2 h-10 px-5 rounded-lg text-[13px] font-semibold border border-[#DC2626]/30 text-[#DC2626] hover:bg-[#DC2626]/5 cursor-pointer transition-colors whitespace-nowrap"
              >
                <AlertTriangle size={16} />
                Report Damage
              </button>
            </div>
          </>
        )}

        {/* Empty state inside form when waiting */}
        {scanState === "waiting" && !isMatched && !isError && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#F1F5F9] flex items-center justify-center mb-3">
              <ScanLine size={28} className="text-[#94A3B8]" />
            </div>
            <p className="text-[14px] font-semibold text-[#0F172A] mb-1">
              Scan a piece RFID tag to begin putaway
            </p>
            <p className="text-[12px] text-[#64748B] max-w-[300px]">
              Enter the RFID tag above or use a handheld scanner to auto-fill.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}