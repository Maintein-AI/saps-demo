"use client";

import { useState } from "react";
import { AlertTriangle, Pencil, Check, X, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ToastContext";

interface ExtractedField {
  id: string;
  label: string;
  value: string;
  confidence: number;
  corrected?: string;
}

const INITIAL_FIELDS: ExtractedField[] = [
  { id: "issuer", label: "Issuer / Forwarding Agent Name", value: "DB Schenker Pakistan", confidence: 94 },
  { id: "cha", label: "CHA Name", value: "Gerry's International", confidence: 89 },
  { id: "awb", label: "AWB #", value: "157-44891233", confidence: 97 },
  { id: "do", label: "DO #", value: "DO-2026-8891", confidence: 92 },
  { id: "consignee", label: "Consignee", value: "TCS Logistics Pvt Ltd", confidence: 85 },
  { id: "driver", label: "Driver Name", value: "Ahmed Khan", confidence: 96 },
  { id: "cnic", label: "Driver CNIC", value: "35202-1234567-8", confidence: 91 },
  { id: "vehicle", label: "Vehicle Number", value: "LHR-2847", confidence: 88 },
  { id: "validFrom", label: "Valid From", value: "2026-05-28", confidence: 95 },
  { id: "validUntil", label: "Valid Until", value: "2026-06-28", confidence: 93 },
  { id: "signatory", label: "Authorized Signatory", value: "Muhammad Asif", confidence: 82 },
  { id: "remarks", label: "Remarks", value: "Pickup authorization for electronics shipment", confidence: 78 },
];

interface OCRReviewCardProps {
  visible: boolean;
  onSave: () => void;
  onReject: () => void;
  onDownload: () => void;
}

export default function OCRReviewCard({
  visible,
  onSave,
  onReject,
  onDownload,
}: OCRReviewCardProps) {
  const { addToast } = useToast();
  const [fields, setFields] = useState<ExtractedField[]>(INITIAL_FIELDS);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  if (!visible) return null;

  const handleEdit = (field: ExtractedField) => {
    setEditingId(field.id);
    setEditValue(field.corrected ?? field.value);
  };

  const handleSaveEdit = (id: string) => {
    setFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, corrected: editValue } : f))
    );
    setEditingId(null);
    addToast("Field corrected", "success");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditValue("");
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return { text: "#16A34A", bg: "#DCFCE7" };
    if (confidence >= 75) return { text: "#D97706", bg: "#FEF3C7" };
    return { text: "#DC2626", bg: "#FEE2E2" };
  };

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[14px] font-bold text-[#0F172A]">OCR Extraction Review</h3>
      </div>

      <div className="space-y-3">
        {fields.map((field) => {
          const c = getConfidenceColor(field.confidence);
          const isEditing = editingId === field.id;
          const displayValue = field.corrected ?? field.value;
          const isCorrected = !!field.corrected;
          const isLow = field.confidence < 75;

          return (
            <div
              key={field.id}
              className="flex items-start gap-3 p-3 rounded-xl border"
              style={{
                borderColor: isLow ? "#FEE2E2" : "#E2E8F0",
                backgroundColor: isLow ? "#FEF2F2" : "#F8FAFC",
              }}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[12px] font-semibold text-[#0F172A]">
                    {field.label}
                  </span>
                  {isLow && (
                    <AlertTriangle size={12} className="text-[#DC2626] flex-shrink-0" />
                  )}
                </div>

                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="flex-1 h-8 px-2.5 rounded-lg border border-[#E2E8F0] text-[12px] outline-none focus:border-[#0B2545]"
                    />
                    <button
                      onClick={() => handleSaveEdit(field.id)}
                      className="w-7 h-7 rounded-lg bg-[#16A34A] flex items-center justify-center text-white cursor-pointer"
                    >
                      <Check size={14} />
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="w-7 h-7 rounded-lg bg-[#F1F5F9] flex items-center justify-center text-[#64748B] cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[13px] font-medium"
                      style={{
                        color: isCorrected ? "#0B2545" : "#0F172A",
                        textDecoration: isCorrected ? "underline" : "none",
                        textDecorationColor: "#0B2545",
                        textDecorationStyle: "dashed",
                      }}
                    >
                      {displayValue}
                    </span>
                    {isCorrected && (
                      <span className="text-[10px] font-medium text-[#0B2545] bg-[#EBF0F7] px-1.5 py-0.5 rounded">
                        edited
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <span
                  className="h-5 px-2 rounded-full text-[10px] font-bold"
                  style={{ backgroundColor: c.bg, color: c.text }}
                >
                  {field.confidence}%
                </span>
                {!isEditing && (
                  <button
                    onClick={() => handleEdit(field)}
                    className="w-7 h-7 rounded-lg hover:bg-[#F1F5F9] flex items-center justify-center text-[#64748B] cursor-pointer"
                  >
                    <Pencil size={13} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#E2E8F0]">
        <button
          onClick={() => {
            setFields(INITIAL_FIELDS);
            addToast("OCR results refreshed", "success");
          }}
          className="flex items-center gap-2 h-9 px-3 rounded-lg border border-[#E2E8F0] text-[12px] font-semibold text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer"
        >
          <RefreshCw size={14} />
          Re-run OCR
        </button>
        <button
          onClick={onSave}
          className="flex items-center gap-2 h-9 px-3 rounded-lg text-[12px] font-semibold text-white cursor-pointer hover:opacity-90"
          style={{ backgroundColor: "#0B2545" }}
        >
          <Check size={14} />
          Save Corrected Data
        </button>
        <button
          onClick={onReject}
          className="flex items-center gap-2 h-9 px-3 rounded-lg border border-[#DC2626]/30 text-[12px] font-semibold text-[#DC2626] hover:bg-[#DC2626]/10 cursor-pointer"
        >
          <X size={14} />
          Reject Letter
        </button>
        <button
          onClick={onDownload}
          className="flex items-center gap-2 h-9 px-3 rounded-lg border border-[#E2E8F0] text-[12px] font-semibold text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer"
        >
          Download
        </button>
      </div>
    </div>
  );
}