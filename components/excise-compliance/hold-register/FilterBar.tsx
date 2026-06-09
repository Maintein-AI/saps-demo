"use client";

import { useState } from "react";
import { Search, Plus, SlidersHorizontal, X } from "lucide-react";

interface FilterState {
  awb: string;
  holdType: string;
  status: string;
  createdBy: string;
  owner: string;
  age: string;
  cargoClass: string;
}

interface FilterBarProps {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  onAddHold: () => void;
}

const holdTypes = ["All", "Customs", "ANF", "ASF", "Internal", "Discrepancy"];
const statuses = ["All", "Active", "Under Review", "Escalated", "Resolved", "Released"];

export default function FilterBar({ filters, setFilters, onAddHold }: FilterBarProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [awb, setAwb] = useState(filters.awb);
  const [createdBy, setCreatedBy] = useState(filters.createdBy);
  const [owner, setOwner] = useState(filters.owner);
  const [age, setAge] = useState(filters.age);
  const [cargoClass, setCargoClass] = useState(filters.cargoClass);

  const updateFilter = (key: keyof FilterState, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  const hasActiveFilters =
    filters.holdType !== "All" ||
    filters.status !== "All" ||
    filters.awb ||
    filters.createdBy ||
    filters.owner ||
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
                filters.holdType !== "All",
                filters.status !== "All",
                filters.awb,
                filters.createdBy,
                filters.owner,
                filters.cargoClass,
              ].filter(Boolean).length}
            </span>
          )}
        </button>

        <button
          onClick={onAddHold}
          className="flex items-center gap-2 h-10 px-4 rounded-xl text-[13px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90 ml-auto"
          style={{ backgroundColor: "#0B2545" }}
        >
          <Plus size={16} />
          Add Hold
        </button>
      </div>

      {showFilters && (
        <div className="px-5 pb-4 border-t border-[#E2E8F0] pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
                Hold Type
              </label>
              <div className="flex flex-wrap gap-1.5">
                {holdTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => updateFilter("holdType", type)}
                    className="h-7 px-3 rounded-lg text-[12px] font-semibold cursor-pointer transition-colors whitespace-nowrap"
                    style={{
                      backgroundColor: filters.holdType === type ? "#EBF0F7" : "#F8FAFC",
                      color: filters.holdType === type ? "#0B2545" : "#64748B",
                      border: "1px solid",
                      borderColor: filters.holdType === type ? "#0B2545" : "#E2E8F0",
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
                Status
              </label>
              <div className="flex flex-wrap gap-1.5">
                {statuses.map((status) => (
                  <button
                    key={status}
                    onClick={() => updateFilter("status", status)}
                    className="h-7 px-3 rounded-lg text-[12px] font-semibold cursor-pointer transition-colors whitespace-nowrap"
                    style={{
                      backgroundColor: filters.status === status ? "#EBF0F7" : "#F8FAFC",
                      color: filters.status === status ? "#0B2545" : "#64748B",
                      border: "1px solid",
                      borderColor: filters.status === status ? "#0B2545" : "#E2E8F0",
                    }}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
                Created By
              </label>
              <input
                type="text"
                value={createdBy}
                onChange={(e) => {
                  setCreatedBy(e.target.value);
                  updateFilter("createdBy", e.target.value);
                }}
                placeholder="Filter by creator"
                className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] text-[12px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
                Owner
              </label>
              <input
                type="text"
                value={owner}
                onChange={(e) => {
                  setOwner(e.target.value);
                  updateFilter("owner", e.target.value);
                }}
                placeholder="Filter by owner"
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
                  setCreatedBy("");
                  setOwner("");
                  setAge("");
                  setCargoClass("");
                  setFilters({
                    awb: "",
                    holdType: "All",
                    status: "All",
                    createdBy: "",
                    owner: "",
                    age: "",
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