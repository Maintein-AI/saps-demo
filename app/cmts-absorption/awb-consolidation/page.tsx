"use client";

import { useState } from "react";
import { Split, Plus, Merge, ChevronDown, ChevronRight } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";

interface HouseAWB {
  hawb: string;
  consignee: string;
  pieces: number;
  weight: number;
  splitOf?: string;
}

interface MasterAWB {
  mawb: string;
  carrier: string;
  totalPieces: number;
  totalWeight: number;
  origin: string;
  consol: boolean;
  hawbs: HouseAWB[];
}

const RECORDS: MasterAWB[] = [
  {
    mawb: "618-12345678",
    carrier: "Emirates SkyCargo",
    totalPieces: 50,
    totalWeight: 3240,
    origin: "DXB",
    consol: true,
    hawbs: [
      { hawb: "HWB-DBS-001", consignee: "Pak Textile Mills", pieces: 24, weight: 1840 },
      { hawb: "HWB-DBS-002", consignee: "Hyperstar Retail", pieces: 16, weight: 940 },
      { hawb: "HWB-DBS-003", consignee: "Metro Industries", pieces: 10, weight: 460 },
    ],
  },
  {
    mawb: "176-87654321",
    carrier: "Qatar Airways Cargo",
    totalPieces: 32,
    totalWeight: 2450,
    origin: "DOH",
    consol: false,
    hawbs: [
      { hawb: "HWB-QR-101", consignee: "Atlas Pharma", pieces: 32, weight: 2450 },
    ],
  },
  {
    mawb: "157-11223344",
    carrier: "Thai Cargo",
    totalPieces: 28,
    totalWeight: 1980,
    origin: "BKK",
    consol: true,
    hawbs: [
      { hawb: "HWB-TG-501", consignee: "Karachi Electronics", pieces: 14, weight: 990, splitOf: "HWB-TG-500" },
      { hawb: "HWB-TG-502", consignee: "Karachi Electronics", pieces: 14, weight: 990, splitOf: "HWB-TG-500" },
    ],
  },
];

export default function AwbConsolidation() {
  const [expanded, setExpanded] = useState<string | null>("618-12345678");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Breadcrumb items={[
          { label: "CMTS Absorption", href: "/cmts-absorption" },
          { label: "AWB Consolidation & Split" },
        ]} />
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-[24px] lg:text-[32px] font-bold text-[#0F172A] leading-[32px] lg:leading-[40px]">
            AWB Consolidation & Split
          </h1>
        </div>
        <p className="text-[14px] text-[#64748B] max-w-3xl">
          Master AWB ↔ House AWB break-bulk and split shipment management. Holds the full hierarchy CMTS keeps across AWBCONSOLE, AWBSplit, AWBTRANSFER and AWBARRIVALADVICE.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-4 shadow-sm">
          <div className="text-[11px] font-bold uppercase tracking-[1px] text-[#64748B] mb-1">Open MAWBs</div>
          <div className="text-[24px] font-bold text-[#0F172A]">{RECORDS.length}</div>
        </div>
        <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-4 shadow-sm">
          <div className="text-[11px] font-bold uppercase tracking-[1px] text-[#64748B] mb-1">Consolidations</div>
          <div className="text-[24px] font-bold text-[#0F172A]">{RECORDS.filter((r) => r.consol).length}</div>
        </div>
        <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-4 shadow-sm">
          <div className="text-[11px] font-bold uppercase tracking-[1px] text-[#64748B] mb-1">Total HAWBs</div>
          <div className="text-[24px] font-bold text-[#0F172A]">{RECORDS.reduce((a, r) => a + r.hawbs.length, 0)}</div>
        </div>
        <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-4 shadow-sm">
          <div className="text-[11px] font-bold uppercase tracking-[1px] text-[#64748B] mb-1">Split records</div>
          <div className="text-[24px] font-bold text-[#0F172A]">2</div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-[#0B2545] text-white text-[12.5px] font-semibold hover:bg-[#1B4F8B] transition-colors">
          <Plus size={14} /> New consolidation
        </button>
        <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md border border-[#0B2545] text-[#0B2545] text-[12.5px] font-semibold hover:bg-[#F8FAFC] transition-colors">
          <Split size={14} /> Split HAWB
        </button>
        <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md border border-[#0B2545] text-[#0B2545] text-[12.5px] font-semibold hover:bg-[#F8FAFC] transition-colors">
          <Merge size={14} /> Merge HAWBs
        </button>
      </div>

      {/* Expandable MAWB → HAWB tree */}
      <div className="space-y-3">
        {RECORDS.map((m) => {
          const isOpen = expanded === m.mawb;
          return (
            <div key={m.mawb} className="rounded-[16px] border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
              <button
                onClick={() => setExpanded(isOpen ? null : m.mawb)}
                className="w-full px-5 py-4 flex items-center gap-4 hover:bg-[#F8FAFC] transition-colors"
              >
                {isOpen ? <ChevronDown size={16} color="#64748B" /> : <ChevronRight size={16} color="#64748B" />}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-3 items-center text-left">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[1px] text-[#94A3B8]">MAWB</div>
                    <div className="text-[14px] font-mono font-bold text-[#0F172A]">{m.mawb}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[1px] text-[#94A3B8]">Carrier</div>
                    <div className="text-[13px] text-[#1F2937]">{m.carrier}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[1px] text-[#94A3B8]">Origin</div>
                    <div className="text-[13px] font-mono">{m.origin}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[1px] text-[#94A3B8]">Pcs · Wt</div>
                    <div className="text-[13px] font-mono">{m.totalPieces} · {m.totalWeight.toLocaleString()} kg</div>
                  </div>
                  <div>
                    {m.consol ? (
                      <span className="inline-flex px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#1B4F8B]/10 text-[#1B4F8B]">
                        Consolidated · {m.hawbs.length} HAWBs
                      </span>
                    ) : (
                      <span className="inline-flex px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#F1F5F9] text-[#64748B]">
                        Single HAWB
                      </span>
                    )}
                  </div>
                </div>
              </button>
              {isOpen && (
                <div className="border-t border-[#E2E8F0] bg-[#F8FAFC] p-4">
                  <div className="text-[11px] font-bold uppercase tracking-[1px] text-[#64748B] mb-3">House waybills</div>
                  <div className="space-y-2">
                    {m.hawbs.map((h) => (
                      <div key={h.hawb} className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center bg-white border border-[#E2E8F0] rounded-md px-4 py-2.5">
                        <div className="font-mono text-[13px] font-semibold text-[#0F172A]">{h.hawb}</div>
                        <div className="text-[13px] text-[#475569] col-span-1 md:col-span-2">{h.consignee}</div>
                        <div className="text-[12.5px] font-mono text-[#1F2937]">{h.pieces} pcs · {h.weight} kg</div>
                        <div>
                          {h.splitOf && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-[#FFFBEB] text-[#D97706]">
                              <Split size={10} /> Split of {h.splitOf}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="rounded-[16px] border border-[#E2E8F0] bg-[#F8FAFC] p-4 shadow-sm">
        <div className="text-[11px] font-bold uppercase tracking-[1px] text-[#64748B] mb-1">CMTS source tables</div>
        <code className="text-[12px] text-[#475569] font-mono">AWBCONSOLE · AWBSplit · AWBTRANSFER · AWBARRIVALADVICE · AWBINFORMATION</code>
      </div>
    </div>
  );
}
