import { Package, Bell, CreditCard, Truck, FileText, ArrowRight } from "lucide-react";

interface MainCardProps {
  title: string;
  description: string;
  count: number;
  icon: React.ReactNode;
  onClick: () => void;
}

function MainCard({ title, description, count, icon, onClick }: MainCardProps) {
  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer group" onClick={onClick}>
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-[#F1F5F9] flex items-center justify-center group-hover:bg-[#EBF0F7] transition-colors">
          {icon}
        </div>
      </div>
      <h3 className="text-[16px] font-bold text-[#0F172A] mb-2">{title}</h3>
      <p className="text-[13px] text-[#64748B] mb-4 leading-relaxed">{description}</p>
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[24px] font-bold text-[#0F172A]">{count}</span>
          <span className="text-[12px] text-[#64748B] ml-1">items</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-[#F1F5F9] flex items-center justify-center group-hover:bg-[#0B2545] group-hover:text-white transition-colors">
          <ArrowRight size={16} />
        </div>
      </div>
    </div>
  );
}

interface MainCardGridProps {
  onNav: (route: string) => void;
}

export default function MainCardGrid({ onNav }: MainCardGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      <MainCard
        title="My Shipments"
        description="Track all your active and historical shipments in real time."
        count={42}
        icon={<Package size={20} className="text-[#1B4F8B]" />}
        onClick={() => onNav("shipments")}
      />
      <MainCard
        title="Notices"
        description="View arrival notices, customs updates, and OOC alerts."
        count={15}
        icon={<Bell size={20} className="text-[#1B4F8B]" />}
        onClick={() => onNav("notices")}
      />
      <MainCard
        title="Pay & Download DO"
        description="Clear outstanding charges and download delivery orders."
        count={11}
        icon={<CreditCard size={20} className="text-[#1B4F8B]" />}
        onClick={() => onNav("pay-do")}
      />
      <MainCard
        title="Schedule Pickup"
        description="Book vehicle pickup slots for your ready DOs."
        count={6}
        icon={<Truck size={20} className="text-[#1B4F8B]" />}
        onClick={() => onNav("pickup")}
      />
      <MainCard
        title="POD History"
        description="Download proof of delivery documents for past shipments."
        count={28}
        icon={<FileText size={20} className="text-[#1B4F8B]" />}
        onClick={() => onNav("pod")}
      />
    </div>
  );
}