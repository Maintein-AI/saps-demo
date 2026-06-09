"use client";

import { useState, useEffect } from "react";
import ScopeBadge from "@/components/ScopeBadge";
import { MultiTariffSet } from "@/components/finance-manager/multi-tariff-engine/types";

export default function TariffSetForm({
  tariffSet,
  mode,
  onSave,
  onCancel,
}: {
  tariffSet: MultiTariffSet | null;
  mode: "add" | "edit";
  onSave: () => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<MultiTariffSet>({
    id: "",
    tariffSetName: "",
    agentContract: "DB Schenker Contract 2026",
    consigneeTier: "Standard",
    route: "DXB-KHI",
    cargoClass: "GCR",
    specialHandling: "Standard",
    rateOverride: 0,
    approvalRequired: false,
    effectiveDate: "01 Jun 2026",
    expiryDate: "31 Dec 2026",
    status: "Draft",
    notes: "",
  });

  useEffect(() => {
    if (tariffSet) {
      setFormData(tariffSet);
    } else {
      setFormData({
        id: "",
        tariffSetName: "",
        agentContract: "DB Schenker Contract 2026",
        consigneeTier: "Standard",
        route: "DXB-KHI",
        cargoClass: "GCR",
        specialHandling: "Standard",
        rateOverride: 0,
        approvalRequired: false,
        effectiveDate: "01 Jun 2026",
        expiryDate: "31 Dec 2026",
        status: "Draft",
        notes: "",
      });
    }
  }, [tariffSet]);

  if (!tariffSet) {
    return (
      <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-[16px] font-semibold text-[#0F172A]">Tariff Set Configuration</h2>
          <ScopeBadge type="exc" />
        </div>
        <p className="text-[13px] text-[#64748B]">Select a tariff set from the matrix to edit, or click "Add Tariff Set" to create a new one.</p>
      </div>
    );
  }

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-5">
        <h2 className="text-[16px] font-semibold text-[#0F172A]">
          {mode === "add" ? "Add Tariff Set" : "Edit Tariff Set"}
        </h2>
        <ScopeBadge type="exc" />
      </div>
      <div className="flex flex-col gap-4">
        <div>
          <label className="text-[12px] font-medium text-[#64748B] mb-1 block">Tariff Set Name</label>
          <input
            type="text"
            value={formData.tariffSetName}
            onChange={(e) => setFormData({ ...formData, tariffSetName: e.target.value })}
            className="w-full h-9 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 text-[13px] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/30 focus:border-[#14B8A6]/50"
          />
        </div>
        <div>
          <label className="text-[12px] font-medium text-[#64748B] mb-1 block">Agent Contract</label>
          <select
            value={formData.agentContract}
            onChange={(e) => setFormData({ ...formData, agentContract: e.target.value })}
            className="w-full h-9 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 text-[13px] text-[#0F172A] pr-8 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/30 focus:border-[#14B8A6]/50 appearance-none cursor-pointer"
            style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2364748B%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><path d=%22m6 9 6 6 6-6%22/></svg>')", backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center", backgroundSize: "12px" }}
          >
            <option value="DB Schenker Contract 2026">DB Schenker Contract 2026</option>
            <option value="Kuehne+Nagel Tier A">Kuehne+Nagel Tier A</option>
            <option value="Gerry's Standard Import">Gerry's Standard Import</option>
            <option value="Local Agent Walk-in">Local Agent Walk-in</option>
            <option value="Govt Direct Contract">Govt Direct Contract</option>
            <option value="Project X NDA">Project X NDA</option>
            <option value="Pakistan Oilfields Direct">Pakistan Oilfields Direct</option>
            <option value="Kuehne+Nagel Standard">Kuehne+Nagel Standard</option>
            <option value="DB Schenker Contract 2025">DB Schenker Contract 2025</option>
          </select>
        </div>
        <div>
          <label className="text-[12px] font-medium text-[#64748B] mb-1 block">Consignee Tier</label>
          <select
            value={formData.consigneeTier}
            onChange={(e) => setFormData({ ...formData, consigneeTier: e.target.value })}
            className="w-full h-9 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 text-[13px] text-[#0F172A] pr-8 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/30 focus:border-[#14B8A6]/50 appearance-none cursor-pointer"
            style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2364748B%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><path d=%22m6 9 6 6 6-6%22/></svg>')", backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center", backgroundSize: "12px" }}
          >
            <option value="Standard">Standard</option>
            <option value="Preferred">Preferred</option>
            <option value="Government">Government</option>
            <option value="Strategic">Strategic</option>
            <option value="Special Approval">Special Approval</option>
          </select>
        </div>
        <div>
          <label className="text-[12px] font-medium text-[#64748B] mb-1 block">Route</label>
          <select
            value={formData.route}
            onChange={(e) => setFormData({ ...formData, route: e.target.value })}
            className="w-full h-9 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 text-[13px] text-[#0F172A] pr-8 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/30 focus:border-[#14B8A6]/50 appearance-none cursor-pointer"
            style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2364748B%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><path d=%22m6 9 6 6 6-6%22/></svg>')", backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center", backgroundSize: "12px" }}
          >
            <option value="DXB-KHI">DXB-KHI</option>
            <option value="DOH-KHI">DOH-KHI</option>
            <option value="IST-KHI">IST-KHI</option>
            <option value="JED-KHI">JED-KHI</option>
          </select>
        </div>
        <div>
          <label className="text-[12px] font-medium text-[#64748B] mb-1 block">Cargo Class</label>
          <select
            value={formData.cargoClass}
            onChange={(e) => setFormData({ ...formData, cargoClass: e.target.value })}
            className="w-full h-9 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 text-[13px] text-[#0F172A] pr-8 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/30 focus:border-[#14B8A6]/50 appearance-none cursor-pointer"
            style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2364748B%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><path d=%22m6 9 6 6 6-6%22/></svg>')", backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center", backgroundSize: "12px" }}
          >
            <option value="GCR">GCR</option>
            <option value="DGR">DGR</option>
            <option value="ICG">ICG</option>
            <option value="VAL">VAL</option>
            <option value="AOG">AOG</option>
          </select>
        </div>
        <div>
          <label className="text-[12px] font-medium text-[#64748B] mb-1 block">Special Handling</label>
          <select
            value={formData.specialHandling}
            onChange={(e) => setFormData({ ...formData, specialHandling: e.target.value })}
            className="w-full h-9 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 text-[13px] text-[#0F172A] pr-8 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/30 focus:border-[#14B8A6]/50 appearance-none cursor-pointer"
            style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2364748B%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><path d=%22m6 9 6 6 6-6%22/></svg>')", backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center", backgroundSize: "12px" }}
          >
            <option value="Standard">Standard</option>
            <option value="Temperature Controlled">Temperature Controlled</option>
            <option value="DG Certified">DG Certified</option>
            <option value="Pharma Certified">Pharma Certified</option>
            <option value="AOG Priority">AOG Priority</option>
          </select>
        </div>
        <div>
          <label className="text-[12px] font-medium text-[#64748B] mb-1 block">Rate Override (%)</label>
          <input
            type="number"
            value={formData.rateOverride}
            onChange={(e) => setFormData({ ...formData, rateOverride: Number(e.target.value) })}
            className="w-full h-9 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 text-[13px] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/30 focus:border-[#14B8A6]/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="approvalRequired"
            checked={formData.approvalRequired}
            onChange={(e) => setFormData({ ...formData, approvalRequired: e.target.checked })}
            className="w-4 h-4 rounded border-[#E2E8F0] cursor-pointer accent-[#0B2545]"
          />
          <label htmlFor="approvalRequired" className="text-[12px] font-medium text-[#64748B] cursor-pointer">Approval Required</label>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[12px] font-medium text-[#64748B] mb-1 block">Effective Date</label>
            <input
              type="text"
              value={formData.effectiveDate}
              onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
              className="w-full h-9 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 text-[13px] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/30 focus:border-[#14B8A6]/50"
            />
          </div>
          <div>
            <label className="text-[12px] font-medium text-[#64748B] mb-1 block">Expiry Date</label>
            <input
              type="text"
              value={formData.expiryDate}
              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              className="w-full h-9 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 text-[13px] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/30 focus:border-[#14B8A6]/50"
            />
          </div>
        </div>
        <div>
          <label className="text-[12px] font-medium text-[#64748B] mb-1 block">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full h-9 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 text-[13px] text-[#0F172A] pr-8 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/30 focus:border-[#14B8A6]/50 appearance-none cursor-pointer"
            style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2364748B%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><path d=%22m6 9 6 6 6-6%22/></svg>')", backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center", backgroundSize: "12px" }}
          >
            <option value="Draft">Draft</option>
            <option value="Pending">Pending</option>
            <option value="Under Review">Under Review</option>
            <option value="Active">Active</option>
            <option value="Retired">Retired</option>
          </select>
        </div>
        <div>
          <label className="text-[12px] font-medium text-[#64748B] mb-1 block">Notes</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={3}
            className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-[13px] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/30 focus:border-[#14B8A6]/50 resize-none"
          />
        </div>
        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={onSave}
            className="h-9 px-4 rounded-xl text-[13px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90 whitespace-nowrap"
            style={{ backgroundColor: "#0B2545" }}
          >
            Save
          </button>
          <button
            onClick={onCancel}
            className="h-9 px-3 rounded-xl border border-[#E2E8F0] text-[13px] font-semibold text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer transition-colors whitespace-nowrap"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}