"use client";

import { useState } from "react";
import { Calendar, Clock, Package, Hash, Tag, Search, Filter } from "lucide-react";

export default function FilterBar() {
  const [date, setDate] = useState("2026-05-31");
  const [shift, setShift] = useState("Day Shift");
  const [taskType, setTaskType] = useState("All");
  const [status, setStatus] = useState("All");
  const [awb, setAwb] = useState("");
  const [pieceId, setPieceId] = useState("");
  const [lifter, setLifter] = useState("FL-03");

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2.5">
          <h2 className="text-[16px] font-bold text-[#0F172A]">Filter Movements</h2>
        </div>
        <div className="flex items-center gap-1.5 text-[12px] text-[#94A3B8] font-medium">
          <Filter size={14} />
          <span>7 fields</span>
        </div>
      </div>
      <div className="p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Calendar size={14} className="text-[#94A3B8]" />
              <label className="text-[12px] font-semibold text-[#64748B]">Date</label>
            </div>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full h-10 px-3 rounded-lg text-[13px] font-medium text-[#0F172A] border border-[#E2E8F0] bg-[#F8FAFC] outline-none focus:border-[#2E75B6] transition-colors"
            />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Clock size={14} className="text-[#94A3B8]" />
              <label className="text-[12px] font-semibold text-[#64748B]">Shift</label>
            </div>
            <div className="flex gap-2">
              {["Day Shift", "Night Shift", "All"].map((s) => (
                <button
                  key={s}
                  onClick={() => setShift(s)}
                  className="h-10 px-3 rounded-lg text-[13px] font-semibold whitespace-nowrap cursor-pointer transition-colors border"
                  style={{
                    backgroundColor: shift === s ? "#0B2545" : "#F8FAFC",
                    color: shift === s ? "#FFFFFF" : "#64748B",
                    borderColor: shift === s ? "#0B2545" : "#E2E8F0",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Package size={14} className="text-[#94A3B8]" />
              <label className="text-[12px] font-semibold text-[#64748B]">Task Type</label>
            </div>
            <div className="flex gap-2 flex-wrap">
              {["All", "Putaway", "Pick", "Move", "Charge"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTaskType(t)}
                  className="h-10 px-3 rounded-lg text-[13px] font-semibold whitespace-nowrap cursor-pointer transition-colors border"
                  style={{
                    backgroundColor: taskType === t ? "#0B2545" : "#F8FAFC",
                    color: taskType === t ? "#FFFFFF" : "#64748B",
                    borderColor: taskType === t ? "#0B2545" : "#E2E8F0",
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Tag size={14} className="text-[#94A3B8]" />
              <label className="text-[12px] font-semibold text-[#64748B]">Status</label>
            </div>
            <div className="flex gap-2">
              {["All", "Completed", "Exception", "In Progress"].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className="h-10 px-3 rounded-lg text-[13px] font-semibold whitespace-nowrap cursor-pointer transition-colors border"
                  style={{
                    backgroundColor: status === s ? "#0B2545" : "#F8FAFC",
                    color: status === s ? "#FFFFFF" : "#64748B",
                    borderColor: status === s ? "#0B2545" : "#E2E8F0",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Hash size={14} className="text-[#94A3B8]" />
              <label className="text-[12px] font-semibold text-[#64748B]">AWB #</label>
            </div>
            <input
              type="text"
              value={awb}
              onChange={(e) => setAwb(e.target.value)}
              placeholder="Enter AWB number..."
              className="w-full h-10 px-3 rounded-lg text-[13px] font-medium text-[#0F172A] placeholder:text-[#94A3B8] border border-[#E2E8F0] bg-[#F8FAFC] outline-none focus:border-[#2E75B6] transition-colors"
            />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Hash size={14} className="text-[#94A3B8]" />
              <label className="text-[12px] font-semibold text-[#64748B]">Piece ID</label>
            </div>
            <input
              type="text"
              value={pieceId}
              onChange={(e) => setPieceId(e.target.value)}
              placeholder="Enter piece ID..."
              className="w-full h-10 px-3 rounded-lg text-[13px] font-medium text-[#0F172A] placeholder:text-[#94A3B8] border border-[#E2E8F0] bg-[#F8FAFC] outline-none focus:border-[#2E75B6] transition-colors"
            />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Search size={14} className="text-[#94A3B8]" />
              <label className="text-[12px] font-semibold text-[#64748B]">Lifter Asset</label>
            </div>
            <div className="flex gap-2">
              {["FL-03", "FL-02", "FL-04", "All"].map((l) => (
                <button
                  key={l}
                  onClick={() => setLifter(l)}
                  className="h-10 px-3 rounded-lg text-[13px] font-semibold whitespace-nowrap cursor-pointer transition-colors border"
                  style={{
                    backgroundColor: lifter === l ? "#0B2545" : "#F8FAFC",
                    color: lifter === l ? "#FFFFFF" : "#64748B",
                    borderColor: lifter === l ? "#0B2545" : "#E2E8F0",
                  }}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}