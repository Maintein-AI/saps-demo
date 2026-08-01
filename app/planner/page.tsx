"use client";

import Link from "next/link";
import { CalendarRange, ChevronRight, BarChart3, UsersRound, TrendingUp } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";

interface NavCard {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  count: string;
  countLabel: string;
}

const navCards: NavCard[] = [
  {
    title: "Capacity Dashboard",
    description: "Today / Week / Month capacity bars by zone and handling code. Risk alerts.",
    href: "/planner/capacity-dashboard",
    icon: <BarChart3 size={20} color="#0B2545" />,
    count: "78%",
    countLabel: "today utilisation",
  },
  {
    title: "Slot Planner",
    description: "Drag-to-allocate calendar for ULD / vehicle bays. Conflict detection built in.",
    href: "/planner/slot-planner",
    icon: <CalendarRange size={20} color="#0B2545" />,
    count: "42",
    countLabel: "slots booked",
  },
  {
    title: "Resource Roster",
    description: "Operator and asset assignment to shifts. Read-only — edits in HR/Ops.",
    href: "/planner/resource-roster",
    icon: <UsersRound size={20} color="#0B2545" />,
    count: "36",
    countLabel: "on shift",
  },
  {
    title: "Demand Forecast",
    description: "Inbound flights with expected pieces/weight/class — sourced from FFM/FWB.",
    href: "/planner/demand-forecast",
    icon: <TrendingUp size={20} color="#0B2545" />,
    count: "12",
    countLabel: "inbound today",
  },
];

const KPI = [
  { label: "Capacity used", value: "78%", sub: "today" },
  { label: "Inbound flights", value: "12", sub: "next 24h" },
  { label: "Expected pieces", value: "8,420", sub: "from FFM" },
  { label: "Roster gaps", value: "2", sub: "operators short" },
  { label: "Slot conflicts", value: "1", sub: "vehicle bay D-3" },
];

export default function PlannerDashboard() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Breadcrumb items={[{ label: "Planner", href: "#" }, { label: "Dashboard" }]} />
        <div className="flex items-center gap-3">
          <h1 className="text-[24px] lg:text-[32px] font-bold text-[#0F172A] leading-[32px] lg:leading-[40px]">
            Planner Dashboard
          </h1>
        </div>
        <p className="text-[14px] text-[#64748B] max-w-3xl">
          Capacity, slot allocation and resourcing across the AFU. Forecast vs. actual at a glance.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {KPI.map((k) => (
          <div key={k.label} className="rounded-[16px] border border-[#E2E8F0] bg-white p-4 shadow-sm">
            <div className="text-[11px] font-bold uppercase tracking-[1px] text-[#64748B] mb-1">{k.label}</div>
            <div className="text-[24px] font-bold text-[#0F172A] leading-none">{k.value}</div>
            <div className="text-[11px] text-[#94A3B8] mt-1">{k.sub}</div>
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-[11px] font-bold uppercase tracking-[2.5px] text-[#1B4F8B]">Modules</h2>
          <div className="flex-1 h-px bg-[#E2E8F0]" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {navCards.map((c) => (
            <Link key={c.title} href={c.href} className="no-underline">
              <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer h-full flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-[#F1F5F9] flex items-center justify-center">{c.icon}</div>
                  <div className="text-right">
                    <div className="text-[22px] font-bold text-[#0B2545] leading-none">{c.count}</div>
                    <div className="text-[10px] text-[#94A3B8] font-medium mt-0.5">{c.countLabel}</div>
                  </div>
                </div>
                <h3 className="text-[16px] font-semibold text-[#0F172A] mb-1">{c.title}</h3>
                <p className="text-[12.5px] text-[#64748B] leading-relaxed flex-1">{c.description}</p>
                <div className="mt-3 flex items-center gap-1.5 text-[13px] font-semibold text-[#1B4F8B]">
                  Open <ChevronRight size={14} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
