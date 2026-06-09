"use client";

import { useState } from "react";

interface Step {
  id: string;
  label: string;
  letter: string;
}

const steps: Step[] = [
  { id: "identification", label: "Identification", letter: "A" },
  { id: "flight-routing", label: "Flight & Routing", letter: "B" },
  { id: "cargo-description", label: "Cargo Description", letter: "C" },
  { id: "document-uploads", label: "Document Uploads", letter: "D" },
  { id: "charges-payment", label: "Charges & Payment Intent", letter: "E" },
];

interface StepNavigationProps {
  activeStep: string;
  onChange: (id: string) => void;
  validationErrors: Record<string, string[]>;
  touchedSteps: string[];
}

export default function StepNavigation({
  activeStep,
  onChange,
  validationErrors,
  touchedSteps,
}: StepNavigationProps) {
  const activeIndex = steps.findIndex((s) => s.id === activeStep);

  return (
    <div className="flex flex-col gap-1">
      {steps.map((step, index) => {
        const isActive = step.id === activeStep;
        const isCompleted = index < activeIndex;
        const isTouched = touchedSteps.includes(step.id);
        const hasErrors = (validationErrors[step.id] || []).length > 0;

        return (
          <button
            key={step.id}
            onClick={() => onChange(step.id)}
            className="flex items-center gap-3 w-full text-left rounded-lg px-3 py-3 transition-all cursor-pointer"
            style={{
              backgroundColor: isActive ? "#EBF0F7" : "transparent",
            }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold flex-shrink-0"
              style={{
                backgroundColor: isActive
                  ? "#0B2545"
                  : isCompleted
                  ? "#16A34A"
                  : hasErrors && isTouched
                  ? "#DC2626"
                  : "#E2E8F0",
                color: isActive || isCompleted || (hasErrors && isTouched) ? "white" : "#64748B",
              }}
            >
              {isCompleted ? (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2.5 7L5.5 10L11.5 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                step.letter
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div
                className="text-[13px] font-semibold"
                style={{
                  color: isActive
                    ? "#0B2545"
                    : isCompleted
                    ? "#0F172A"
                    : "#64748B",
                }}
              >
                {step.label}
              </div>
              {hasErrors && isTouched && (
                <div className="text-[11px] text-[#DC2626] mt-0.5">
                  {validationErrors[step.id].length} error
                  {validationErrors[step.id].length > 1 ? "s" : ""}
                </div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}