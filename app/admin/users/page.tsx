"use client";

import Breadcrumb from "@/components/Breadcrumb";
import ScopeBadge from "@/components/ScopeBadge";
import UsersContent from "@/components/admin/users/UsersContent";

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Admin", href: "/admin" }, { label: "Users" }]} />
      <div className="flex items-center gap-3">
        <h1 className="text-[24px] font-bold text-[#0F172A]">Users</h1>
        <ScopeBadge type="inc" />
      </div>
      <UsersContent />
    </div>
  );
}