"use client";

import Breadcrumb from "@/components/Breadcrumb";
import RbacSnapshotContent from "@/components/auditor/rbac-snapshot/RbacSnapshotContent";

export default function RbacSnapshotPage() {
  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Auditor", href: "/auditor" }, { label: "RBAC Snapshot" }]} />
      <div className="flex items-center gap-2">
        <h1 className="text-[22px] font-bold text-[#0F172A]">RBAC Snapshot</h1>
      </div>
      <RbacSnapshotContent />
    </div>
  );
}