"use client";

import { useState } from "react";
import { TariffLine } from "./types";
import { Save, X } from "lucide-react";

interface TariffLineItemFormProps {
  line: TariffLine | null;
  mode: "add" | "edit";
  onSave: () => void;
  onCancel: () => void;
}

const cargoClasses = ["ICG", "GCR", "AFU", "UAB", "DGR", "VAL", "HUM", "DIP", "PER", "AOG", "VUN", "AVI"];

export default function TariffLineItemForm({ line, mode, onSave, onCancel }: TariffLineItemFormProps) {
  if (!line) return null;

  const [formData, setFormData] = useState({ ...line });

  const updateField = (key: string, value: any) => {
    setFormData({ ...formData, [key]: value });
  };

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2.5">
          <h2 className="text-[15px] font-bold text-[#0F172A]">Tariff Line Item</h2>
        </div>
        <span className="text-[12px] font-semibold text-[#64748B]">
          {mode === "add" ? "New" : "Edit"}
        </span>
      </div>
      <div className="p-5">
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">Cargo Class</label>
            <select value={formData.cargoClass} onChange={(e) => updateField("cargoClass", e.target.value)} className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] bg-white text-[12px] text-[#0F172A] focus:outline-none focus:border-[#1B4F8B] pr-8">
              {cargoClasses.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">Handling Code</label>
            <input type="text" value={formData.handlingCode} onChange={(e) => updateField("handlingCode", e.target.value)} className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] bg-white text-[12px] text-[#0F172A] focus:outline-none focus:border-[#1B4F8B]" />
          </div>
          <div className="col-span-2">
            <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">Charge Type</label>
            <select value={formData.chargeType} onChange={(e) => updateField("chargeType", e.target.value)} className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] bg-white text-[12px] text-[#0F172A] focus:outline-none focus:border-[#1B4F8B] pr-8">
              <option value="Storage">Storage</option>
              <option value="Demurrage">Demurrage</option>
              <option value="Surcharge">Surcharge</option>
              <option value="Handling">Handling</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">Free Period Days</label>
            <input type="number" value={formData.freeDays} onChange={(e) => updateField("freeDays", parseInt(e.target.value))} className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] bg-white text-[12px] text-[#0F172A] focus:outline-none focus:border-[#1B4F8B]" />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">Slab From Day</label>
            <input type="number" value={formData.slabFromDay} onChange={(e) => updateField("slabFromDay", parseInt(e.target.value))} className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] bg-white text-[12px] text-[#0F172A] focus:outline-none focus:border-[#1B4F8B]" />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">Slab To Day</label>
            <input type="number" value={formData.slabToDay} onChange={(e) => updateField("slabToDay", parseInt(e.target.value))} className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] bg-white text-[12px] text-[#0F172A] focus:outline-none focus:border-[#1B4F8B]" />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">Rate PKR / kg / day</label>
            <input type="number" value={formData.rate} onChange={(e) => updateField("rate", parseFloat(e.target.value))} className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] bg-white text-[12px] text-[#0F172A] focus:outline-none focus:border-[#1B4F8B]" />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">Minimum Charge PKR</label>
            <input type="number" value={formData.minimumCharge} onChange={(e) => updateField("minimumCharge", parseFloat(e.target.value))} className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] bg-white text-[12px] text-[#0F172A] focus:outline-none focus:border-[#1B4F8B]" />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">Surcharge %</label>
            <input type="number" value={formData.surcharge} onChange={(e) => updateField("surcharge", parseFloat(e.target.value))} className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] bg-white text-[12px] text-[#0F172A] focus:outline-none focus:border-[#1B4F8B]" />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">Status</label>
            <select value={formData.status} onChange={(e) => updateField("status", e.target.value)} className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] bg-white text-[12px] text-[#0F172A] focus:outline-none focus:border-[#1B4F8B] pr-8">
              <option value="Draft">Draft</option>
              <option value="Active">Active</option>
              <option value="Retired">Retired</option>
            </select>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <button onClick={onSave} className="h-9 px-4 rounded-xl text-[13px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90 flex items-center gap-2 whitespace-nowrap" style={{ backgroundColor: "#0B2545" }}>
            <div className="w-4 h-4 flex items-center justify-center"><Save size={14} /></div>
            Save
          </button>
          <button onClick={onCancel} className="h-9 px-4 rounded-xl border border-[#E2E8F0] text-[13px] font-semibold text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer transition-colors flex items-center gap-2 whitespace-nowrap">
            <div className="w-4 h-4 flex items-center justify-center"><X size={14} /></div>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}