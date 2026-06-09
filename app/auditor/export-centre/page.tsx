"use client";

import Breadcrumb from "@/components/Breadcrumb";
import ScopeBadge from "@/components/ScopeBadge";
import ExportCentreContent from "@/components/auditor/export-centre/ExportCentreContent";

export default function ExportCentrePage() {
  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Auditor", href: "/auditor" }, { label: "Export Centre" }]} />
      <div className="flex items-center gap-2">
        <h1 className="text-[22px] font-bold text-[#0F172A]">Export Centre</h1>
        <ScopeBadge type="inc" />
      </div>
      <ExportCentreContent />
    </div>
  );
}