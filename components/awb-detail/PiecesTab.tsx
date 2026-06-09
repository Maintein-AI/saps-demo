import ScopeBadge from "@/components/ScopeBadge";
import DataTable from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";
import { MoreHorizontal } from "lucide-react";

const columns = [
  { key: "pieceId", header: "Piece ID", sortable: true },
  { key: "rfid", header: "RFID EPC", sortable: true },
  { key: "dimensions", header: "Dimensions", sortable: true },
  { key: "weight", header: "Weight", sortable: true },
  { key: "cargoClass", header: "Cargo Class", sortable: true },
  { key: "location", header: "Current Location", sortable: true },
  { key: "scanStatus", header: "Scan Status", sortable: true },
  { key: "lastMovement", header: "Last Movement", sortable: true },
];

const rows = [
  {
    pieceId: "PC-001",
    rfid: "E200341502001080189054B0",
    dimensions: "120 x 80 x 90 cm",
    weight: "52.0 kg",
    cargoClass: "AFU",
    location: "AFU-R2-L1",
    scanStatus: <StatusBadge status="Stored" />,
    lastMovement: "10:42",
  },
  {
    pieceId: "PC-002",
    rfid: "E200341502001080189054B1",
    dimensions: "100 x 60 x 75 cm",
    weight: "38.5 kg",
    cargoClass: "AFU",
    location: "AFU-R2-L1",
    scanStatus: <StatusBadge status="Stored" />,
    lastMovement: "10:44",
  },
  {
    pieceId: "PC-003",
    rfid: "E200341502001080189054B2",
    dimensions: "150 x 100 x 110 cm",
    weight: "72.0 kg",
    cargoClass: "AFU",
    location: "AFU-R2-L2",
    scanStatus: <StatusBadge status="Stored" />,
    lastMovement: "10:45",
  },
  {
    pieceId: "PC-004",
    rfid: "E200341502001080189054B3",
    dimensions: "80 x 60 x 60 cm",
    weight: "24.0 kg",
    cargoClass: "AFU",
    location: "AFU-R2-L1",
    scanStatus: <StatusBadge status="Stored" />,
    lastMovement: "10:47",
  },
  {
    pieceId: "PC-005",
    rfid: "E200341502001080189054B4",
    dimensions: "110 x 80 x 95 cm",
    weight: "48.0 kg",
    cargoClass: "AFU",
    location: "AFU-R2-L2",
    scanStatus: <StatusBadge status="Stored" />,
    lastMovement: "10:48",
  },
  {
    pieceId: "PC-006",
    rfid: "E200341502001080189054B5",
    dimensions: "90 x 70 x 80 cm",
    weight: "31.5 kg",
    cargoClass: "AFU",
    location: "AFU-R2-L1",
    scanStatus: <StatusBadge status="Stored" />,
    lastMovement: "10:50",
  },
  {
    pieceId: "PC-007",
    rfid: "E200341502001080189054B6",
    dimensions: "60 x 40 x 40 cm",
    weight: "12.0 kg",
    cargoClass: "AFU",
    location: "AFU-R2-L3",
    scanStatus: <StatusBadge status="Stored" />,
    lastMovement: "10:51",
  },
  {
    pieceId: "PC-008",
    rfid: "E200341502001080189054B7",
    dimensions: "200 x 120 x 140 cm",
    weight: "112.0 kg",
    cargoClass: "AFU",
    location: "AFU-R2-L3",
    scanStatus: <StatusBadge status="Stored" />,
    lastMovement: "10:53",
  },
  {
    pieceId: "PC-009",
    rfid: "E200341502001080189054B8",
    dimensions: "75 x 55 x 65 cm",
    weight: "18.0 kg",
    cargoClass: "AFU",
    location: "AFU-R2-L1",
    scanStatus: <StatusBadge status="Stored" />,
    lastMovement: "10:55",
  },
  {
    pieceId: "PC-010",
    rfid: "E200341502001080189054B9",
    dimensions: "130 x 90 x 100 cm",
    weight: "62.0 kg",
    cargoClass: "AFU",
    location: "AFU-R2-L2",
    scanStatus: <StatusBadge status="Stored" />,
    lastMovement: "10:56",
  },
  {
    pieceId: "PC-011",
    rfid: "E200341502001080189054BA",
    dimensions: "85 x 60 x 70 cm",
    weight: "28.0 kg",
    cargoClass: "AFU",
    location: "AFU-R2-L1",
    scanStatus: <StatusBadge status="Stored" />,
    lastMovement: "10:58",
  },
  {
    pieceId: "PC-012",
    rfid: "E200341502001080189054BB",
    dimensions: "95 x 65 x 85 cm",
    weight: "35.0 kg",
    cargoClass: "AFU",
    location: "AFU-R2-L2",
    scanStatus: <StatusBadge status="Stored" />,
    lastMovement: "11:00",
  },
  {
    pieceId: "PC-013",
    rfid: "E200341502001080189054BC",
    dimensions: "110 x 80 x 90 cm",
    weight: "45.0 kg",
    cargoClass: "AFU",
    location: "AFU-R2-L3",
    scanStatus: <StatusBadge status="Stored" />,
    lastMovement: "11:02",
  },
  {
    pieceId: "PC-014",
    rfid: "E200341502001080189054BD",
    dimensions: "70 x 50 x 55 cm",
    weight: "22.0 kg",
    cargoClass: "AFU",
    location: "AFU-R2-L1",
    scanStatus: <StatusBadge status="Stored" />,
    lastMovement: "11:03",
  },
  {
    pieceId: "PC-015",
    rfid: "E200341502001080189054BE",
    dimensions: "140 x 100 x 120 cm",
    weight: "78.0 kg",
    cargoClass: "AFU",
    location: "AFU-R2-L3",
    scanStatus: <StatusBadge status="Stored" />,
    lastMovement: "11:05",
  },
  {
    pieceId: "PC-016",
    rfid: "E200341502001080189054BF",
    dimensions: "65 x 45 x 50 cm",
    weight: "15.0 kg",
    cargoClass: "AFU",
    location: "AFU-R2-L1",
    scanStatus: <StatusBadge status="Stored" />,
    lastMovement: "11:06",
  },
  {
    pieceId: "PC-017",
    rfid: "E200341502001080189054C0",
    dimensions: "100 x 70 x 80 cm",
    weight: "42.0 kg",
    cargoClass: "AFU",
    location: "AFU-R2-L2",
    scanStatus: <StatusBadge status="Stored" />,
    lastMovement: "11:08",
  },
  {
    pieceId: "PC-018",
    rfid: "E200341502001080189054C1",
    dimensions: "55 x 35 x 40 cm",
    weight: "10.0 kg",
    cargoClass: "AFU",
    location: "AFU-R2-L1",
    scanStatus: <StatusBadge status="Stored" />,
    lastMovement: "11:10",
  },
  {
    pieceId: "PC-019",
    rfid: "E200341502001080189054C2",
    dimensions: "120 x 90 x 100 cm",
    weight: "58.0 kg",
    cargoClass: "AFU",
    location: "AFU-R2-L3",
    scanStatus: <StatusBadge status="Stored" />,
    lastMovement: "11:12",
  },
  {
    pieceId: "PC-020",
    rfid: "E200341502001080189054C3",
    dimensions: "80 x 60 x 70 cm",
    weight: "26.0 kg",
    cargoClass: "AFU",
    location: "AFU-R2-L2",
    scanStatus: <StatusBadge status="Stored" />,
    lastMovement: "11:14",
  },
  {
    pieceId: "PC-021",
    rfid: "E200341502001080189054C4",
    dimensions: "95 x 65 x 75 cm",
    weight: "34.0 kg",
    cargoClass: "AFU",
    location: "AFU-R2-L1",
    scanStatus: <StatusBadge status="Stored" />,
    lastMovement: "11:15",
  },
  {
    pieceId: "PC-022",
    rfid: "E200341502001080189054C5",
    dimensions: "110 x 75 x 85 cm",
    weight: "44.0 kg",
    cargoClass: "AFU",
    location: "AFU-R2-L2",
    scanStatus: <StatusBadge status="Stored" />,
    lastMovement: "11:17",
  },
  {
    pieceId: "PC-023",
    rfid: "E200341502001080189054C6",
    dimensions: "70 x 50 x 60 cm",
    weight: "20.0 kg",
    cargoClass: "AFU",
    location: "AFU-R2-L1",
    scanStatus: <StatusBadge status="Stored" />,
    lastMovement: "11:18",
  },
  {
    pieceId: "PC-024",
    rfid: "E200341502001080189054C7",
    dimensions: "130 x 95 x 110 cm",
    weight: "68.0 kg",
    cargoClass: "AFU",
    location: "AFU-R2-L3",
    scanStatus: <StatusBadge status="Stored" />,
    lastMovement: "11:20",
  },
];

const rowActions = () => (
  <div className="flex flex-col py-1">
    <button className="text-left px-3 py-2 text-[12px] text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer">
      View Detail
    </button>
    <button className="text-left px-3 py-2 text-[12px] text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer">
      Re-Scan RFID
    </button>
    <button className="text-left px-3 py-2 text-[12px] text-[#DC2626] hover:bg-[#DC2626]/5 cursor-pointer">
      Flag Damage
    </button>
  </div>
);

export default function PiecesTab() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-[16px] font-semibold text-[#0F172A]">
            Pieces
          </h3>
          <ScopeBadge type="inc" />
        </div>
        <span className="text-[12px] text-[#94A3B8] font-medium">24 pieces total</span>
      </div>
      <DataTable
        columns={columns}
        rows={rows}
        sortable
        rowActions={rowActions}
      />
    </div>
  );
}