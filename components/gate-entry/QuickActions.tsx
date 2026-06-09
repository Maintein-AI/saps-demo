"use client";

import { ArrowUpRight, ArrowDownRight, Ban, Eye, CheckCircle2 } from "lucide-react";

interface QuickActionsProps {
  onAction?: (action: string) => void;
}

export default function QuickActions({ onAction }: QuickActionsProps) {
  const actions = [
    {
      label: "Open Vehicle Entry",
      icon: ArrowUpRight,
      color: "#0B2545",
      bg: "#EBF0F7",
      text: "#0B2545",
    },
    {
      label: "Open Vehicle Exit",
      icon: ArrowDownRight,
      color: "#1B4F8B",
      bg: "#DBEAFE",
      text: "#1B4F8B",
    },
    {
      label: "Hold for Verification",
      icon: Ban,
      color: "#D97706",
      bg: "#FEF3C7",
      text: "#D97706",
    },
    {
      label: "Reject",
      icon: Ban,
      color: "#DC2626",
      bg: "#FEE2E2",
      text: "#DC2626",
    },
    {
      label: "View Gate Pass",
      icon: Eye,
      color: "#64748B",
      bg: "#F1F5F9",
      text: "#64748B",
    },
    {
      label: "Cleared",
      icon: CheckCircle2,
      color: "#16A34A",
      bg: "#DCFCE7",
      text: "#16A34A",
    },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <button
            key={action.label}
            onClick={() => onAction?.(action.label)}
            className="flex items-center gap-2 h-10 px-4 rounded-xl text-[13px] font-semibold whitespace-nowrap cursor-pointer transition-all hover:shadow-sm"
            style={{ backgroundColor: action.bg, color: action.text }}
          >
            <Icon size={16} />
            {action.label}
          </button>
        );
      })}
    </div>
  );
}