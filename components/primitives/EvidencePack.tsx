"use client";

/**
 * P0-4 · Digital evidence pack.
 *
 * FC-04 amendment:
 *   "Evidence pack captured digitally: scan / photos, RFID/AWB-linked,
 *    timestamped, attached to the CDR (doc mgmt M02) — vs remarks-only in CMTS."
 *
 * The RFID/AWB linkage and the timestamp are what make the pack defensible;
 * they are shown per item rather than summarised.
 */

import {
  Camera,
  ClipboardList,
  FileText,
  Package,
  ShieldCheck,
  Weight,
  type LucideIcon,
} from "lucide-react";
import { EVIDENCE_LABEL, formatDateTime, type EvidenceItem, type EvidenceKind } from "@/lib/domain";

const KIND_ICON: Record<EvidenceKind, LucideIcon> = {
  photo: Camera,
  weight: Weight,
  "piece-count": Package,
  "package-condition": ClipboardList,
  "seal-condition": ShieldCheck,
  remarks: FileText,
};

/** FC-04 §03 lists exactly six evidence items — completeness is meaningful. */
const ALL_KINDS: EvidenceKind[] = [
  "photo",
  "weight",
  "piece-count",
  "package-condition",
  "seal-condition",
  "remarks",
];

export default function EvidencePack({
  items,
  title = "Evidence pack",
  showCompleteness = true,
}: {
  items: EvidenceItem[];
  title?: string;
  showCompleteness?: boolean;
}) {
  const present = new Set(items.map((i) => i.kind));
  const missing = ALL_KINDS.filter((k) => !present.has(k));

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white overflow-hidden">
      <div className="px-5 py-3.5 border-b border-[#E2E8F0] flex items-center justify-between">
        <div>
          <h3 className="text-[14px] font-semibold text-[#0F172A]">{title}</h3>
          <p className="text-[11px] text-[#94A3B8] mt-0.5">
            RFID/AWB-linked · timestamped · attached to document management (M02)
          </p>
        </div>
        {showCompleteness && (
          <span
            className="h-6 px-2.5 rounded-full text-[11px] font-semibold inline-flex items-center"
            style={{
              backgroundColor: missing.length === 0 ? "#DCFCE7" : "#FEF3C7",
              color: missing.length === 0 ? "#16A34A" : "#D97706",
            }}
          >
            {present.size}/6 evidence types
          </span>
        )}
      </div>

      {items.length === 0 ? (
        <div className="px-5 py-8 text-center">
          <p className="text-[13px] text-[#64748B]">No evidence captured yet</p>
        </div>
      ) : (
        <div className="divide-y divide-[#F1F5F9]">
          {items.map((item) => {
            const Icon = KIND_ICON[item.kind];
            return (
              <div key={item.id} className="px-5 py-3 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#F1F5F9] flex items-center justify-center flex-shrink-0">
                  <Icon size={15} className="text-[#64748B]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[12px] font-semibold text-[#0F172A]">
                      {EVIDENCE_LABEL[item.kind]}
                    </span>
                    {item.documentId && (
                      <span className="h-[18px] px-1.5 rounded bg-[#DBEAFE] text-[#1B4F8B] text-[10px] font-bold inline-flex items-center font-mono">
                        {item.documentId}
                      </span>
                    )}
                  </div>
                  <p className="text-[13px] text-[#0F172A] mt-0.5">{item.value}</p>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <span className="text-[10px] text-[#94A3B8] font-mono">{item.linkedAwbNo}</span>
                    {item.linkedRfid && (
                      <span className="text-[10px] text-[#94A3B8] font-mono truncate max-w-[220px]">
                        RFID {item.linkedRfid}
                      </span>
                    )}
                    <span className="text-[10px] text-[#94A3B8]">
                      {formatDateTime(item.capturedAt)} · {item.capturedBy}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showCompleteness && missing.length > 0 && (
        <div className="px-5 py-2.5 bg-[#FFFBEB] border-t border-[#FDE68A]">
          <p className="text-[11px] text-[#D97706]">
            Not yet captured: {missing.map((k) => EVIDENCE_LABEL[k]).join(", ")}
          </p>
        </div>
      )}
    </div>
  );
}
