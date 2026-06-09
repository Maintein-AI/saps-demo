import ScopeBadge from "@/components/ScopeBadge";

interface ReadOnlyFieldProps {
  label: string;
  value: string | React.ReactNode;
  required?: boolean;
}

function ReadOnlyField({ label, value, required }: ReadOnlyFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1">
        <span className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">
          {label}
        </span>
        {required && (
          <span className="text-[#DC2626] text-[12px] font-bold">*</span>
        )}
      </div>
      <div className="h-9 px-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] flex items-center text-[13px] font-medium text-[#0F172A]">
        {value}
      </div>
    </div>
  );
}

export default function OverviewTab() {
  const hawbs = ["HBL-2091", "HAWB-7781", "HAWB-4412"];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-[16px] font-semibold text-[#0F172A]">
            AWB Overview
          </h3>
          <ScopeBadge type="inc" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
        <ReadOnlyField label="AWB Number" value="214-45678901" required />
        <div className="flex flex-col gap-1">
          <span className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">
            HAWB Numbers
          </span>
          <div className="flex flex-wrap gap-2 h-9 px-3 py-1 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] items-center">
            {hawbs.map((h) => (
              <span
                key={h}
                className="h-[22px] px-2 rounded-md text-[11px] font-semibold bg-[#E2E8F0] text-[#0F172A]"
              >
                {h}
              </span>
            ))}
          </div>
        </div>
        <ReadOnlyField label="Flight Number" value="EK 602" required />
        <ReadOnlyField label="Flight Date" value="31 May 2026" required />
        <ReadOnlyField label="Carrier Airline" value="Emirates" required />
        <ReadOnlyField label="Origin Airport" value="DXB - Dubai" required />
        <ReadOnlyField label="Destination Airport" value="KHI - Karachi" required />
        <ReadOnlyField label="Pieces" value="24" required />
        <ReadOnlyField label="Actual Weight kg" value="1,240.00" required />
        <ReadOnlyField label="Volumetric Weight kg" value="1,185.40" />
        <ReadOnlyField label="Chargeable Weight kg" value="1,240.00" />
        <ReadOnlyField label="Cargo Class" value="AFU - Airport Facility Unit" required />
        <ReadOnlyField label="Handling Code" value="GEN" required />
        <ReadOnlyField label="Status" value="Active" />
        <ReadOnlyField label="Holding Status" value="None" />
      </div>
    </div>
  );
}