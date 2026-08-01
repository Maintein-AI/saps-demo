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
      </div>
      <p className="text-[26px] font-bold text-[#0F172A]">{value}</p>
      {subtitle && <p className="text-[12px] text-[#64748B] mt-1">{subtitle}</p>}
    </div>
  );
}

export default function KPIStrip() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      <KPI title="Total Pickups" value="31" subtitle="Scheduled this month" />
      <KPI title="Completed" value="18" subtitle="Since 01 Jun" />
      <KPI title="Pending Approvals" value="5" subtitle="Awaiting Planner" />
      <KPI title="Available Slots" value="142" subtitle="Across 5 bays today" />
      <KPI title="Cancelled" value="3" subtitle="Rescheduled or withdrawn" />
    </div>
  );
}