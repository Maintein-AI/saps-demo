"use client";

import { useState, useEffect } from "react";
import { X, Camera, Check, Upload, ChevronDown } from "lucide-react";
import ScopeBadge from "@/components/ScopeBadge";

interface Driver {
  name?: string;
  cnic?: string;
  mobile?: string;
  license?: string;
  licenseExpiry?: string;
  agents?: string;
  awbs?: string;
  status?: string;
}

interface DriverDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  mode: string;
  driver: Driver | null;
  onSave: () => void;
}

const statusOptions = ["Active", "Blocked", "Expired License", "Verification Required"];

export default function DriverDrawer({ isOpen, onClose, mode, driver, onSave }: DriverDrawerProps) {
  const [form, setForm] = useState({
    name: "",
    cnic: "",
    mobile: "",
    license: "",
    licenseExpiry: "",
    agents: "",
    awbs: "",
    address: "",
    emergency: "",
    status: "Active",
    notes: "",
  });
  const [photo, setPhoto] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    if (driver && mode === "edit") {
      setForm({
        name: driver.name || "",
        cnic: driver.cnic || "",
        mobile: driver.mobile || "",
        license: driver.license || "",
        licenseExpiry: driver.licenseExpiry || "",
        agents: driver.agents || "",
        awbs: driver.awbs || "",
        address: "",
        emergency: "",
        status: driver.status || "Active",
        notes: "",
      });
    } else {
      setForm({
        name: "",
        cnic: "",
        mobile: "",
        license: "",
        licenseExpiry: "",
        agents: "",
        awbs: "",
        address: "",
        emergency: "",
        status: "Active",
        notes: "",
      });
    }
  }, [driver, mode, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full max-w-[420px] h-full bg-white shadow-2xl overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-[#E2E8F0] p-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <h2 className="text-[18px] font-bold text-[#0F172A]">
              {mode === "add" ? "Add Driver" : "Edit Driver"}
            </h2>
            <ScopeBadge type="exc" />
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#F8FAFC] cursor-pointer transition-colors">
            <X size={18} className="text-[#64748B]" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Photo */}
          <div>
            <label className="block text-[13px] font-semibold text-[#0F172A] mb-2">Photo</label>
            <button
              onClick={() => setPhoto(!photo)}
              className="w-full h-20 rounded-xl border-2 border-dashed flex items-center justify-center gap-3 cursor-pointer transition-colors"
              style={{
                borderColor: photo ? "#16A34A" : "#E2E8F0",
                backgroundColor: photo ? "#F0FDF4" : "#F8FAFC",
              }}
            >
              {photo ? (
                <>
                  <Check size={20} className="text-[#16A34A]" />
                  <span className="text-[14px] font-semibold text-[#16A34A]">Photo captured</span>
                </>
              ) : (
                <>
                  <Camera size={20} className="text-[#94A3B8]" />
                  <span className="text-[14px] text-[#64748B]">Tap to capture photo</span>
                </>
              )}
            </button>
          </div>

          {/* Name */}
          <div>
            <label className="block text-[13px] font-semibold text-[#0F172A] mb-2">Driver Name <span className="text-[#DC2626]">*</span></label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              className="w-full h-12 px-4 rounded-xl border border-[#E2E8F0] text-[14px] font-medium outline-none focus:border-[#1B4F8B]"
              placeholder="Full name"
            />
          </div>

          {/* CNIC */}
          <div>
            <label className="block text-[13px] font-semibold text-[#0F172A] mb-2">CNIC <span className="text-[#DC2626]">*</span></label>
            <input
              type="text"
              value={form.cnic}
              onChange={(e) => setForm((p) => ({ ...p, cnic: e.target.value }))}
              maxLength={13}
              className="w-full h-12 px-4 rounded-xl border border-[#E2E8F0] text-[14px] font-medium outline-none focus:border-[#1B4F8B]"
              placeholder="4210112345671"
            />
          </div>

          {/* Mobile */}
          <div>
            <label className="block text-[13px] font-semibold text-[#0F172A] mb-2">Mobile <span className="text-[#DC2626]">*</span></label>
            <input
              type="text"
              value={form.mobile}
              onChange={(e) => setForm((p) => ({ ...p, mobile: e.target.value }))}
              maxLength={11}
              className="w-full h-12 px-4 rounded-xl border border-[#E2E8F0] text-[14px] font-medium outline-none focus:border-[#1B4F8B]"
              placeholder="03001234567"
            />
          </div>

          {/* License */}
          <div>
            <label className="block text-[13px] font-semibold text-[#0F172A] mb-2">License #</label>
            <input
              type="text"
              value={form.license}
              onChange={(e) => setForm((p) => ({ ...p, license: e.target.value }))}
              className="w-full h-12 px-4 rounded-xl border border-[#E2E8F0] text-[14px] font-medium outline-none focus:border-[#1B4F8B]"
              placeholder="LHR-458201"
            />
          </div>

          {/* License Expiry */}
          <div>
            <label className="block text-[13px] font-semibold text-[#0F172A] mb-2">License Expiry</label>
            <input
              type="text"
              value={form.licenseExpiry}
              onChange={(e) => setForm((p) => ({ ...p, licenseExpiry: e.target.value }))}
              className="w-full h-12 px-4 rounded-xl border border-[#E2E8F0] text-[14px] font-medium outline-none focus:border-[#1B4F8B]"
              placeholder="15 Dec 2026"
            />
          </div>

          {/* Allowed Agents */}
          <div>
            <label className="block text-[13px] font-semibold text-[#0F172A] mb-2">Allowed Forwarding Agents</label>
            <input
              type="text"
              value={form.agents}
              onChange={(e) => setForm((p) => ({ ...p, agents: e.target.value }))}
              className="w-full h-12 px-4 rounded-xl border border-[#E2E8F0] text-[14px] font-medium outline-none focus:border-[#1B4F8B]"
              placeholder="DB Schenker, Gerry's"
            />
          </div>

          {/* Allowed AWBs */}
          <div>
            <label className="block text-[13px] font-semibold text-[#0F172A] mb-2">Allowed AWBs / DOs</label>
            <input
              type="text"
              value={form.awbs}
              onChange={(e) => setForm((p) => ({ ...p, awbs: e.target.value }))}
              className="w-full h-12 px-4 rounded-xl border border-[#E2E8F0] text-[14px] font-medium outline-none focus:border-[#1B4F8B]"
              placeholder="DO-90871, AWB 214-45678901"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-[13px] font-semibold text-[#0F172A] mb-2">Address</label>
            <textarea
              value={form.address}
              onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
              className="w-full h-24 px-4 py-3 rounded-xl border border-[#E2E8F0] text-[14px] font-medium outline-none focus:border-[#1B4F8B] resize-none"
              placeholder="Full address"
            />
          </div>

          {/* Emergency */}
          <div>
            <label className="block text-[13px] font-semibold text-[#0F172A] mb-2">Emergency Contact</label>
            <input
              type="text"
              value={form.emergency}
              onChange={(e) => setForm((p) => ({ ...p, emergency: e.target.value }))}
              className="w-full h-12 px-4 rounded-xl border border-[#E2E8F0] text-[14px] font-medium outline-none focus:border-[#1B4F8B]"
              placeholder="Contact name and number"
            />
          </div>

          {/* Status */}
          <div className="relative">
            <label className="block text-[13px] font-semibold text-[#0F172A] mb-2">Status</label>
            <button
              type="button"
              onClick={() => setOpenDropdown(openDropdown === "status" ? null : "status")}
              className="w-full h-12 px-4 rounded-xl border text-left text-[14px] font-medium flex items-center justify-between cursor-pointer transition-colors"
              style={{
                borderColor: openDropdown === "status" ? "#1B4F8B" : "#E2E8F0",
                backgroundColor: "white",
              }}
            >
              <span className="text-[#0F172A]">{form.status}</span>
              <ChevronDown size={16} className={`text-[#94A3B8] transition-transform ${openDropdown === "status" ? "rotate-180" : ""}`} />
            </button>
            {openDropdown === "status" && (
              <div className="absolute z-20 left-0 right-0 mt-1 bg-white rounded-xl border border-[#E2E8F0] shadow-lg overflow-hidden">
                {statusOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => { setForm((p) => ({ ...p, status: opt })); setOpenDropdown(null); }}
                    className="w-full text-left px-4 py-2.5 text-[13px] hover:bg-[#F8FAFC] cursor-pointer transition-colors"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-[13px] font-semibold text-[#0F172A] mb-2">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
              className="w-full h-24 px-4 py-3 rounded-xl border border-[#E2E8F0] text-[14px] font-medium outline-none focus:border-[#1B4F8B] resize-none"
              placeholder="Additional notes"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-[#E2E8F0] p-6 flex gap-3">
          <button
            onClick={onSave}
            className="flex-1 h-12 rounded-xl text-[14px] font-bold text-white cursor-pointer transition-colors hover:opacity-90"
            style={{ backgroundColor: "#0B2545" }}
          >
            Save Driver
          </button>
          <button
            onClick={onClose}
            className="h-12 px-5 rounded-xl text-[14px] font-semibold text-[#64748B] border border-[#E2E8F0] hover:bg-[#F8FAFC] cursor-pointer transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}