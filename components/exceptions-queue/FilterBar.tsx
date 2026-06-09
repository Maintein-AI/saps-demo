"use client";

import { useState } from "react";
import { Search, Filter, Calendar, User, Tag, Clock } from "lucide-react";

const TYPE_OPTIONS = [
  "All Types",
  "Damage",
  "Shortage",
  "Overage",
  "Misrouted",
  "Leakage / Wet Cargo",
  "Tampering",
  "Pilferage",
  "Missing Documents",
  "Wrong Weight",
];

const STATUS_OPTIONS = [
  "All Status",
  "Open",
  "Under Review",
  "Assigned",
  "Escalated",
  "Resolved",
  "Closed",
];

const OWNER_OPTIONS = [
  "All Owners",
  "Imran Ali",
  "Sana Khan",
  "Ahmed Khan",
  "Fatima Raza",
  "Bilal Ahmed",
  "Unassigned",
];

const AGE_OPTIONS = [
  "All Ages",
  "< 1 hour",
  "1 - 3 hours",
  "3 - 6 hours",
  "6 - 12 hours",
  "> 12 hours",
];

const CARGO_CLASS_OPTIONS = [
  "All Classes",
  "AFU",
  "General",
  "Perishable",
  "Dangerous Goods",
  "Pharma",
  "Live Animals",
  "Valuable",
];

export default function FilterBar() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All Types");
  const [owner, setOwner] = useState("All Owners");
  const [status, setStatus] = useState("All Status");
  const [age, setAge] = useState("All Ages");
  const [cargoClass, setCargoClass] = useState("All Classes");
  const [showFilters, setShowFilters] = useState(false);

  const renderDropdown = (
    label: string,
    icon: React.ReactNode,
    value: string,
    options: string[],
    onChange: (val: string) => void
  ) => (
    <div className="relative min-w-[160px]">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none">
        {icon}
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-9 pl-9 pr-8 rounded-lg border border-[#E2E8F0] bg-white text-[12px] font-medium text-[#0F172A] cursor-pointer appearance-none outline-none focus:border-[#1B4F8B] transition-colors"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-white p-4">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-[320px]">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]">
            <Search size={14} />
          </div>
          <input
            type="text"
            placeholder="Search CDR #, AWB #, or RFID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-[#E2E8F0] bg-white text-[12px] text-[#0F172A] placeholder:text-[#94A3B8] outline-none focus:border-[#1B4F8B] transition-colors"
          />
        </div>

        <button
          onClick={() => setShowFilters((s) => !s)}
          className="h-9 px-3 rounded-lg border border-[#E2E8F0] text-[12px] font-medium text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer transition-colors flex items-center gap-2"
        >
          <Filter size={14} />
          Filters
        </button>
      </div>

      {showFilters && (
        <div className="flex items-center gap-3 flex-wrap mt-4 pt-4 border-t border-[#E2E8F0]">
          {renderDropdown("Type", <Tag size={14} />, type, TYPE_OPTIONS, setType)}
          {renderDropdown("Owner", <User size={14} />, owner, OWNER_OPTIONS, setOwner)}
          {renderDropdown("Status", <Filter size={14} />, status, STATUS_OPTIONS, setStatus)}
          {renderDropdown("Age", <Clock size={14} />, age, AGE_OPTIONS, setAge)}
          {renderDropdown("Cargo Class", <Calendar size={14} />, cargoClass, CARGO_CLASS_OPTIONS, setCargoClass)}
        </div>
      )}
    </div>
  );
}