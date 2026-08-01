import { Truck, CheckCircle, Clock, AlertTriangle, ArrowRight } from "lucide-react";

const pickups = [
  { slot: "01 Jun 2026 14:00", awb: "214-45678901", do: "DO-90871", driver: "Ahmed Raza", vehicle: "KHI-4582", pieces: 24, status: "Approved" },
  { slot: "01 Jun 2026 16:30", awb: "157-90811223", do: "DO-90872", driver: "Imran Ali", vehicle: "BJU-7721", pieces: 8, status: "Pending" },
  { slot: "01 Jun 2026 18:00", awb: "074-88219033", do: "DO-90873", driver: "Kashif Khan", vehicle: "KHI-9934", pieces: 16, status: "Pending" },
  { slot: "02 Jun 2026 08:30", awb: "117-55443321", do: "DO-90874", driver: "Bilal Ahmed", vehicle: "LHE-2217", pieces: 42, status: "Draft" },
  { slot: "02 Jun 2026 12:00", awb: "117-98765432", do: "DO-90875", driver: "Saad Qureshi", vehicle: "KHI-4455", pieces: 12, status: "Draft" },
];

const statusConfig: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  Approved: { bg: "#DCFCE7", text: "#16A34A", icon: <CheckCircle size={12} /> },
  Pending: { bg: "#FEF3C7", text: "#D97706", icon: <Clock size={12} /> },
  Draft: { bg: "#F1F5F9", text: "#64748B", icon: <Truck size={12} /> },
};

export default function NextPickups() {
  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <h3 className="text-[15px] font-bold text-[#0F172A]">Next Pickups</h3>
        </div>
        <span className="text-[12px] text-[#64748B]">{pickups.length} pickups</span>
      </div>
      <div className="overflow-x-auto flex-1">
        <table className="w-full min-w-[700px] text-left">
          <thead>
            <tr className="border-b border-[#E2E8F0]">
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Pickup Slot</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">AWB #</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">DO #</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Driver</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Vehicle</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Pieces</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Status</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody>
            {pickups.map((p, i) => {
              const sc = statusConfig[p.status];
              return (
                <tr key={i} className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-3 px-3 text-[12px] text-[#64748B]">{p.slot}</td>
                  <td className="py-3 px-3 text-[12px] font-semibold text-[#1B4F8B]">{p.awb}</td>
                  <td className="py-3 px-3 text-[12px] text-[#0F172A]">{p.do}</td>
                  <td className="py-3 px-3 text-[12px] text-[#0F172A]">{p.driver}</td>
                  <td className="py-3 px-3 text-[12px] text-[#0F172A]">{p.vehicle}</td>
                  <td className="py-3 px-3 text-[12px] font-semibold text-[#0F172A]">{p.pieces}</td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 h-5 px-2 rounded-full text-[11px] font-semibold" style={{ backgroundColor: sc.bg, color: sc.text }}>
                      {sc.icon}
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors">
                      <ArrowRight size={14} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}