import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";

interface ValidationSummaryProps {
  total: number;
  valid: number;
  invalid: number;
  duplicates: number;
  missingFields: number;
}

export default function ValidationSummary({ total, valid, invalid, duplicates, missingFields }: ValidationSummaryProps) {
  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-[15px] font-bold text-[#0F172A]">Validation Summary</h2>
      </div>

      <div className="grid grid-cols-5 gap-4">
        <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 text-center">
          <p className="text-[22px] font-bold text-[#0F172A]">{total}</p>
          <p className="text-[12px] font-semibold text-[#64748B] mt-0.5">Total Rows</p>
        </div>
        <div className="rounded-xl border border-[#DCFCE7] bg-[#F0FDF4] p-4 text-center">
          <p className="text-[22px] font-bold text-[#16A34A]">{valid}</p>
          <div className="flex items-center gap-1 justify-center mt-0.5">
            <CheckCircle size={12} className="text-[#16A34A]" />
            <p className="text-[12px] font-semibold text-[#16A34A]">Valid Rows</p>
          </div>
        </div>
        <div className="rounded-xl border border-[#FEE2E2] bg-[#FEF2F2] p-4 text-center">
          <p className="text-[22px] font-bold text-[#DC2626]">{invalid}</p>
          <div className="flex items-center gap-1 justify-center mt-0.5">
            <XCircle size={12} className="text-[#DC2626]" />
            <p className="text-[12px] font-semibold text-[#DC2626]">Invalid Rows</p>
          </div>
        </div>
        <div className="rounded-xl border border-[#FEF3C7] bg-[#FFFBEB] p-4 text-center">
          <p className="text-[22px] font-bold text-[#D97706]">{duplicates}</p>
          <div className="flex items-center gap-1 justify-center mt-0.5">
            <AlertTriangle size={12} className="text-[#D97706]" />
            <p className="text-[12px] font-semibold text-[#D97706]">Duplicates</p>
          </div>
        </div>
        <div className="rounded-xl border border-[#FEE2E2] bg-[#FEF2F2] p-4 text-center">
          <p className="text-[22px] font-bold text-[#DC2626]">{missingFields}</p>
          <div className="flex items-center gap-1 justify-center mt-0.5">
            <XCircle size={12} className="text-[#DC2626]" />
            <p className="text-[12px] font-semibold text-[#DC2626]">Missing Fields</p>
          </div>
        </div>
      </div>
    </div>
  );
}