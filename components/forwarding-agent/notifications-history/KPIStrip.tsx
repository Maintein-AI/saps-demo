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
      <KPI title="Unread notifications" value="7" subtitle="Action required on 4" />
      <KPI title="Payment alerts" value="2" subtitle="Overdue invoices" />
      <KPI title="Document alerts" value="3" subtitle="Missing or expired docs" />
      <KPI title="Pickup alerts" value="1" subtitle="Rejected slot" />
      <KPI title="Customs alerts" value="2" subtitle="Hold + OOC issued" />
    </div>
  );
}