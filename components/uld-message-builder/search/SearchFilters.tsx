"use client";

import { useState } from "react";
import ScopeBadge from "@/components/ScopeBadge";
import { Search, RotateCcw } from "lucide-react";

interface SearchFiltersProps {
  onSearch: (filters: Record<string, string>) => void;
  loading: boolean;
}

export default function SearchFilters({ onSearch, loading }: SearchFiltersProps) {
  const [messageType, setMessageType] = useState("");
  const [originator, setOriginator] = useState("");
  const [station, setStation] = useState("");
  const [substation, setSubstation] = useState("");
  const [flightNumber, setFlightNumber] = useState("");
  const [aircraftReg, setAircraftReg] = useState("");
  const [uldType, setUldType] = useState("");
  const [uldNbr, setUldNbr] = useState("");
  const [owner, setOwner] = useState("");
  const [status, setStatus] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [dateMode, setDateMode] = useState<"local" | "utc">("local");
  const [keyword, setKeyword] = useState("");

  const buildFilters = (): Record<string, string> => {
    const f: Record<string, string> = {};
    if (messageType) f.messageType = messageType;
    if (originator) f.originator = originator;
    if (station) f.station = station;
    if (substation) f.substation = substation;
    if (flightNumber) f.flightNumber = flightNumber;
    if (aircraftReg) f.aircraftReg = aircraftReg;
    if (uldType) f.uldType = uldType;
    if (uldNbr) f.uldNbr = uldNbr;
    if (owner) f.owner = owner;
    if (status) f.status = status;
    if (dateFrom) f.dateFrom = dateFrom;
    if (dateTo) f.dateTo = dateTo;
    f.dateMode = dateMode;
    if (keyword) f.keyword = keyword;
    return f;
  };

  const handleSearch = () => {
    onSearch(buildFilters());
  };

  const handleReset = () => {
    setMessageType("");
    setOriginator("");
    setStation("");
    setSubstation("");
    setFlightNumber("");
    setAircraftReg("");
    setUldType("");
    setUldNbr("");
    setOwner("");
    setStatus("");
    setDateFrom("");
    setDateTo("");
    setDateMode("local");
    setKeyword("");
    onSearch({});
  };

  const inputClass = "w-full h-9 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] bg-white focus:outline-none focus:border-[#1B4F8B] focus:ring-1 focus:ring-[#1B4F8B] transition-colors placeholder:text-[#94A3B8]";

  const selectClass = "w-full h-9 px-3 pr-8 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] bg-white cursor-pointer focus:outline-none focus:border-[#1B4F8B] focus:ring-1 focus:ring-[#1B4F8B] transition-colors";

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-[15px] font-bold text-[#0F172A]">Search Filters</h2>
          <ScopeBadge type="exc" />
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 h-7 px-3 rounded-lg text-[11px] font-medium text-[#64748B] border border-[#E2E8F0] hover:bg-[#F8FAFC] cursor-pointer transition-colors whitespace-nowrap"
        >
          <RotateCcw size={12} />
          Reset
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
        <div>
          <label className="block text-[11px] font-semibold text-[#64748B] mb-1">Message Type</label>
          <select value={messageType} onChange={(e) => setMessageType(e.target.value)} className={selectClass}>
            <option value="">All Types</option>
            <option value="UCM">UCM</option>
            <option value="SCM">SCM</option>
            <option value="LUC">LUC</option>
          </select>
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-[#64748B] mb-1">Originator</label>
          <input type="text" value={originator} onChange={(e) => setOriginator(e.target.value)} placeholder="e.g. OPSADMINLHE" className={inputClass} />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-[#64748B] mb-1">Station</label>
          <input type="text" value={station} onChange={(e) => setStation(e.target.value)} placeholder="e.g. LHE" className={inputClass} />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-[#64748B] mb-1">Substation</label>
          <input type="text" value={substation} onChange={(e) => setSubstation(e.target.value)} placeholder="e.g. LAHORE" className={inputClass} />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-[#64748B] mb-1">Flight Number</label>
          <input type="text" value={flightNumber} onChange={(e) => setFlightNumber(e.target.value)} placeholder="e.g. PK-304" className={inputClass} />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-[#64748B] mb-1">Aircraft Registration</label>
          <input type="text" value={aircraftReg} onChange={(e) => setAircraftReg(e.target.value)} placeholder="e.g. HS-TJV" className={inputClass} />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-[#64748B] mb-1">ULD Type</label>
          <select value={uldType} onChange={(e) => setUldType(e.target.value)} className={selectClass}>
            <option value="">All Types</option>
            <option value="AKE">AKE</option>
            <option value="AVE">AVE</option>
            <option value="PAG">PAG</option>
            <option value="PMC">PMC</option>
          </select>
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-[#64748B] mb-1">ULD Nbr</label>
          <input type="text" value={uldNbr} onChange={(e) => setUldNbr(e.target.value)} placeholder="e.g. 95704" className={inputClass} />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-[#64748B] mb-1">Owner</label>
          <input type="text" value={owner} onChange={(e) => setOwner(e.target.value)} placeholder="e.g. TG" className={inputClass} />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-[#64748B] mb-1">Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className={selectClass}>
            <option value="">All Statuses</option>
            <option value="Draft">Draft</option>
            <option value="Sent">Sent</option>
            <option value="Correction">Correction</option>
            <option value="Failed">Failed</option>
          </select>
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-[#64748B] mb-1">Date From</label>
          <input type="text" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} placeholder="e.g. 01JUN26" className={inputClass} />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-[#64748B] mb-1">Date To</label>
          <input type="text" value={dateTo} onChange={(e) => setDateTo(e.target.value)} placeholder="e.g. 15JUN26" className={inputClass} />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-[#64748B] mb-1">Date Mode</label>
          <div className="flex items-center h-9 bg-[#F1F5F9] rounded-lg p-0.5">
            <button
              onClick={() => setDateMode("local")}
              className={`flex-1 h-8 rounded-md text-[12px] font-semibold transition-all cursor-pointer whitespace-nowrap ${dateMode === "local" ? "bg-white text-[#0F172A] shadow-sm" : "text-[#64748B] hover:text-[#0F172A]"}`}
            >
              Local
            </button>
            <button
              onClick={() => setDateMode("utc")}
              className={`flex-1 h-8 rounded-md text-[12px] font-semibold transition-all cursor-pointer whitespace-nowrap ${dateMode === "utc" ? "bg-white text-[#0F172A] shadow-sm" : "text-[#64748B] hover:text-[#0F172A]"}`}
            >
              UTC
            </button>
          </div>
        </div>
        <div className="col-span-2">
          <label className="block text-[11px] font-semibold text-[#64748B] mb-1">Search Keyword</label>
          <input type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Search by message reference, ULD number, or any field..." className={inputClass} />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleSearch}
          disabled={loading}
          className="flex items-center gap-2 h-10 px-6 rounded-xl text-[13px] font-semibold bg-[#1B4F8B] text-white hover:opacity-90 cursor-pointer transition-opacity whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Search size={16} />
          Search Messages
        </button>
        <span className="text-[12px] text-[#94A3B8]">Use any combination of filters</span>
      </div>
    </div>
  );
}