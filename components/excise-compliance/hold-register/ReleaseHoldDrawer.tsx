"use client";

import { useState } from "react";
import { useToast } from "@/components/ToastContext";
import { X, Paperclip, Unlock, Clock } from "lucide-react";

interface ReleaseHoldDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (releaseNotes: string) => void;
  holdNum: string;
}

export default function ReleaseHoldDrawer({
  isOpen,
  onClose,
  onSubmit,
  holdNum,
}: ReleaseHoldDrawerProps) {
  const { addToast } = useToast();
  const [releaseReason, setReleaseReason] = useState("");
  const [releaseNotes, setReleaseNotes] = useState("");
  const [docAttached, setDocAttached] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!releaseReason.trim()) newErrors.releaseReason = "Release reason is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      addToast("Please enter a release reason", "error");
      return;
    }
    onSubmit(`${releaseReason} — ${releaseNotes}`);
    setReleaseReason("");
    setReleaseNotes("");
    setDocAttached(false);
    setErrors({});
  };

  const handleAttach = () => {
    setDocAttached(true);
    addToast("Supporting document attached", "success");
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[60] transition-opacity"
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
          <div className="flex items-center gap-2.5">
            <h2 className="text-[16px] font-bold text-[#0F172A]">Release Hold</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <div className="mb-5 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <div className="flex items-center gap-2 mb-1">
              <Unlock size={14} className="text-[#16A34A]" />
              <span className="text-[12px] font-semibold text-[#64748B]">Hold #</span>
            </div>
            <span className="text-[15px] font-bold text-[#0F172A]">{holdNum}</span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                Release Reason <span className="text-[#DC2626]">*</span>
              </label>
              <input
                type="text"
                value={releaseReason}
                onChange={(e) => {
                  setReleaseReason(e.target.value);
                  setErrors((p) => ({ ...p, releaseReason: "" }));
                }}
                placeholder="Enter reason for releasing hold"
                className={`w-full h-10 px-3 rounded-lg border text-[13px] outline-none transition-colors ${
                  errors.releaseReason ? "border-[#DC2626] bg-[#FEE2E2]/20" : "border-[#E2E8F0] focus:border-[#16A34A]"
                }`}
              />
              {errors.releaseReason && (
                <p className="text-[11px] text-[#DC2626] mt-1">{errors.releaseReason}</p>
              )}
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                Release Notes
              </label>
              <textarea
                value={releaseNotes}
                onChange={(e) => setReleaseNotes(e.target.value)}
                placeholder="Enter detailed release notes"
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#16A34A] transition-colors resize-none"
              />
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                Supporting Document
              </label>
              {docAttached ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 h-10 px-3 rounded-lg border border-[#DCFCE7] bg-[#DCFCE7] text-[#16A34A] text-[13px] font-medium">
                    <Paperclip size={16} />
                    release-doc-001.pdf
                  </div>
                  <button
                    onClick={() => setDocAttached(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#FEE2E2] text-[#DC2626] cursor-pointer transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleAttach}
                  className="flex items-center gap-2 h-10 px-4 rounded-lg border border-dashed border-[#CBD5E1] text-[13px] text-[#64748B] cursor-pointer hover:border-[#16A34A] hover:text-[#16A34A] transition-colors"
                >
                  <Paperclip size={16} />
                  Attach supporting document
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <div className="flex items-center gap-2 mb-1">
                  <Clock size={14} className="text-[#64748B]" />
                  <span className="text-[11px] font-semibold text-[#64748B] uppercase">Released By</span>
                </div>
                <span className="text-[13px] font-bold text-[#0F172A]">Current User</span>
              </div>
              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <div className="flex items-center gap-2 mb-1">
                  <Clock size={14} className="text-[#64748B]" />
                  <span className="text-[11px] font-semibold text-[#64748B] uppercase">Released At</span>
                </div>
                <span className="text-[13px] font-bold text-[#0F172A]">31 May 2026 12:30</span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-5 py-4 border-t border-[#E2E8F0] flex items-center gap-3">
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 h-10 px-5 rounded-xl text-[13px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90"
            style={{ backgroundColor: "#16A34A" }}
          >
            <Unlock size={16} />
            Release Hold
          </button>
          <button
            onClick={onClose}
            className="flex items-center gap-2 h-10 px-4 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] cursor-pointer transition-colors hover:bg-[#F8FAFC]"
          >
            <X size={16} />
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}