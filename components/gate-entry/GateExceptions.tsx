"use client";

import { useState } from "react";
import { AlertTriangle, UserX, FileX, Car, Package, CreditCard, ShieldAlert, ChevronRight } from "lucide-react";

const exceptions = [
  {
    id: "CNIC mismatch",
    count: 1,
    icon: UserX,
    color: "#DC2626",
    bg: "#FEE2E2",
    description: "Driver CNIC does not match registered vehicle",
  },
  {
    id: "Expired authority letter",
    count: 2,
    icon: FileX,
    color: "#DC2626",
    bg: "#FEE2E2",
    description: "Authority letter date has passed validity",
  },
  {
    id: "Vehicle mismatch",
    count: 1,
    icon: Car,
    color: "#D97706",
    bg: "#FEF3C7",
    description: "Vehicle number does not match DO record",
  },
  {
    id: "DO not found",
    count: 1,
    icon: FileX,
    color: "#D97706",
    bg: "#FEF3C7",
    description: "Delivery order reference not in system",
  },
  {
    id: "Cargo count mismatch",
    count: 1,
    icon: Package,
    color: "#DC2626",
    bg: "#FEE2E2",
    description: "Piece count differs from AWB declaration",
  },
  {
    id: "Payment hold",
    count: 1,
    icon: CreditCard,
    color: "#DC2626",
    bg: "#FEE2E2",
    description: "Outstanding charges blocking gate clearance",
  },
  {
    id: "Customs hold",
    count: 1,
    icon: ShieldAlert,
    color: "#DC2626",
    bg: "#FEE2E2",
    description: "Shipment flagged by customs for inspection",
  },
];

export default function GateExceptions() {
  const [activeException, setActiveException] = useState<string | null>(null);

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <AlertTriangle size={20} className="text-[#DC2626]" />
          <h2 className="text-[18px] font-semibold text-[#0F172A] leading-[28px]">
            Gate Exceptions
          </h2>
          <span className="inline-flex items-center justify-center h-[22px] px-2.5 rounded-full text-[11px] font-bold tracking-[0.3px] lowercase select-none text-white bg-[#16A34A]">
            inc.
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-semibold text-[#DC2626]">
            {exceptions.reduce((acc, e) => acc + e.count, 0)} active
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {exceptions.map((exc) => {
          const Icon = exc.icon;
          const isActive = activeException === exc.id;
          return (
            <button
              key={exc.id}
              onClick={() => setActiveException(isActive ? null : exc.id)}
              className="relative text-left rounded-xl border p-4 transition-all duration-200 cursor-pointer hover:shadow-md"
              style={{
                backgroundColor: isActive ? exc.bg : "white",
                borderColor: isActive ? exc.color : "#E2E8F0",
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: isActive ? "white" : exc.bg }}
                >
                  <Icon size={20} style={{ color: exc.color }} />
                </div>
                <div
                  className="h-6 px-2.5 rounded-full text-[12px] font-bold flex items-center"
                  style={{ backgroundColor: isActive ? "white" : exc.bg, color: exc.color }}
                >
                  {exc.count}
                </div>
              </div>
              <h3 className="text-[14px] font-semibold text-[#0F172A] mb-1 leading-tight">
                {exc.id}
              </h3>
              <p className="text-[12px] text-[#64748B] leading-relaxed mb-3">
                {exc.description}
              </p>
              <div className="flex items-center gap-1 text-[12px] font-semibold" style={{ color: exc.color }}>
                View details
                <ChevronRight size={14} />
              </div>
            </button>
          );
        })}
      </div>

      {activeException && (
        <div className="mt-4 p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={16} className="text-[#DC2626]" />
            <h3 className="text-[14px] font-semibold text-[#0F172A]">
              {activeException} — Resolve Action
            </h3>
          </div>
          <p className="text-[13px] text-[#64748B] mb-3">
            Select an action to resolve this exception. The vehicle will be held until the issue is cleared.
          </p>
          <div className="flex flex-wrap gap-2">
            <button className="h-9 px-4 rounded-lg text-[13px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90" style={{ backgroundColor: "#0B2545" }}>
              Escalate to Supervisor
            </button>
            <button className="h-9 px-4 rounded-lg text-[13px] font-semibold border border-[#E2E8F0] text-[#0F172A] hover:bg-[#F1F5F9] cursor-pointer transition-colors">
              Mark Resolved
            </button>
            <button className="h-9 px-4 rounded-lg text-[13px] font-semibold border border-[#FEE2E2] text-[#DC2626] hover:bg-[#FEE2E2] cursor-pointer transition-colors">
              Reject Vehicle
            </button>
          </div>
        </div>
      )}
    </div>
  );
}