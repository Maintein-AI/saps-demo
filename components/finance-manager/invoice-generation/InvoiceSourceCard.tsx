"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";

interface InvoiceSourceCardProps {
  mode: string;
  onModeChange: (mode: string) => void;
  selectedAWB: string;
  selectedDO: string;
  onAWBSelect: (awb: string) => void;
  onDOSelect: (doNum: string) => void;
}

const awbOptions = ["214-45678901", "157-90811223", "074-88219033"];
const doOptions = ["DO-2026-00891", "DO-2026-00892", "DO-2026-00893"];

export default function InvoiceSourceCard({
  mode,
  onModeChange,
  selectedAWB,
  selectedDO,
  onAWBSelect,
  onDOSelect,
}: InvoiceSourceCardProps) {
  const [awbQuery, setAwbQuery] = useState("");
  const [doQuery, setDoQuery] = useState("");
  const [showAwbDropdown, setShowAwbDropdown] = useState(false);
  const [showDoDropdown, setShowDoDropdown] = useState(false);

  const filteredAWBs = awbOptions.filter((a) => a.includes(awbQuery) || awbQuery === "");
  const filteredDOs = doOptions.filter((d) => d.includes(doQuery) || doQuery === "");

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2.5">
          <h2 className="text-[15px] font-bold text-[#0F172A]">Invoice Source</h2>
        </div>
      </div>
      <div className="p-5">
        {/* Mode selector */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#F1F5F9] w-fit mb-5">
          {["AWB", "DO", "Batch"].map((m) => (
            <button
              key={m}
              onClick={() => onModeChange(m)}
              className={`h-8 px-4 rounded-lg text-[13px] font-semibold cursor-pointer transition-colors whitespace-nowrap ${
                mode === m
                  ? "bg-[#0B2545] text-white shadow-sm"
                  : "text-[#64748B] hover:text-[#0F172A]"
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* AWB search */}
          <div className="relative">
            <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
              AWB # {mode === "AWB" && <span className="text-[#DC2626]">*</span>}
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center">
                <Search size={16} className="text-[#94A3B8]" />
              </div>
              <input
                type="text"
                placeholder="Search AWB..."
                value={selectedAWB || awbQuery}
                onChange={(e) => {
                  setAwbQuery(e.target.value);
                  setShowAwbDropdown(true);
                  onAWBSelect("");
                }}
                onFocus={() => setShowAwbDropdown(true)}
                className="w-full h-10 pl-10 pr-4 rounded-xl border border-[#E2E8F0] bg-white text-[13px] text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#1B4F8B] focus:ring-1 focus:ring-[#1B4F8B]/20 transition-all"
              />
              {selectedAWB && (
                <button
                  onClick={() => { setAwbQuery(""); onAWBSelect(""); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-[#94A3B8] hover:text-[#64748B] cursor-pointer"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            {showAwbDropdown && filteredAWBs.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white rounded-xl border border-[#E2E8F0] shadow-lg overflow-hidden">
                {filteredAWBs.map((awb) => (
                  <button
                    key={awb}
                    onClick={() => { onAWBSelect(awb); setAwbQuery(""); setShowAwbDropdown(false); }}
                    className="w-full text-left px-4 py-2.5 text-[13px] text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer transition-colors"
                  >
                    {awb}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* DO search */}
          <div className="relative">
            <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
              DO # {mode === "DO" && <span className="text-[#DC2626]">*</span>}
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center">
                <Search size={16} className="text-[#94A3B8]" />
              </div>
              <input
                type="text"
                placeholder="Search DO..."
                value={selectedDO || doQuery}
                onChange={(e) => {
                  setDoQuery(e.target.value);
                  setShowDoDropdown(true);
                  onDOSelect("");
                }}
                onFocus={() => setShowDoDropdown(true)}
                className="w-full h-10 pl-10 pr-4 rounded-xl border border-[#E2E8F0] bg-white text-[13px] text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#1B4F8B] focus:ring-1 focus:ring-[#1B4F8B]/20 transition-all"
              />
              {selectedDO && (
                <button
                  onClick={() => { setDoQuery(""); onDOSelect(""); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-[#94A3B8] hover:text-[#64748B] cursor-pointer"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            {showDoDropdown && filteredDOs.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white rounded-xl border border-[#E2E8F0] shadow-lg overflow-hidden">
                {filteredDOs.map((d) => (
                  <button
                    key={d}
                    onClick={() => { onDOSelect(d); setDoQuery(""); setShowDoDropdown(false); }}
                    className="w-full text-left px-4 py-2.5 text-[13px] text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer transition-colors"
                  >
                    {d}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Tariff Version */}
          <div>
            <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
              Tariff Version
            </label>
            <select className="w-full h-10 px-4 rounded-xl border border-[#E2E8F0] bg-white text-[13px] text-[#0F172A] focus:outline-none focus:border-[#1B4F8B] focus:ring-1 focus:ring-[#1B4F8B]/20 transition-all pr-8">
              <option>2026-Q2 (Current)</option>
              <option>2026-Q1</option>
              <option>2025-Q4</option>
            </select>
          </div>

          {/* Invoice Date */}
          <div>
            <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
              Invoice Date
            </label>
            <input
              type="date"
              defaultValue="2026-05-31"
              className="w-full h-10 px-4 rounded-xl border border-[#E2E8F0] bg-white text-[13px] text-[#0F172A] focus:outline-none focus:border-[#1B4F8B] focus:ring-1 focus:ring-[#1B4F8B]/20 transition-all"
            />
          </div>
        </div>
      </div>
    </div>
  );
}