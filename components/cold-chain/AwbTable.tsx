"use client";

import ScopeBadge from "@/components/ScopeBadge";
import DataTable from "@/components/DataTable";
import { ExternalLink } from "lucide-react";

const tempStatusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  "Within Range": { bg: "#DCFCE7", text: "#16A34A", dot: "#16A34A" },
  "Near Threshold": { bg: "#FEF3C7", text: "#D97706", dot: "#D97706" },
  "Anomaly": { bg: "#FEE2E2", text: "#DC2626", dot: "#DC2626" },
};

function TempStatusBadge({ status }: { status: string }) {
  const c = tempStatusConfig[status] || { bg: "#F1F5F9", text: "#64748B", dot: "#94A3B8" };
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
  { key: "awb", header: "AWB #", width: "130px", sortable: true },
  { key: "hawb", header: "HAWB #", width: "130px", sortable: true },
  { key: "cargoClass", header: "Cargo Class", width: "100px", sortable: true },
  { key: "shc", header: "SHC", width: "80px", sortable: true },
  { key: "regime", header: "Regime", width: "80px", sortable: true },
  { key: "pieces", header: "Pieces", width: "70px", sortable: true },
  { key: "weight", header: "Weight", width: "90px", sortable: true },
  { key: "location", header: "Stored Location", width: "130px", sortable: true },
  { key: "time", header: "Time in Storage", width: "120px", sortable: true },
  { key: "tempStatus", header: "Temp Status", width: "120px", sortable: true },
  { key: "action", header: "Action", width: "80px" },
];

const rows = [
  { awb: "214-45678901", hawb: "HAWB-214-001", cargoClass: "Pharma", shc: "PER", regime: "COL", pieces: "12", weight: "342 kg", location: "COL-R01-L1", time: "6h 12m", tempStatus: "Within Range" },
  { awb: "157-90811223", hawb: "HAWB-157-001", cargoClass: "Perishable", shc: "PER", regime: "COL", pieces: "8", weight: "210 kg", location: "COL-R02-L1", time: "4h 35m", tempStatus: "Within Range" },
  { awb: "074-88219033", hawb: "HAWB-074-001", cargoClass: "Pharma", shc: "COL", regime: "COL", pieces: "6", weight: "156 kg", location: "COL-R01-L2", time: "3h 20m", tempStatus: "Near Threshold" },
  { awb: "382-11100222", hawb: "HAWB-382-001", cargoClass: "Perishable", shc: "PER", regime: "CRT", pieces: "14", weight: "425 kg", location: "CRT-R01-L1", time: "8h 05m", tempStatus: "Within Range" },
  { awb: "214-45678901", hawb: "HAWB-214-002", cargoClass: "Pharma", shc: "CRT", regime: "CRT", pieces: "5", weight: "98 kg", location: "CRT-R02-L1", time: "5h 40m", tempStatus: "Within Range" },
  { awb: "157-90811223", hawb: "HAWB-157-002", cargoClass: "Perishable", shc: "FRO", regime: "FRO", pieces: "3", weight: "72 kg", location: "FRO-R01-L1", time: "2h 15m", tempStatus: "Within Range" },
  { awb: "074-88219033", hawb: "HAWB-074-002", cargoClass: "Frozen", shc: "FRO", regime: "FRO", pieces: "7", weight: "198 kg", location: "FRO-R01-L2", time: "7h 30m", tempStatus: "Anomaly" },
  { awb: "382-11100222", hawb: "HAWB-382-002", cargoClass: "Pharma", shc: "ERT", regime: "ERT", pieces: "10", weight: "280 kg", location: "ERT-R01-L1", time: "1h 50m", tempStatus: "Within Range" },
  { awb: "214-45678901", hawb: "HAWB-214-003", cargoClass: "Perishable", shc: "PER", regime: "COL", pieces: "9", weight: "265 kg", location: "COL-R03-L1", time: "9h 10m", tempStatus: "Within Range" },
  { awb: "157-90811223", hawb: "HAWB-157-003", cargoClass: "Pharma", shc: "CRT", regime: "CRT", pieces: "4", weight: "88 kg", location: "CRT-R03-L1", time: "6h 45m", tempStatus: "Within Range" },
  { awb: "074-88219033", hawb: "HAWB-074-003", cargoClass: "Frozen", shc: "FRO", regime: "FRO", pieces: "6", weight: "175 kg", location: "FRO-R02-L1", time: "4h 20m", tempStatus: "Within Range" },
  { awb: "382-11100222", hawb: "HAWB-382-003", cargoClass: "Perishable", shc: "PER", regime: "COL", pieces: "11", weight: "310 kg", location: "COL-R02-L2", time: "5h 55m", tempStatus: "Near Threshold" },
  { awb: "214-45678901", hawb: "HAWB-214-004", cargoClass: "Pharma", shc: "ERT", regime: "ERT", pieces: "8", weight: "225 kg", location: "ERT-R02-L1", time: "3h 40m", tempStatus: "Within Range" },
  { awb: "157-90811223", hawb: "HAWB-157-004", cargoClass: "Perishable", shc: "PER", regime: "COL", pieces: "13", weight: "390 kg", location: "COL-R04-L1", time: "10h 25m", tempStatus: "Within Range" },
  { awb: "074-88219033", hawb: "HAWB-074-004", cargoClass: "Pharma", shc: "CRT", regime: "CRT", pieces: "7", weight: "195 kg", location: "CRT-R04-L1", time: "7h 15m", tempStatus: "Within Range" },
  { awb: "382-11100222", hawb: "HAWB-382-004", cargoClass: "Frozen", shc: "FRO", regime: "FRO", pieces: "4", weight: "105 kg", location: "FRO-R03-L1", time: "5h 50m", tempStatus: "Within Range" },
  { awb: "214-45678901", hawb: "HAWB-214-005", cargoClass: "Perishable", shc: "PER", regime: "COL", pieces: "6", weight: "168 kg", location: "COL-R05-L1", time: "2h 30m", tempStatus: "Within Range" },
  { awb: "157-90811223", hawb: "HAWB-157-005", cargoClass: "Pharma", shc: "ERT", regime: "ERT", pieces: "9", weight: "255 kg", location: "ERT-R03-L1", time: "4h 10m", tempStatus: "Within Range" },
  { awb: "074-88219033", hawb: "HAWB-074-005", cargoClass: "Frozen", shc: "FRO", regime: "FRO", pieces: "5", weight: "140 kg", location: "FRO-R04-L1", time: "8h 00m", tempStatus: "Anomaly" },
  { awb: "382-11100222", hawb: "HAWB-382-005", cargoClass: "Perishable", shc: "PER", regime: "COL", pieces: "10", weight: "290 kg", location: "COL-R06-L1", time: "6h 30m", tempStatus: "Within Range" },
];

export default function AwbTable() {
  const tableRows = rows.map((r) => ({
    awb: <span className="text-[13px] font-semibold text-[#0B2545] font-mono">{r.awb}</span>,
    hawb: <span className="text-[13px] text-[#0F172A]">{r.hawb}</span>,
    cargoClass: <span className="text-[13px] text-[#0F172A]">{r.cargoClass}</span>,
    shc: (
      <span className="inline-flex items-center h-5 px-2 rounded text-[11px] font-semibold bg-[#DBEAFE] text-[#1B4F8B]">
        {r.shc}
      </span>
    ),
    regime: (
      <span className="inline-flex items-center h-5 px-2 rounded text-[11px] font-semibold bg-[#EBF0F7] text-[#0B2545]">
        {r.regime}
      </span>
    ),
    pieces: <span className="text-[13px] text-[#0F172A]">{r.pieces}</span>,
    weight: <span className="text-[13px] text-[#0F172A]">{r.weight}</span>,
    location: <span className="text-[13px] font-mono text-[#0F172A]">{r.location}</span>,
    time: <span className="text-[13px] text-[#64748B]">{r.time}</span>,
    tempStatus: <TempStatusBadge status={r.tempStatus} />,
    action: (
      <button className="flex items-center gap-1 text-[12px] text-[#1B4F8B] font-medium hover:underline cursor-pointer">
        <ExternalLink size={12} />
        View
      </button>
    ),
  }));

  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-white overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-[#E2E8F0]">
        <h2 className="text-[16px] font-bold text-[#0F172A]">Cold-chain AWBs</h2>
        <ScopeBadge type="inc" />
        <span className="ml-auto text-[12px] text-[#64748B]">{rows.length} records</span>
      </div>
      <div className="p-4">
        <DataTable columns={columns} rows={tableRows} zebra sortable />
      </div>
    </div>
  );
}