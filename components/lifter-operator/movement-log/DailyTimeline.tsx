"use client";

import { useState } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  MapPin,
  Battery,
} from "lucide-react";

interface TimelineEvent {
  id: string;
  time: string;
  taskType: string;
  awb: string;
  pieceId: string;
  fromLocation: string;
  toLocation: string;
  status: string;
  scanResult: string;
  duration: string;
  lifterAsset: string;
}

const timelineEvents: TimelineEvent[] = [
  {
    id: "M-2026-0047",
    time: "11:42",
    taskType: "Putaway",
    awb: "214-45678901",
    pieceId: "P-21445678901-07",
    fromLocation: "Receiving Bay 02",
    toLocation: "AFU-R02-L1-B04",
    status: "Completed",
    scanResult: "Matched",
    duration: "7 min",
    lifterAsset: "FL-03",
  },
  {
    id: "M-2026-0046",
    time: "11:28",
    taskType: "Pick",
    awb: "157-90811223",
    pieceId: "P-15790811223-03",
    fromLocation: "Cold-COL-01",
    toLocation: "Vehicle Bay 03",
    status: "Completed",
    scanResult: "Matched",
    duration: "9 min",
    lifterAsset: "FL-03",
  },
  {
    id: "M-2026-0045",
    time: "11:15",
    taskType: "Move",
    awb: "074-88219033",
    pieceId: "P-07488219033-09",
    fromLocation: "GCR-R05-L2-B01",
    toLocation: "Inspection Bay",
    status: "Exception",
    scanResult: "Mismatch",
    duration: "12 min",
    lifterAsset: "FL-03",
  },
  {
    id: "M-2026-0044",
    time: "10:58",
    taskType: "Putaway",
    awb: "214-45678901",
    pieceId: "P-21445678901-06",
    fromLocation: "Receiving Bay 02",
    toLocation: "AFU-R02-L1-B03",
    status: "Completed",
    scanResult: "Matched",
    duration: "6 min",
    lifterAsset: "FL-03",
  },
  {
    id: "M-2026-0043",
    time: "10:42",
    taskType: "Charge",
    awb: "089-33445566",
    pieceId: "P-08933445566-01",
    fromLocation: "Charging Station A",
    toLocation: "Cold-COL-02",
    status: "Completed",
    scanResult: "Matched",
    duration: "11 min",
    lifterAsset: "FL-03",
  },
  {
    id: "M-2026-0042",
    time: "10:28",
    taskType: "Pick",
    awb: "157-90811223",
    pieceId: "P-15790811223-02",
    fromLocation: "Cold-COL-01",
    toLocation: "Vehicle Bay 02",
    status: "Completed",
    scanResult: "Matched",
    duration: "8 min",
    lifterAsset: "FL-03",
  },
  {
    id: "M-2026-0041",
    time: "10:15",
    taskType: "Move",
    awb: "074-88219033",
    pieceId: "P-07488219033-08",
    fromLocation: "GCR-R05-L2-B01",
    toLocation: "GCR-R05-L3-B02",
    status: "Completed",
    scanResult: "Matched",
    duration: "5 min",
    lifterAsset: "FL-03",
  },
  {
    id: "M-2026-0040",
    time: "09:55",
    taskType: "Putaway",
    awb: "214-45678901",
    pieceId: "P-21445678901-05",
    fromLocation: "Receiving Bay 02",
    toLocation: "AFU-R02-L1-B02",
    status: "Completed",
    scanResult: "Matched",
    duration: "6 min",
    lifterAsset: "FL-03",
  },
  {
    id: "M-2026-0039",
    time: "09:42",
    taskType: "Pick",
    awb: "157-90811223",
    pieceId: "P-15790811223-01",
    fromLocation: "Cold-COL-01",
    toLocation: "Vehicle Bay 01",
    status: "Completed",
    scanResult: "Matched",
    duration: "7 min",
    lifterAsset: "FL-03",
  },
  {
    id: "M-2026-0038",
    time: "09:30",
    taskType: "Putaway",
    awb: "214-45678901",
    pieceId: "P-21445678901-04",
    fromLocation: "Receiving Bay 02",
    toLocation: "AFU-R02-L1-B01",
    status: "Completed",
    scanResult: "Matched",
    duration: "5 min",
    lifterAsset: "FL-03",
  },
  {
    id: "M-2026-0037",
    time: "09:18",
    taskType: "Move",
    awb: "074-88219033",
    pieceId: "P-07488219033-07",
    fromLocation: "GCR-R05-L1-B04",
    toLocation: "GCR-R05-L2-B01",
    status: "Completed",
    scanResult: "Matched",
    duration: "4 min",
    lifterAsset: "FL-03",
  },
  {
    id: "M-2026-0036",
    time: "09:05",
    taskType: "Charge",
    awb: "089-33445566",
    pieceId: "P-08933445566-02",
    fromLocation: "Charging Station B",
    toLocation: "Cold-COL-03",
    status: "Completed",
    scanResult: "Matched",
    duration: "10 min",
    lifterAsset: "FL-03",
  },
];

const taskTypeIcons: Record<string, any> = {
  Putaway: ArrowDownRight,
  Pick: ArrowUpRight,
  Move: ArrowRight,
  Charge: Battery,
};

const taskTypeColors: Record<string, { color: string; bg: string; dot: string }> = {
  Putaway: { color: "#1B4F8B", bg: "#DBEAFE", dot: "#2E75B6" },
  Pick: { color: "#7C3AED", bg: "#F3E8FF", dot: "#7C3AED" },
  Move: { color: "#D97706", bg: "#FEF3C7", dot: "#D97706" },
  Charge: { color: "#16A34A", bg: "#DCFCE7", dot: "#16A34A" },
};

export default function DailyTimeline() {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2.5">
          <h2 className="text-[16px] font-bold text-[#0F172A]">Daily Timeline</h2>
        </div>
        <div className="flex items-center gap-1.5 text-[12px] text-[#94A3B8] font-medium">
          <Clock size={14} />
          <span>{timelineEvents.length} events</span>
        </div>
      </div>
      <div className="p-5">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[19px] top-3 bottom-3 w-[2px] bg-[#E2E8F0]" />

          <div className="space-y-4">
            {timelineEvents.map((event, index) => {
              const Icon = taskTypeIcons[event.taskType] || ArrowRight;
              const colors = taskTypeColors[event.taskType] || taskTypeColors.Move;
              const isException = event.status === "Exception";

              return (
                <div key={event.id} className="flex items-start gap-4 relative">
                  {/* Dot / Icon */}
                  <div
                    className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{
                      backgroundColor: isException ? "#FEE2E2" : colors.bg,
                    }}
                  >
                    {isException ? (
                      <AlertTriangle size={18} className="text-[#DC2626]" />
                    ) : (
                      <Icon size={18} style={{ color: colors.color }} />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[13px] font-bold text-[#0F172A]">{event.time}</span>
                      <span
                        className="inline-flex items-center gap-1 h-5 px-2 rounded-full text-[11px] font-semibold"
                        style={{
                          backgroundColor: isException ? "#FEE2E2" : colors.bg,
                          color: isException ? "#DC2626" : colors.color,
                        }}
                      >
                        {event.taskType}
                      </span>
                      <span
                        className="inline-flex items-center gap-1 h-5 px-2 rounded-full text-[11px] font-semibold"
                        style={{
                          backgroundColor: event.status === "Completed" ? "#DCFCE7" : "#FEE2E2",
                          color: event.status === "Completed" ? "#16A34A" : "#DC2626",
                        }}
                      >
                        {event.status === "Completed" ? (
                          <CheckCircle2 size={10} />
                        ) : (
                          <AlertTriangle size={10} />
                        )}
                        {event.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className="text-[13px] font-semibold text-[#1B4F8B]">{event.awb}</span>
                      <span className="text-[12px] text-[#94A3B8]">{event.pieceId}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-[12px] text-[#64748B]">
                      <MapPin size={12} className="text-[#94A3B8]" />
                      <span>{event.fromLocation}</span>
                      <ArrowRight size={10} className="text-[#94A3B8]" />
                      <span>{event.toLocation}</span>
                      <span className="text-[#94A3B8] mx-1">|</span>
                      <Clock size={10} className="text-[#94A3B8]" />
                      <span>{event.duration}</span>
                      <span className="text-[#94A3B8] mx-1">|</span>
                      <span>{event.lifterAsset}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}