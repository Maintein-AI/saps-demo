"use client";

import { useState } from "react";
import { X, Shield, Send, Save } from "lucide-react";
import ScopeBadge from "../../ScopeBadge";
import { useToast } from "../../ToastContext";

interface AuthorityLetterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  defaultData?: {
    awb?: string;
    do?: string;
    driver?: string;
    vehicle?: string;
  };
}

export default function AuthorityLetterDrawer({
  isOpen,
  onClose,
  defaultData,
}: AuthorityLetterDrawerProps) {
  const { addToast } = useToast();
  const [form, setForm] = useState({
    awb: defaultData?.awb || "",
    do: defaultData?.do || "",
    driverName: defaultData?.driver || "",
    driverCnic: "",
    vehicle: defaultData?.vehicle || "",
    forwardingAgent: "Kuehne + Nagel Pakistan",
    chaName: "",
    consignee: "",
    validFrom: "",
    validUntil: "",
    authorizedSignatory: "",
    remarks: "",
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    addToast("Authority letter saved as draft.", "success");
    onClose();
  };

  const handleSubmit = () => {
    addToast("Authority letter generated and submitted to SAPS.", "success");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-[60] transition-opacity"
        onClick={onClose}
      />
      <div className="fixed top-0 right-0 h-full bg-white shadow-xl z-[70] flex flex-col" style={{ width: "100%", maxWidth: 480 }}>
        <div className="flex items-center justify-between px-5 h-[64px] border-b border-[#E2E8F0] flex-shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="text-[16px] font-bold text-[#0F172A]">Generate Authority Letter</h2>
            <ScopeBadge type="exc" />
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[12px] font-semibold text-[#0F172A]">AWB #</label>
              <input type="text" value={form.awb} onChange={(e) => handleChange("awb", e.target.value)} className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] outline-none focus:border-[#1B4F8B]" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[12px] font-semibold text-[#0F172A]">DO #</label>
              <input type="text" value={form.do} onChange={(e) => handleChange("do", e.target.value)} className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] outline-none focus:border-[#1B4F8B]" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[12px] font-semibold text-[#0F172A]">Driver Name</label>
              <input type="text" value={form.driverName} onChange={(e) => handleChange("driverName", e.target.value)} className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] outline-none focus:border-[#1B4F8B]" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[12px] font-semibold text-[#0F172A]">Driver CNIC</label>
              <input type="text" value={form.driverCnic} onChange={(e) => handleChange("driverCnic", e.target.value)} placeholder="XXXXX-XXXXXXX-X" className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] outline-none focus:border-[#1B4F8B]" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[12px] font-semibold text-[#0F172A]">Vehicle #</label>
            <input type="text" value={form.vehicle} onChange={(e) => handleChange("vehicle", e.target.value)} className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] outline-none focus:border-[#1B4F8B]" />
          </div>

          <div className="space-y-1.5">
            <label className="text-[12px] font-semibold text-[#0F172A]">Forwarding Agent</label>
            <input type="text" value={form.forwardingAgent} readOnly className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] text-[13px] text-[#64748B] cursor-not-allowed" />
          </div>

          <div className="space-y-1.5">
            <label className="text-[12px] font-semibold text-[#0F172A]">CHA Name</label>
            <select value={form.chaName} onChange={(e) => handleChange("chaName", e.target.value)} className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] outline-none focus:border-[#1B4F8B] appearance-none bg-white">
              <option value="">Select CHA</option>
              <option value="Al-Hamd Clearing">Al-Hamd Clearing</option>
              <option value="Gerry's CHA (Pvt) Ltd">Gerry's CHA (Pvt) Ltd</option>
              <option value="Kuehne + Nagel CHA">Kuehne + Nagel CHA</option>
              <option value="Schenker Pakistan CHA">Schenker Pakistan CHA</option>
              <option value="Shaheen Logistics CHA">Shaheen Logistics CHA</option>
              <option value="Pakistan Cargo Services">Pakistan Cargo Services</option>
              <option value="Star Freight CHA">Star Freight CHA</option>
              <option value="Awan Clearing Agency">Awan Clearing Agency</option>
              <option value="Fast Track CHA">Fast Track CHA</option>
              <option value="Apex Customs Services">Apex Customs Services</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[12px] font-semibold text-[#0F172A]">Consignee</label>
            <select value={form.consignee} onChange={(e) => handleChange("consignee", e.target.value)} className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] outline-none focus:border-[#1B4F8B] appearance-none bg-white">
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

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[12px] font-semibold text-[#0F172A]">Valid From</label>
              <input type="date" value={form.validFrom} onChange={(e) => handleChange("validFrom", e.target.value)} className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] outline-none focus:border-[#1B4F8B]" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[12px] font-semibold text-[#0F172A]">Valid Until</label>
              <input type="date" value={form.validUntil} onChange={(e) => handleChange("validUntil", e.target.value)} className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] outline-none focus:border-[#1B4F8B]" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[12px] font-semibold text-[#0F172A]">Authorized Signatory</label>
            <input type="text" value={form.authorizedSignatory} onChange={(e) => handleChange("authorizedSignatory", e.target.value)} placeholder="Full name and designation" className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] outline-none focus:border-[#1B4F8B]" />
          </div>

          <div className="space-y-1.5">
            <label className="text-[12px] font-semibold text-[#0F172A]">Remarks</label>
            <textarea value={form.remarks} onChange={(e) => handleChange("remarks", e.target.value)} rows={3} className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] text-[13px] outline-none focus:border-[#1B4F8B] resize-none" placeholder="Any additional remarks..." />
          </div>
        </div>

        <div className="flex items-center gap-3 p-5 border-t border-[#E2E8F0] flex-shrink-0">
          <button onClick={handleSave} className="flex items-center gap-2 h-10 px-4 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer transition-colors">
            <Save size={16} />
            Save Draft
          </button>
          <button onClick={handleSubmit} className="flex items-center gap-2 h-10 px-4 rounded-xl text-[13px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90" style={{ backgroundColor: "#0B2545" }}>
            <Send size={16} />
            Generate & Submit
          </button>
        </div>
      </div>
    </>
  );
}