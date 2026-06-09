"use client";

import Breadcrumb from "@/components/Breadcrumb";
import ScopeBadge from "@/components/ScopeBadge";
import CargoTraceContent from "@/components/auditor/cargo-trace/CargoTraceContent";

export default function CargoTracePage() {
  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Auditor", href: "/auditor" }, { label: "Cargo Trace" }]} />
      <div className="flex items-center gap-2">
        <h1 className="text-[22px] font-bold text-[#0F172A]">Cargo Trace</h1>
        <ScopeBadge type="inc" />
      </div>
      <CargoTraceContent />
    </div>
  );
}