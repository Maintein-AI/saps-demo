"use client";

import { useState } from "react";

export default function GLMappingForm() {
  const [form, setForm] = useState({
    glAccount: "120000",
    chargeType: "Handling Charges",
    taxAccount: "210000",
    costCenter: "CC001-KHI",
    postingRule: "Standard",
    debitCredit: "Debit",
    taxCode: "VAT-17",
    currency: "PKR",
    active: true,
    notes: "Standard handling charge mapping for AirVault warehouse services.",
  });

  const chargeTypes = [
    "Handling Charges",
    "Storage Charges",
    "Customs Clearance",
    "Transport",
    "Demurrage",
    "Bond Fee",
    "Documentation",
    "Insurance",
    "Fuel Surcharge",
    "Security Fee",
  ];
  const postingRules = ["Standard", "Reversal", "Split", "Consolidated", "Auto-Post"];
  const debitCredits = ["Debit", "Credit"];
  const taxCodes = ["VAT-17", "GST-18", "Zero", "Exempt", "N/A"];
  const currencies = ["PKR", "USD", "EUR", "GBP", "AED"];

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-5">
        <h2 className="text-[16px] font-semibold text-[#0F172A]">GL Mapping Rule</h2>
      </div>
      <div className="flex flex-col gap-4">
        <div>
          <label className="text-[12px] font-medium text-[#64748B] mb-1 block">GL Account</label>
          <input
            type="text"
            value={form.glAccount}
            onChange={(e) => setForm({ ...form, glAccount: e.target.value })}
            className="w-full h-9 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 text-[13px] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/30 focus:border-[#14B8A6]/50"
          />
        </div>
        <div>
          <label className="text-[12px] font-medium text-[#64748B] mb-1 block">Charge Type</label>
          <select
            value={form.chargeType}
            onChange={(e) => setForm({ ...form, chargeType: e.target.value })}
            className="w-full h-9 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 text-[13px] text-[#0F172A] pr-8 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/30 focus:border-[#14B8A6]/50 appearance-none cursor-pointer"
            style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2364748B%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><path d=%22m6 9 6 6 6-6%22/></svg>')", backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center", backgroundSize: "12px" }}
          >
            {chargeTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[12px] font-medium text-[#64748B] mb-1 block">Tax Account</label>
          <input
            type="text"
            value={form.taxAccount}
            onChange={(e) => setForm({ ...form, taxAccount: e.target.value })}
            className="w-full h-9 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 text-[13px] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/30 focus:border-[#14B8A6]/50"
          />
        </div>
        <div>
          <label className="text-[12px] font-medium text-[#64748B] mb-1 block">Cost Center</label>
          <input
            type="text"
            value={form.costCenter}
            onChange={(e) => setForm({ ...form, costCenter: e.target.value })}
            className="w-full h-9 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 text-[13px] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/30 focus:border-[#14B8A6]/50"
          />
        </div>
        <div>
          <label className="text-[12px] font-medium text-[#64748B] mb-1 block">Posting Rule</label>
          <select
            value={form.postingRule}
            onChange={(e) => setForm({ ...form, postingRule: e.target.value })}
            className="w-full h-9 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 text-[13px] text-[#0F172A] pr-8 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/30 focus:border-[#14B8A6]/50 appearance-none cursor-pointer"
            style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2364748B%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><path d=%22m6 9 6 6 6-6%22/></svg>')", backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center", backgroundSize: "12px" }}
          >
            {postingRules.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[12px] font-medium text-[#64748B] mb-1 block">Debit / Credit</label>
          <select
            value={form.debitCredit}
            onChange={(e) => setForm({ ...form, debitCredit: e.target.value })}
            className="w-full h-9 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 text-[13px] text-[#0F172A] pr-8 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/30 focus:border-[#14B8A6]/50 appearance-none cursor-pointer"
            style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2364748B%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><path d=%22m6 9 6 6 6-6%22/></svg>')", backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center", backgroundSize: "12px" }}
          >
            {debitCredits.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[12px] font-medium text-[#64748B] mb-1 block">Tax Code</label>
          <select
            value={form.taxCode}
            onChange={(e) => setForm({ ...form, taxCode: e.target.value })}
            className="w-full h-9 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 text-[13px] text-[#0F172A] pr-8 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/30 focus:border-[#14B8A6]/50 appearance-none cursor-pointer"
            style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2364748B%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><path d=%22m6 9 6 6 6-6%22/></svg>')", backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center", backgroundSize: "12px" }}
          >
            {taxCodes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[12px] font-medium text-[#64748B] mb-1 block">Currency</label>
          <select
            value={form.currency}
            onChange={(e) => setForm({ ...form, currency: e.target.value })}
            className="w-full h-9 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 text-[13px] text-[#0F172A] pr-8 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/30 focus:border-[#14B8A6]/50 appearance-none cursor-pointer"
            style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2364748B%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><path d=%22m6 9 6 6 6-6%22/></svg>')", backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center", backgroundSize: "12px" }}
          >
            {currencies.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="active"
            checked={form.active}
            onChange={(e) => setForm({ ...form, active: e.target.checked })}
            className="w-4 h-4 rounded border-[#E2E8F0] cursor-pointer accent-[#0B2545]"
          />
          <label htmlFor="active" className="text-[12px] font-medium text-[#64748B] cursor-pointer">Active</label>
        </div>
        <div>
          <label className="text-[12px] font-medium text-[#64748B] mb-1 block">Notes</label>
          <textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            rows={3}
            className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-[13px] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/30 focus:border-[#14B8A6]/50 resize-none"
          />
        </div>
        <div className="flex items-center gap-2 pt-2">
          <button className="h-9 px-4 rounded-xl text-[13px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90 whitespace-nowrap" style={{ backgroundColor: "#0B2545" }}>
            Save Mapping
          </button>
          <button className="h-9 px-3 rounded-xl border border-[#E2E8F0] text-[13px] font-semibold text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer transition-colors whitespace-nowrap">
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}