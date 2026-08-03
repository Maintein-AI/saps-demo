"use client";

/**
 * P2-4 · RFID / barcode tag binding & scan-confirmed putaway.
 *
 * FC-03 amendment: "RFID / barcode tag bound to the location; putaway
 * confirmed by scan."
 *
 * This is the **origin of the RFID chain**. FC-08's amendment then depends
 * on it: "The RFID / barcode tag bound at putaway (FC-03) is read at
 * retrieval, piece-count & gate-out — piece count auto-verified, no manual
 * recount."
 *
 * The demo had RFID screens (349 references) but no binding event and no
 * tag→location relationship, so there was nothing for FC-08 to read.
 */

import { useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowUpRight, Barcode, Check, Radio, ScanLine } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import AwbLink from "@/components/awb/AwbLink";
import { useSite } from "@/components/site/SiteContext";
import {
  TAG_BINDINGS,
  formatDateTime,
  formatKg,
  listAwbs,
  listPieces,
  storageLocation,
} from "@/lib/domain";

export default function TagBindingPage() {
  const { scope } = useSite();
  const pieces = useMemo(() => listPieces(scope), [scope]);
  const awbNos = useMemo(() => new Set(listAwbs({ scope }).map((a) => a.AWBNO)), [scope]);
  const bindings = useMemo(
    () => TAG_BINDINGS.filter((b) => awbNos.has(b.AWBNO)),
    [awbNos],
  );

  const [scanned, setScanned] = useState<string | null>(null);

  const unbound = pieces.filter((p) => p.scanState === "unbound");
  const unreadable = pieces.filter((p) => p.scanState === "unreadable");
  const rfidBound = bindings.filter((b) => b.method === "rfid").length;
  const barcodeBound = bindings.filter((b) => b.method === "barcode").length;
  const manualBound = bindings.filter((b) => b.method === "manual").length;

  const scannedPiece = scanned ? pieces.find((p) => p.pieceId === scanned) : null;
  const scannedBinding = scanned ? bindings.find((b) => b.pieceId === scanned) : null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Breadcrumb items={[{ label: "Storage" }, { label: "Tag Binding" }]} />
        <div>
          <div className="flex items-center gap-2">
            <span className="h-[18px] px-1.5 rounded bg-[#EBF0F7] text-[#0B2545] text-[10px] font-bold inline-flex items-center font-mono">
              M05
            </span>
            <span className="h-[18px] px-1.5 rounded bg-[#F1F5F9] text-[#64748B] text-[10px] font-bold inline-flex items-center font-mono">
              FC-03 → FC-08
            </span>
          </div>
          <h1 className="text-[24px] lg:text-[32px] font-bold text-[#0F172A] leading-tight mt-1.5">
            Tag Binding &amp; Scan-Confirmed Putaway
          </h1>
          <p className="text-[13px] text-[#64748B] mt-1">
            The tag bound here becomes the piece&rsquo;s identity for the rest of its life — read at
            retrieval, piece-count verification and gate-out.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: "Pieces in scope", value: pieces.length, tone: "#0F172A" },
          { label: "RFID bound", value: rfidBound, tone: "#7C3AED" },
          { label: "Barcode fallback", value: barcodeBound, tone: "#1B4F8B" },
          { label: "Manual (exception)", value: manualBound, tone: manualBound ? "#D97706" : "#16A34A" },
          { label: "Awaiting binding", value: unbound.length, tone: unbound.length ? "#D97706" : "#16A34A" },
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

      {unreadable.length > 0 && (
        <div className="rounded-[16px] border border-[#FECACA] bg-[#FEF2F2] p-5 flex items-start gap-3">
          <AlertTriangle size={18} className="text-[#DC2626] flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-[14px] font-semibold text-[#DC2626]">
              {unreadable.length} unreadable tag{unreadable.length === 1 ? "" : "s"}
            </p>
            <p className="text-[12px] text-[#991B1B] mt-1">
              These fell back to manual binding with a mandatory reason. They will not auto-verify at
              FC-08 piece count, so retrieval needs a manual recount for these pieces specifically.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {unreadable.map((p) => (
                <span
                  key={p.pieceId}
                  className="h-7 px-2.5 rounded-lg bg-white border border-[#FECACA] text-[12px] font-mono font-semibold text-[#DC2626] inline-flex items-center"
                >
                  {p.pieceId}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Scan station */}
      <div className="rounded-[16px] border border-[#E2E8F0] bg-white overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[#E2E8F0] flex items-center gap-2">
          <ScanLine size={16} className="text-[#64748B]" />
          <h3 className="text-[14px] font-semibold text-[#0F172A]">Bind a tag</h3>
          <span className="ml-auto text-[11px] text-[#94A3B8]">
            Scan tag → scan / select location → confirm
          </span>
        </div>

        <div className="p-5">
          <div className="rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-6 flex flex-col items-center gap-3">
            <Radio size={28} className="text-[#94A3B8]" />
            <p className="text-[13px] text-[#64748B]">
              Handheld reader — select a piece to simulate a scan
            </p>
            <select
              value={scanned ?? ""}
              onChange={(e) => setScanned(e.target.value || null)}
              className="h-10 px-3 rounded-lg border border-[#E2E8F0] bg-white text-[13px] font-mono outline-none cursor-pointer min-w-[260px]"
            >
              <option value="">— no tag scanned —</option>
              {pieces.slice(0, 40).map((p) => (
                <option key={p.pieceId} value={p.pieceId}>
                  {p.pieceId} · {p.AWBNO} {p.rfidEpc ? "" : "(no RFID)"}
                </option>
              ))}
            </select>
          </div>

          {scannedPiece && (
            <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="rounded-xl border border-[#E2E8F0] p-4">
                <p className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-3">
                  Piece
                </p>
                <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                  {[
                    ["Piece ID", scannedPiece.pieceId],
                    ["AWB", scannedPiece.AWBNO],
                    ["Weight", formatKg(scannedPiece.weights.chargeableKg)],
                    [
                      "Dimensions",
                      `${scannedPiece.dimensions.lengthCm}×${scannedPiece.dimensions.widthCm}×${scannedPiece.dimensions.heightCm} ${scannedPiece.dimensions.unit}`,
                    ],
                  ].map(([l, v]) => (
                    <div key={l} className="flex flex-col gap-0.5">
                      <span className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider">
                        {l}
                      </span>
                      <span className="text-[13px] font-medium text-[#0F172A] font-mono">{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className="rounded-xl border p-4"
                style={{
                  borderColor: scannedPiece.rfidEpc ? "#DDD6FE" : "#FECACA",
                  backgroundColor: scannedPiece.rfidEpc ? "#FAF9FF" : "#FEF2F2",
                }}
              >
                <p
                  className="text-[11px] font-semibold uppercase tracking-wider mb-3"
                  style={{ color: scannedPiece.rfidEpc ? "#7C3AED" : "#DC2626" }}
                >
                  Tag read
                </p>
                {scannedPiece.rfidEpc ? (
                  <>
                    <div className="flex items-center gap-2">
                      <Radio size={14} className="text-[#7C3AED]" />
                      <span className="text-[13px] font-mono font-semibold text-[#0F172A] break-all">
                        {scannedPiece.rfidEpc}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#6D28D9] mt-2">RFID EPC — method: rfid</p>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <Barcode size={14} className="text-[#DC2626]" />
                      <span className="text-[13px] font-mono font-semibold text-[#0F172A]">
                        {scannedPiece.barcode}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#991B1B] mt-2">
                      RFID unreadable — barcode fallback. Manual reason required.
                    </p>
                  </>
                )}

                {scannedBinding && (
                  <div className="mt-3 pt-3 border-t border-[#E2E8F0]">
                    <p className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
                      Bound to
                    </p>
                    <p className="text-[13px] font-semibold text-[#0F172A] mt-1">
                      {storageLocation(scannedBinding.locationId)?.NAME}
                    </p>
                    <p className="text-[11px] text-[#94A3B8]">
                      {formatDateTime(scannedBinding.boundAt)} · {scannedBinding.boundBy}
                    </p>
                    {scannedBinding.manualReason && (
                      <p className="text-[11px] text-[#D97706] mt-1.5">
                        {scannedBinding.manualReason}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="px-5 py-3 bg-[#F8FAFC] border-t border-[#E2E8F0]">
          <p className="text-[11px] text-[#64748B]">
            Putaway cannot complete without a scan confirmation. &ldquo;Mark as stored&rdquo; is not offered —
            that is the point of the amendment.
          </p>
        </div>
      </div>

      {/* Binding register */}
      <div className="rounded-[16px] border border-[#E2E8F0] bg-white overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[#E2E8F0]">
          <h3 className="text-[14px] font-semibold text-[#0F172A]">Binding register</h3>
          <p className="text-[11px] text-[#94A3B8] mt-0.5">
            Tag → piece → AWB → location. Re-binding on a move retains the previous binding as
            history.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <th className="text-left px-4 py-2.5">Piece</th>
                <th className="text-left px-4 py-2.5">AWB</th>
                <th className="text-left px-4 py-2.5">Method</th>
                <th className="text-left px-4 py-2.5">Tag value</th>
                <th className="text-left px-4 py-2.5">Location</th>
                <th className="text-left px-4 py-2.5">Bound</th>
                <th className="text-left px-4 py-2.5">By</th>
              </tr>
            </thead>
            <tbody>
              {bindings.slice(0, 40).map((b) => {
                const loc = storageLocation(b.locationId);
                const style =
                  b.method === "rfid"
                    ? { bg: "#EDE9FE", fg: "#7C3AED", Icon: Radio }
                    : b.method === "barcode"
                      ? { bg: "#DBEAFE", fg: "#1B4F8B", Icon: Barcode }
                      : { bg: "#FEF3C7", fg: "#D97706", Icon: AlertTriangle };
                return (
                  <tr key={b.id} className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC]">
                    <td className="px-4 py-2.5 font-mono font-semibold">{b.pieceId}</td>
                    <td className="px-4 py-2.5">
                      <AwbLink awbNo={b.AWBNO} awbId={b.awbId} />
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className="h-[20px] px-2 rounded text-[10px] font-bold inline-flex items-center gap-1"
                        style={{ backgroundColor: style.bg, color: style.fg }}
                      >
                        <style.Icon size={10} />
                        {b.method}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 font-mono text-[11px] text-[#64748B] max-w-[200px] truncate">
                      {b.tagValue ?? "—"}
                    </td>
                    <td className="px-4 py-2.5">{loc?.ABBREVATION ?? "—"}</td>
                    <td className="px-4 py-2.5 text-[12px] text-[#64748B] whitespace-nowrap">
                      {formatDateTime(b.boundAt)}
                    </td>
                    <td className="px-4 py-2.5 text-[12px] text-[#64748B]">{b.boundBy}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {bindings.length > 40 && (
          <div className="px-5 py-2.5 bg-[#F8FAFC] border-t border-[#E2E8F0]">
            <p className="text-[11px] text-[#64748B]">
              Showing 40 of {bindings.length} bindings.
            </p>
          </div>
        )}
      </div>

      <div className="rounded-[16px] border border-[#DDD6FE] bg-[#F5F3FF] p-5 flex items-start gap-3">
        <Check size={18} className="text-[#7C3AED] flex-shrink-0 mt-0.5" strokeWidth={2.5} />
        <div className="flex-1">
          <p className="text-[13px] font-semibold text-[#7C3AED]">
            This binding is what FC-08 reads
          </p>
          <p className="text-[12px] text-[#6D28D9] mt-1">
            At retrieval the picker scans the same tag; the piece count verifies itself. At gate-out
            the tag is matched against the gate pass and DO. Without the binding, both fall back to
            manual counting.
          </p>
          <div className="flex items-center gap-3 mt-3 flex-wrap">
            <Link
              href="/warehouse-manager/picking"
              className="inline-flex items-center gap-1 h-9 px-3 rounded-lg bg-white border border-[#DDD6FE] text-[12px] font-semibold text-[#7C3AED] no-underline"
            >
              Picking (FC-08 §07–09) <ArrowUpRight size={12} />
            </Link>
            <Link
              href="/lifter-operator/rfid-scan"
              className="inline-flex items-center gap-1 h-9 px-3 rounded-lg bg-white border border-[#DDD6FE] text-[12px] font-semibold text-[#7C3AED] no-underline"
            >
              Operator RFID scan <ArrowUpRight size={12} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
