"use client";

import Breadcrumb from "@/components/Breadcrumb";
import ScopeBadge from "@/components/ScopeBadge";
import AuditorHomeContent from "@/components/auditor/dashboard/AuditorHomeContent";

export default function AuditorHomePage() {
  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Auditor", href: "/auditor" }, { label: "Dashboard" }]} />
      <div className="flex items-center gap-2">
        <h1 className="text-[22px] font-bold text-[#0F172A]">Auditor Home</h1>
        <ScopeBadge type="inc" />
      </div>
      <AuditorHomeContent />
    </div>
  );
}