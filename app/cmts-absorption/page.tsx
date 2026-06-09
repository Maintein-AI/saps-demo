"use client";

import Link from "next/link";
import {
  Package,
  ChevronRight,
  FileSpreadsheet,
  Split,
  History,
  Calculator,
  ClipboardCheck,
  Database,
} from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import ScopeBadge from "@/components/ScopeBadge";

const cards = [
  {
    title: "Manifest Reconciliation",
    description: "Physical-vs-manifest reconciliation against FFM / FWB / FHL. Discrepancies routed to CDR.",
    href: "/cmts-absorption/manifest-reconciliation",
    icon: <FileSpreadsheet size={20} color="#0B2545" />,
    cmtsRef: "IMPORTMANIFIEST · IMPORTAWB",
    badge: "10 manifests today",
  },
  {
    title: "AWB Consolidation & Split",
    description: "Master AWB ↔ House AWB break-bulk. Split shipments and consolidations under one record.",
    href: "/cmts-absorption/awb-consolidation",
    icon: <Split size={20} color="#0B2545" />,
    cmtsRef: "AWBCONSOLE · AWBSplit · AWBTRANSFER",
    badge: "4 consols open",
  },
  {
    title: "Godown Rent History",
    description: "Per-AWB rent history with replays. Show every period, surcharge applied, waivers and adjustments.",
    href: "/cmts-absorption/godown-rent-history",
    icon: <History size={20} color="#0B2545" />,
    cmtsRef: "GODOWNRENT · GODOWNRENTHistory · GODOWNRENTDETAIL",
    badge: "75-column parity",
  },
  {
    title: "Charges Calculator",
    description: "Rule-cascade view of how a single charge is derived — surcharges, class, location, slab.",
    href: "/cmts-absorption/charges-calculator",
    icon: <Calculator size={20} color="#0B2545" />,
    cmtsRef: "CHARGECALCULATER · CHARGETYPE · LOCATIONCHARGES",
    badge: "Live calc",
  },
  {
    title: "Cargo Acceptance Check-in",
    description: "Distinct acceptance step before storage allocation. Weight / piece / condition / seal check.",
    href: "/cmts-absorption/cargo-acceptance",
    icon: <ClipboardCheck size={20} color="#0B2545" />,
    cmtsRef: "CARGOACCEPTANCE · ACCEPTENCEDETAIL · CARGOACCEPTANCEHWB",
    badge: "Pre-putaway",
  },
];

export default function CmtsAbsorptionOverview() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Breadcrumb items={[{ label: "CMTS Absorption", href: "#" }, { label: "Overview" }]} />
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-[24px] lg:text-[32px] font-bold text-[#0F172A] leading-[32px] lg:leading-[40px]">
            CMTS Absorption
          </h1>
          <ScopeBadge type="exc" />
        </div>
        <p className="text-[14px] text-[#64748B] max-w-4xl">
          The depth of the legacy CMTS system, brought into AirVault as native modules. This is the
          path that lets SAPS retire CMTS rather than run it in parallel. Each module on this page
          maps directly to one or more CMTS tables (106 in total).
        </p>
      </div>

      {/* Context strip */}
      <div className="rounded-[16px] border border-[#E2E8F0] bg-gradient-to-br from-[#FEF2F2] to-white p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-white border border-[#FCA5A5] flex items-center justify-center flex-shrink-0">
            <Database size={20} color="#DC2626" />
          </div>
          <div>
            <h3 className="text-[14px] font-bold text-[#0F172A] mb-1">
              Why this section carries the <code className="text-[12px] bg-white border border-[#FECACA] text-[#DC2626] px-1.5 py-0.5 rounded">exc</code> badge
            </h3>
            <p className="text-[13px] text-[#64748B] leading-relaxed">
              The awarded AirVault Annexure-G described a software backbone but did not detail the
              operational depth needed to fully retire the CMTS system. Absorbing CMTS — its
              manifest reconciliation, AWB split / consol, full godown-rent history, charges
              calculator and distinct cargo acceptance flow — is a One-Window Vision delta.
            </p>
          </div>
        </div>
      </div>

      {/* Module nav cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map((c) => (
          <Link key={c.title} href={c.href} className="no-underline">
            <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer h-full flex flex-col relative">
              <div className="absolute top-3 right-3">
                <ScopeBadge type="exc" />
              </div>
              <div className="w-10 h-10 rounded-lg bg-[#F1F5F9] flex items-center justify-center mb-3">{c.icon}</div>
              <h3 className="text-[16px] font-semibold text-[#0F172A] mb-1">{c.title}</h3>
              <p className="text-[12.5px] text-[#64748B] leading-relaxed flex-1 mb-3">{c.description}</p>
              <div className="rounded-md bg-[#F8FAFC] border border-[#E2E8F0] px-2.5 py-1.5 mb-3">
                <div className="text-[9.5px] font-bold uppercase tracking-[1px] text-[#94A3B8] mb-0.5">
                  CMTS source
                </div>
                <code className="text-[11px] text-[#475569] font-mono leading-tight">{c.cmtsRef}</code>
              </div>
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

      {/* Footer note */}
      <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
        <div className="text-[11px] font-bold uppercase tracking-[1.5px] text-[#64748B] mb-2">
          CMTS coverage summary
        </div>
        <p className="text-[13px] text-[#475569] leading-relaxed">
          5 absorption modules · ~30 CMTS tables represented · Lookups and reference data covered
          by Admin → Master Data. HR / Payroll modules from CMTS are <strong>out of scope</strong>{" "}
          per the revised One-Window Vision. Airmail and International cargo will land in Phase 2
          as a sub-module of Manifest Reconciliation.
        </p>
      </div>
    </div>
  );
}
