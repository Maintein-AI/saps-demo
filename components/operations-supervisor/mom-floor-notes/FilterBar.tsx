"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, X, Filter, Search } from "lucide-react";

const filters = [
  { key: "dateRange", label: "Date Range", options: ["Today", "Yesterday", "Last 7 Days", "This Week", "Custom"] },
  { key: "relatedModule", label: "Related Module", options: ["All", "Warehouse", "Gate Entry", "Finance", "Excise", "Planner", "Lifter"] },
  { key: "relatedAWB", label: "Related AWB", options: ["All", "214-45678901", "157-90811223", "074-88219033", "117-55443321", "117-98765432"] },
  { key: "createdBy", label: "Created By", options: ["All", "Kamran Ali", "Sana Iqbal", "Nadeem Shah", "Imran Ali", "Faisal Qureshi"] },
  { key: "visibility", label: "Visibility", options: ["All", "Private", "Supervisor Team", "Operations", "Management"] },
];

export default function FilterBar() {
  const [expanded, setExpanded] = useState(false);
  const [search, setSearch] = useState("");
  const [active, setActive] = useState<Record<string, string>>({ dateRange: "Today" });

  const setFilter = (key: string, val: string) => {
    setActive((prev) => ({ ...prev, [key]: val }));
  };

  const clearAll = () => {
    setActive({ dateRange: "Today" });
    setSearch("");
  };

  const activeCount = Object.keys(active).filter((k) => active[k] !== "All" && active[k] !== undefined).length;

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#EBF0F7] flex items-center justify-center text-[#1B4F8B]">
            <Filter size={16} />
          </div>
          <span className="text-[13px] font-semibold text-[#0F172A]">Filters</span>
          {activeCount > 0 && (
            <span className="h-5 px-2 rounded-full bg-[#0B2545] text-white text-[11px] font-bold flex items-center">
              {activeCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notes..."
              className="h-9 pl-8 pr-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-[13px] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#1B4F8B]/20 focus:border-[#1B4F8B] transition-all w-[200px]"
            />
          </div>
          {activeCount > 0 && (
            <button onClick={clearAll} className="flex items-center gap-1 h-7 px-3 rounded-lg text-[12px] font-medium text-[#64748B] hover:bg-[#F1F5F9] cursor-pointer transition-colors">
              <X size={14} /> Clear all
            </button>
          )}
          <button onClick={() => setExpanded(!expanded)} className="flex items-center gap-1 h-7 px-3 rounded-lg text-[12px] font-medium text-[#1B4F8B] hover:bg-[#EBF0F7] cursor-pointer transition-colors">
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {expanded ? "Collapse" : "Expand"}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mt-4">
          {filters.map((f) => (
            <div key={f.key}>
              <label className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5 block">{f.label}</label>
              <div className="flex flex-col gap-1">
                {f.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setFilter(f.key, opt)}
                    className="text-left text-[12px] font-medium h-7 px-2 rounded-md cursor-pointer transition-colors"
                    style={{
                      backgroundColor: active[f.key] === opt ? "#EBF0F7" : "transparent",
                      color: active[f.key] === opt ? "#0B2545" : "#64748B",
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}