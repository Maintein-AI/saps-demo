import ScopeBadge from "@/components/ScopeBadge";
import KPICard from "@/components/KPICard";

export default function KPIStrip() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      <KPICard title="Notes today" value="8" subtitle="3 shift notes, 2 safety" trend="up" trendValue="+2" />
      <KPICard title="Open follow-ups" value="5" subtitle="2 overdue" trend="up" trendValue="+1" />
      <KPICard title="Linked AWBs" value="12" subtitle="8 in warehouse" trend="neutral" trendValue="0" />
      <KPICard title="Safety notes" value="3" subtitle="1 unresolved" trend="down" trendValue="-1" />
      <KPICard title="Shift notes" value="4" subtitle="2 published today" trend="up" trendValue="+1" />
    </div>
  );
}