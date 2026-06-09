import RFIDContent from "@/components/rfid/RFIDContent";
import Breadcrumb from "@/components/Breadcrumb";
import ScopeBadge from "@/components/ScopeBadge";

export default function RFIDIntegrationPage() {
  return (
    <div className="space-y-5">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "RFID Integration Console" }]} />
      <div className="flex items-center gap-3">
        <h1 className="text-[22px] font-bold text-[#0F172A]">RFID Integration Console</h1>
        <ScopeBadge type="inc" />
      </div>
      <RFIDContent />
    </div>
  );
}