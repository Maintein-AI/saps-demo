"use client";

import Breadcrumb from "@/components/Breadcrumb";
import SettingsContent from "@/components/admin/settings/SettingsContent";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Admin", href: "/admin" }, { label: "System Settings" }]} />
      <div className="flex items-center gap-3">
        <h1 className="text-[24px] font-bold text-[#0F172A]">System Settings</h1>
      </div>
      <SettingsContent />
    </div>
  );
}