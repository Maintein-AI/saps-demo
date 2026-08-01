"use client";

import { useState } from "react";
import { X, Truck, Send, Save } from "lucide-react";
import { useToast } from "../../ToastContext";

interface VehiclePreRegDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  defaultData?: {
    awb?: string;
    do?: string;
    vehicle?: string;
    driver?: string;
  };
}

export default function VehiclePreRegDrawer({
  isOpen,
  onClose,
  defaultData,
}: VehiclePreRegDrawerProps) {
  const { addToast } = useToast();
  const [form, setForm] = useState({
    awb: defaultData?.awb || "",
    do: defaultData?.do || "",
    vehicle: defaultData?.vehicle || "",
    vehicleType: "",
    driverName: defaultData?.driver || "",
    driverCnic: "",
    driverMobile: "",
    plannedArrivalDate: "",
    plannedArrivalTime: "",
    notes: "",
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    addToast("Vehicle pre-registration saved as draft.", "success");
    onClose();
  };

  const handleSubmit = () => {
    addToast("Vehicle pre-registration submitted to SAPS.", "success");
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
            <h2 className="text-[16px] font-bold text-[#0F172A]">Vehicle Entry Pre-registration</h2>
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
              <label className="text-[12px] font-semibold text-[#0F172A]">Vehicle #</label>
              <input type="text" value={form.vehicle} onChange={(e) => handleChange("vehicle", e.target.value)} className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] outline-none focus:border-[#1B4F8B]" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[12px] font-semibold text-[#0F172A]">Vehicle Type</label>
              <select value={form.vehicleType} onChange={(e) => handleChange("vehicleType", e.target.value)} className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] outline-none focus:border-[#1B4F8B] appearance-none bg-white">
                <option value="">Select type</option>
                <option value="Pickup">Pickup</option>
                <option value="Van">Van</option>
                <option value="Truck">Truck</option>
                <option value="Refrigerated Truck">Refrigerated Truck</option>
                <option value="Container">Container</option>
                <option value="Flatbed">Flatbed</option>
                <option value="Tanker">Tanker</option>
                <option value="Dumper">Dumper</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[12px] font-semibold text-[#0F172A]">Driver Name</label>
            <input type="text" value={form.driverName} onChange={(e) => handleChange("driverName", e.target.value)} className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] outline-none focus:border-[#1B4F8B]" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[12px] font-semibold text-[#0F172A]">Driver CNIC</label>
              <input type="text" value={form.driverCnic} onChange={(e) => handleChange("driverCnic", e.target.value)} placeholder="XXXXX-XXXXXXX-X" className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] outline-none focus:border-[#1B4F8B]" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[12px] font-semibold text-[#0F172A]">Driver Mobile</label>
              <input type="text" value={form.driverMobile} onChange={(e) => handleChange("driverMobile", e.target.value)} placeholder="03XX-XXXXXXX" className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] outline-none focus:border-[#1B4F8B]" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[12px] font-semibold text-[#0F172A]">Planned Arrival Date</label>
              <input type="date" value={form.plannedArrivalDate} onChange={(e) => handleChange("plannedArrivalDate", e.target.value)} className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] outline-none focus:border-[#1B4F8B]" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[12px] font-semibold text-[#0F172A]">Planned Arrival Time</label>
              <input type="time" value={form.plannedArrivalTime} onChange={(e) => handleChange("plannedArrivalTime", e.target.value)} className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] outline-none focus:border-[#1B4F8B]" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[12px] font-semibold text-[#0F172A]">Notes</label>
            <textarea value={form.notes} onChange={(e) => handleChange("notes", e.target.value)} rows={3} className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] text-[13px] outline-none focus:border-[#1B4F8B] resize-none" placeholder="Any additional notes..." />
          </div>
        </div>

        <div className="flex items-center gap-3 p-5 border-t border-[#E2E8F0] flex-shrink-0">
          <button onClick={handleSave} className="flex items-center gap-2 h-10 px-4 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer transition-colors">
            <Save size={16} />
            Save Draft
          </button>
          <button onClick={handleSubmit} className="flex items-center gap-2 h-10 px-4 rounded-xl text-[13px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90" style={{ backgroundColor: "#0B2545" }}>
            <Send size={16} />
            Submit to SAPS
          </button>
        </div>
      </div>
    </>
  );
}