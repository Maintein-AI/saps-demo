import ScopeBadge from "../../ScopeBadge";

interface SectionEProps {
  data: Record<string, any>;
  onChange: (field: string, value: any) => void;
  errors: string[];
}

const payMethods = [
  "Cash on collection",
  "Pre-pay gateway",
  "Credit account agent",
];

export default function SectionE({ data, onChange, errors }: SectionEProps) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 mb-1">
        <h3 className="text-[14px] font-bold text-[#0F172A]">E. Charges & Payment Intent</h3>
        <ScopeBadge type="exc" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[12px] font-semibold text-[#0F172A]">
            Pay Method <span className="text-[#DC2626]">*</span>
          </label>
          <select
            value={data.payMethod || ""}
            onChange={(e) => onChange("payMethod", e.target.value)}
            className="w-full h-10 px-3 rounded-lg border text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors appearance-none bg-white"
            style={{ borderColor: errors.includes("payMethod") ? "#DC2626" : "#E2E8F0" }}
          >
            <option value="">Select payment method</option>
            {payMethods.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          {errors.includes("payMethod") && (
            <p className="text-[11px] text-[#DC2626]">Payment method is required.</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-[12px] font-semibold text-[#0F172A]">GST Registration #</label>
          <input
            type="text"
            value={data.gstNumber || ""}
            onChange={(e) => onChange("gstNumber", e.target.value)}
            placeholder="e.g. 12-3456789-0"
            className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] placeholder:text-[#94A3B8] outline-none focus:border-[#1B4F8B] transition-colors"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[12px] font-semibold text-[#0F172A]">NTN</label>
          <input
            type="text"
            value={data.ntn || ""}
            onChange={(e) => onChange("ntn", e.target.value)}
            placeholder="National Tax Number"
            className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] placeholder:text-[#94A3B8] outline-none focus:border-[#1B4F8B] transition-colors"
          />
        </div>
      </div>

      <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]">
        <h4 className="text-[13px] font-bold text-[#0F172A] mb-3">Estimated Charges Preview</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <p className="text-[11px] text-[#94A3B8] font-medium">Storage Charges</p>
            <p className="text-[14px] font-bold text-[#0F172A]">PKR 0.00</p>
          </div>
          <div className="space-y-1">
            <p className="text-[11px] text-[#94A3B8] font-medium">Handling Charges</p>
            <p className="text-[14px] font-bold text-[#0F172A]">PKR 0.00</p>
          </div>
          <div className="space-y-1">
            <p className="text-[11px] text-[#94A3B8] font-medium">Documentation Fee</p>
            <p className="text-[14px] font-bold text-[#0F172A]">PKR 500.00</p>
          </div>
          <div className="space-y-1">
            <p className="text-[11px] text-[#94A3B8] font-medium">GST (17%)</p>
            <p className="text-[14px] font-bold text-[#0F172A]">PKR 85.00</p>
          </div>
          <div className="col-span-2 pt-2 border-t border-[#E2E8F0] space-y-1">
            <p className="text-[11px] text-[#94A3B8] font-medium">Total Estimated</p>
            <p className="text-[18px] font-bold text-[#0B2545]">PKR 585.00</p>
          </div>
        </div>
        <p className="text-[11px] text-[#94A3B8] mt-3">
          * Final charges will be calculated based on actual storage duration and cargo handling requirements.
        </p>
      </div>
    </div>
  );
}