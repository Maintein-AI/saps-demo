"use client";

import { useState, useCallback } from "react";
import { useToast } from "@/components/ToastContext";
import ScopeBadge from "@/components/ScopeBadge";
import MessageHeaderCard from "./MessageHeaderCard";
import SCMGrid from "./SCMGrid";
import IATASyntaxDrawer from "./IATASyntaxDrawer";
import { generateInitialRows, type SCMRow } from "./SCMGrid";
import { Save, FileText, Upload, AlertTriangle, RefreshCw, Loader2 } from "lucide-react";

export default function SCMContent() {
  const { addToast } = useToast();

  const [originator, setOriginator] = useState("OPSADMINLHE");
  const [station, setStation] = useState("LHE");
  const [localDate, setLocalDate] = useState("02JUN26");
  const [localTime, setLocalTime] = useState("0903");
  const [substation, setSubstation] = useState("LAHORE");
  const [status] = useState("DRAFT");

  const [rows, setRows] = useState<SCMRow[]>(() => generateInitialRows());
  const [supplementaryInfo, setSupplementaryInfo] = useState("");

  const [filterType, setFilterType] = useState("");
  const [filterOwner, setFilterOwner] = useState("");
  const [filterSubstation, setFilterSubstation] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [syntaxDrawerOpen, setSyntaxDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const generateIATASyntax = useCallback((): string => {
    const filledRows = rows.filter((r) => r.type.trim() && r.nbr.trim() && r.owner.trim());
    const lines = filledRows.map(
      (r) => `SCM/${originator}.${station}${localDate}${localTime}/${r.type}/${r.nbr}/${r.owner}/${r.substation}/${r.status}/${r.condition}`
    );
    if (supplementaryInfo.trim()) {
      lines.push(`SI ${supplementaryInfo.trim()}`);
    }
    return lines.join("\n");
  }, [rows, originator, station, localDate, localTime, substation, supplementaryInfo]);

  const handleSave = () => {
    const hasErrors = rows.some((r) => Object.keys(r.errors).length > 0);
    const hasEmptyRequired = rows.some((r) => !r.type.trim() || !r.nbr.trim() || !r.owner.trim() || !r.substation.trim());

    if (hasErrors || hasEmptyRequired) {
      addToast("Please fix all validation errors before saving.", "error");
      return;
    }

    setLoading(true);
    setError(false);
    setTimeout(() => {
      setLoading(false);
      addToast("SCM message saved.", "success");
    }, 1200);
  };

  const handleIATASyntax = () => {
    setSyntaxDrawerOpen(true);
  };

  const handleExportULDs = () => {
    addToast("ULDs exported successfully.", "success");
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
              <div className="h-5 w-32 bg-[#F1F5F9] rounded animate-pulse mb-4" />
              <div className="grid grid-cols-6 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-16 bg-[#F1F5F9] rounded-lg animate-pulse" />
                ))}
              </div>
            </div>
            <div className="rounded-[16px] border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
              <div className="h-12 bg-[#F8FAFC] border-b border-[#E2E8F0] animate-pulse" />
              <div className="p-4 space-y-2">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="h-8 bg-[#F1F5F9] rounded animate-pulse" style={{ width: `${90 - i * 3}%` }} />
                ))}
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-[#FEE2E2] border border-[#FCA5A5]">
            <AlertTriangle size={16} className="text-[#DC2626] flex-shrink-0" />
            <span className="text-[13px] font-semibold text-[#DC2626] flex-1">Failed to load SCM message. Please try again.</span>
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
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex items-center gap-2 h-10 px-5 rounded-xl text-[13px] font-semibold bg-[#1B4F8B] text-white hover:opacity-90 cursor-pointer transition-opacity whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  Save SCM Message
                </button>
                <button
                  onClick={handleIATASyntax}
                  className="flex items-center gap-2 h-10 px-5 rounded-xl text-[13px] font-semibold border border-[#1B4F8B] text-[#1B4F8B] hover:bg-[#DBEAFE] cursor-pointer transition-colors whitespace-nowrap"
                >
                  <FileText size={16} />
                  IATA Syntax
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
              station={station}
              localDate={localDate}
              localTime={localTime}
              substation={substation}
              status={status}
              onOriginatorChange={setOriginator}
              onStationChange={setStation}
              onLocalDateChange={setLocalDate}
              onLocalTimeChange={setLocalTime}
              onSubstationChange={setSubstation}
            />

            <SCMGrid
              rows={rows}
              onRowsChange={setRows}
              filterType={filterType}
              filterOwner={filterOwner}
              filterSubstation={filterSubstation}
              filterStatus={filterStatus}
              onFilterTypeChange={setFilterType}
              onFilterOwnerChange={setFilterOwner}
              onFilterSubstationChange={setFilterSubstation}
              onFilterStatusChange={setFilterStatus}
            />

            <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <h2 className="text-[15px] font-bold text-[#0F172A]">Supplementary Information</h2>
                <ScopeBadge type="exc" />
              </div>
              <textarea
                value={supplementaryInfo}
                onChange={(e) => setSupplementaryInfo(e.target.value)}
                placeholder="Enter supplementary information for this SCM message..."
                maxLength={500}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] resize-none focus:outline-none focus:border-[#1B4F8B] focus:ring-1 focus:ring-[#1B4F8B] transition-colors placeholder:text-[#94A3B8]"
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-[11px] text-[#94A3B8]">{supplementaryInfo.length} / 500 characters</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-[#E2E8F0]">
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex items-center gap-2 h-10 px-5 rounded-xl text-[13px] font-semibold bg-[#1B4F8B] text-white hover:opacity-90 cursor-pointer transition-opacity whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                Save SCM Message
              </button>
              <button
                onClick={handleIATASyntax}
                className="flex items-center gap-2 h-10 px-5 rounded-xl text-[13px] font-semibold border border-[#1B4F8B] text-[#1B4F8B] hover:bg-[#DBEAFE] cursor-pointer transition-colors whitespace-nowrap"
              >
                <FileText size={16} />
                IATA Syntax
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

      <IATASyntaxDrawer
        open={syntaxDrawerOpen}
        onClose={() => setSyntaxDrawerOpen(false)}
        syntax={generateIATASyntax()}
      />
    </>
  );
}