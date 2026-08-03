"use client";

/**
 * P0-4 · Document number with CMTS-continuity provenance.
 *
 * Four separate flow amendments require AirVault numbering to continue the
 * CMTS sequence — FC-04 (CDR refs), FC-07 (invoices / vouchers), FC-08
 * (gate passes), FC-10 (notices). CMTS implements this with
 * `AutoIncrementValues` (per cargo class, per year) + `TABLESEQUENCE`.
 *
 * Rendering the provenance on hover is what makes continuity checkable at
 * sign-off rather than a claim in a document.
 */

import { useState } from "react";
import { Hash } from "lucide-react";
import { cargoClass, type DocNumberRef } from "@/lib/domain";

const SERIES_LABEL: Record<DocNumberRef["series"], string> = {
  AWB_INDEX: "AWB index",
  ARRIVAL_ADVICE: "Arrival advice",
  CDR: "CDR reference",
  GR_VOUCHER: "Godown rent voucher",
  GR_DUPLICATE: "GR duplicate",
  INVOICE: "Invoice",
  CREDIT_NOTE: "Credit note",
  DELIVERY_ORDER: "Delivery order",
  GATE_PASS: "Gate pass",
  SECTION_82_NOTICE: "Section 82 notice",
  TRANSHIPMENT_PERMIT: "Transhipment permit",
  ULD_BUILD_REPORT: "ULD build-up report",
  DISCREPANCY_NOTE: "Discrepancy note",
  EXPORT_INVOICE: "Export invoice",
  SINGLE_DECLARATION: "Single Declaration (SD)",
  OOC: "Out-of-charge",
};

export default function DocNumber({
  doc,
  mono = true,
  showIcon = true,
}: {
  doc: DocNumberRef;
  mono?: boolean;
  showIcon?: boolean;
}) {
  const [hover, setHover] = useState(false);
  const cls = doc.cargoClassId ? cargoClass(doc.cargoClassId) : null;

  return (
    <span
      className="relative inline-flex items-center gap-1.5"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {showIcon && <Hash size={12} className="text-[#94A3B8] flex-shrink-0" />}
      <span
        className={`text-[13px] font-semibold text-[#0F172A] border-b border-dashed border-[#CBD5E1] cursor-help ${
          mono ? "font-mono" : ""
        }`}
      >
        {doc.value}
      </span>

      {hover && (
        <span className="absolute left-0 top-full mt-1.5 z-50 w-[280px] rounded-xl border border-[#E2E8F0] bg-white p-3 shadow-lg text-left">
          <span className="block text-[11px] font-bold text-[#0F172A] mb-2">
            {SERIES_LABEL[doc.series]}
          </span>
          <span className="grid grid-cols-2 gap-x-3 gap-y-1.5">
            <span className="text-[10px] text-[#94A3B8] uppercase tracking-wider">Sequence</span>
            <span className="text-[11px] font-mono text-[#0F172A]">{doc.sequence}</span>

            <span className="text-[10px] text-[#94A3B8] uppercase tracking-wider">Year scope</span>
            <span className="text-[11px] font-mono text-[#0F172A]">{doc.year}</span>

            <span className="text-[10px] text-[#94A3B8] uppercase tracking-wider">Class scope</span>
            <span className="text-[11px] font-mono text-[#0F172A]">
              {cls ? cls.ABBREVATION : "all classes"}
            </span>

            <span className="text-[10px] text-[#94A3B8] uppercase tracking-wider">CMTS last</span>
            <span
              className="text-[11px] font-mono"
              style={{ color: doc.continuesFromCmts === null ? "#94A3B8" : "#16A34A" }}
            >
              {doc.continuesFromCmts ?? "no ancestor"}
            </span>
          </span>
          <span className="block text-[10px] text-[#64748B] mt-2 pt-2 border-t border-[#F1F5F9]">
            {doc.continuesFromCmts === null
              ? "New AirVault series — nothing in CMTS to continue."
              : "Continues the CMTS series — no gap, no reuse."}
          </span>
        </span>
      )}
    </span>
  );
}
