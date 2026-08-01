"use client";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import SearchContent from "@/components/uld-message-builder/search/SearchContent";

export default function SearchPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-1.5 text-[12px] text-[#94A3B8]">
        <Link href="/" className="hover:text-[#64748B] transition-colors">Home</Link>
        <ChevronRight size={12} />
        <Link href="/uld-message-builder" className="hover:text-[#64748B] transition-colors">ULD Management</Link>
        <ChevronRight size={12} />
        <span className="text-[#64748B]">Search ULD Messages</span>
      </div>

      <div className="flex items-center gap-2">
        <h1 className="text-[22px] font-bold text-[#0F172A]">Search ULD Messages</h1>
      </div>

      <SearchContent />
    </div>
  );
}