"use client";

import DataTable from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";

const columns = [
  { key: "time", header: "Time", sortable: true, width: "80px" },
  { key: "awb", header: "AWB #", sortable: true },
  { key: "pieceId", header: "Piece ID", sortable: true },
  { key: "rfid", header: "RFID EPC", sortable: true },
  { key: "location", header: "Location", sortable: true },
  { key: "operator", header: "Operator", sortable: true },
  { key: "lifter", header: "Lifter", sortable: true },
  { key: "status", header: "Status", sortable: true },
];

const rows = [
  {
    time: "14:42",
    awb: "214-45678901",
    pieceId: "P-21445678901-06",
    rfid: "EPC-3008-21445678901-0006",
    location: "AFU-R02-L1-B03",
    operator: "Ahmed K.",
    lifter: "FL-03",
    status: <StatusBadge status="Stored" />,
  },
  {
    time: "14:38",
    awb: "214-45678901",
    pieceId: "P-21445678901-05",
    rfid: "EPC-3008-21445678901-0005",
    location: "AFU-R02-L1-B02",
    operator: "Ahmed K.",
    lifter: "FL-03",
    status: <StatusBadge status="Stored" />,
  },
  {
    time: "14:35",
    awb: "214-45678901",
    pieceId: "P-21445678901-04",
    rfid: "EPC-3008-21445678901-0004",
    location: "AFU-R02-L1-B01",
    operator: "Ahmed K.",
    lifter: "FL-03",
    status: <StatusBadge status="Stored" />,
  },
  {
    time: "14:31",
    awb: "331-11245678",
    pieceId: "P-33111245678-01",
    rfid: "EPC-3008-33111245678-0001",
    location: "AFU-R03-L2-B01",
    operator: "Rashid M.",
    lifter: "FL-02",
    status: <StatusBadge status="Stored" />,
  },
  {
    time: "14:28",
    awb: "331-11245678",
    pieceId: "P-33111245678-02",
    rfid: "EPC-3008-33111245678-0002",
    location: "AFU-R03-L2-B02",
    operator: "Rashid M.",
    lifter: "FL-02",
    status: <StatusBadge status="Stored" />,
  },
  {
    time: "14:25",
    awb: "618-77654321",
    pieceId: "P-61877654321-01",
    rfid: "EPC-3008-61877654321-0001",
    location: "PER-R01-L1-B01",
    operator: "Sara B.",
    lifter: "FL-01",
    status: <StatusBadge status="Stored" />,
  },
  {
    time: "14:22",
    awb: "618-77654321",
    pieceId: "P-61877654321-02",
    rfid: "EPC-3008-61877654321-0002",
    location: "PER-R01-L1-B02",
    operator: "Sara B.",
    lifter: "FL-01",
    status: <StatusBadge status="Stored" />,
  },
  {
    time: "14:18",
    awb: "882-99887766",
    pieceId: "P-88299887766-01",
    rfid: "EPC-3008-88299887766-0001",
    location: "VAL-R04-L2-B01",
    operator: "Imran J.",
    lifter: "FL-04",
    status: <StatusBadge status="Stored" />,
  },
  {
    time: "14:15",
    awb: "882-99887766",
    pieceId: "P-88299887766-02",
    rfid: "EPC-3008-88299887766-0002",
    location: "VAL-R04-L2-B02",
    operator: "Imran J.",
    lifter: "FL-04",
    status: <StatusBadge status="Stored" />,
  },
  {
    time: "14:10",
    awb: "445-33445566",
    pieceId: "P-44533445566-01",
    rfid: "EPC-3008-44533445566-0001",
    location: "GCR-R06-L3-B01",
    operator: "Ali R.",
    lifter: "FL-05",
    status: <StatusBadge status="Stored" />,
  },
  {
    time: "14:08",
    awb: "445-33445566",
    pieceId: "P-44533445566-02",
    rfid: "EPC-3008-44533445566-0002",
    location: "GCR-R06-L3-B02",
    operator: "Ali R.",
    lifter: "FL-05",
    status: <StatusBadge status="Stored" />,
  },
  {
    time: "14:05",
    awb: "445-33445566",
    pieceId: "P-44533445566-03",
    rfid: "EPC-3008-44533445566-0003",
    location: "GCR-R06-L3-B03",
    operator: "Ali R.",
    lifter: "FL-05",
    status: <StatusBadge status="Stored" />,
  },
  {
    time: "14:01",
    awb: "157-90811223",
    pieceId: "P-15790811223-01",
    rfid: "EPC-3008-15790811223-0001",
    location: "Cold-COL-01-B01",
    operator: "Fatima S.",
    lifter: "FL-02",
    status: <StatusBadge status="Stored" />,
  },
  {
    time: "13:58",
    awb: "157-90811223",
    pieceId: "P-15790811223-02",
    rfid: "EPC-3008-15790811223-0002",
    location: "Cold-COL-01-B02",
    operator: "Fatima S.",
    lifter: "FL-02",
    status: <StatusBadge status="Stored" />,
  },
  {
    time: "13:55",
    awb: "157-90811223",
    pieceId: "P-15790811223-03",
    rfid: "EPC-3008-15790811223-0003",
    location: "Cold-COL-01-B03",
    operator: "Fatima S.",
    lifter: "FL-02",
    status: <StatusBadge status="Stored" />,
  },
];

export default function RecentActivity() {
  return (
    <DataTable
      columns={columns}
      rows={rows}
      sortable
      zebra
    />
  );
}