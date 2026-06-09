import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-1.5">
      <button className="flex items-center gap-1 text-[12px] text-[#64748B] hover:text-[#1B4F8B] cursor-pointer transition-colors">
        <Home size={14} />
      </button>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-1.5">
          <ChevronRight size={14} className="text-[#94A3B8]" />
          {item.href ? (
            <button className="text-[12px] text-[#64748B] hover:text-[#1B4F8B] cursor-pointer transition-colors font-medium">
              {item.label}
            </button>
          ) : (
            <span className="text-[12px] text-[#0F172A] font-semibold">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}