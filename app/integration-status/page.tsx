import IntegrationStatusContent from "@/components/integration-status/IntegrationStatusContent";
import Breadcrumb from "@/components/Breadcrumb";
import ScopeBadge from "@/components/ScopeBadge";

export default function IntegrationStatusPage() {
  return (
    <div className="space-y-5">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Integration Status Summary" }]} />
      <div className="flex items-center gap-3">
        <h1 className="text-[22px] font-bold text-[#0F172A]">Integration Status Summary</h1>
        <ScopeBadge type="inc" />
      </div>
      <IntegrationStatusContent />
    </div>
  );
}