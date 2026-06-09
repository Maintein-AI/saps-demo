"use client";

import { useState, useMemo } from "react";
import { Rack, generateRacks } from "@/lib/rackData";

const statusColors = {
  available: "#16A34A",
  partial: "#D97706",
  full: "#DC2626",
  blocked: "#64748B",
};

function RackDetailPanel({ rack, onClose }: { rack: Rack; onClose: () => void }) {
  return (
    <div className="mt-4 p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-[14px] font-bold text-[#0F172A]">{rack.id}</h4>
        <button
          onClick={onClose}
          className="text-[12px] text-[#64748B] hover:text-[#0F172A] cursor-pointer transition-colors"
        >
          Close
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2 text-[12px] text-[#64748B]">
        <p>
          Row: <span className="font-semibold text-[#0F172A]">{rack.row}</span>
        </p>
        <p>
          Rack: <span className="font-semibold text-[#0F172A]">{rack.rack}</span>
        </p>
        <p>
          Occupancy: <span className="font-semibold text-[#0F172A]">{rack.levels[0].occupancy}%</span>
        </p>
        <p>
          Class: <span className="font-semibold text-[#0F172A]">{rack.handlingClass}</span>
        </p>
      </div>
      <p className="text-[12px] text-[#64748B] mt-2">
        AWBs:{" "}
        <span className="font-semibold text-[#0F172A]">
          {rack.awbs.length > 0 ? rack.awbs.join(", ") : "None"}
        </span>
      </p>
    </div>
  );
}

export default function RackHeatmap() {
  const [selectedRack, setSelectedRack] = useState<Rack | null>(null);
  const racks = useMemo(() => generateRacks(), []);

  return (
    <div>
      <div className="grid grid-cols-12 gap-x-2 gap-y-3">
        {racks.map((rack) => (
          <div
            key={rack.id}
            className="relative flex flex-col items-center gap-0.5 cursor-pointer"
            onClick={() => setSelectedRack(rack)}
          >
            <div className="text-[9px] text-[#94A3B8] font-medium">{rack.id}</div>
            <div className="flex flex-col gap-px">
              {rack.levels.map((level) => (
                <div
                  key={level.level}
                  className="w-3 h-1.5 rounded-sm"
                  style={{
                    backgroundColor: statusColors[level.status],
                  }}
                  title={`Level ${level.level}: ${level.status} (${level.occupancy}%)`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4 mt-4 text-[11px] text-[#64748B]">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-[#16A34A]" /> Available
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-[#D97706]" /> Partial
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-[#DC2626]" /> Full
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-[#64748B]" /> Blocked
        </div>
      </div>
      {selectedRack && (
        <RackDetailPanel rack={selectedRack} onClose={() => setSelectedRack(null)} />
      )}
    </div>
  );
}