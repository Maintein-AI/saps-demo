"use client";

/**
 * P0-5 · Module view — FC-12's functional module map.
 *
 * The persona navigation stays as the default. This is the other lens:
 * all 20 modules in their FC-12 tiers with honest coverage, so a
 * stakeholder can see at a glance what exists, what is thin, and what is
 * missing entirely.
 */

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import {
  COVERAGE_LABEL,
  COVERAGE_STYLE,
  FLOWS,
  MODULES,
  TIER_LABEL,
  TIER_ORDER,
  coverageSummary,
  modulesByTier,
} from "@/lib/architecture";

export default function ModulesPage() {
  const summary = coverageSummary();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Breadcrumb items={[{ label: "Module Map" }]} />
        <div>
          <h1 className="text-[24px] lg:text-[32px] font-bold text-[#0F172A] leading-tight">
            Functional Module Map
          </h1>
          <p className="text-[13px] text-[#64748B] mt-1">
            FC-12 — all 20 modules across three tiers and two spines, running on the AirVault
            platform layer. Coverage is stated honestly: a module that does not exist shows as
            not started rather than being omitted.
          </p>
        </div>
      </div>

      {/* Coverage summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {(["built", "partial", "stub", "not-started"] as const).map((c) => (
          <div key={c} className="rounded-[16px] border border-[#E2E8F0] bg-white p-5">
            <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
              {COVERAGE_LABEL[c]}
            </p>
            <p className="text-[28px] font-bold mt-1" style={{ color: COVERAGE_STYLE[c].fg }}>
              {summary[c]}
            </p>
            <p className="text-[11px] text-[#64748B]">of {MODULES.length} modules</p>
          </div>
        ))}
      </div>

      {/* Tiers */}
      {TIER_ORDER.map((tier) => (
        <div key={tier} className="flex flex-col gap-3">
          <h2 className="text-[16px] font-semibold text-[#0F172A]">{TIER_LABEL[tier]}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {modulesByTier(tier).map((m) => {
              const s = COVERAGE_STYLE[m.coverage];
              return (
                <div
                  key={m.code}
                  className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 flex flex-col gap-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-[#94A3B8] font-mono">{m.code}</p>
                      <h3 className="text-[14px] font-semibold text-[#0F172A] leading-snug">
                        {m.name}
                      </h3>
                    </div>
                    <span
                      className="h-[22px] px-2 rounded-full text-[10px] font-bold inline-flex items-center flex-shrink-0"
                      style={{ backgroundColor: s.bg, color: s.fg }}
                    >
                      {COVERAGE_LABEL[m.coverage]}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    {m.flows.map((f) => (
                      <span
                        key={f}
                        className="h-[18px] px-1.5 rounded bg-[#EBF0F7] text-[#0B2545] text-[10px] font-bold inline-flex items-center font-mono"
                      >
                        {f}
                      </span>
                    ))}
                    <span className="h-[18px] px-1.5 rounded bg-[#F1F5F9] text-[#64748B] text-[10px] font-semibold inline-flex items-center">
                      {m.phase}
                    </span>
                  </div>

                  {m.gap && <p className="text-[12px] text-[#64748B] leading-relaxed">{m.gap}</p>}

                  {m.screens.length > 0 ? (
                    <div className="flex flex-col gap-1 mt-auto pt-2 border-t border-[#F1F5F9]">
                      {m.screens.map((sc) => (
                        <Link
                          key={sc.href}
                          href={sc.href}
                          className="inline-flex items-center gap-1 text-[12px] text-[#1B4F8B] hover:text-[#0B2545] no-underline"
                        >
                          {sc.label}
                          <ArrowUpRight size={12} />
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[12px] text-[#DC2626] mt-auto pt-2 border-t border-[#F1F5F9]">
                      No screens yet
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Flow walkthroughs */}
      <div className="flex flex-col gap-3">
        <div>
          <h2 className="text-[16px] font-semibold text-[#0F172A]">Flow walkthroughs</h2>
          <p className="text-[12px] text-[#64748B] mt-0.5">
            Step through a flowchart screen by screen — FC-01 alone crosses eight portals, which is
            what makes the persona navigation hard to demo against.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {FLOWS.map((f) => {
            const implemented = f.steps.filter((s) => s.href).length;
            return (
              <Link
                key={f.id}
                href={`/flows/${f.id}`}
                className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 hover:border-[#2E75B6] transition-colors no-underline"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[11px] font-bold text-[#94A3B8] font-mono">{f.id}</p>
                  <span className="text-[10px] text-[#94A3B8]">{f.rev}</span>
                </div>
                <h3 className="text-[14px] font-semibold text-[#0F172A] mt-1">{f.title}</h3>
                <p className="text-[12px] text-[#64748B] mt-1 leading-relaxed">{f.subtitle}</p>
                <div className="mt-3 pt-3 border-t border-[#F1F5F9] flex items-center justify-between">
                  <span className="text-[11px] text-[#64748B]">
                    {implemented} of {f.steps.length} steps reachable
                  </span>
                  <span className="text-[12px] font-semibold text-[#1B4F8B] inline-flex items-center gap-1">
                    Walk through <ArrowUpRight size={12} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
