"use client";

import { useState } from "react";
import { Scan, Check, AlertTriangle, ArrowLeft, ArrowRight } from "lucide-react";
import StatusBadge from "../../StatusBadge";
import ScanResult from "./ScanResult";
import { useToast } from "../../ToastContext";

interface ScannerCardProps {
  scanState: string;
  setScanState: (s: string) => void;
  scannedData: any;
  setScannedData: (d: any) => void;
}

const mockPieces: Record<string, any> = {
  "EPC-3008-21445678901-0007": {
    rfid: "EPC-3008-21445678901-0007",
    pieceId: "P-21445678901-07",
    awb: "214-45678901",
    hawb: "HBL-2091",
    cargoClass: "AFU",
    weight: "52 kg",
    handlingCode: "AFU",
    currentState: "Awaiting Putaway",
    lastMovement: "Receiving Bay 02 — 11:42",
    assignedTask: "T-2026-0041",
    storageLocation: "AFU-R02-L1-B04",
    currentLocation: "Receiving Bay 02",
    expectedLocation: "AFU-R02-L1-B04",
  },
  "EPC-3008-15790811223-0003": {
    rfid: "EPC-3008-15790811223-0003",
    pieceId: "P-15790811223-03",
    awb: "157-90811223",
    hawb: "HBL-1572",
    cargoClass: "PER",
    weight: "41 kg",
    handlingCode: "PER",
    currentState: "Stored",
    lastMovement: "Cold-COL-01 — 09:15",
    assignedTask: "T-2026-0042",
    storageLocation: "Cold-COL-01",
    currentLocation: "Cold-COL-01",
    expectedLocation: "Vehicle Bay 03",
  },
  "EPC-3008-07488219033-0009": {
    rfid: "EPC-3008-07488219033-0009",
    pieceId: "P-07488219033-09",
    awb: "074-88219033",
    hawb: "HBL-0740",
    cargoClass: "GCR",
    weight: "36 kg",
    handlingCode: "GCR",
    currentState: "Stored",
    lastMovement: "GCR-R05-L2-B01 — 08:30",
    assignedTask: "T-2026-0043",
    storageLocation: "GCR-R05-L2-B01",
    currentLocation: "GCR-R05-L2-B01",
    expectedLocation: "Inspection Bay",
  },
};

export default function ScannerCard({ scanState, setScanState, scannedData, setScannedData }: ScannerCardProps) {
  const { addToast } = useToast();
  const [scanInput, setScanInput] = useState("");
  const [expectedRfid] = useState("EPC-3008-21445678901-0007");

  const simulateScan = (rfid: string) => {
    const trimmed = rfid.trim();
    if (!trimmed) return;

    if (trimmed === "UNKNOWN") {
      setScannedData({ rfid: "EPC-UNKNOWN-000000000000-0000" });
      setScanState("unknown");
      return;
    }

    if (trimmed === "WRONG-PIECE") {
      setScannedData({ rfid: "EPC-3008-99999999999-0001", pieceId: "P-99999999999-01" });
      setScanState("wrong-piece");
      return;
    }

    if (trimmed === "WRONG-LOC") {
      setScannedData(mockPieces["EPC-3008-07488219033-0009"]);
      setScanState("wrong-location");
      return;
    }

    if (trimmed === "PICKED") {
      setScannedData(mockPieces["EPC-3008-15790811223-0003"]);
      setScanState("already-picked");
      return;
    }

    if (trimmed === "HELD") {
      setScannedData(mockPieces["EPC-3008-07488219033-0009"]);
      setScanState("held-piece");
      return;
    }

    const data = mockPieces[trimmed];
    if (data) {
      setScannedData(data);
      setScanState("matched");
    } else {
      setScannedData({ rfid: trimmed });
      setScanState("unknown");
    }
  };

  const handleScan = () => {
    simulateScan(scanInput);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleScan();
    }
  };

  const handleConfirm = () => {
    addToast("Scan confirmed for piece " + (scannedData?.pieceId || ""), "success");
    setScanState("waiting");
    setScanInput("");
  };

  const handleRescan = () => {
    setScanState("waiting");
    setScanInput("");
    setScannedData(null);
  };

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2.5">
          <h2 className="text-[16px] font-bold text-[#0F172A]">RFID Scan</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[12px] text-[#94A3B8] font-medium">Expected: {expectedRfid}</span>
        </div>
      </div>

      <div className="px-5 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]">
              <Scan size={20} />
            </div>
            <input
              type="text"
              value={scanInput}
              onChange={(e) => setScanInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Scan or enter RFID EPC..."
              className="w-full h-14 pl-12 pr-4 rounded-xl text-[15px] font-medium text-[#0F172A] placeholder:text-[#94A3B8] border border-[#E2E8F0] bg-white outline-none focus:border-[#2E75B6] transition-colors"
            />
          </div>
          <button
            onClick={handleScan}
            className="h-14 px-5 rounded-xl text-[14px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90 whitespace-nowrap"
            style={{ backgroundColor: "#0B2545" }}
          >
            <span className="flex items-center gap-2">
              <Scan size={18} />
              Scan
            </span>
          </button>
        </div>
        <p className="text-[12px] text-[#94A3B8] mt-2">
          Try: EPC-3008-21445678901-0007 (matched), UNKNOWN, WRONG-PIECE, WRONG-LOC, PICKED, HELD
        </p>
      </div>

      <ScanResult
        scanState={scanState}
        setScanState={setScanState}
        scannedData={scannedData}
        setScannedData={setScannedData}
        onConfirm={handleConfirm}
        onRescan={handleRescan}
      />
    </div>
  );
}