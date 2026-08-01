"use client";

import { useState } from "react";
import { useToast } from "@/components/ToastContext";
import { CheckCircle, Circle } from "lucide-react";

interface RequirementItem {
  label: string;
  checked: boolean;
}

const defaultRequirements: RequirementItem[] = [
  { label: "DO issued", checked: true },
  { label: "Charges cleared", checked: false },
  { label: "Driver assigned", checked: false },
  { label: "Vehicle assigned", checked: false },
  { label: "Authority letter generated", checked: false },
  { label: "Pickup slot selected", checked: false },
  { label: "Gate pre-registration complete", checked: false },
];

export default function GateRequirementsPanel() {
  const { addToast } = useToast();
  const [requirements, setRequirements] = useState<RequirementItem[]>(defaultRequirements);

  const toggleRequirement = (index: number) => {
    setRequirements((prev) =>
      prev.map((r, i) => (i === index ? { ...r, checked: !r.checked } : r))
    );
    addToast(`${requirements[index].label} updated.`, "success");
  };

  const completedCount = requirements.filter((r) => r.checked).length;
  const progress = Math.round((completedCount / requirements.length) * 100);

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <h3 className="text-[15px] font-bold text-[#0F172A]">Gate Requirements</h3>
        </div>
        <span className="text-[12px] font-semibold text-[#64748B]">{completedCount}/{requirements.length}</span>
      </div>

      <div className="w-full h-2 rounded-full bg-[#F1F5F9] mb-4 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${progress}%`, backgroundColor: progress === 100 ? "#16A34A" : "#1B4F8B" }}
        />
      </div>

      <div className="space-y-2">
        {requirements.map((req, index) => (
          <button
            key={req.label}
            onClick={() => toggleRequirement(index)}
            className="w-full flex items-center gap-3 p-3 rounded-xl border border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors text-left cursor-pointer"
          >
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                backgroundColor: req.checked ? "#DCFCE7" : "#F1F5F9",
                border: `2px solid ${req.checked ? "#16A34A" : "#E2E8F0"}`,
              }}
            >
              {req.checked && <CheckCircle size={14} className="text-[#16A34A]" />}
              {!req.checked && <Circle size={14} className="text-[#94A3B8]" />}
            </div>
            <span className={`text-[13px] ${req.checked ? "font-semibold text-[#0F172A]" : "text-[#64748B]"}`}>
              {req.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}