"use client";

import Breadcrumb from "@/components/Breadcrumb";
import UsersContent from "@/components/admin/users/UsersContent";

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Admin", href: "/admin" }, { label: "Users" }]} />
      <div className="flex items-center gap-3">
        <h1 className="text-[24px] font-bold text-[#0F172A]">Users</h1>
      </div>
      <UsersContent />
    </div>
  );
}