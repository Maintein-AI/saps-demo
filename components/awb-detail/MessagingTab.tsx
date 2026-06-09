import ScopeBadge from "@/components/ScopeBadge";
import { CheckCircle, Clock, AlertCircle, FileText, Send, Mail, Package, Truck, Inbox, MessageSquare } from "lucide-react";

interface Message {
  type: string;
  status: "received" | "pending" | "not_required";
  timestamp: string;
  sender: string;
  description: string;
}

const messages: Message[] = [
  { type: "FFM", status: "received", timestamp: "30 May 2026, 18:20", sender: "EK DXB", description: "Freight manifest received for flight EK602" },
  { type: "FWB", status: "received", timestamp: "30 May 2026, 19:45", sender: "EK DXB", description: "Air waybill data transmitted electronically" },
  { type: "FHL", status: "received", timestamp: "30 May 2026, 20:10", sender: "EK DXB", description: "House airwaybill list received" },
  { type: "RCF", status: "received", timestamp: "31 May 2026, 08:15", sender: "KHI GHA", description: "Received from carrier at Karachi Hub" },
  { type: "NFD", status: "received", timestamp: "31 May 2026, 11:30", sender: "KHI GHA", description: "Notify for delivery — consignee alerted" },
  { type: "DLV", status: "pending", timestamp: "—", sender: "—", description: "Delivery message — awaiting dispatch" },
  { type: "DIS", status: "not_required", timestamp: "—", sender: "—", description: "Discrepancy message — not triggered" },
];

const statusConfig = {
  received: { icon: <CheckCircle size={16} />, color: "#16A34A", bg: "#DCFCE7", label: "Received" },
  pending: { icon: <Clock size={16} />, color: "#D97706", bg: "#FEF3C7", label: "Pending" },
  not_required: { icon: <AlertCircle size={16} />, color: "#64748B", bg: "#F1F5F9", label: "Not Required" },
};

const typeIcon = (type: string) => {
  switch (type) {
    case "FFM": return <FileText size={16} />;
    case "FWB": return <Mail size={16} />;
    case "FHL": return <Package size={16} />;
    case "RCF": return <Inbox size={16} />;
    case "NFD": return <Send size={16} />;
    case "DLV": return <Truck size={16} />;
    case "DIS": return <MessageSquare size={16} />;
    default: return <FileText size={16} />;
  }
};

export default function MessagingTab() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-[16px] font-semibold text-[#0F172A]">
            IATA Message Timeline
          </h3>
          <ScopeBadge type="inc" />
        </div>
      </div>

      <div className="flex flex-col gap-0">
        {messages.map((msg, i) => {
          const config = statusConfig[msg.status];
          const isLast = i === messages.length - 1;
          return (
            <div key={msg.type} className="flex gap-4">
              {/* Timeline line */}
              <div className="flex flex-col items-center">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: config.bg, color: config.color }}
                >
                  {typeIcon(msg.type)}
                </div>
                {!isLast && (
                  <div className="w-[2px] flex-1 bg-[#E2E8F0] my-1" />
                )}
              </div>
              {/* Content */}
              <div className="flex-1 pb-6">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[14px] font-bold text-[#0F172A]">{msg.type}</span>
                  <div
                    className="flex items-center gap-1 h-6 px-2 rounded-full text-[11px] font-semibold"
                    style={{ backgroundColor: config.bg, color: config.color }}
                  >
                    {config.icon}
                    {config.label}
                  </div>
                </div>
                <p className="text-[13px] text-[#334155] leading-relaxed mb-1">
                  {msg.description}
                </p>
                <div className="flex items-center gap-3 text-[12px] text-[#94A3B8]">
                  <span>{msg.timestamp}</span>
                  {msg.sender !== "—" && (
                    <>
                      <span>from</span>
                      <span className="font-medium text-[#64748B]">{msg.sender}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}