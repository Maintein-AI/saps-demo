"use client";
import { Upload, ClipboardPaste, FileSearch, FileSpreadsheet } from "lucide-react";

interface ImportMethodSelectorProps {
  method: string;
  onMethodChange: (method: string) => void;
}

const methods = [
  { id: "csv", label: "Upload CSV", icon: Upload },
  { id: "xlsx", label: "Upload XLSX", icon: FileSpreadsheet },
  { id: "paste", label: "Paste ULD Rows", icon: ClipboardPaste },
  { id: "existing", label: "Import from Existing Message", icon: FileSearch },
];

export default function ImportMethodSelector({ method, onMethodChange }: ImportMethodSelectorProps) {
  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-[15px] font-bold text-[#0F172A]">Import Method</h2>
      </div>

      <div className="flex items-center gap-1 bg-[#F1F5F9] rounded-xl p-1">
        {methods.map((m) => {
          const Icon = m.icon;
          const isActive = method === m.id;
          return (
            <button
              key={m.id}
              onClick={() => onMethodChange(m.id)}
              className={`flex items-center gap-2 h-9 px-4 rounded-lg text-[13px] font-semibold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? "bg-white text-[#0F172A] shadow-sm"
                  : "text-[#64748B] hover:text-[#0F172A]"
              }`}
            >
              <Icon size={16} />
              {m.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}