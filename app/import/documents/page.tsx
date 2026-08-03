"use client";

/**
 * P1-2 · M02 Document Management repository.
 *
 * FC-12 wires M02 → M03. Three amendments depend on it: FC-04 attaches the
 * CDR evidence pack "to the CDR (doc mgmt M02)", FC-08 auto-attaches the
 * digital POD to the AWB, FC-01/FC-11 store OCR source scans.
 *
 * CMTS has no document table — it stores paths inline (AuthAgentPic,
 * RcvngPersonPic, CompLogo, PicPath). This is an AirVault addition; flagged
 * for sign-off.
 */

import { useMemo, useState } from "react";
import Link from "next/link";
import { FileText, History, ScanLine, Search, Sparkles, X } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import EmptyState from "@/components/EmptyState";
import AwbLink from "@/components/awb/AwbLink";
import { useSite } from "@/components/site/SiteContext";
import {
  DOCUMENT_SOURCE_LABEL,
  DOCUMENT_TYPE_LABEL,
  OCR_CONFIDENCE_THRESHOLD,
  formatDateTime,
  listDocuments,
  type DocumentType,
  type StoredDocument,
} from "@/lib/domain";

const SOURCE_STYLE: Record<string, { bg: string; fg: string }> = {
  scanner: { bg: "#EDE9FE", fg: "#7C3AED" },
  upload: { bg: "#DBEAFE", fg: "#1B4F8B" },
  generated: { bg: "#DCFCE7", fg: "#16A34A" },
  edi: { bg: "#FEF3C7", fg: "#D97706" },
};

export default function DocumentRepositoryPage() {
  const { scope, isHq } = useSite();
  const [q, setQ] = useState("");
  const [type, setType] = useState<DocumentType | "">("");
  const [open, setOpen] = useState<StoredDocument | null>(null);

  const all = listDocuments(scope);
  const rows = useMemo(() => {
    let r = all;
    if (type) r = r.filter((d) => d.type === type);
    if (q) {
      const s = q.toLowerCase();
      r = r.filter(
        (d) =>
          d.title.toLowerCase().includes(s) ||
          (d.AWBNO ?? "").toLowerCase().includes(s) ||
          (d.IGMNO ?? "").toLowerCase().includes(s) ||
          d.id.toLowerCase().includes(s),
      );
    }
    return r;
  }, [all, q, type]);

  const typesPresent = useMemo(
    () => Array.from(new Set(all.map((d) => d.type))).sort(),
    [all],
  );

  const scanned = all.filter((d) => d.ocrProcessed);
  const lowConfidence = scanned.filter(
    (d) => (d.ocrMeanConfidence ?? 1) < OCR_CONFIDENCE_THRESHOLD,
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Breadcrumb items={[{ label: "Import Documentation" }, { label: "Document Repository" }]} />
        <div>
          <div className="flex items-center gap-2">
            <span className="h-[18px] px-1.5 rounded bg-[#EBF0F7] text-[#0B2545] text-[10px] font-bold inline-flex items-center font-mono">
              M02
            </span>
            <span className="h-[18px] px-1.5 rounded bg-[#FEE2E2] text-[#DC2626] text-[10px] font-bold inline-flex items-center">
              AirVault addition — no CMTS table
            </span>
          </div>
          <h1 className="text-[24px] lg:text-[32px] font-bold text-[#0F172A] leading-tight mt-1.5">
            Document Repository
          </h1>
          <p className="text-[13px] text-[#64748B] mt-1">
            Every scan, upload and generated document, linked to its AWB.
            {isHq ? " All sites." : ` ${scope} only.`}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Documents", value: all.length, tone: "#0F172A" },
          { label: "OCR-processed", value: scanned.length, tone: "#7C3AED" },
          { label: "Below confidence threshold", value: lowConfidence.length, tone: lowConfidence.length ? "#D97706" : "#16A34A" },
          { label: "Archived", value: all.filter((d) => d.archived).length, tone: "#64748B" },
        ].map((k) => (
          <div key={k.label} className="rounded-[16px] border border-[#E2E8F0] bg-white p-5">
            <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
              {k.label}
            </p>
            <p className="text-[26px] font-bold mt-1" style={{ color: k.tone }}>
              {k.value}
            </p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[240px] max-w-[380px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Document ID, title, AWB or IGM…"
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-[#E2E8F0] bg-white text-[13px] outline-none focus:border-[#2E75B6] transition-colors"
          />
        </div>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as DocumentType | "")}
          className="h-9 px-3 rounded-lg border border-[#E2E8F0] bg-white text-[13px] outline-none cursor-pointer"
        >
          <option value="">All document types</option>
          {typesPresent.map((t) => (
            <option key={t} value={t}>
              {DOCUMENT_TYPE_LABEL[t]}
            </option>
          ))}
        </select>
        <span className="text-[12px] text-[#64748B]">{rows.length} shown</span>
      </div>

      {rows.length === 0 ? (
        <EmptyState title="No documents match" description="Try clearing the filters or switching site." />
      ) : (
        <div className="rounded-[16px] border border-[#E2E8F0] bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  <th className="text-left px-4 py-2.5">Document</th>
                  <th className="text-left px-4 py-2.5">Type</th>
                  <th className="text-left px-4 py-2.5">Source</th>
                  <th className="text-left px-4 py-2.5">AWB</th>
                  <th className="text-right px-4 py-2.5">Pages</th>
                  <th className="text-left px-4 py-2.5">OCR confidence</th>
                  <th className="text-left px-4 py-2.5">Uploaded</th>
                  <th className="text-right px-4 py-2.5">Ver</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((d) => {
                  const s = SOURCE_STYLE[d.source];
                  const low = d.ocrMeanConfidence !== null && d.ocrMeanConfidence < OCR_CONFIDENCE_THRESHOLD;
                  return (
                    <tr
                      key={d.id}
                      onClick={() => setOpen(d)}
                      className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                    >
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <FileText size={14} className="text-[#94A3B8] flex-shrink-0" />
                          <span className="font-mono text-[11px] text-[#64748B]">{d.id}</span>
                          {d.archived && (
                            <span className="h-[16px] px-1 rounded bg-[#F1F5F9] text-[#64748B] text-[9px] font-bold inline-flex items-center">
                              archived
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-2.5">{DOCUMENT_TYPE_LABEL[d.type]}</td>
                      <td className="px-4 py-2.5">
                        <span
                          className="h-[20px] px-2 rounded text-[10px] font-bold inline-flex items-center"
                          style={{ backgroundColor: s.bg, color: s.fg }}
                        >
                          {DOCUMENT_SOURCE_LABEL[d.source]}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        {d.AWBNO ? <AwbLink awbNo={d.AWBNO} awbId={d.awbId ?? undefined} /> : "—"}
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono">{d.pages}</td>
                      <td className="px-4 py-2.5">
                        {d.ocrMeanConfidence === null ? (
                          <span className="text-[#CBD5E1]">—</span>
                        ) : (
                          <span
                            className="inline-flex items-center gap-1 font-mono text-[12px] font-semibold"
                            style={{ color: low ? "#D97706" : "#16A34A" }}
                          >
                            <Sparkles size={11} />
                            {Math.round(d.ocrMeanConfidence * 100)}%
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-[12px] text-[#64748B] whitespace-nowrap">
                        {formatDateTime(d.uploadedAt)}
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono">
                        v{d.versions[d.versions.length - 1].version}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Viewer drawer */}
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/30" onClick={() => setOpen(null)} />
          <div className="relative w-full max-w-[520px] h-full bg-white shadow-xl overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-[#E2E8F0] px-5 py-4 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-mono text-[11px] text-[#64748B]">{open.id}</p>
                <h3 className="text-[15px] font-semibold text-[#0F172A] truncate">{open.title}</h3>
              </div>
              <button
                onClick={() => setOpen(null)}
                className="w-8 h-8 rounded-lg hover:bg-[#F1F5F9] flex items-center justify-center text-[#64748B] cursor-pointer flex-shrink-0"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-5 flex flex-col gap-5">
              {/* Preview placeholder — the demo has no real files */}
              <div className="rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] h-[220px] flex flex-col items-center justify-center gap-2">
                <ScanLine size={28} className="text-[#CBD5E1]" />
                <p className="text-[12px] text-[#94A3B8]">
                  {open.pages} page{open.pages === 1 ? "" : "s"} · {open.sizeKb} KB
                </p>
                <p className="text-[11px] text-[#CBD5E1]">Preview not available in the demo</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  ["Type", DOCUMENT_TYPE_LABEL[open.type]],
                  ["Source", DOCUMENT_SOURCE_LABEL[open.source]],
                  ["AWB", open.AWBNO ?? "—"],
                  ["IGM", open.IGMNO ?? "—"],
                  ["Uploaded by", open.uploadedBy],
                  ["Uploaded at", formatDateTime(open.uploadedAt)],
                  ["Site", open.site],
                  ["CDR reference", open.cdrRef ?? "—"],
                ].map(([l, v]) => (
                  <div key={l} className="flex flex-col gap-1">
                    <span className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider">
                      {l}
                    </span>
                    <span className="text-[13px] font-medium text-[#0F172A] break-words">{v}</span>
                  </div>
                ))}
              </div>

              {open.ocrProcessed && (
                <div className="rounded-xl border border-[#DDD6FE] bg-[#F5F3FF] p-4">
                  <div className="flex items-center gap-2">
                    <Sparkles size={14} className="text-[#7C3AED]" />
                    <p className="text-[13px] font-semibold text-[#7C3AED]">OCR extraction ran</p>
                  </div>
                  <p className="text-[12px] text-[#6D28D9] mt-1">
                    Mean confidence {Math.round((open.ocrMeanConfidence ?? 0) * 100)}% against a{" "}
                    {Math.round(OCR_CONFIDENCE_THRESHOLD * 100)}% threshold.
                  </p>
                  {open.awbId && (
                    <Link
                      href={`/awb/${open.awbId}?tab=intake`}
                      className="text-[12px] font-semibold text-[#7C3AED] hover:underline no-underline mt-2 inline-block"
                    >
                      View extracted items →
                    </Link>
                  )}
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <History size={14} className="text-[#64748B]" />
                  <p className="text-[13px] font-semibold text-[#0F172A]">Version history</p>
                </div>
                <div className="flex flex-col gap-2">
                  {open.versions.map((v) => (
                    <div
                      key={v.version}
                      className="rounded-xl border border-[#E2E8F0] px-3 py-2.5 flex items-start gap-3"
                    >
                      <span className="font-mono text-[12px] font-bold text-[#0F172A] flex-shrink-0">
                        v{v.version}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] text-[#0F172A]">{v.note ?? "No note"}</p>
                        <p className="text-[11px] text-[#94A3B8]">
                          {formatDateTime(v.uploadedAt)} · {v.uploadedBy}
                        </p>
                      </div>
                      {v.superseded && (
                        <span className="h-[18px] px-1.5 rounded bg-[#F1F5F9] text-[#64748B] text-[9px] font-bold inline-flex items-center flex-shrink-0">
                          superseded
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-[#94A3B8] mt-2">
                  Superseded versions are marked, never deleted — IsDeleted semantics.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
