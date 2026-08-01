import { Info } from "lucide-react";

export default function CoordinationNote() {
  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-[14px] font-bold text-[#0F172A]">Coordination Note</h3>
      </div>
      <div className="flex items-start gap-3 p-4 rounded-xl bg-[#EBF0F7]">
        <div className="w-8 h-8 rounded-lg bg-[#1B4F8B]/10 flex items-center justify-center flex-shrink-0">
          <Info size={16} className="text-[#1B4F8B]" />
        </div>
        <p className="text-[13px] text-[#0F172A] leading-relaxed">
          This workbench captures GD information for SAPS coordination only.
          It does not directly file into PSW/WeBOC.
        </p>
      </div>
    </div>
  );
}