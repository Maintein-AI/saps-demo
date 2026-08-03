"use client";

/**
 * P0-4 · Audit strip.
 *
 * The six audit columns appear on ~60 CMTS tables, and the three site keys
 * on ~30. Every record drawer in AirVault shows them, collapsed by default.
 */

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { formatDateTime, type AuditColumns, type SiteKeys } from "@/lib/domain";

interface Props {
  record: Partial<AuditColumns & SiteKeys>;
  /** Extra rows a specific screen wants to show alongside the standard six. */
  extra?: Array<{ label: string; value: string }>;
  defaultOpen?: boolean;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider">
        {label}
      </span>
      <span className="text-[12px] font-medium text-[#0F172A]">{value}</span>
    </div>
  );
}

export default function AuditStrip({ record, extra, defaultOpen = false }: Props) {
  const [open, setOpen] = useState(defaultOpen);

  const rows: Array<{ label: string; value: string }> = [
    { label: "CreatedBy", value: record.CreatedBy ?? "—" },
    { label: "CreatedDate", value: record.CreatedDate ? formatDateTime(record.CreatedDate) : "—" },
    { label: "UpdatedBy", value: record.UpdatedBy ?? "—" },
    { label: "UpdatedDate", value: record.UpdatedDate ? formatDateTime(record.UpdatedDate) : "—" },
    { label: "IsActive", value: record.IsActive === undefined ? "—" : record.IsActive ? "Yes" : "No" },
    { label: "IsDeleted", value: record.IsDeleted === undefined ? "—" : record.IsDeleted ? "Yes" : "No" },
    { label: "CityId", value: record.CityId?.toString() ?? "—" },
    { label: "Comp_Code", value: record.Comp_Code?.toString() ?? "—" },
    { label: "Off_Code", value: record.Off_Code?.toString() ?? "—" },
    ...(extra ?? []),
  ];

  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-[#F1F5F9] transition-colors cursor-pointer"
      >
        {open ? (
          <ChevronDown size={14} className="text-[#64748B]" />
        ) : (
          <ChevronRight size={14} className="text-[#64748B]" />
        )}
        <span className="text-[12px] font-semibold text-[#64748B]">Audit &amp; system fields</span>
        <span className="ml-auto text-[11px] text-[#94A3B8]">
          {record.UpdatedDate
            ? `Updated ${formatDateTime(record.UpdatedDate)}`
            : record.CreatedDate
              ? `Created ${formatDateTime(record.CreatedDate)}`
              : ""}
        </span>
      </button>

      {open && (
        <div className="px-4 pb-4 pt-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-3 border-t border-[#E2E8F0]">
          {rows.map((r) => (
            <Row key={r.label} {...r} />
          ))}
        </div>
      )}
    </div>
  );
}
