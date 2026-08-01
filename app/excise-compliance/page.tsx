"use client";

import Link from "next/link";
import {
  FileCheck,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  ClipboardList,
  MessageSquare,
  Lock,
  ListChecks,
} from "lucide-react";
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
    title: "Customs Queue",
    description: "Channel-tabbed queue (Green / Yellow / Red) of AWBs awaiting customs action.",
    href: "/excise-compliance/customs-queue",
    icon: <ListChecks size={20} color="#0B2545" />,
    count: "454",
    countLabel: "AWBs",
  },
  {
    title: "Channel Detail",
    description: "Per-channel workflow — document review (Yellow) or examination scheduling (Red).",
    href: "/excise-compliance/channel-detail",
    icon: <FileCheck size={20} color="#0B2545" />,
    count: "23",
    countLabel: "open queries",
  },
  {
    title: "OOC Capture",
    description: "Record Out-of-Charge: GD, duties, taxes, ANF / ASF clearances, OOC PDF.",
    href: "/excise-compliance/ooc-capture",
    icon: <ShieldCheck size={20} color="#0B2545" />,
    count: "18",
    countLabel: "today",
  },
  {
    title: "Hold Register",
    description: "Customs / ANF / ASF / Internal / Discrepancy holds — typed, audited, releasable.",
    href: "/excise-compliance/hold-register",
    icon: <Lock size={20} color="#0B2545" />,
    count: "12",
    countLabel: "active holds",
  },
  {
    title: "Section 82 / Long-stay",
    description: "Cargo exceeding the allowed period — auction / disposal escalation flow.",
    href: "/excise-compliance/section-82-long-stay",
    icon: <AlertTriangle size={20} color="#0B2545" />,
    count: "7",
    countLabel: "in review",
  },
  {
    title: "Customs Messaging",
    description: "Log of DIS, RCT, TFD, RCF, DEP, TGC, NFD, DLV messages — filter by AWB.",
    href: "/excise-compliance/customs-messaging",
    icon: <MessageSquare size={20} color="#0B2545" />,
    count: "182",
    countLabel: "today",
  },
];

const KPI = [
  { label: "Green channel cleared", value: "342", sub: "today" },
  { label: "Yellow queries open", value: "23", sub: "awaiting docs" },
  { label: "Red exams scheduled", value: "8", sub: "next 24h" },
  { label: "OOC pending", value: "31", sub: "this shift" },
  { label: "Active holds", value: "12", sub: "all types" },
];

export default function ExciseComplianceDashboard() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Breadcrumb items={[{ label: "Excise / Compliance", href: "#" }, { label: "Dashboard" }]} />
        <div className="flex items-center gap-3">
          <h1 className="text-[24px] lg:text-[32px] font-bold text-[#0F172A] leading-[32px] lg:leading-[40px]">
            Excise / Compliance Dashboard
          </h1>
        </div>
        <p className="text-[14px] text-[#64748B] max-w-3xl">
          Customs liaison cockpit. Tracks PSW / WeBOC channels, OOC issuance, holds, and Section 82 long-stay.
        </p>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {KPI.map((k) => (
          <div key={k.label} className="rounded-[16px] border border-[#E2E8F0] bg-white p-4 shadow-sm">
            <div className="text-[11px] font-bold uppercase tracking-[1px] text-[#64748B] mb-1">{k.label}</div>
            <div className="text-[24px] font-bold text-[#0F172A] leading-none">{k.value}</div>
            <div className="text-[11px] text-[#94A3B8] mt-1">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Module nav cards */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-[11px] font-bold uppercase tracking-[2.5px] text-[#1B4F8B]">Modules</h2>
          <div className="flex-1 h-px bg-[#E2E8F0]" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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

      <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#FFFBEB] flex items-center justify-center flex-shrink-0">
            <ClipboardList size={18} color="#D97706" />
          </div>
          <div>
            <h4 className="text-[14px] font-bold text-[#0F172A] mb-1">Customs SLA Watch</h4>
            <p className="text-[12.5px] text-[#64748B] leading-relaxed">
              3 AWBs are within 4 hours of their free-period expiry on the Yellow channel. Owner: Imran Ali. Drill into Customs Queue → filter Channel: Yellow → sort by Free-period expiry.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
