"use client";

interface MessageHeaderCardProps {
  originator: string;
  station: string;
  localDate: string;
  localTime: string;
  substation: string;
  status: string;
  onOriginatorChange: (v: string) => void;
  onStationChange: (v: string) => void;
  onLocalDateChange: (v: string) => void;
  onLocalTimeChange: (v: string) => void;
  onSubstationChange: (v: string) => void;
}

export default function MessageHeaderCard({
  originator,
  station,
  localDate,
  localTime,
  substation,
  status,
  onOriginatorChange,
  onStationChange,
  onLocalDateChange,
  onLocalTimeChange,
  onSubstationChange,
}: MessageHeaderCardProps) {
  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-[15px] font-bold text-[#0F172A]">Message Header</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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
          <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">Station</label>
          <input
            type="text"
            value={station}
            onChange={(e) => onStationChange(e.target.value)}
            className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] text-[13px] font-mono text-[#0F172A] bg-[#F8FAFC] focus:outline-none focus:border-[#1B4F8B] focus:ring-1 focus:ring-[#1B4F8B] transition-colors"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">Local Date</label>
          <input
            type="text"
            value={localDate}
            onChange={(e) => onLocalDateChange(e.target.value)}
            className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] text-[13px] font-mono text-[#0F172A] bg-[#F8FAFC] focus:outline-none focus:border-[#1B4F8B] focus:ring-1 focus:ring-[#1B4F8B] transition-colors"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">Local Time</label>
          <input
            type="text"
            value={localTime}
            onChange={(e) => onLocalTimeChange(e.target.value)}
            className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] text-[13px] font-mono text-[#0F172A] bg-[#F8FAFC] focus:outline-none focus:border-[#1B4F8B] focus:ring-1 focus:ring-[#1B4F8B] transition-colors"
          />
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
        <div>
          <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">Status</label>
          <div className="h-9 px-3 rounded-lg border border-[#E2E8F0] bg-[#F1F5F9] flex items-center">
            <span className="text-[13px] font-semibold text-[#64748B]">{status}</span>
          </div>
        </div>
      </div>
    </div>
  );
}