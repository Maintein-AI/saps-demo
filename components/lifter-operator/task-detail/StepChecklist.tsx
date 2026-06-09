"use client";

import { CheckCircle2, Circle, ArrowRight } from "lucide-react";
import ScopeBadge from "@/components/ScopeBadge";

interface StepChecklistProps {
  currentStep: number;
  taskType: string;
}

const steps = [
  { label: "Arrive at source location", icon: "map" },
  { label: "Scan piece RFID", icon: "scan" },
  { label: "Pick piece", icon: "pick" },
  { label: "Move to destination", icon: "move" },
  { label: "Scan destination", icon: "scan" },
  { label: "Confirm drop-off", icon: "confirm" },
];

function getStepIcon(step: number, currentStep: number) {
  if (step < currentStep) {
    return (
      <div className="w-10 h-10 rounded-full bg-[#16A34A] flex items-center justify-center flex-shrink-0">
        <CheckCircle2 size={20} className="text-white" />
      </div>
    );
  }
  if (step === currentStep) {
    return (
      <div className="w-10 h-10 rounded-full bg-[#0B2545] flex items-center justify-center flex-shrink-0 ring-4 ring-[#0B2545]/20">
        <ArrowRight size={20} className="text-white" />
      </div>
    );
  }
  return (
    <div className="w-10 h-10 rounded-full bg-[#E2E8F0] flex items-center justify-center flex-shrink-0">
      <Circle size={20} className="text-[#94A3B8]" />
    </div>
  );
}

function getStepLabel(step: number, currentStep: number) {
  if (step < currentStep) return "Completed";
  if (step === currentStep) return "In Progress";
  return "Pending";
}

function getStepLabelColor(step: number, currentStep: number) {
  if (step < currentStep) return "#16A34A";
  if (step === currentStep) return "#0B2545";
  return "#94A3B8";
}

export default function StepChecklist({ currentStep }: StepChecklistProps) {
  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-[15px] font-bold text-[#0F172A]">Task Steps</h3>
        <ScopeBadge type="inc" />
        <span className="text-[12px] text-[#64748B] ml-auto">
          {currentStep} of {steps.length} completed
        </span>
      </div>

      <div className="space-y-2">
        {steps.map((step, index) => {
          const stepNum = index + 1;
          const isActive = stepNum === currentStep;
          const isCompleted = stepNum < currentStep;
          const isPending = stepNum > currentStep;

          return (
            <div
              key={stepNum}
              className="flex items-center gap-4 p-3 rounded-xl transition-colors"
              style={{
                backgroundColor: isActive ? "#EBF0F7" : isCompleted ? "#F8FAFC" : "transparent",
                border: isActive ? "1px solid #0B2545" : "1px solid transparent",
              }}
            >
              {getStepIcon(stepNum, currentStep)}
              <div className="flex-1 min-w-0">
                <p
                  className="text-[14px] font-semibold"
                  style={{
                    color: isPending ? "#94A3B8" : "#0F172A",
                    textDecoration: isCompleted ? "line-through" : "none",
                  }}
                >
                  {stepNum}. {step.label}
                </p>
              </div>
              <span
                className="text-[12px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap"
                style={{
                  color: getStepLabelColor(stepNum, currentStep),
                  backgroundColor: isCompleted ? "#DCFCE7" : isActive ? "#DBEAFE" : "#F1F5F9",
                }}
              >
                {getStepLabel(stepNum, currentStep)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}