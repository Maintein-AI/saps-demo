"use client";

import { useState } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";
import ScopeBadge from "@/components/ScopeBadge";
import { useToast } from "@/components/ToastContext";

interface ChannelSummaryProps {
  onViewChannel: (channel: string) => void;
}

export default function ChannelSummary({ onViewChannel }: ChannelSummaryProps) {
  const { addToast } = useToast();

  const channels = [
    {
      name: "Green",
      count: 18,
      bg: "#DCFCE7",
      text: "#16A34A",
      icon: <CheckCircle2 size={20} />,
      subtitle: "Cleared / Released",
    },
    {
      name: "Yellow",
      count: 12,
      bg: "#FEF3C7",
      text: "#D97706",
      icon: <AlertTriangle size={20} />,
      subtitle: "Queries / Review",
    },
    {
      name: "Red",
      count: 5,
      bg: "#FEE2E2",
      text: "#DC2626",
      icon: <ShieldAlert size={20} />,
      subtitle: "Exam / Hold",
    },
  ];

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <h3 className="text-[15px] font-bold text-[#0F172A]">Channel Summary</h3>
          <ScopeBadge type="exc" />
        </div>
      </div>

      <div className="space-y-3">
        {channels.map((ch) => (
          <div
            key={ch.name}
            className="flex items-center justify-between p-4 rounded-xl border border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
            onClick={() => {
              onViewChannel(ch.name);
              addToast(`${ch.name} channel details opened.`, "success");
            }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: ch.bg, color: ch.text }}>
                {ch.icon}
              </div>
              <div>
                <p className="text-[14px] font-bold text-[#0F172A]">{ch.name} Channel</p>
                <p className="text-[12px] text-[#64748B]">{ch.subtitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[22px] font-bold text-[#0F172A]">{ch.count}</span>
              <ArrowRight size={16} className="text-[#94A3B8]" />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-[#E2E8F0] flex items-center justify-between">
        <span className="text-[12px] text-[#64748B]">Total active GDs</span>
        <span className="text-[14px] font-bold text-[#0F172A]">35</span>
      </div>
    </div>
  );
}