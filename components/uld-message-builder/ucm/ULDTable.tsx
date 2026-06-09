"use client";

import { Trash2, Plus, ArrowRight, ArrowLeft, Upload } from "lucide-react";

export interface ULDRecord {
  id: string;
  type: string;
  nbr: string;
  owner: string;
  dest?: string;
  content?: string;
  errors: Record<string, string>;
}

interface ULDTableProps {
  title: string;
  side: "IN" | "OUT";
  rows: ULDRecord[];
  selectedIds: Set<string>;
  onRowsChange: (rows: ULDRecord[]) => void;
  onSelectionToggle: (id: string) => void;
  onSelectAll: () => void;
  onMoveSelected: (side: "IN" | "OUT") => void;
}

export function generateInUlds(): ULDRecord[] {
  const data: [string, string, string][] = [
    ["AKE", "95704", "TG"],
    ["AKE", "92959", "TG"],
    ["AKE", "91240", "TG"],
    ["PAG", "61610", "TG"],
    ["PMC", "53603", "TG"],
    ["AVE", "0510", "TG"],
  ];
  return data.map(([type, nbr, owner], i) => ({
    id: `in-${i + 1}`,
    type,
    nbr,
    owner,
    errors: {},
  }));
}

export function generateOutUlds(): ULDRecord[] {
  const data: [string, string, string, string, string][] = [
    ["AVE", "0510", "TG", "BKK", "C"],
    ["AKE", "90375", "TG", "BKK", "C"],
    ["AKE", "90358", "TG", "BKK", "B"],
  ];
  return data.map(([type, nbr, owner, dest, content], i) => ({
    id: `out-${i + 1}`,
    type,
    nbr,
    owner,
    dest,
    content: content || "",
    errors: {},
  }));
}

export default function ULDTable({
  title,
  side,
  rows,
  selectedIds,
  onRowsChange,
  onSelectionToggle,
  onSelectAll,
  onMoveSelected,
}: ULDTableProps) {
  const allSelected = rows.length > 0 && rows.every((r) => selectedIds.has(r.id));
  const selectedCount = rows.filter((r) => selectedIds.has(r.id)).length;

  const updateRow = (rowId: string, field: keyof ULDRecord, value: string) => {
    const updated = rows.map((r) => {
      if (r.id !== rowId) return r;
      const newRow = { ...r, [field]: value };
      const errors: Record<string, string> = {};
      if (!newRow.type.trim()) errors.type = "Required";
      if (!newRow.nbr.trim()) errors.nbr = "Required";
      if (!newRow.owner.trim()) errors.owner = "Required";
      const dup = rows.find(
        (o) => o.id !== rowId && o.type.trim() === newRow.type.trim() && o.nbr.trim() === newRow.nbr.trim() && o.owner.trim() === newRow.owner.trim()
      );
      if (dup && newRow.type.trim() && newRow.nbr.trim() && newRow.owner.trim()) {
        errors.duplicate = "Duplicate";
      }
      newRow.errors = errors;
      return newRow;
    });
    onRowsChange(updated);
  };

  const handleDeleteRow = (rowId: string) => {
    if (rows.length <= 0) return;
    const filtered = rows.filter((r) => r.id !== rowId);
    const reindexed = filtered.map((r, i) => {
      const prefix = side === "IN" ? "in" : "out";
      return { ...r, id: `${prefix}-${i + 1}` };
    });
    onRowsChange(reindexed);
  };

  const handleAddRow = () => {
    const prefix = side === "IN" ? "in" : "out";
    const newRow: ULDRecord = {
      id: `${prefix}-${rows.length + 1}`,
      type: "",
      nbr: "",
      owner: "TG",
      dest: side === "OUT" ? "" : undefined,
      content: side === "OUT" ? "" : undefined,
      errors: {},
    };
    onRowsChange([...rows, newRow]);
  };

  const totalErrors = rows.reduce((sum, r) => sum + Object.keys(r.errors).length, 0);

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white shadow-sm overflow-hidden flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2">
          <h3 className="text-[15px] font-bold text-[#0F172A]">{title}</h3>
          <span className="inline-flex items-center justify-center h-[22px] px-2.5 rounded-full text-[11px] font-bold lowercase text-white bg-[#DC2626] select-none">
            exc
          </span>
        </div>
        <span className="text-[12px] text-[#64748B]">{rows.length} ULDs</span>
      </div>

      <div className="flex-1 overflow-y-auto" style={{ maxHeight: "400px" }}>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
              <th className="py-2 px-2 w-10 text-center">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={onSelectAll}
                  className="w-3.5 h-3.5 rounded border-[#CBD5E1] text-[#1B4F8B] cursor-pointer"
                />
              </th>
              <th className="py-2 px-2 w-8 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider text-center">#</th>
              <th className="py-2 px-2 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Type</th>
              <th className="py-2 px-2 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Nbr</th>
              <th className="py-2 px-2 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Owner</th>
              {side === "OUT" && (
                <>
                  <th className="py-2 px-2 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Dest.</th>
                  <th className="py-2 px-2 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Content</th>
                </>
              )}
              <th className="py-2 px-2 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={side === "OUT" ? 8 : 6} className="py-12 text-center">
                  <p className="text-[13px] text-[#94A3B8]">No {title} ULDs</p>
                </td>
              </tr>
            ) : (
              rows.map((row, idx) => {
                const hasError = Object.keys(row.errors).length > 0;
                return (
                  <tr
                    key={row.id}
                    className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors"
                    style={{ backgroundColor: hasError ? "#FFF7ED" : selectedIds.has(row.id) ? "#EBF0F7" : undefined }}
                  >
                    <td className="py-1 px-2 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(row.id)}
                        onChange={() => onSelectionToggle(row.id)}
                        className="w-3.5 h-3.5 rounded border-[#CBD5E1] text-[#1B4F8B] cursor-pointer"
                      />
                    </td>
                    <td className="py-1 px-2 text-center">
                      <span className="text-[12px] font-mono text-[#94A3B8]">{idx + 1}</span>
                    </td>
                    <td className="py-1 px-2">
                      <div className="relative">
                        <input
                          type="text"
                          value={row.type}
                          onChange={(e) => updateRow(row.id, "type", e.target.value)}
                          className="w-full h-7 px-2 rounded-md border text-[12px] font-mono font-semibold text-[#0F172A] focus:outline-none focus:ring-1 transition-colors"
                          style={{
                            borderColor: row.errors.type || row.errors.duplicate ? "#DC2626" : "#E2E8F0",
                            backgroundColor: row.errors.type || row.errors.duplicate ? "#FEF2F2" : "#FFFFFF",
                          }}
                        />
                        {(row.errors.type || row.errors.duplicate) && (
                          <span className="absolute -bottom-3.5 left-0 text-[10px] font-semibold text-[#DC2626] whitespace-nowrap">
                            {row.errors.type || row.errors.duplicate}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-1 px-2">
                      <div className="relative">
                        <input
                          type="text"
                          value={row.nbr}
                          onChange={(e) => updateRow(row.id, "nbr", e.target.value)}
                          className="w-full h-7 px-2 rounded-md border text-[12px] font-mono text-[#0F172A] focus:outline-none focus:ring-1 transition-colors"
                          style={{
                            borderColor: row.errors.nbr ? "#DC2626" : "#E2E8F0",
                            backgroundColor: row.errors.nbr ? "#FEF2F2" : "#FFFFFF",
                          }}
                        />
                        {row.errors.nbr && (
                          <span className="absolute -bottom-3.5 left-0 text-[10px] font-semibold text-[#DC2626] whitespace-nowrap">
                            {row.errors.nbr}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-1 px-2">
                      <div className="relative">
                        <input
                          type="text"
                          value={row.owner}
                          onChange={(e) => updateRow(row.id, "owner", e.target.value)}
                          className="w-full h-7 px-2 rounded-md border text-[12px] font-mono font-semibold text-[#0F172A] focus:outline-none focus:ring-1 transition-colors"
                          style={{
                            borderColor: row.errors.owner ? "#DC2626" : "#E2E8F0",
                            backgroundColor: row.errors.owner ? "#FEF2F2" : "#FFFFFF",
                          }}
                        />
                        {row.errors.owner && (
                          <span className="absolute -bottom-3.5 left-0 text-[10px] font-semibold text-[#DC2626] whitespace-nowrap">
                            {row.errors.owner}
                          </span>
                        )}
                      </div>
                    </td>
                    {side === "OUT" && (
                      <>
                        <td className="py-1 px-2">
                          <input
                            type="text"
                            value={row.dest || ""}
                            onChange={(e) => updateRow(row.id, "dest", e.target.value)}
                            className="w-full h-7 px-2 rounded-md border border-[#E2E8F0] text-[12px] font-mono font-semibold text-[#0F172A] focus:outline-none focus:border-[#1B4F8B] focus:ring-1 transition-colors"
                          />
                        </td>
                        <td className="py-1 px-2">
                          <input
                            type="text"
                            value={row.content || ""}
                            onChange={(e) => updateRow(row.id, "content", e.target.value)}
                            className="w-full h-7 px-2 rounded-md border border-[#E2E8F0] text-[12px] font-mono text-[#0F172A] focus:outline-none focus:border-[#1B4F8B] focus:ring-1 transition-colors"
                          />
                        </td>
                      </>
                    )}
                    <td className="py-1 px-2 text-center">
                      <button
                        onClick={() => handleDeleteRow(row.id)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#FEE2E2] text-[#94A3B8] hover:text-[#DC2626] cursor-pointer transition-colors"
                        title="Delete row"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-2 px-4 py-2 border-t border-[#E2E8F0] bg-[#F8FAFC]">
        <button
          onClick={handleAddRow}
          className="flex items-center gap-1.5 h-7 px-3 rounded-lg text-[11px] font-semibold text-[#1B4F8B] border border-[#1B4F8B] hover:bg-[#DBEAFE] cursor-pointer transition-colors whitespace-nowrap"
        >
          <Plus size={13} />
          Add
        </button>
        {selectedCount > 0 && (
          <button
            onClick={() => onMoveSelected(side)}
            className="flex items-center gap-1.5 h-7 px-3 rounded-lg text-[11px] font-semibold text-[#64748B] border border-[#E2E8F0] hover:bg-white cursor-pointer transition-colors whitespace-nowrap"
          >
            {side === "IN" ? <ArrowRight size={13} /> : <ArrowLeft size={13} />}
            Move to {side === "IN" ? "OUT" : "IN"}
          </button>
        )}
      </div>
    </div>
  );
}