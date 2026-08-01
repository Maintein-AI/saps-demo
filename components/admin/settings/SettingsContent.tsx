"use client";

import { useState, useEffect } from "react";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { useToast } from "@/components/ToastContext";
import { Save, Building2, Palette, Globe, Hash, FileText, Clock, Coins, Languages } from "lucide-react";

export default function SettingsContent() {
  const [isLoading, setIsLoading] = useState(true);
  const { addToast } = useToast();
  const [companyInfo, setCompanyInfo] = useState({
    name: "Shaheen Airport Services (Pvt) Ltd.",
    shortName: "SAPS",
    address: "Jinnah International Airport, Karachi, Pakistan",
    phone: "+92 21 34567890",
    email: "ops@shaheen-airport.com",
    website: "https://shaheen-airport.com",
  });
  const [branding, setBranding] = useState({
    primaryColor: "#0B2545",
    accentColor: "#2E75B6",
    portalName: "AirVault",
  });
  const [localization, setLocalization] = useState({
    timezone: "Asia/Karachi",
    currency: "PKR",
    language: "English",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "12-hour (AM/PM)",
  });
  const [taxIds, setTaxIds] = useState({
    ntn: "1234567-8",
    strn: "STRN-987654321",
    gst: "GST-456123789",
  });
  const [numberFormats, setNumberFormats] = useState({
    decimalSeparator: ".",
    thousandsSeparator: ",",
    weightUnit: "kg",
    dimensionUnit: "cm",
    currencyDisplay: "PKR Symbol (Rs.)",
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const sectionIcon = (icon: React.ReactNode, bg: string, color: string) => (
    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: bg }}>
      <div style={{ color }}>{icon}</div>
    </div>
  );

  const inputClass = "w-full h-10 px-3 rounded-xl border border-[#E2E8F0] bg-white text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors";
  const labelClass = "block text-[12px] font-semibold text-[#64748B] mb-1.5";

  const handleSave = (section: string) => {
    addToast(`${section} settings saved`, "success");
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
            <div className="h-5 w-40 bg-[#F1F5F9] rounded animate-pulse mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="h-10 bg-[#F1F5F9] rounded-xl animate-pulse" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {sectionIcon(<Building2 size={20} />, "#DBEAFE", "#1B4F8B")}
            <div>
              <h2 className="text-[16px] font-bold text-[#0F172A]">Company Information</h2>
              <p className="text-[12px] text-[#64748B]">Basic company details used across the system</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Company Name</label>
            <input type="text" value={companyInfo.name} onChange={(e) => setCompanyInfo((p) => ({ ...p, name: e.target.value }))} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Short Name</label>
            <input type="text" value={companyInfo.shortName} onChange={(e) => setCompanyInfo((p) => ({ ...p, shortName: e.target.value }))} className={inputClass} />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Address</label>
            <input type="text" value={companyInfo.address} onChange={(e) => setCompanyInfo((p) => ({ ...p, address: e.target.value }))} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Phone</label>
            <input type="text" value={companyInfo.phone} onChange={(e) => setCompanyInfo((p) => ({ ...p, phone: e.target.value }))} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input type="text" value={companyInfo.email} onChange={(e) => setCompanyInfo((p) => ({ ...p, email: e.target.value }))} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Website</label>
            <input type="text" value={companyInfo.website} onChange={(e) => setCompanyInfo((p) => ({ ...p, website: e.target.value }))} className={inputClass} />
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button onClick={() => handleSave("Company")} className="flex items-center gap-1.5 h-9 px-4 rounded-xl text-[12px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90 whitespace-nowrap" style={{ backgroundColor: "#0B2545" }}>
            <Save size={14} /> Save
          </button>
        </div>
      </div>

      <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {sectionIcon(<Palette size={20} />, "#EDE9FE", "#7C3AED")}
            <div>
              <h2 className="text-[16px] font-bold text-[#0F172A]">Branding</h2>
              <p className="text-[12px] text-[#64748B]">Portal visual identity settings</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Primary Color</label>
            <div className="flex items-center gap-2">
              <input type="color" value={branding.primaryColor} onChange={(e) => setBranding((p) => ({ ...p, primaryColor: e.target.value }))} className="w-10 h-10 rounded-lg border border-[#E2E8F0] cursor-pointer" />
              <input type="text" value={branding.primaryColor} onChange={(e) => setBranding((p) => ({ ...p, primaryColor: e.target.value }))} className={inputClass} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Accent Color</label>
            <div className="flex items-center gap-2">
              <input type="color" value={branding.accentColor} onChange={(e) => setBranding((p) => ({ ...p, accentColor: e.target.value }))} className="w-10 h-10 rounded-lg border border-[#E2E8F0] cursor-pointer" />
              <input type="text" value={branding.accentColor} onChange={(e) => setBranding((p) => ({ ...p, accentColor: e.target.value }))} className={inputClass} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Portal Name</label>
            <input type="text" value={branding.portalName} onChange={(e) => setBranding((p) => ({ ...p, portalName: e.target.value }))} className={inputClass} />
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button onClick={() => handleSave("Branding")} className="flex items-center gap-1.5 h-9 px-4 rounded-xl text-[12px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90 whitespace-nowrap" style={{ backgroundColor: "#0B2545" }}>
            <Save size={14} /> Save
          </button>
        </div>
      </div>

      <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {sectionIcon(<Globe size={20} />, "#DCFCE7", "#16A34A")}
            <div>
              <h2 className="text-[16px] font-bold text-[#0F172A]">Localization</h2>
              <p className="text-[12px] text-[#64748B]">Regional settings for Pakistan operations</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>
              <Clock size={14} className="inline mr-1" /> Time Zone
            </label>
            <input type="text" value={localization.timezone} onChange={(e) => setLocalization((p) => ({ ...p, timezone: e.target.value }))} className={inputClass} disabled style={{ backgroundColor: "#F8FAFC", color: "#64748B" }} />
          </div>
          <div>
            <label className={labelClass}>
              <Coins size={14} className="inline mr-1" /> Currency
            </label>
            <input type="text" value={localization.currency} onChange={(e) => setLocalization((p) => ({ ...p, currency: e.target.value }))} className={inputClass} disabled style={{ backgroundColor: "#F8FAFC", color: "#64748B" }} />
          </div>
          <div>
            <label className={labelClass}>
              <Languages size={14} className="inline mr-1" /> Language
            </label>
            <div className="flex gap-2">
              {["English", "Urdu"].map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLocalization((p) => ({ ...p, language: lang }))}
                  className="h-10 px-4 rounded-xl text-[13px] font-medium border cursor-pointer transition-colors"
                  style={{
                    backgroundColor: localization.language === lang ? "#0B2545" : "white",
                    color: localization.language === lang ? "white" : "#64748B",
                    borderColor: localization.language === lang ? "#0B2545" : "#E2E8F0",
                  }}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className={labelClass}>Date Format</label>
            <input type="text" value={localization.dateFormat} disabled className={inputClass} style={{ backgroundColor: "#F8FAFC", color: "#64748B" }} />
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button onClick={() => handleSave("Localization")} className="flex items-center gap-1.5 h-9 px-4 rounded-xl text-[12px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90 whitespace-nowrap" style={{ backgroundColor: "#0B2545" }}>
            <Save size={14} /> Save
          </button>
        </div>
      </div>

      <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {sectionIcon(<FileText size={20} />, "#FEF3C7", "#D97706")}
            <div>
              <h2 className="text-[16px] font-bold text-[#0F172A]">Tax IDs & NTN</h2>
              <p className="text-[12px] text-[#64748B]">Tax registration identifiers</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>NTN</label>
            <input type="text" value={taxIds.ntn} onChange={(e) => setTaxIds((p) => ({ ...p, ntn: e.target.value }))} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>STRN</label>
            <input type="text" value={taxIds.strn} onChange={(e) => setTaxIds((p) => ({ ...p, strn: e.target.value }))} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>GST Number</label>
            <input type="text" value={taxIds.gst} onChange={(e) => setTaxIds((p) => ({ ...p, gst: e.target.value }))} className={inputClass} />
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button onClick={() => handleSave("Tax IDs")} className="flex items-center gap-1.5 h-9 px-4 rounded-xl text-[12px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90 whitespace-nowrap" style={{ backgroundColor: "#0B2545" }}>
            <Save size={14} /> Save
          </button>
        </div>
      </div>
    </div>
  );
}