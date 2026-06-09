"use client";

import Breadcrumb from "@/components/Breadcrumb";
import ScopeBadge from "@/components/ScopeBadge";
import IntegrationContent from "@/components/admin/integrations/IntegrationContent";

export default function AdminIntegrationsPage() {
  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Admin", href: "/admin" }, { label: "Integration Console" }]} />
      <div className="flex items-center gap-3">
        <h1 className="text-[24px] font-bold text-[#0F172A]">Integration Console</h1>
        <ScopeBadge type="inc" />
      </div>
      <IntegrationContent />
    </div>
  );
}