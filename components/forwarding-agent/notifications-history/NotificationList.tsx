"use client";

import { useState } from "react";
import {
  Bell,
  Clock,
  AlertTriangle,
  Shield,
  FileCheck,
  DollarSign,
  Truck,
  Ban,
  Check,
  Info,
  X,
  CheckCircle,
  Upload,
  ArrowRight,
  MailOpen,
  CreditCard,
  Package,
  CalendarCheck,
  ShieldAlert,
  FileWarning,
  CheckCircle2,
  XCircle,
  FileText,
  AlertCircle,
} from "lucide-react";
import { useToast } from "@/components/ToastContext";

interface Notification {
  id: string;
  type: string;
  awb: string;
  message: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  time: string;
  status: "Unread" | "Read" | "Action Required" | "Resolved";
  readAt?: string;
}

const notifications: Notification[] = [
  {
    id: "NTF-001",
    type: "Payment due",
    awb: "214-45678901",
    message: "Invoice SAPS-2026-IN-042 is overdue. PKR 124,500 due immediately.",
    priority: "High",
    time: "10 mins ago",
    status: "Unread",
  },
  {
    id: "NTF-002",
    type: "Customs hold",
    awb: "117-55443321",
    message: "AWB flagged for physical inspection. Customs hold applied at 09:14.",
    priority: "Critical",
    time: "25 mins ago",
    status: "Unread",
  },
  {
    id: "NTF-003",
    type: "Pickup rejected",
    awb: "074-88219033",
    message: "Planner rejected your pickup slot request for Vehicle Bay 02 at 11:00. Reason: Bay reserved for DGR cargo.",
    priority: "High",
    time: "45 mins ago",
    status: "Unread",
  },
  {
    id: "NTF-004",
    type: "Free-period expiry",
    awb: "157-90811223",
    message: "Free storage period expires in 48 hours. Demurrage will apply from 03 Jun 2026.",
    priority: "Medium",
    time: "1 hr ago",
    status: "Unread",
  },
  {
    id: "NTF-005",
    type: "Documents missing",
    awb: "214-99887766",
    message: "Commercial invoice and packing list not uploaded for AWB. Customs clearance blocked.",
    priority: "High",
    time: "2 hrs ago",
    status: "Action Required",
  },
  {
    id: "NTF-006",
    type: "DO ready",
    awb: "117-98765432",
    message: "Delivery Order DO-90875 is ready for download. Payment cleared.",
    priority: "Low",
    time: "3 hrs ago",
    status: "Read",
    readAt: "01 Jun 2026, 08:30",
  },
  {
    id: "NTF-007",
    type: "Pickup approved",
    awb: "214-44556677",
    message: "Planner approved your pickup slot for Vehicle Bay 02 at 13:00. Driver and vehicle assigned.",
    priority: "Low",
    time: "3 hrs ago",
    status: "Read",
    readAt: "01 Jun 2026, 08:45",
  },
  {
    id: "NTF-008",
    type: "Gate entry rejected",
    awb: "157-11223344",
    message: "Gate entry denied for vehicle KHI-1122. Driver CNIC mismatch with pre-registration.",
    priority: "Critical",
    time: "4 hrs ago",
    status: "Unread",
  },
  {
    id: "NTF-009",
    type: "Authority letter expiring",
    awb: "074-55667788",
    message: "Authority letter AL-2026-0891 expires in 5 days. Renew before 06 Jun 2026.",
    priority: "Medium",
    time: "5 hrs ago",
    status: "Unread",
  },
  {
    id: "NTF-010",
    type: "OOC issued",
    awb: "117-44556677",
    message: "Out of Charge (OOC) issued for AWB 117-44556677. Cargo is customs cleared.",
    priority: "Low",
    time: "6 hrs ago",
    status: "Read",
    readAt: "01 Jun 2026, 07:20",
  },
  {
    id: "NTF-011",
    type: "Delivered",
    awb: "214-45678901",
    message: "Cargo from AWB 214-45678901 successfully delivered to consignee.",
    priority: "Low",
    time: "Yesterday",
    status: "Resolved",
    readAt: "31 May 2026, 18:00",
  },
  {
    id: "NTF-012",
    type: "Free-period expiry",
    awb: "074-88219033",
    message: "Free storage period has expired. Demurrage charges now apply.",
    priority: "High",
    time: "Yesterday",
    status: "Action Required",
  },
];

const priorityConfig: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  Low: { bg: "#F1F5F9", text: "#64748B", icon: <Info size={12} /> },
  Medium: { bg: "#FEF3C7", text: "#D97706", icon: <AlertTriangle size={12} /> },
  High: { bg: "#FEE2E2", text: "#DC2626", icon: <AlertTriangle size={12} /> },
  Critical: { bg: "#DC2626", text: "#FFFFFF", icon: <AlertCircle size={12} /> },
};

const statusConfig: Record<string, { bg: string; text: string }> = {
  Unread: { bg: "#EBF0F7", text: "#1B4F8B" },
  Read: { bg: "#F1F5F9", text: "#64748B" },
  "Action Required": { bg: "#FEE2E2", text: "#DC2626" },
  Resolved: { bg: "#DCFCE7", text: "#16A34A" },
};

const typeIconMap: Record<string, React.ReactNode> = {
  "Payment due": <DollarSign size={16} />,
  "Customs hold": <ShieldAlert size={16} />,
  "Pickup rejected": <XCircle size={16} />,
  "Free-period expiry": <Clock size={16} />,
  "Documents missing": <FileWarning size={16} />,
  "DO ready": <FileCheck size={16} />,
  "Pickup approved": <CheckCircle size={16} />,
  "Gate entry rejected": <Ban size={16} />,
  "Authority letter expiring": <FileText size={16} />,
  "OOC issued": <Shield size={16} />,
  "Delivered": <CheckCircle2 size={16} />,
};

interface NotificationListProps {
  onView: (notification: Notification) => void;
}

export default function NotificationList({ onView }: NotificationListProps) {
  const { addToast } = useToast();
  const [notifs, setNotifs] = useState(notifications);

  const handleMarkRead = (id: string) => {
    setNotifs((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: "Read" as const, readAt: "01 Jun 2026, 10:00" } : n))
    );
    addToast("Notification marked as read.", "success");
  };

  const handleResolve = (id: string) => {
    setNotifs((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: "Resolved" as const } : n))
    );
    addToast("Notification resolved.", "success");
  };

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <h3 className="text-[15px] font-bold text-[#0F172A]">Notifications</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[12px] text-[#64748B]">{notifs.length} items</span>
          <span className="text-[12px] font-semibold text-[#1B4F8B] bg-[#EBF0F7] h-5 px-2 rounded-full">
            {notifs.filter((n) => n.status === "Unread").length} unread
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {notifs.map((n) => {
          const pc = priorityConfig[n.priority];
          const sc = statusConfig[n.status];
          const isUnread = n.status === "Unread";
          return (
            <div
              key={n.id}
              className={`flex items-start gap-4 p-4 rounded-xl border transition-colors ${
                isUnread ? "border-[#1B4F8B]/20 bg-[#EBF0F7]/30" : "border-[#E2E8F0] hover:bg-[#F8FAFC]"
              }`}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: pc.bg, color: pc.text }}
              >
                {typeIconMap[n.type] || <Bell size={16} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[13px] font-bold text-[#0F172A]">{n.type}</span>
                  <span className="inline-flex items-center gap-1 h-4 px-1.5 rounded text-[10px] font-semibold" style={{ backgroundColor: pc.bg, color: pc.text }}>
                    {pc.icon}
                    {n.priority}
                  </span>
                  <span className="inline-flex items-center gap-1 h-4 px-1.5 rounded text-[10px] font-semibold" style={{ backgroundColor: sc.bg, color: sc.text }}>
                    {n.status}
                  </span>
                </div>
                <p className="text-[13px] text-[#334155] leading-relaxed mb-1">{n.message}</p>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-mono text-[#1B4F8B]">{n.awb}</span>
                  <span className="text-[11px] text-[#94A3B8]">{n.time}</span>
                  {n.readAt && (
                    <span className="text-[11px] text-[#94A3B8]">Read: {n.readAt}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                {isUnread && (
                  <button
                    onClick={() => handleMarkRead(n.id)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#1B4F8B] cursor-pointer transition-colors"
                    title="Mark as Read"
                  >
                    <MailOpen size={14} />
                  </button>
                )}
                {n.status === "Action Required" && (
                  <button
                    onClick={() => handleResolve(n.id)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#DCFCE7] text-[#16A34A] cursor-pointer transition-colors"
                    title="Resolve"
                  >
                    <Check size={14} />
                  </button>
                )}
                {n.type === "Payment due" && (
                  <button
                    onClick={() => addToast("Redirecting to payment gateway...", "success")}
                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors"
                    title="Pay Invoice"
                  >
                    <CreditCard size={14} />
                  </button>
                )}
                {n.type === "Documents missing" && (
                  <button
                    onClick={() => addToast("Upload document dialog opened.", "success")}
                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors"
                    title="Upload Document"
                  >
                    <Upload size={14} />
                  </button>
                )}
                {n.type === "Pickup rejected" && (
                  <button
                    onClick={() => addToast("Redirecting to pickup scheduling...", "success")}
                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors"
                    title="Schedule Pickup"
                  >
                    <CalendarCheck size={14} />
                  </button>
                )}
                <button
                  onClick={() => onView(n)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors"
                  title="View Details"
                >
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}