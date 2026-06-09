"use client";

import { useState, useEffect } from "react";
import { X, Hash, Truck, User, Calendar, Clock, Package, Save, Ban, FileDown } from "lucide-react";
import ScopeBadge from "@/components/ScopeBadge";
import { useToast } from "@/components/ToastContext";

interface BookPickupDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bay?: string;
  hour?: string;
}

export default function BookPickupDrawer({ isOpen, onClose, bay, hour }: BookPickupDrawerProps) {
  const [awb, setAwb] = useState("");
  const [do_, setDo] = useState("");
  const [driver, setDriver] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [cargoPieces, setCargoPieces] = useState("");
  const [loadingTime, setLoadingTime] = useState("30");
  const [notes, setNotes] = useState("");
  const { addToast } = useToast();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      if (bay && hour) {
        setPreferredDate("2026-06-01");
        setPreferredTime(hour);
      }
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, bay, hour]);

  const handleBook = () => {
    addToast("Pickup slot booked.", "success");
    onClose();
  };

  const handleReschedule = () => {
    addToast("Pickup rescheduled.", "success");
    onClose();
  };

  const handleCancel = () => {
    addToast("Booking cancelled.", "success");
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
            <h2 className="text-[16px] font-bold text-[#0F172A]">Book Pickup Slot</h2>
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
            {bay && hour && (
              <div className="p-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#EBF0F7] flex items-center justify-center">
                    <Truck size={16} className="text-[#1B4F8B]" />
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-[#0F172A]">{bay}</p>
                    <p className="text-[11px] text-[#64748B]">{hour} — 01 Jun 2026</p>
                  </div>
                </div>
              </div>
            )}

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
                <select
                  value={driver}
                  onChange={(e) => setDriver(e.target.value)}
                  className="w-full h-10 pl-9 pr-8 rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors appearance-none bg-white"
                >
                  <option value="">Select driver</option>
                  <option value="Ahmed Raza">Ahmed Raza — 42101-1234567-1</option>
                  <option value="Imran Ali">Imran Ali — 35201-2345678-3</option>
                  <option value="Kashif Khan">Kashif Khan — 42101-3456789-5</option>
                  <option value="Bilal Ahmed">Bilal Ahmed — 36401-4567890-7</option>
                  <option value="Nadeem Hussain">Nadeem Hussain — 35201-6789012-1</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[12px] font-semibold text-[#64748B] mb-1 block">Vehicle</label>
              <div className="relative">
                <Truck size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                <select
                  value={vehicle}
                  onChange={(e) => setVehicle(e.target.value)}
                  className="w-full h-10 pl-9 pr-8 rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors appearance-none bg-white"
                >
                  <option value="">Select vehicle</option>
                  <option value="KHI-4582">KHI-4582 — Truck, 3.5T</option>
                  <option value="BJU-7721">BJU-7721 — Pickup, 1.5T</option>
                  <option value="KHI-9934">KHI-9934 — Container, 20FT</option>
                  <option value="LHE-2217">LHE-2217 — Truck, 5T</option>
                  <option value="KHI-9921">KHI-9921 — Truck, 4T</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[12px] font-semibold text-[#64748B] mb-1 block">Preferred Date</label>
              <div className="relative">
                <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                <input
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors bg-white"
                />
              </div>
            </div>

            <div>
              <label className="text-[12px] font-semibold text-[#64748B] mb-1 block">Preferred Time Slot</label>
              <div className="relative">
                <Clock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                <input
                  type="time"
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors bg-white"
                />
              </div>
            </div>

            <div>
              <label className="text-[12px] font-semibold text-[#64748B] mb-1 block">Cargo Pieces</label>
              <div className="relative">
                <Package size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                <input
                  type="number"
                  value={cargoPieces}
                  onChange={(e) => setCargoPieces(e.target.value)}
                  className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors bg-white"
                  placeholder="e.g. 42"
                />
              </div>
            </div>

            <div>
              <label className="text-[12px] font-semibold text-[#64748B] mb-1 block">Estimated Loading Time (mins)</label>
              <select
                value={loadingTime}
                onChange={(e) => setLoadingTime(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors bg-white pr-8"
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">1 hour</option>
                <option value="90">1.5 hours</option>
                <option value="120">2 hours</option>
              </select>
            </div>

            <div>
              <label className="text-[12px] font-semibold text-[#64748B] mb-1 block">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full h-24 px-3 py-2 rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors bg-white resize-none"
                placeholder="Additional pickup instructions"
                maxLength={500}
              />
              <p className="text-[11px] text-[#94A3B8] mt-1 text-right">{notes.length}/500</p>
            </div>
          </div>
        </div>

        <div className="px-5 py-4 border-t border-[#E2E8F0] flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handleBook}
              className="flex-1 flex items-center justify-center gap-2 h-10 rounded-xl text-[13px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90"
              style={{ backgroundColor: "#0B2545" }}
            >
              <Save size={16} />
              <span className="whitespace-nowrap">Book Slot</span>
            </button>
            <button
              onClick={handleReschedule}
              className="flex items-center justify-center gap-2 h-10 px-4 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] cursor-pointer hover:bg-[#F8FAFC] transition-colors"
            >
              <Calendar size={16} />
              <span className="whitespace-nowrap">Reschedule</span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCancel}
              className="flex-1 flex items-center justify-center gap-2 h-10 rounded-xl text-[13px] font-semibold border border-[#DC2626]/30 text-[#DC2626] cursor-pointer hover:bg-[#FEE2E2] transition-colors"
            >
              <Ban size={16} />
              <span className="whitespace-nowrap">Cancel Booking</span>
            </button>
            <button
              onClick={() => addToast("Booking confirmation downloaded.", "success")}
              className="flex items-center justify-center gap-2 h-10 px-4 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] cursor-pointer hover:bg-[#F8FAFC] transition-colors"
            >
              <FileDown size={16} />
              <span className="whitespace-nowrap">Download</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}