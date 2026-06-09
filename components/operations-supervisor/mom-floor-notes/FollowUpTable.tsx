import ScopeBadge from "@/components/ScopeBadge";
import { MoreHorizontal, CheckCircle, Clock, AlertTriangle, ArrowRight, User } from "lucide-react";

const followUps = [
  { id: "FU-2026-0041", noteTitle: "Cold Chain Alert Zone B02", owner: "Sana Iqbal", dueDate: "01 Jun 2026", status: "Open" as const, awb: "214-66778899" },
  { id: "FU-2026-0042", noteTitle: "Invoice Hold Discussion", owner: "Faisal Qureshi", dueDate: "02 Jun 2026", status: "Open" as const, awb: "074-88219033" },
  { id: "FU-2026-0043", noteTitle: "Lifter Hydraulic Issue", owner: "Imran Ali", dueDate: "02 Jun 2026", status: "In Progress" as const, awb: "" },
  { id: "FU-2026-0044", noteTitle: "Safety Observation — Floor 3", owner: "Kamran Ali", dueDate: "01 Jun 2026", status: "Overdue" as const, awb: "" },
  { id: "FU-2026-0038", noteTitle: "RFID Scanner Battery", owner: "Imran Ali", dueDate: "31 May 2026", status: "Completed" as const, awb: "" },
  { id: "FU-2026-0035", noteTitle: "Gate Weighbridge Calibration", owner: "Nadeem Shah", dueDate: "30 May 2026", status: "Completed" as const, awb: "" },
  { id: "FU-2026-0032", noteTitle: "Customs FHL Documentation", owner: "Sana Iqbal", dueDate: "29 May 2026", status: "Completed" as const, awb: "117-22334455" },
  { id: "FU-2026-0030", noteTitle: "Conveyor Belt Maintenance", owner: "Imran Ali", dueDate: "28 May 2026", status: "Completed" as const, awb: "" },
];

const statusColor: Record<string, { bg: string; text: string }> = {
  Open: { bg: "#FEE2E2", text: "#DC2626" },
  "In Progress": { bg: "#DBEAFE", text: "#1B4F8B" },
  Completed: { bg: "#DCFCE7", text: "#16A34A" },
  Overdue: { bg: "#DC2626", text: "#FFFFFF" },
};

const statusIcon: Record<string, React.ReactNode> = {
  Open: <AlertTriangle size={12} className="text-[#DC2626]" />,
  "In Progress": <Clock size={12} className="text-[#1B4F8B]" />,
  Completed: <CheckCircle size={12} className="text-[#16A34A]" />,
  Overdue: <AlertTriangle size={12} className="text-[#DC2626]" />,
};

export default function FollowUpTable() {
  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <h3 className="text-[15px] font-bold text-[#0F172A]">Follow-up Actions</h3>
          <ScopeBadge type="inc" />
        </div>
        <span className="text-[12px] text-[#64748B]">{followUps.length} items</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left">
          <thead>
            <tr className="border-b border-[#E2E8F0]">
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Follow-up ID</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Note Title</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Owner</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Due Date</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Status</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Related AWB</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody>
            {followUps.map((f, i) => {
              const sc = statusColor[f.status];
              return (
                <tr key={i} className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-3 px-3 text-[12px] font-semibold text-[#0F172A]">{f.id}</td>
                  <td className="py-3 px-3 text-[12px] text-[#0F172A]">{f.noteTitle}</td>
                  <td className="py-3 px-3 text-[12px] text-[#0F172A]">{f.owner}</td>
                  <td className="py-3 px-3 text-[12px] text-[#64748B]">{f.dueDate}</td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 h-5 px-2 rounded-full text-[11px] font-semibold" style={{ backgroundColor: sc.bg, color: sc.text }}>
                      {statusIcon[f.status]}
                      {f.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-[12px] text-[#1B4F8B] font-medium">{f.awb || "—"}</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1">
                      <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors">
                        <CheckCircle size={14} />
                      </button>
                      <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors">
                        <ArrowRight size={14} />
                      </button>
                      <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors">
                        <MoreHorizontal size={14} />
                      </button>
                    </div>
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