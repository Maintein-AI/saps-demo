"use client";

import { useState, useCallback } from "react";
import { Upload, Camera, FileText, Search, Link, X, Check } from "lucide-react";
import ScopeBadge from "@/components/ScopeBadge";
import { useToast } from "@/components/ToastContext";

const MOCK_VEHICLE_ENTRIES = [
  { id: "VE-2026-001", label: "VE-2026-001 — LHR-2847 (Ahmed Khan)" },
  { id: "VE-2026-002", label: "VE-2026-002 — KHI-9912 (Muhammad Ali)" },
  { id: "VE-2026-003", label: "VE-2026-003 — ISB-3345 (Tariq Mehmood)" },
  { id: "VE-2026-004", label: "VE-2026-004 — LHR-7781 (Sajid Hussain)" },
  { id: "VE-2026-005", label: "VE-2026-005 — KHI-5543 (Imran Ahmed)" },
];

const MOCK_AWBS = [
  { id: "AWB-157-44891233", label: "AWB-157-44891233 — Electronics" },
  { id: "AWB-157-33219876", label: "AWB-157-33219876 — Pharmaceuticals" },
  { id: "DO-2026-8891", label: "DO-2026-8891 — Auto Parts" },
  { id: "DO-2026-4452", label: "DO-2026-4452 — Textiles" },
  { id: "AWB-157-77823456", label: "AWB-157-77823456 — Machinery" },
];

interface UploadScanCardProps {
  onFileUpload: (file: File) => void;
  onCameraCapture: () => void;
  onRunOCR: () => void;
  hasFile: boolean;
  isOCRRunning: boolean;
}

export default function UploadScanCard({
  onFileUpload,
  onCameraCapture,
  onRunOCR,
  hasFile,
  isOCRRunning,
}: UploadScanCardProps) {
  const { addToast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [showVehicleSearch, setShowVehicleSearch] = useState(false);
  const [showAwbSearch, setShowAwbSearch] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [selectedAwb, setSelectedAwb] = useState("");
  const [vehicleQuery, setVehicleQuery] = useState("");
  const [awbQuery, setAwbQuery] = useState("");
  const [cameraActive, setCameraActive] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) {
        handleFile(file);
      }
    },
    []
  );

  const handleFile = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      addToast("File exceeds 5MB limit", "error");
      return;
    }
    if (!["application/pdf", "image/jpeg", "image/png"].includes(file.type)) {
      addToast("Only PDF, JPG, PNG files allowed", "error");
      return;
    }
    setUploadedFile(file);
    onFileUpload(file);
    addToast(`File "${file.name}" uploaded`, "success");
  };

  const handleBrowse = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.jpg,.jpeg,.png";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) handleFile(file);
    };
    input.click();
  };

  const handleCamera = () => {
    setCameraActive(true);
    setTimeout(() => {
      setCameraActive(false);
      onCameraCapture();
      addToast("Photo captured from camera", "success");
    }, 1500);
  };

  const filteredVehicles = MOCK_VEHICLE_ENTRIES.filter((v) =>
    v.label.toLowerCase().includes(vehicleQuery.toLowerCase())
  );

  const filteredAwbs = MOCK_AWBS.filter((a) =>
    a.label.toLowerCase().includes(awbQuery.toLowerCase())
  );

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[14px] font-bold text-[#0F172A]">Upload or Scan</h3>
        <ScopeBadge type="exc" />
      </div>

      <div
        className="rounded-xl border-2 border-dashed p-6 text-center transition-colors cursor-pointer"
        style={{
          borderColor: isDragging ? "#0B2545" : "#E2E8F0",
          backgroundColor: isDragging ? "#EBF0F7" : "#F8FAFC",
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleBrowse}
      >
        {uploadedFile ? (
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#0B2545] flex items-center justify-center">
              <FileText size={20} className="text-white" />
            </div>
            <div className="text-left">
              <p className="text-[13px] font-semibold text-[#0F172A]">{uploadedFile.name}</p>
              <p className="text-[11px] text-[#64748B]">
                {(uploadedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setUploadedFile(null);
                setSelectedVehicle("");
                setSelectedAwb("");
              }}
              className="w-7 h-7 rounded-lg hover:bg-[#F1F5F9] flex items-center justify-center text-[#64748B] cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 rounded-xl bg-[#EBF0F7] flex items-center justify-center mx-auto mb-3">
              <Upload size={22} className="text-[#0B2545]" />
            </div>
            <p className="text-[13px] font-semibold text-[#0F172A] mb-1">
              Drag & drop authority letter
            </p>
            <p className="text-[12px] text-[#64748B] mb-3">
              PDF, JPG, PNG up to 5 MB
            </p>
            <button className="h-8 px-4 rounded-lg text-[12px] font-semibold text-white bg-[#0B2545] cursor-pointer">
              Browse Files
            </button>
          </>
        )}
      </div>

      <div className="flex items-center gap-3 my-4">
        <div className="flex-1 h-px bg-[#E2E8F0]" />
        <span className="text-[11px] text-[#94A3B8] font-medium">OR</span>
        <div className="flex-1 h-px bg-[#E2E8F0]" />
      </div>

      <button
        onClick={handleCamera}
        disabled={cameraActive}
        className="w-full flex items-center justify-center gap-2 h-10 rounded-lg border border-[#E2E8F0] text-[13px] font-semibold text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer transition-colors disabled:opacity-60"
      >
        {cameraActive ? (
          <>
            <div className="w-4 h-4 rounded-full border-2 border-[#0B2545] border-t-transparent animate-spin" />
            Capturing...
          </>
        ) : (
          <>
            <Camera size={16} />
            Scan from Camera
          </>
        )}
      </button>

      {hasFile && (
        <div className="mt-4 pt-4 border-t border-[#E2E8F0] space-y-3">
          <div className="relative">
            <label className="text-[12px] font-semibold text-[#0F172A] mb-1.5 block">
              Linked Vehicle Entry
            </label>
            <div className="relative">
              <button
                onClick={() => setShowVehicleSearch(!showVehicleSearch)}
                className="w-full flex items-center justify-between h-10 px-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] text-[13px] text-[#0F172A] cursor-pointer"
              >
                <span className={selectedVehicle ? "text-[#0F172A]" : "text-[#94A3B8]"}>
                  {selectedVehicle || "Search vehicle entry..."}
                </span>
                <Search size={14} className="text-[#94A3B8]" />
              </button>
              {showVehicleSearch && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg border border-[#E2E8F0] shadow-lg z-20 max-h-48 overflow-auto">
                  <div className="p-2">
                    <input
                      type="text"
                      value={vehicleQuery}
                      onChange={(e) => setVehicleQuery(e.target.value)}
                      placeholder="Search..."
                      className="w-full h-8 px-2.5 rounded-lg border border-[#E2E8F0] text-[12px] outline-none focus:border-[#0B2545]"
                    />
                  </div>
                  {filteredVehicles.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => {
                        setSelectedVehicle(v.label);
                        setShowVehicleSearch(false);
                      }}
                      className="w-full text-left px-3 py-2 text-[12px] hover:bg-[#F8FAFC] cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Link size={12} className="text-[#94A3B8]" />
                        {v.label}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="relative">
            <label className="text-[12px] font-semibold text-[#0F172A] mb-1.5 block">
              Linked AWB / DO
            </label>
            <div className="relative">
              <button
                onClick={() => setShowAwbSearch(!showAwbSearch)}
                className="w-full flex items-center justify-between h-10 px-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] text-[13px] text-[#0F172A] cursor-pointer"
              >
                <span className={selectedAwb ? "text-[#0F172A]" : "text-[#94A3B8]"}>
                  {selectedAwb || "Search AWB / DO..."}
                </span>
                <Search size={14} className="text-[#94A3B8]" />
              </button>
              {showAwbSearch && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg border border-[#E2E8F0] shadow-lg z-20 max-h-48 overflow-auto">
                  <div className="p-2">
                    <input
                      type="text"
                      value={awbQuery}
                      onChange={(e) => setAwbQuery(e.target.value)}
                      placeholder="Search..."
                      className="w-full h-8 px-2.5 rounded-lg border border-[#E2E8F0] text-[12px] outline-none focus:border-[#0B2545]"
                    />
                  </div>
                  {filteredAwbs.map((a) => (
                    <button
                      key={a.id}
                      onClick={() => {
                        setSelectedAwb(a.label);
                        setShowAwbSearch(false);
                      }}
                      className="w-full text-left px-3 py-2 text-[12px] hover:bg-[#F8FAFC] cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Link size={12} className="text-[#94A3B8]" />
                        {a.label}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button
            onClick={onRunOCR}
            disabled={isOCRRunning}
            className="w-full flex items-center justify-center gap-2 h-10 rounded-lg text-[13px] font-semibold text-white cursor-pointer transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#0B2545" }}
          >
            {isOCRRunning ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                Running OCR...
              </>
            ) : (
              <>
                <FileText size={16} />
                Run OCR
              </>
            )}
          </button>
        </div>
      )}

      {hasFile && !uploadedFile && (
        <div className="mt-3 flex items-center gap-2 text-[12px] text-[#16A34A]">
          <Check size={14} />
          Photo captured and ready
        </div>
      )}
    </div>
  );
}