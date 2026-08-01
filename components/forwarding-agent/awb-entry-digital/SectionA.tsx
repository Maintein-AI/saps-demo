"use client";

import { useState } from "react";
import { Search, Plus, Tag, X } from "lucide-react";

interface SectionAProps {
  data: Record<string, any>;
  onChange: (field: string, value: any) => void;
  errors: string[];
}

const chaList = [
  "Al-Hamd Clearing",
  "Gerry's CHA (Pvt) Ltd",
  "Kuehne + Nagel CHA",
  "Schenker Pakistan CHA",
  "Shaheen Logistics CHA",
  "Pakistan Cargo Services",
  "Star Freight CHA",
  "Awan Clearing Agency",
  "Fast Track CHA",
  "Apex Customs Services",
];

export default function SectionA({ data, onChange, errors }: SectionAProps) {
  const [newHawb, setNewHawb] = useState("");
  const [newConsignee, setNewConsignee] = useState(false);

  const hawbNumbers = (data.hawbNumbers || []) as string[];

  const addHawb = () => {
    if (newHawb.trim() && !hawbNumbers.includes(newHawb.trim())) {
      onChange("hawbNumbers", [...hawbNumbers, newHawb.trim()]);
      setNewHawb("");
    }
  };

  const removeHawb = (h: string) => {
    onChange("hawbNumbers", hawbNumbers.filter((x) => x !== h));
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 mb-1">
        <h3 className="text-[14px] font-bold text-[#0F172A]">A. Identification</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[12px] font-semibold text-[#0F172A]">
            AWB Number (MAWB) <span className="text-[#DC2626]">*</span>
          </label>
          <input
            type="text"
            value={data.mawb || ""}
            onChange={(e) => onChange("mawb", e.target.value)}
            placeholder="123-45678901"
            maxLength={12}
            className="w-full h-10 px-3 rounded-lg border text-[13px] text-[#0F172A] placeholder:text-[#94A3B8] outline-none focus:border-[#1B4F8B] transition-colors"
            style={{ borderColor: errors.includes("mawb") ? "#DC2626" : "#E2E8F0" }}
          />
          {errors.includes("mawb") && (
            <p className="text-[11px] text-[#DC2626]">AWB number is required (3-digit prefix + 8-digit serial).</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-[12px] font-semibold text-[#0F172A]">Consol ID</label>
          <input
            type="text"
            value={data.consolId || ""}
            onChange={(e) => onChange("consolId", e.target.value)}
            placeholder="CONS-2026-XXXX"
            className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] placeholder:text-[#94A3B8] outline-none focus:border-[#1B4F8B] transition-colors"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-[12px] font-semibold text-[#0F172A]">HAWB Number(s)</label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newHawb}
            onChange={(e) => setNewHawb(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addHawb())}
            placeholder="Add HAWB number and press Enter"
            className="flex-1 h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] placeholder:text-[#94A3B8] outline-none focus:border-[#1B4F8B] transition-colors"
          />
          <button
            onClick={addHawb}
            className="h-10 px-3 rounded-lg border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] hover:border-[#CBD5E1] cursor-pointer transition-colors"
          >
            <Tag size={16} />
          </button>
        </div>
        {hawbNumbers.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {hawbNumbers.map((h) => (
              <span
                key={h}
                className="inline-flex items-center gap-1 h-7 px-2.5 rounded-full text-[11px] font-medium bg-[#F1F5F9] text-[#0F172A]"
              >
                {h}
                <button onClick={() => removeHawb(h)} className="cursor-pointer text-[#64748B] hover:text-[#DC2626]">
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[12px] font-semibold text-[#0F172A]">Forwarding Agent</label>
          <input
            type="text"
            value={data.forwardingAgent || "Kuehne + Nagel Pakistan"}
            readOnly
            className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] text-[13px] text-[#64748B] cursor-not-allowed"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[12px] font-semibold text-[#0F172A]">CHA Appointment</label>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <select
              value={data.cha || ""}
              onChange={(e) => onChange("cha", e.target.value)}
              className="w-full h-10 pl-9 pr-8 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors appearance-none bg-white"
            >
              <option value="">Select CHA</option>
              {chaList.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-[12px] font-semibold text-[#0F172A]">
            Consignee <span className="text-[#DC2626]">*</span>
          </label>
          <button
            onClick={() => setNewConsignee(!newConsignee)}
            className="flex items-center gap-1 text-[11px] font-semibold text-[#1B4F8B] hover:text-[#0B2545] cursor-pointer transition-colors"
          >
            <Plus size={12} />
            {newConsignee ? "Cancel new" : "New consignee"}
          </button>
        </div>

        {!newConsignee ? (
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <select
              value={data.consignee || ""}
              onChange={(e) => onChange("consignee", e.target.value)}
              className="w-full h-10 pl-9 pr-8 rounded-lg border text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors appearance-none bg-white"
              style={{ borderColor: errors.includes("consignee") ? "#DC2626" : "#E2E8F0" }}
            >
              <option value="">Select consignee</option>
              <option value="Pakistan Textile Mills Ltd">Pakistan Textile Mills Ltd</option>
              <option value="Indus Pharma (Pvt) Ltd">Indus Pharma (Pvt) Ltd</option>
              <option value="Fauji Fertilizer Company">Fauji Fertilizer Company</option>
              <option value="Engro Corporation">Engro Corporation</option>
              <option value="Lucky Cement Ltd">Lucky Cement Ltd</option>
              <option value="Packages Ltd">Packages Ltd</option>
              <option value="Nishat Mills Ltd">Nishat Mills Ltd</option>
              <option value="Gul Ahmed Textile Mills">Gul Ahmed Textile Mills</option>
              <option value="Crescent Steel & Allied Products">Crescent Steel & Allied Products</option>
              <option value="Descon Engineering Ltd">Descon Engineering Ltd</option>
            </select>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]">
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-[#0F172A]">Company Name <span className="text-[#DC2626]">*</span></label>
              <input type="text" className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] text-[13px] outline-none focus:border-[#1B4F8B]" placeholder="Company name" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-[#0F172A]">NTN</label>
              <input type="text" className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] text-[13px] outline-none focus:border-[#1B4F8B]" placeholder="NTN number" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-[#0F172A]">Contact Person</label>
              <input type="text" className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] text-[13px] outline-none focus:border-[#1B4F8B]" placeholder="Contact person" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-[#0F172A]">Phone</label>
              <input type="text" className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] text-[13px] outline-none focus:border-[#1B4F8B]" placeholder="Phone number" />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-[11px] font-semibold text-[#0F172A]">Address</label>
              <input type="text" className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] text-[13px] outline-none focus:border-[#1B4F8B]" placeholder="Full address" />
            </div>
          </div>
        )}
        {errors.includes("consignee") && (
          <p className="text-[11px] text-[#DC2626]">Consignee is required.</p>
        )}
      </div>
    </div>
  );
}