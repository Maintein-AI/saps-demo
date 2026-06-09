"use client";

import { useState } from "react";
import {
  MapPin,
  Navigation,
  Users,
  Clock,
  ChevronRight,
  Zap,
  CheckCircle2,
  Check,
} from "lucide-react";
import ScopeBadge from "@/components/ScopeBadge";

interface Station {
  id: string;
  location: string;
  distance: string;
  availability: string;
  queueCount: number;
  waitTime: string;
}

export default function ChargingStation() {
  const [reserved, setReserved] = useState(false);

  const station: Station = {
    id: "CS-A12",
    location: "Charging Station A, Bay 12",
    distance: "42 m",
    availability: "Available",
    queueCount: 0,
    waitTime: "0 min",
  };

  const isAvailable = station.availability === "Available";

  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-white p-5">
      <div className="flex items-center gap-2 mb-5">
        <h2 className="text-[16px] font-bold text-[#0F172A]">Nearest Charging Station</h2>
        <ScopeBadge type="inc" />
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-[#FEF3C7] flex items-center justify-center flex-shrink-0">
          <Zap size={24} className="text-[#D97706]" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-[18px] font-bold text-[#0F172A]">{station.id}</p>
            <span
              className="inline-flex items-center gap-1 h-5 px-2 rounded-full text-[11px] font-semibold"
              style={{
                backgroundColor: isAvailable ? "#DCFCE7" : "#FEE2E2",
                color: isAvailable ? "#16A34A" : "#DC2626",
              }}
            >
              <CheckCircle2 size={10} />
              {station.availability}
            </span>
          </div>
          <p className="text-[13px] text-[#64748B] mt-0.5">{station.location}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-2.5 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] p-3">
          <div className="w-8 h-8 rounded-lg bg-[#DBEAFE] flex items-center justify-center flex-shrink-0">
            <Navigation size={14} className="text-[#1B4F8B]" />
          </div>
          <div>
            <p className="text-[11px] text-[#94A3B8] font-medium">Distance</p>
            <p className="text-[14px] font-bold text-[#0F172A]">{station.distance}</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] p-3">
          <div className="w-8 h-8 rounded-lg bg-[#F1F5F9] flex items-center justify-center flex-shrink-0">
            <Users size={14} className="text-[#64748B]" />
          </div>
          <div>
            <p className="text-[11px] text-[#94A3B8] font-medium">Queue</p>
            <p className="text-[14px] font-bold text-[#0F172A]">{station.queueCount} waiting</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] p-3 col-span-2">
          <div className="w-8 h-8 rounded-lg bg-[#F1F5F9] flex items-center justify-center flex-shrink-0">
            <Clock size={14} className="text-[#64748B]" />
          </div>
          <div>
            <p className="text-[11px] text-[#94A3B8] font-medium">Estimated Wait</p>
            <p className="text-[14px] font-bold text-[#0F172A]">{station.waitTime}</p>
          </div>
        </div>
      </div>

      <div className="bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] p-3 mb-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-[#E2E8F0] flex items-center justify-center flex-shrink-0">
          <MapPin size={18} className="text-[#64748B]" />
        </div>
        <div className="flex-1">
          <p className="text-[12px] font-semibold text-[#0F172A]">Direction Preview</p>
          <p className="text-[12px] text-[#94A3B8]">Head left from AFU Aisle 02, follow markers to Bay 12</p>
        </div>
        <ChevronRight size={18} className="text-[#94A3B8]" />
      </div>

      <button
        onClick={() => setReserved(!reserved)}
        className="w-full h-14 rounded-xl text-[15px] font-bold cursor-pointer transition-colors hover:opacity-90 active:scale-[0.98] flex items-center justify-center gap-2 whitespace-nowrap"
        style={{
          backgroundColor: reserved ? "#DCFCE7" : "#D97706",
          color: reserved ? "#16A34A" : "#FFFFFF",
          border: reserved ? "1px solid #16A34A" : "none",
        }}
      >
        {reserved ? <Check size={18} /> : <Zap size={18} />}
        {reserved ? "Slot Reserved" : "Reserve Charging Slot"}
      </button>
    </div>
  );
}