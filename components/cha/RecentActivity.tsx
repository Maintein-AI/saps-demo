import {
  FileText,
  Upload,
  CheckCircle,
  Truck,
  CreditCard,
  Gavel,
  Shield,
  Clock,
  PackageCheck,
  AlertTriangle,
  Ban,
  ArrowRight,
} from "lucide-react";
import ScopeBadge from "@/components/ScopeBadge";

interface ActivityEvent {
  id: string;
  time: string;
  user: string;
  action: string;
  awb: string;
  gd: string;
  status: "Success" | "Failed" | "Pending";
  remarks: string;
}

const events: ActivityEvent[] = [
  {
    id: "EV-001",
    time: "01 Jun 2026, 09:15",
    user: "Kamran Ahmed",
    action: "Filed GD",
    awb: "214-77890123",
    gd: "2026-KHI-00441",
    status: "Success",
    remarks: "Submitted via WeBOC",
  },
  {
    id: "EV-002",
    time: "01 Jun 2026, 08:42",
    user: "Sanaullah Khan",
    action: "Responded to Query",
    awb: "117-55667788",
    gd: "2026-KHI-00432",
    status: "Success",
    remarks: "Yellow channel query cleared",
  },
  {
    id: "EV-003",
    time: "01 Jun 2026, 07:30",
    user: "Faisal Qureshi",
    action: "OOC Issued",
    awb: "157-22334455",
    gd: "2026-KHI-00433",
    status: "Success",
    remarks: "Green channel auto-clearance",
  },
  {
    id: "EV-004",
    time: "31 May 2026, 16:00",
    user: "Kamran Ahmed",
    action: "Exam Scheduled",
    awb: "074-55443322",
    gd: "2026-KHI-00438",
    status: "Pending",
    remarks: "Red channel physical exam at 10:00",
  },
  {
    id: "EV-005",
    time: "31 May 2026, 14:20",
    user: "Sanaullah Khan",
    action: "DO Collected",
    awb: "074-44556677",
    gd: "2026-KHI-00434",
    status: "Success",
    remarks: "Driver Ahmed Raza collected",
  },
  {
    id: "EV-006",
    time: "31 May 2026, 11:05",
    user: "Faisal Qureshi",
    action: "Payment Completed",
    awb: "214-77890123",
    gd: "2026-KHI-00441",
    status: "Success",
    remarks: "Rs 125,000 via bank transfer",
  },
  {
    id: "EV-007",
    time: "31 May 2026, 09:30",
    user: "Kamran Ahmed",
    action: "Re-export Case Opened",
    awb: "117-99887766",
    gd: "2026-KHI-00436",
    status: "Pending",
    remarks: "Awaiting section 82 approval",
  },
  {
    id: "EV-008",
    time: "30 May 2026, 15:45",
    user: "Sanaullah Khan",
    action: "GD Rejected",
    awb: "157-66778899",
    gd: "2026-KHI-00439",
    status: "Failed",
    remarks: "HS code mismatch — refile required",
  },
];

const statusConfig: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  Success: { bg: "#DCFCE7", text: "#16A34A", icon: <CheckCircle size={12} /> },
  Failed: { bg: "#FEE2E2", text: "#DC2626", icon: <AlertTriangle size={12} /> },
  Pending: { bg: "#FEF3C7", text: "#D97706", icon: <Clock size={12} /> },
};

const actionIcons: Record<string, React.ReactNode> = {
  "Filed GD": <FileText size={14} />,
  "Responded to Query": <Upload size={14} />,
  "OOC Issued": <CheckCircle size={14} />,
  "Exam Scheduled": <Gavel size={14} />,
  "DO Collected": <Truck size={14} />,
  "Payment Completed": <CreditCard size={14} />,
  "Re-export Case Opened": <Shield size={14} />,
  "GD Rejected": <Ban size={14} />,
};

export default function RecentActivity() {
  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <h3 className="text-[15px] font-bold text-[#0F172A]">Recent CHA Activity</h3>
          <ScopeBadge type="exc" />
        </div>
        <span className="text-[12px] text-[#64748B]">{events.length} events</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px] text-left">
          <thead>
            <tr className="border-b border-[#E2E8F0]">
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Time</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">User</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Action</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">AWB #</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">GD #</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Status</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => {
              const sc = statusConfig[event.status];
              const actionIcon = actionIcons[event.action] || <ArrowRight size={14} />;
              return (
                <tr key={event.id} className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-3 px-3 text-[12px] text-[#64748B] whitespace-nowrap">{event.time}</td>
                  <td className="py-3 px-3 text-[12px] font-semibold text-[#0F172A]">{event.user}</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#EBF0F7] flex items-center justify-center text-[#1B4F8B]">
                        {actionIcon}
                      </div>
                      <span className="text-[12px] text-[#0F172A]">{event.action}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-[12px] font-mono text-[#1B4F8B]">{event.awb}</td>
                  <td className="py-3 px-3 text-[12px] font-semibold text-[#0F172A] font-mono">{event.gd}</td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 h-5 px-2 rounded-full text-[11px] font-semibold" style={{ backgroundColor: sc.bg, color: sc.text }}>
                      {sc.icon}
                      {event.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-[12px] text-[#64748B]">{event.remarks}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}