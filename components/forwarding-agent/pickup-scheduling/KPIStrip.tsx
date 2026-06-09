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
      <KPI title="Available slots today" value="38" subtitle="Across 6 vehicle bays" />
      <KPI title="Booked pickups" value="12" subtitle="For 8 AWBs" />
      <KPI title="Pending approvals" value="4" subtitle="Awaiting Planner sign-off" />
      <KPI title="Completed pickups" value="6" subtitle="Since midnight" />
      <KPI title="Cancelled pickups" value="1" subtitle="Rescheduled to tomorrow" />
    </div>
  );
}