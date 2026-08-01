import { Clock, CheckCircle, FileEdit, XCircle } from "lucide-react";

interface RecentMessage {
  type: "UCM" | "SCM" | "LUC";
  station: string;
  flightRef: string;
  date: string;
  status: "Draft" | "Sent" | "Correction" | "Failed";
}

const lastFive: RecentMessage[] = [
  { type: "SCM", station: "KHI", flightRef: "SV-732", date: "15 Jun 2026", status: "Sent" },
  { type: "LUC", station: "LHE", flightRef: "EK-624", date: "15 Jun 2026", status: "Sent" },
  { type: "UCM", station: "KHI", flightRef: "QR-604", date: "14 Jun 2026", status: "Correction" },
  { type: "SCM", station: "LHE", flightRef: "TK-708", date: "14 Jun 2026", status: "Draft" },
  { type: "LUC", station: "LHE", flightRef: "PA-213", date: "13 Jun 2026", status: "Failed" },
];

const typeConfig: Record<string, { bg: string; text: string }> = {
  UCM: { bg: "#DBEAFE", text: "#1B4F8B" },
  SCM: { bg: "#DCFCE7", text: "#16A34A" },
  LUC: { bg: "#FEF3C7", text: "#B45309" },
};

const statusIcons: Record<string, React.ReactNode> = {
  Draft: <Clock size={12} className="text-[#64748B]" />,
  Sent: <CheckCircle size={12} className="text-[#16A34A]" />,
  Correction: <FileEdit size={12} className="text-[#D97706]" />,
  Failed: <XCircle size={12} className="text-[#DC2626]" />,
};

export default function LastFiveMessages() {
  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-[15px] font-bold text-[#0F172A]">My Last 5 Messages</h2>
      </div>
      <div className="flex flex-col gap-2">
        {lastFive.map((msg, idx) => {
          const tc = typeConfig[msg.type];
          return (
            <div
              key={idx}
              className="flex items-center gap-3 h-12 px-4 rounded-xl border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] cursor-pointer transition-colors"
            >
              <span
                className="inline-flex items-center h-5 px-2 rounded-full text-[11px] font-bold whitespace-nowrap flex-shrink-0"
                style={{ backgroundColor: tc.bg, color: tc.text }}
              >
                {msg.type}
              </span>
              <span className="text-[12px] font-bold font-mono text-[#0F172A] flex-shrink-0">{msg.station}</span>
              <span className="text-[12px] font-mono text-[#1B4F8B] flex-shrink-0">{msg.flightRef}</span>
              <span className="text-[12px] text-[#94A3B8] flex-shrink-0">{msg.date}</span>
              <span className="ml-auto flex items-center gap-1.5 flex-shrink-0">
                {statusIcons[msg.status]}
                <span className="text-[12px] font-medium text-[#64748B]">{msg.status}</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}