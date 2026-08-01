"use client";

import { useState } from "react";
import { useToast } from "@/components/ToastContext";
import {
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle,
  MessageSquare,
  Gavel,
  Search,
} from "lucide-react";

interface CaseSummary {
  awb: string;
  gd: string;
  channel: "Yellow" | "Red";
  consignee: string;
  cha: string;
  currentStatus: string;
  filedAt: string;
  age: string;
  queryCount: number;
  examStatus: string;
}

const caseSummaries: CaseSummary[] = [
  {
    awb: "214-77890123",
    gd: "2026-KHI-00441",
    channel: "Yellow",
    consignee: "Gerry's Dnata",
    cha: "A.R. Brothers & Co.",
    currentStatus: "Query Raised",
    filedAt: "30 May 2026, 14:30",
    age: "2d 4h",
    queryCount: 2,
    examStatus: "N/A",
  },
  {
    awb: "074-55443322",
    gd: "2026-KHI-00438",
    channel: "Red",
    consignee: "Kuehne+Nagel KHI",
    cha: "MCC Logistics",
    currentStatus: "Exam Scheduled",
    filedAt: "30 May 2026, 09:00",
    age: "1d 9h",
    queryCount: 0,
    examStatus: "Scheduled",
  },
  {
    awb: "117-99887766",
    gd: "2026-KHI-00436",
    channel: "Yellow",
    consignee: "Agility Pakistan",
    cha: "Interport Forwarders",
    currentStatus: "Resolved",
    filedAt: "29 May 2026, 16:00",
    age: "3d 2h",
    queryCount: 1,
    examStatus: "N/A",
  },
  {
    awb: "074-44556677",
    gd: "2026-KHI-00434",
    channel: "Red",
    consignee: "Gerry's Dnata",
    cha: "Speedclear Customs",
    currentStatus: "Examined",
    filedAt: "28 May 2026, 11:00",
    age: "4d 1h",
    queryCount: 0,
    examStatus: "Cleared",
  },
  {
    awb: "157-66778899",
    gd: "2026-KHI-00439",
    channel: "Red",
    consignee: "DB Schenker Pakistan",
    cha: "Speedclear Customs",
    currentStatus: "Pending Reschedule",
    filedAt: "31 May 2026, 08:00",
    age: "1d 4h",
    queryCount: 0,
    examStatus: "Pending Reschedule",
  },
  {
    awb: "214-11223344",
    gd: "2026-KHI-00435",
    channel: "Yellow",
    consignee: "Pakistan Cargo Services",
    cha: "A.R. Brothers & Co.",
    currentStatus: "Query Raised",
    filedAt: "01 Jun 2026, 05:40",
    age: "4h 20m",
    queryCount: 1,
    examStatus: "N/A",
  },
];

const channelConfig = {
  Yellow: { bg: "#FEF3C7", text: "#D97706", icon: <AlertTriangle size={14} /> },
  Red: { bg: "#FEE2E2", text: "#DC2626", icon: <Gavel size={14} /> },
};

const statusConfig: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  "Query Raised": { bg: "#FEF3C7", text: "#D97706", icon: <MessageSquare size={12} /> },
  "Resolved": { bg: "#DCFCE7", text: "#16A34A", icon: <CheckCircle size={12} /> },
  "Exam Scheduled": { bg: "#DBEAFE", text: "#1D4ED8", icon: <Clock size={12} /> },
  "Examined": { bg: "#DCFCE7", text: "#16A34A", icon: <CheckCircle size={12} /> },
  "Pending Reschedule": { bg: "#FEE2E2", text: "#DC2626", icon: <AlertTriangle size={12} /> },
};

interface ChannelCaseSummaryProps {
  onSelectCase: (caseItem: CaseSummary) => void;
}

export default function ChannelCaseSummary({ onSelectCase }: ChannelCaseSummaryProps) {
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = caseSummaries.filter(
    (c) =>
      c.awb.includes(searchTerm) ||
      c.gd.includes(searchTerm) ||
      c.consignee.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.cha.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <h3 className="text-[15px] font-bold text-[#0F172A]">Channel Case Summary</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search AWB, GD, consignee..."
              className="h-9 pl-9 pr-4 rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors w-[260px]"
            />
          </div>
          <span className="text-[12px] text-[#64748B]">{filtered.length} cases</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px] text-left">
          <thead>
            <tr className="border-b border-[#E2E8F0]">
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">AWB #</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">GD #</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Channel</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Consignee</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">CHA</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Current Status</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Filed At</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Age</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Query Count</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Exam Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => {
              const cc = channelConfig[item.channel];
              const sc = statusConfig[item.currentStatus] || { bg: "#F1F5F9", text: "#64748B", icon: <FileText size={12} /> };
              return (
                <tr
                  key={item.awb}
                  className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                  onClick={() => {
                    onSelectCase(item);
                    addToast(`Selected case ${item.awb}`, "success");
                  }}
                >
                  <td className="py-3 px-3 text-[12px] font-mono text-[#1B4F8B]">{item.awb}</td>
                  <td className="py-3 px-3 text-[12px] font-semibold text-[#0F172A] font-mono">{item.gd}</td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 h-5 px-2 rounded-full text-[11px] font-semibold" style={{ backgroundColor: cc.bg, color: cc.text }}>
                      {cc.icon}
                      {item.channel}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-[12px] text-[#64748B]">{item.consignee}</td>
                  <td className="py-3 px-3 text-[12px] text-[#64748B]">{item.cha}</td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 h-5 px-2 rounded-full text-[11px] font-semibold" style={{ backgroundColor: sc.bg, color: sc.text }}>
                      {sc.icon}
                      {item.currentStatus}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-[12px] text-[#64748B]">{item.filedAt}</td>
                  <td className="py-3 px-3 text-[12px] text-[#64748B]">{item.age}</td>
                  <td className="py-3 px-3 text-[12px] font-semibold text-[#0F172A]">{item.queryCount}</td>
                  <td className="py-3 px-3 text-[12px] text-[#64748B]">{item.examStatus}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}