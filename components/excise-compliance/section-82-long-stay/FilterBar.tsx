"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";

interface FilterState {
  awb: string;
  consignee: string;
  daysInStorage: string;
  noticeStatus: string;
  currentStage: string;
  customsDecision: string;
  cargoClass: string;
}

interface FilterBarProps {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
}

const noticeStatuses = ["All", "Notice Sent", "Escalated", "Final Notice"];
const stages = ["All", "Notify", "Escalate", "Customs Decision", "Final Disposition"];
const customsDecisions = ["All", "Pending", "Release Approved", "Auction", "Disposal"];

export default function FilterBar({ filters, setFilters }: FilterBarProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [awb, setAwb] = useState(filters.awb);
  const [consignee, setConsignee] = useState(filters.consignee);
  const [daysInStorage, setDaysInStorage] = useState(filters.daysInStorage);
  const [cargoClass, setCargoClass] = useState(filters.cargoClass);

  const updateFilter = (key: keyof FilterState, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  const hasActiveFilters =
    filters.noticeStatus !== "All" ||
    filters.currentStage !== "All" ||
    filters.customsDecision !== "All" ||
    filters.awb ||
    filters.consignee ||
    filters.daysInStorage ||
    filters.cargoClass;

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4">
        <div className="flex items-center gap-2 flex-1 max-w-[400px] h-10 px-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] focus-within:border-[#1B4F8B] transition-colors">
          <Search size={16} className="text-[#94A3B8] flex-shrink-0" />
          <input
            type="text"
            value={awb}
            onChange={(e) => {
              setAwb(e.target.value);
              updateFilter("awb", e.target.value);
            }}
            placeholder="Search AWB #"
            className="flex-1 bg-transparent text-[13px] text-[#0F172A] outline-none"
          />
          {awb && (
            <button
              onClick={() => {
                setAwb("");
                updateFilter("awb", "");
              }}
              className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-[#E2E8F0] text-[#94A3B8] cursor-pointer"
            >
              <X size={12} />
            </button>
          )}
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 h-10 px-4 rounded-xl text-[13px] font-semibold border cursor-pointer transition-colors ${
            showFilters
              ? "border-[#1B4F8B] text-[#1B4F8B] bg-[#DBEAFE]"
              : "border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]"
          }`}
        >
          <SlidersHorizontal size={15} />
          Filters
          {hasActiveFilters && (
            <span className="w-5 h-5 rounded-full bg-[#1B4F8B] text-white text-[10px] font-bold flex items-center justify-center">
              {[
                filters.noticeStatus !== "All",
                filters.currentStage !== "All",
                filters.customsDecision !== "All",
                filters.awb,
                filters.consignee,
                filters.daysInStorage,
                filters.cargoClass,
              ].filter(Boolean).length}
            </span>
          )}
        </button>
      </div>

      {showFilters && (
        <div className="px-5 pb-4 border-t border-[#E2E8F0] pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
                Notice Status
              </label>
              <div className="flex flex-wrap gap-1.5">
                {noticeStatuses.map((s) => (
                  <button
                    key={s}
                    onClick={() => updateFilter("noticeStatus", s)}
                    className="h-7 px-3 rounded-lg text-[12px] font-semibold cursor-pointer transition-colors whitespace-nowrap"
                    style={{
                      backgroundColor: filters.noticeStatus === s ? "#EBF0F7" : "#F8FAFC",
                      color: filters.noticeStatus === s ? "#0B2545" : "#64748B",
                      border: "1px solid",
                      borderColor: filters.noticeStatus === s ? "#0B2545" : "#E2E8F0",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
                Current Stage
              </label>
              <div className="flex flex-wrap gap-1.5">
                {stages.map((s) => (
                  <button
                    key={s}
                    onClick={() => updateFilter("currentStage", s)}
                    className="h-7 px-3 rounded-lg text-[12px] font-semibold cursor-pointer transition-colors whitespace-nowrap"
                    style={{
                      backgroundColor: filters.currentStage === s ? "#EBF0F7" : "#F8FAFC",
                      color: filters.currentStage === s ? "#0B2545" : "#64748B",
                      border: "1px solid",
                      borderColor: filters.currentStage === s ? "#0B2545" : "#E2E8F0",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
                Customs Decision
              </label>
              <div className="flex flex-wrap gap-1.5">
                {customsDecisions.map((d) => (
                  <button
                    key={d}
                    onClick={() => updateFilter("customsDecision", d)}
                    className="h-7 px-3 rounded-lg text-[12px] font-semibold cursor-pointer transition-colors whitespace-nowrap"
                    style={{
                      backgroundColor: filters.customsDecision === d ? "#EBF0F7" : "#F8FAFC",
                      color: filters.customsDecision === d ? "#0B2545" : "#64748B",
                      border: "1px solid",
                      borderColor: filters.customsDecision === d ? "#0B2545" : "#E2E8F0",
                    }}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
                Consignee
              </label>
              <input
                type="text"
                value={consignee}
                onChange={(e) => {
                  setConsignee(e.target.value);
                  updateFilter("consignee", e.target.value);
                }}
                placeholder="Filter by consignee"
                className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] text-[12px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
                Days in Storage (min)
              </label>
              <input
                type="number"
                value={daysInStorage}
                onChange={(e) => {
                  setDaysInStorage(e.target.value);
                  updateFilter("daysInStorage", e.target.value);
                }}
                placeholder="Min days"
                className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] text-[12px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
                Cargo Class
              </label>
              <input
                type="text"
                value={cargoClass}
                onChange={(e) => {
                  setCargoClass(e.target.value);
                  updateFilter("cargoClass", e.target.value);
                }}
                placeholder="Filter by cargo class"
                className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] text-[12px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setAwb("");
                  setConsignee("");
                  setDaysInStorage("");
                  setCargoClass("");
                  setFilters({
                    awb: "",
                    consignee: "",
                    daysInStorage: "",
                    noticeStatus: "All",
                    currentStage: "All",
                    customsDecision: "All",
                    cargoClass: "",
                  });
                }}
                className="h-9 px-4 rounded-lg text-[12px] font-semibold border border-[#E2E8F0] text-[#64748B] cursor-pointer transition-colors hover:bg-[#F8FAFC]"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}