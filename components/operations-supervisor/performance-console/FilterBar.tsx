"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, X, Filter } from "lucide-react";

const filters = [
  { key: "dateRange", label: "Date Range", options: ["Today", "Yesterday", "Last 7 Days", "This Week", "This Month", "Custom"] },
  { key: "shift", label: "Shift", options: ["All", "Morning", "Afternoon", "Evening", "Night"] },
  { key: "team", label: "Team", options: ["All", "Team A", "Team B", "Team C", "Team D"] },
  { key: "role", label: "Role", options: ["All", "Lifter Operator", "Warehouse Associate", "Gate Guard", "Compliance Officer", "Supervisor"] },
  { key: "supervisor", label: "Supervisor", options: ["All", "Imran Ali", "Nadeem Shah", "Kamran Hussain", "Faisal Qureshi"] },
  { key: "zone", label: "Zone", options: ["All", "AFU Zone A", "GCR Zone", "Cold Chain", "Gate Entry", "Customs Coordination", "Dispatch"] },
  { key: "taskType", label: "Task Type", options: ["All", "Putaway", "Picking", "Movement", "Inspection", "Customs", "Gate Entry"] },
];

export default function FilterBar() {
  const [expanded, setExpanded] = useState(false);
  const [active, setActive] = useState<Record<string, string>>({ dateRange: "Today", shift: "All" });

  const setFilter = (key: string, val: string) => {
    setActive((prev) => ({ ...prev, [key]: val }));
  };

  const clearAll = () => {
    setActive({});
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
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mt-4">
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