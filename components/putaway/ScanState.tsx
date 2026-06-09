"use client";

import { ScanLine, CheckCircle, XCircle, AlertTriangle, Clock, Radio } from "lucide-react";

interface ScanStateProps {
  state: "waiting" | "matched" | "unknown" | "duplicate" | "wrong_class" | "full" | "scanning";
}

const stateConfig: Record<string, { icon: React.ReactNode; color: string; bg: string; text: string; label: string }> = {
  waiting: {
    icon: <ScanLine size={20} />,
    color: "#94A3B8",
    bg: "#F1F5F9",
    text: "#64748B",
    label: "Waiting for Scan",
  },
  scanning: {
    icon: <Radio size={20} />,
    color: "#1B4F8B",
    bg: "#DBEAFE",
    text: "#1B4F8B",
    label: "Scanning...",
  },
  matched: {
    icon: <CheckCircle size={20} />,
    color: "#16A34A",
    bg: "#DCFCE7",
    text: "#16A34A",
    label: "RFID Matched",
  },
  unknown: {
    icon: <XCircle size={20} />,
    color: "#DC2626",
    bg: "#FEF2F2",
    text: "#DC2626",
    label: "Unknown RFID",
  },
  duplicate: {
    icon: <AlertTriangle size={20} />,
    color: "#D97706",
    bg: "#FEF3C7",
    text: "#D97706",
    label: "Duplicate Scan",
  },
  wrong_class: {
    icon: <XCircle size={20} />,
    color: "#DC2626",
    bg: "#FEF2F2",
    text: "#DC2626",
    label: "Wrong Cargo Class",
  },
  full: {
    icon: <XCircle size={20} />,
    color: "#DC2626",
    bg: "#FEF2F2",
    text: "#DC2626",
    label: "Location Full",
  },
};

export default function ScanState({ state }: ScanStateProps) {
  const config = stateConfig[state];

  return (
    <div className="flex items-center justify-center">
      <div
        className="flex items-center gap-3 h-11 px-5 rounded-full border"
        style={{
          backgroundColor: config.bg,
          borderColor: config.color,
          color: config.text,
        }}
      >
        <div style={{ color: config.color }}>{config.icon}</div>
        <span className="text-[13px] font-semibold">{config.label}</span>
      </div>
    </div>
  );
}