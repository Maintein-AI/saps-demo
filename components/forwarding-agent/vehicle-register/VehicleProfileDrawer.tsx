"use client";

import { X, Truck, Save, Ban } from "lucide-react";
import { useState, useEffect } from "react";
import ScopeBadge from "@/components/ScopeBadge";
import { useToast } from "@/components/ToastContext";

interface Vehicle {
  id: string;
  plate: string;
  type: string;
  capacity: string;
  photo: string;
  owner: string;
  insuranceExpiry: string;
  lastVisit: string;
  status: "Active" | "Blocked" | "Insurance Expired" | "Verification Required";
  notes: string;
}

interface VehicleProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle?: Vehicle;
  mode: "add" | "edit";
}

const emptyVehicle: Vehicle = {
  id: "",
  plate: "",
  type: "Truck",
  capacity: "",
  photo: "",
  owner: "",
  insuranceExpiry: "",
  lastVisit: "",
  status: "Active",
  notes: "",
};

export default function VehicleProfileDrawer({ isOpen, onClose, vehicle, mode }: VehicleProfileDrawerProps) {
  const [form, setForm] = useState<Vehicle>(emptyVehicle);
  const { addToast } = useToast();

  useEffect(() => {
    if (vehicle) {
      setForm(vehicle);
    } else {
      setForm(emptyVehicle);
    }
  }, [vehicle]);

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

  const handleSave = () => {
    addToast("Vehicle record saved.", "success");
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
            <h2 className="text-[16px] font-bold text-[#0F172A]">Vehicle Profile</h2>
            <ScopeBadge type="exc" />
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
              <div className="w-20 h-20 rounded-xl bg-[#EBF0F7] flex items-center justify-center">
                <Truck size={32} className="text-[#1B4F8B]" />
              </div>
              <button className="text-[12px] font-semibold text-[#1B4F8B] cursor-pointer hover:underline">
                Upload Photo
              </button>
            </div>

            <div>
              <label className="text-[12px] font-semibold text-[#64748B] mb-1 block">Plate #</label>
              <input
                type="text"
                value={form.plate}
                onChange={(e) => handleChange("plate", e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors bg-white font-mono"
                placeholder="e.g. KHI-4582"
              />
            </div>

            <div>
              <label className="text-[12px] font-semibold text-[#64748B] mb-1 block">Vehicle Type</label>
              <select
                value={form.type}
                onChange={(e) => handleChange("type", e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors bg-white pr-8"
              >
                <option value="Pickup">Pickup</option>
                <option value="Truck">Truck</option>
                <option value="Container">Container</option>
                <option value="Bike">Bike</option>
                <option value="Car">Car</option>
                <option value="Van">Van</option>
              </select>
            </div>

            <div>
              <label className="text-[12px] font-semibold text-[#64748B] mb-1 block">Capacity</label>
              <input
                type="text"
                value={form.capacity}
                onChange={(e) => handleChange("capacity", e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors bg-white"
                placeholder="e.g. 3.5 T"
              />
            </div>

            <div>
              <label className="text-[12px] font-semibold text-[#64748B] mb-1 block">Owner</label>
              <input
                type="text"
                value={form.owner}
                onChange={(e) => handleChange("owner", e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors bg-white"
                placeholder="Owner name"
              />
            </div>

            <div>
              <label className="text-[12px] font-semibold text-[#64748B] mb-1 block">Insurance Expiry</label>
              <input
                type="date"
                value={form.insuranceExpiry}
                onChange={(e) => handleChange("insuranceExpiry", e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors bg-white"
              />
            </div>

            <div>
              <label className="text-[12px] font-semibold text-[#64748B] mb-1 block">Last Visit</label>
              <input
                type="date"
                value={form.lastVisit}
                onChange={(e) => handleChange("lastVisit", e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors bg-white"
              />
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
                <option value="Insurance Expired">Insurance Expired</option>
                <option value="Verification Required">Verification Required</option>
              </select>
            </div>

            <div>
              <label className="text-[12px] font-semibold text-[#64748B] mb-1 block">Notes</label>
              <textarea
                value={form.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                className="w-full h-24 px-3 py-2 rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors bg-white resize-none"
                placeholder="Internal notes about this vehicle"
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