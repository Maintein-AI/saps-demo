"use client";

import { useState } from "react";
import { MoreHorizontal, ChevronDown, ChevronUp, Eye, Calendar } from "lucide-react";
import ScopeBadge from "../../ScopeBadge";
import type { FlightForecast } from "./types";

const sampleFlights: FlightForecast[] = [
  { id: "F-001", flightNumber: "EK604", airline: "Emirates", eta: "31 May 2026 09:15", origin: "DXB", expectedAwbs: 18, expectedPieces: 420, expectedWeight: 7800, cargoClasses: ["AFU", "GCR", "PER"], messageSource: ["FFM", "FWB"], messageStatus: "Complete" },
  { id: "F-002", flightNumber: "QR610", airline: "Qatar Airways", eta: "31 May 2026 11:25", origin: "DOH", expectedAwbs: 12, expectedPieces: 260, expectedWeight: 4200, cargoClasses: ["PER", "VAL"], messageSource: ["FFM"], messageStatus: "FWB Pending" },
  { id: "F-003", flightNumber: "TK708", airline: "Turkish Cargo", eta: "31 May 2026 13:40", origin: "IST", expectedAwbs: 9, expectedPieces: 180, expectedWeight: 3600, cargoClasses: ["GCR", "DGR"], messageSource: ["FFM", "FHL"], messageStatus: "Complete" },
  { id: "F-004", flightNumber: "SV703", airline: "Saudi Cargo", eta: "31 May 2026 14:55", origin: "JED", expectedAwbs: 15, expectedPieces: 310, expectedWeight: 5800, cargoClasses: ["GCR", "AFU", "UAB"], messageSource: ["FFM"], messageStatus: "FHL Pending" },
  { id: "F-005", flightNumber: "PK308", airline: "PIA", eta: "31 May 2026 16:10", origin: "KHI", expectedAwbs: 8, expectedPieces: 150, expectedWeight: 2800, cargoClasses: ["GCR", "VAL"], messageSource: ["SITA", "FWB"], messageStatus: "Complete" },
  { id: "F-006", flightNumber: "PA410", airline: "AirBlue", eta: "31 May 2026 17:30", origin: "LHE", expectedAwbs: 6, expectedPieces: 90, expectedWeight: 1600, cargoClasses: ["GCR", "ICG"], messageSource: ["Email"], messageStatus: "Partial" },
  { id: "F-007", flightNumber: "FZ348", airline: "FlyDubai", eta: "31 May 2026 18:45", origin: "DXB", expectedAwbs: 11, expectedPieces: 240, expectedWeight: 4400, cargoClasses: ["GCR", "AFU"], messageSource: ["FFM", "FWB"], messageStatus: "Complete" },
  { id: "F-008", flightNumber: "EK606", airline: "Emirates", eta: "31 May 2026 20:00", origin: "DXB", expectedAwbs: 22, expectedPieces: 520, expectedWeight: 9200, cargoClasses: ["AFU", "GCR", "PER", "VAL"], messageSource: ["FFM"], messageStatus: "FWB Pending" },
  { id: "F-009", flightNumber: "QR612", airline: "Qatar Airways", eta: "31 May 2026 21:15", origin: "DOH", expectedAwbs: 10, expectedPieces: 210, expectedWeight: 3800, cargoClasses: ["GCR", "DGR"], messageSource: ["FFM", "FHL", "FWB"], messageStatus: "Complete" },
  { id: "F-010", flightNumber: "TK712", airline: "Turkish Cargo", eta: "31 May 2026 22:30", origin: "IST", expectedAwbs: 7, expectedPieces: 140, expectedWeight: 2600, cargoClasses: ["GCR", "PER"], messageSource: ["FFM"], messageStatus: "FFM Missing" },
  { id: "F-011", flightNumber: "SV705", airline: "Saudi Cargo", eta: "31 May 2026 23:45", origin: "RUH", expectedAwbs: 13, expectedPieces: 280, expectedWeight: 5200, cargoClasses: ["GCR", "AFU", "UAB"], messageSource: ["FWB"], messageStatus: "Partial" },
  { id: "F-012", flightNumber: "PK312", airline: "PIA", eta: "01 Jun 2026 01:00", origin: "KHI", expectedAwbs: 5, expectedPieces: 80, expectedWeight: 1400, cargoClasses: ["GCR"], messageSource: ["FFM", "FWB"], messageStatus: "Complete" },
];

function getStatusStyle(status: string) {
  switch (status) {
    case "Complete": return { bg: "#16A34A", text: "white" };
    case "FWB Pending": return { bg: "#F59E0B", text: "white" };
    case "FHL Pending": return { bg: "#3B82F6", text: "white" };
    case "FFM Missing": return { bg: "#DC2626", text: "white" };
    case "Partial": return { bg: "#8B5CF6", text: "white" };
    default: return { bg: "#94A3B8", text: "white" };
  }
}

interface InboundFlightsTableProps {
  filters?: { airline: string; originAirport: string; flightNumber: string; cargoClass: string; messageSource: string };
  onViewDetail: (flight: FlightForecast) => void;
}

export default function InboundFlightsTable({ filters, onViewDetail }: InboundFlightsTableProps) {
  const [sortKey, setSortKey] = useState<keyof FlightForecast>("eta");
  const [sortAsc, setSortAsc] = useState(true);

  const filtered = sampleFlights.filter((row) => {
    if (filters?.airline && row.airline !== filters.airline) return false;
    if (filters?.originAirport && row.origin !== filters.originAirport) return false;
    if (filters?.flightNumber && !row.flightNumber.toLowerCase().includes(filters.flightNumber.toLowerCase())) return false;
    if (filters?.cargoClass && !row.cargoClasses.includes(filters.cargoClass)) return false;
    if (filters?.messageSource && !row.messageSource.includes(filters.messageSource)) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    if (aVal < bVal) return sortAsc ? -1 : 1;
    if (aVal > bVal) return sortAsc ? 1 : -1;
    return 0;
  });

  const toggleSort = (key: keyof FlightForecast) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const header = (key: keyof FlightForecast, label: string) => (
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
          <span className="text-[13px] font-bold text-[#0F172A]">Inbound Flight Forecast</span>
          <ScopeBadge type="inc" />
        </div>
        <span className="text-[12px] text-[#64748B]">{sorted.length} flights</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead className="bg-[#F8FAFC]">
            <tr>
              {header("flightNumber", "Flight #")}
              {header("airline", "Airline")}
              {header("eta", "ETA")}
              {header("origin", "Origin")}
              {header("expectedAwbs", "Exp. AWBs")}
              {header("expectedPieces", "Exp. Pieces")}
              {header("expectedWeight", "Exp. Weight")}
              <th className="px-4 py-3 text-left text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Cargo Classes</th>
              <th className="px-4 py-3 text-left text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Message Source</th>
              {header("messageStatus", "Status")}
              <th className="px-4 py-3 text-right text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {sorted.map((row) => {
              const statusStyle = getStatusStyle(row.messageStatus);
              return (
                <tr key={row.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-4 py-3 text-[#0F172A] font-bold">{row.flightNumber}</td>
                  <td className="px-4 py-3 text-[#0F172A]">{row.airline}</td>
                  <td className="px-4 py-3 text-[#64748B]">{row.eta}</td>
                  <td className="px-4 py-3 text-[#64748B] font-medium">{row.origin}</td>
                  <td className="px-4 py-3 text-[#0F172A] font-medium">{row.expectedAwbs}</td>
                  <td className="px-4 py-3 text-[#0F172A] font-medium">{row.expectedPieces.toLocaleString()}</td>
                  <td className="px-4 py-3 text-[#64748B]">{row.expectedWeight.toLocaleString()} kg</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {row.cargoClasses.map((cls) => (
                        <span key={cls} className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#F1F5F9] text-[#64748B]">
                          {cls}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {row.messageSource.map((src) => (
                        <span key={src} className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#EBF0F7] text-[#1B4F8B]">
                          {src}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="inline-flex items-center h-[22px] px-2.5 rounded-full text-[11px] font-semibold whitespace-nowrap"
                      style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}
                    >
                      {row.messageStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onViewDetail(row)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F1F5F9] text-[#1B4F8B] cursor-pointer transition-colors"
                        title="View Detail"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F1F5F9] text-[#16A34A] cursor-pointer transition-colors"
                        title="Open Slot Planner"
                      >
                        <Calendar size={16} />
                      </button>
                      <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F1F5F9] text-[#64748B] cursor-pointer transition-colors">
                        <MoreHorizontal size={16} />
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