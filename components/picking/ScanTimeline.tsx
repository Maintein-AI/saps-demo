"use client";

import DataTable from "@/components/DataTable";
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

const columns = [
  { key: "time", header: "Time", width: "60px" },
  { key: "pieceId", header: "Piece ID" },
  { key: "rfid", header: "RFID EPC" },
  { key: "operator", header: "Operator" },
  { key: "result", header: "Result" },
  { key: "remarks", header: "Remarks" },
];

const resultConfig = {
  OK: { color: "#16A34A", icon: <CheckCircle2 size={14} /> },
  Mismatch: { color: "#DC2626", icon: <XCircle size={14} /> },
  Held: { color: "#D97706", icon: <AlertTriangle size={14} /> },
};

const rows = [
  {
    time: "14:47",
    pieceId: "P-21445678901-02",
    rfid: "EPC-3008-21445678901-0002",
    operator: "Ahmed K.",
    result: (
      <span className="inline-flex items-center gap-1 text-[12px] font-semibold" style={{ color: "#16A34A" }}>
        <CheckCircle2 size={14} /> OK
      </span>
    ),
    remarks: "Piece verified",
  },
  {
    time: "14:46",
    pieceId: "P-21445678901-03",
    rfid: "EPC-3008-21445678901-0003",
    operator: "Ahmed K.",
    result: (
      <span className="inline-flex items-center gap-1 text-[12px] font-semibold" style={{ color: "#DC2626" }}>
        <XCircle size={14} /> Mismatch
      </span>
    ),
    remarks: "RFID mismatch - expected B03",
  },
  {
    time: "14:44",
    pieceId: "P-21445678901-01",
    rfid: "EPC-3008-21445678901-0001",
    operator: "Ahmed K.",
    result: (
      <span className="inline-flex items-center gap-1 text-[12px] font-semibold" style={{ color: "#16A34A" }}>
        <CheckCircle2 size={14} /> OK
      </span>
    ),
    remarks: "Piece verified",
  },
  {
    time: "14:42",
    pieceId: "P-21445678901-06",
    rfid: "EPC-3008-21445678901-0006",
    operator: "Rashid M.",
    result: (
      <span className="inline-flex items-center gap-1 text-[12px] font-semibold" style={{ color: "#16A34A" }}>
        <CheckCircle2 size={14} /> OK
      </span>
    ),
    remarks: "Piece verified",
  },
  {
    time: "14:40",
    pieceId: "P-21445678901-05",
    rfid: "EPC-3008-21445678901-0005",
    operator: "Rashid M.",
    result: (
      <span className="inline-flex items-center gap-1 text-[12px] font-semibold" style={{ color: "#16A34A" }}>
        <CheckCircle2 size={14} /> OK
      </span>
    ),
    remarks: "Piece verified",
  },
  {
    time: "14:38",
    pieceId: "P-21445678901-04",
    rfid: "EPC-3008-21445678901-0004",
    operator: "Rashid M.",
    result: (
      <span className="inline-flex items-center gap-1 text-[12px] font-semibold" style={{ color: "#16A34A" }}>
        <CheckCircle2 size={14} /> OK
      </span>
    ),
    remarks: "Piece verified",
  },
  {
    time: "14:35",
    pieceId: "P-21445678901-07",
    rfid: "EPC-3008-21445678901-0007",
    operator: "Sara B.",
    result: (
      <span className="inline-flex items-center gap-1 text-[12px] font-semibold" style={{ color: "#16A34A" }}>
        <CheckCircle2 size={14} /> OK
      </span>
    ),
    remarks: "Piece verified",
  },
  {
    time: "14:33",
    pieceId: "P-21445678901-08",
    rfid: "EPC-3008-21445678901-0008",
    operator: "Sara B.",
    result: (
      <span className="inline-flex items-center gap-1 text-[12px] font-semibold" style={{ color: "#16A34A" }}>
        <CheckCircle2 size={14} /> OK
      </span>
    ),
    remarks: "Piece verified",
  },
  {
    time: "14:30",
    pieceId: "P-21445678901-09",
    rfid: "EPC-3008-21445678901-0009",
    operator: "Sara B.",
    result: (
      <span className="inline-flex items-center gap-1 text-[12px] font-semibold" style={{ color: "#D97706" }}>
        <AlertTriangle size={14} /> Held
      </span>
    ),
    remarks: "Held for investigation",
  },
  {
    time: "14:28",
    pieceId: "P-21445678901-10",
    rfid: "EPC-3008-21445678901-0010",
    operator: "Sara B.",
    result: (
      <span className="inline-flex items-center gap-1 text-[12px] font-semibold" style={{ color: "#16A34A" }}>
        <CheckCircle2 size={14} /> OK
      </span>
    ),
    remarks: "Piece verified",
  },
];

export default function ScanTimeline() {
  return (
    <DataTable
      columns={columns}
      rows={rows}
      sortable
      zebra
    />
  );
}