import QAChecklistContent from "@/components/qa-checklist/QAChecklistContent";
import Breadcrumb from "@/components/Breadcrumb";

export default function QAChecklistPage() {
  return (
    <div className="space-y-5">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Final UI Acceptance Checklist" }]} />
      <div className="flex items-center gap-3">
        <h1 className="text-[22px] font-bold text-[#0F172A]">AirVault Final UI Acceptance Checklist</h1>
      </div>
      <QAChecklistContent />
    </div>
  );
}