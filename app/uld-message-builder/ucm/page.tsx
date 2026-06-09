"use client";

import ScopeBadge from "@/components/ScopeBadge";
import UCMContent from "@/components/uld-message-builder/ucm/UCMContent";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default function UCMPage() {
  return (
    <div className="space-y-6">
      <nav className="flex items-center gap-1.5 text-[12px] text-[#94A3B8]">
        <Link href="/" className="hover:text-[#64748B] transition-colors">Home</Link>
        <ChevronRight size={12} />
        <Link href="/uld-message-builder" className="hover:text-[#64748B] transition-colors">ULD Management</Link>
        <ChevronRight size={12} />
        <span className="text-[#0F172A] font-semibold">UCM</span>
      </nav>

      <div className="flex items-center gap-2">
        <h1 className="text-[22px] font-bold text-[#0F172A]">ULD Control Message (UCM)</h1>
        <ScopeBadge type="exc" />
      </div>

      <UCMContent />
    </div>
  );
}