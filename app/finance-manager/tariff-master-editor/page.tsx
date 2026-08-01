"use client";

import { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";
import { useToast } from "@/components/ToastContext";
import KPIStrip from "@/components/finance-manager/tariff-master-editor/KPIStrip";
import FilterBar from "@/components/finance-manager/tariff-master-editor/FilterBar";
import TariffVersionCard from "@/components/finance-manager/tariff-master-editor/TariffVersionCard";
import TariffLineItemForm from "@/components/finance-manager/tariff-master-editor/TariffLineItemForm";
import TariffLinesTable from "@/components/finance-manager/tariff-master-editor/TariffLinesTable";
import AuditDrawer from "@/components/finance-manager/tariff-master-editor/AuditDrawer";
import { TariffLine, TariffVersion, AuditEntry } from "@/components/finance-manager/tariff-master-editor/types";

const sampleTariffLines: TariffLine[] = [
  { id: "1", cargoClass: "ICG", handlingCode: "STD-01", chargeType: "Storage", freeDays: 2, slabFromDay: 1, slabToDay: 3, rate: 8, minimumCharge: 500, surcharge: 0, effectiveFrom: "01 Jun 2026", status: "Active", tariffVersion: "2026-Q2" },
  { id: "2", cargoClass: "GCR", handlingCode: "STD-01", chargeType: "Storage", freeDays: 3, slabFromDay: 4, slabToDay: 7, rate: 12, minimumCharge: 800, surcharge: 5, effectiveFrom: "01 Jun 2026", status: "Active", tariffVersion: "2026-Q2" },
  { id: "3", cargoClass: "DGR", handlingCode: "DG-01", chargeType: "Storage", freeDays: 1, slabFromDay: 2, slabToDay: 5, rate: 18, minimumCharge: 1200, surcharge: 10, effectiveFrom: "01 Jun 2026", status: "Active", tariffVersion: "2026-Q2" },
  { id: "4", cargoClass: "VAL", handlingCode: "VAL-01", chargeType: "Storage", freeDays: 2, slabFromDay: 3, slabToDay: 10, rate: 15, minimumCharge: 1000, surcharge: 5, effectiveFrom: "01 Jun 2026", status: "Active", tariffVersion: "2026-Q2" },
  { id: "5", cargoClass: "AFU", handlingCode: "AFU-01", chargeType: "Storage", freeDays: 3, slabFromDay: 4, slabToDay: 14, rate: 10, minimumCharge: 600, surcharge: 0, effectiveFrom: "01 Jun 2026", status: "Active", tariffVersion: "2026-Q2" },
  { id: "6", cargoClass: "PER", handlingCode: "PER-01", chargeType: "Storage", freeDays: 1, slabFromDay: 2, slabToDay: 5, rate: 20, minimumCharge: 1500, surcharge: 15, effectiveFrom: "01 Jun 2026", status: "Draft", tariffVersion: "2026-Q2" },
  { id: "7", cargoClass: "AOG", handlingCode: "AOG-01", chargeType: "Demurrage", freeDays: 0, slabFromDay: 1, slabToDay: 3, rate: 25, minimumCharge: 2000, surcharge: 0, effectiveFrom: "01 Jun 2026", status: "Active", tariffVersion: "2026-Q2" },
  { id: "8", cargoClass: "VUN", handlingCode: "VUN-01", chargeType: "Storage", freeDays: 2, slabFromDay: 3, slabToDay: 7, rate: 14, minimumCharge: 900, surcharge: 8, effectiveFrom: "01 Jun 2026", status: "Retired", tariffVersion: "2026-Q1" },
  { id: "9", cargoClass: "ICG", handlingCode: "STD-01", chargeType: "Surcharge", freeDays: 0, slabFromDay: 1, slabToDay: 1, rate: 3, minimumCharge: 0, surcharge: 0, effectiveFrom: "01 Jun 2026", status: "Active", tariffVersion: "2026-Q2" },
  { id: "10", cargoClass: "GCR", handlingCode: "STD-02", chargeType: "Surcharge", freeDays: 0, slabFromDay: 1, slabToDay: 1, rate: 5, minimumCharge: 0, surcharge: 0, effectiveFrom: "01 Jun 2026", status: "Draft", tariffVersion: "2026-Q2" },
  { id: "11", cargoClass: "UAB", handlingCode: "UAB-01", chargeType: "Storage", freeDays: 3, slabFromDay: 4, slabToDay: 10, rate: 11, minimumCharge: 700, surcharge: 0, effectiveFrom: "01 Jun 2026", status: "Active", tariffVersion: "2026-Q2" },
  { id: "12", cargoClass: "HUM", handlingCode: "HUM-01", chargeType: "Storage", freeDays: 2, slabFromDay: 3, slabToDay: 7, rate: 13, minimumCharge: 850, surcharge: 0, effectiveFrom: "01 Jun 2026", status: "Active", tariffVersion: "2026-Q2" },
];

const currentVersion: TariffVersion = {
  name: "2026-Q2",
  effectiveFrom: "01 Jun 2026",
  effectiveTo: "31 Aug 2026",
  status: "Active",
  createdBy: "Sana Khan",
  approvedBy: "Farooq Ahmed",
  notes: "Revised storage rates effective for Q2 2026. All cargo classes updated with inflation adjustment.",
};

const sampleAudit: AuditEntry[] = [
  { id: "1", changedBy: "Sana Khan", changedAt: "25 May 2026 14:30", fieldChanged: "Rate", oldValue: "Rs. 10", newValue: "Rs. 12", reason: "Annual inflation adjustment" },
  { id: "2", changedBy: "Imran Ali", changedAt: "24 May 2026 11:15", fieldChanged: "Free Days", oldValue: "3", newValue: "2", reason: "Policy change for ICG cargo" },
  { id: "3", changedBy: "Sana Khan", changedAt: "23 May 2026 16:00", fieldChanged: "Surcharge %", oldValue: "0%", newValue: "5%", reason: "Additional handling cost" },
  { id: "4", changedBy: "Farooq Ahmed", changedAt: "22 May 2026 09:45", fieldChanged: "Status", oldValue: "Draft", newValue: "Active", reason: "Approved by finance head" },
  { id: "5", changedBy: "Ahmed Khan", changedAt: "20 May 2026 10:00", fieldChanged: "Minimum Charge", oldValue: "Rs. 500", newValue: "Rs. 800", reason: "Cost of living adjustment" },
];

export default function TariffMasterEditorPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [showError, setShowError] = useState(false);
  const [showEmpty, setShowEmpty] = useState(false);
  const [lines, setLines] = useState<TariffLine[]>(sampleTariffLines);
  const [filteredLines, setFilteredLines] = useState<TariffLine[]>(sampleTariffLines);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedLine, setSelectedLine] = useState<TariffLine | null>(null);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [filters, setFilters] = useState({
    version: "",
    cargoClass: "",
    handlingCode: "",
    chargeType: "",
    status: "",
    effectiveDate: "",
  });
  const { addToast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let filtered = [...lines];
    if (filters.cargoClass) filtered = filtered.filter(l => l.cargoClass === filters.cargoClass);
    if (filters.handlingCode) filtered = filtered.filter(l => l.handlingCode.toLowerCase().includes(filters.handlingCode.toLowerCase()));
    if (filters.chargeType) filtered = filtered.filter(l => l.chargeType === filters.chargeType);
    if (filters.status) filtered = filtered.filter(l => l.status === filters.status);
    setFilteredLines(filtered);
  }, [filters, lines]);

  const handleAdd = () => {
    setSelectedLine(null);
    setFormMode("add");
    setSelectedLine({
      id: "",
      cargoClass: "ICG",
      handlingCode: "",
      chargeType: "Storage",
      freeDays: 2,
      slabFromDay: 1,
      slabToDay: 3,
      rate: 0,
      minimumCharge: 0,
      surcharge: 0,
      effectiveFrom: "01 Jun 2026",
      status: "Draft",
      tariffVersion: "2026-Q2",
    });
  };

  const handleEdit = (line: TariffLine) => {
    setSelectedLine(line);
    setFormMode("edit");
  };

  const handleSave = () => {
    addToast("Tariff saved", "success");
    setSelectedLine(null);
  };

  const handleClone = (line: TariffLine) => {
    const cloned = { ...line, id: String(lines.length + 1), status: "Draft" as const, effectiveFrom: "01 Jun 2026" };
    setLines([...lines, cloned]);
    addToast("Tariff line cloned", "success");
  };

  const handleDisable = (lineId: string) => {
    const updated = lines.map(l => l.id === lineId ? { ...l, status: "Retired" as const } : l);
    setLines(updated);
    addToast("Tariff line disabled", "error");
  };

  const handleViewAudit = () => {
    setDrawerOpen(true);
  };

  const handleRetry = () => {
    setShowError(false);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const activeCount = lines.filter(l => l.status === "Active").length;
  const draftCount = lines.filter(l => l.status === "Draft").length;
  const retiredCount = lines.filter(l => l.status === "Retired").length;
  const chargeTypes = [...new Set(lines.map(l => l.chargeType))].length;
  const changesThisMonth = 5;

  const kpiData = {
    active: activeCount,
    draft: draftCount,
    retired: retiredCount,
    chargeTypes,
    changesThisMonth,
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb + Title */}
      <div className="flex flex-col gap-3">
        <Breadcrumb
          items={[
            { label: "Finance Manager", href: "#" },
            { label: "Tariff Master Editor" },
          ]}
        />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h1 className="text-[24px] lg:text-[32px] font-bold text-[#0F172A] leading-[32px] lg:leading-[40px]">
              Tariff Master Editor
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setShowError(!showError);
                if (!showError) addToast("Error state simulated", "error");
              }}
              className="text-[12px] font-semibold text-[#1B4F8B] hover:text-[#0B2545] cursor-pointer transition-colors"
            >
              {showError ? "Hide Error" : "Simulate Error"}
            </button>
            <button
              onClick={() => {
                setShowEmpty(!showEmpty);
                if (!showEmpty) addToast("Empty state shown", "success");
              }}
              className="text-[12px] font-semibold text-[#1B4F8B] hover:text-[#0B2545] cursor-pointer transition-colors"
            >
              {showEmpty ? "Show Data" : "Simulate Empty"}
            </button>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {showError && (
        <ErrorState
          title="Tariff engine unavailable"
          message="Tariff master service could not be reached. Last successful sync: 09:30 AM."
          onRetry={handleRetry}
        />
      )}

      {/* Main Content */}
      {showEmpty ? (
        <EmptyState
          title="No tariff lines configured"
          description="Create a tariff version and add line items to define chargeable rates by cargo class."
          actionLabel="Create Tariff"
          onAction={() => {
            setShowEmpty(false);
            setIsLoading(true);
            setTimeout(() => setIsLoading(false), 1000);
          }}
        />
      ) : (
        <>
          {/* Top Action Bar */}
          {!isLoading && (
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleAdd}
                className="h-9 px-4 rounded-xl text-[13px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90 flex items-center gap-2 whitespace-nowrap"
                style={{ backgroundColor: "#0B2545" }}
              >
                Add Tariff Version
              </button>
              <button
                onClick={() => addToast("Version cloned", "success")}
                className="h-9 px-3 rounded-xl border border-[#E2E8F0] text-[13px] font-semibold text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer transition-colors whitespace-nowrap"
              >
                Clone Existing
              </button>
              <button
                onClick={() => addToast("Effective date set", "success")}
                className="h-9 px-3 rounded-xl border border-[#E2E8F0] text-[13px] font-semibold text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer transition-colors whitespace-nowrap"
              >
                Set Effective Date
              </button>
              <button
                onClick={() => addToast("Rate card exported", "success")}
                className="h-9 px-3 rounded-xl border border-[#E2E8F0] text-[13px] font-semibold text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer transition-colors whitespace-nowrap"
              >
                Export Rate Card
              </button>
              <button
                onClick={handleViewAudit}
                className="h-9 px-3 rounded-xl border border-[#E2E8F0] text-[13px] font-semibold text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer transition-colors whitespace-nowrap"
              >
                View Audit
              </button>
            </div>
          )}

          {/* KPI Strip */}
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="rounded-[16px] border border-[#E2E8F0] bg-white p-4 shadow-sm">
                  <div className="h-3 w-20 bg-[#F1F5F9] rounded animate-pulse mb-2" />
                  <div className="h-7 w-16 bg-[#F1F5F9] rounded animate-pulse" />
                </div>
              ))}
            </div>
          ) : (
            <KPIStrip data={kpiData} />
          )}

          {/* Filter Bar */}
          {isLoading ? (
            <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-4 shadow-sm">
              <div className="h-10 w-full bg-[#F1F5F9] rounded animate-pulse" />
            </div>
          ) : (
            <FilterBar filters={filters} onFilterChange={setFilters} />
          )}

          {/* Two column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Tariff Version + Line Item Form */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              <TariffVersionCard version={currentVersion} />
              <TariffLineItemForm
                line={selectedLine}
                mode={formMode}
                onSave={handleSave}
                onCancel={() => setSelectedLine(null)}
              />
            </div>

            {/* Right: Tariff Lines Table */}
            <div className="lg:col-span-2">
              {isLoading ? (
                <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
                  <div className="h-5 w-32 bg-[#F1F5F9] rounded animate-pulse mb-4" />
                  <LoadingSkeleton rows={5} columns={11} />
                </div>
              ) : (
                <TariffLinesTable
                  lines={filteredLines}
                  onEdit={handleEdit}
                  onDisable={handleDisable}
                  onClone={handleClone}
                  onViewAudit={handleViewAudit}
                />
              )}
            </div>
          </div>
        </>
      )}

      {/* Audit Drawer */}
      <AuditDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        entries={sampleAudit}
      />
    </div>
  );
}