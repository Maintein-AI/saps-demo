"use client";

import { useState, useCallback } from "react";
import { useToast } from "@/components/ToastContext";
import SearchFilters from "./SearchFilters";
import SearchResultsTable from "./SearchResultsTable";
import IATASyntaxDrawer from "../IATASyntaxDrawer";
import CorrectionDrawer from "../ucm/CorrectionDrawer";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface SearchResult {
  id: string;
  type: "UCM" | "SCM" | "LUC";
  messageRef: string;
  originator: string;
  station: string;
  flight: string;
  dateTime: string;
  status: "Draft" | "Sent" | "Correction" | "Failed";
  uldCount: number;
  createdBy: string;
}

const sampleResults: SearchResult[] = [
  { id: "MSG-001", type: "UCM", messageRef: "UCM-TG345-01JUN26", originator: "OPSADMINLHE", station: "LHE", flight: "TG345/TG346", dateTime: "01 Jun 2026 16:12", status: "Sent", uldCount: 14, createdBy: "Asim Tariq" },
  { id: "MSG-002", type: "SCM", messageRef: "SCM-OPSADMINLHE.02JUN26", originator: "OPSADMINLHE", station: "LHE", flight: "N/A", dateTime: "02 Jun 2026 09:03", status: "Draft", uldCount: 26, createdBy: "Asim Tariq" },
  { id: "MSG-003", type: "SCM", messageRef: "SCM-OPSADMINKHI.15JUN26", originator: "OPSADMINKHI", station: "KHI", flight: "N/A", dateTime: "15 Jun 2026 10:15", status: "Sent", uldCount: 8, createdBy: "Bilal Ahmed" },
  { id: "MSG-004", type: "LUC", messageRef: "LUC-EK-624-15JUN26", originator: "OPSADMINLHE", station: "LHE", flight: "EK-624", dateTime: "15 Jun 2026 11:03", status: "Sent", uldCount: 22, createdBy: "Kamran Sheikh" },
  { id: "MSG-005", type: "UCM", messageRef: "UCM-QR604-14JUN26", originator: "OPSADMINKHI", station: "KHI", flight: "QR-604", dateTime: "14 Jun 2026 14:20", status: "Correction", uldCount: 18, createdBy: "Nadeem Hussain" },
  { id: "MSG-006", type: "SCM", messageRef: "SCM-OPSADMINLHE.14JUN26", originator: "OPSADMINLHE", station: "LHE", flight: "N/A", dateTime: "14 Jun 2026 16:45", status: "Draft", uldCount: 6, createdBy: "Asim Tariq" },
  { id: "MSG-007", type: "LUC", messageRef: "LUC-PA-213-13JUN26", originator: "OPSADMINLHE", station: "LHE", flight: "PA-213", dateTime: "13 Jun 2026 12:55", status: "Failed", uldCount: 16, createdBy: "Kamran Sheikh" },
  { id: "MSG-008", type: "UCM", messageRef: "UCM-EY241-14JUN26", originator: "OPSADMINKHI", station: "KHI", flight: "EY-241", dateTime: "14 Jun 2026 08:10", status: "Sent", uldCount: 31, createdBy: "Bilal Ahmed" },
  { id: "MSG-009", type: "SCM", messageRef: "SCM-OPSADMINKHI.13JUN26", originator: "OPSADMINKHI", station: "KHI", flight: "N/A", dateTime: "13 Jun 2026 15:30", status: "Sent", uldCount: 11, createdBy: "Nadeem Hussain" },
  { id: "MSG-010", type: "UCM", messageRef: "UCM-PK306-12JUN26", originator: "OPSADMINLHE", station: "LHE", flight: "PK-306", dateTime: "12 Jun 2026 07:45", status: "Sent", uldCount: 20, createdBy: "Asim Tariq" },
  { id: "MSG-011", type: "LUC", messageRef: "LUC-EK-626-12JUN26", originator: "OPSADMINKHI", station: "KHI", flight: "EK-626", dateTime: "12 Jun 2026 10:20", status: "Draft", uldCount: 9, createdBy: "Bilal Ahmed" },
  { id: "MSG-012", type: "UCM", messageRef: "UCM-SV730-11JUN26", originator: "OPSADMINLHE", station: "LHE", flight: "SV-730", dateTime: "11 Jun 2026 13:10", status: "Sent", uldCount: 24, createdBy: "Kamran Sheikh" },
  { id: "MSG-013", type: "SCM", messageRef: "SCM-OPSADMINKHI.11JUN26", originator: "OPSADMINKHI", station: "KHI", flight: "N/A", dateTime: "11 Jun 2026 16:00", status: "Correction", uldCount: 5, createdBy: "Asim Tariq" },
  { id: "MSG-014", type: "UCM", messageRef: "UCM-TK708-10JUN26", originator: "OPSADMINLHE", station: "LHE", flight: "TK-708", dateTime: "10 Jun 2026 09:15", status: "Sent", uldCount: 17, createdBy: "Bilal Ahmed" },
  { id: "MSG-015", type: "LUC", messageRef: "LUC-GF-752-09JUN26", originator: "OPSADMINKHI", station: "KHI", flight: "GF-752", dateTime: "09 Jun 2026 14:40", status: "Sent", uldCount: 13, createdBy: "Nadeem Hussain" },
];

function generateMockSyntax(r: SearchResult): string {
  return `${r.type}\n${r.messageRef}\nStation: ${r.station}\nOriginator: ${r.originator}\nFlight: ${r.flight}\nDate/Time: ${r.dateTime}\nStatus: ${r.status}\nULD Count: ${r.uldCount}\nCreated By: ${r.createdBy}`;
}

export default function SearchContent() {
  const { addToast } = useToast();

  const [results, setResults] = useState<SearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [syntaxDrawerOpen, setSyntaxDrawerOpen] = useState(false);
  const [syntaxContent, setSyntaxContent] = useState("");
  const [syntaxType, setSyntaxType] = useState("ULD");

  const [correctionOpen, setCorrectionOpen] = useState(false);
  const [correctionRef, setCorrectionRef] = useState("");

  const handleSearch = useCallback((filters: Record<string, string>) => {
    setLoading(true);
    setError(false);
    setHasSearched(true);

    setTimeout(() => {
      let filtered = [...sampleResults];

      if (filters.messageType) {
        filtered = filtered.filter((r) => r.type === filters.messageType);
      }
      if (filters.originator) {
        filtered = filtered.filter((r) => r.originator.toUpperCase().includes(filters.originator.toUpperCase()));
      }
      if (filters.station) {
        filtered = filtered.filter((r) => r.station.toUpperCase().includes(filters.station.toUpperCase()));
      }
      if (filters.flightNumber) {
        filtered = filtered.filter((r) => r.flight.toUpperCase().includes(filters.flightNumber.toUpperCase()));
      }
      if (filters.status) {
        filtered = filtered.filter((r) => r.status === filters.status);
      }
      if (filters.keyword) {
        const kw = filters.keyword.toUpperCase();
        filtered = filtered.filter(
          (r) =>
            r.messageRef.toUpperCase().includes(kw) ||
            r.originator.toUpperCase().includes(kw) ||
            r.station.toUpperCase().includes(kw) ||
            r.flight.toUpperCase().includes(kw) ||
            r.createdBy.toUpperCase().includes(kw)
        );
      }

      setLoading(false);
      setResults(filtered);
    }, 800);
  }, []);

  const handleRetry = () => {
    setLoading(true);
    setError(false);
    setTimeout(() => {
      setLoading(false);
      setResults(sampleResults);
    }, 1000);
  };

  const handleViewIataSyntax = (r: SearchResult) => {
    setSyntaxContent(generateMockSyntax(r));
    setSyntaxType(r.type);
    setSyntaxDrawerOpen(true);
  };

  const handleCreateCorrection = (r: SearchResult) => {
    if (r.status === "Draft") {
      addToast("Cannot create a correction for a Draft. Edit the draft directly.", "error");
      return;
    }
    setCorrectionRef(r.messageRef);
    setCorrectionOpen(true);
  };

  return (
    <>
      <div className="space-y-5">
        {error && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-[#FEE2E2] border border-[#FCA5A5]">
            <AlertTriangle size={16} className="text-[#DC2626] flex-shrink-0" />
            <span className="text-[13px] font-semibold text-[#DC2626] flex-1">Failed to search messages. Please try again.</span>
            <button
              onClick={handleRetry}
              className="flex items-center gap-2 h-8 px-3 rounded-lg text-[12px] font-semibold bg-[#DC2626] text-white hover:opacity-90 cursor-pointer transition-opacity whitespace-nowrap"
            >
              <RefreshCw size={14} />
              Retry
            </button>
          </div>
        )}

        <SearchFilters onSearch={handleSearch} loading={loading} />

        {hasSearched && (
          <SearchResultsTable
            results={results}
            loading={loading}
            error={error}
            onRetry={handleRetry}
            onViewIataSyntax={handleViewIataSyntax}
            onCreateCorrection={handleCreateCorrection}
          />
        )}

        {!hasSearched && (
          <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-12 shadow-sm flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#F1F5F9] flex items-center justify-center mb-4">
              <SearchIcon />
            </div>
            <h3 className="text-[15px] font-bold text-[#0F172A] mb-2">Search ULD Messages</h3>
            <p className="text-[13px] text-[#64748B] max-w-[420px]">
              Use the filters above to search across UCM, SCM, and LUC messages. You can filter by message type, station, flight, status, and more.
            </p>
          </div>
        )}
      </div>

      <IATASyntaxDrawer
        open={syntaxDrawerOpen}
        onClose={() => setSyntaxDrawerOpen(false)}
        syntax={syntaxContent}
        messageType={syntaxType}
      />

      <CorrectionDrawer
        open={correctionOpen}
        onClose={() => setCorrectionOpen(false)}
        messageRef={correctionRef}
      />
    </>
  );
}

function SearchIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}