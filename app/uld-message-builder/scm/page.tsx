"use client";

import ScopeBadge from "@/components/ScopeBadge";
import SCMContent from "@/components/uld-message-builder/scm/SCMContent";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default function SCMPage() {
  return (
    <div className="space-y-6">
      <nav className="flex items-center gap-1.5 text-[12px] text-[#94A3B8]">
        <Link href="/" className="hover:text-[#64748B] transition-colors">Home</Link>
        <ChevronRight size={12} />
        <Link href="/uld-message-builder" className="hover:text-[#64748B] transition-colors">ULD Management</Link>
        <ChevronRight size={12} />
        <span className="text-[#0F172A] font-semibold">SCM</span>
      </nav>

      <div className="flex items-center gap-2">
        <h1 className="text-[22px] font-bold text-[#0F172A]">Stock Check Message (SCM)</h1>
        <ScopeBadge type="exc" />
      </div>

      <SCMContent />
    </div>
  );
}