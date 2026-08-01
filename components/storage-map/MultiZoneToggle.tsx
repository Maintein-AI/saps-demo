"use client";
import { Layers, Square, ChevronRight, Thermometer, ArrowUpDown, Triangle, Car } from "lucide-react";

interface MultiZoneToggleProps {
  active: string;
  onChange: (zone: string) => void;
}

const zoneOptions = [
  { key: "AFU", label: "Standard Pallet", icon: Square },
  { key: "GCR", label: "Wide-bay 2-level", icon: Layers },
  { key: "PER", label: "Cantilever", icon: Triangle },
  { key: "VAL", label: "ODC block-stacking", icon: Square },
  { key: "DGR", label: "Vertical Carousel", icon: ArrowUpDown },
  { key: "COLD", label: "Drive-in", icon: Car },
];

export default function MultiZoneToggle({ active, onChange }: MultiZoneToggleProps) {
  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-[16px] font-semibold text-[#0F172A]">Multi-Zone View</h2>
      </div>
      <div className="flex flex-col gap-1.5">
        {zoneOptions.map((zone) => {
          const Icon = zone.icon;
          const isActive = active === zone.key;
          return (
            <button
              key={zone.key}
              onClick={() => onChange(zone.key)}
              className="flex items-center gap-2.5 h-10 px-3 rounded-lg text-left text-[12px] font-medium cursor-pointer transition-all whitespace-nowrap"
              style={{
                backgroundColor: isActive ? "#EBF0F7" : "white",
                color: isActive ? "#0B2545" : "#64748B",
                border: isActive ? "1px solid #1B4F8B" : "1px solid #E2E8F0",
              }}
            >
              <Icon size={14} strokeWidth={isActive ? 2.5 : 2} />
              <span className="flex-1">{zone.label}</span>
              <ChevronRight size={12} className={isActive ? "text-[#1B4F8B]" : "text-[#94A3B8]"} />
            </button>
          );
        })}
      </div>
    </div>
  );
}