"use client";

import { useState } from "react";
import {
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  Shield,
  Ban,
  PackageCheck,
  ArrowRight,
  Eye,
  MessageSquare,
  Gavel,
} from "lucide-react";
import { useToast } from "@/components/ToastContext";

interface WorkItem {
  id: string;
  awb: string;
  gd: string;
  channel: "Green" | "Yellow" | "Red";
  consignee: string;
  status: "Filed" | "Under Review" | "Query" | "Exam Scheduled" | "Examined" | "OOC Issued" | "Released";
  age: string;
  cha: string;
}

const workItems: WorkItem[] = [
  {
    id: "CW-001",
    awb: "214-77890123",
    gd: "2026-KHI-00441",
    channel: "Yellow",
    consignee: "Gerry's Dnata",
    status: "Query",
    age: "2d",
    cha: "A.R. Brothers & Co.",
  },
  {
    id: "CW-002",
    awb: "157-66778899",
    gd: "2026-KHI-00439",
    channel: "Green",
    consignee: "DB Schenker Pakistan",
    status: "Released",
    age: "4h",
    cha: "Speedclear Customs",
  },
  {
    id: "CW-003",
    awb: "074-55443322",
    gd: "2026-KHI-00438",
    channel: "Red",
    consignee: "Kuehne+Nagel KHI",
    status: "Exam Scheduled",
    age: "1d",
    cha: "MCC Logistics",
  },
  {
    id: "CW-004",
    awb: "117-99887766",
    gd: "2026-KHI-00436",
    channel: "Yellow",
    consignee: "Agility Pakistan",
    status: "Under Review",
    age: "6h",
    cha: "Interport Forwarders",
  },
  {
    id: "CW-005",
    awb: "214-11223344",
    gd: "2026-KHI-00435",
    channel: "Green",
    consignee: "Pakistan Cargo Services",
    status: "Filed",
    age: "30m",
    cha: "A.R. Brothers & Co.",
  },
  {
    id: "CW-006",
    awb: "074-44556677",
    gd: "2026-KHI-00434",
    channel: "Red",
    consignee: "Gerry's Dnata",
    status: "Examined",
    age: "3d",
    cha: "Speedclear Customs",
  },
  {
    id: "CW-007",
    awb: "157-22334455",
    gd: "2026-KHI-00433",
    channel: "Green",
    consignee: "DB Schenker Pakistan",
    status: "OOC Issued",
    age: "1d",
    cha: "MCC Logistics",
  },
  {
    id: "CW-008",
    awb: "117-55667788",
    gd: "2026-KHI-00432",
    channel: "Yellow",
    consignee: "Kuehne+Nagel KHI",
    status: "Query",
    age: "2d",
    cha: "Interport Forwarders",
  },
];

const statusConfig: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  Filed: { bg: "#F1F5F9", text: "#64748B", icon: <FileText size={12} /> },
  "Under Review": { bg: "#FEF3C7", text: "#D97706", icon: <Clock size={12} /> },
  Query: { bg: "#FEF3C7", text: "#D97706", icon: <MessageSquare size={12} /> },
  "Exam Scheduled": { bg: "#FEE2E2", text: "#DC2626", icon: <Gavel size={12} /> },
  Examined: { bg: "#DBEAFE", text: "#1D4ED8", icon: <Shield size={12} /> },
  "OOC Issued": { bg: "#DCFCE7", text: "#16A34A", icon: <CheckCircle size={12} /> },
  Released: { bg: "#DCFCE7", text: "#16A34A", icon: <PackageCheck size={12} /> },
};

const channelConfig: Record<string, { bg: string; text: string }> = {
  Green: { bg: "#DCFCE7", text: "#16A34A" },
  Yellow: { bg: "#FEF3C7", text: "#D97706" },
  Red: { bg: "#FEE2E2", text: "#DC2626" },
};

interface CustomsWorkQueueProps {
  onViewDetail: (item: WorkItem) => void;
}

export default function CustomsWorkQueue({ onViewDetail }: CustomsWorkQueueProps) {
  const { addToast } = useToast();

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <h3 className="text-[15px] font-bold text-[#0F172A]">Customs Work Queue</h3>
        </div>
        <span className="text-[12px] text-[#64748B]">{workItems.length} items</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left">
          <thead>
            <tr className="border-b border-[#E2E8F0]">
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">AWB #</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">GD #</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Channel</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Consignee</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Current Status</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Age</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody>
            {workItems.map((item) => {
              const sc = statusConfig[item.status];
              const cc = channelConfig[item.channel];
              return (
                <tr key={item.id} className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-3 px-3 text-[12px] font-mono text-[#1B4F8B]">{item.awb}</td>
                  <td className="py-3 px-3 text-[12px] font-semibold text-[#0F172A] font-mono">{item.gd}</td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center h-5 px-2 rounded-full text-[11px] font-semibold" style={{ backgroundColor: cc.bg, color: cc.text }}>
                      {item.channel}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-[12px] text-[#64748B]">{item.consignee}</td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 h-5 px-2 rounded-full text-[11px] font-semibold" style={{ backgroundColor: sc.bg, color: sc.text }}>
                      {sc.icon}
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-[12px] text-[#64748B]">{item.age}</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onViewDetail(item)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors"
                        title="View Details"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => addToast(`GD ${item.gd} tracking opened.`, "success")}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors"
                        title="Track OOC"
                      >
                        <ArrowRight size={14} />
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