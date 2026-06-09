"use client";

import ScopeBadge from "@/components/ScopeBadge";
import DataTable from "@/components/DataTable";
import { useToast } from "@/components/ToastContext";
import { Eye, CheckCircle, FilePlus, Download } from "lucide-react";

interface AnomalyTableProps {
  onAcknowledge: (id: string) => void;
  onCreateCDR: (id: string) => void;
}

const anomalyStatusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  "Active": { bg: "#FEE2E2", text: "#DC2626", dot: "#DC2626" },
  "Acknowledged": { bg: "#FEF3C7", text: "#D97706", dot: "#D97706" },
  "Resolved": { bg: "#DCFCE7", text: "#16A34A", dot: "#16A34A" },
  "Closed": { bg: "#F1F5F9", text: "#64748B", dot: "#94A3B8" },
};

function AnomalyStatusBadge({ status }: { status: string }) {
  const c = anomalyStatusConfig[status] || { bg: "#F1F5F9", text: "#64748B", dot: "#94A3B8" };
  return (
    <span
      className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full text-[11px] font-semibold"
      style={{ backgroundColor: c.bg, color: c.text }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c.dot }} />
      {status}
    </span>
  );
}

const columns = [
  { key: "id", header: "Anomaly ID", width: "120px", sortable: true },
  { key: "regime", header: "Regime", width: "70px", sortable: true },
  { key: "sensor", header: "Sensor", width: "100px", sortable: true },
  { key: "temp", header: "Temperature", width: "100px", sortable: true },
  { key: "threshold", header: "Threshold", width: "100px", sortable: true },
  { key: "started", header: "Started At", width: "140px", sortable: true },
  { key: "duration", header: "Duration", width: "90px", sortable: true },
  { key: "awbs", header: "AWBs Impacted", width: "110px", sortable: true },
  { key: "status", header: "Status", width: "100px", sortable: true },
  { key: "action", header: "Action", width: "80px" },
];

const rows = [
  { id: "ANM-2026-0041", regime: "COL", sensor: "S-COL-02", temp: "+9.4°C", threshold: "+2 to +8°C", started: "31 May 2026 10:15", duration: "45m", awbs: "3", status: "Active" },
  { id: "ANM-2026-0042", regime: "FRO", sensor: "S-FRO-01", temp: "-14.2°C", threshold: "-20 to -15°C", started: "31 May 2026 09:40", duration: "1h 20m", awbs: "2", status: "Acknowledged" },
  { id: "ANM-2026-0043", regime: "COL", sensor: "S-COL-03", temp: "+1.8°C", threshold: "+2 to +8°C", started: "31 May 2026 08:25", duration: "2h 35m", awbs: "1", status: "Resolved" },
  { id: "ANM-2026-0044", regime: "CRT", sensor: "S-CRT-01", temp: "+9.1°C", threshold: "+2 to +8°C", started: "31 May 2026 07:50", duration: "3h 10m", awbs: "4", status: "Closed" },
  { id: "ANM-2026-0045", regime: "COL", sensor: "S-COL-01", temp: "+8.5°C", threshold: "+2 to +8°C", started: "31 May 2026 11:00", duration: "20m", awbs: "2", status: "Active" },
  { id: "ANM-2026-0046", regime: "FRO", sensor: "S-FRO-02", temp: "-13.8°C", threshold: "-20 to -15°C", started: "31 May 2026 06:30", duration: "4h 30m", awbs: "1", status: "Acknowledged" },
  { id: "ANM-2026-0047", regime: "ERT", sensor: "S-ERT-01", temp: "+26.7°C", threshold: "+15 to +25°C", started: "31 May 2026 10:45", duration: "35m", awbs: "2", status: "Active" },
  { id: "ANM-2026-0048", regime: "COL", sensor: "S-COL-02", temp: "+1.5°C", threshold: "+2 to +8°C", started: "31 May 2026 09:10", duration: "1h 50m", awbs: "3", status: "Resolved" },
];

export default function AnomalyTable({ onAcknowledge, onCreateCDR }: AnomalyTableProps) {
  const { addToast } = useToast();

  const tableRows = rows.map((r) => ({
    id: <span className="text-[13px] font-semibold text-[#0B2545] font-mono">{r.id}</span>,
    regime: (
      <span className="inline-flex items-center h-5 px-2 rounded text-[11px] font-semibold bg-[#EBF0F7] text-[#0B2545]">
        {r.regime}
      </span>
    ),
    sensor: <span className="text-[13px] font-mono text-[#0F172A]">{r.sensor}</span>,
    temp: (
      <span className="text-[13px] font-medium" style={{ color: r.status === "Active" ? "#DC2626" : "#0F172A" }}>
        {r.temp}
      </span>
    ),
    threshold: <span className="text-[13px] text-[#64748B]">{r.threshold}</span>,
    started: <span className="text-[13px] text-[#64748B]">{r.started}</span>,
    duration: <span className="text-[13px] text-[#0F172A]">{r.duration}</span>,
    awbs: <span className="text-[13px] text-[#0F172A]">{r.awbs}</span>,
    status: <AnomalyStatusBadge status={r.status} />,
    action: <span className="text-[13px] text-[#1B4F8B] font-medium">View</span>,
  }));

  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-white overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-[#E2E8F0]">
        <h2 className="text-[16px] font-bold text-[#0F172A]">Temperature Anomalies</h2>
        <ScopeBadge type="inc" />
        <span className="ml-auto text-[12px] text-[#64748B]">{rows.length} records</span>
      </div>
      <div className="p-4">
        <DataTable
          columns={columns}
          rows={tableRows}
          zebra
          sortable
          rowActions={(_row, index) => {
            const rowData = rows[index];
            return (
              <div className="flex flex-col">
                <button
                  onClick={() => addToast("Viewing anomaly " + rowData.id, "success")}
                  className="flex items-center gap-2 px-3 py-2 text-[12px] text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer text-left transition-colors"
                >
                  <Eye size={14} className="text-[#1B4F8B]" />
                  View AWB
                </button>
                {rowData.status === "Active" && (
                  <button
                    onClick={() => onAcknowledge(rowData.id)}
                    className="flex items-center gap-2 px-3 py-2 text-[12px] text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer text-left transition-colors"
                  >
                    <CheckCircle size={14} className="text-[#16A34A]" />
                    Acknowledge
                  </button>
                )}
                <button
                  onClick={() => onCreateCDR(rowData.id)}
                  className="flex items-center gap-2 px-3 py-2 text-[12px] text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer text-left transition-colors"
                >
                  <FilePlus size={14} className="text-[#DC2626]" />
                  Create CDR
                </button>
                <button
                  onClick={() => addToast("Exported log for " + rowData.id, "success")}
                  className="flex items-center gap-2 px-3 py-2 text-[12px] text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer text-left transition-colors"
                >
                  <Download size={14} className="text-[#1B4F8B]" />
                  Export Log
                </button>
              </div>
            );
          }}
        />
      </div>
    </div>
  );
}