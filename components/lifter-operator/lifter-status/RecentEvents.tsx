"use client";

import { useState } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  Play,
  ArrowUpFromLine,
  ArrowDownToLine,
  Wrench,
  Clock,
} from "lucide-react";

interface EventItem {
  time: string;
  eventType: string;
  battery: string;
  location: string;
  operator: string;
  notes: string;
  status: string;
}

const eventData: EventItem[] = [
  {
    time: "11:42",
    eventType: "Task Completed",
    battery: "71%",
    location: "AFU-R02-L1-B04",
    operator: "Ahmed Khan",
    notes: "Putaway piece 07 to AFU zone",
    status: "Completed",
  },
  {
    time: "11:35",
    eventType: "Task Started",
    battery: "73%",
    location: "Receiving Bay 02",
    operator: "Ahmed Khan",
    notes: "Picked up piece 07",
    status: "Completed",
  },
  {
    time: "11:10",
    eventType: "Task Completed",
    battery: "74%",
    location: "Vehicle Bay 03",
    operator: "Ahmed Khan",
    notes: "Pick task piece 03",
    status: "Completed",
  },
  {
    time: "10:55",
    eventType: "Marked Available",
    battery: "76%",
    location: "Charging Station A",
    operator: "Ahmed Khan",
    notes: "Finished charging, marked available",
    status: "Completed",
  },
  {
    time: "09:30",
    eventType: "Marked On Charge",
    battery: "34%",
    location: "Charging Station A",
    operator: "Ahmed Khan",
    notes: "Battery below threshold, moved to station",
    status: "Completed",
  },
  {
    time: "09:15",
    eventType: "Task Completed",
    battery: "36%",
    location: "GCR-R05-L2-B01",
    operator: "Ahmed Khan",
    notes: "Move task piece 09",
    status: "Completed",
  },
  {
    time: "08:45",
    eventType: "Fault Reported",
    battery: "42%",
    location: "Cold-COL-01",
    operator: "Ahmed Khan",
    notes: "Brake felt soft, maintenance notified",
    status: "Resolved",
  },
  {
    time: "08:10",
    eventType: "Maintenance Alert",
    battery: "45%",
    location: "AFU Aisle 02",
    operator: "Ahmed Khan",
    notes: "Routine maintenance check passed",
    status: "Completed",
  },
];

const eventTypeConfig: Record<string, { icon: any; color: string; bg: string }> = {
  "Task Started": { icon: Play, color: "#1B4F8B", bg: "#DBEAFE" },
  "Task Completed": { icon: CheckCircle2, color: "#16A34A", bg: "#DCFCE7" },
  "Marked On Charge": { icon: CheckCircle2, color: "#D97706", bg: "#FEF3C7" },
  "Marked Available": { icon: CheckCircle2, color: "#16A34A", bg: "#DCFCE7" },
  "Fault Reported": { icon: AlertTriangle, color: "#DC2626", bg: "#FEE2E2" },
  "Maintenance Alert": { icon: Wrench, color: "#D97706", bg: "#FEF3C7" },
};

const statusConfig: Record<string, { color: string; bg: string }> = {
  Completed: { color: "#16A34A", bg: "#DCFCE7" },
  Resolved: { color: "#2E75B6", bg: "#DBEAFE" },
  Pending: { color: "#D97706", bg: "#FEF3C7" },
  "In Progress": { color: "#1B4F8B", bg: "#DBEAFE" },
};

export default function RecentEvents() {
  const [expanded, setExpanded] = useState(false);
  const displayData = expanded ? eventData : eventData.slice(0, 5);

  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-white overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2">
          <h2 className="text-[16px] font-bold text-[#0F172A]">Recent Lifter Events</h2>
        </div>
        <div className="flex items-center gap-1.5 text-[12px] text-[#94A3B8] font-medium">
          <Clock size={14} />
          <span>{eventData.length} events</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">Time</th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">Event Type</th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider hidden sm:table-cell">Battery</th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider hidden md:table-cell">Location</th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider hidden lg:table-cell">Operator</th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider hidden lg:table-cell">Notes</th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody>
            {displayData.map((event, i) => {
              const config = eventTypeConfig[event.eventType] || eventTypeConfig["Task Started"];
              const EventIcon = config.icon;
              const statusCfg = statusConfig[event.status] || statusConfig["Completed"];

              return (
                <tr key={i} className="border-b border-[#E2E8F0] last:border-0 hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-4 py-3 text-[13px] font-medium text-[#0F172A] whitespace-nowrap">
                    {event.time}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full text-[11px] font-semibold"
                      style={{ backgroundColor: config.bg, color: config.color }}
                    >
                      <EventIcon size={12} />
                      {event.eventType}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[13px] font-medium text-[#64748B] hidden sm:table-cell whitespace-nowrap">
                    {event.battery}
                  </td>
                  <td className="px-4 py-3 text-[13px] font-medium text-[#64748B] hidden md:table-cell whitespace-nowrap">
                    {event.location}
                  </td>
                  <td className="px-4 py-3 text-[13px] font-medium text-[#64748B] hidden lg:table-cell whitespace-nowrap">
                    {event.operator}
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[#64748B] hidden lg:table-cell max-w-[200px] truncate">
                    {event.notes}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="inline-flex items-center gap-1 h-5 px-2 rounded-full text-[11px] font-semibold"
                      style={{ backgroundColor: statusCfg.bg, color: statusCfg.color }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusCfg.color }} />
                      {event.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {eventData.length > 5 && !expanded && (
        <div className="px-5 py-3 border-t border-[#E2E8F0] text-center">
          <button
            onClick={() => setExpanded(true)}
            className="text-[13px] font-semibold text-[#0B2545] hover:underline cursor-pointer"
          >
            Show all {eventData.length} events
          </button>
        </div>
      )}
    </div>
  );
}