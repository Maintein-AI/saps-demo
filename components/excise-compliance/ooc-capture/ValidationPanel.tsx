"use client";

import { useState } from "react";
import { useToast } from "@/components/ToastContext";
import ScopeBadge from "@/components/ScopeBadge";
import { CheckCircle, Circle, AlertTriangle, Shield, Lock, FileText, Package, Check } from "lucide-react";

interface AwbSummary {
  awb: string;
  gd: string;
  channel: string;
  cha: string;
  consignee: string;
  cargoClass: string;
  pieces: string;
  weight: string;
  status: string;
  holdStatus: string;
}

interface ValidationPanelProps {
  awb: AwbSummary;
}

interface CheckItem {
  label: string;
  icon: React.ReactNode;
  pass: boolean;
}

export default function ValidationPanel({ awb }: ValidationPanelProps) {
  const { addToast } = useToast();
  const hasNoHold = awb.holdStatus === "No active hold";
  const isOOCStatus = awb.status === "OOC Pending" || awb.status === "Examined";

  const [items, setItems] = useState<CheckItem[]>([
    {
      label: "OOC reference entered",
      icon: <FileText size={14} className="text-[#1B4F8B]" />,
      pass: false,
    },
    {
      label: "OOC PDF uploaded",
      icon: <FileText size={14} className="text-[#1B4F8B]" />,
      pass: false,
    },
    {
      label: "Duty paid recorded",
      icon: <Package size={14} className="text-[#D97706]" />,
      pass: false,
    },
    {
      label: "Tax paid recorded",
      icon: <Package size={14} className="text-[#D97706]" />,
      pass: false,
    },
    {
      label: "No active customs hold",
      icon: <Shield size={14} className="text-[#16A34A]" />,
      pass: hasNoHold,
    },
    {
      label: "No ANF hold",
      icon: <Lock size={14} className="text-[#DC2626]" />,
      pass: !awb.holdStatus.includes("ANF"),
    },
    {
      label: "No ASF hold",
      icon: <Lock size={14} className="text-[#DC2626]" />,
      pass: !awb.holdStatus.includes("ASF"),
    },
    {
      label: "No discrepancy hold",
      icon: <AlertTriangle size={14} className="text-[#D97706]" />,
      pass: !awb.holdStatus.includes("discrepancy"),
    },
    {
      label: "AWB status eligible for release",
      icon: <CheckCircle size={14} className="text-[#16A34A]" />,
      pass: isOOCStatus,
    },
  ]);

  const passCount = items.filter((i) => i.pass).length;
  const failCount = items.filter((i) => !i.pass).length;
  const progress = (passCount / items.length) * 100;

  const toggleItem = (index: number) => {
    const updated = [...items];
    updated[index].pass = !updated[index].pass;
    setItems(updated);
    addToast(
      `${updated[index].label} ${updated[index].pass ? "marked ready" : "marked pending"}`,
      "success"
    );
  };

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2.5">
          <h2 className="text-[15px] font-bold text-[#0F172A]">Release Readiness</h2>
          <ScopeBadge type="inc" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-full">
            {passCount} PASS
          </span>
          <span className="text-[11px] font-bold text-[#DC2626] bg-[#FEE2E2] px-2 py-0.5 rounded-full">
            {failCount} PENDING
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[12px] font-semibold text-[#64748B]">Readiness</span>
            <span className="text-[12px] font-bold text-[#0F172A]">{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-[#F1F5F9] overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${progress}%`,
                backgroundColor: progress >= 80 ? "#16A34A" : progress >= 50 ? "#D97706" : "#DC2626",
              }}
            />
          </div>
        </div>

        <div className="space-y-2">
          {items.map((item, index) => (
            <button
              key={item.label}
              onClick={() => toggleItem(index)}
              className="w-full flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all text-left"
              style={{
                backgroundColor: item.pass ? "#DCFCE7" : "#F8FAFC",
                borderColor: item.pass ? "#86EFAC" : "#E2E8F0",
              }}
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor: item.pass ? "#16A34A" : "#F1F5F9",
                }}
              >
                {item.pass ? (
                  <Check size={14} className="text-white" />
                ) : (
                  <div className="text-[#94A3B8]">{item.icon}</div>
                )}
              </div>
              <span
                className="text-[13px] font-semibold flex-1"
                style={{
                  color: item.pass ? "#16A34A" : "#475569",
                }}
              >
                {item.label}
              </span>
              {item.pass ? (
                <span className="text-[10px] font-bold text-[#16A34A] bg-white/60 px-2 py-0.5 rounded-full">
                  PASS
                </span>
              ) : (
                <span className="text-[10px] font-bold text-[#D97706] bg-[#FEF3C7] px-2 py-0.5 rounded-full">
                  PENDING
                </span>
              )}
            </button>
          ))}
        </div>

        {passCount >= 7 && (
          <div className="mt-4 p-3 rounded-xl border border-[#86EFAC] bg-[#DCFCE7]">
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-[#16A34A]" />
              <span className="text-[13px] font-semibold text-[#16A34A]">
                Cargo ready for release
              </span>
            </div>
          </div>
        )}

        {failCount >= 5 && (
          <div className="mt-4 p-3 rounded-xl border border-[#FECACA] bg-[#FEE2E2]">
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} className="text-[#DC2626]" />
              <span className="text-[13px] font-semibold text-[#DC2626]">
                Cannot release — requirements pending
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}