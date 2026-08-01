"use client";

import { useState } from "react";
import { useToast } from "@/components/ToastContext";
import { X, Paperclip, Plus, AlertTriangle } from "lucide-react";

interface AddHoldDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (hold: {
    holdNum: string;
    awb: string;
    hawb: string;
    holdType: string;
    reason: string;
    createdBy: string;
    owner: string;
    status: string;
    cargoClass: string;
  }) => void;
}

const holdTypes = ["Customs", "ANF", "ASF", "Internal", "Discrepancy"];
const priorities = ["Low", "Medium", "High", "Critical"];

export default function AddHoldDrawer({ isOpen, onClose, onSubmit }: AddHoldDrawerProps) {
  const { addToast } = useToast();
  const [awb, setAwb] = useState("");
  const [hawb, setHawb] = useState("");
  const [holdType, setHoldType] = useState("Customs");
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [owner, setOwner] = useState("Compliance");
  const [priority, setPriority] = useState("Medium");
  const [notes, setNotes] = useState("");
  const [docAttached, setDocAttached] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!awb.trim()) newErrors.awb = "AWB # is required";
    if (!reason.trim()) newErrors.reason = "Reason is required";
    if (!description.trim()) newErrors.description = "Description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      addToast("Please fill in all required fields", "error");
      return;
    }
    const holdNum = `HOLD-2026-00${Math.floor(120 + Math.random() * 80)}`;
    onSubmit({
      holdNum,
      awb,
      hawb,
      holdType,
      reason,
      createdBy: "Current User",
      owner,
      status: "Active",
      cargoClass: "General Cargo",
    });
    setAwb("");
    setHawb("");
    setHoldType("Customs");
    setReason("");
    setDescription("");
    setOwner("Compliance");
    setPriority("Medium");
    setNotes("");
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
            <h2 className="text-[16px] font-bold text-[#0F172A]">Add Hold</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <div className="space-y-4">
            <div>
              <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                AWB # <span className="text-[#DC2626]">*</span>
              </label>
              <input
                type="text"
                value={awb}
                onChange={(e) => {
                  setAwb(e.target.value);
                  setErrors((p) => ({ ...p, awb: "" }));
                }}
                placeholder="Enter AWB number"
                className={`w-full h-10 px-3 rounded-lg border text-[13px] outline-none transition-colors ${
                  errors.awb ? "border-[#DC2626] bg-[#FEE2E2]/20" : "border-[#E2E8F0] focus:border-[#1B4F8B]"
                }`}
              />
              {errors.awb && (
                <p className="text-[11px] text-[#DC2626] mt-1">{errors.awb}</p>
              )}
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                HAWB #
              </label>
              <input
                type="text"
                value={hawb}
                onChange={(e) => setHawb(e.target.value)}
                placeholder="Enter HAWB number"
                className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors"
              />
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                Hold Type
              </label>
              <div className="flex flex-wrap gap-2">
                {holdTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setHoldType(type)}
                    className="h-8 px-3 rounded-lg text-[12px] font-semibold cursor-pointer transition-colors whitespace-nowrap"
                    style={{
                      backgroundColor: holdType === type ? "#EBF0F7" : "#F8FAFC",
                      color: holdType === type ? "#0B2545" : "#64748B",
                      border: "1px solid",
                      borderColor: holdType === type ? "#0B2545" : "#E2E8F0",
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                Reason <span className="text-[#DC2626]">*</span>
              </label>
              <input
                type="text"
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  setErrors((p) => ({ ...p, reason: "" }));
                }}
                placeholder="Enter hold reason"
                className={`w-full h-10 px-3 rounded-lg border text-[13px] outline-none transition-colors ${
                  errors.reason ? "border-[#DC2626] bg-[#FEE2E2]/20" : "border-[#E2E8F0] focus:border-[#1B4F8B]"
                }`}
              />
              {errors.reason && (
                <p className="text-[11px] text-[#DC2626] mt-1">{errors.reason}</p>
              )}
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                Description <span className="text-[#DC2626]">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setErrors((p) => ({ ...p, description: "" }));
                }}
                placeholder="Describe the hold in detail"
                rows={3}
                className={`w-full px-3 py-2 rounded-lg border text-[13px] outline-none resize-none transition-colors ${
                  errors.description ? "border-[#DC2626] bg-[#FEE2E2]/20" : "border-[#E2E8F0] focus:border-[#1B4F8B]"
                }`}
              />
              {errors.description && (
                <p className="text-[11px] text-[#DC2626] mt-1">{errors.description}</p>
              )}
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                Owner
              </label>
              <input
                type="text"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                placeholder="Enter owner department"
                className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors"
              />
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                Priority
              </label>
              <div className="flex flex-wrap gap-2">
                {priorities.map((p) => (
                  <button
                    key={p}
                    onClick={() => setPriority(p)}
                    className="h-8 px-3 rounded-lg text-[12px] font-semibold cursor-pointer transition-colors whitespace-nowrap"
                    style={{
                      backgroundColor: priority === p ? "#EBF0F7" : "#F8FAFC",
                      color: priority === p ? "#0B2545" : "#64748B",
                      border: "1px solid",
                      borderColor: priority === p ? "#0B2545" : "#E2E8F0",
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                Supporting Document
              </label>
              {docAttached ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 h-10 px-3 rounded-lg border border-[#DCFCE7] bg-[#DCFCE7] text-[#16A34A] text-[13px] font-medium">
                    <Paperclip size={16} />
                    hold-doc-001.pdf
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
                  className="flex items-center gap-2 h-10 px-4 rounded-lg border border-dashed border-[#CBD5E1] text-[13px] text-[#64748B] cursor-pointer hover:border-[#1B4F8B] hover:text-[#1B4F8B] transition-colors"
                >
                  <Paperclip size={16} />
                  Attach supporting document
                </button>
              )}
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter any additional notes"
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors resize-none"
              />
            </div>
          </div>
        </div>

        <div className="px-5 py-4 border-t border-[#E2E8F0] flex items-center gap-3">
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 h-10 px-5 rounded-xl text-[13px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90"
            style={{ backgroundColor: "#0B2545" }}
          >
            <Plus size={16} />
            Add Hold
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