import ScopeBadge from "@/components/ScopeBadge";
import { MoreHorizontal, FileText, Eye, Mail } from "lucide-react";

const history = [
  { date: "31 May 2026", shift: "Night Shift B", outgoing: "Sana Iqbal", incoming: "Kamran Ali", openItems: "9", exceptions: "5", submittedAt: "31 May 2026 14:05" },
  { date: "30 May 2026", shift: "Day Shift A", outgoing: "Kamran Ali", incoming: "Nadeem Shah", openItems: "11", exceptions: "3", submittedAt: "30 May 2026 14:10" },
  { date: "29 May 2026", shift: "Night Shift B", outgoing: "Nadeem Shah", incoming: "Sana Iqbal", openItems: "7", exceptions: "4", submittedAt: "29 May 2026 14:02" },
  { date: "28 May 2026", shift: "Day Shift A", outgoing: "Sana Iqbal", incoming: "Kamran Ali", openItems: "13", exceptions: "6", submittedAt: "28 May 2026 14:15" },
  { date: "27 May 2026", shift: "Night Shift B", outgoing: "Kamran Ali", incoming: "Nadeem Shah", openItems: "8", exceptions: "2", submittedAt: "27 May 2026 14:08" },
  { date: "26 May 2026", shift: "Day Shift A", outgoing: "Nadeem Shah", incoming: "Sana Iqbal", openItems: "15", exceptions: "7", submittedAt: "26 May 2026 14:20" },
  { date: "25 May 2026", shift: "Night Shift B", outgoing: "Sana Iqbal", incoming: "Kamran Ali", openItems: "10", exceptions: "4", submittedAt: "25 May 2026 14:12" },
  { date: "24 May 2026", shift: "Day Shift A", outgoing: "Kamran Ali", incoming: "Nadeem Shah", openItems: "12", exceptions: "5", submittedAt: "24 May 2026 14:06" },
  { date: "23 May 2026", shift: "Night Shift B", outgoing: "Nadeem Shah", incoming: "Sana Iqbal", openItems: "6", exceptions: "3", submittedAt: "23 May 2026 14:03" },
  { date: "22 May 2026", shift: "Day Shift A", outgoing: "Sana Iqbal", incoming: "Kamran Ali", openItems: "14", exceptions: "8", submittedAt: "22 May 2026 14:18" },
  { date: "21 May 2026", shift: "Night Shift B", outgoing: "Kamran Ali", incoming: "Nadeem Shah", openItems: "9", exceptions: "4", submittedAt: "21 May 2026 14:09" },
  { date: "20 May 2026", shift: "Day Shift A", outgoing: "Nadeem Shah", incoming: "Sana Iqbal", openItems: "11", exceptions: "5", submittedAt: "20 May 2026 14:14" },
];

export default function HistoryTable() {
  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <h3 className="text-[15px] font-bold text-[#0F172A]">Previous Handovers</h3>
          <ScopeBadge type="inc" />
        </div>
        <span className="text-[12px] text-[#64748B]">{history.length} records</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] text-left">
          <thead>
            <tr className="border-b border-[#E2E8F0]">
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Date</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Shift</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Outgoing</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Incoming</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Open Items</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Exceptions</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Submitted At</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody>
            {history.map((h, i) => (
              <tr key={i} className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors">
                <td className="py-3 px-3 text-[12px] font-semibold text-[#0F172A]">{h.date}</td>
                <td className="py-3 px-3 text-[12px] text-[#0F172A]">{h.shift}</td>
                <td className="py-3 px-3 text-[12px] text-[#0F172A]">{h.outgoing}</td>
                <td className="py-3 px-3 text-[12px] text-[#0F172A]">{h.incoming}</td>
                <td className="py-3 px-3 text-[12px] text-[#0F172A]">{h.openItems}</td>
                <td className="py-3 px-3 text-[12px] text-[#DC2626] font-medium">{h.exceptions}</td>
                <td className="py-3 px-3 text-[12px] text-[#64748B]">{h.submittedAt}</td>
                <td className="py-3 px-3">
                  <div className="flex items-center gap-1">
                    <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors" title="View">
                      <Eye size={14} />
                    </button>
                    <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors" title="PDF">
                      <FileText size={14} />
                    </button>
                    <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors" title="Email">
                      <Mail size={14} />
                    </button>
                    <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors">
                      <MoreHorizontal size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}