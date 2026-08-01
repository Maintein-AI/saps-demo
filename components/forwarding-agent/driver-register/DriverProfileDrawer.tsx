"use client";

import { X, User, Hash, Phone, Calendar, FileText, Save, Ban } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ToastContext";

interface Driver {
  id: string;
  name: string;
  cnic: string;
  mobile: string;
  photo: string;
  license: string;
  licenseExpiry: string;
  allowedAWBs: string[];
  allowedDOs: string[];
  lastVisit: string;
  status: "Active" | "Blocked" | "License Expired" | "Verification Required";
  notes: string;
}

interface DriverProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  driver?: Driver;
  mode: "add" | "edit";
}

const emptyDriver: Driver = {
  id: "",
  name: "",
  cnic: "",
  mobile: "",
  photo: "",
  license: "",
  licenseExpiry: "",
  allowedAWBs: [],
  allowedDOs: [],
  lastVisit: "",
  status: "Active",
  notes: "",
};

export default function DriverProfileDrawer({ isOpen, onClose, driver, mode }: DriverProfileDrawerProps) {
  const [form, setForm] = useState<Driver>(emptyDriver);
  const [awbInput, setAwbInput] = useState("");
  const [doInput, setDoInput] = useState("");
  const { addToast } = useToast();

  useEffect(() => {
    if (driver) {
      setForm(driver);
    } else {
      setForm(emptyDriver);
    }
  }, [driver]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddAWB = () => {
    if (awbInput.trim()) {
      setForm((prev) => ({ ...prev, allowedAWBs: [...prev.allowedAWBs, awbInput.trim()] }));
      setAwbInput("");
    }
  };

  const handleAddDO = () => {
    if (doInput.trim()) {
      setForm((prev) => ({ ...prev, allowedDOs: [...prev.allowedDOs, doInput.trim()] }));
      setDoInput("");
    }
  };

  const handleSave = () => {
    addToast("Driver record saved.", "success");
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300"
          onClick={onClose}
        />
      )}
      <div
        className="fixed top-0 right-0 h-full bg-white shadow-xl z-[70] transition-transform duration-300 ease-out flex flex-col"
        style={{
          width: "100%",
          maxWidth: 420,
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
        }}
      >
        <div className="flex items-center justify-between px-5 h-[64px] border-b border-[#E2E8F0] flex-shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="text-[16px] font-bold text-[#0F172A]">Driver Profile</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col items-center gap-3 mb-2">
              <div className="w-20 h-20 rounded-full bg-[#EBF0F7] flex items-center justify-center">
                <User size={32} className="text-[#1B4F8B]" />
              </div>
              <button className="text-[12px] font-semibold text-[#1B4F8B] cursor-pointer hover:underline">
                Upload Photo
              </button>
            </div>

            <div>
              <label className="text-[12px] font-semibold text-[#64748B] mb-1 block">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors bg-white"
                placeholder="Full name"
              />
            </div>

            <div>
              <label className="text-[12px] font-semibold text-[#64748B] mb-1 block">CNIC</label>
              <input
                type="text"
                value={form.cnic}
                onChange={(e) => handleChange("cnic", e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors bg-white font-mono"
                placeholder="xxxxx-xxxxxxx-x"
              />
            </div>

            <div>
              <label className="text-[12px] font-semibold text-[#64748B] mb-1 block">Mobile</label>
              <input
                type="text"
                value={form.mobile}
                onChange={(e) => handleChange("mobile", e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors bg-white"
                placeholder="03xx-xxxxxxx"
              />
            </div>

            <div>
              <label className="text-[12px] font-semibold text-[#64748B] mb-1 block">License #</label>
              <input
                type="text"
                value={form.license}
                onChange={(e) => handleChange("license", e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors bg-white font-mono"
                placeholder="LHE-2025-xxxx"
              />
            </div>

            <div>
              <label className="text-[12px] font-semibold text-[#64748B] mb-1 block">License Expiry</label>
              <input
                type="date"
                value={form.licenseExpiry}
                onChange={(e) => handleChange("licenseExpiry", e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors bg-white"
              />
            </div>

            <div>
              <label className="text-[12px] font-semibold text-[#64748B] mb-1 block">Allowed AWBs</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {form.allowedAWBs.map((awb, i) => (
                  <span key={i} className="inline-flex items-center gap-1 h-6 px-2 rounded-lg bg-[#EBF0F7] text-[#1B4F8B] text-[11px] font-semibold">
                    {awb}
                    <button
                      onClick={() => setForm((prev) => ({ ...prev, allowedAWBs: prev.allowedAWBs.filter((_, idx) => idx !== i) }))}
                      className="w-4 h-4 flex items-center justify-center rounded hover:bg-[#1B4F8B]/10 text-[#1B4F8B] cursor-pointer"
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={awbInput}
                  onChange={(e) => setAwbInput(e.target.value)}
                  className="flex-1 h-10 px-3 rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors bg-white"
                  placeholder="AWB #"
                />
                <button
                  onClick={handleAddAWB}
                  className="h-10 px-3 rounded-xl border border-[#E2E8F0] text-[#1B4F8B] text-[13px] font-semibold cursor-pointer hover:bg-[#F8FAFC] transition-colors"
                >
                  Add
                </button>
              </div>
            </div>

            <div>
              <label className="text-[12px] font-semibold text-[#64748B] mb-1 block">Allowed DOs</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {form.allowedDOs.map((do_, i) => (
                  <span key={i} className="inline-flex items-center gap-1 h-6 px-2 rounded-lg bg-[#F1F5F9] text-[#64748B] text-[11px] font-semibold">
                    {do_}
                    <button
                      onClick={() => setForm((prev) => ({ ...prev, allowedDOs: prev.allowedDOs.filter((_, idx) => idx !== i) }))}
                      className="w-4 h-4 flex items-center justify-center rounded hover:bg-[#64748B]/10 text-[#64748B] cursor-pointer"
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={doInput}
                  onChange={(e) => setDoInput(e.target.value)}
                  className="flex-1 h-10 px-3 rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors bg-white"
                  placeholder="DO #"
                />
                <button
                  onClick={handleAddDO}
                  className="h-10 px-3 rounded-xl border border-[#E2E8F0] text-[#1B4F8B] text-[13px] font-semibold cursor-pointer hover:bg-[#F8FAFC] transition-colors"
                >
                  Add
                </button>
              </div>
            </div>

            <div>
              <label className="text-[12px] font-semibold text-[#64748B] mb-1 block">Status</label>
              <select
                value={form.status}
                onChange={(e) => handleChange("status", e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors bg-white pr-8"
              >
                <option value="Active">Active</option>
                <option value="Blocked">Blocked</option>
                <option value="License Expired">License Expired</option>
                <option value="Verification Required">Verification Required</option>
              </select>
            </div>

            <div>
              <label className="text-[12px] font-semibold text-[#64748B] mb-1 block">Notes</label>
              <textarea
                value={form.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                className="w-full h-24 px-3 py-2 rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors bg-white resize-none"
                placeholder="Internal notes about this driver"
                maxLength={500}
              />
              <p className="text-[11px] text-[#94A3B8] mt-1 text-right">{form.notes.length}/500</p>
            </div>
          </div>
        </div>

        <div className="px-5 py-4 border-t border-[#E2E8F0] flex items-center gap-3">
          <button
            onClick={handleSave}
            className="flex-1 flex items-center justify-center gap-2 h-10 rounded-xl text-[13px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90"
            style={{ backgroundColor: "#0B2545" }}
          >
            <Save size={16} />
            <span className="whitespace-nowrap">Save</span>
          </button>
          <button
            onClick={onClose}
            className="flex items-center justify-center gap-2 h-10 px-4 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] cursor-pointer hover:bg-[#F8FAFC] transition-colors"
          >
            <Ban size={16} />
            <span className="whitespace-nowrap">Cancel</span>
          </button>
        </div>
      </div>
    </>
  );
}