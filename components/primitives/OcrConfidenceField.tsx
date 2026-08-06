"use client";

/**
 * P0-4 · OCR confidence field.
 *
 * FC-01 amendment (steps 05b–05d):
 *   "Auto-extract line items ... each with confidence score"
 *   "All items accepted? (confidence ≥ threshold & operator-confirmed)"
 *   "Operator reviews & corrects low-confidence items individually"
 *
 * SCOPE — only the two real scan points may use this control:
 *   1. /import/ocr-intake                        MAWB / HAWB off the pouch
 *   2. /gate-entry/authority-letter-digitisation receiver's docs at collection
 *
 * FC-06 OOC capture and FC-11 export document capture were drawn as OCR
 * and have been converted to keyed forms — use `FormField` there. Reach
 * for this control only where a scanner is genuinely in the loop.
 */

import { useState } from "react";
import { AlertTriangle, Check, PencilLine } from "lucide-react";
import { OCR_CONFIDENCE_THRESHOLD, type OcrValue } from "@/lib/domain";

const STATE_STYLE = {
  "auto-accepted": { bg: "#DCFCE7", fg: "#16A34A", border: "#BBF7D0", Icon: Check, label: "Auto-accepted" },
  "needs-review": { bg: "#FEF3C7", fg: "#D97706", border: "#FDE68A", Icon: AlertTriangle, label: "Needs review" },
  "operator-corrected": { bg: "#EDE9FE", fg: "#7C3AED", border: "#DDD6FE", Icon: PencilLine, label: "Corrected" },
} as const;

interface Props<T extends string | number> {
  label: string;
  value: OcrValue<T>;
  /** Rendered after the value, e.g. "kg". */
  suffix?: string;
  /**
   * Commit a corrected value. Supplying this is what makes the field
   * editable — FC-01 05d / FC-02 §06d is "operator corrects low-confidence
   * items", which needs a real edit, not an acknowledgement. Omit for
   * read-only views.
   */
  onChange?: (next: T) => void;
  compact?: boolean;
}

export default function OcrConfidenceField<T extends string | number>({
  label,
  value,
  suffix,
  onChange,
  compact,
}: Props<T>) {
  const s = STATE_STYLE[value.state];
  const pct = Math.round(value.confidence * 100);
  const changed = value.state === "operator-corrected";
  const numeric = typeof value.extracted === "number";

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");

  function open() {
    setDraft(String(value.value));
    setEditing(true);
  }

  function commit() {
    setEditing(false);
    const raw = draft.trim();
    // An empty box is a cancelled edit, not a blanked field.
    if (raw === "") return;
    if (numeric) {
      const n = Number(raw);
      if (!Number.isFinite(n)) return;
      if (n !== (value.value as number)) onChange?.(n as T);
      return;
    }
    if (raw !== (value.value as string)) onChange?.(raw as T);
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
          {label}
        </span>
        <span
          className="inline-flex items-center gap-1 h-[18px] px-1.5 rounded text-[10px] font-bold"
          style={{ backgroundColor: s.bg, color: s.fg }}
          title={`Confidence ${pct}% · threshold ${Math.round(OCR_CONFIDENCE_THRESHOLD * 100)}%`}
        >
          <s.Icon size={10} strokeWidth={2.5} />
          {pct}%
        </span>
      </div>

      <div
        className="flex items-center gap-2 rounded-lg border px-3"
        style={{
          borderColor: editing ? "#1B4F8B" : s.border,
          backgroundColor: editing ? "#FFFFFF" : value.state === "auto-accepted" ? "#F8FAFC" : s.bg,
          height: compact ? 32 : 36,
        }}
      >
        {editing ? (
          <input
            autoFocus
            type={numeric ? "number" : "text"}
            step={numeric ? "any" : undefined}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === "Enter") commit();
              if (e.key === "Escape") setEditing(false);
            }}
            aria-label={`${label} — corrected value`}
            className="flex-1 min-w-0 bg-transparent text-[13px] font-medium text-[#0F172A] outline-none"
          />
        ) : (
          <span className="text-[13px] font-medium text-[#0F172A] truncate flex-1">
            {String(value.value)}
            {suffix ? <span className="text-[#64748B] ml-1">{suffix}</span> : null}
          </span>
        )}

        {onChange && !editing && (
          <button
            onClick={open}
            className="text-[11px] font-semibold hover:underline cursor-pointer flex-shrink-0"
            style={{ color: value.state === "needs-review" ? "#D97706" : "#1B4F8B" }}
          >
            {value.state === "needs-review" ? "Correct" : "Edit"}
          </button>
        )}
      </div>

      {changed && (
        <span className="text-[10px] text-[#7C3AED]">
          OCR read “{String(value.extracted)}” · corrected by {value.correctedBy}
        </span>
      )}
      {editing && (
        <span className="text-[10px] text-[#64748B]">Enter to save · Esc to cancel</span>
      )}
      {!editing && value.state === "needs-review" && (
        <span className="text-[10px] text-[#D97706]">
          Below {Math.round(OCR_CONFIDENCE_THRESHOLD * 100)}% threshold — operator confirmation required
        </span>
      )}
    </div>
  );
}

/**
 * FC-01 step 05c — the acceptance gate. Commit is blocked while any item
 * is below threshold and unconfirmed.
 */
export function OcrAcceptanceGate({
  total,
  outstanding,
}: {
  total: number;
  outstanding: number;
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
          <Check size={16} className="text-[#16A34A]" strokeWidth={2.5} />
        ) : (
          <AlertTriangle size={16} className="text-[#D97706]" strokeWidth={2.5} />
        )}
      </div>
      <div className="flex-1">
        <p className="text-[13px] font-semibold text-[#0F172A]">
          {ready
            ? "All items accepted — ready to commit"
            : `${outstanding} of ${total} items need operator confirmation`}
        </p>
        <p className="text-[12px] text-[#64748B] mt-0.5">
          FC-01 05c acceptance gate — commit is blocked until every item is
          auto-accepted or operator-confirmed.
        </p>
      </div>
    </div>
  );
}
