import NotificationsContent from "@/components/notifications/NotificationsContent";
import Breadcrumb from "@/components/Breadcrumb";
import ScopeBadge from "@/components/ScopeBadge";

export default function NotificationsPage() {
  return (
    <div className="space-y-5">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Notifications & Messaging" }]} />
      <div className="flex items-center gap-3">
        <h1 className="text-[22px] font-bold text-[#0F172A]">Notifications & Messaging</h1>
        <ScopeBadge type="inc" />
      </div>
      <NotificationsContent />
    </div>
  );
}