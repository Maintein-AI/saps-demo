"use client";

import { useState } from "react";
import { MoreHorizontal, ChevronDown, ChevronUp } from "lucide-react";
import ScopeBadge from "../../ScopeBadge";
import type { AssetRow } from "./types";

const assetRows: AssetRow[] = [
  { id: "FL-01", assetType: "Forklift", assignedTo: "Sameer Ali", zone: "AFU Zone A", shift: "Night", status: "Active", batteryOrHealth: "82%" },
  { id: "FL-02", assetType: "Forklift", assignedTo: "Faisal Qureshi", zone: "ULD Pit", shift: "Evening", status: "Active", batteryOrHealth: "67%" },
  { id: "FL-03", assetType: "Forklift", assignedTo: "Ahmed Khan", zone: "AFU Zone A", shift: "Morning", status: "Active", batteryOrHealth: "91%" },
  { id: "FL-04", assetType: "Forklift", assignedTo: "—", zone: "—", shift: "—", status: "Charging", batteryOrHealth: "45%" },
  { id: "FL-05", assetType: "Forklift", assignedTo: "Tariq Jameel", zone: "ODC Block", shift: "Morning", status: "Active", batteryOrHealth: "74%" },
  { id: "Handheld-02", assetType: "Handheld", assignedTo: "Sana Iqbal", zone: "GCR Zone", shift: "Morning", status: "Active", batteryOrHealth: "95%" },
  { id: "Handheld-03", assetType: "Handheld", assignedTo: "Maria Asif", zone: "GCR Zone", shift: "Evening", status: "Active", batteryOrHealth: "88%" },
  { id: "Handheld-04", assetType: "Handheld", assignedTo: "Zara Khan", zone: "Cold Room", shift: "Morning", status: "Active", batteryOrHealth: "79%" },
  { id: "Handheld-05", assetType: "Handheld", assignedTo: "—", zone: "—", shift: "—", status: "Idle", batteryOrHealth: "100%" },
  { id: "Handheld-06", assetType: "Handheld", assignedTo: "Nadia Hussain", zone: "AFU Zone B", shift: "Morning", status: "Active", batteryOrHealth: "60%" },
  { id: "Scanner-GE-01", assetType: "Scanner", assignedTo: "Rashid Mehmood", zone: "Gate 01", shift: "Morning", status: "Active", batteryOrHealth: "87%" },
  { id: "Scanner-GE-02", assetType: "Scanner", assignedTo: "Hassan Nawaz", zone: "Gate 02", shift: "Night", status: "Active", batteryOrHealth: "72%" },
  { id: "Laptop-FN-01", assetType: "Laptop", assignedTo: "Farooq Ahmed", zone: "Finance Office", shift: "Night", status: "Active", batteryOrHealth: "Good" },
  { id: "FL-06", assetType: "Forklift", assignedTo: "—", zone: "—", shift: "—", status: "Fault", batteryOrHealth: "Maintenance" },
  { id: "Handheld-07", assetType: "Handheld", assignedTo: "—", zone: "—", shift: "—", status: "Offline", batteryOrHealth: "Replace" },
];

function getStatusStyle(status: string) {
  switch (status) {
    case "Active": return { bg: "#16A34A", text: "white" };
    case "Idle": return { bg: "#3B82F6", text: "white" };
    case "Charging": return { bg: "#F59E0B", text: "white" };
    case "Fault": return { bg: "#DC2626", text: "white" };
    case "Offline": return { bg: "#94A3B8", text: "white" };
    default: return { bg: "#94A3B8", text: "white" };
  }
}

interface AssetAssignmentCardProps {
  filters?: { assetType: string; zone: string };
}

export default function AssetAssignmentCard({ filters }: AssetAssignmentCardProps) {
  const [sortKey, setSortKey] = useState<keyof AssetRow>("assetType");
  const [sortAsc, setSortAsc] = useState(true);

  const filtered = assetRows.filter((row) => {
    if (filters?.assetType && row.assetType !== filters.assetType) return false;
    if (filters?.zone && row.zone !== filters.zone) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    if (aVal < bVal) return sortAsc ? -1 : 1;
    if (aVal > bVal) return sortAsc ? 1 : -1;
    return 0;
  });

  const toggleSort = (key: keyof AssetRow) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const header = (key: keyof AssetRow, label: string) => (
    <th
      className="px-4 py-3 text-left text-[11px] font-bold text-[#64748B] uppercase tracking-wider cursor-pointer select-none hover:text-[#0F172A] transition-colors"
      onClick={() => toggleSort(key)}
    >
      <div className="flex items-center gap-1">
        {label}
        {sortKey === key && (sortAsc ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
      </div>
    </th>
  );

  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-white overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-bold text-[#0F172A]">Asset Assignment</span>
          <ScopeBadge type="inc" />
        </div>
        <span className="text-[12px] text-[#64748B]">{sorted.length} assets</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead className="bg-[#F8FAFC]">
            <tr>
              {header("id", "Asset ID")}
              {header("assetType", "Asset Type")}
              {header("assignedTo", "Assigned To")}
              {header("zone", "Zone")}
              {header("shift", "Shift")}
              {header("status", "Status")}
              {header("batteryOrHealth", "Battery / Health")}
              <th className="px-4 py-3 text-right text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {sorted.map((row) => {
              const statusStyle = getStatusStyle(row.status);
              return (
                <tr key={row.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-4 py-3 text-[#0F172A] font-medium">{row.id}</td>
                  <td className="px-4 py-3 text-[#64748B]">{row.assetType}</td>
                  <td className="px-4 py-3 text-[#0F172A]">{row.assignedTo}</td>
                  <td className="px-4 py-3 text-[#64748B]">{row.zone}</td>
                  <td className="px-4 py-3 text-[#64748B]">{row.shift}</td>
                  <td className="px-4 py-3">
                    <span
                      className="inline-flex items-center h-[22px] px-2.5 rounded-full text-[11px] font-semibold whitespace-nowrap"
                      style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#64748B]">{row.batteryOrHealth}</td>
                  <td className="px-4 py-3 text-right">
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F1F5F9] text-[#64748B] cursor-pointer transition-colors">
                      <MoreHorizontal size={16} />
                    </button>
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