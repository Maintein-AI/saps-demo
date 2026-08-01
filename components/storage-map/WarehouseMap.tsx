"use client";

import { useState } from "react";
import { CheckCircle2, AlertTriangle, XCircle, Circle, Square, X } from "lucide-react";
import type { RackData, RackStatus } from "@/app/warehouse-manager/storage-map/page";

interface WarehouseMapProps {
  racks: RackData[];
  onRackClick: (rack: RackData) => void;
  available: number;
  partial: number;
  full: number;
  blocked: number;
}

const statusConfig: Record<RackStatus, { color: string; border: string; label: string }> = {
  available: { color: "#F0FDF4", border: "#16A34A", label: "Available" },
  partial: { color: "#FEF3C7", border: "#D97706", label: "Partial" },
  full: { color: "#FEF2F2", border: "#DC2626", label: "Full" },
  blocked: { color: "#F1F5F9", border: "#94A3B8", label: "Blocked" },
};

export default function WarehouseMap({ racks, onRackClick, available, partial, full, blocked }: WarehouseMapProps) {
  const [hoveredRack, setHoveredRack] = useState<string | null>(null);

  // Group racks by row
  const racksByRow: Record<string, RackData[]> = {};
  racks.forEach((rack) => {
    if (!racksByRow[rack.row]) racksByRow[rack.row] = [];
    racksByRow[rack.row].push(rack);
  });

  const rows = Object.keys(racksByRow).sort();

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-[18px] font-semibold text-[#0F172A] leading-[28px]">AFU Warehouse Map</h2>
        </div>
        <div className="flex items-center gap-4 text-[12px] font-medium">
          <span className="text-[#64748B]">144 racks</span>
          <span className="text-[#16A34A]">{available} available</span>
          <span className="text-[#D97706]">{partial} partial</span>
          <span className="text-[#DC2626]">{full} full</span>
          <span className="text-[#94A3B8]">{blocked} blocked</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-4 flex-wrap">
        {Object.entries(statusConfig).map(([key, config]) => {
          const Icon = key === "available" ? CheckCircle2 : key === "partial" ? AlertTriangle : key === "full" ? XCircle : X;
          return (
            <div key={key} className="flex items-center gap-1.5">
              <div
                className="w-4 h-4 rounded border flex items-center justify-center"
                style={{ backgroundColor: config.color, borderColor: config.border }}
              >
                <Icon size={10} style={{ color: config.border }} />
              </div>
              <span className="text-[12px] font-medium text-[#64748B]">{config.label}</span>
            </div>
          );
        })}
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-[#1B4F8B]" />
          <span className="text-[12px] font-medium text-[#64748B]">ULD Pit</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-[#6366F1]" />
          <span className="text-[12px] font-medium text-[#64748B]">Cold Room</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-[#0B2545]" />
          <span className="text-[12px] font-medium text-[#64748B]">Conveyor</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-[#E2E8F0] border border-[#CBD5E1]" />
          <span className="text-[12px] font-medium text-[#64748B]">Walkway</span>
        </div>
      </div>

      {/* Floor Plan */}
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* ULD Pits + Top Header */}
          <div className="flex items-stretch gap-0 mb-1">
            <div className="w-[60px]" />
            <div className="flex-1 flex items-center gap-1">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex-1 flex items-center justify-center h-7 rounded bg-[#1B4F8B]/10 text-[10px] font-semibold text-[#1B4F8B]">
                  BAY {i + 1}
                </div>
              ))}
            </div>
          </div>

          {/* ULD Pits Row */}
          <div className="flex items-stretch gap-0 mb-1">
            <div className="w-[60px] flex items-center justify-center text-[10px] font-semibold text-[#64748B] rotate-180" style={{ writingMode: "vertical-rl" }}>
              ULD PITS
            </div>
            <div className="flex-1 flex items-center gap-1">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex-1 flex items-center justify-center h-8 rounded bg-[#1B4F8B]/15 text-[10px] font-semibold text-[#1B4F8B]">
                  ULD-{i + 1}
                </div>
              ))}
            </div>
          </div>

          {/* Conveyor */}
          <div className="flex items-stretch gap-0 mb-1">
            <div className="w-[60px] flex items-center justify-center text-[10px] font-semibold text-[#64748B] rotate-180" style={{ writingMode: "vertical-rl" }}>
              CONVEYOR
            </div>
            <div className="flex-1 flex items-center gap-1">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex-1 flex items-center justify-center h-5 rounded bg-[#0B2545]/10 text-[10px] font-semibold text-[#0B2545]">
                  CV
                </div>
              ))}
            </div>
          </div>

          {/* Walkway spacer */}
          <div className="flex items-stretch gap-0 mb-1">
            <div className="w-[60px]" />
            <div className="flex-1 flex items-center gap-1">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex-1 h-3 rounded bg-[#E2E8F0]/50" />
              ))}
            </div>
          </div>

          {/* Racks by Row */}
          {rows.map((rowKey) => {
            const rowRacks = racksByRow[rowKey];
            // Sort by bin
            rowRacks.sort((a, b) => a.bin.localeCompare(b.bin));
            return (
              <div key={rowKey} className="flex items-stretch gap-0 mb-1">
                <div className="w-[60px] flex items-center justify-center text-[10px] font-semibold text-[#64748B]">
                  {rowKey}
                </div>
                <div className="flex-1 flex items-center gap-1">
                  {rowRacks.map((rack) => {
                    const config = statusConfig[rack.status];
                    const isHovered = hoveredRack === rack.id;
                    return (
                      <button
                        key={rack.id}
                        onClick={() => onRackClick(rack)}
                        onMouseEnter={() => setHoveredRack(rack.id)}
                        onMouseLeave={() => setHoveredRack(null)}
                        className="relative flex-1 flex flex-col items-center justify-center h-10 rounded border text-[9px] font-bold cursor-pointer transition-all hover:scale-105 hover:shadow-sm"
                        style={{
                          backgroundColor: config.color,
                          borderColor: config.border,
                          color: config.border,
                        }}
                      >
                        {rack.bin}
                        {isHovered && (
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 z-10 bg-[#0F172A] text-white text-[10px] font-medium px-2 py-1 rounded whitespace-nowrap pointer-events-none">
                            {rack.rackId} — {rack.occupancy}% — {rack.currentPieces}/{rack.capacity} pcs
                            <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-[#0F172A] rotate-45" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Walkway spacer */}
          <div className="flex items-stretch gap-0 mb-1">
            <div className="w-[60px]" />
            <div className="flex-1 flex items-center gap-1">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex-1 h-3 rounded bg-[#E2E8F0]/50" />
              ))}
            </div>
          </div>

          {/* Cold Rooms */}
          <div className="flex items-stretch gap-0 mb-1">
            <div className="w-[60px] flex items-center justify-center text-[10px] font-semibold text-[#64748B] rotate-180" style={{ writingMode: "vertical-rl" }}>
              COLD ROOMS
            </div>
            <div className="flex-1 flex items-center gap-1">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex-1 flex items-center justify-center h-8 rounded bg-[#6366F1]/15 text-[10px] font-semibold text-[#6366F1]">
                  COLD-{i + 1}
                </div>
              ))}
            </div>
          </div>

          {/* Vehicle Bays */}
          <div className="flex items-stretch gap-0 mb-1">
            <div className="w-[60px] flex items-center justify-center text-[10px] font-semibold text-[#64748B] rotate-180" style={{ writingMode: "vertical-rl" }}>
              VEHICLE BAYS
            </div>
            <div className="flex-1 flex items-center gap-1">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex-1 flex items-center justify-center h-8 rounded bg-[#64748B]/10 text-[10px] font-semibold text-[#64748B]">
                  VB-{i + 1}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Row Labels */}
          <div className="flex items-stretch gap-0 mt-1">
            <div className="w-[60px]" />
            <div className="flex-1 flex items-center gap-1">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex-1 flex items-center justify-center text-[10px] font-semibold text-[#64748B]">
                  BAY {i + 1}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}