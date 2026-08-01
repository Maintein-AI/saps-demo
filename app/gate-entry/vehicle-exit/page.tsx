"use client";

import { useState, useEffect } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import ErrorState from "@/components/ErrorState";
import EmptyState from "@/components/EmptyState";
import { useToast } from "@/components/ToastContext";
import GatePassScan from "@/components/gate-entry/vehicle-exit/GatePassScan";
import ExitConfirmation from "@/components/gate-entry/vehicle-exit/ExitConfirmation";
import ExitVerification from "@/components/gate-entry/vehicle-exit/ExitVerification";
import PieceVerification from "@/components/gate-entry/vehicle-exit/PieceVerification";

const mockGatePassData = {
  gatePass: "GP-2026-05131",
  vehicleNumber: "KHI-4582",
  driverCnic: "4210112345671",
  driverName: "Ahmed Raza",
  linkedDoc: "DO-90871",
  expectedPieces: "7",
  piecesCounted: "7",
  exitTimestamp: "",
  gateGuard: "Sgt. Imran Haider",
};

const mockPieces = [
  { pieceId: "P-21445678901-01", rfid: "EPC-2144-0001", expected: "Yes", loaded: "Yes", scanStatus: "Matched", remarks: "OK" },
  { pieceId: "P-21445678901-02", rfid: "EPC-2144-0002", expected: "Yes", loaded: "Yes", scanStatus: "Matched", remarks: "OK" },
  { pieceId: "P-21445678901-03", rfid: "EPC-2144-0003", expected: "Yes", loaded: "Yes", scanStatus: "Matched", remarks: "OK" },
  { pieceId: "P-21445678901-04", rfid: "EPC-2144-0004", expected: "Yes", loaded: "Yes", scanStatus: "Matched", remarks: "OK" },
  { pieceId: "P-21445678901-05", rfid: "EPC-2144-0005", expected: "Yes", loaded: "Yes", scanStatus: "Matched", remarks: "OK" },
  { pieceId: "P-21445678901-06", rfid: "EPC-2144-0006", expected: "Yes", loaded: "Yes", scanStatus: "Matched", remarks: "OK" },
  { pieceId: "P-21445678901-07", rfid: "EPC-2144-0007", expected: "Yes", loaded: "Yes", scanStatus: "Matched", remarks: "OK" },
];

const mockVerification = [
  { label: "Driver CNIC matches", pass: true, detail: "4210112345671 matches gate pass" },
  { label: "Vehicle matches gate pass", pass: true, detail: "KHI-4582 matches gate pass" },
  { label: "Pieces on truck match Gate Pass", pass: true, detail: "7 / 7 pieces loaded" },
  { label: "POD evidence captured", pass: true, detail: "Photo & signature ready" },
  { label: "DO issued", pass: true, detail: "DO-90871 cleared" },
  { label: "Payment cleared", pass: true, detail: "No outstanding charges" },
  { label: "No active customs hold", pass: true, detail: "No customs hold" },
  { label: "No unresolved gate hold", pass: true, detail: "No gate hold" },
];

export default function VehicleExitPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [showError, setShowError] = useState(false);
  const [showEmpty, setShowEmpty] = useState(false);
  const [scanState, setScanState] = useState("waiting");
  const [gatePass, setGatePass] = useState("");
  const [exitData, setExitData] = useState(mockGatePassData);
  const [showMismatch, setShowMismatch] = useState(false);
  const [showHold, setShowHold] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (exitData.exitTimestamp === "") {
      setExitData((prev) => ({
        ...prev,
        exitTimestamp: new Date().toLocaleString("en-GB", {
          day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
        }),
      }));
    }
  }, [exitData.exitTimestamp]);

  const handleScan = (code: string) => {
    setGatePass(code);
    if (code === "GP-2026-05131" || code === "GP-2026-05131") {
      setScanState("found");
      setShowMismatch(false);
      setShowHold(false);
      setExitData((prev) => ({ ...prev, gatePass: code }));
    } else if (code.startsWith("HOLD")) {
      setScanState("hold");
      setShowHold(true);
    } else if (code.startsWith("MISMATCH")) {
      setScanState("mismatch");
      setShowMismatch(true);
    } else {
      setScanState("found");
      setShowMismatch(false);
      setShowHold(false);
      setExitData((prev) => ({ ...prev, gatePass: code }));
    }
  };

  const handleClear = () => {
    setGatePass("");
    setScanState("waiting");
    setShowMismatch(false);
    setShowHold(false);
    setExitData(mockGatePassData);
  };

  const handleRetry = () => {
    setShowError(false);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleRelease = () => {
    addToast("Vehicle released successfully", "success");
    setScanState("cleared");
  };

  const handleHoldMismatch = () => {
    addToast("Vehicle held for mismatch review", "error");
    setScanState("hold");
  };

  const handleRescan = () => {
    setGatePass("");
    setScanState("waiting");
    setShowMismatch(false);
    setShowHold(false);
  };

  const handlePrint = () => {
    addToast("Exit slip printed", "success");
  };

  const handleChange = (field: string, value: string) => {
    setExitData((prev) => ({ ...prev, [field]: value }));
  };

  const showConfirmation = scanState === "found" || scanState === "cleared";

  return (
    <div className="flex flex-col gap-8">
      {/* Breadcrumb + Title */}
      <div className="flex flex-col gap-3">
        <Breadcrumb items={[{ label: "Gate Entry", href: "#" }, { label: "Vehicle Exit" }]} />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h1 className="text-[24px] lg:text-[32px] font-bold text-[#0F172A] leading-[32px] lg:leading-[40px]">Vehicle Exit</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setShowError(!showError); if (!showError) addToast("Error state simulated", "error"); }}
              className="text-[12px] font-semibold text-[#1B4F8B] hover:text-[#0B2545] cursor-pointer transition-colors"
            >
              {showError ? "Hide Error" : "Simulate Error"}
            </button>
            <button
              onClick={() => { setIsLoading(true); setTimeout(() => setIsLoading(false), 1000); addToast("Loading state simulated", "success"); }}
              className="text-[12px] font-semibold text-[#1B4F8B] hover:text-[#0B2545] cursor-pointer transition-colors"
            >
              Simulate Loading
            </button>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {showError && (
        <ErrorState
          title="Exit system unavailable"
          message="Connection to the gate exit system failed. Retry or use offline paper form."
          onRetry={handleRetry}
        />
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="flex flex-col gap-6">
          <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
            <div className="h-5 w-40 bg-[#F1F5F9] rounded animate-pulse mb-6" />
            <div className="max-w-xl mx-auto">
              <div className="h-14 rounded-xl bg-[#F1F5F9] animate-pulse mb-2" />
              <div className="h-4 w-48 bg-[#F1F5F9] rounded animate-pulse mx-auto mt-3" />
              <div className="h-14 mt-6 rounded-xl bg-[#F1F5F9] animate-pulse" />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
              <div className="h-5 w-40 bg-[#F1F5F9] rounded animate-pulse mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-12 rounded-xl bg-[#F1F5F9] animate-pulse" />
                ))}
              </div>
            </div>
            <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
              <div className="h-5 w-40 bg-[#F1F5F9] rounded animate-pulse mb-6" />
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-16 rounded-xl bg-[#F1F5F9] animate-pulse mb-3" />
              ))}
            </div>
          </div>
          <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
            <div className="h-5 w-48 bg-[#F1F5F9] rounded animate-pulse mb-5" />
            <div className="h-48 rounded-xl bg-[#F1F5F9] animate-pulse" />
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Scan Card */}
          <GatePassScan
            scanState={scanState}
            gatePass={gatePass}
            onScan={handleScan}
            onClear={handleClear}
          />

          {/* Empty State */}
          {(scanState === "waiting" && !showError && !showEmpty) && (
            <EmptyState
              title="Scan a Gate Pass to begin exit verification"
              description="All vehicle exits require a valid Gate Pass scan. Use the scanner above or enter the pass number manually."
              actionLabel="Simulate Scan"
              onAction={() => handleScan("GP-2026-05131")}
            />
          )}

          {/* After Scan: Confirmation + Verification + Pieces */}
          {showConfirmation && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <ExitConfirmation data={exitData} onChange={handleChange} />
                </div>
                <div>
                  <ExitVerification items={mockVerification} />
                </div>
              </div>

              <PieceVerification pieces={mockPieces} />

              {/* Actions */}
              <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleRelease}
                    className="flex-1 h-14 rounded-xl text-[15px] font-bold text-white cursor-pointer transition-colors hover:opacity-90"
                    style={{ backgroundColor: "#16A34A" }}
                  >
                    Release
                  </button>
                  <button
                    onClick={handleHoldMismatch}
                    className="flex-1 h-14 rounded-xl text-[15px] font-bold text-[#DC2626] border-2 border-[#DC2626] cursor-pointer transition-colors hover:bg-[#FEE2E2]"
                  >
                    Hold Mismatch
                  </button>
                  <button
                    onClick={handleRescan}
                    className="flex-1 h-14 rounded-xl text-[15px] font-bold text-[#1B4F8B] border-2 border-[#1B4F8B] cursor-pointer transition-colors hover:bg-[#EBF0F7]"
                  >
                    Re-scan
                  </button>
                  <button
                    onClick={handlePrint}
                    className="flex-1 h-14 rounded-xl text-[15px] font-bold text-[#64748B] border-2 border-[#E2E8F0] cursor-pointer transition-colors hover:bg-[#F8FAFC]"
                  >
                    Print Exit Slip
                  </button>
                </div>
                <div className="flex items-center gap-3 mt-4">
                  <button className="h-10 px-5 rounded-xl text-[13px] font-semibold text-[#64748B] border border-[#E2E8F0] hover:bg-[#F8FAFC] cursor-pointer transition-colors">
                    View Gate Pass Detail
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Mismatch State */}
          {showMismatch && (
            <ErrorState
              title="Gate Pass mismatch"
              message="Scanned Gate Pass does not match any active vehicle record. Verify the pass number or re-scan."
              onRetry={handleRescan}
            />
          )}

          {/* Hold State */}
          {showHold && (
            <div className="rounded-xl border border-[#D97706]/20 bg-[#D97706]/5 p-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#D97706]/10 flex items-center justify-center">
                  <AlertTriangleIcon size={20} className="text-[#D97706]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-[14px] font-bold text-[#0F172A] mb-1">Vehicle on hold</h3>
                  <p className="text-[13px] text-[#64748B] leading-relaxed">This vehicle is currently on hold. Resolve the hold before release.</p>
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={handleRescan}
                      className="h-8 px-3 rounded-lg text-[13px] font-semibold border border-[#D97706]/30 text-[#D97706] hover:bg-[#D97706]/10 cursor-pointer transition-colors"
                    >
                      Re-scan
                    </button>
                    <button
                      onClick={() => addToast("Gate hold reviewed", "success")}
                      className="h-8 px-3 rounded-lg text-[13px] font-semibold text-white bg-[#D97706] hover:opacity-90 cursor-pointer transition-colors"
                    >
                      Review Hold
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AlertTriangleIcon({ size, className }: { size: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}