"use client";

import ScopeBadge from "@/components/ScopeBadge";
import { CheckCircle2, Circle, FileText, ShieldCheck, Pen, Lock, ArrowRight } from "lucide-react";

interface WorkflowStepperProps {
  selectedWaiver: any | null;
}

const steps = [
  { key: "request", label: "Requester submits waiver", icon: Pen },
  { key: "approve", label: "Finance Head approves/rejects", icon: ShieldCheck },
  { key: "credit", label: "Credit note created", icon: FileText },
  { key: "update", label: "Invoice updated", icon: FileText },
  { key: "lock", label: "Audit locked", icon: Lock },
];

export default function WorkflowStepper({ selectedWaiver }: WorkflowStepperProps) {
  const getStepStatus = (index: number) => {
    if (!selectedWaiver) return "pending";
    if (index === 0) return "completed";
    if (index === 1) {
      if (selectedWaiver.status === "Approved" || selectedWaiver.status === "Rejected" || selectedWaiver.status === "Clarification") return "completed";
      if (selectedWaiver.reviewStarted) return "active";
      return "pending";
    }
    if (index === 2) {
      if (selectedWaiver.creditNoteCreated) return "completed";
      if (selectedWaiver.status === "Approved" && selectedWaiver.reviewStarted) return "active";
      return "pending";
    }
    if (index === 3) {
      if (selectedWaiver.invoiceUpdated) return "completed";
      if (selectedWaiver.creditNoteCreated) return "active";
      return "pending";
    }
    if (index === 4) {
      if (selectedWaiver.auditLocked) return "completed";
      if (selectedWaiver.invoiceUpdated) return "active";
      return "pending";
    }
    return "pending";
  };

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2.5">
          <h2 className="text-[15px] font-bold text-[#0F172A]">Workflow Stages</h2>
          <ScopeBadge type="inc" />
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const status = getStepStatus(index);
            const isCompleted = status === "completed";
            const isActive = status === "active";
            const isLast = index === steps.length - 1;

            return (
              <div key={step.key} className="flex items-center">
                <div className="flex flex-col items-center gap-2">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                    style={{
                      backgroundColor: isCompleted
                        ? "#DCFCE7"
                        : isActive
                        ? "#DBEAFE"
                        : "#F1F5F9",
                    }}
                  >
                    {isCompleted ? (
                      <CheckCircle2 size={18} color="#16A34A" />
                    ) : (
                      <Icon
                        size={18}
                        color={isActive ? "#1B4F8B" : "#94A3B8"}
                      />
                    )}
                  </div>
                  <span
                    className="text-[11px] font-medium text-center whitespace-nowrap"
                    style={{
                      color: isCompleted
                        ? "#16A34A"
                        : isActive
                        ? "#1B4F8B"
                        : "#94A3B8",
                    }}
                  >
                    {step.label}
                  </span>
                </div>
                {!isLast && (
                  <div className="flex items-center px-2 mb-5">
                    <ArrowRight
                      size={14}
                      color={isCompleted ? "#16A34A" : "#E2E8F0"}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}