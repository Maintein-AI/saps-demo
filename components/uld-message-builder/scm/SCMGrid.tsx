"use client";

import { useState, useCallback, useRef } from "react";
import { useToast } from "@/components/ToastContext";
import { Trash2, Plus, AlertTriangle } from "lucide-react";

interface SCMRow {
  id: string;
  selected: boolean;
  type: string;
  nbr: string;
  owner: string;
  substation: string;
  status: string;
  condition: string;
  comments: string;
  errors: Record<string, string>;
}

const statusOptions = ["Available", "In Repair"];
const conditionOptions = ["No Damage"];

function generateInitialRows(): SCMRow[] {
  const types = ["AKE", "AVE", "PAG", "PMC", "AKE", "AVE", "PAG", "PMC", "AKE", "AVE", "PAG", "PMC", "AKE", "AVE", "AKE", "AVE", "PAG", "PMC", "AKE", "AVE", "PAG", "PMC", "AKE", "AVE", "PAG", "PMC"];
  const owners = ["TG", "TG", "TG", "TG", "TG", "TG", "TG", "TG", "TG", "TG", "TG", "TG", "TG", "TG", "TG", "TG", "TG", "TG", "TG", "TG", "TG", "TG", "TG", "TG", "TG", "TG"];
  const substations = ["LAHORE", "LAHORE", "LAHORE", "LAHORE", "LAHORE", "LAHORE", "LAHORE", "LAHORE", "LAHORE", "LAHORE", "LAHORE", "LAHORE", "LAHORE", "KARACHI", "KARACHI", "KARACHI", "KARACHI", "KARACHI", "KARACHI", "KARACHI", "KARACHI", "KARACHI", "KARACHI", "KARACHI", "KARACHI", "KARACHI"];
  const statuses = ["Available", "Available", "Available", "Available", "Available", "Available", "Available", "Available", "Available", "Available", "In Repair", "Available", "Available", "Available", "Available", "Available", "Available", "Available", "In Repair", "Available", "Available", "Available", "Available", "Available", "Available", "Available"];
  const startNbr = 61734;

  return Array.from({ length: 26 }, (_, i) => ({
    id: `row-${i + 1}`,
    selected: false,
    type: types[i],
    nbr: String(startNbr + i),
    owner: owners[i],
    substation: substations[i],
    status: statuses[i],
    condition: "No Damage",
    comments: "",
    errors: {},
  }));
}

interface SCMGridProps {
  rows: SCMRow[];
  onRowsChange: (rows: SCMRow[]) => void;
  filterType: string;
  filterOwner: string;
  filterSubstation: string;
  filterStatus: string;
  onFilterTypeChange: (v: string) => void;
  onFilterOwnerChange: (v: string) => void;
  onFilterSubstationChange: (v: string) => void;
  onFilterStatusChange: (v: string) => void;
}

export default function SCMGrid({
  rows,
  onRowsChange,
  filterType,
  filterOwner,
  filterSubstation,
  filterStatus,
  onFilterTypeChange,
  onFilterOwnerChange,
  onFilterSubstationChange,
  onFilterStatusChange,
}: SCMGridProps) {
  const { addToast } = useToast();
  const [bulkOwner, setBulkOwner] = useState("");
  const [bulkSubstation, setBulkSubstation] = useState("");
  const [bulkStatus, setBulkStatus] = useState("");
  const [bulkCondition, setBulkCondition] = useState("");
  const [showBulkBar, setShowBulkBar] = useState(false);
  const [editingCell, setEditingCell] = useState<string | null>(null);

  const selectedCount = rows.filter((r) => r.selected).length;
  const allSelected = rows.length > 0 && rows.every((r) => r.selected);

  const filteredRows = rows.filter((row) => {
    if (filterType && !row.type.toLowerCase().includes(filterType.toLowerCase())) return false;
    if (filterOwner && !row.owner.toLowerCase().includes(filterOwner.toLowerCase())) return false;
    if (filterSubstation && !row.substation.toLowerCase().includes(filterSubstation.toLowerCase())) return false;
    if (filterStatus && !row.status.toLowerCase().includes(filterStatus.toLowerCase())) return false;
    return true;
  });

  const validateRow = (row: SCMRow, allRows: SCMRow[]): Record<string, string> => {
    const errors: Record<string, string> = {};
    if (!row.type.trim()) errors.type = "Required";
    if (!row.nbr.trim()) errors.nbr = "Required";
    if (!row.owner.trim()) errors.owner = "Required";
    if (!row.substation.trim()) errors.substation = "Required";
    if (!row.status.trim()) errors.status = "Required";
    if (!row.condition.trim()) errors.condition = "Required";

    const duplicate = allRows.find(
      (r) => r.id !== row.id && r.type.trim() === row.type.trim() && r.nbr.trim() === row.nbr.trim() && r.owner.trim() === row.owner.trim()
    );
    if (duplicate && row.type.trim() && row.nbr.trim() && row.owner.trim()) {
      errors.duplicate = "Duplicate Type + Nbr + Owner";
    }
    return errors;
  };

  const updateRow = useCallback(
    (rowId: string, field: keyof SCMRow, value: string | boolean) => {
      const updated = rows.map((r) => {
        if (r.id !== rowId) return r;
        const newRow = { ...r, [field]: value };
        newRow.errors = validateRow(newRow, rows);
        return newRow;
      });
      onRowsChange(updated);
    },
    [rows, onRowsChange]
  );

  const handleSelectAll = () => {
    const newVal = !allSelected;
    const updated = rows.map((r) => ({ ...r, selected: newVal }));
    onRowsChange(updated);
    setShowBulkBar(newVal && rows.length > 0);
  };

  const handleSelectRow = (rowId: string) => {
    const updated = rows.map((r) => (r.id === rowId ? { ...r, selected: !r.selected } : r));
    onRowsChange(updated);
    const count = updated.filter((r) => r.selected).length;
    setShowBulkBar(count > 0);
  };

  const handleDeleteRow = (rowId: string) => {
    if (rows.length <= 1) {
      addToast("Cannot delete the last row.", "error");
      return;
    }
    const updated = rows.filter((r) => r.id !== rowId);
    const reindexed = updated.map((r, i) => ({ ...r, id: `row-${i + 1}` }));
    onRowsChange(reindexed);
    addToast("Row deleted.", "success");
  };

  const handleAddRow = () => {
    const newId = `row-${rows.length + 1}`;
    const newRow: SCMRow = {
      id: newId,
      selected: false,
      type: "",
      nbr: "",
      owner: "TG",
      substation: "LAHORE",
      status: "Available",
      condition: "No Damage",
      comments: "",
      errors: {},
    };
    onRowsChange([...rows, newRow]);
    addToast("New row added.", "success");
  };

  const handleBulkApply = () => {
    const updated = rows.map((r) => {
      if (!r.selected) return r;
      const newRow = { ...r };
      if (bulkOwner) newRow.owner = bulkOwner;
      if (bulkSubstation) newRow.substation = bulkSubstation;
      if (bulkStatus) newRow.status = bulkStatus;
      if (bulkCondition) newRow.condition = bulkCondition;
      newRow.errors = validateRow(newRow, rows);
      return newRow;
    });
    onRowsChange(updated);
    setBulkOwner("");
    setBulkSubstation("");
    setBulkStatus("");
    setBulkCondition("");
    setShowBulkBar(false);
    addToast(`Bulk update applied to ${selectedCount} rows.`, "success");
  };

  const handleKeyDown = (e: React.KeyboardEvent, rowId: string, field: string) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const currentIndex = filteredRows.findIndex((r) => r.id === rowId);
      const fields = ["type", "nbr", "owner", "substation", "status", "condition", "comments"];
      const fieldIdx = fields.indexOf(field);
      if (fieldIdx < fields.length - 1) {
        setEditingCell(`${rowId}-${fields[fieldIdx + 1]}`);
      } else if (currentIndex < filteredRows.length - 1) {
        setEditingCell(`${filteredRows[currentIndex + 1].id}-type`);
      }
    }
  };

  const totalErrors = rows.reduce((sum, r) => sum + Object.keys(r.errors).length, 0);

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2">
          <h2 className="text-[15px] font-bold text-[#0F172A]">ULD Stock Lines</h2>
        </div>
        <div className="flex items-center gap-3">
          {totalErrors > 0 && (
            <span className="flex items-center gap-1.5 text-[12px] font-semibold text-[#DC2626]">
              <AlertTriangle size={14} />
              {totalErrors} validation {totalErrors === 1 ? "error" : "errors"}
            </span>
          )}
          <span className="text-[12px] text-[#64748B]">{rows.length} rows</span>
          <span className="text-[12px] text-[#94A3B8]">|</span>
          <span className="text-[12px] text-[#16A34A] font-semibold">{selectedCount} selected</span>
        </div>
      </div>

      {showBulkBar && selectedCount > 0 && (
        <div className="flex items-center gap-3 px-5 py-3 bg-[#EBF0F7] border-b border-[#E2E8F0] flex-wrap">
          <span className="text-[12px] font-semibold text-[#0B2545] whitespace-nowrap">Bulk Update ({selectedCount} rows):</span>
          <select
            value={bulkOwner}
            onChange={(e) => setBulkOwner(e.target.value)}
            className="h-8 px-2 pr-8 rounded-lg border border-[#E2E8F0] text-[12px] text-[#0F172A] bg-white cursor-pointer focus:outline-none focus:border-[#1B4F8B]"
          >
            <option value="">Owner...</option>
            <option value="TG">TG</option>
            <option value="PK">PK</option>
            <option value="EK">EK</option>
          </select>
          <select
            value={bulkSubstation}
            onChange={(e) => setBulkSubstation(e.target.value)}
            className="h-8 px-2 pr-8 rounded-lg border border-[#E2E8F0] text-[12px] text-[#0F172A] bg-white cursor-pointer focus:outline-none focus:border-[#1B4F8B]"
          >
            <option value="">Substation...</option>
            <option value="LAHORE">LAHORE</option>
            <option value="KARACHI">KARACHI</option>
          </select>
          <select
            value={bulkStatus}
            onChange={(e) => setBulkStatus(e.target.value)}
            className="h-8 px-2 pr-8 rounded-lg border border-[#E2E8F0] text-[12px] text-[#0F172A] bg-white cursor-pointer focus:outline-none focus:border-[#1B4F8B]"
          >
            <option value="">Status...</option>
            {statusOptions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select
            value={bulkCondition}
            onChange={(e) => setBulkCondition(e.target.value)}
            className="h-8 px-2 pr-8 rounded-lg border border-[#E2E8F0] text-[12px] text-[#0F172A] bg-white cursor-pointer focus:outline-none focus:border-[#1B4F8B]"
          >
            <option value="">Condition...</option>
            {conditionOptions.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <button
            onClick={handleBulkApply}
            className="h-8 px-4 rounded-lg text-[12px] font-semibold bg-[#1B4F8B] text-white hover:opacity-90 cursor-pointer transition-opacity whitespace-nowrap"
          >
            Apply
          </button>
          <button
            onClick={() => { setShowBulkBar(false); onRowsChange(rows.map((r) => ({ ...r, selected: false }))); }}
            className="h-8 px-3 rounded-lg text-[12px] font-medium text-[#64748B] hover:bg-white cursor-pointer transition-colors whitespace-nowrap"
          >
            Cancel
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1400px] text-left">
          <thead>
            <tr className="border-b border-[#E2E8F0]">
              <th className="py-2 px-2 w-10 text-center">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={handleSelectAll}
                  className="w-3.5 h-3.5 rounded border-[#CBD5E1] text-[#1B4F8B] cursor-pointer"
                />
              </th>
              <th className="py-2 px-2 w-10 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider text-center">#</th>
              <th className="py-2 px-2 w-[110px]">
                <div className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">Type</div>
                <input
                  type="text"
                  value={filterType}
                  onChange={(e) => onFilterTypeChange(e.target.value)}
                  placeholder="Filter..."
                  className="w-full h-7 px-2 rounded-md border border-[#E2E8F0] text-[11px] text-[#0F172A] bg-[#F8FAFC] focus:outline-none focus:border-[#1B4F8B]"
                />
              </th>
              <th className="py-2 px-2 w-[100px]">
                <div className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">Nbr</div>
                <input
                  type="text"
                  value=""
                  readOnly
                  placeholder="Filter..."
                  className="w-full h-7 px-2 rounded-md border border-[#E2E8F0] text-[11px] text-[#0F172A] bg-[#F8FAFC]"
                />
              </th>
              <th className="py-2 px-2 w-[100px]">
                <div className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">Owner</div>
                <input
                  type="text"
                  value={filterOwner}
                  onChange={(e) => onFilterOwnerChange(e.target.value)}
                  placeholder="Filter..."
                  className="w-full h-7 px-2 rounded-md border border-[#E2E8F0] text-[11px] text-[#0F172A] bg-[#F8FAFC] focus:outline-none focus:border-[#1B4F8B]"
                />
              </th>
              <th className="py-2 px-2 w-[120px]">
                <div className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">Substation</div>
                <input
                  type="text"
                  value={filterSubstation}
                  onChange={(e) => onFilterSubstationChange(e.target.value)}
                  placeholder="Filter..."
                  className="w-full h-7 px-2 rounded-md border border-[#E2E8F0] text-[11px] text-[#0F172A] bg-[#F8FAFC] focus:outline-none focus:border-[#1B4F8B]"
                />
              </th>
              <th className="py-2 px-2 w-[120px]">
                <div className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">Status</div>
                <input
                  type="text"
                  value={filterStatus}
                  onChange={(e) => onFilterStatusChange(e.target.value)}
                  placeholder="Filter..."
                  className="w-full h-7 px-2 rounded-md border border-[#E2E8F0] text-[11px] text-[#0F172A] bg-[#F8FAFC] focus:outline-none focus:border-[#1B4F8B]"
                />
              </th>
              <th className="py-2 px-2 w-[120px]">
                <div className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">Condition</div>
              </th>
              <th className="py-2 px-2">
                <div className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">Comments</div>
              </th>
              <th className="py-2 px-2 w-12"></th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-16 text-center">
                  <p className="text-[14px] font-semibold text-[#94A3B8]">No rows match the current filters.</p>
                </td>
              </tr>
            ) : (
              filteredRows.map((row, idx) => {
                const hasError = Object.keys(row.errors).length > 0;
                const cellId = (field: string) => `${row.id}-${field}`;
                return (
                  <tr
                    key={row.id}
                    className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors"
                    style={{ backgroundColor: hasError ? "#FFF7ED" : undefined }}
                  >
                    <td className="py-1.5 px-2 text-center">
                      <input
                        type="checkbox"
                        checked={row.selected}
                        onChange={() => handleSelectRow(row.id)}
                        className="w-3.5 h-3.5 rounded border-[#CBD5E1] text-[#1B4F8B] cursor-pointer"
                      />
                    </td>
                    <td className="py-1.5 px-2 text-center">
                      <span className="text-[12px] font-mono text-[#94A3B8]">{idx + 1}</span>
                    </td>
                    <td className="py-1.5 px-2">
                      <div className="relative">
                        <input
                          type="text"
                          id={cellId("type")}
                          value={row.type}
                          onChange={(e) => updateRow(row.id, "type", e.target.value)}
                          onFocus={() => setEditingCell(cellId("type"))}
                          onKeyDown={(e) => handleKeyDown(e, row.id, "type") }
                          className="w-full h-8 px-2 rounded-lg border text-[12px] font-mono font-semibold text-[#0F172A] focus:outline-none focus:ring-1 transition-colors"
                          style={{
                            borderColor: row.errors.type || row.errors.duplicate ? "#DC2626" : "#E2E8F0",
                            backgroundColor: row.errors.type || row.errors.duplicate ? "#FEF2F2" : "#FFFFFF",
                          }}
                        />
                        {(row.errors.type || row.errors.duplicate) && (
                          <span className="absolute -bottom-4 left-0 text-[10px] font-semibold text-[#DC2626] whitespace-nowrap">
                            {row.errors.type || row.errors.duplicate}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-1.5 px-2">
                      <div className="relative">
                        <input
                          type="text"
                          id={cellId("nbr")}
                          value={row.nbr}
                          onChange={(e) => updateRow(row.id, "nbr", e.target.value)}
                          onFocus={() => setEditingCell(cellId("nbr"))}
                          onKeyDown={(e) => handleKeyDown(e, row.id, "nbr") }
                          className="w-full h-8 px-2 rounded-lg border text-[12px] font-mono text-[#0F172A] focus:outline-none focus:ring-1 transition-colors"
                          style={{
                            borderColor: row.errors.nbr ? "#DC2626" : "#E2E8F0",
                            backgroundColor: row.errors.nbr ? "#FEF2F2" : "#FFFFFF",
                          }}
                        />
                        {row.errors.nbr && (
                          <span className="absolute -bottom-4 left-0 text-[10px] font-semibold text-[#DC2626] whitespace-nowrap">
                            {row.errors.nbr}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-1.5 px-2">
                      <div className="relative">
                        <input
                          type="text"
                          id={cellId("owner")}
                          value={row.owner}
                          onChange={(e) => updateRow(row.id, "owner", e.target.value)}
                          onFocus={() => setEditingCell(cellId("owner"))}
                          onKeyDown={(e) => handleKeyDown(e, row.id, "owner") }
                          className="w-full h-8 px-2 rounded-lg border text-[12px] font-mono font-semibold text-[#0F172A] focus:outline-none focus:ring-1 transition-colors"
                          style={{
                            borderColor: row.errors.owner ? "#DC2626" : "#E2E8F0",
                            backgroundColor: row.errors.owner ? "#FEF2F2" : "#FFFFFF",
                          }}
                        />
                        {row.errors.owner && (
                          <span className="absolute -bottom-4 left-0 text-[10px] font-semibold text-[#DC2626] whitespace-nowrap">
                            {row.errors.owner}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-1.5 px-2">
                      <div className="relative">
                        <input
                          type="text"
                          id={cellId("substation")}
                          value={row.substation}
                          onChange={(e) => updateRow(row.id, "substation", e.target.value)}
                          onFocus={() => setEditingCell(cellId("substation"))}
                          onKeyDown={(e) => handleKeyDown(e, row.id, "substation") }
                          className="w-full h-8 px-2 rounded-lg border text-[12px] font-mono font-semibold text-[#0F172A] focus:outline-none focus:ring-1 transition-colors"
                          style={{
                            borderColor: row.errors.substation ? "#DC2626" : "#E2E8F0",
                            backgroundColor: row.errors.substation ? "#FEF2F2" : "#FFFFFF",
                          }}
                        />
                        {row.errors.substation && (
                          <span className="absolute -bottom-4 left-0 text-[10px] font-semibold text-[#DC2626] whitespace-nowrap">
                            {row.errors.substation}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-1.5 px-2">
                      <select
                        value={row.status}
                        onChange={(e) => updateRow(row.id, "status", e.target.value)}
                        className="w-full h-8 px-2 pr-8 rounded-lg border text-[12px] font-semibold text-[#0F172A] bg-white cursor-pointer focus:outline-none focus:border-[#1B4F8B] focus:ring-1 focus:ring-[#1B4F8B] transition-colors"
                        style={{
                          borderColor: row.errors.status ? "#DC2626" : "#E2E8F0",
                        }}
                      >
                        {statusOptions.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-1.5 px-2">
                      <select
                        value={row.condition}
                        onChange={(e) => updateRow(row.id, "condition", e.target.value)}
                        className="w-full h-8 px-2 pr-8 rounded-lg border text-[12px] text-[#0F172A] bg-white cursor-pointer focus:outline-none focus:border-[#1B4F8B] focus:ring-1 focus:ring-[#1B4F8B] transition-colors"
                        style={{
                          borderColor: row.errors.condition ? "#DC2626" : "#E2E8F0",
                        }}
                      >
                        {conditionOptions.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-1.5 px-2">
                      <input
                        type="text"
                        value={row.comments}
                        onChange={(e) => updateRow(row.id, "comments", e.target.value)}
                        placeholder="Add comment..."
                        className="w-full h-8 px-2 rounded-lg border border-[#E2E8F0] text-[12px] text-[#0F172A] focus:outline-none focus:border-[#1B4F8B] focus:ring-1 transition-colors"
                      />
                    </td>
                    <td className="py-1.5 px-2 text-center">
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

      <div className="flex items-center justify-between px-5 py-3 border-t border-[#E2E8F0] bg-[#F8FAFC]">
        <button
          onClick={handleAddRow}
          className="flex items-center gap-2 h-8 px-3 rounded-lg text-[12px] font-semibold text-[#1B4F8B] border border-[#1B4F8B] hover:bg-[#DBEAFE] cursor-pointer transition-colors whitespace-nowrap"
        >
          <Plus size={14} />
          Add Row
        </button>
        <span className="text-[12px] text-[#94A3B8]">
          {filteredRows.length} of {rows.length} rows shown
        </span>
      </div>
    </div>
  );
}

export { generateInitialRows, statusOptions, conditionOptions };
export type { SCMRow };