"use client";

import { useState } from "react";
import { History, CheckCircle2, Ban, Clock, ChevronDown } from "lucide-react";
import GateStatusBadge from "../GateStatusBadge";

const visits = [
  {
    date: "31 May 2026",
    vehicle: "KHI-4582",
    driver: "Ahmed Raza",
    purpose: "Cargo pickup",
    doc: "DO-90871",
    result: "Cleared",
  },
  {
    date: "31 May 2026",
    vehicle: "BJU-7721",
    driver: "Imran Ali",
    purpose: "Cargo drop",
    doc: "AWB 214-45678901",
    result: "Cleared",
  },
  {
    date: "30 May 2026",
    vehicle: "LEA-2099",
    driver: "Salman Khan",
    purpose: "Supplier",
    doc: "—",
    result: "Hold",
  },
  {
    date: "30 May 2026",
    vehicle: "KHI-3001",
    driver: "Nadeem Hussain",
    purpose: "Cargo pickup",
    doc: "DO-90865",
    result: "Cleared",
  },
  {
    date: "29 May 2026",
    vehicle: "RWP-7712",
    driver: "Farooq Ahmed",
    purpose: "Cargo drop",
    doc: "AWB 157-90811223",
    result: "Cleared",
  },
  {
    date: "29 May 2026",
    vehicle: "FSB-1123",
    driver: "Kamran Ali",
    purpose: "Cargo pickup",
    doc: "DO-90872",
    result: "Rejected",
  },
  {
    date: "28 May 2026",
    vehicle: "PSH-5544",
    driver: "Waseem Khan",
    purpose: "Cargo drop",
    doc: "AWB 074-88219033",
    result: "Cleared",
  },
  {
    date: "28 May 2026",
    vehicle: "LHE-9901",
    driver: "Tariq Mehmood",
    purpose: "Supplier",
    doc: "—",
    result: "Cleared",
  },
];

export default function RecentVisits() {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? visits : visits.slice(0, 4);

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-5">
        <History size={20} className="text-[#1B4F8B]" />
        <h2 className="text-[18px] font-semibold text-[#0F172A] leading-[28px]">
          Recent Visits
        </h2>
        <span className="inline-flex items-center justify-center h-[22px] px-2.5 rounded-full text-[11px] font-bold tracking-[0.3px] lowercase select-none text-white bg-[#16A34A]">
          inc.
        </span>
      </div>

      <div className="space-y-2">
        {visible.map((visit, i) => {
          const icon =
            visit.result === "Cleared"
              ? CheckCircle2
              : visit.result === "Rejected"
                ? Ban
                : Clock;
          const Icon = icon;

          return (
            <div
              key={i}
              className="flex items-center gap-3 p-3 rounded-xl border border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors"
            >
              <div
                className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  backgroundColor:
                    visit.result === "Cleared"
                      ? "#DCFCE7"
                      : visit.result === "Rejected"
                        ? "#FEE2E2"
                        : "#FEF3C7",
                }}
              >
                <Icon
                  size={16}
                  style={{
                    color:
                      visit.result === "Cleared"
                        ? "#16A34A"
                        : visit.result === "Rejected"
                          ? "#DC2626"
                          : "#D97706",
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-semibold text-[#0F172A]">
                    {visit.vehicle}
                  </span>
                  <GateStatusBadge status={visit.result} />
                </div>
                <p className="text-[12px] text-[#64748B] mt-0.5">
                  {visit.driver} · {visit.purpose} · {visit.doc}
                </p>
              </div>
              <span className="text-[12px] text-[#94A3B8] whitespace-nowrap">
                {visit.date}
              </span>
            </div>
          );
        })}
      </div>

      {visits.length > 4 && (
        <div className="mt-4 flex items-center justify-center">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 h-8 px-4 rounded-lg text-[13px] font-semibold text-[#1B4F8B] hover:bg-[#EBF0F7] cursor-pointer transition-colors"
          >
            {expanded ? "Show Less" : "Show All"}
            <ChevronDown
              size={14}
              className={`transition-transform ${expanded ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      )}
    </div>
  );
}