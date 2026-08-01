interface PieceDetailsProps {
  task: {
    awb: string;
    hawb: string;
    pieceId: string;
    rfid: string;
    weight: string;
    cargoClass: string;
    handlingCode: string;
    currentStatus: string;
    fromLocation: string;
    toLocation: string;
    assignedBy: string;
    lifterAsset: string;
  };
}

export default function PieceDetails({ task }: PieceDetailsProps) {
  const fields = [
    { label: "AWB #", value: task.awb },
    { label: "HAWB #", value: task.hawb },
    { label: "Piece ID", value: task.pieceId },
    { label: "RFID EPC", value: task.rfid },
    { label: "Weight", value: task.weight },
    { label: "Cargo Class", value: task.cargoClass },
    { label: "Handling Code", value: task.handlingCode },
    { label: "Current Status", value: task.currentStatus },
    { label: "From Location", value: task.fromLocation },
    { label: "To Location", value: task.toLocation },
    { label: "Assigned By", value: task.assignedBy },
    { label: "Lifter Asset", value: task.lifterAsset },
  ];

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-[15px] font-bold text-[#0F172A]">Piece Details</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
        {fields.map((f) => (
          <div key={f.label} className="flex flex-col">
            <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wide mb-0.5">
              {f.label}
            </span>
            <span className="text-[14px] font-medium text-[#0F172A]">
              {f.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}