"use client";

import ScopeBadge from "@/components/ScopeBadge";
import { TariffVersion } from "./types";

interface TariffVersionCardProps {
  version: TariffVersion;
}

const statusConfig: Record<string, { bg: string; text: string }> = {
  Draft: { bg: "#FEF3C7", text: "#D97706" },
  Active: { bg: "#DCFCE7", text: "#16A34A" },
  Retired: { bg: "#F1F5F9", text: "#94A3B8" },
};

export default function TariffVersionCard({ version }: TariffVersionCardProps) {
  const sc = statusConfig[version.status] || statusConfig.Draft;

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2.5">
          <h2 className="text-[15px] font-bold text-[#0F172A]">Tariff Version Details</h2>
          <ScopeBadge type="inc" />
        </div>
      </div>
      <div className="p-5">
        <div className="space-y-4">
          <div>
            <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider block mb-0.5">Tariff Version Name</span>
            <span className="text-[15px] font-bold text-[#0B2545]">{version.name}</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider block mb-0.5">Effective From</span>
              <span className="text-[13px] font-medium text-[#0F172A]">{version.effectiveFrom}</span>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider block mb-0.5">Effective To</span>
              <span className="text-[13px] font-medium text-[#0F172A]">{version.effectiveTo}</span>
            </div>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider block mb-1">Status</span>
            <span className="inline-flex items-center h-6 px-2.5 rounded-full text-[11px] font-semibold" style={{ backgroundColor: sc.bg, color: sc.text }}>
              {version.status}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider block mb-0.5">Created By</span>
              <span className="text-[13px] font-medium text-[#0F172A]">{version.createdBy}</span>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider block mb-0.5">Approved By</span>
              <span className="text-[13px] font-medium text-[#0F172A]">{version.approvedBy}</span>
            </div>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider block mb-0.5">Notes</span>
            <span className="text-[13px] text-[#475569] leading-relaxed">{version.notes}</span>
          </div>
        </div>
      </div>
    </div>
  );
}