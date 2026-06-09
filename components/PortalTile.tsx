import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ScopeBadge from "./ScopeBadge";

interface PortalTileProps {
  icon: React.ReactNode;
  name: string;
  roleText: string;
  tag: "inc" | "exc";
  href?: string;
}

export default function PortalTile({
  icon,
  name,
  roleText,
  tag,
  href,
}: PortalTileProps) {
  const tile = (
    <div className="relative w-full max-w-[220px] aspect-square rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col items-center cursor-pointer">
      <div className="absolute top-3 right-3">
        <ScopeBadge type={tag} />
      </div>
      <div className="w-14 h-14 flex items-center justify-center mt-2">
        {icon}
      </div>
      <h3 className="text-[16px] font-semibold text-[#0F172A] leading-[24px] mt-3 text-center">
        {name}
      </h3>
      <p className="text-[12px] font-medium text-[#64748B] mt-1 text-center leading-[18px]">
        {roleText}
      </p>
      <div className="mt-auto flex items-center gap-1.5 text-[13px] font-semibold text-[#1B4F8B] hover:text-[#0B2545] transition-colors whitespace-nowrap">
        Open
        <ArrowRight size={14} />
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="no-underline w-full flex justify-center">
        {tile}
      </Link>
    );
  }
  return tile;
}