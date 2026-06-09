"use client";

import Link from "next/link";
import { Ship, ChevronRight, PackageCheck, ShieldCheck, Send, AlertCircle } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import ScopeBadge from "@/components/ScopeBadge";

const cards = [
  {
    title: "Export Acceptance",
    description: "Acceptance counter — booking confirmation, document collection, security screening, weighing and classification.",
    href: "/export-cargo/acceptance",
    icon: <PackageCheck size={20} color="#0B2545" />,
    badge: "14 awaiting acceptance",
  },
  {
    title: "Export Customs",
    description: "Customs export clearance — GD filing, channel routing, OOC issuance and re-export coordination.",
    href: "/export-cargo/customs",
    icon: <ShieldCheck size={20} color="#0B2545" />,
    badge: "6 queries open",
  },
  {
    title: "Manifest & Handover",
    description: "Build-up planning, outbound FFM / FWB / FHL messaging and airline handover at ramp boundary.",
    href: "/export-cargo/manifest-handover",
    icon: <Send size={20} color="#0B2545" />,
    badge: "3 outbound today",
  },
];

const KPI = [
  { label: "Awaiting acceptance", value: "14", sub: "today" },
  { label: "Customs cleared", value: "27", sub: "today" },
  { label: "Outbound flights", value: "3", sub: "next 12h" },
  { label: "Held / discrepant", value: "2", sub: "in exception" },
];

export default function ExportCargoDashboard() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Breadcrumb items={[{ label: "Export Cargo", href: "#" }, { label: "Dashboard" }]} />
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-[24px] lg:text-[32px] font-bold text-[#0F172A] leading-[32px] lg:leading-[40px]">
            Export Cargo
          </h1>
          <ScopeBadge type="exc" />
        </div>
        <p className="text-[14px] text-[#64748B] max-w-3xl">
          Outbound cargo lifecycle — from booking through customs clearance to airline handover. Ramp / aircraft-side handling remains out of software scope (logged only).
        </p>
      </div>

      {/* Preview banner */}
      <div className="rounded-[16px] border border-[#FCA5A5] bg-gradient-to-br from-[#FEF2F2] to-white p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-white border border-[#FCA5A5] flex items-center justify-center flex-shrink-0">
            <AlertCircle size={20} color="#DC2626" />
          </div>
          <div>
            <h3 className="text-[14px] font-bold text-[#0F172A] mb-1">Preview build — FC-11 still draft</h3>
            <p className="text-[13px] text-[#64748B] leading-relaxed">
              The export flow (FC-11) is awaiting SAPS sign-off. These three screens are representative previews of the Acceptance, Customs and Manifest/Handover stages. Final fields, lookups and SLA logic will be finalised once FC-11 is approved.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {KPI.map((k) => (
          <div key={k.label} className="rounded-[16px] border border-[#E2E8F0] bg-white p-4 shadow-sm">
            <div className="text-[11px] font-bold uppercase tracking-[1px] text-[#64748B] mb-1">{k.label}</div>
            <div className="text-[24px] font-bold text-[#0F172A]">{k.value}</div>
            <div className="text-[11px] text-[#94A3B8] mt-1">{k.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map((c) => (
          <Link key={c.title} href={c.href} className="no-underline">
            <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer h-full flex flex-col relative">
              <div className="absolute top-3 right-3"><ScopeBadge type="exc" /></div>
              <div className="w-10 h-10 rounded-lg bg-[#F1F5F9] flex items-center justify-center mb-3">{c.icon}</div>
              <h3 className="text-[16px] font-semibold text-[#0F172A] mb-1">{c.title}</h3>
              <p className="text-[12.5px] text-[#64748B] leading-relaxed flex-1 mb-3">{c.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-[#64748B]">{c.badge}</span>
                <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#1B4F8B]">
                  Open <ChevronRight size={14} />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
