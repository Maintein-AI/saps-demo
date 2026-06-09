"use client";

import { useState } from "react";
import { Calculator, ChevronRight, CheckCircle2 } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import ScopeBadge from "@/components/ScopeBadge";

interface RuleStep {
  num: number;
  rule: string;
  input: string;
  formula: string;
  output: string;
  source: string;
}

const STEPS: RuleStep[] = [
  { num: 1, rule: "Free period", input: "Cargo class GCR, arrived 12 May 2026", formula: "Free days = 3 (per CARGOCLASS lookup)", output: "Free until 14 May 2026", source: "CARGOCLASS · Lookup" },
  { num: 2, rule: "Chargeable weight", input: "Actual: 530 kg · Volumetric: 410 kg", formula: "max(actual, volumetric)", output: "530 kg", source: "AWBINFORMATION" },
  { num: 3, rule: "Base rate (Day 4–7)", input: "Days 15–18 May (4 days)", formula: "530 kg × PKR 35 × 4 days", output: "PKR 74,200", source: "CARGOSUBCLASSCHARGES" },
  { num: 4, rule: "Class surcharge (DGR)", input: "Cargo class DGR active 24 May 2026", formula: "+15% on next slab", output: "+PKR 1,830", source: "CargoClassCharges" },
  { num: 5, rule: "Location surcharge", input: "Stored in Vault zone since 26 May", formula: "+25% on rack-day rate", output: "+PKR 12,656", source: "LOCATIONCHARGES" },
  { num: 6, rule: "Customs hold waiver", input: "Hold 19–23 May approved by Finance", formula: "−20% × applicable slab", output: "−PKR 5,300", source: "Manual waiver workflow" },
  { num: 7, rule: "Section 82 trigger check", input: "Total dwell = 20 days", formula: "If dwell > 14 → escalate", output: "Escalation flagged", source: "Section82Days · Setting" },
];

export default function ChargesCalculator() {
  const [awb] = useState("618-12345678");

  const grandTotal = 74200 + 1830 + 12656 - 5300;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Breadcrumb items={[
          { label: "CMTS Absorption", href: "/cmts-absorption" },
          { label: "Charges Calculator" },
        ]} />
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-[24px] lg:text-[32px] font-bold text-[#0F172A] leading-[32px] lg:leading-[40px]">
            Charges Calculator
          </h1>
          <ScopeBadge type="exc" />
        </div>
        <p className="text-[14px] text-[#64748B] max-w-3xl">
          The rule cascade that derives a single AWB&rsquo;s charge — exactly as CMTS&rsquo; CHARGECALCULATER computes it,
          but stepped out so users see every input, formula and intermediate output.
        </p>
      </div>

      {/* Header card with AWB context */}
      <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-[#FEF2F2] flex items-center justify-center">
              <Calculator size={24} color="#DC2626" />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[1px] text-[#64748B]">AWB</div>
              <div className="text-[18px] font-mono font-bold text-[#0B2545]">{awb}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[11px] font-bold uppercase tracking-[1px] text-[#64748B]">Computed total</div>
            <div className="text-[28px] font-bold text-[#0B2545]">PKR {grandTotal.toLocaleString()}</div>
            <div className="text-[12px] text-[#16A34A] font-semibold">Rules applied: 7 of 7</div>
          </div>
        </div>
      </div>

      {/* Rule cascade */}
      <div className="space-y-3">
        {STEPS.map((s) => (
          <div key={s.num} className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-full bg-[#0B2545] text-white flex items-center justify-center flex-shrink-0 font-bold">
                {s.num}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-[15px] font-bold text-[#0F172A]">{s.rule}</h3>
                  <CheckCircle2 size={14} color="#16A34A" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <div className="text-[10.5px] font-bold uppercase tracking-[1px] text-[#94A3B8] mb-1">Input</div>
                    <div className="text-[12.5px] text-[#475569]">{s.input}</div>
                  </div>
                  <div>
                    <div className="text-[10.5px] font-bold uppercase tracking-[1px] text-[#94A3B8] mb-1">Formula</div>
                    <code className="text-[12px] text-[#1B4F8B] font-mono bg-[#F1F5F9] px-2 py-1 rounded block">{s.formula}</code>
                  </div>
                  <div>
                    <div className="text-[10.5px] font-bold uppercase tracking-[1px] text-[#94A3B8] mb-1">Output</div>
                    <div className="text-[14px] font-mono font-bold text-[#0B2545]">{s.output}</div>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="text-[10.5px] text-[#94A3B8]">
                    Source: <code className="text-[#1B4F8B]">{s.source}</code>
                  </div>
                  <ChevronRight size={14} color="#94A3B8" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-[16px] border border-[#E2E8F0] bg-[#F8FAFC] p-4 shadow-sm">
        <div className="text-[11px] font-bold uppercase tracking-[1px] text-[#64748B] mb-1">CMTS source tables</div>
        <code className="text-[12px] text-[#475569] font-mono">CHARGECALCULATER · CHARGETYPE · LOCATIONCHARGES · CARGOSUBCLASSCHARGES · CargoClassCharges · Lookup</code>
      </div>
    </div>
  );
}
