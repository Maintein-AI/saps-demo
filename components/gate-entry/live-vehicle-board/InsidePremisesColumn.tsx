"use client";

import { Clock, MapPin, Phone, Eye, PauseCircle, LogOut } from "lucide-react";
import GateStatusBadge from "@/components/gate-entry/GateStatusBadge";

const vehicles = [
  {
    vehicle: "KHI-3001",
    driver: "Nadeem Hussain",
    purpose: "Cargo pickup",
    doc: "DO-90865",
    agent: "DB Schenker",
    entryTime: "07:30",
    dwellTime: "3h 12m",
    status: "Active",
    location: "Docking Gate A",
  },
  {
    vehicle: "RWP-7712",
    driver: "Farooq Ahmed",
    purpose: "Cargo drop",
    doc: "AWB 157-90811223",
    agent: "Gerry's",
    entryTime: "08:45",
    dwellTime: "1h 57m",
    status: "Docking",
    location: "Docking Gate B",
  },
  {
    vehicle: "LHE-9901",
    driver: "Tariq Mehmood",
    purpose: "Supplier",
    doc: "—",
    agent: "—",
    entryTime: "09:20",
    dwellTime: "1h 22m",
    status: "Active",
    location: "Supplier Bay 3",
  },
  {
    vehicle: "FSB-1123",
    driver: "Kamran Ali",
    purpose: "Cargo pickup",
    doc: "DO-90872",
    agent: "DHL",
    entryTime: "09:55",
    dwellTime: "47m",
    status: "Active",
    location: "Loading Zone 1",
  },
  {
    vehicle: "PSH-5544",
    driver: "Waseem Khan",
    purpose: "Cargo drop",
    doc: "AWB 074-88219033",
    agent: "Agility",
    entryTime: "10:15",
    dwellTime: "27m",
    status: "Docking",
    location: "Docking Gate C",
  },
];

interface InsidePremisesColumnProps {
  onAction: (action: string, vehicle: string) => void;
}

export default function InsidePremisesColumn({ onAction }: InsidePremisesColumnProps) {
  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-[#DCFCE7] flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
        </div>
        <h2 className="text-[18px] font-bold text-[#0F172A]">Inside Premises</h2>
        <span className="ml-auto text-[28px] font-bold text-[#0F172A]">{vehicles.length}</span>
      </div>

      <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
        {vehicles.map((v) => (
          <div
            key={v.vehicle}
            className="rounded-xl border border-[#E2E8F0] p-4 hover:border-[#CBD5E1] transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0B2545] flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                    <circle cx="7" cy="17" r="2" />
                    <circle cx="17" cy="17" r="2" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[16px] font-bold text-[#0F172A]">{v.vehicle}</span>
                    <GateStatusBadge status={v.status} />
                  </div>
                  <p className="text-[13px] text-[#64748B]">{v.driver}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-[14px] font-bold text-[#D97706]">
                  <Clock size={14} />
                  {v.dwellTime}
                </div>
                <p className="text-[11px] text-[#94A3B8]">Entry: {v.entryTime}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="rounded-lg bg-[#F8FAFC] px-3 py-2">
                <p className="text-[11px] text-[#94A3B8] uppercase font-semibold">Purpose</p>
                <p className="text-[13px] font-semibold text-[#0F172A]">{v.purpose}</p>
              </div>
              <div className="rounded-lg bg-[#F8FAFC] px-3 py-2">
                <p className="text-[11px] text-[#94A3B8] uppercase font-semibold">AWB / DO</p>
                <p className="text-[13px] font-semibold text-[#0F172A]">{v.doc}</p>
              </div>
              <div className="rounded-lg bg-[#F8FAFC] px-3 py-2">
                <p className="text-[11px] text-[#94A3B8] uppercase font-semibold">Agent</p>
                <p className="text-[13px] font-semibold text-[#0F172A]">{v.agent}</p>
              </div>
              <div className="rounded-lg bg-[#F8FAFC] px-3 py-2">
                <p className="text-[11px] text-[#94A3B8] uppercase font-semibold">Location</p>
                <p className="text-[13px] font-semibold text-[#0F172A] flex items-center gap-1">
                  <MapPin size={12} className="text-[#94A3B8]" />
                  {v.location}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onAction("view", v.vehicle)}
                className="h-8 px-3 rounded-lg text-[12px] font-semibold text-[#1B4F8B] border border-[#E2E8F0] hover:bg-[#EBF0F7] cursor-pointer transition-colors flex items-center gap-1.5"
              >
                <Eye size={12} />
                View
              </button>
              <button
                onClick={() => onAction("hold", v.vehicle)}
                className="h-8 px-3 rounded-lg text-[12px] font-semibold text-[#D97706] border border-[#FEF3C7] hover:bg-[#FEF3C7] cursor-pointer transition-colors flex items-center gap-1.5"
              >
                <PauseCircle size={12} />
                Hold
              </button>
              <button
                onClick={() => onAction("release", v.vehicle)}
                className="h-8 px-3 rounded-lg text-[12px] font-semibold text-white bg-[#16A34A] hover:opacity-90 cursor-pointer transition-colors flex items-center gap-1.5"
              >
                <LogOut size={12} />
                Release
              </button>
              <button
                onClick={() => onAction("call", v.vehicle)}
                className="h-8 px-3 rounded-lg text-[12px] font-semibold text-[#64748B] border border-[#E2E8F0] hover:bg-[#F8FAFC] cursor-pointer transition-colors flex items-center gap-1.5"
              >
                <Phone size={12} />
                Call
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}