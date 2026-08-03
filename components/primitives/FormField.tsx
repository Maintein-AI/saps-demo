"use client";

/**
 * Keyed form field — the default capture control.
 *
 * The counterpart to `OcrConfidenceField`. OCR runs at exactly two points
 * in AirVault (MAWB/HAWB off the flight pouch, and the receiver's
 * documents at collection); every other value is typed by a named
 * operator against a named source document.
 *
 * So this control shows no confidence score — nothing was inferred. What
 * it does show is provenance: what paper the operator read it off, who
 * keyed it, and whether a supervisor countersigned. That is what an
 * auditor asks for, and it is the thing a confidence percentage was
 * standing in for at the sites that have been converted.
 */

import { Keyboard, ShieldCheck } from "lucide-react";
import type { FormValue } from "@/lib/domain";

interface Props<T extends string | number> {
  label: string;
  value: FormValue<T>;
  /** Rendered after the value, e.g. "kg". */
  suffix?: string;
  /** Called when the operator edits — omit for read-only views. */
  onEdit?: () => void;
  compact?: boolean;
}

export default function FormField<T extends string | number>({
  label,
  value,
  suffix,
  onEdit,
  compact,
}: Props<T>) {
  const verified = !!value.verifiedBy;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
          {label}
        </span>
        <span
          className="inline-flex items-center gap-1 h-[18px] px-1.5 rounded text-[10px] font-bold"
          style={{
            backgroundColor: verified ? "#DCFCE7" : "#EBF0F7",
            color: verified ? "#16A34A" : "#1B4F8B",
          }}
          title={
            verified
              ? `Keyed by ${value.enteredBy}, countersigned by ${value.verifiedBy}`
              : `Keyed by ${value.enteredBy} from ${value.source}`
          }
        >
          {verified ? (
            <>
              <ShieldCheck size={10} strokeWidth={2.5} />
              Verified
            </>
          ) : (
            <>
              <Keyboard size={10} strokeWidth={2.5} />
              Keyed
            </>
          )}
        </span>
      </div>

      <div
        className="flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3"
        style={{ height: compact ? 32 : 36 }}
      >
        <span className="text-[13px] font-medium text-[#0F172A] truncate flex-1">
          {String(value.value)}
          {suffix ? <span className="text-[#64748B] ml-1">{suffix}</span> : null}
        </span>
        {onEdit && (
          <button
            onClick={onEdit}
            className="text-[11px] font-semibold text-[#1B4F8B] hover:underline cursor-pointer flex-shrink-0"
          >
            Edit
          </button>
        )}
      </div>

      <span className="text-[10px] text-[#94A3B8] truncate">
        {value.source} · {value.enteredBy}
        {verified ? ` · countersigned ${value.verifiedBy}` : ""}
      </span>
    </div>
  );
}

/**
 * The form counterpart to `OcrAcceptanceGate` — a completeness check
 * rather than a confidence check. Commit is blocked while a required
 * field is still blank.
 */
export function FormCompletenessGate({
  total,
  outstanding,
  context,
}: {
  total: number;
  outstanding: number;
  context: string;
}) {
  const ready = outstanding === 0;
  return (
    <div
      className="rounded-xl border p-4 flex items-start gap-3"
      style={{
        borderColor: ready ? "#BBF7D0" : "#FDE68A",
        backgroundColor: ready ? "#F0FDF4" : "#FFFBEB",
      }}
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: ready ? "#DCFCE7" : "#FEF3C7" }}
      >
        {ready ? (
          <ShieldCheck size={16} className="text-[#16A34A]" strokeWidth={2.5} />
        ) : (
          <Keyboard size={16} className="text-[#D97706]" strokeWidth={2.5} />
        )}
      </div>
      <div className="flex-1">
        <p className="text-[13px] font-semibold text-[#0F172A]">
          {ready
            ? `All ${total} fields keyed — ready to commit`
            : `${outstanding} of ${total} fields outstanding`}
        </p>
        <p className="text-[12px] text-[#64748B] mt-0.5">{context}</p>
      </div>
    </div>
  );
}
