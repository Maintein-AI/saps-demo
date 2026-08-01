"use client";

import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import ErrorState from "@/components/ErrorState";
import EmptyState from "@/components/EmptyState";
import { useToast } from "@/components/ToastContext";
import PickHeader from "@/components/picking/PickHeader";
import PickListTable from "@/components/picking/PickListTable";
import VerificationPanel from "@/components/picking/VerificationPanel";
import ScanTimeline from "@/components/picking/ScanTimeline";

export default function PickingPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [showError, setShowError] = useState(false);
  const [showEmpty, setShowEmpty] = useState(false);
  const [scannedCount, setScannedCount] = useState(18);
  const [totalPieces] = useState(24);
  const [pickList, setPickList] = useState([
    { id: "P-21445678901-01", location: "AFU-R02-L1-B01", rfid: "EPC-3008-21445678901-0001", class: "AFU", weight: "52.0 kg", status: "Scanned", remarks: "", checked: true },
    { id: "P-21445678901-02", location: "AFU-R02-L1-B02", rfid: "EPC-3008-21445678901-0002", class: "AFU", weight: "49.0 kg", status: "Scanned", remarks: "", checked: true },
    { id: "P-21445678901-03", location: "AFU-R02-L1-B03", rfid: "EPC-3008-21445678901-0003", class: "AFU", weight: "50.0 kg", status: "Mismatch", remarks: "RFID mismatch - expected B03", checked: false },
    { id: "P-21445678901-04", location: "AFU-R02-L1-B04", rfid: "EPC-3008-21445678901-0004", class: "AFU", weight: "51.0 kg", status: "Pending", remarks: "", checked: false },
    { id: "P-21445678901-05", location: "AFU-R02-L1-B05", rfid: "EPC-3008-21445678901-0005", class: "AFU", weight: "48.0 kg", status: "Pending", remarks: "", checked: false },
    { id: "P-21445678901-06", location: "AFU-R02-L1-B06", rfid: "EPC-3008-21445678901-0006", class: "AFU", weight: "50.0 kg", status: "Pending", remarks: "", checked: false },
    { id: "P-21445678901-07", location: "AFU-R02-L1-B07", rfid: "EPC-3008-21445678901-0007", class: "AFU", weight: "52.0 kg", status: "Pending", remarks: "", checked: false },
    { id: "P-21445678901-08", location: "AFU-R02-L1-B08", rfid: "EPC-3008-21445678901-0008", class: "AFU", weight: "49.0 kg", status: "Pending", remarks: "", checked: false },
    { id: "P-21445678901-09", location: "AFU-R02-L1-B09", rfid: "EPC-3008-21445678901-0009", class: "AFU", weight: "51.0 kg", status: "Pending", remarks: "", checked: false },
    { id: "P-21445678901-10", location: "AFU-R02-L1-B10", rfid: "EPC-3008-21445678901-0010", class: "AFU", weight: "50.0 kg", status: "Pending", remarks: "", checked: false },
    { id: "P-21445678901-11", location: "AFU-R02-L1-B11", rfid: "EPC-3008-21445678901-0011", class: "AFU", weight: "48.0 kg", status: "Pending", remarks: "", checked: false },
    { id: "P-21445678901-12", location: "AFU-R02-L1-B12", rfid: "EPC-3008-21445678901-0012", class: "AFU", weight: "52.0 kg", status: "Pending", remarks: "", checked: false },
    { id: "P-21445678901-13", location: "AFU-R02-L1-B13", rfid: "EPC-3008-21445678901-0013", class: "AFU", weight: "49.0 kg", status: "Pending", remarks: "", checked: false },
    { id: "P-21445678901-14", location: "AFU-R02-L1-B14", rfid: "EPC-3008-21445678901-0014", class: "AFU", weight: "51.0 kg", status: "Pending", remarks: "", checked: false },
    { id: "P-21445678901-15", location: "AFU-R02-L1-B15", rfid: "EPC-3008-21445678901-0015", class: "AFU", weight: "50.0 kg", status: "Pending", remarks: "", checked: false },
    { id: "P-21445678901-16", location: "AFU-R02-L1-B16", rfid: "EPC-3008-21445678901-0016", class: "AFU", weight: "48.0 kg", status: "Pending", remarks: "", checked: false },
    { id: "P-21445678901-17", location: "AFU-R02-L1-B17", rfid: "EPC-3008-21445678901-0017", class: "AFU", weight: "52.0 kg", status: "Pending", remarks: "", checked: false },
    { id: "P-21445678901-18", location: "AFU-R02-L1-B18", rfid: "EPC-3008-21445678901-0018", class: "AFU", weight: "49.0 kg", status: "Pending", remarks: "", checked: false },
    { id: "P-21445678901-19", location: "AFU-R02-L1-B19", rfid: "EPC-3008-21445678901-0019", class: "AFU", weight: "51.0 kg", status: "Pending", remarks: "", checked: false },
    { id: "P-21445678901-20", location: "AFU-R02-L1-B20", rfid: "EPC-3008-21445678901-0020", class: "AFU", weight: "50.0 kg", status: "Pending", remarks: "", checked: false },
    { id: "P-21445678901-21", location: "AFU-R02-L1-B21", rfid: "EPC-3008-21445678901-0021", class: "AFU", weight: "48.0 kg", status: "Pending", remarks: "", checked: false },
    { id: "P-21445678901-22", location: "AFU-R02-L1-B22", rfid: "EPC-3008-21445678901-0022", class: "AFU", weight: "52.0 kg", status: "Pending", remarks: "", checked: false },
    { id: "P-21445678901-23", location: "AFU-R02-L1-B23", rfid: "EPC-3008-21445678901-0023", class: "AFU", weight: "49.0 kg", status: "Pending", remarks: "", checked: false },
    { id: "P-21445678901-24", location: "AFU-R02-L1-B24", rfid: "EPC-3008-21445678901-0024", class: "AFU", weight: "51.0 kg", status: "Pending", remarks: "", checked: false },
  ]);
  const [pickChecks, setPickChecks] = useState({
    gatePassValid: true,
    doIssued: true,
    paymentCleared: true,
    vehicleInside: true,
    driverVerified: true,
    piecesMatch: false,
    noCustomsHold: true,
    noDamageCDR: true,
  });
  const { addToast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const scanned = pickList.filter(p => p.status === "Scanned").length;
    setScannedCount(scanned);
  }, [pickList]);

  const handleRetry = () => {
    setShowError(false);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 800);
  };

  const handleScanPiece = (pieceId: string) => {
    setPickList(prev => prev.map(p => {
      if (p.id === pieceId) {
        return { ...p, status: "Scanned", checked: true };
      }
      return p;
    }));
    addToast(`Piece ${pieceId} scanned successfully`, "success");
  };

  const handleHoldMismatch = (pieceId: string) => {
    setPickList(prev => prev.map(p => {
      if (p.id === pieceId) {
        return { ...p, status: "Held", remarks: "Held for investigation", checked: false };
      }
      return p;
    }));
    addToast(`Piece ${pieceId} moved to Held status`, "error");
  };

  const handleRescan = () => {
    setPickList(prev => prev.map(p => ({ ...p, status: "Pending", checked: false, remarks: "" })));
    setScannedCount(0);
    addToast("Pick list reset for re-scan", "success");
  };

  const handleConfirmPick = () => {
    addToast("Picking completed for GP-2026-05131", "success");
  };

  const handleAssignLifter = () => {
    addToast("Pick list assigned to Lifter Operator FL-03", "success");
  };

  const handleCheckChange = (key: string) => {
    setPickChecks(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb + Title */}
      <div className="flex flex-col gap-3">
        <Breadcrumb
          items={[
            { label: "Warehouse Manager", href: "/warehouse-manager" },
            { label: "Picking" },
          ]}
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/warehouse-manager"
              className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#E2E8F0] text-[#64748B] cursor-pointer transition-colors"
            >
              <ArrowLeft size={18} />
            </Link>
            <h1 className="text-[24px] lg:text-[32px] font-bold text-[#0F172A] leading-[32px] lg:leading-[40px]">
              Gate Pass Picking
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setShowError(!showError); if (!showError) addToast("Error state simulated", "error"); }}
              className="text-[12px] font-semibold text-[#1B4F8B] hover:text-[#0B2545] cursor-pointer transition-colors"
            >
              {showError ? "Hide Error" : "Simulate Error"}
            </button>
            <button
              onClick={() => { setShowEmpty(!showEmpty); if (!showEmpty) addToast("Empty state shown", "success"); }}
              className="text-[12px] font-semibold text-[#1B4F8B] hover:text-[#0B2545] cursor-pointer transition-colors"
            >
              {showEmpty ? "Show Data" : "Simulate Empty"}
            </button>
          </div>
        </div>
      </div>

      {/* Error State */}
      {showError && (
        <ErrorState
          title="Pick list load failed"
          message="Unable to fetch Gate Pass GP-2026-05131 pick list. Server returned 500."
          onRetry={handleRetry}
        />
      )}

      {/* Main Content */}
      {!showError && (
        <>
          {/* Pick Header */}
          {isLoading ? (
            <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
              <div className="h-5 w-40 bg-[#F1F5F9] rounded animate-pulse mb-4" />
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-8 bg-[#F1F5F9] rounded animate-pulse" />
                ))}
              </div>
            </div>
          ) : (
            <PickHeader
              scanned={scannedCount}
              total={totalPieces}
            />
          )}

          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Left: Pick List */}
            <div className="lg:col-span-3">
              {showEmpty ? (
                <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <h2 className="text-[18px] font-semibold text-[#0F172A] leading-[28px]">Pick List</h2>
                  </div>
                  <EmptyState
                    title="No active pick list selected"
                    description="Select a Gate Pass to load the pick list for this operation."
                    icon={<ArrowLeft size={28} className="text-[#94A3B8]" />}
                  />
                </div>
              ) : isLoading ? (
                <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-5 w-24 bg-[#F1F5F9] rounded animate-pulse" />
                    <div className="h-5 w-10 bg-[#F1F5F9] rounded animate-pulse" />
                  </div>
                  <LoadingSkeleton rows={6} columns={8} />
                </div>
              ) : (
                <PickListTable
                  pickList={pickList}
                  onScan={handleScanPiece}
                  onHold={handleHoldMismatch}
                />
              )}
            </div>

            {/* Right: Verification Panel */}
            <div className="lg:col-span-2">
              {isLoading ? (
                <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
                  <div className="h-5 w-40 bg-[#F1F5F9] rounded animate-pulse mb-4" />
                  <div className="space-y-3">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="h-8 bg-[#F1F5F9] rounded animate-pulse" />
                    ))}
                  </div>
                </div>
              ) : (
                <VerificationPanel
                  checks={pickChecks}
                  onCheckChange={handleCheckChange}
                  onConfirm={handleConfirmPick}
                  onHold={handleHoldMismatch}
                  onRescan={handleRescan}
                  onAssign={handleAssignLifter}
                />
              )}
            </div>
          </div>

          {/* Scan Activity Timeline */}
          <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-[18px] font-semibold text-[#0F172A] leading-[28px]">
                Scan Activity Timeline
              </h2>
            </div>
            {isLoading ? (
              <LoadingSkeleton rows={5} columns={6} />
            ) : (
              <ScanTimeline />
            )}
          </div>
        </>
      )}
    </div>
  );
}