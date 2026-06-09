import ScopeBadge from "@/components/ScopeBadge";
import { Eye, ChevronRight } from "lucide-react";

const notices = [
  { awb: "117-23456789", type: "Arrival", message: "Shipment arrived at KHI — pending customs clearance", receivedAt: "08 Jun, 14:30" },
  { awb: "117-23456812", type: "Customs", message: "Yellow channel exam scheduled for 10 Jun", receivedAt: "08 Jun, 11:15" },
  { awb: "117-23456755", type: "OOC", message: "Piece count mismatch — 2 pieces short vs. manifest", receivedAt: "07 Jun, 18:45" },
  { awb: "117-23456890", type: "Charges", message: "Invoice INV-2026-0891 generated — PKR 285,000", receivedAt: "07 Jun, 09:20" },
  { awb: "117-23456901", type: "DO Ready", message: "DO DO-2026-1124 ready for collection", receivedAt: "06 Jun, 16:10" },
];

const typeColors: Record<string, string> = {
  Arrival: "#1B4F8B",
  Customs: "#D97706",
  OOC: "#DC2626",
  Charges: "#7C3AED",
  "DO Ready": "#16A34A",
};

interface RecentNoticesProps {
  onView: (notice: typeof notices[0]) => void;
}

export default function RecentNotices({ onView }: RecentNoticesProps) {
  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[16px] font-bold text-[#0F172A]">Recent Notices</h3>
        <ScopeBadge type="exc" />
      </div>

      <div className="space-y-3">
        {notices.map((n, i) => (
          <div
            key={i}
            className="flex items-start gap-3 p-3 rounded-xl border border-[#E2E8F0] hover:bg-[#F8FAFC] cursor-pointer transition-colors group"
            onClick={() => onView(n)}
          >
            <div
              className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
              style={{ backgroundColor: typeColors[n.type] || "#64748B" }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[13px] font-bold text-[#0F172A]">{n.awb}</span>
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: `${typeColors[n.type]}15`, color: typeColors[n.type] }}
                >
                  {n.type}
                </span>
              </div>
              <p className="text-[13px] text-[#334155] leading-snug truncate">{n.message}</p>
              <p className="text-[11px] text-[#94A3B8] mt-1">{n.receivedAt}</p>
            </div>
            <div className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
              <Eye size={14} className="text-[#64748B]" />
            </div>
          </div>
        ))}
      </div>

      <button className="flex items-center gap-1.5 mt-4 text-[13px] font-semibold text-[#1B4F8B] hover:text-[#0B2545] cursor-pointer transition-colors">
        View all notices
        <ChevronRight size={14} />
      </button>
    </div>
  );
}