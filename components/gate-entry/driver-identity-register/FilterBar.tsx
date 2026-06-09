"use client";

import { useState } from "react";

const statusOptions = ["All", "Active", "Blocked", "Expired License", "Verification Required"];
const agentOptions = ["All", "DB Schenker", "Gerry's", "DHL", "Agility", "Kerry Logistics"];

export default function FilterBar() {
  const [activeStatus, setActiveStatus] = useState("All");
  const [activeAgent, setActiveAgent] = useState("All");
  const [search, setSearch] = useState("");

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((s) => (
            <button
              key={s}
              onClick={() => setActiveStatus(s)}
              className="h-9 px-4 rounded-full text-[13px] font-semibold whitespace-nowrap cursor-pointer transition-colors"
              style={{
                backgroundColor: activeStatus === s ? "#0B2545" : "#F1F5F9",
                color: activeStatus === s ? "white" : "#64748B",
              }}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="relative ml-auto">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" className="absolute left-3 top-1/2 -translate-y-1/2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search driver / CNIC / mobile"
            className="h-9 pl-9 pr-4 rounded-full border border-[#E2E8F0] text-[13px] font-medium text-[#0F172A] outline-none w-64"
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {agentOptions.map((a) => (
          <button
            key={a}
            onClick={() => setActiveAgent(a)}
            className="h-8 px-3 rounded-lg text-[12px] font-semibold whitespace-nowrap cursor-pointer transition-colors"
            style={{
              backgroundColor: activeAgent === a ? "#EBF0F7" : "#F8FAFC",
              color: activeAgent === a ? "#0B2545" : "#64748B",
              border: activeAgent === a ? "1px solid #2E75B6" : "1px solid #E2E8F0",
            }}
          >
            {a}
          </button>
        ))}
      </div>
    </div>
  );
}