"use client";

import ScopeBadge from "@/components/ScopeBadge";
import { WaiverRequest } from "@/app/finance-manager/waiver-workflow/page";
import { Upload, ShieldCheck, Clock, FileText, CheckCircle2, Lock } from "lucide-react";

interface AuditTrailProps {
  waiver: WaiverRequest | null;
}

const getTimelineEvents = (waiver: WaiverRequest | null) => {
  if (!waiver) return [];

  const events: Array<{
    icon: any;
    label: string;
    time: string;
    status: "completed" | "active" | "pending";
  }> = [
    {
      icon: FileText,
      label: `Request ${waiver.id} created`,
      time: waiver.requestedAt,
      status: "completed",
    },
    {
      icon: Upload,
      label: "Document uploaded",
      time: waiver.documentUploaded ? waiver.requestedAt : "Not yet",
      status: waiver.documentUploaded ? "completed" : "pending",
    },
    {
      icon: Clock,
      label: "Review started",
      time: waiver.reviewStarted
        ? waiver.approvalTimestamp || "In progress"
        : "Not started",
      status: waiver.reviewStarted ? "completed" : "pending",
    },
    {
      icon: ShieldCheck,
      label: waiver.approvalStatus
        ? `Approved / Rejected: ${waiver.approvalStatus}`
        : "Approval / Rejection",
      time: waiver.approvalTimestamp || "Pending",
      status: waiver.approvalStatus ? "completed" : "pending",
    },
    {
      icon: FileText,
      label: waiver.creditNoteId
        ? `Credit note ${waiver.creditNoteId} created`
        : "Credit note created",
      time: waiver.creditNoteCreated
        ? waiver.approvalTimestamp || "Created"
        : "Pending",
      status: waiver.creditNoteCreated ? "completed" : "pending",
    },
    {
      icon: CheckCircle2,
      label: "Invoice updated",
      time: waiver.invoiceUpdated
        ? waiver.approvalTimestamp || "Updated"
        : "Pending",
      status: waiver.invoiceUpdated ? "completed" : "pending",
    },
    {
      icon: Lock,
      label: "Audit locked",
      time: waiver.auditLocked
        ? waiver.approvalTimestamp || "Locked"
        : "Pending",
      status: waiver.auditLocked ? "completed" : "pending",
    },
  ];

  return events;
};

export default function AuditTrail({ waiver }: AuditTrailProps) {
  const events = getTimelineEvents(waiver);

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2.5">
          <h2 className="text-[15px] font-bold text-[#0F172A]">Waiver Audit Trail</h2>
          <ScopeBadge type="inc" />
          {waiver && (
            <span className="text-[12px] text-[#64748B]">{waiver.id}</span>
          )}
        </div>
      </div>
      <div className="p-5">
        {events.length === 0 ? (
          <div className="text-[13px] text-[#94A3B8] text-center py-8">
            Select a waiver request to view its audit trail
          </div>
        ) : (
          <div className="space-y-0">
            {events.map((event, idx) => {
              const Icon = event.icon;
              const isCompleted = event.status === "completed";
              const isActive = event.status === "active";
              const isLast = idx === events.length - 1;

              return (
                <div key={idx} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: isCompleted
                          ? "#DCFCE7"
                          : isActive
                          ? "#DBEAFE"
                          : "#F1F5F9",
                      }}
                    >
                      <Icon
                        size={14}
                        color={
                          isCompleted ? "#16A34A" : isActive ? "#1B4F8B" : "#94A3B8"
                        }
                      />
                    </div>
                    {!isLast && (
                      <div
                        className="w-0.5 h-10 mt-1"
                        style={{
                          backgroundColor: isCompleted ? "#DCFCE7" : "#E2E8F0",
                        }}
                      />
                    )}
                  </div>
                  <div className="pb-5">
                    <span
                      className="text-[13px] font-medium block"
                      style={{
                        color: isCompleted
                          ? "#0F172A"
                          : isActive
                          ? "#1B4F8B"
                          : "#94A3B8",
                      }}
                    >
                      {event.label}
                    </span>
                    <span
                      className="text-[11px] block mt-0.5"
                      style={{
                        color: isCompleted ? "#64748B" : "#94A3B8",
                      }}
                    >
                      {event.time}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}