"use client";

import { useState, useCallback, useMemo } from "react";
import { useToast } from "@/components/ToastContext";
import ScopeBadge from "@/components/ScopeBadge";
import ImportMethodSelector from "./ImportMethodSelector";
import ImportPreviewTable from "./ImportPreviewTable";
import ValidationSummary from "./ValidationSummary";
import type { ULDImportRow } from "./ImportPreviewTable";
import {
  Download,
  CheckCircle,
  Trash2,
  X,
  Upload,
  AlertTriangle,
  RefreshCw,
  Loader2,
} from "lucide-react";

function generateSampleRows(): ULDImportRow[] {
  const samples: ULDImportRow[] = [
    { id: "r1", type: "AKE", nbr: "95704", owner: "TG", substation: "LAHORE", status: "Available", condition: "No Damage", destination: "", content: "", validationResult: "valid" },
    { id: "r2", type: "AKE", nbr: "92959", owner: "TG", substation: "LAHORE", status: "Available", condition: "No Damage", destination: "", content: "", validationResult: "valid" },
    { id: "r3", type: "PAG", nbr: "61610", owner: "TG", substation: "LAHORE", status: "In Repair", condition: "No Damage", destination: "", content: "", validationResult: "warning", errorMessage: "Status 'In Repair' may affect message" },
    { id: "r4", type: "PMC", nbr: "53603", owner: "TG", substation: "LAHORE", status: "Available", condition: "No Damage", destination: "", content: "", validationResult: "valid" },
    { id: "r5", type: "AVE", nbr: "0510", owner: "TG", substation: "LAHORE", status: "Available", condition: "No Damage", destination: "BKK", content: "C", validationResult: "valid" },
    { id: "r6", type: "AKE", nbr: "", owner: "TG", substation: "LAHORE", status: "Available", condition: "No Damage", destination: "", content: "", validationResult: "invalid", errorMessage: "Nbr is required" },
    { id: "r7", type: "AKE", nbr: "95704", owner: "TG", substation: "LAHORE", status: "Available", condition: "No Damage", destination: "", content: "", validationResult: "invalid", errorMessage: "Duplicate Type+Nbr+Owner" },
    { id: "r8", type: "", nbr: "90375", owner: "TG", substation: "LAHORE", status: "Available", condition: "No Damage", destination: "", content: "", validationResult: "invalid", errorMessage: "Type is required" },
  ];
  return samples;
}

export default function ImportContent() {
  const { addToast } = useToast();

  const [method, setMethod] = useState("paste");
  const [rows, setRows] = useState<ULDImportRow[]>(() => generateSampleRows());
  const [pasteText, setPasteText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [imported, setImported] = useState(false);

  const stats = useMemo(() => {
    const total = rows.length;
    const valid = rows.filter((r) => r.validationResult === "valid").length;
    const invalid = rows.filter((r) => r.validationResult === "invalid").length;
    const duplicates = rows.filter((r) => r.errorMessage?.includes("Duplicate")).length;
    const missing = rows.filter((r) => r.errorMessage?.includes("required")).length;
    return { total, valid, invalid, duplicates, missingFields: missing };
  }, [rows]);

  const handleRemoveRow = useCallback((id: string) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const handleRemoveInvalid = () => {
    setRows((prev) => prev.filter((r) => r.validationResult !== "invalid"));
    addToast("Invalid rows removed.", "success");
  };

  const handleDownloadTemplate = () => {
    const header = "Type,Nbr,Owner,Substation,Status,Condition,Destination,Content";
    const example = "AKE,95704,TG,LAHORE,Available,No Damage,,C";
    const csv = [header, example].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ULD_Import_Template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addToast("Template downloaded.", "success");
  };

  const handleValidate = () => {
    setLoading(true);
    setError(false);
    setTimeout(() => {
      setLoading(false);
      const validated = rows.map((r) => {
        const hasErrors = !r.type.trim() || !r.nbr.trim() || !r.owner.trim() || !r.substation.trim();
        if (hasErrors && r.validationResult !== "invalid") {
          return { ...r, validationResult: "invalid" as const, errorMessage: "Required fields missing" };
        }
        return r;
      });
      setRows(validated);
      addToast(`Validation complete: ${stats.valid} valid, ${stats.invalid} invalid.`, stats.invalid > 0 ? "error" : "success");
    }, 1000);
  };

  const handleImportValid = () => {
    if (stats.valid === 0) {
      addToast("No valid rows to import.", "error");
      return;
    }
    setLoading(true);
    setError(false);
    setTimeout(() => {
      setLoading(false);
      setImported(true);
      addToast(`${stats.valid} ULD rows imported successfully.`, "success");
    }, 1500);
  };

  const handleCancel = () => {
    setRows([]);
    setPasteText("");
    setImported(false);
    addToast("Import cancelled.", "success");
  };

  const handlePasteImport = () => {
    if (!pasteText.trim()) {
      addToast("Paste ULD rows to import.", "error");
      return;
    }
    const lines = pasteText.trim().split("\n");
    const newRows: ULDImportRow[] = lines.map((line, i) => {
      const cols = line.split(/[,\t|]/).map((c) => c.trim());
      const row: ULDImportRow = {
        id: `paste-${Date.now()}-${i}`,
        type: cols[0] || "",
        nbr: cols[1] || "",
        owner: cols[2] || "",
        substation: cols[3] || "",
        status: cols[4] || "Available",
        condition: cols[5] || "No Damage",
        destination: cols[6] || "",
        content: cols[7] || "",
        validationResult: "valid",
      };
      if (!row.type || !row.nbr || !row.owner || !row.substation) {
        row.validationResult = "invalid";
        row.errorMessage = "Required fields missing";
      }
      return row;
    });
    setRows((prev) => [...prev, ...newRows]);
    setPasteText("");
    addToast(`${newRows.length} rows added.`, "success");
  };

  const handleRetry = () => {
    setLoading(true);
    setError(false);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <>
      <div className="space-y-5">
        {loading && (
          <div className="space-y-5">
            <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
              <div className="flex gap-1 bg-[#F1F5F9] rounded-xl p-1">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="h-9 flex-1 bg-[#F1F5F9] rounded-lg animate-pulse" />
                ))}
              </div>
            </div>
            <div className="rounded-[16px] border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
              <div className="h-12 bg-[#F8FAFC] animate-pulse" />
              <div className="p-4 space-y-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-8 bg-[#F1F5F9] rounded animate-pulse" style={{ width: `${90 - i * 4}%` }} />
                ))}
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-[#FEE2E2] border border-[#FCA5A5]">
            <AlertTriangle size={16} className="text-[#DC2626] flex-shrink-0" />
            <span className="text-[13px] font-semibold text-[#DC2626] flex-1">Failed to process import. Please try again.</span>
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
            <ImportMethodSelector method={method} onMethodChange={setMethod} />

            {method === "paste" && (
              <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <h2 className="text-[15px] font-bold text-[#0F172A]">Paste ULD Rows</h2>
                  <ScopeBadge type="exc" />
                </div>
                <p className="text-[12px] text-[#64748B] mb-3">Paste comma-separated, tab-separated, or pipe-separated ULD data. Format: Type, Nbr, Owner, Substation, Status, Condition, Destination, Content</p>
                <textarea
                  value={pasteText}
                  onChange={(e) => setPasteText(e.target.value)}
                  placeholder={`AKE,95704,TG,LAHORE,Available,No Damage,BKK,C\nPAG,61610,TG,LAHORE,Available,No Damage,,`}
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] text-[13px] font-mono text-[#0F172A] resize-none focus:outline-none focus:border-[#1B4F8B] focus:ring-1 focus:ring-[#1B4F8B] transition-colors placeholder:text-[#94A3B8]"
                />
                <button
                  onClick={handlePasteImport}
                  className="mt-3 flex items-center gap-2 h-9 px-4 rounded-lg text-[12px] font-semibold bg-[#1B4F8B] text-white hover:opacity-90 cursor-pointer transition-opacity whitespace-nowrap"
                >
                  <Upload size={14} />
                  Parse &amp; Add Rows
                </button>
              </div>
            )}

            {method === "csv" && (
              <div className="rounded-[16px] border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-10 shadow-sm text-center">
                <div className="w-14 h-14 rounded-2xl bg-[#E2E8F0] flex items-center justify-center mx-auto mb-4">
                  <Upload size={24} className="text-[#64748B]" />
                </div>
                <h3 className="text-[15px] font-bold text-[#0F172A] mb-1">Upload CSV File</h3>
                <p className="text-[13px] text-[#64748B] mb-4">Drag and drop your CSV file here, or click to browse.</p>
                <button className="flex items-center gap-2 h-9 px-5 rounded-lg text-[13px] font-semibold bg-[#1B4F8B] text-white hover:opacity-90 cursor-pointer transition-opacity whitespace-nowrap mx-auto">
                  <Upload size={14} />
                  Choose File
                </button>
                <p className="text-[11px] text-[#94A3B8] mt-3">Accepted format: .csv, Max 10MB</p>
              </div>
            )}

            {method === "xlsx" && (
              <div className="rounded-[16px] border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-10 shadow-sm text-center">
                <div className="w-14 h-14 rounded-2xl bg-[#E2E8F0] flex items-center justify-center mx-auto mb-4">
                  <Upload size={24} className="text-[#64748B]" />
                </div>
                <h3 className="text-[15px] font-bold text-[#0F172A] mb-1">Upload XLSX File</h3>
                <p className="text-[13px] text-[#64748B] mb-4">Drag and drop your XLSX file here, or click to browse.</p>
                <button className="flex items-center gap-2 h-9 px-5 rounded-lg text-[13px] font-semibold bg-[#1B4F8B] text-white hover:opacity-90 cursor-pointer transition-opacity whitespace-nowrap mx-auto">
                  <Upload size={14} />
                  Choose File
                </button>
                <p className="text-[11px] text-[#94A3B8] mt-3">Accepted format: .xlsx, Max 10MB</p>
              </div>
            )}

            {method === "existing" && (
              <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <h2 className="text-[15px] font-bold text-[#0F172A]">Import from Existing Message</h2>
                  <ScopeBadge type="exc" />
                </div>
                <p className="text-[12px] text-[#64748B] mb-3">Select an existing UCM, SCM, or LUC message to import ULDs from.</p>
                <div className="flex items-center gap-3">
                  <select className="h-9 px-3 pr-8 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] bg-white cursor-pointer focus:outline-none focus:border-[#1B4F8B] focus:ring-1 focus:ring-[#1B4F8B] transition-colors flex-1 max-w-[400px]">
                    <option value="">Select a message...</option>
                    <option value="msg-001">UCM-TG345-01JUN26 (14 ULDs)</option>
                    <option value="msg-002">SCM-OPSADMINLHE.02JUN26 (26 ULDs)</option>
                    <option value="msg-003">UCM-EY241-14JUN26 (31 ULDs)</option>
                    <option value="msg-004">LUC-EK-624-15JUN26 (22 ULDs)</option>
                  </select>
                  <button className="flex items-center gap-2 h-9 px-4 rounded-lg text-[12px] font-semibold bg-[#1B4F8B] text-white hover:opacity-90 cursor-pointer transition-opacity whitespace-nowrap">
                    <Upload size={14} />
                    Load ULDs
                  </button>
                </div>
              </div>
            )}

            {rows.length > 0 && (
              <>
                <ValidationSummary
                  total={stats.total}
                  valid={stats.valid}
                  invalid={stats.invalid}
                  duplicates={stats.duplicates}
                  missingFields={stats.missingFields}
                />

                <ImportPreviewTable rows={rows} onRemoveRow={handleRemoveRow} />
              </>
            )}

            {imported && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-[#DCFCE7] border border-[#86EFAC]">
                <CheckCircle size={16} className="text-[#16A34A] flex-shrink-0" />
                <span className="text-[13px] font-semibold text-[#16A34A] flex-1">{stats.valid} ULDs imported successfully.</span>
                <button
                  onClick={() => setImported(false)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#86EFAC]/30 text-[#16A34A] cursor-pointer transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            <div className="flex items-center gap-2 pt-2 border-t border-[#E2E8F0] flex-wrap">
              <button
                onClick={handleDownloadTemplate}
                className="flex items-center gap-2 h-10 px-5 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer transition-colors whitespace-nowrap"
              >
                <Download size={16} />
                Download Template
              </button>
              <button
                onClick={handleValidate}
                disabled={loading}
                className="flex items-center gap-2 h-10 px-5 rounded-xl text-[13px] font-semibold bg-[#1B4F8B] text-white hover:opacity-90 cursor-pointer transition-opacity whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                Validate Import
              </button>
              <button
                onClick={handleImportValid}
                disabled={loading}
                className="flex items-center gap-2 h-10 px-5 rounded-xl text-[13px] font-semibold bg-[#16A34A] text-white hover:opacity-90 cursor-pointer transition-opacity whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                Import Valid Rows
              </button>
              <button
                onClick={handleRemoveInvalid}
                className="flex items-center gap-2 h-10 px-5 rounded-xl text-[13px] font-semibold border border-[#DC2626] text-[#DC2626] hover:bg-[#FEF2F2] cursor-pointer transition-colors whitespace-nowrap"
              >
                <Trash2 size={16} />
                Remove Invalid Rows
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 h-10 px-5 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer transition-colors whitespace-nowrap"
              >
                <X size={16} />
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}