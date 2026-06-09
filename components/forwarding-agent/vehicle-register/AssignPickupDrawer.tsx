"use client";

import { X, Truck, Save, Ban, Hash, User, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import ScopeBadge from "@/components/ScopeBadge";
import { useToast } from "@/components/ToastContext";

interface Vehicle {
  id: string;
  plate: string;
  type: string;
}

interface AssignPickupDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle?: Vehicle;
}

export default function AssignPickupDrawer({ isOpen, onClose, vehicle }: AssignPickupDrawerProps) {
  const [awb, setAwb] = useState("");
  const [do_, setDo] = useState("");
  const [driver, setDriver] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupSlot, setPickupSlot] = useState("");
  const [notes, setNotes] = useState("");
  const { addToast } = useToast();

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

  const handleSave = () => {
    addToast(`${vehicle?.plate || "Vehicle"} assigned to pickup.`, "success");
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
          maxWidth: 380,
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
        }}
      >
        <div className="flex items-center justify-between px-5 h-[64px] border-b border-[#E2E8F0] flex-shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="text-[16px] font-bold text-[#0F172A]">Assign Vehicle to Pickup</h2>
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
            <div className="p-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#EBF0F7] flex items-center justify-center">
                  <Truck size={16} className="text-[#1B4F8B]" />
                </div>
                <div>
                  <p className="text-[13px] font-bold text-[#0F172A]">{vehicle?.plate || "Select vehicle"}</p>
                  <p className="text-[11px] text-[#64748B]">{vehicle?.type || ""}</p>
                </div>
              </div>
            </div>

            <div>
              <label className="text-[12px] font-semibold text-[#64748B] mb-1 block">Vehicle #</label>
              <input
                type="text"
                value={vehicle?.plate || ""}
                readOnly
                className="w-full h-10 px-3 rounded-xl border border-[#E2E8F0] text-[13px] text-[#94A3B8] bg-[#F8FAFC] outline-none cursor-default font-mono"
              />
            </div>

            <div>
              <label className="text-[12px] font-semibold text-[#64748B] mb-1 block">AWB #</label>
              <div className="relative">
                <Hash size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                <input
                  type="text"
                  value={awb}
                  onChange={(e) => setAwb(e.target.value)}
                  className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors bg-white"
                  placeholder="e.g. 214-45678901"
                />
              </div>
            </div>

            <div>
              <label className="text-[12px] font-semibold text-[#64748B] mb-1 block">DO #</label>
              <div className="relative">
                <Hash size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                <input
                  type="text"
                  value={do_}
                  onChange={(e) => setDo(e.target.value)}
                  className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors bg-white"
                  placeholder="e.g. DO-90871"
                />
              </div>
            </div>

            <div>
              <label className="text-[12px] font-semibold text-[#64748B] mb-1 block">Driver</label>
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                <input
                  type="text"
                  value={driver}
                  onChange={(e) => setDriver(e.target.value)}
                  className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors bg-white"
                  placeholder="Driver name"
                />
              </div>
            </div>

            <div>
              <label className="text-[12px] font-semibold text-[#64748B] mb-1 block">Pickup Date</label>
              <div className="relative">
                <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                <input
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors bg-white"
                />
              </div>
            </div>

            <div>
              <label className="text-[12px] font-semibold text-[#64748B] mb-1 block">Pickup Slot</label>
              <input
                type="time"
                value={pickupSlot}
                onChange={(e) => setPickupSlot(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors bg-white"
              />
            </div>

            <div>
              <label className="text-[12px] font-semibold text-[#64748B] mb-1 block">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full h-24 px-3 py-2 rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors bg-white resize-none"
                placeholder="Additional notes"
                maxLength={500}
              />
              <p className="text-[11px] text-[#94A3B8] mt-1 text-right">{notes.length}/500</p>
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
            <span className="whitespace-nowrap">Assign</span>
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