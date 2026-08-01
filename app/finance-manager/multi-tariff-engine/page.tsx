"use client";

import { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";
import { useToast } from "@/components/ToastContext";
import KPIStrip from "@/components/finance-manager/multi-tariff-engine/KPIStrip";
import FilterBar from "@/components/finance-manager/multi-tariff-engine/FilterBar";
import TariffSetForm from "@/components/finance-manager/multi-tariff-engine/TariffSetForm";
import MultiTariffMatrixTable from "@/components/finance-manager/multi-tariff-engine/MultiTariffMatrixTable";
import ApprovalDrawer from "@/components/finance-manager/multi-tariff-engine/ApprovalDrawer";
import { MultiTariffSet } from "@/components/finance-manager/multi-tariff-engine/types";

const sampleSets: MultiTariffSet[] = [
  { id: "1", tariffSetName: "Schenker Premium 2026", agentContract: "DB Schenker Contract 2026", consigneeTier: "Preferred", route: "DXB-KHI", cargoClass: "GCR", specialHandling: "Temperature Controlled", rateOverride: 15, approvalRequired: true, effectiveDate: "01 Jun 2026", expiryDate: "31 May 2027", status: "Active", notes: "Premium rates for Schenker contract with cold chain surcharge included.", requestedBy: "Sana Khan", approver: "Farooq Ahmed", approvalStatus: "Approved", approvalNotes: "Contract verified with legal. Rate approved.", approvedAt: "28 May 2026 14:00" },
  { id: "2", tariffSetName: "Kuehne+Nagel Tier A", agentContract: "Kuehne+Nagel Tier A", consigneeTier: "Strategic", route: "DOH-KHI", cargoClass: "DGR", specialHandling: "DG Certified", rateOverride: 22, approvalRequired: true, effectiveDate: "01 Jun 2026", expiryDate: "31 Dec 2026", status: "Active", notes: "Tier A strategic pricing for DG cargo via Doha route.", requestedBy: "Imran Ali", approver: "Farooq Ahmed", approvalStatus: "Approved", approvalNotes: "Strategic partner rate confirmed.", approvedAt: "29 May 2026 11:30" },
  { id: "3", tariffSetName: "Gerry's Standard Import", agentContract: "Gerry's Standard Import", consigneeTier: "Standard", route: "IST-KHI", cargoClass: "ICG", specialHandling: "Standard", rateOverride: 9, approvalRequired: false, effectiveDate: "01 Jun 2026", expiryDate: "31 Aug 2026", status: "Active", notes: "Standard import rates for Gerry's walk-in cargo.", requestedBy: "Ahmed Khan", approver: "—", approvalStatus: "Auto-approved", approvalNotes: "No approval required for standard rates.", approvedAt: "01 Jun 2026 00:00" },
  { id: "4", tariffSetName: "Local Agent Walk-in", agentContract: "Local Agent Walk-in", consigneeTier: "Standard", route: "JED-KHI", cargoClass: "GCR", specialHandling: "Standard", rateOverride: 12, approvalRequired: false, effectiveDate: "01 Jun 2026", expiryDate: "30 Sep 2026", status: "Draft", notes: "Draft rate for new Jeddah route walk-in agents.", requestedBy: "Sana Khan", approver: "", approvalStatus: "Pending", approvalNotes: "", approvedAt: "" },
  { id: "5", tariffSetName: "Government Pharma Exempt", agentContract: "Govt Direct Contract", consigneeTier: "Government", route: "DXB-KHI", cargoClass: "VAL", specialHandling: "Pharma Certified", rateOverride: 0, approvalRequired: true, effectiveDate: "01 Jun 2026", expiryDate: "31 May 2027", status: "Active", notes: "Full exemption for government pharmaceutical imports under FBR notification.", requestedBy: "Imran Ali", approver: "Farooq Ahmed", approvalStatus: "Approved", approvalNotes: "Government exemption verified.", approvedAt: "25 May 2026 09:15" },
  { id: "6", tariffSetName: "Special Approval Project X", agentContract: "Project X NDA", consigneeTier: "Special Approval", route: "DOH-KHI", cargoClass: "AOG", specialHandling: "AOG Priority", rateOverride: 35, approvalRequired: true, effectiveDate: "01 Jun 2026", expiryDate: "31 Jul 2026", status: "Pending", notes: "Confidential project requiring special rate board approval.", requestedBy: "Ahmed Khan", approver: "", approvalStatus: "Pending", approvalNotes: "", approvedAt: "" },
  { id: "7", tariffSetName: "K+N Standard Tier", agentContract: "Kuehne+Nagel Standard", consigneeTier: "Standard", route: "IST-KHI", cargoClass: "GCR", specialHandling: "Standard", rateOverride: 11, approvalRequired: false, effectiveDate: "01 Jun 2026", expiryDate: "30 Nov 2026", status: "Active", notes: "Standard tier for K+N non-strategic clients.", requestedBy: "Sana Khan", approver: "—", approvalStatus: "Auto-approved", approvalNotes: "", approvedAt: "01 Jun 2026 00:00" },
  { id: "8", tariffSetName: "Retired Schenker 2025", agentContract: "DB Schenker Contract 2025", consigneeTier: "Preferred", route: "DXB-KHI", cargoClass: "GCR", specialHandling: "Standard", rateOverride: 14, approvalRequired: true, effectiveDate: "01 Jan 2025", expiryDate: "31 May 2026", status: "Retired", notes: "Superseded by 2026 contract.", requestedBy: "Imran Ali", approver: "Farooq Ahmed", approvalStatus: "Approved", approvalNotes: "Retired as per contract renewal.", approvedAt: "01 Jan 2025 10:00" },
  { id: "9", tariffSetName: "Strategic Oil Pipeline", agentContract: "Pakistan Oilfields Direct", consigneeTier: "Strategic", route: "JED-KHI", cargoClass: "DGR", specialHandling: "DG Certified", rateOverride: 28, approvalRequired: true, effectiveDate: "01 Jun 2026", expiryDate: "31 Dec 2026", status: "Active", notes: "Strategic oilfield equipment rates with DG certification.", requestedBy: "Sana Khan", approver: "Farooq Ahmed", approvalStatus: "Approved", approvalNotes: "Board approved strategic rate.", approvedAt: "30 May 2026 16:00" },
  { id: "10", tariffSetName: "Local Walk-in DG", agentContract: "Local Agent Walk-in", consigneeTier: "Standard", route: "DXB-KHI", cargoClass: "DGR", specialHandling: "DG Certified", rateOverride: 20, approvalRequired: true, effectiveDate: "01 Jun 2026", expiryDate: "31 Oct 2026", status: "Under Review", notes: "DG rates for local walk-in agents requiring safety review.", requestedBy: "Ahmed Khan", approver: "Farooq Ahmed", approvalStatus: "Under Review", approvalNotes: "Awaiting safety compliance certificate.", approvedAt: "" },
  { id: "11", tariffSetName: "Govt AOG Priority", agentContract: "Govt Direct Contract", consigneeTier: "Government", route: "DOH-KHI", cargoClass: "AOG", specialHandling: "AOG Priority", rateOverride: 18, approvalRequired: true, effectiveDate: "01 Jun 2026", expiryDate: "31 May 2027", status: "Active", notes: "Government AOG priority with reduced rate for emergency services.", requestedBy: "Imran Ali", approver: "Farooq Ahmed", approvalStatus: "Approved", approvalNotes: "Emergency services rate confirmed.", approvedAt: "27 May 2026 13:45" },
  { id: "12", tariffSetName: "K+N Project Tier B", agentContract: "Kuehne+Nagel Tier B", consigneeTier: "Preferred", route: "IST-KHI", cargoClass: "VAL", specialHandling: "Pharma Certified", rateOverride: 16, approvalRequired: true, effectiveDate: "01 Jun 2026", expiryDate: "31 Mar 2027", status: "Draft", notes: "Tier B project rates for pharma cargo via Istanbul.", requestedBy: "Sana Khan", approver: "", approvalStatus: "Pending", approvalNotes: "", approvedAt: "" },
];

export default function MultiTariffEnginePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [showError, setShowError] = useState(false);
  const [showEmpty, setShowEmpty] = useState(false);
  const [sets, setSets] = useState<MultiTariffSet[]>(sampleSets);
  const [filteredSets, setFilteredSets] = useState<MultiTariffSet[]>(sampleSets);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedSet, setSelectedSet] = useState<MultiTariffSet | null>(null);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [filters, setFilters] = useState({
    tariffSet: "",
    agentContract: "",
    consigneeTier: "",
    route: "",
    cargoClass: "",
    status: "",
  });
  const { addToast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let filtered = [...sets];
    if (filters.agentContract) filtered = filtered.filter(s => s.agentContract.toLowerCase().includes(filters.agentContract.toLowerCase()));
    if (filters.consigneeTier) filtered = filtered.filter(s => s.consigneeTier === filters.consigneeTier);
    if (filters.route) filtered = filtered.filter(s => s.route === filters.route);
    if (filters.cargoClass) filtered = filtered.filter(s => s.cargoClass === filters.cargoClass);
    if (filters.status) filtered = filtered.filter(s => s.status === filters.status);
    setFilteredSets(filtered);
  }, [filters, sets]);

  const handleAdd = () => {
    setSelectedSet({
      id: "",
      tariffSetName: "",
      agentContract: "DB Schenker Contract 2026",
      consigneeTier: "Standard",
      route: "DXB-KHI",
      cargoClass: "GCR",
      specialHandling: "Standard",
      rateOverride: 0,
      approvalRequired: false,
      effectiveDate: "01 Jun 2026",
      expiryDate: "31 Dec 2026",
      status: "Draft",
      notes: "",
    });
    setFormMode("add");
  };

  const handleEdit = (set: MultiTariffSet) => {
    setSelectedSet(set);
    setFormMode("edit");
  };

  const handleSave = () => {
    addToast("Multi-tariff set saved", "success");
    setSelectedSet(null);
  };

  const handleClone = (set: MultiTariffSet) => {
    const cloned = { ...set, id: String(sets.length + 1), tariffSetName: `${set.tariffSetName} (Clone)`, status: "Draft" as const };
    setSets([...sets, cloned]);
    addToast("Multi-tariff set cloned", "success");
  };

  const handleRetire = (setId: string) => {
    const updated = sets.map(s => s.id === setId ? { ...s, status: "Retired" as const } : s);
    setSets(updated);
    addToast("Multi-tariff set retired", "error");
  };

  const handleSubmitApproval = (set: MultiTariffSet) => {
    const updated = sets.map(s =>
      s.id === set.id
        ? { ...s, approvalStatus: "Pending" as const, status: "Pending" as const, requestedBy: "Sana Khan" }
        : s
    );
    setSets(updated);
    addToast("Approval request submitted", "success");
  };

  const handleViewApproval = (set: MultiTariffSet) => {
    setSelectedSet(set);
    setDrawerOpen(true);
  };

  const handleRetry = () => {
    setShowError(false);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const tariffSets = [...new Set(sets.map(s => s.tariffSetName))].length;
  const agentContracts = [...new Set(sets.map(s => s.agentContract))].length;
  const consigneeTiers = [...new Set(sets.map(s => s.consigneeTier))].length;
  const routeOverrides = [...new Set(sets.map(s => s.route))].length;
  const pendingApprovals = sets.filter(s => s.status === "Pending" || s.approvalStatus === "Pending").length;

  const kpiData = {
    tariffSets,
    agentContracts,
    consigneeTiers,
    routeOverrides,
    pendingApprovals,
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb + Title */}
      <div className="flex flex-col gap-3">
        <Breadcrumb
          items={[
            { label: "Finance Manager", href: "#" },
            { label: "CMTS-grade Multi-Tariff Engine" },
          ]}
        />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h1 className="text-[24px] lg:text-[32px] font-bold text-[#0F172A] leading-[32px] lg:leading-[40px]">
              CMTS-grade Multi-Tariff Engine
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
          title="Multi-tariff engine unavailable"
          message="Advanced tariff matrix service could not be reached. Last successful sync: 09:30 AM."
          onRetry={handleRetry}
        />
      )}

      {/* Main Content */}
      {showEmpty ? (
        <EmptyState
          title="No multi-tariff sets configured"
          description="Create advanced tariff sets with agent contracts, consignee tiers, and route overrides."
          actionLabel="Create Set"
          onAction={() => {
            setShowEmpty(false);
            setIsLoading(true);
            setTimeout(() => setIsLoading(false), 1000);
          }}
        />
      ) : (
        <>
          {/* Info Banner */}
          {!isLoading && (
            <div className="rounded-[16px] border border-[#FEF3C7] bg-[#FEF3C7]/30 p-4 shadow-sm flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
              </div>
              <div>
                <span className="text-[13px] font-semibold text-[#D97706] block mb-0.5">
                  Extended Scope Notice
                </span>
                <span className="text-[13px] text-[#D97706]/80">
                  This advanced multi-tariff engine is outside awarded contract scope and belongs to the One-Window Vision delta.
                </span>
              </div>
            </div>
          )}

          {/* Top Action Bar */}
          {!isLoading && (
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleAdd}
                className="h-9 px-4 rounded-xl text-[13px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90 flex items-center gap-2 whitespace-nowrap"
                style={{ backgroundColor: "#0B2545" }}
              >
                Add Tariff Set
              </button>
              <button
                onClick={() => addToast("Rate card exported", "success")}
                className="h-9 px-3 rounded-xl border border-[#E2E8F0] text-[13px] font-semibold text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer transition-colors whitespace-nowrap"
              >
                Export Rate Card
              </button>
              <button
                onClick={() => addToast("Effective date set", "success")}
                className="h-9 px-3 rounded-xl border border-[#E2E8F0] text-[13px] font-semibold text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer transition-colors whitespace-nowrap"
              >
                Set Effective Date
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
            {/* Left: Tariff Set Form */}
            <div className="lg:col-span-1">
              <TariffSetForm
                tariffSet={selectedSet}
                mode={formMode}
                onSave={handleSave}
                onCancel={() => setSelectedSet(null)}
              />
            </div>

            {/* Right: Multi-Tariff Matrix Table */}
            <div className="lg:col-span-2">
              {isLoading ? (
                <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
                  <div className="h-5 w-32 bg-[#F1F5F9] rounded animate-pulse mb-4" />
                  <LoadingSkeleton rows={5} columns={11} />
                </div>
              ) : (
                <MultiTariffMatrixTable
                  sets={filteredSets}
                  onEdit={handleEdit}
                  onClone={handleClone}
                  onRetire={handleRetire}
                  onSubmitApproval={handleSubmitApproval}
                  onViewApproval={handleViewApproval}
                />
              )}
            </div>
          </div>
        </>
      )}

      {/* Approval Drawer */}
      <ApprovalDrawer
        isOpen={drawerOpen}
        onClose={() => { setDrawerOpen(false); setSelectedSet(null); }}
        tariffSet={selectedSet}
      />
    </div>
  );
}