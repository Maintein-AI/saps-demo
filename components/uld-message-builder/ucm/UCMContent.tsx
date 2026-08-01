"use client";

import { useState, useCallback, useMemo } from "react";
import { useToast } from "@/components/ToastContext";
import MessageHeaderCard from "./MessageHeaderCard";
import ULDTable from "./ULDTable";
import CorrectionDrawer from "./CorrectionDrawer";
import { generateInUlds, generateOutUlds, type ULDRecord } from "./ULDTable";
import { Save, FileText, Upload, Send, Edit3, AlertTriangle, RefreshCw, Loader2, Copy, Download, CheckCircle } from "lucide-react";

export default function UCMContent() {
  const { addToast } = useToast();

  const [originator, setOriginator] = useState("OPSADMINLHE");
  const [sendingStation, setSendingStation] = useState("LHE");
  const [inFlightNumber, setInFlightNumber] = useState("TG345");
  const [flightDateUtc, setFlightDateUtc] = useState("01JUN26 1612");
  const [aircraftReg, setAircraftReg] = useState("HS-TJV");
  const [outFlightNumber, setOutFlightNumber] = useState("TG346");
  const [status, setStatus] = useState("Sent");
  const [substation, setSubstation] = useState("LAHORE");

  const [inUlds, setInUlds] = useState<ULDRecord[]>(() => generateInUlds());
  const [outUlds, setOutUlds] = useState<ULDRecord[]>(() => generateOutUlds());
  const [inSelected, setInSelected] = useState<Set<string>>(new Set());
  const [outSelected, setOutSelected] = useState<Set<string>>(new Set());

  const [inChecked, setInChecked] = useState(true);
  const [outChecked, setOutChecked] = useState(true);
  const [siRemarks, setSiRemarks] = useState("");

  const [correctionOpen, setCorrectionOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const messageRef = useMemo(() => {
    const date = flightDateUtc.replace(/\s/g, "");
    return `UCM-${inFlightNumber}-${date.substring(0, 7)}`;
  }, [inFlightNumber, flightDateUtc]);

  const generateIATASyntax = useCallback((): string => {
    const lines: string[] = [];
    lines.push("UCM");
    const dateShort = flightDateUtc.replace(/\s/g, "");
    lines.push(`${inFlightNumber}/${outFlightNumber}/${dateShort.substring(0, 2)}.${aircraftReg}.${sendingStation}`);
    if (inChecked && inUlds.length > 0) {
      lines.push("IN");
      inUlds.forEach((u) => {
        if (u.type.trim() && u.nbr.trim() && u.owner.trim()) {
          lines.push(`${u.type}${u.nbr}${u.owner}`);
        }
      });
    }
    if (outChecked && outUlds.length > 0) {
      lines.push("OUT");
      outUlds.forEach((u) => {
        if (u.type.trim() && u.nbr.trim() && u.owner.trim()) {
          const parts = [`${u.type}${u.nbr}${u.owner}`];
          if (u.dest) parts.push(u.dest);
          if (u.content) parts.push(u.content);
          lines.push(parts.join("/"));
        }
      });
    }
    if (siRemarks.trim()) {
      lines.push(`SI ${siRemarks.trim()}`);
    }
    return lines.join("\n");
  }, [inUlds, outUlds, inFlightNumber, outFlightNumber, flightDateUtc, aircraftReg, sendingStation, siRemarks, inChecked, outChecked]);

  const handleToggleInSelection = (id: string) => {
    setInSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleToggleOutSelection = (id: string) => {
    setOutSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSelectAllIn = () => {
    if (inUlds.every((r) => inSelected.has(r.id))) {
      setInSelected(new Set());
    } else {
      setInSelected(new Set(inUlds.map((r) => r.id)));
    }
  };

  const handleSelectAllOut = () => {
    if (outUlds.every((r) => outSelected.has(r.id))) {
      setOutSelected(new Set());
    } else {
      setOutSelected(new Set(outUlds.map((r) => r.id)));
    }
  };

  const handleMoveToOut = () => {
    const toMove = inUlds.filter((r) => inSelected.has(r.id));
    if (toMove.length === 0) return;

    const crossDup = toMove.some((inUld) =>
      outUlds.some(
        (outUld) =>
          outUld.type.trim() === inUld.type.trim() &&
          outUld.nbr.trim() === inUld.nbr.trim() &&
          outUld.owner.trim() === inUld.owner.trim()
      )
    );
    if (crossDup) {
      addToast("One or more selected ULDs already exist in OUT. Duplicates not allowed.", "error");
      return;
    }

    const remaining = inUlds.filter((r) => !inSelected.has(r.id));
    const moved = toMove.map((r, i) => ({
      ...r,
      id: `out-${outUlds.length + i + 1}`,
      dest: r.dest || "",
      content: r.content || "",
    }));
    setInUlds(remaining.map((r, i) => ({ ...r, id: `in-${i + 1}` })));
    setOutUlds([...outUlds, ...moved]);
    setInSelected(new Set());
    addToast(`${toMove.length} ULD(s) moved to OUT.`, "success");
  };

  const handleMoveToIn = () => {
    const toMove = outUlds.filter((r) => outSelected.has(r.id));
    if (toMove.length === 0) return;

    const crossDup = toMove.some((outUld) =>
      inUlds.some(
        (inUld) =>
          inUld.type.trim() === outUld.type.trim() &&
          inUld.nbr.trim() === outUld.nbr.trim() &&
          inUld.owner.trim() === outUld.owner.trim()
      )
    );
    if (crossDup) {
      addToast("One or more selected ULDs already exist in IN. Duplicates not allowed.", "error");
      return;
    }

    const remaining = outUlds.filter((r) => !outSelected.has(r.id));
    const moved = toMove.map((r, i) => ({
      id: `in-${inUlds.length + i + 1}`,
      type: r.type,
      nbr: r.nbr,
      owner: r.owner,
      errors: {} as Record<string, string>,
    }));
    setOutUlds(remaining.map((r, i) => ({ ...r, id: `out-${i + 1}` })));
    setInUlds([...inUlds, ...moved]);
    setOutSelected(new Set());
    addToast(`${toMove.length} ULD(s) moved to IN.`, "success");
  };

  const handleSave = () => {
    const inErrors = inUlds.some((r) => Object.keys(r.errors).length > 0);
    const outErrors = outUlds.some((r) => Object.keys(r.errors).length > 0);
    const inEmpty = inUlds.some((r) => !r.type.trim() || !r.nbr.trim() || !r.owner.trim());
    const outEmpty = outUlds.some((r) => !r.type.trim() || !r.nbr.trim() || !r.owner.trim());

    if (inErrors || outErrors || inEmpty || outEmpty) {
      addToast("Please fix all validation errors before saving.", "error");
      return;
    }

    if (!sendingStation.trim() || !flightDateUtc.trim()) {
      addToast("Sending Station and Flight Date (UTC) are required.", "error");
      return;
    }

    if (inUlds.length === 0 && outUlds.length === 0) {
      addToast("At least one IN or OUT record is required.", "error");
      return;
    }

    setLoading(true);
    setError(false);
    setTimeout(() => {
      setLoading(false);
      addToast("UCM message saved.", "success");
    }, 1200);
  };

  const handleSaveAndSubmit = () => {
    if (!sendingStation.trim() || !flightDateUtc.trim()) {
      addToast("Sending Station and Flight Date (UTC) are required.", "error");
      return;
    }
    if (inUlds.length === 0 && outUlds.length === 0) {
      addToast("At least one IN or OUT record is required.", "error");
      return;
    }
    setLoading(true);
    setError(false);
    setTimeout(() => {
      setLoading(false);
      setStatus("Sent");
      addToast("UCM message submitted successfully.", "success");
    }, 1500);
  };

  const handleExportULDs = () => {
    addToast("ULDs exported successfully.", "success");
  };

  const handleCopySyntax = () => {
    const syntax = generateIATASyntax();
    navigator.clipboard.writeText(syntax).then(() => {
      addToast("IATA syntax copied to clipboard.", "success");
    }).catch(() => {
      addToast("Failed to copy syntax.", "error");
    });
  };

  const handleDownloadSyntax = () => {
    const syntax = generateIATASyntax();
    const blob = new Blob([syntax], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "UCM_IATA_Syntax.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addToast("IATA syntax downloaded.", "success");
  };

  const handleRetry = () => {
    setLoading(true);
    setError(false);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const syntax = generateIATASyntax();

  return (
    <>
      <div className="space-y-5">
        {loading && (
          <div className="space-y-5">
            <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
              <div className="h-5 w-32 bg-[#F1F5F9] rounded animate-pulse mb-4" />
              <div className="grid grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-14 bg-[#F1F5F9] rounded-lg animate-pulse" />
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-5">
              {[1, 2].map((n) => (
                <div key={n} className="rounded-[16px] border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
                  <div className="h-10 bg-[#F8FAFC] border-b border-[#E2E8F0] animate-pulse" />
                  <div className="p-3 space-y-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="h-7 bg-[#F1F5F9] rounded animate-pulse" style={{ width: `${85 - i * 5}%` }} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-[#FEE2E2] border border-[#FCA5A5]">
            <AlertTriangle size={16} className="text-[#DC2626] flex-shrink-0" />
            <span className="text-[13px] font-semibold text-[#DC2626] flex-1">Failed to load UCM message. Please try again.</span>
            <button
              onClick={handleRetry}
              className="flex items-center gap-2 h-8 px-3 rounded-lg text-[12px] font-semibold bg-[#DC2626] text-white hover:opacity-90 cursor-pointer transition-opacity whitespace-nowrap"
            >
              <RefreshCw size={14} />
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="flex items-center gap-2 justify-between flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex items-center gap-2 h-10 px-5 rounded-xl text-[13px] font-semibold bg-[#1B4F8B] text-white hover:opacity-90 cursor-pointer transition-opacity whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  Save UCM Message
                </button>
                <button
                  className="flex items-center gap-2 h-10 px-5 rounded-xl text-[13px] font-semibold border border-[#1B4F8B] text-[#1B4F8B] hover:bg-[#DBEAFE] cursor-pointer transition-colors whitespace-nowrap"
                >
                  <FileText size={16} />
                  IATA Syntax
                </button>
                <button
                  onClick={handleSaveAndSubmit}
                  className="flex items-center gap-2 h-10 px-5 rounded-xl text-[13px] font-semibold bg-[#16A34A] text-white hover:opacity-90 cursor-pointer transition-opacity whitespace-nowrap"
                >
                  <Send size={16} />
                  Save and Submit Message
                </button>
                <button
                  onClick={() => setCorrectionOpen(true)}
                  className="flex items-center gap-2 h-10 px-5 rounded-xl text-[13px] font-semibold border border-[#D97706] text-[#D97706] hover:bg-[#FEF3C7] cursor-pointer transition-colors whitespace-nowrap"
                >
                  <Edit3 size={16} />
                  Create Correction
                </button>
                <button
                  onClick={handleExportULDs}
                  className="flex items-center gap-2 h-10 px-5 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer transition-colors whitespace-nowrap"
                >
                  <Upload size={16} />
                  Export ULDs
                </button>
              </div>
              <span className="text-[12px] text-[#94A3B8]">Auto-save disabled</span>
            </div>

            <MessageHeaderCard
              originator={originator}
              sendingStation={sendingStation}
              inFlightNumber={inFlightNumber}
              flightDateUtc={flightDateUtc}
              aircraftReg={aircraftReg}
              outFlightNumber={outFlightNumber}
              status={status}
              substation={substation}
              onOriginatorChange={setOriginator}
              onSendingStationChange={setSendingStation}
              onInFlightNumberChange={setInFlightNumber}
              onFlightDateUtcChange={setFlightDateUtc}
              onAircraftRegChange={setAircraftReg}
              onOutFlightNumberChange={setOutFlightNumber}
              onStatusChange={setStatus}
              onSubstationChange={setSubstation}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <ULDTable
                title="IN"
                side="IN"
                rows={inUlds}
                selectedIds={inSelected}
                onRowsChange={setInUlds}
                onSelectionToggle={handleToggleInSelection}
                onSelectAll={handleSelectAllIn}
                onMoveSelected={handleMoveToOut}
              />
              <ULDTable
                title="OUT"
                side="OUT"
                rows={outUlds}
                selectedIds={outSelected}
                onRowsChange={setOutUlds}
                onSelectionToggle={handleToggleOutSelection}
                onSelectAll={handleSelectAllOut}
                onMoveSelected={handleMoveToIn}
              />
            </div>

            <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-[15px] font-bold text-[#0F172A]">UCM Options</h2>
              </div>
              <div className="flex items-center gap-8">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inChecked}
                    onChange={(e) => setInChecked(e.target.checked)}
                    className="w-4 h-4 rounded border-[#CBD5E1] text-[#1B4F8B] cursor-pointer"
                  />
                  <span className="text-[13px] font-semibold text-[#0F172A]">IN</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={outChecked}
                    onChange={(e) => setOutChecked(e.target.checked)}
                    className="w-4 h-4 rounded border-[#CBD5E1] text-[#1B4F8B] cursor-pointer"
                  />
                  <span className="text-[13px] font-semibold text-[#0F172A]">OUT</span>
                </label>
              </div>
            </div>

            <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <h2 className="text-[15px] font-bold text-[#0F172A]">SI Remarks</h2>
              </div>
              <textarea
                value={siRemarks}
                onChange={(e) => setSiRemarks(e.target.value)}
                placeholder="Enter SI remarks for this UCM message..."
                maxLength={500}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] resize-none focus:outline-none focus:border-[#1B4F8B] focus:ring-1 focus:ring-[#1B4F8B] transition-colors placeholder:text-[#94A3B8]"
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-[11px] text-[#94A3B8]">{siRemarks.length} / 500 characters</span>
              </div>
            </div>

            <div className="rounded-[16px] border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
                <div className="flex items-center gap-2">
                  <h2 className="text-[15px] font-bold text-[#0F172A]">IATA Syntax</h2>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleCopySyntax}
                    className="flex items-center gap-1.5 h-7 px-3 rounded-lg text-[11px] font-semibold bg-[#1B4F8B] text-white hover:opacity-90 cursor-pointer transition-opacity whitespace-nowrap"
                  >
                    <Copy size={12} />
                    Copy
                  </button>
                  <button
                    onClick={handleDownloadSyntax}
                    className="flex items-center gap-1.5 h-7 px-3 rounded-lg text-[11px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer transition-colors whitespace-nowrap"
                  >
                    <Download size={12} />
                    Download
                  </button>
                </div>
              </div>
              <div className="p-5">
                <pre className="text-[13px] font-mono text-[#0F172A] bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 whitespace-pre-wrap break-all leading-relaxed min-h-[120px]">
                  {syntax || "No syntax generated."}
                </pre>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-[#E2E8F0] flex-wrap">
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex items-center gap-2 h-10 px-5 rounded-xl text-[13px] font-semibold bg-[#1B4F8B] text-white hover:opacity-90 cursor-pointer transition-opacity whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                Save UCM Message
              </button>
              <button
                className="flex items-center gap-2 h-10 px-5 rounded-xl text-[13px] font-semibold border border-[#1B4F8B] text-[#1B4F8B] hover:bg-[#DBEAFE] cursor-pointer transition-colors whitespace-nowrap"
              >
                <FileText size={16} />
                IATA Syntax
              </button>
              <button
                onClick={handleSaveAndSubmit}
                className="flex items-center gap-2 h-10 px-5 rounded-xl text-[13px] font-semibold bg-[#16A34A] text-white hover:opacity-90 cursor-pointer transition-opacity whitespace-nowrap"
              >
                <Send size={16} />
                Save and Submit Message
              </button>
              <button
                onClick={() => setCorrectionOpen(true)}
                className="flex items-center gap-2 h-10 px-5 rounded-xl text-[13px] font-semibold border border-[#D97706] text-[#D97706] hover:bg-[#FEF3C7] cursor-pointer transition-colors whitespace-nowrap"
              >
                <Edit3 size={16} />
                Create Correction
              </button>
              <button
                onClick={handleExportULDs}
                className="flex items-center gap-2 h-10 px-5 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer transition-colors whitespace-nowrap"
              >
                <Upload size={16} />
                Export ULDs
              </button>
            </div>
          </>
        )}
      </div>

      <CorrectionDrawer
        open={correctionOpen}
        onClose={() => setCorrectionOpen(false)}
        messageRef={messageRef}
      />
    </>
  );
}