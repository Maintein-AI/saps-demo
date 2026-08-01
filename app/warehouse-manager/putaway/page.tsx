"use client";

import { useState, useEffect } from "react";
import { ScanLine, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";
import { useToast } from "@/components/ToastContext";
import ScanForm from "@/components/putaway/ScanForm";
import SuggestedLocation from "@/components/putaway/SuggestedLocation";
import ScanState from "@/components/putaway/ScanState";
import RecentActivity from "@/components/putaway/RecentActivity";

export type ScanState = "waiting" | "matched" | "unknown" | "duplicate" | "wrong_class" | "full" | "scanning";

export default function PutawayPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [showError, setShowError] = useState(false);
  const [showEmpty, setShowEmpty] = useState(false);
  const [scanState, setScanState] = useState<ScanState>("waiting");
  const [scannedData, setScannedData] = useState<any>(null);
  const { addToast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleRetry = () => {
    setShowError(false);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 800);
  };

  const handleSimulateScan = (rfid: string) => {
    if (rfid === "EPC-3008-21445678901-0007") {
      setScanState("matched");
      setScannedData({
        rfid: "EPC-3008-21445678901-0007",
        pieceId: "P-21445678901-07",
        awb: "214-45678901",
        awbPieces: "24",
        suggestedLocation: "AFU-R02-L1-B04",
        rack: "AFU-R02",
        row: "R02",
        level: "L1",
        bin: "B04",
        zone: "AFU",
        occupancy: "64%",
        cargoClass: "AFU",
        weight: "52.0 kg",
        handlingCode: "GEN",
        nearestAisle: "Aisle-7",
        lastStoredAwb: "157-90811223",
        coldChain: "N/A",
        operator: "Ahmed Khan",
        lifter: "FL-03",
        timestamp: "31 May 2026, 14:48",
        cargoClassCompatible: true,
        weightCompatible: true,
        handlingCompatible: true,
      });
    } else if (rfid === "UNKNOWN") {
      setScanState("unknown");
      setScannedData(null);
    } else if (rfid === "DUPLICATE") {
      setScanState("duplicate");
      setScannedData(null);
    } else if (rfid === "WRONG") {
      setScanState("wrong_class");
      setScannedData({
        rfid: "EPC-3008-21445678901-0008",
        pieceId: "P-21445678901-08",
        suggestedLocation: "AFU-R02-L1-B04",
        cargoClass: "DGR",
        rackCargoClass: "AFU",
      });
    } else if (rfid === "FULL") {
      setScanState("full");
      setScannedData({
        rfid: "EPC-3008-21445678901-0009",
        pieceId: "P-21445678901-09",
        suggestedLocation: "AFU-R02-L1-B04",
        occupancy: "98%",
      });
    } else {
      setScanState("matched");
      setScannedData({
        rfid,
        pieceId: "P-21445678901-07",
        awb: "214-45678901",
        awbPieces: "24",
        suggestedLocation: "AFU-R02-L1-B04",
        rack: "AFU-R02",
        row: "R02",
        level: "L1",
        bin: "B04",
        zone: "AFU",
        occupancy: "64%",
        cargoClass: "AFU",
        weight: "52.0 kg",
        handlingCode: "GEN",
        nearestAisle: "Aisle-7",
        lastStoredAwb: "157-90811223",
        coldChain: "N/A",
        operator: "Ahmed Khan",
        lifter: "FL-03",
        timestamp: "31 May 2026, 14:48",
        cargoClassCompatible: true,
        weightCompatible: true,
        handlingCompatible: true,
      });
    }
  };

  const handleConfirm = () => {
    addToast("Putaway confirmed for Piece P-21445678901-07", "success");
    setScanState("waiting");
    setScannedData(null);
  };

  const handleSkip = () => {
    addToast("Piece held — moved to exception queue", "error");
    setScanState("waiting");
    setScannedData(null);
  };

  const handleReportDamage = () => {
    addToast("Damage report flagged for Piece P-21445678901-07", "error");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb + Title */}
      <div className="flex flex-col gap-3">
        <Breadcrumb
          items={[
            { label: "Warehouse Manager", href: "/warehouse-manager" },
            { label: "Putaway" },
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
              RFID Putaway
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setShowError(!showError);
                if (!showError) addToast("Error state simulated", "error");
              }}
              className="text-[12px] font-semibold text-[#1B4F8B] hover:text-[#0B2545] cursor-pointer transition-colors"
            >
              {showError ? "Hide Error" : "Simulate Error"}
            </button>
            <button
              onClick={() => {
                setShowEmpty(!showEmpty);
                if (!showEmpty) addToast("Empty state shown", "success");
              }}
              className="text-[12px] font-semibold text-[#1B4F8B] hover:text-[#0B2545] cursor-pointer transition-colors"
            >
              {showEmpty ? "Show Data" : "Simulate Empty"}
            </button>
          </div>
        </div>
      </div>

      {/* Instruction Banner */}
      <div className="flex items-center gap-3 rounded-[12px] border border-[#1B4F8B]/20 bg-[#1B4F8B]/5 px-4 py-3">
        <div className="w-8 h-8 rounded-full bg-[#1B4F8B]/10 flex items-center justify-center flex-shrink-0">
          <ScanLine size={16} className="text-[#1B4F8B]" />
        </div>
        <p className="text-[13px] font-medium text-[#1B4F8B]">
          Scan piece RFID tag to receive suggested storage location.
        </p>
      </div>

      {/* Error State */}
      {showError && (
        <ErrorState
          title="RFID scanner disconnected"
          message="Scanner connection lost. Last successful scan: 14:45. Attempting to reconnect..."
          onRetry={handleRetry}
        />
      )}

      {/* Main Content */}
      {!showError && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left: Scan Form */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
                <div className="h-5 w-40 bg-[#F1F5F9] rounded animate-pulse mb-4" />
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex flex-col gap-2">
                      <div className="h-3 w-24 bg-[#F1F5F9] rounded animate-pulse" />
                      <div className="h-9 w-full bg-[#F1F5F9] rounded animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <ScanForm
                scanState={scanState}
                scannedData={scannedData}
                onSimulateScan={handleSimulateScan}
                onConfirm={handleConfirm}
                onSkip={handleSkip}
                onReportDamage={handleReportDamage}
              />
            )}
          </div>

          {/* Right: Suggested Location */}
          <div className="lg:col-span-2">
            {isLoading ? (
              <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
                <div className="h-5 w-48 bg-[#F1F5F9] rounded animate-pulse mb-4" />
                <div className="space-y-3">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="flex justify-between items-center h-8">
                      <div className="h-3 w-24 bg-[#F1F5F9] rounded animate-pulse" />
                      <div className="h-3 w-20 bg-[#F1F5F9] rounded animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <SuggestedLocation
                scanState={scanState}
                scannedData={scannedData}
              />
            )}
          </div>
        </div>
      )}

      {/* Scan State Indicator */}
      {!showError && !isLoading && (
        <ScanState state={scanState} />
      )}

      {/* Recent Activity */}
      <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-[18px] font-semibold text-[#0F172A] leading-[28px]">
              Recent Putaway Activity
            </h2>
          </div>
        </div>
        {isLoading ? (
          <LoadingSkeleton rows={5} columns={8} />
        ) : (
          <RecentActivity />
        )}
      </div>
    </div>
  );
}