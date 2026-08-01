"use client";
import { useToast } from "@/components/ToastContext";
import { TariffLine } from "./types";
import { Pencil, Ban, Copy, FileText, ChevronRight } from "lucide-react";

interface TariffLinesTableProps {
  lines: TariffLine[];
  onEdit: (line: TariffLine) => void;
  onDisable: (lineId: string) => void;
  onClone: (line: TariffLine) => void;
  onViewAudit: () => void;
}

function formatPKR(value: number) {
  return `Rs. ${value.toLocaleString("en-PK")}`;
}

const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  Active: { bg: "#DCFCE7", text: "#16A34A", dot: "#16A34A" },
  Draft: { bg: "#FEF3C7", text: "#D97706", dot: "#D97706" },
  Retired: { bg: "#F1F5F9", text: "#94A3B8", dot: "#94A3B8" },
};

export default function TariffLinesTable({ lines, onEdit, onDisable, onClone, onViewAudit }: TariffLinesTableProps) {
  const { addToast } = useToast();

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2.5">
          <h2 className="text-[15px] font-bold text-[#0F172A]">Tariff Lines</h2>
          <span className="text-[12px] text-[#64748B] ml-1">{lines.length} lines</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px]">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
              {["Cargo Class", "Handling Code", "Charge Type", "Free Days", "Day Slab", "Rate", "Minimum", "Surcharge", "Effective From", "Status", "Action"].map((h) => (
                <th key={h} className="text-left text-[11px] font-semibold text-[#64748B] uppercase tracking-wider px-4 py-3 whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {lines.map((line) => {
              const sc = statusConfig[line.status] || statusConfig.Draft;
              return (
                <tr key={line.id} className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-4 py-3.5">
                    <span className="text-[13px] font-semibold text-[#0B2545]">{line.cargoClass}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-[13px] text-[#475569]">{line.handlingCode}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-[13px] text-[#475569]">{line.chargeType}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-[13px] text-[#475569]">{line.freeDays}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-[13px] text-[#475569]">{line.slabFromDay}-{line.slabToDay}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-[13px] font-semibold text-[#0F172A]">Rs. {line.rate}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-[13px] text-[#475569]">{formatPKR(line.minimumCharge)}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-[13px] text-[#475569]">{line.surcharge}%</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-[13px] text-[#475569]">{line.effectiveFrom}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full text-[11px] font-semibold whitespace-nowrap" style={{ backgroundColor: sc.bg, color: sc.text }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: sc.dot }} />
                      {line.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1">
                      <button onClick={() => onEdit(line)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#0B2545] cursor-pointer transition-colors" title="Edit">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => onDisable(line.id)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#DC2626] cursor-pointer transition-colors" title="Disable">
                        <Ban size={15} />
                      </button>
                      <button onClick={() => onClone(line)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#1B4F8B] cursor-pointer transition-colors" title="Clone">
                        <Copy size={15} />
                      </button>
                      <button onClick={onViewAudit} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#0B2545] cursor-pointer transition-colors" title="View Audit">
                        <FileText size={15} />
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