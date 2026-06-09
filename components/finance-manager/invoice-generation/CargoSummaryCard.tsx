"use client";

import ScopeBadge from "@/components/ScopeBadge";
import { CargoData } from "./types";

interface CargoSummaryCardProps {
  cargo: CargoData;
}

export default function CargoSummaryCard({ cargo }: CargoSummaryCardProps) {
  const fields = [
    { label: "AWB #", value: cargo.awb },
    { label: "HAWB #", value: cargo.hawb },
    { label: "Pieces", value: cargo.pieces.toString() },
    { label: "Actual Weight", value: `${cargo.actualWeight} kg` },
    { label: "Volumetric Weight", value: `${cargo.volumetricWeight} kg` },
    { label: "Chargeable Weight", value: `${cargo.chargeableWeight} kg` },
    { label: "Arrival Date", value: cargo.arrivalDate },
    { label: "Free Period Expiry", value: cargo.freePeriodExpiry },
    { label: "Billing Status", value: cargo.billingStatus },
    { label: "Consignee", value: cargo.consignee },
    { label: "CHA", value: cargo.cha },
    { label: "Forwarding Agent", value: cargo.forwardingAgent },
    { label: "Cargo Class", value: cargo.cargoClass },
    { label: "Storage Days", value: cargo.storageDays.toString() },
  ];

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2.5">
          <h2 className="text-[15px] font-bold text-[#0F172A]">Selected Cargo Summary</h2>
          <ScopeBadge type="inc" />
        </div>
      </div>
      <div className="p-5">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {fields.map((f) => (
            <div key={f.label}>
              <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider block mb-0.5">
                {f.label}
              </span>
              <span className="text-[13px] font-medium text-[#0F172A]">{f.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}