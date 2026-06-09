"use client";

import { useState } from "react";
import { MoreHorizontal, ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";

interface Column {
  key: string;
  header: React.ReactNode;
  width?: string;
  sortable?: boolean;
}

interface Row {
  [key: string]: React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  rows: Row[];
  zebra?: boolean;
  headerStyle?: "white" | "navy";
  rowActions?: (row: Row, index: number) => React.ReactNode;
  sortable?: boolean;
  onSort?: (key: string, direction: "asc" | "desc") => void;
}

export default function DataTable({
  columns,
  rows,
  zebra = true,
  headerStyle = "white",
  rowActions,
  sortable,
  onSort,
}: DataTableProps) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [actionOpenRow, setActionOpenRow] = useState<number | null>(null);

  const handleSort = (key: string) => {
    if (!sortable) return;
    const newDirection = sortKey === key && sortDirection === "asc" ? "desc" : "asc";
    setSortKey(key);
    setSortDirection(newDirection);
    onSort?.(key, newDirection);
  };

  const totalPages = Math.ceil(rows.length / rowsPerPage);
  const paginatedRows = rows.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const headerBg = headerStyle === "navy" ? "#0B2545" : "white";
  const headerText = headerStyle === "navy" ? "white" : "#0B2545";
  const headerBorder = headerStyle === "navy" ? "#1B4F8B" : "#E2E8F0";

  return (
    <div className="w-full overflow-hidden rounded-xl border border-[#E2E8F0] bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr
              style={{
                backgroundColor: headerBg,
                borderBottom: `1px solid ${headerBorder}`,
              }}
            >
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="text-left text-[11px] font-bold uppercase tracking-wider px-4 py-3 whitespace-nowrap"
                  style={{
                    color: headerText,
                    width: col.width,
                    cursor: sortable && col.sortable ? "pointer" : "default",
                  }}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className="flex items-center gap-1">
                    {col.header}
                    {sortable && col.sortable && (
                      <ArrowUpDown
                        size={12}
                        className="opacity-50"
                        style={{
                          color: headerText,
                          opacity: sortKey === col.key ? 1 : 0.4,
                        }}
                      />
                    )}
                  </div>
                </th>
              ))}
              {rowActions && (
                <th
                  className="text-left text-[11px] font-bold uppercase tracking-wider px-4 py-3"
                  style={{ color: headerText, width: "60px" }}
                >
                  <span className="sr-only">Actions</span>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {paginatedRows.map((row, index) => (
              <tr
                key={index}
                className="border-b border-[#E2E8F0] last:border-b-0 transition-colors hover:bg-[#F1F5F9]"
                style={{
                  backgroundColor: zebra && index % 2 === 1 ? "#F8FAFC" : "white",
                }}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="px-4 py-3 text-[13px] text-[#0F172A]"
                  >
                    {row[col.key]}
                  </td>
                ))}
                {rowActions && (
                  <td className="px-4 py-3 relative">
                    <button
                      onClick={() =>
                        setActionOpenRow(actionOpenRow === index ? null : index)
                      }
                      className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors"
                    >
                      <MoreHorizontal size={16} />
                    </button>
                    {actionOpenRow === index && (
                      <div className="absolute right-4 top-10 z-10 w-[160px] bg-white rounded-xl shadow-lg border border-[#E2E8F0] overflow-hidden">
                        {rowActions(row, index)}
                      </div>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-[#E2E8F0]">
          <span className="text-[12px] text-[#64748B]">
            Showing {(currentPage - 1) * rowsPerPage + 1} to{" "}
            {Math.min(currentPage * rowsPerPage, rows.length)} of {rows.length} entries
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] disabled:opacity-40 cursor-pointer transition-colors"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="text-[12px] font-medium text-[#0F172A] px-3">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] disabled:opacity-40 cursor-pointer transition-colors"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}