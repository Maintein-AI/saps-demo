import ScopeBadge from "@/components/ScopeBadge";
import { Clock, AlertTriangle, FileWarning, CreditCard, PackageCheck, CheckCircle, XCircle, ArrowRight } from "lucide-react";

const notifications = [
  { type: "Free-period expiry", awb: "214-45678901", message: "Free period expires in 48 hours for AWB 214-45678901. Customs clearance required.", time: "15 min ago", status: "Critical" },
  { type: "Customs hold", awb: "157-90811223", message: "Customs hold CH-382 on AWB 157-90811223. FHL document missing line items.", time: "32 min ago", status: "Warning" },
  { type: "Documents missing", awb: "074-88219033", message: "Authority letter and AWB copy still missing for AWB 074-88219033.", time: "1 hr ago", status: "Warning" },
  { type: "Payment due", awb: "117-55443321", message: "Invoice INV-2026-05210 is due today. Outstanding PKR 285,000.", time: "2 hr ago", status: "Critical" },
  { type: "DO ready", awb: "117-98765432", message: "Delivery order DO-90875 is ready for collection. Valid for 48 hours.", time: "3 hr ago", status: "Info" },
  { type: "Pickup approved", awb: "214-45678901", message: "Pickup slot approved for 01 Jun 2026 14:00. Vehicle KHI-4582 registered.", time: "4 hr ago", status: "Success" },
  { type: "Gate entry rejected", awb: "157-90811223", message: "Vehicle BJU-7721 rejected at Gate 1. Invalid authority letter.", time: "5 hr ago", status: "Critical" },
];

const typeIcon: Record<string, React.ReactNode> = {
  "Free-period expiry": <Clock size={14} className="text-[#DC2626]" />,
  "Customs hold": <AlertTriangle size={14} className="text-[#D97706]" />,
  "Documents missing": <FileWarning size={14} className="text-[#D97706]" />,
  "Payment due": <CreditCard size={14} className="text-[#DC2626]" />,
  "DO ready": <PackageCheck size={14} className="text-[#1B4F8B]" />,
  "Pickup approved": <CheckCircle size={14} className="text-[#16A34A]" />,
  "Gate entry rejected": <XCircle size={14} className="text-[#DC2626]" />,
};

const statusColor: Record<string, { bg: string; text: string }> = {
  Critical: { bg: "#FEE2E2", text: "#DC2626" },
  Warning: { bg: "#FEF3C7", text: "#D97706" },
  Info: { bg: "#DBEAFE", text: "#1B4F8B" },
  Success: { bg: "#DCFCE7", text: "#16A34A" },
};

export default function RecentNotifications() {
  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <h3 className="text-[15px] font-bold text-[#0F172A]">Recent Notifications</h3>
          <ScopeBadge type="exc" />
        </div>
        <span className="text-[12px] text-[#64748B]">{notifications.length} new</span>
      </div>
      <div className="space-y-3 overflow-y-auto flex-1">
        {notifications.map((n, i) => {
          const sc = statusColor[n.status];
          return (
            <div key={i} className="rounded-xl border border-[#E2E8F0] p-4 hover:bg-[#F8FAFC] transition-colors">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#F1F5F9] flex items-center justify-center flex-shrink-0">
                  {typeIcon[n.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-[13px] font-semibold text-[#0F172A]">{n.type}</h4>
                    <span className="inline-flex items-center h-5 px-2 rounded-full text-[10px] font-semibold flex-shrink-0" style={{ backgroundColor: sc.bg, color: sc.text }}>
                      {n.status}
                    </span>
                  </div>
                  <p className="text-[12px] text-[#1B4F8B] font-medium mt-1">{n.awb}</p>
                  <p className="text-[12px] text-[#64748B] mt-1 leading-relaxed">{n.message}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[11px] text-[#94A3B8]">{n.time}</span>
                    <button className="flex items-center gap-1 text-[11px] font-semibold text-[#1B4F8B] hover:text-[#0B2545] cursor-pointer transition-colors">
                      View <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}