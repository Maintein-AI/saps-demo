import ScopeBadge from "../../ScopeBadge";

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
      <KPI title="Draft documents" value="12" subtitle="4 pending review" />
      <KPI title="Submitted documents" value="28" subtitle="To SAPS for review" />
      <KPI title="Approved documents" value="44" subtitle="Last 30 days" />
      <KPI title="Rejected documents" value="3" subtitle="Awaiting resubmit" />
      <KPI title="Expiring authority letters" value="2" subtitle="Within 7 days" />
    </div>
  );
}