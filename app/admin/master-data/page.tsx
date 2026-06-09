"use client";

import Breadcrumb from "@/components/Breadcrumb";
import ScopeBadge from "@/components/ScopeBadge";
import MasterDataContent from "@/components/admin/master-data/MasterDataContent";

export default function AdminMasterDataPage() {
  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Admin", href: "/admin" }, { label: "Master Data Editor" }]} />
      <div className="flex items-center gap-3">
        <h1 className="text-[24px] font-bold text-[#0F172A]">Master Data Editor</h1>
        <ScopeBadge type="inc" />
      </div>
      <MasterDataContent />
    </div>
  );
}