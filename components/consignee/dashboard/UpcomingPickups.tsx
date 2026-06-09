import ScopeBadge from "@/components/ScopeBadge";
import { Eye, ChevronRight } from "lucide-react";

const pickups = [
  { awb: "117-23456789", doNo: "DO-2026-1124", driver: "Asif Khan", vehicle: "JZX-442 KHI", pickupSlot: "10 Jun, 09:00–11:00", status: "Scheduled" },
  { awb: "117-23456890", doNo: "DO-2026-1130", driver: "Rashid Iqbal", vehicle: "BMA-778 KHI", pickupSlot: "10 Jun, 14:00–16:00", status: "Confirmed" },
  { awb: "117-23456955", doNo: "DO-2026-1141", driver: "Naveed Raza", vehicle: "ALS-112 KHI", pickupSlot: "11 Jun, 10:00–12:00", status: "Scheduled" },
];

const statusColors: Record<string, string> = {
  Scheduled: "#D97706",
  Confirmed: "#16A34A",
  Completed: "#1B4F8B",
  Cancelled: "#DC2626",
};

interface UpcomingPickupsProps {
  onView: (p: typeof pickups[0]) => void;
  onSchedulePickup: () => void;
}

export default function UpcomingPickups({ onView, onSchedulePickup }: UpcomingPickupsProps) {
  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[16px] font-bold text-[#0F172A]">Upcoming Pickups</h3>
        <ScopeBadge type="exc" />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px]">
          <thead>
            <tr className="border-b border-[#E2E8F0]">
              <th className="text-left text-[11px] font-bold uppercase tracking-wider text-[#64748B] px-3 py-2">AWB #</th>
              <th className="text-left text-[11px] font-bold uppercase tracking-wider text-[#64748B] px-3 py-2">DO #</th>
              <th className="text-left text-[11px] font-bold uppercase tracking-wider text-[#64748B] px-3 py-2">Driver</th>
              <th className="text-left text-[11px] font-bold uppercase tracking-wider text-[#64748B] px-3 py-2">Vehicle</th>
              <th className="text-left text-[11px] font-bold uppercase tracking-wider text-[#64748B] px-3 py-2">Pickup Slot</th>
              <th className="text-left text-[11px] font-bold uppercase tracking-wider text-[#64748B] px-3 py-2">Status</th>
              <th className="text-left text-[11px] font-bold uppercase tracking-wider text-[#64748B] px-3 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {pickups.map((p, i) => (
              <tr key={i} className="border-b border-[#E2E8F0] last:border-b-0 hover:bg-[#F8FAFC] transition-colors">
                <td className="px-3 py-3 text-[13px] font-medium text-[#0F172A]">{p.awb}</td>
                <td className="px-3 py-3 text-[13px] text-[#1B4F8B] font-medium">{p.doNo}</td>
                <td className="px-3 py-3 text-[13px] text-[#334155]">{p.driver}</td>
                <td className="px-3 py-3 text-[13px] text-[#334155]">{p.vehicle}</td>
                <td className="px-3 py-3 text-[13px] text-[#334155]">{p.pickupSlot}</td>
                <td className="px-3 py-3">
                  <span
                    className="inline-flex items-center h-[22px] px-2 rounded-full text-[11px] font-bold"
                    style={{ backgroundColor: `${statusColors[p.status]}15`, color: statusColors[p.status] }}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <button
                    onClick={() => onView(p)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F1F5F9] text-[#64748B] cursor-pointer transition-colors"
                  >
                    <Eye size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <button
          onClick={onSchedulePickup}
          className="flex items-center gap-2 h-9 px-4 rounded-xl text-[13px] font-semibold text-white cursor-pointer hover:opacity-90 transition-colors"
          style={{ backgroundColor: "#0B2545" }}
        >
          Schedule New Pickup
        </button>
        <button className="flex items-center gap-1.5 text-[13px] font-semibold text-[#1B4F8B] hover:text-[#0B2545] cursor-pointer transition-colors">
          View all pickups
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}