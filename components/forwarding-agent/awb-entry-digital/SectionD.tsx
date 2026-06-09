"use client";

import { useState } from "react";
import { Upload, FileText, Check, X, AlertTriangle } from "lucide-react";
import ScopeBadge from "../../ScopeBadge";

interface UploadFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: "uploaded" | "error" | "pending";
}

interface SectionDProps {
  data: Record<string, any>;
  onChange: (field: string, value: any) => void;
  errors: string[];
}

const requiredDocs = [
  { key: "mawbPdf", label: "MAWB PDF", required: true, accept: ".pdf,.jpg,.jpeg,.png" },
  { key: "hawbPdf", label: "HAWB PDF", required: true, accept: ".pdf,.jpg,.jpeg,.png" },
  { key: "commercialInvoice", label: "Commercial Invoice", required: true, accept: ".pdf,.jpg,.jpeg,.png" },
  { key: "packingList", label: "Packing List", required: true, accept: ".pdf,.jpg,.jpeg,.png" },
  { key: "certificates", label: "Certificates (DGR/PER/AVI)", required: false, accept: ".pdf,.jpg,.jpeg,.png", conditional: true },
  { key: "notoc", label: "NOTOC (if special cargo)", required: false, accept: ".pdf,.jpg,.jpeg,.png", conditional: true },
  { key: "otherDocs", label: "Other Supporting Documents", required: false, accept: ".pdf,.jpg,.jpeg,.png", multiple: true },
];

export default function SectionD({ data, onChange, errors }: SectionDProps) {
  const [dragOver, setDragOver] = useState<string | null>(null);

  const cargoClass = data.cargoClass || "";
  const needsSpecialCerts = ["DGR", "PER", "AVI"].includes(cargoClass);
  const needsNotoc = ["DGR", "PER", "AVI", "VAL"].includes(cargoClass);

  const handleFileSelect = (key: string, files: FileList | null, multiple?: boolean) => {
    if (!files || files.length === 0) return;

    const existing = (data[key] || []) as UploadFile[];
    const newFiles: UploadFile[] = Array.from(files).map((file) => ({
      id: Math.random().toString(36).substring(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      status: file.size > 10 * 1024 * 1024 ? "error" : "uploaded",
    }));

    if (multiple) {
      onChange(key, [...existing, ...newFiles]);
    } else {
      onChange(key, newFiles);
    }
  };

  const removeFile = (key: string, id: string) => {
    const existing = (data[key] || []) as UploadFile[];
    onChange(key, existing.filter((f) => f.id !== id));
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const getFiles = (key: string): UploadFile[] => {
    const val = data[key];
    if (!val) return [];
    if (Array.isArray(val)) return val;
    return [val];
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 mb-1">
        <h3 className="text-[14px] font-bold text-[#0F172A]">D. Document Uploads</h3>
        <ScopeBadge type="exc" />
      </div>

      {errors.includes("documents") && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-[#DC2626]/5 border border-[#DC2626]/20 text-[13px] text-[#DC2626]">
          <AlertTriangle size={16} />
          <span>All required documents must be uploaded before submission.</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {requiredDocs.map((doc) => {
          const isConditional = doc.conditional;
          if (doc.key === "certificates" && !needsSpecialCerts) return null;
          if (doc.key === "notoc" && !needsNotoc) return null;

          const files = getFiles(doc.key);
          const hasError = files.some((f) => f.status === "error");
          const isMissing = doc.required && files.length === 0;
          const isDragOver = dragOver === doc.key;

          return (
            <div key={doc.key} className="space-y-2">
              <div className="flex items-center gap-2">
                <label className="text-[12px] font-semibold text-[#0F172A]">
                  {doc.label}
                  {doc.required && <span className="text-[#DC2626]"> *</span>}
                </label>
                {isConditional && (
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-[#FEF3C7] text-[#92400E]">
                    Conditional
                  </span>
                )}
              </div>

              <div
                className="relative border-2 border-dashed rounded-xl p-4 transition-colors"
                style={{
                  borderColor: isDragOver
                    ? "#1B4F8B"
                    : hasError || isMissing
                    ? "#DC2626"
                    : "#E2E8F0",
                  backgroundColor: isDragOver ? "#EBF0F7" : "#F8FAFC",
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(doc.key);
                }}
                onDragLeave={() => setDragOver(null)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(null);
                  handleFileSelect(doc.key, e.dataTransfer.files, doc.multiple);
                }}
              >
                {files.length === 0 ? (
                  <div className="flex flex-col items-center gap-2 py-2">
                    <Upload size={20} className="text-[#94A3B8]" />
                    <div className="text-center">
                      <p className="text-[12px] text-[#64748B]">
                        Drag & drop or{" "}
                        <label className="text-[#1B4F8B] font-semibold cursor-pointer hover:underline">
                          browse
                          <input
                            type="file"
                            accept={doc.accept}
                            multiple={doc.multiple}
                            onChange={(e) => handleFileSelect(doc.key, e.target.files, doc.multiple)}
                            className="hidden"
                          />
                        </label>
                      </p>
                      <p className="text-[11px] text-[#94A3B8] mt-0.5">PDF/JPG max 10MB</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {files.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center gap-3 p-2 rounded-lg bg-white border border-[#E2E8F0]"
                      >
                        <div className="w-8 h-8 rounded-lg bg-[#EBF0F7] flex items-center justify-center flex-shrink-0">
                          <FileText size={14} className="text-[#1B4F8B]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] font-medium text-[#0F172A] truncate">{file.name}</p>
                          <p className="text-[11px] text-[#94A3B8]">{formatSize(file.size)}</p>
                        </div>
                        {file.status === "error" ? (
                          <AlertTriangle size={14} className="text-[#DC2626] flex-shrink-0" />
                        ) : (
                          <Check size={14} className="text-[#16A34A] flex-shrink-0" />
                        )}
                        <button
                          onClick={() => removeFile(doc.key, file.id)}
                          className="w-6 h-6 flex items-center justify-center rounded text-[#94A3B8] hover:text-[#DC2626] cursor-pointer transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                    {doc.multiple && (
                      <label className="flex items-center justify-center gap-2 h-8 rounded-lg border border-dashed border-[#E2E8F0] text-[12px] text-[#64748B] cursor-pointer hover:border-[#CBD5E1] hover:text-[#0F172A] transition-colors">
                        <Upload size={14} />
                        Add more files
                        <input
                          type="file"
                          accept={doc.accept}
                          multiple
                          onChange={(e) => handleFileSelect(doc.key, e.target.files, true)}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                )}
              </div>
              {isMissing && (
                <p className="text-[11px] text-[#DC2626]">This document is required.</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}