"use client";

import { useState } from "react";
import ScopeBadge from "@/components/ScopeBadge";
import { CheckCircle2, XCircle, AlertTriangle, Clock, ScanLine } from "lucide-react";

interface PickItem {
  id: string;
  location: string;
  rfid: string;
  class: string;
  weight: string;
  status: string;
  remarks: string;
  checked: boolean;
}

interface PickListTableProps {
  pickList: PickItem[];
  onScan: (pieceId: string) => void;
  onHold: (pieceId: string) => void;
}

export default function PickListTable({ pickList, onScan, onHold }: PickListTableProps) {
  const [sortKey, setSortKey] = useState<string>("id");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [searchTerm, setSearchTerm] = useState("");

  const handleSort = (key: string) => {
    setSortKey(key);
    setSortDir(sortKey === key && sortDir === "asc" ? "desc" : "asc");
  };

  const filtered = pickList.filter(p =>
    p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.rfid.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    const aVal = a[sortKey as keyof PickItem] as string;
    const bVal = b[sortKey as keyof PickItem] as string;
    return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
  });

  const statusConfig: Record<string, { bg: string; border: string; text: string; icon: React.ReactNode }> = {
    Scanned: {
      bg: "#F0FDF4",
      border: "#16A34A",
      text: "#16A34A",
      icon: <CheckCircle2 size={14} className="text-[#16A34A]" />,
    },
    Mismatch: {
      bg: "#FEF2F2",
      border: "#DC2626",
      text: "#DC2626",
      icon: <XCircle size={14} className="text-[#DC2626]" />,
    },
    Held: {
      bg: "#FEF3C7",
      border: "#D97706",
      text: "#D97706",
      icon: <AlertTriangle size={14} className="text-[#D97706]" />,
    },
    Pending: {
      bg: "white",
      border: "#E2E8F0",
      text: "#64748B",
      icon: <Clock size={14} className="text-[#94A3B8]" />,
    },
  };

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
      <div className="p-6 pb-2">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-[18px] font-semibold text-[#0F172A] leading-[28px]">Pick List</h2>
            <ScopeBadge type="inc" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[12px] text-[#64748B]">
              {filtered.filter(p => p.status === "Scanned").length} / {filtered.length} scanned
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-2 h-9 px-3 rounded-lg border border-[#E2E8F0] bg-white flex-1">
            <ScanLine size={14} className="text-[#94A3B8]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search piece ID, location, or RFID..."
              className="flex-1 text-[13px] font-medium text-[#0F172A] bg-transparent outline-none placeholder:text-[#94A3B8]"
            />
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-white">
              {[
                { key: "id", label: "Piece ID" },
                { key: "location", label: "Location" },
                { key: "rfid", label: "RFID" },
                { key: "class", label: "Class" },
                { key: "weight", label: "Weight" },
                { key: "status", label: "Status" },
                { key: "scan", label: "Scan" },
                { key: "remarks", label: "Remarks" },
              ].map((col) => (
                <th
                  key={col.key}
                  className="text-left text-[11px] font-bold uppercase tracking-wider px-4 py-3 whitespace-nowrap cursor-pointer select-none"
                  style={{ color: "#0B2545" }}
                  onClick={() => col.key !== "scan" && col.key !== "remarks" && handleSort(col.key)}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, index) => {
              const config = statusConfig[row.status] || statusConfig.Pending;
              return (
                <tr
                  key={row.id}
                  className="border-b border-[#E2E8F0] last:border-b-0 transition-colors hover:bg-[#F1F5F9]"
                  style={{ backgroundColor: index % 2 === 1 ? "#F8FAFC" : "white" }}
                >
                  <td className="px-4 py-3 text-[13px] font-semibold text-[#0F172A]">{row.id}</td>
                  <td className="px-4 py-3 text-[13px] text-[#0F172A]">{row.location}</td>
                  <td className="px-4 py-3 text-[13px] font-mono text-[#64748B]">{row.rfid}</td>
                  <td className="px-4 py-3 text-[13px] text-[#0F172A]">{row.class}</td>
                  <td className="px-4 py-3 text-[13px] text-[#0F172A]">{row.weight}</td>
                  <td className="px-4 py-3">
                    <span
                      className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full text-[11px] font-semibold"
                      style={{ backgroundColor: config.bg, color: config.text, border: `1px solid ${config.border}` }}
                    >
                      {config.icon}
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {row.status === "Pending" && (
                      <button
                        onClick={() => onScan(row.id)}
                        className="flex items-center gap-1.5 h-7 px-3 rounded-lg text-[12px] font-semibold border border-[#1B4F8B]/30 text-[#1B4F8B] hover:bg-[#1B4F8B]/5 cursor-pointer transition-colors whitespace-nowrap"
                      >
                        <ScanLine size={12} />
                        Scan
                      </button>
                    )}
                    {row.status === "Scanned" && (
                      <CheckCircle2 size={18} className="text-[#16A34A]" />
                    )}
                    {row.status === "Mismatch" && (
                      <div className="flex items-center gap-1">
                        <XCircle size={14} className="text-[#DC2626]" />
                        <span className="text-[12px] font-semibold text-[#DC2626]">Mismatch</span>
                      </div>
                    )}
                    {row.status === "Held" && (
                      <AlertTriangle size={14} className="text-[#D97706]" />
                    )}
                  </td>
                  <td className="px-4 py-3 text-[12px] text-[#DC2626]">{row.remarks}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}