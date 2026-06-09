"use client";

import { useState } from "react";
import { X } from "lucide-react";

const FILTER_OPTIONS = [
  "Misrouted",
  "Shortage",
  "Overage",
  "Damage",
  "Leakage / Wet Cargo",
  "Tampering",
  "Pilferage",
  "Missing Documents",
  "Wrong Weight",
];

interface FilterChipsProps {
  activeFilters: string[];
  onToggle: (filter: string) => void;
}

export default function FilterChips({ activeFilters, onToggle }: FilterChipsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {FILTER_OPTIONS.map((filter) => {
        const isActive = activeFilters.includes(filter);
        return (
          <button
            key={filter}
            onClick={() => onToggle(filter)}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-[12px] font-medium cursor-pointer transition-all border whitespace-nowrap"
            style={{
              backgroundColor: isActive ? "#0B2545" : "white",
              color: isActive ? "white" : "#64748B",
              borderColor: isActive ? "#0B2545" : "#E2E8F0",
            }}
          >
            {isActive && (
              <span className="flex items-center justify-center w-3.5 h-3.5">
                <X size={12} strokeWidth={2.5} />
              </span>
            )}
            {filter}
          </button>
        );
      })}
    </div>
  );
}