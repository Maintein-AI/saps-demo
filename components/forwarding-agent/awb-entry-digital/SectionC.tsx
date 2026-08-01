"use client";

import { useState, useEffect, useMemo } from "react";
import { Plus, Trash2 } from "lucide-react";

interface PieceRow {
  id: number;
  length: string;
  width: string;
  height: string;
  weight: string;
  pieces: string;
}

interface SectionCProps {
  data: Record<string, any>;
  onChange: (field: string, value: any) => void;
  errors: string[];
}

const cargoClasses = [
  "ICG",
  "GCR",
  "AFU",
  "UAB",
  "DGR",
  "VAL",
  "HUM",
  "DIP",
  "PER",
  "AOG",
  "VUN",
  "AVI",
];

const handlingCodes: Record<string, string[]> = {
  ICG: ["GEN", "ICG-STD", "ICG-EXP"],
  GCR: ["GEN", "GCR-STD", "GCR-EXP"],
  AFU: ["AFU-STD", "AFU-EXP"],
  UAB: ["UAB-STD", "UAB-EXP"],
  DGR: ["DGR-CAO", "DGR-VAL", "DGR-LTD"],
  VAL: ["VAL-STD", "VAL-EXP"],
  HUM: ["HUM-STD", "HUM-EXP"],
  DIP: ["DIP-STD", "DIP-EXP"],
  PER: ["PER-CRT", "PER-FRO", "PER-DRY"],
  AOG: ["AOG-STD", "AOG-EXP"],
  VUN: ["VUN-STD", "VUN-EXP"],
  AVI: ["AVI-STD", "AVI-EXP"],
};

const specialHandlingCodes = ["ERT", "COL", "CRT", "FRO"];

export default function SectionC({ data, onChange, errors }: SectionCProps) {
  const [pieceRows, setPieceRows] = useState<PieceRow[]>(
    data.pieceRows || [
      { id: 1, length: "60", width: "40", height: "30", weight: "12.5", pieces: "1" },
      { id: 2, length: "80", width: "60", height: "40", weight: "25.0", pieces: "1" },
    ]
  );

  const totalPieces = parseInt(data.totalPieces || "0") || 0;
  const totalWeight = parseFloat(data.totalWeight || "0") || 0;

  const pieceSum = useMemo(() => {
    return pieceRows.reduce((sum, r) => sum + (parseInt(r.pieces) || 0), 0);
  }, [pieceRows]);

  const weightSum = useMemo(() => {
    return pieceRows.reduce((sum, r) => sum + (parseFloat(r.weight) || 0), 0);
  }, [pieceRows]);

  const volumetricWeight = useMemo(() => {
    return pieceRows.reduce((sum, r) => {
      const l = parseFloat(r.length) || 0;
      const w = parseFloat(r.width) || 0;
      const h = parseFloat(r.height) || 0;
      const pcs = parseInt(r.pieces) || 0;
      return sum + (l * w * h * pcs) / 6000;
    }, 0);
  }, [pieceRows]);

  const chargeableWeight = useMemo(() => {
    return Math.max(totalWeight, volumetricWeight);
  }, [totalWeight, volumetricWeight]);

  useEffect(() => {
    onChange("pieceRows", pieceRows);
    onChange("volumetricWeight", parseFloat(volumetricWeight.toFixed(2)));
    onChange("chargeableWeight", parseFloat(chargeableWeight.toFixed(2)));
  }, [pieceRows, volumetricWeight, chargeableWeight]);

  const addRow = () => {
    const nextId = Math.max(...pieceRows.map((r) => r.id), 0) + 1;
    setPieceRows([...pieceRows, { id: nextId, length: "", width: "", height: "", weight: "", pieces: "1" }]);
  };

  const removeRow = (id: number) => {
    if (pieceRows.length <= 1) return;
    setPieceRows(pieceRows.filter((r) => r.id !== id));
  };

  const updateRow = (id: number, field: keyof PieceRow, value: string) => {
    setPieceRows(pieceRows.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const handleClassChange = (cls: string) => {
    onChange("cargoClass", cls);
    const codes = handlingCodes[cls] || ["GEN"];
    onChange("handlingCode", codes[0]);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 mb-1">
        <h3 className="text-[14px] font-bold text-[#0F172A]">C. Cargo Description</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="text-[12px] font-semibold text-[#0F172A]">
            Total Pieces <span className="text-[#DC2626]">*</span>
          </label>
          <input
            type="number"
            min={1}
            value={data.totalPieces || ""}
            onChange={(e) => onChange("totalPieces", e.target.value)}
            className="w-full h-10 px-3 rounded-lg border text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors"
            style={{ borderColor: errors.includes("totalPieces") ? "#DC2626" : "#E2E8F0" }}
          />
          {errors.includes("totalPieces") && (
            <p className="text-[11px] text-[#DC2626]">Total pieces must be at least 1.</p>
          )}
          {pieceSum > 0 && totalPieces !== pieceSum && (
            <p className="text-[11px] text-[#F59E0B]">Matrix sum ({pieceSum}) does not match total pieces ({totalPieces}).</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-[12px] font-semibold text-[#0F172A]">
            Total Gross Weight (kg) <span className="text-[#DC2626]">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            min={0.01}
            value={data.totalWeight || ""}
            onChange={(e) => onChange("totalWeight", e.target.value)}
            className="w-full h-10 px-3 rounded-lg border text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors"
            style={{ borderColor: errors.includes("totalWeight") ? "#DC2626" : "#E2E8F0" }}
          />
          {errors.includes("totalWeight") && (
            <p className="text-[11px] text-[#DC2626]">Total gross weight is required.</p>
          )}
          {weightSum > 0 && totalWeight > 0 && Math.abs(totalWeight - weightSum) / totalWeight > 0.02 && (
            <p className="text-[11px] text-[#F59E0B]">Matrix weight sum ({weightSum.toFixed(2)} kg) differs from total by &gt;2%.</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-[12px] font-semibold text-[#0F172A]">Total Volume (m³)</label>
          <input
            type="number"
            step="0.001"
            value={data.totalVolume || ""}
            onChange={(e) => onChange("totalVolume", e.target.value)}
            placeholder="Optional"
            className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] placeholder:text-[#94A3B8] outline-none focus:border-[#1B4F8B] transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="text-[12px] font-semibold text-[#0F172A]">Volumetric Weight (kg)</label>
          <input
            type="text"
            value={volumetricWeight.toFixed(2)}
            readOnly
            className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] text-[13px] text-[#64748B] cursor-not-allowed"
          />
          <p className="text-[11px] text-[#94A3B8]">Computed from piece dimensions</p>
        </div>

        <div className="space-y-1.5">
          <label className="text-[12px] font-semibold text-[#0F172A]">Chargeable Weight (kg)</label>
          <input
            type="text"
            value={chargeableWeight.toFixed(2)}
            readOnly
            className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] text-[13px] text-[#64748B] cursor-not-allowed"
          />
          <p className="text-[11px] text-[#94A3B8]">Max(actual, volumetric)</p>
        </div>

        <div className="space-y-1.5">
          <label className="text-[12px] font-semibold text-[#0F172A]">
            Cargo Class <span className="text-[#DC2626]">*</span>
          </label>
          <select
            value={data.cargoClass || ""}
            onChange={(e) => handleClassChange(e.target.value)}
            className="w-full h-10 px-3 rounded-lg border text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors appearance-none bg-white"
            style={{ borderColor: errors.includes("cargoClass") ? "#DC2626" : "#E2E8F0" }}
          >
            <option value="">Select class</option>
            {cargoClasses.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {errors.includes("cargoClass") && <p className="text-[11px] text-[#DC2626]">Cargo class is required.</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[12px] font-semibold text-[#0F172A]">
            Handling Code <span className="text-[#DC2626]">*</span>
          </label>
          <select
            value={data.handlingCode || ""}
            onChange={(e) => onChange("handlingCode", e.target.value)}
            className="w-full h-10 px-3 rounded-lg border text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors appearance-none bg-white"
            style={{ borderColor: errors.includes("handlingCode") ? "#DC2626" : "#E2E8F0" }}
          >
            <option value="">Select handling code</option>
            {(handlingCodes[data.cargoClass] || ["GEN"]).map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
          {errors.includes("handlingCode") && <p className="text-[11px] text-[#DC2626]">Handling code is required.</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-[12px] font-semibold text-[#0F172A]">Special Handling Codes</label>
          <div className="flex flex-wrap gap-2">
            {specialHandlingCodes.map((code) => {
              const selected = (data.specialHandling || []).includes(code);
              return (
                <button
                  key={code}
                  onClick={() => {
                    const current = data.specialHandling || [];
                    if (selected) {
                      onChange("specialHandling", current.filter((c: string) => c !== code));
                    } else {
                      onChange("specialHandling", [...current, code]);
                    }
                  }}
                  className="h-8 px-3 rounded-full text-[12px] font-medium cursor-pointer transition-colors"
                  style={{
                    backgroundColor: selected ? "#EBF0F7" : "#F1F5F9",
                    color: selected ? "#0B2545" : "#64748B",
                    border: selected ? "1.5px solid #0B2545" : "1.5px solid transparent",
                  }}
                >
                  {code}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-[12px] font-semibold text-[#0F172A]">
          Nature of Goods <span className="text-[#DC2626]">*</span>
        </label>
        <textarea
          value={data.natureOfGoods || ""}
          onChange={(e) => onChange("natureOfGoods", e.target.value)}
          maxLength={280}
          rows={3}
          placeholder="Describe the nature of goods being shipped..."
          className="w-full px-3 py-2.5 rounded-lg border text-[13px] text-[#0F172A] placeholder:text-[#94A3B8] outline-none focus:border-[#1B4F8B] transition-colors resize-none"
          style={{ borderColor: errors.includes("natureOfGoods") ? "#DC2626" : "#E2E8F0" }}
        />
        <div className="flex items-center justify-between">
          {errors.includes("natureOfGoods") ? (
            <p className="text-[11px] text-[#DC2626]">Nature of goods is required.</p>
          ) : (
            <span />
          )}
          <span className="text-[11px] text-[#94A3B8]">{(data.natureOfGoods || "").length}/280</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[12px] font-semibold text-[#0F172A]">
            Pieces Matrix <span className="text-[#DC2626]">*</span>
          </label>
          <button
            onClick={addRow}
            className="flex items-center gap-1 h-8 px-3 rounded-lg text-[12px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] hover:border-[#CBD5E1] cursor-pointer transition-colors"
          >
            <Plus size={14} />
            Add Row
          </button>
        </div>

        <div className="border border-[#E2E8F0] rounded-xl overflow-hidden">
          <div className="grid grid-cols-[60px_1fr_1fr_1fr_1fr_1fr_44px] bg-[#F8FAFC] text-[11px] font-semibold text-[#64748B] px-3 py-2">
            <span>#</span>
            <span>L (cm)</span>
            <span>W (cm)</span>
            <span>H (cm)</span>
            <span>Weight (kg)</span>
            <span>Pieces</span>
            <span />
          </div>
          {pieceRows.map((row, idx) => (
            <div
              key={row.id}
              className="grid grid-cols-[60px_1fr_1fr_1fr_1fr_1fr_44px] items-center px-3 py-2 border-t border-[#E2E8F0]"
            >
              <span className="text-[12px] text-[#94A3B8] font-medium">{idx + 1}</span>
              <input
                type="number"
                value={row.length}
                onChange={(e) => updateRow(row.id, "length", e.target.value)}
                className="h-8 px-2 rounded-lg border border-[#E2E8F0] text-[12px] text-[#0F172A] outline-none focus:border-[#1B4F8B]"
              />
              <input
                type="number"
                value={row.width}
                onChange={(e) => updateRow(row.id, "width", e.target.value)}
                className="h-8 px-2 rounded-lg border border-[#E2E8F0] text-[12px] text-[#0F172A] outline-none focus:border-[#1B4F8B]"
              />
              <input
                type="number"
                value={row.height}
                onChange={(e) => updateRow(row.id, "height", e.target.value)}
                className="h-8 px-2 rounded-lg border border-[#E2E8F0] text-[12px] text-[#0F172A] outline-none focus:border-[#1B4F8B]"
              />
              <input
                type="number"
                step="0.01"
                value={row.weight}
                onChange={(e) => updateRow(row.id, "weight", e.target.value)}
                className="h-8 px-2 rounded-lg border border-[#E2E8F0] text-[12px] text-[#0F172A] outline-none focus:border-[#1B4F8B]"
              />
              <input
                type="number"
                min={1}
                value={row.pieces}
                onChange={(e) => updateRow(row.id, "pieces", e.target.value)}
                className="h-8 px-2 rounded-lg border border-[#E2E8F0] text-[12px] text-[#0F172A] outline-none focus:border-[#1B4F8B]"
              />
              <button
                onClick={() => removeRow(row.id)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-[#94A3B8] hover:text-[#DC2626] hover:bg-[#DC2626]/5 cursor-pointer transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          <div className="grid grid-cols-[60px_1fr_1fr_1fr_1fr_1fr_44px] items-center px-3 py-2 border-t border-[#E2E8F0] bg-[#F8FAFC]">
            <span className="text-[11px] font-semibold text-[#64748B]">Total</span>
            <span className="text-[12px] font-semibold text-[#0F172A]">—</span>
            <span className="text-[12px] font-semibold text-[#0F172A]">—</span>
            <span className="text-[12px] font-semibold text-[#0F172A]">—</span>
            <span className="text-[12px] font-semibold text-[#0F172A]">{weightSum.toFixed(2)}</span>
            <span className="text-[12px] font-semibold text-[#0F172A]">{pieceSum}</span>
            <span />
          </div>
        </div>
        {errors.includes("pieceMatrix") && (
          <p className="text-[11px] text-[#DC2626]">At least one piece matrix row is required.</p>
        )}
      </div>
    </div>
  );
}