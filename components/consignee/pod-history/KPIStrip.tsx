import ScopeBadge from "@/components/ScopeBadge";

interface KPIProps {
  title: string;
  value: string;
  subtitle?: string;
}

function KPI({ title, value, subtitle }: KPIProps) {
  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[13px] font-semibold text-[#64748B]">{title}</h3>
        <ScopeBadge type="exc" />
      </div>
      <p className="text-[26px] font-bold text-[#0F172A]">{value}</p>
      {subtitle && <p className="text-[12px] text-[#64748B] mt-1">{subtitle}</p>}
    </div>
  );
}

export default function KPIStrip() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      <KPI title="Completed Pickups" value="28" subtitle="With gate exit recorded" />
      <KPI title="PODs Available" value="22" subtitle="Signed and verified" />
      <KPI title="PODs Pending" value="4" subtitle="Awaiting gate guard sign-off" />
      <KPI title="Deliveries This Month" value="18" subtitle="June 2026" />
      <KPI title="Disputed Deliveries" value="2" subtitle="Under review by SAPS" />
    </div>
  );
}