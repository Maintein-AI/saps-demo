import ReportsContent from "@/components/reports/ReportsContent";
import Breadcrumb from "@/components/Breadcrumb";

export default function ReportsPage() {
  return (
    <div className="space-y-5">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Reports & Dashboards" }]} />
      <div className="flex items-center gap-3">
        <h1 className="text-[22px] font-bold text-[#0F172A]">Reports & Dashboards</h1>
      </div>
      <ReportsContent />
    </div>
  );
}