"use client";

import ScopeBadge from "@/components/ScopeBadge";

interface MessageHeaderCardProps {
  originator: string;
  sendingStation: string;
  inFlightNumber: string;
  flightDateUtc: string;
  aircraftReg: string;
  outFlightNumber: string;
  status: string;
  substation: string;
  onOriginatorChange: (v: string) => void;
  onSendingStationChange: (v: string) => void;
  onInFlightNumberChange: (v: string) => void;
  onFlightDateUtcChange: (v: string) => void;
  onAircraftRegChange: (v: string) => void;
  onOutFlightNumberChange: (v: string) => void;
  onStatusChange: (v: string) => void;
  onSubstationChange: (v: string) => void;
}

const statusOptions = ["Draft", "Sent", "Correction", "Failed"];

const statusColors: Record<string, { bg: string; text: string }> = {
  Draft: { bg: "#F1F5F9", text: "#64748B" },
  Sent: { bg: "#DCFCE7", text: "#16A34A" },
  Correction: { bg: "#FEF3C7", text: "#D97706" },
  Failed: { bg: "#FEE2E2", text: "#DC2626" },
};

export default function MessageHeaderCard({
  originator,
  sendingStation,
  inFlightNumber,
  flightDateUtc,
  aircraftReg,
  outFlightNumber,
  status,
  substation,
  onOriginatorChange,
  onSendingStationChange,
  onInFlightNumberChange,
  onFlightDateUtcChange,
  onAircraftRegChange,
  onOutFlightNumberChange,
  onStatusChange,
  onSubstationChange,
}: MessageHeaderCardProps) {
  const sc = statusColors[status] || statusColors.Draft;

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-[15px] font-bold text-[#0F172A]">Message Header</h2>
        <ScopeBadge type="exc" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">Originator</label>
          <input
            type="text"
            value={originator}
            onChange={(e) => onOriginatorChange(e.target.value)}
            className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] text-[13px] font-mono text-[#0F172A] bg-[#F8FAFC] focus:outline-none focus:border-[#1B4F8B] focus:ring-1 focus:ring-[#1B4F8B] transition-colors"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">Sending Station</label>
          <input
            type="text"
            value={sendingStation}
            onChange={(e) => onSendingStationChange(e.target.value)}
            className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] text-[13px] font-mono text-[#0F172A] bg-[#F8FAFC] focus:outline-none focus:border-[#1B4F8B] focus:ring-1 focus:ring-[#1B4F8B] transition-colors"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">IN Flight Number</label>
          <input
            type="text"
            value={inFlightNumber}
            onChange={(e) => onInFlightNumberChange(e.target.value)}
            className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] text-[13px] font-mono text-[#0F172A] bg-[#F8FAFC] focus:outline-none focus:border-[#1B4F8B] focus:ring-1 focus:ring-[#1B4F8B] transition-colors"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">Flight Date (UTC)</label>
          <input
            type="text"
            value={flightDateUtc}
            onChange={(e) => onFlightDateUtcChange(e.target.value)}
            className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] text-[13px] font-mono text-[#0F172A] bg-[#F8FAFC] focus:outline-none focus:border-[#1B4F8B] focus:ring-1 focus:ring-[#1B4F8B] transition-colors"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">Aircraft Registration</label>
          <input
            type="text"
            value={aircraftReg}
            onChange={(e) => onAircraftRegChange(e.target.value)}
            className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] text-[13px] font-mono text-[#0F172A] bg-[#F8FAFC] focus:outline-none focus:border-[#1B4F8B] focus:ring-1 focus:ring-[#1B4F8B] transition-colors"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">OUT Flight Number</label>
          <input
            type="text"
            value={outFlightNumber}
            onChange={(e) => onOutFlightNumberChange(e.target.value)}
            className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] text-[13px] font-mono text-[#0F172A] bg-[#F8FAFC] focus:outline-none focus:border-[#1B4F8B] focus:ring-1 focus:ring-[#1B4F8B] transition-colors"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full h-9 px-3 pr-8 rounded-lg border border-[#E2E8F0] text-[13px] font-semibold cursor-pointer focus:outline-none focus:border-[#1B4F8B] focus:ring-1 focus:ring-[#1B4F8B] transition-colors"
            style={{ backgroundColor: sc.bg, color: sc.text }}
          >
            {statusOptions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">Substation</label>
          <input
            type="text"
            value={substation}
            onChange={(e) => onSubstationChange(e.target.value)}
            className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] text-[13px] font-mono text-[#0F172A] bg-[#F8FAFC] focus:outline-none focus:border-[#1B4F8B] focus:ring-1 focus:ring-[#1B4F8B] transition-colors"
          />
        </div>
      </div>
    </div>
  );
}