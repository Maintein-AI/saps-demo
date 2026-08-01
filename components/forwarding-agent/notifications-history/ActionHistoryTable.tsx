"use client";

import { useState } from "react";
import {
  Save,
  Upload,
  Send,
  FileCheck,
  CreditCard,
  CalendarCheck,
  Shield,
  Receipt,
  X,
  Check,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { useToast } from "@/components/ToastContext";

interface HistoryItem {
  id: string;
  time: string;
  user: string;
  action: string;
  entityType: string;
  entityId: string;
  awb: string;
  status: "Success" | "Failed" | "Pending";
  remarks: string;
}

const historyItems: HistoryItem[] = [
  {
    id: "HIS-001",
    time: "01 Jun 2026, 09:45",
    user: "Ahmed Raza",
    action: "AWB draft saved",
    entityType: "AWB",
    entityId: "DRAFT-214-45678901",
    awb: "214-45678901",
    status: "Success",
    remarks: "Auto-saved by system",
  },
  {
    id: "HIS-002",
    time: "01 Jun 2026, 09:50",
    user: "Ahmed Raza",
    action: "AWB submitted to SAPS",
    entityType: "AWB",
    entityId: "214-45678901",
    awb: "214-45678901",
    status: "Pending",
    remarks: "Awaiting SAPS validation",
  },
  {
    id: "HIS-003",
    time: "01 Jun 2026, 09:30",
    user: "Imran Ali",
    action: "Document uploaded",
    entityType: "Document",
    entityId: "DOC-001234",
    awb: "117-55443321",
    status: "Success",
    remarks: "Commercial invoice + packing list",
  },
  {
    id: "HIS-004",
    time: "01 Jun 2026, 08:15",
    user: "Bilal Ahmed",
    action: "Authority letter generated",
    entityType: "Authority Letter",
    entityId: "AL-2026-0892",
    awb: "074-88219033",
    status: "Success",
    remarks: "Gate entry approved",
  },
  {
    id: "HIS-005",
    time: "01 Jun 2026, 07:30",
    user: "Nadeem Hussain",
    action: "Pickup slot booked",
    entityType: "Pickup",
    entityId: "PU-2026-002",
    awb: "117-55443321",
    status: "Success",
    remarks: "Vehicle Bay 01, 07:00",
  },
  {
    id: "HIS-006",
    time: "31 May 2026, 18:00",
    user: "Faisal Khan",
    action: "Payment completed",
    entityType: "Invoice",
    entityId: "SAPS-2026-IN-038",
    awb: "117-98765432",
    status: "Success",
    remarks: "PKR 89,200 via gateway",
  },
  {
    id: "HIS-007",
    time: "31 May 2026, 16:45",
    user: "Saad Qureshi",
    action: "DO downloaded",
    entityType: "DO",
    entityId: "DO-90877",
    awb: "214-99887766",
    status: "Success",
    remarks: "Payment cleared",
  },
  {
    id: "HIS-008",
    time: "31 May 2026, 14:20",
    user: "Kamran Khan",
    action: "Gate pre-registration submitted",
    entityType: "Gate Entry",
    entityId: "GER-2026-033",
    awb: "074-55667788",
    status: "Pending",
    remarks: "Awaiting gate officer approval",
  },
  {
    id: "HIS-009",
    time: "31 May 2026, 11:00",
    user: "Javed Iqbal",
    action: "Document uploaded",
    entityType: "Document",
    entityId: "DOC-001235",
    awb: "157-11223344",
    status: "Failed",
    remarks: "File size exceeded 5MB limit",
  },
  {
    id: "HIS-010",
    time: "31 May 2026, 10:30",
    user: "Rashid Mehmood",
    action: "Pickup slot cancelled",
    entityType: "Pickup",
    entityId: "PU-2026-001",
    awb: "214-44556677",
    status: "Success",
    remarks: "Rescheduled to 02 Jun 2026",
  },
  {
    id: "HIS-011",
    time: "31 May 2026, 08:15",
    user: "Kashif Khan",
    action: "AWB submitted to SAPS",
    entityType: "AWB",
    entityId: "117-98765432",
    awb: "117-98765432",
    status: "Success",
    remarks: "Accepted by SAPS",
  },
  {
    id: "HIS-012",
    time: "30 May 2026, 17:00",
    user: "Nadeem Hussain",
    action: "Payment completed",
    entityType: "Invoice",
    entityId: "SAPS-2026-IN-041",
    awb: "157-90811223",
    status: "Success",
    remarks: "PKR 156,400 via bank transfer",
  },
];

const statusConfig: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  Success: { bg: "#DCFCE7", text: "#16A34A", icon: <CheckCircle2 size={12} /> },
  Failed: { bg: "#FEE2E2", text: "#DC2626", icon: <X size={12} /> },
  Pending: { bg: "#FEF3C7", text: "#D97706", icon: <Clock size={12} /> },
};

const actionIconMap: Record<string, React.ReactNode> = {
  "AWB draft saved": <Save size={14} />,
  "AWB submitted to SAPS": <Send size={14} />,
  "Document uploaded": <Upload size={14} />,
  "Authority letter generated": <FileCheck size={14} />,
  "Pickup slot booked": <CalendarCheck size={14} />,
  "Payment completed": <CreditCard size={14} />,
  "DO downloaded": <Shield size={14} />,
  "Gate pre-registration submitted": <Receipt size={14} />,
  "Pickup slot cancelled": <X size={14} />,
};

export default function ActionHistoryTable() {
  const [history, setHistory] = useState(historyItems);
  const { addToast } = useToast();

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <h3 className="text-[15px] font-bold text-[#0F172A]">Action History</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[12px] text-[#64748B]">{history.length} events</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] text-left">
          <thead>
            <tr className="border-b border-[#E2E8F0]">
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Time</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">User</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Action</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Entity Type</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Entity ID</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">AWB #</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Status</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item) => {
              const sc = statusConfig[item.status];
              return (
                <tr key={item.id} className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-3 px-3 text-[12px] text-[#64748B] whitespace-nowrap">{item.time}</td>
                  <td className="py-3 px-3 text-[12px] font-semibold text-[#0F172A]">{item.user}</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-[#EBF0F7] flex items-center justify-center text-[#1B4F8B]">
                        {actionIconMap[item.action] || <Check size={14} />}
                      </div>
                      <span className="text-[12px] text-[#0F172A]">{item.action}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-[12px] text-[#64748B]">{item.entityType}</td>
                  <td className="py-3 px-3 text-[12px] font-mono text-[#64748B]">{item.entityId}</td>
                  <td className="py-3 px-3 text-[12px] font-mono text-[#1B4F8B]">{item.awb}</td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 h-5 px-2 rounded-full text-[11px] font-semibold" style={{ backgroundColor: sc.bg, color: sc.text }}>
                      {sc.icon}
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-[12px] text-[#64748B]">{item.remarks}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}