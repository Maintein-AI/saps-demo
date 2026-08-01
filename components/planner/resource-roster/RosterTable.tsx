"use client";

import { useState } from "react";
import { MoreHorizontal, ChevronDown, ChevronUp } from "lucide-react";
import type { RosterRow } from "./types";

const sampleRows: RosterRow[] = [
  { id: "R-001", shift: "Morning", operator: "Ahmed Khan", role: "Lifter Operator", assignedZone: "AFU Zone A", assignedAsset: "FL-03", availability: "Available", taskCount: 8, supervisor: "Imran Ali", remarks: "—" },
  { id: "R-002", shift: "Morning", operator: "Sana Iqbal", role: "Warehouse Associate", assignedZone: "GCR Zone", assignedAsset: "Handheld-02", availability: "Busy", taskCount: 12, supervisor: "Imran Ali", remarks: "High workload" },
  { id: "R-003", shift: "Morning", operator: "Rashid Mehmood", role: "Gate Guard", assignedZone: "Gate 01", assignedAsset: "Scanner-GE-01", availability: "Available", taskCount: 5, supervisor: "Imran Ali", remarks: "—" },
  { id: "R-004", shift: "Morning", operator: "Zara Khan", role: "Compliance Officer", assignedZone: "Cold Room", assignedAsset: "Handheld-04", availability: "Busy", taskCount: 9, supervisor: "Imran Ali", remarks: "—" },
  { id: "R-005", shift: "Morning", operator: "Tariq Jameel", role: "Lifter Operator", assignedZone: "ODC Block", assignedAsset: "FL-05", availability: "Available", taskCount: 6, supervisor: "Imran Ali", remarks: "—" },
  { id: "R-006", shift: "Morning", operator: "Nadia Hussain", role: "Warehouse Associate", assignedZone: "AFU Zone B", assignedAsset: "Handheld-06", availability: "On Break", taskCount: 0, supervisor: "Imran Ali", remarks: "Lunch break" },
  { id: "R-007", shift: "Evening", operator: "Bilal Raza", role: "Gate Guard", assignedZone: "Gate 01", assignedAsset: "Scanner-GE-01", availability: "Available", taskCount: 5, supervisor: "Nadeem Shah", remarks: "—" },
  { id: "R-008", shift: "Evening", operator: "Faisal Qureshi", role: "Lifter Operator", assignedZone: "ULD Pit", assignedAsset: "FL-02", availability: "Busy", taskCount: 11, supervisor: "Nadeem Shah", remarks: "—" },
  { id: "R-009", shift: "Evening", operator: "Maria Asif", role: "Warehouse Associate", assignedZone: "GCR Zone", assignedAsset: "Handheld-03", availability: "Available", taskCount: 7, supervisor: "Nadeem Shah", remarks: "—" },
  { id: "R-010", shift: "Evening", operator: "Kamran Butt", role: "Supervisor", assignedZone: "All Zones", assignedAsset: "—", availability: "Busy", taskCount: 14, supervisor: "Nadeem Shah", remarks: "Floor walk" },
  { id: "R-011", shift: "Night", operator: "Sameer Ali", role: "Lifter Operator", assignedZone: "AFU Zone A", assignedAsset: "FL-01", availability: "Available", taskCount: 4, supervisor: "Farhan Ahmed", remarks: "—" },
  { id: "R-012", shift: "Night", operator: "Aisha Tariq", role: "Warehouse Associate", assignedZone: "Cold Room", assignedAsset: "Handheld-05", availability: "Off", taskCount: 0, supervisor: "Farhan Ahmed", remarks: "Sick leave" },
  { id: "R-013", shift: "Night", operator: "Hassan Nawaz", role: "Gate Guard", assignedZone: "Gate 02", assignedAsset: "Scanner-GE-02", availability: "Available", taskCount: 3, supervisor: "Farhan Ahmed", remarks: "—" },
  { id: "R-014", shift: "Night", operator: "Farooq Ahmed", role: "Finance User", assignedZone: "Finance Office", assignedAsset: "Laptop-FN-01", availability: "Busy", taskCount: 6, supervisor: "Farhan Ahmed", remarks: "—" },
  { id: "R-015", shift: "Morning", operator: "Imran Ali", role: "Supervisor", assignedZone: "All Zones", assignedAsset: "—", availability: "Busy", taskCount: 18, supervisor: "Imran Ali", remarks: "Shift lead" },
];

function getAvailabilityStyle(avail: string) {
  switch (avail) {
    case "Available": return { bg: "#16A34A", text: "white" };
    case "Busy": return { bg: "#F59E0B", text: "white" };
    case "Off": return { bg: "#94A3B8", text: "white" };
    case "On Break": return { bg: "#3B82F6", text: "white" };
    default: return { bg: "#94A3B8", text: "white" };
  }
}

interface RosterTableProps {
  filters?: { role: string; zone: string; shift: string; availability: string; supervisor: string };
}

export default function RosterTable({ filters }: RosterTableProps) {
  const [sortKey, setSortKey] = useState<keyof RosterRow>("shift");
  const [sortAsc, setSortAsc] = useState(true);

  const filtered = sampleRows.filter((row) => {
    if (filters?.role && row.role !== filters.role) return false;
    if (filters?.zone && row.assignedZone !== filters.zone) return false;
    if (filters?.shift && row.shift !== filters.shift) return false;
    if (filters?.availability && row.availability !== filters.availability) return false;
    if (filters?.supervisor && row.supervisor !== filters.supervisor) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    if (aVal < bVal) return sortAsc ? -1 : 1;
    if (aVal > bVal) return sortAsc ? 1 : -1;
    return 0;
  });

  const toggleSort = (key: keyof RosterRow) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const header = (key: keyof RosterRow, label: string) => (
    <th
      className="px-4 py-3 text-left text-[11px] font-bold text-[#64748B] uppercase tracking-wider cursor-pointer select-none hover:text-[#0F172A] transition-colors"
      onClick={() => toggleSort(key)}
    >
      <div className="flex items-center gap-1">
        {label}
        {sortKey === key && (
          sortAsc ? <ChevronUp size={12} /> : <ChevronDown size={12} />
        )}
      </div>
    </th>
  );

  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-white overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-bold text-[#0F172A]">Shift Resource Roster</span>
        </div>
        <span className="text-[12px] text-[#64748B]">{sorted.length} records</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead className="bg-[#F8FAFC]">
            <tr>
              {header("shift", "Shift")}
              {header("operator", "Operator")}
              {header("role", "Role")}
              {header("assignedZone", "Assigned Zone")}
              {header("assignedAsset", "Assigned Asset")}
              {header("availability", "Availability")}
              {header("taskCount", "Task Count")}
              {header("supervisor", "Supervisor")}
              {header("remarks", "Remarks")}
              <th className="px-4 py-3 text-right text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {sorted.map((row) => {
              const availStyle = getAvailabilityStyle(row.availability);
              return (
                <tr key={row.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-4 py-3 text-[#0F172A] font-medium">{row.shift}</td>
                  <td className="px-4 py-3 text-[#0F172A]">{row.operator}</td>
                  <td className="px-4 py-3 text-[#64748B]">{row.role}</td>
                  <td className="px-4 py-3 text-[#64748B]">{row.assignedZone}</td>
                  <td className="px-4 py-3 text-[#64748B]">{row.assignedAsset}</td>
                  <td className="px-4 py-3">
                    <span
                      className="inline-flex items-center h-[22px] px-2.5 rounded-full text-[11px] font-semibold whitespace-nowrap"
                      style={{ backgroundColor: availStyle.bg, color: availStyle.text }}
                    >
                      {row.availability}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#0F172A] font-medium">{row.taskCount}</td>
                  <td className="px-4 py-3 text-[#64748B]">{row.supervisor}</td>
                  <td className="px-4 py-3 text-[#64748B] italic">{row.remarks}</td>
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