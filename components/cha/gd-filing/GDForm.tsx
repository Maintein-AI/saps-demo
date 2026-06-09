"use client";

import { useState } from "react";
import {
  Search,
  Tag,
  X,
  Upload,
  Save,
  Send,
  Eye,
  Ban,
  FileUp,
  AlertTriangle,
} from "lucide-react";
import ScopeBadge from "@/components/ScopeBadge";
import { useToast } from "@/components/ToastContext";

interface GDFormData {
  awb: string;
  gdNumber: string;
  channel: string;
  filedAt: string;
  importerConsignee: string;
  hsCodes: string[];
  declaredValue: string;
  duty: string;
  tax: string;
  fed: string;
  wht: string;
  files: string[];
}

const awbOptions = [
  { awb: "214-77890123", consignee: "Al Noor Traders", carrier: "Emirates SkyCargo", flight: "EK602", cargoClass: "General", pieces: 42, weight: "1,240 kg", status: "In Storage" },
  { awb: "157-66778899", consignee: "Pakistan Textile Mills", carrier: "Qatar Airways Cargo", flight: "QR610", cargoClass: "General", pieces: 24, weight: "680 kg", status: "Customs Hold" },
  { awb: "074-55443322", consignee: "Indus Pharma", carrier: "Turkish Airlines Cargo", flight: "TK714", cargoClass: "Pharma", pieces: 18, weight: "320 kg", status: "OOC Pending" },
  { awb: "117-99887766", consignee: "Fauji Fertilizer", carrier: "Saudia Cargo", flight: "SV706", cargoClass: "General", pieces: 36, weight: "950 kg", status: "In Storage" },
  { awb: "214-11223344", consignee: "Engro Corporation", carrier: "PIA Cargo", flight: "PK301", cargoClass: "General", pieces: 55, weight: "1,500 kg", status: "Released" },
];

interface GDFormProps {
  onAwbSelect: (awb: typeof awbOptions[0] | null) => void;
  onChannelChange: (channel: string) => void;
}

export default function GDForm({ onAwbSelect, onChannelChange }: GDFormProps) {
  const { addToast } = useToast();
  const [data, setData] = useState<GDFormData>({
    awb: "",
    gdNumber: "",
    channel: "",
    filedAt: "",
    importerConsignee: "",
    hsCodes: [],
    declaredValue: "",
    duty: "",
    tax: "",
    fed: "",
    wht: "",
    files: [],
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [newHsCode, setNewHsCode] = useState("");
  const [awbDropdownOpen, setAwbDropdownOpen] = useState(false);

  const updateField = (field: keyof GDFormData, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));
    if (field === "awb") {
      const selected = awbOptions.find((a) => a.awb === value);
      if (selected) {
        setData((prev) => ({ ...prev, importerConsignee: selected.consignee }));
        onAwbSelect(selected);
      }
    }
    if (field === "channel") {
      onChannelChange(value);
    }
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const addHsCode = () => {
    if (newHsCode.trim() && !data.hsCodes.includes(newHsCode.trim())) {
      setData((prev) => ({ ...prev, hsCodes: [...prev.hsCodes, newHsCode.trim()] }));
      setNewHsCode("");
    }
  };

  const removeHsCode = (code: string) => {
    setData((prev) => ({ ...prev, hsCodes: prev.hsCodes.filter((c) => c !== code) }));
  };

  const validate = () => {
    const errs: string[] = [];
    if (!data.awb) errs.push("AWB # is required");
    if (!data.gdNumber.trim()) errs.push("GD # is required");
    if (!data.channel) errs.push("Channel is required");
    if (!data.filedAt) errs.push("Filed at is required");
    if (data.hsCodes.length === 0) errs.push("At least one HS Code is required");
    if (!data.declaredValue.trim()) errs.push("Declared Value is required");
    if (!data.duty.trim()) errs.push("Duty is required");
    if (!data.tax.trim()) errs.push("Tax is required");
    if (data.files.length === 0) errs.push("Supporting docs are required");
    setErrors(errs);
    return errs.length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      addToast("GD record submitted successfully.", "success");
    } else {
      addToast("Please fix validation errors.", "error");
    }
  };

  const handleSaveDraft = () => {
    addToast("GD draft saved.", "success");
  };

  const handleAttachDocs = () => {
    addToast("Document upload dialog opened.", "success");
  };

  const handleViewAWB = () => {
    if (!data.awb) {
      addToast("Select an AWB first.", "error");
      return;
    }
    addToast(`AWB ${data.awb} details opened.`, "success");
  };

  const fieldError = (field: string) => errors.some((e) => e.toLowerCase().includes(field.toLowerCase()));

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <h3 className="text-[15px] font-bold text-[#0F172A]">GD Filing Details</h3>
          <ScopeBadge type="exc" />
        </div>
        {errors.length > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#FEE2E2] text-[#DC2626]">
            <AlertTriangle size={14} />
            <span className="text-[12px] font-semibold">{errors.length} errors</span>
          </div>
        )}
      </div>

      <div className="space-y-5">
        {/* AWB # */}
        <div className="space-y-1.5 relative">
          <label className="text-[12px] font-semibold text-[#0F172A]">
            AWB # <span className="text-[#DC2626]">*</span>
          </label>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="text"
              value={data.awb}
              onFocus={() => setAwbDropdownOpen(true)}
              onChange={(e) => {
                updateField("awb", e.target.value);
                setAwbDropdownOpen(true);
              }}
              onBlur={() => setTimeout(() => setAwbDropdownOpen(false), 200)}
              placeholder="Search AWB..."
              className="w-full h-10 pl-9 pr-3 rounded-lg border text-[13px] text-[#0F172A] placeholder:text-[#94A3B8] outline-none focus:border-[#1B4F8B] transition-colors bg-white"
              style={{ borderColor: fieldError("awb") ? "#DC2626" : "#E2E8F0" }}
            />
            {awbDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E2E8F0] rounded-xl shadow-lg z-20 max-h-60 overflow-y-auto">
                {awbOptions
                  .filter((a) => a.awb.toLowerCase().includes(data.awb.toLowerCase()) || a.consignee.toLowerCase().includes(data.awb.toLowerCase()))
                  .map((a) => (
                    <button
                      key={a.awb}
                      onMouseDown={() => {
                        updateField("awb", a.awb);
                        setAwbDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-[#F8FAFC] transition-colors border-b border-[#F1F5F9] last:border-0"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] font-semibold text-[#0F172A] font-mono">{a.awb}</span>
                        <span className="text-[11px] text-[#64748B]">{a.consignee}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] text-[#94A3B8]">{a.carrier}</span>
                        <span className="text-[11px] text-[#94A3B8]">{a.flight}</span>
                      </div>
                    </button>
                  ))}
                {awbOptions.filter((a) => a.awb.toLowerCase().includes(data.awb.toLowerCase())).length === 0 && (
                  <div className="px-4 py-3 text-[12px] text-[#94A3B8]">No matching AWBs</div>
                )}
              </div>
            )}
          </div>
          {fieldError("awb") && <p className="text-[11px] text-[#DC2626]">AWB # is required.</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* GD # */}
          <div className="space-y-1.5">
            <label className="text-[12px] font-semibold text-[#0F172A]">
              GD # PSW/WeBOC <span className="text-[#DC2626]">*</span>
            </label>
            <input
              type="text"
              value={data.gdNumber}
              onChange={(e) => updateField("gdNumber", e.target.value)}
              placeholder="e.g. GD-KHI-2026-00091"
              className="w-full h-10 px-3 rounded-lg border text-[13px] text-[#0F172A] placeholder:text-[#94A3B8] outline-none focus:border-[#1B4F8B] transition-colors"
              style={{ borderColor: fieldError("gd") ? "#DC2626" : "#E2E8F0" }}
            />
            {fieldError("gd") && <p className="text-[11px] text-[#DC2626]">GD # is required.</p>}
          </div>

          {/* Channel */}
          <div className="space-y-1.5">
            <label className="text-[12px] font-semibold text-[#0F172A]">
              Channel <span className="text-[#DC2626]">*</span>
            </label>
            <div className="flex items-center gap-2">
              {["Green", "Yellow", "Red"].map((ch) => (
                <button
                  key={ch}
                  onClick={() => updateField("channel", ch)}
                  className="flex items-center gap-2 h-10 px-4 rounded-lg border text-[13px] font-semibold cursor-pointer transition-colors whitespace-nowrap"
                  style={{
                    borderColor: data.channel === ch ? "#0B2545" : "#E2E8F0",
                    backgroundColor: data.channel === ch ? "#EBF0F7" : "white",
                    color: data.channel === ch ? "#0B2545" : "#64748B",
                  }}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{
                      backgroundColor:
                        ch === "Green"
                          ? "#16A34A"
                          : ch === "Yellow"
                          ? "#D97706"
                          : "#DC2626",
                    }}
                  />
                  {ch}
                </button>
              ))}
            </div>
            {fieldError("channel") && <p className="text-[11px] text-[#DC2626]">Channel is required.</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Filed At */}
          <div className="space-y-1.5">
            <label className="text-[12px] font-semibold text-[#0F172A]">
              Filed At <span className="text-[#DC2626]">*</span>
            </label>
            <input
              type="datetime-local"
              value={data.filedAt}
              onChange={(e) => updateField("filedAt", e.target.value)}
              className="w-full h-10 px-3 rounded-lg border text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors"
              style={{ borderColor: fieldError("filed") ? "#DC2626" : "#E2E8F0" }}
            />
            {fieldError("filed") && <p className="text-[11px] text-[#DC2626]">Filed at is required.</p>}
          </div>

          {/* Importer Consignee */}
          <div className="space-y-1.5">
            <label className="text-[12px] font-semibold text-[#0F172A]">
              Importer Consignee
            </label>
            <input
              type="text"
              value={data.importerConsignee}
              readOnly
              placeholder="Auto-populated from AWB"
              className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] text-[13px] text-[#64748B] cursor-not-allowed"
            />
          </div>
        </div>

        {/* HS Code(s) */}
        <div className="space-y-1.5">
          <label className="text-[12px] font-semibold text-[#0F172A]">
            HS Code(s) <span className="text-[#DC2626]">*</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newHsCode}
              onChange={(e) => setNewHsCode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addHsCode())}
              placeholder="e.g. 8501.5290"
              className="flex-1 h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] placeholder:text-[#94A3B8] outline-none focus:border-[#1B4F8B] transition-colors"
            />
            <button
              onClick={addHsCode}
              className="h-10 px-3 rounded-lg border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] hover:border-[#CBD5E1] cursor-pointer transition-colors"
            >
              <Tag size={16} />
            </button>
          </div>
          {data.hsCodes.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {data.hsCodes.map((code) => (
                <span
                  key={code}
                  className="inline-flex items-center gap-1 h-7 px-2.5 rounded-full text-[11px] font-medium bg-[#F1F5F9] text-[#0F172A]"
                >
                  {code}
                  <button
                    onClick={() => removeHsCode(code)}
                    className="cursor-pointer text-[#64748B] hover:text-[#DC2626]"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}
          {fieldError("hs code") && <p className="text-[11px] text-[#DC2626]">At least one HS Code is required.</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Declared Value */}
          <div className="space-y-1.5">
            <label className="text-[12px] font-semibold text-[#0F172A]">
              Declared Value PKR <span className="text-[#DC2626]">*</span>
            </label>
            <input
              type="text"
              value={data.declaredValue}
              onChange={(e) => updateField("declaredValue", e.target.value)}
              placeholder="e.g. 2,500,000"
              className="w-full h-10 px-3 rounded-lg border text-[13px] text-[#0F172A] placeholder:text-[#94A3B8] outline-none focus:border-[#1B4F8B] transition-colors"
              style={{ borderColor: fieldError("declared") ? "#DC2626" : "#E2E8F0" }}
            />
            {fieldError("declared") && <p className="text-[11px] text-[#DC2626]">Declared value is required.</p>}
          </div>

          {/* Duty */}
          <div className="space-y-1.5">
            <label className="text-[12px] font-semibold text-[#0F172A]">
              Duty PKR <span className="text-[#DC2626]">*</span>
            </label>
            <input
              type="text"
              value={data.duty}
              onChange={(e) => updateField("duty", e.target.value)}
              placeholder="e.g. 450,000"
              className="w-full h-10 px-3 rounded-lg border text-[13px] text-[#0F172A] placeholder:text-[#94A3B8] outline-none focus:border-[#1B4F8B] transition-colors"
              style={{ borderColor: fieldError("duty") ? "#DC2626" : "#E2E8F0" }}
            />
            {fieldError("duty") && <p className="text-[11px] text-[#DC2626]">Duty is required.</p>}
          </div>

          {/* Tax */}
          <div className="space-y-1.5">
            <label className="text-[12px] font-semibold text-[#0F172A]">
              Tax PKR <span className="text-[#DC2626]">*</span>
            </label>
            <input
              type="text"
              value={data.tax}
              onChange={(e) => updateField("tax", e.target.value)}
              placeholder="e.g. 125,000"
              className="w-full h-10 px-3 rounded-lg border text-[13px] text-[#0F172A] placeholder:text-[#94A3B8] outline-none focus:border-[#1B4F8B] transition-colors"
              style={{ borderColor: fieldError("tax") ? "#DC2626" : "#E2E8F0" }}
            />
            {fieldError("tax") && <p className="text-[11px] text-[#DC2626]">Tax is required.</p>}
          </div>

          {/* FED */}
          <div className="space-y-1.5">
            <label className="text-[12px] font-semibold text-[#0F172A]">FED</label>
            <input
              type="text"
              value={data.fed}
              onChange={(e) => updateField("fed", e.target.value)}
              placeholder="e.g. 25,000"
              className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] placeholder:text-[#94A3B8] outline-none focus:border-[#1B4F8B] transition-colors"
            />
          </div>

          {/* WHT */}
          <div className="space-y-1.5">
            <label className="text-[12px] font-semibold text-[#0F172A]">WHT</label>
            <input
              type="text"
              value={data.wht}
              onChange={(e) => updateField("wht", e.target.value)}
              placeholder="e.g. 50,000"
              className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] placeholder:text-[#94A3B8] outline-none focus:border-[#1B4F8B] transition-colors"
            />
          </div>

          {/* Supporting docs */}
          <div className="space-y-1.5 lg:col-span-3">
            <label className="text-[12px] font-semibold text-[#0F172A]">
              Supporting docs <span className="text-[#DC2626]">*</span>
            </label>
            <div
              onClick={handleAttachDocs}
              className="w-full h-24 rounded-xl border-2 border-dashed border-[#E2E8F0] flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-[#F8FAFC] hover:border-[#CBD5E1] transition-colors"
              style={{ borderColor: fieldError("supporting") ? "#DC2626" : "#E2E8F0" }}
            >
              <Upload size={24} className="text-[#94A3B8]" />
              <span className="text-[13px] text-[#94A3B8]">Click to upload supporting documents</span>
            </div>
            {data.files.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {data.files.map((f) => (
                  <span key={f} className="inline-flex items-center gap-1 h-7 px-2.5 rounded-full text-[11px] font-medium bg-[#EBF0F7] text-[#1B4F8B]">
                    <FileUp size={12} /> {f}
                  </span>
                ))}
              </div>
            )}
            {fieldError("supporting") && <p className="text-[11px] text-[#DC2626]">Supporting documents are required.</p>}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[#E2E8F0]">
          <button
            onClick={handleSaveDraft}
            className="flex items-center gap-2 h-10 px-5 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F1F5F9] cursor-pointer transition-colors whitespace-nowrap"
          >
            <Save size={16} /> Save Draft
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 h-10 px-5 rounded-xl text-[13px] font-semibold text-white cursor-pointer hover:opacity-90 transition-colors whitespace-nowrap"
            style={{ backgroundColor: "#0B2545" }}
          >
            <Send size={16} /> Submit GD Record
          </button>
          <button
            onClick={handleAttachDocs}
            className="flex items-center gap-2 h-10 px-5 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F1F5F9] cursor-pointer transition-colors whitespace-nowrap"
          >
            <Upload size={16} /> Attach Supporting Docs
          </button>
          <button
            onClick={handleViewAWB}
            className="flex items-center gap-2 h-10 px-5 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F1F5F9] cursor-pointer transition-colors whitespace-nowrap"
          >
            <Eye size={16} /> View AWB
          </button>
          <button
            onClick={() => {
              setData({
                awb: "",
                gdNumber: "",
                channel: "",
                filedAt: "",
                importerConsignee: "",
                hsCodes: [],
                declaredValue: "",
                duty: "",
                tax: "",
                fed: "",
                wht: "",
                files: [],
              });
              setErrors([]);
              onAwbSelect(null);
              onChannelChange("");
              addToast("Form cancelled.", "success");
            }}
            className="flex items-center gap-2 h-10 px-5 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F1F5F9] cursor-pointer transition-colors whitespace-nowrap"
          >
            <Ban size={16} /> Cancel
          </button>
        </div>
      </div>
    </div>
  );
}