"use client";

import { useState } from "react";
import { Shield, CheckCircle2, XCircle, AlertTriangle, FileCheck, CreditCard, Ban, Truck, User, FileText, Clock } from "lucide-react";

interface VerificationPanelProps {
  vehicleNumber: string;
  driverCnic: string;
  driverName: string;
  purpose: string;
  linkedDoc: string;
}

export default function VerificationPanel({
  vehicleNumber,
  driverCnic,
  driverName,
  purpose,
  linkedDoc,
}: VerificationPanelProps) {
  const [recommendation, setRecommendation] = useState<string | null>(null);

  const cnicValid = driverCnic.length === 13 && /^\d{13}$/.test(driverCnic);
  const vehicleValid = vehicleNumber.length >= 5 && /^[A-Z]{3}-\d{4}$/.test(vehicleNumber.toUpperCase());
  const hasDriver = driverName.length > 0;
  const isCargoPickup = purpose === "Cargo pickup";
  const hasDoc = linkedDoc.length > 0;

  const checks = [
    {
      label: "CNIC Valid",
      valid: cnicValid,
      icon: User,
      detail: cnicValid ? "Registered in NADRA" : "Invalid format or not found",
    },
    {
      label: "Driver Visit History",
      valid: hasDriver,
      icon: Truck,
      detail: hasDriver ? "12 previous visits, last: 14 May 2026" : "No history found",
    },
    {
      label: "Vehicle Status",
      valid: vehicleValid,
      icon: Shield,
      detail: vehicleValid ? "Vehicle registered, no blacklists" : "Invalid format",
    },
    {
      label: "Authority Letter",
      valid: !isCargoPickup || true,
      icon: FileText,
      detail: !isCargoPickup ? "Not required for this purpose" : "Valid, expires 15 Jun 2026",
    },
    {
      label: "DO / AWB Validation",
      valid: !isCargoPickup || hasDoc,
      icon: FileCheck,
      detail: !isCargoPickup ? "Not required" : hasDoc ? "DO found, status: Ready" : "DO not provided",
    },
    {
      label: "Payment Status",
      valid: true,
      icon: CreditCard,
      detail: "No outstanding charges",
    },
    {
      label: "Customs Hold",
      valid: true,
      icon: Ban,
      detail: "No customs hold",
    },
  ];

  const allPass = checks.every((c) => c.valid);

  const autoRec = allPass ? "Allow" : "Hold";

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm sticky top-4"
    >
      <div className="flex items-center gap-3 mb-6">
        <Shield size={20} className="text-[#1B4F8B]" />
        <h2 className="text-[18px] font-semibold text-[#0F172A] leading-[28px]">
          Verification Summary
        </h2>
        <span className="inline-flex items-center justify-center h-[22px] px-2.5 rounded-full text-[11px] font-bold tracking-[0.3px] lowercase select-none text-white bg-[#16A34A]">
          inc.
        </span>
      </div>

      <div className="space-y-3 mb-6">
        {checks.map((check, i) => {
          const Icon = check.icon;
          return (
            <div
              key={i}
              className="flex items-start gap-3 p-3 rounded-xl border transition-colors"
              style={{
                borderColor: check.valid ? "#DCFCE7" : "#FEE2E2",
                backgroundColor: check.valid ? "#F0FDF4" : "#FEF2F2",
              }}
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: check.valid ? "#DCFCE7" : "#FEE2E2" }}
              >
                {check.valid ? (
                  <CheckCircle2 size={16} className="text-[#16A34A]" />
                ) : (
                  <XCircle size={16} className="text-[#DC2626]" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-semibold text-[#0F172A]">
                    {check.label}
                  </span>
                  <span
                    className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: check.valid ? "#DCFCE7" : "#FEE2E2",
                      color: check.valid ? "#16A34A" : "#DC2626",
                    }}
                  >
                    {check.valid ? "PASS" : "FAIL"}
                  </span>
                </div>
                <p className="text-[12px] text-[#64748B] mt-0.5">{check.detail}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Final Recommendation */}
      <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle size={16} className="text-[#D97706]" />
          <h3 className="text-[14px] font-semibold text-[#0F172A]">
            Final Recommendation
          </h3>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[13px] text-[#64748B]">Auto:</span>
          <span
            className="text-[14px] font-bold px-3 py-1 rounded-full"
            style={{
              backgroundColor: autoRec === "Allow" ? "#DCFCE7" : "#FEF3C7",
              color: autoRec === "Allow" ? "#16A34A" : "#D97706",
            }}
          >
            {autoRec}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {["Allow", "Hold", "Reject"].map((rec) => (
            <button
              key={rec}
              onClick={() => setRecommendation(rec)}
              className="h-10 px-4 rounded-xl text-[13px] font-semibold whitespace-nowrap cursor-pointer transition-all"
              style={{
                backgroundColor:
                  recommendation === rec
                    ? rec === "Allow"
                      ? "#16A34A"
                      : rec === "Hold"
                        ? "#D97706"
                        : "#DC2626"
                    : rec === "Allow"
                      ? "#DCFCE7"
                      : rec === "Hold"
                        ? "#FEF3C7"
                        : "#FEE2E2",
                color:
                  recommendation === rec
                    ? "white"
                    : rec === "Allow"
                      ? "#16A34A"
                      : rec === "Hold"
                        ? "#D97706"
                        : "#DC2626",
              }}
            >
              {rec}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Info */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-[12px] text-[#64748B]">
          <Clock size={13} className="text-[#94A3B8]" />
          <span>Entry: {new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</span>
        </div>
        <div className="flex items-center gap-2 text-[12px] text-[#64748B]">
          <User size={13} className="text-[#94A3B8]" />
          <span>Guard: Sgt. Imran Haider</span>
        </div>
      </div>
    </div>
  );
}