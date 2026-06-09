"use client";

import { useState } from "react";
import { useToast } from "@/components/ToastContext";
import ScopeBadge from "@/components/ScopeBadge";
import {
  FileText,
  CheckCircle,
  MessageSquare,
  Gavel,
  Clock,
  FlaskConical,
  PackageCheck,
  Shield,
} from "lucide-react";

interface TimelineEvent {
  stage: string;
  timestamp: string;
  status: "completed" | "current" | "pending";
  user?: string;
  remarks?: string;
}

const timelineStages = [
  { stage: "Filed", icon: <FileText size={14} /> },
  { stage: "Channel Assigned", icon: <Shield size={14} /> },
  { stage: "Query Raised", icon: <MessageSquare size={14} /> },
  { stage: "Response Submitted", icon: <CheckCircle size={14} /> },
  { stage: "Exam Scheduled", icon: <Gavel size={14} /> },
  { stage: "Sample Collected", icon: <FlaskConical size={14} /> },
  { stage: "Examined", icon: <Shield size={14} /> },
  { stage: "OOC Ready", icon: <CheckCircle size={14} /> },
  { stage: "Released", icon: <PackageCheck size={14} /> },
];

const defaultEvents: TimelineEvent[] = [
  { stage: "Filed", timestamp: "30 May 2026, 14:30", status: "completed", user: "Kamran Ahmed", remarks: "GD submitted via WeBOC" },
  { stage: "Channel Assigned", timestamp: "30 May 2026, 15:00", status: "completed", user: "System", remarks: "Auto-assigned Yellow channel" },
  { stage: "Query Raised", timestamp: "30 May 2026, 16:15", status: "completed", user: "Inspector Tariq", remarks: "Commercial invoice mismatch" },
  { stage: "Response Submitted", timestamp: "31 May 2026, 09:30", status: "completed", user: "Sanaullah Khan", remarks: "Revised invoice attached" },
  { stage: "Exam Scheduled", timestamp: "01 Jun 2026, 10:00", status: "current", user: "Inspector Faisal", remarks: "Physical exam at Bay A" },
  { stage: "Sample Collected", timestamp: "", status: "pending", remarks: "" },
  { stage: "Examined", timestamp: "", status: "pending", remarks: "" },
  { stage: "OOC Ready", timestamp: "", status: "pending", remarks: "" },
  { stage: "Released", timestamp: "", status: "pending", remarks: "" },
];

const redEvents: TimelineEvent[] = [
  { stage: "Filed", timestamp: "28 May 2026, 11:00", status: "completed", user: "Kamran Ahmed", remarks: "GD submitted via WeBOC" },
  { stage: "Channel Assigned", timestamp: "28 May 2026, 12:00", status: "completed", user: "System", remarks: "Auto-assigned Red channel" },
  { stage: "Query Raised", timestamp: "28 May 2026, 14:00", status: "completed", user: "Inspector Tariq", remarks: "HS code clarification" },
  { stage: "Response Submitted", timestamp: "29 May 2026, 08:00", status: "completed", user: "Sanaullah Khan", remarks: "Technical specs attached" },
  { stage: "Exam Scheduled", timestamp: "29 May 2026, 10:00", status: "completed", user: "Inspector Faisal", remarks: "Exam at Bay B" },
  { stage: "Sample Collected", timestamp: "29 May 2026, 11:30", status: "completed", user: "Lab Tech", remarks: "Chemical sample sent" },
  { stage: "Examined", timestamp: "30 May 2026, 09:00", status: "completed", user: "Inspector Tariq", remarks: "Goods verified, cleared" },
  { stage: "OOC Ready", timestamp: "30 May 2026, 11:00", status: "completed", user: "System", remarks: "OOC issued" },
  { stage: "Released", timestamp: "31 May 2026, 08:00", status: "current", user: "Kamran Ahmed", remarks: "Awaiting DO collection" },
];

interface ChannelWorkflowTimelineProps {
  channel?: "Yellow" | "Red";
}

export default function ChannelWorkflowTimeline({ channel = "Yellow" }: ChannelWorkflowTimelineProps) {
  const { addToast } = useToast();
  const [events, setEvents] = useState<TimelineEvent[]>(channel === "Red" ? redEvents : defaultEvents);

  const handleAdvanceStage = (stageName: string) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.stage === stageName
          ? { ...e, status: "completed" as const, timestamp: "01 Jun 2026, 09:15", user: "Kamran Ahmed" }
          : e
      )
    );
    addToast(`${stageName} marked completed.`, "success");
  };

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <h3 className="text-[15px] font-bold text-[#0F172A]">Channel Workflow Timeline</h3>
          <ScopeBadge type="exc" />
        </div>
        <span className="text-[12px] text-[#64748B]">{channel} channel</span>
      </div>

      <div className="relative">
        <div className="absolute left-[19px] top-0 bottom-0 w-[2px] bg-[#E2E8F0]" />
        <div className="space-y-4">
          {timelineStages.map((stage, index) => {
            const event = events.find((e) => e.stage === stage.stage);
            const status = event?.status || "pending";
            const isCompleted = status === "completed";
            const isCurrent = status === "current";

            return (
              <div key={stage.stage} className="flex items-start gap-4 relative">
                <div
                  className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center z-10"
                  style={{
                    backgroundColor: isCompleted ? "#DCFCE7" : isCurrent ? "#FEF3C7" : "#F1F5F9",
                    border: `2px solid ${isCompleted ? "#16A34A" : isCurrent ? "#D97706" : "#E2E8F0"}`,
                  }}
                >
                  <span style={{ color: isCompleted ? "#16A34A" : isCurrent ? "#D97706" : "#94A3B8" }}>
                    {stage.icon}
                  </span>
                </div>
                <div className="flex-1 pt-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[13px] font-bold text-[#0F172A]">{stage.stage}</span>
                    {isCompleted && (
                      <span className="inline-flex items-center h-4 px-1.5 rounded text-[10px] font-semibold bg-[#DCFCE7] text-[#16A34A]">
                        Done
                      </span>
                    )}
                    {isCurrent && (
                      <span className="inline-flex items-center h-4 px-1.5 rounded text-[10px] font-semibold bg-[#FEF3C7] text-[#D97706]">
                        Current
                      </span>
                    )}
                    {isCurrent && (
                      <button
                        onClick={() => handleAdvanceStage(stage.stage)}
                        className="text-[11px] font-semibold text-[#1B4F8B] hover:underline cursor-pointer ml-2"
                      >
                        Mark Complete
                      </button>
                    )}
                  </div>
                  {event?.timestamp && (
                    <div className="flex items-center gap-2 text-[12px] text-[#64748B]">
                      <Clock size={12} />
                      {event.timestamp}
                      {event.user && <span className="text-[#94A3B8]">by {event.user}</span>}
                    </div>
                  )}
                  {event?.remarks && (
                    <p className="text-[12px] text-[#94A3B8] mt-1">{event.remarks}</p>
                  )}
                  {!event?.timestamp && !isCurrent && (
                    <p className="text-[12px] text-[#CBD5E1] italic">Pending</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}