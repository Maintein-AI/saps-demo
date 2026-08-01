"use client";

import { useState } from "react";
import { Camera, Upload, Check, X } from "lucide-react";

interface ExitData {
  gatePass: string;
  vehicleNumber: string;
  driverCnic: string;
  driverName: string;
  linkedDoc: string;
  expectedPieces: string;
  piecesCounted: string;
  exitTimestamp: string;
  gateGuard: string;
}

interface ExitConfirmationProps {
  data: ExitData;
  onChange: (field: string, value: string) => void;
}

export default function ExitConfirmation({ data, onChange }: ExitConfirmationProps) {
  const [driverSignature, setDriverSignature] = useState(false);
  const [vehiclePhoto, setVehiclePhoto] = useState(false);

  const readOnlyStyle = {
    backgroundColor: "#F8FAFC",
    color: "#64748B",
    borderColor: "#E2E8F0",
  };

  const renderInput = (field: string, label: string, value: string, readOnly: boolean = false, required: boolean = false) => (
    <div>
      <label className="block text-[13px] font-semibold text-[#0F172A] mb-2">
        {label}
        {required && <span className="text-[#DC2626] ml-1">*</span>}
      </label>
      <input
        type="text"
        value={value}
        readOnly={readOnly}
        onChange={(e) => !readOnly && onChange(field, e.target.value)}
        className="w-full h-12 px-4 rounded-xl border text-[14px] font-medium transition-colors outline-none"
        style={readOnly ? readOnlyStyle : { backgroundColor: "white", color: "#0F172A", borderColor: "#E2E8F0" }}
      />
    </div>
  );

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <Check size={20} className="text-[#1B4F8B]" />
        <h2 className="text-[18px] font-semibold text-[#0F172A] leading-[28px]">Exit Confirmation</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderInput("gatePass", "Gate Pass #", data.gatePass, true)}
        {renderInput("vehicleNumber", "Vehicle Number", data.vehicleNumber, true)}
        {renderInput("driverCnic", "Driver CNIC", data.driverCnic, true)}
        {renderInput("driverName", "Driver Name", data.driverName, true)}
        {renderInput("linkedDoc", "Linked AWB / DO", data.linkedDoc, true)}
        {renderInput("expectedPieces", "Expected Pieces", data.expectedPieces, true)}
        {renderInput("piecesCounted", "Pieces on Truck Counted", data.piecesCounted, false, true)}

        <div className="md:col-span-2">
          <label className="block text-[13px] font-semibold text-[#0F172A] mb-2">
            Driver Signature
            <span className="text-[#DC2626] ml-1">*</span>
          </label>
          <button
            onClick={() => setDriverSignature(!driverSignature)}
            className="w-full h-20 rounded-xl border-2 border-dashed flex items-center justify-center gap-3 cursor-pointer transition-colors"
            style={{
              borderColor: driverSignature ? "#16A34A" : "#E2E8F0",
              backgroundColor: driverSignature ? "#F0FDF4" : "#F8FAFC",
            }}
          >
            {driverSignature ? (
              <>
                <Check size={20} className="text-[#16A34A]" />
                <span className="text-[14px] font-semibold text-[#16A34A]">Signature captured</span>
              </>
            ) : (
              <>
                <SignatureIcon size={20} className="text-[#94A3B8]" />
                <span className="text-[14px] text-[#64748B]">Tap to capture signature</span>
              </>
            )}
          </button>
        </div>

        <div className="md:col-span-2">
          <label className="block text-[13px] font-semibold text-[#0F172A] mb-2">
            Vehicle Loaded Photo
            <span className="text-[#DC2626] ml-1">*</span>
          </label>
          <button
            onClick={() => setVehiclePhoto(!vehiclePhoto)}
            className="w-full h-20 rounded-xl border-2 border-dashed flex items-center justify-center gap-3 cursor-pointer transition-colors"
            style={{
              borderColor: vehiclePhoto ? "#16A34A" : "#E2E8F0",
              backgroundColor: vehiclePhoto ? "#F0FDF4" : "#F8FAFC",
            }}
          >
            {vehiclePhoto ? (
              <>
                <Check size={20} className="text-[#16A34A]" />
                <span className="text-[14px] font-semibold text-[#16A34A]">Photo captured</span>
              </>
            ) : (
              <>
                <Camera size={20} className="text-[#94A3B8]" />
                <span className="text-[14px] text-[#64748B]">Tap to capture vehicle loaded photo</span>
              </>
            )}
          </button>
        </div>

        <div>
          <label className="block text-[13px] font-semibold text-[#0F172A] mb-2">Exit Timestamp</label>
          <input
            type="text"
            value={data.exitTimestamp}
            readOnly
            className="w-full h-12 px-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-[14px] text-[#64748B] cursor-default"
          />
        </div>
        <div>
          <label className="block text-[13px] font-semibold text-[#0F172A] mb-2">Gate Guard</label>
          <input
            type="text"
            value={data.gateGuard}
            readOnly
            className="w-full h-12 px-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-[14px] text-[#64748B] cursor-default"
          />
        </div>
      </div>
    </div>
  );
}

function SignatureIcon({ size, className }: { size: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 17h18" />
      <path d="M6 17V9" />
      <path d="M10 17V9a2 2 0 1 1 4 0v8" />
      <path d="M14 17V9a2 2 0 1 1 4 0v8" />
    </svg>
  );
}