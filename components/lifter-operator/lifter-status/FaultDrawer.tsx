"use client";

import { useState } from "react";
import {
  X,
  AlertTriangle,
  Camera,
  Check,
  MapPin,
  Hash,
  Truck,
} from "lucide-react";

interface FaultDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  assetId: string;
  assetType: string;
  location: string;
  onSubmit: () => void;
}

const faultCategories = [
  "Battery",
  "Hydraulic",
  "Brake",
  "Tyre",
  "Fork",
  "Electrical",
  "Safety",
  "Other",
];

const severityLevels = [
  "Low",
  "Medium",
  "High",
  "Out-of-service",
];

export default function FaultDrawer({ isOpen, onClose, assetId, assetType, location, onSubmit }: FaultDrawerProps) {
  const [category, setCategory] = useState("");
  const [severity, setSeverity] = useState("");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [canContinue, setCanContinue] = useState<boolean | null>(null);

  const handleSubmit = () => {
    if (!category || !severity || !description) {
      return;
    }
    onSubmit();
    setCategory("");
    setSeverity("");
    setDescription("");
    setNotes("");
    setCanContinue(null);
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300"
          onClick={onClose}
        />
      )}
      <div
        className="fixed top-0 right-0 h-full bg-white shadow-xl z-[70] transition-transform duration-300 ease-out flex flex-col"
        style={{
          width: "100%",
          maxWidth: 420,
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
        }}
      >
        <div className="flex items-center justify-between px-5 h-[64px] border-b border-[#E2E8F0] flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <h2 className="text-[16px] font-bold text-[#0F172A]">Lifter Fault Report</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Asset Summary */}
          <div className="bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FEE2E2] flex items-center justify-center">
                <AlertTriangle size={18} className="text-[#DC2626]" />
              </div>
              <div>
                <p className="text-[14px] font-bold text-[#0F172A]">{assetId}</p>
                <p className="text-[12px] text-[#64748B]">{assetType}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[13px] text-[#64748B]">
              <MapPin size={14} className="text-[#94A3B8]" />
              {location}
            </div>
          </div>

          {/* Fault Category */}
          <div>
            <label className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider mb-2 block">
              Fault Category
            </label>
            <div className="flex flex-wrap gap-2">
              {faultCategories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className="h-11 px-4 rounded-xl text-[13px] font-semibold border whitespace-nowrap cursor-pointer transition-colors"
                  style={{
                    backgroundColor: category === c ? "#DC2626" : "#F8FAFC",
                    color: category === c ? "#FFFFFF" : "#64748B",
                    borderColor: category === c ? "#DC2626" : "#E2E8F0",
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Severity */}
          <div>
            <label className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider mb-2 block">
              Severity
            </label>
            <div className="flex flex-wrap gap-2">
              {severityLevels.map((s) => {
                const severityColor =
                  s === "Out-of-service"
                    ? "#DC2626"
                    : s === "High"
                    ? "#D97706"
                    : s === "Medium"
                    ? "#D97706"
                    : "#2E75B6";
                return (
                  <button
                    key={s}
                    onClick={() => setSeverity(s)}
                    className="h-11 px-4 rounded-xl text-[13px] font-semibold border whitespace-nowrap cursor-pointer transition-colors"
                    style={{
                      backgroundColor: severity === s ? severityColor : "#F8FAFC",
                      color: severity === s ? "#FFFFFF" : "#64748B",
                      borderColor: severity === s ? severityColor : "#E2E8F0",
                    }}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5 block">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the fault in detail..."
              maxLength={500}
              className="w-full h-24 rounded-xl text-[14px] text-[#0F172A] placeholder:text-[#94A3B8] p-3 border border-[#E2E8F0] outline-none focus:border-[#DC2626] resize-none"
              style={{ backgroundColor: "#F8FAFC" }}
            />
          </div>

          {/* Photo Upload */}
          <div>
            <label className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5 block">
              Photo Upload
            </label>
            <div className="w-full h-24 rounded-xl border border-dashed border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-center cursor-pointer hover:bg-[#F1F5F9] transition-colors">
              <div className="flex items-center gap-2 text-[#94A3B8]">
                <Camera size={18} />
                <span className="text-[13px]">Tap to upload photos</span>
              </div>
            </div>
          </div>

          {/* Current Location */}
          <div>
            <label className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5 block">
              Current Location
            </label>
            <input
              type="text"
              value={location}
              readOnly
              className="w-full h-12 rounded-xl text-[14px] text-[#0F172A] p-3 border border-[#E2E8F0] bg-[#F1F5F9] font-medium"
            />
          </div>

          {/* Can Continue Working */}
          <div>
            <label className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider mb-2 block">
              Can Continue Working?
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setCanContinue(true)}
                className="flex-1 h-12 rounded-xl text-[14px] font-semibold border whitespace-nowrap cursor-pointer transition-colors"
                style={{
                  backgroundColor: canContinue === true ? "#16A34A" : "#F8FAFC",
                  color: canContinue === true ? "#FFFFFF" : "#64748B",
                  borderColor: canContinue === true ? "#16A34A" : "#E2E8F0",
                }}
              >
                <span className="flex items-center justify-center gap-2">
                  <Check size={16} />
                  Yes
                </span>
              </button>
              <button
                onClick={() => setCanContinue(false)}
                className="flex-1 h-12 rounded-xl text-[14px] font-semibold border whitespace-nowrap cursor-pointer transition-colors"
                style={{
                  backgroundColor: canContinue === false ? "#DC2626" : "#F8FAFC",
                  color: canContinue === false ? "#FFFFFF" : "#64748B",
                  borderColor: canContinue === false ? "#DC2626" : "#E2E8F0",
                }}
              >
                <span className="flex items-center justify-center gap-2">
                  <AlertTriangle size={16} />
                  No
                </span>
              </button>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5 block">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional notes..."
              maxLength={500}
              className="w-full h-20 rounded-xl text-[14px] text-[#0F172A] placeholder:text-[#94A3B8] p-3 border border-[#E2E8F0] outline-none focus:border-[#DC2626] resize-none"
              style={{ backgroundColor: "#F8FAFC" }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-[#E2E8F0] flex-shrink-0 space-y-2">
          <button
            onClick={handleSubmit}
            className="w-full h-14 rounded-xl text-[15px] font-bold text-white cursor-pointer transition-colors hover:opacity-90 flex items-center justify-center gap-2 whitespace-nowrap"
            style={{ backgroundColor: "#DC2626" }}
          >
            <AlertTriangle size={16} />
            Submit Fault Report
          </button>
          <button
            onClick={onClose}
            className="w-full h-12 rounded-xl text-[14px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer transition-colors whitespace-nowrap"
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}