"use client";

import Breadcrumb from "@/components/Breadcrumb";
import ScopeBadge from "@/components/ScopeBadge";
import RolesContent from "@/components/admin/roles/RolesContent";

export default function AdminRolesPage() {
  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Admin", href: "/admin" }, { label: "Roles & Permissions" }]} />
      <div className="flex items-center gap-3">
        <h1 className="text-[24px] font-bold text-[#0F172A]">Roles &amp; Permissions</h1>
        <ScopeBadge type="inc" />
      </div>
      <RolesContent />
    </div>
  );
}