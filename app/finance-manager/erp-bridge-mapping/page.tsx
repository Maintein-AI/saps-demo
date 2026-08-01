"use client";

import { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";
import { useToast } from "@/components/ToastContext";
import KPIStrip from "@/components/finance-manager/erp-bridge-mapping/KPIStrip";
import FilterBar from "@/components/finance-manager/erp-bridge-mapping/FilterBar";
import ERPTargetCard from "@/components/finance-manager/erp-bridge-mapping/ERPTargetCard";
import GLMappingForm from "@/components/finance-manager/erp-bridge-mapping/GLMappingForm";
import PostingMappingsTable from "@/components/finance-manager/erp-bridge-mapping/PostingMappingsTable";
import SyncLogTable from "@/components/finance-manager/erp-bridge-mapping/SyncLogTable";
import DetailDrawer from "@/components/finance-manager/erp-bridge-mapping/DetailDrawer";
import { ERPMapping, ERPSyncLog } from "@/components/finance-manager/erp-bridge-mapping/types";

const sampleMappings: ERPMapping[] = [
  { id: "1", mappingId: "MAP-001", chargeType: "Handling Charges", glAccount: "120000", taxAccount: "210000", costCenter: "CC001-KHI", postingRule: "Standard", debitCredit: "Debit", taxCode: "VAT-17", currency: "PKR", active: true, notes: "Standard warehouse handling charges", syncStatus: "Success", lastUpdated: "04 Jun 2026 09:30" },
  { id: "2", mappingId: "MAP-002", chargeType: "Storage Charges", glAccount: "120100", taxAccount: "210000", costCenter: "CC001-KHI", postingRule: "Standard", debitCredit: "Debit", taxCode: "VAT-17", currency: "PKR", active: true, notes: "Cold storage and ambient storage", syncStatus: "Success", lastUpdated: "03 Jun 2026 14:00" },
  { id: "3", mappingId: "MAP-003", chargeType: "Customs Clearance", glAccount: "120200", taxAccount: "210000", costCenter: "CC002-Customs", postingRule: "Standard", debitCredit: "Debit", taxCode: "GST-18", currency: "PKR", active: true, notes: "Customs clearance and brokerage", syncStatus: "Success", lastUpdated: "02 Jun 2026 11:15" },
  { id: "4", mappingId: "MAP-004", chargeType: "Transport", glAccount: "120300", taxAccount: "210000", costCenter: "CC003-Trans", postingRule: "Split", debitCredit: "Debit", taxCode: "VAT-17", currency: "PKR", active: true, notes: "Transport and delivery charges", syncStatus: "Pending", lastUpdated: "04 Jun 2026 08:00" },
  { id: "5", mappingId: "MAP-005", chargeType: "Demurrage", glAccount: "120400", taxAccount: "210000", costCenter: "CC001-KHI", postingRule: "Standard", debitCredit: "Debit", taxCode: "VAT-17", currency: "PKR", active: true, notes: "Demurrage and detention charges", syncStatus: "Success", lastUpdated: "01 Jun 2026 16:30" },
  { id: "6", mappingId: "MAP-006", chargeType: "Bond Fee", glAccount: "120500", taxAccount: "210000", costCenter: "CC002-Customs", postingRule: "Standard", debitCredit: "Debit", taxCode: "Zero", currency: "PKR", active: false, notes: "Government bond fee — zero rated", syncStatus: "Skipped", lastUpdated: "28 May 2026 10:00" },
  { id: "7", mappingId: "MAP-007", chargeType: "Documentation", glAccount: "120600", taxAccount: "210000", costCenter: "CC001-KHI", postingRule: "Consolidated", debitCredit: "Debit", taxCode: "VAT-17", currency: "PKR", active: true, notes: "AWB, manifest, and documentation fees", syncStatus: "Success", lastUpdated: "03 Jun 2026 09:00" },
  { id: "8", mappingId: "MAP-008", chargeType: "Insurance", glAccount: "120700", taxAccount: "210000", costCenter: "CC004-Insurance", postingRule: "Standard", debitCredit: "Debit", taxCode: "Exempt", currency: "USD", active: true, notes: "Cargo insurance premiums", syncStatus: "Failed", lastUpdated: "04 Jun 2026 07:00" },
  { id: "9", mappingId: "MAP-009", chargeType: "Fuel Surcharge", glAccount: "120800", taxAccount: "210000", costCenter: "CC003-Trans", postingRule: "Auto-Post", debitCredit: "Debit", taxCode: "VAT-17", currency: "PKR", active: true, notes: "Variable fuel surcharge", syncStatus: "Retrying", lastUpdated: "04 Jun 2026 09:15" },
  { id: "10", mappingId: "MAP-010", chargeType: "Security Fee", glAccount: "120900", taxAccount: "210000", costCenter: "CC005-Security", postingRule: "Standard", debitCredit: "Debit", taxCode: "VAT-17", currency: "PKR", active: true, notes: "Aviation security screening", syncStatus: "Success", lastUpdated: "02 Jun 2026 13:00" },
  { id: "11", mappingId: "MAP-011", chargeType: "Handling Charges", glAccount: "120000", taxAccount: "210000", costCenter: "CC006-LHE", postingRule: "Standard", debitCredit: "Debit", taxCode: "VAT-17", currency: "PKR", active: true, notes: "Lahore branch handling charges", syncStatus: "Pending", lastUpdated: "04 Jun 2026 09:00" },
  { id: "12", mappingId: "MAP-012", chargeType: "Storage Charges", glAccount: "120100", taxAccount: "210000", costCenter: "CC006-LHE", postingRule: "Standard", debitCredit: "Debit", taxCode: "VAT-17", currency: "PKR", active: false, notes: "Retired — merged with KHI storage", syncStatus: "Skipped", lastUpdated: "15 May 2026 08:00" },
];

const sampleSyncLogs: ERPSyncLog[] = [
  { id: "1", syncId: "SYNC-2026-001", invoiceNo: "INV-2026-0847", journalRef: "JV-2026-0847", erpTarget: "SAP", amount: 48750, tax: 8287, status: "Success", sentAt: "04 Jun 2026 09:30", response: "200 OK — Journal posted. Doc# 900012847", awbNo: "420-9876543", chargeType: "Handling Charges", glAccount: "120000", costCenter: "CC001-KHI", payload: "{ \"invoice\": \"INV-2026-0847\", \"glAccount\": \"120000\", \"amount\": 48750, \"tax\": 8287, \"costCenter\": \"CC001-KHI\" }", auditTrail: "04 Jun 2026 09:30: Sync initiated\n04 Jun 2026 09:30: SAP API called\n04 Jun 2026 09:30: 200 OK received" },
  { id: "2", syncId: "SYNC-2026-002", invoiceNo: "INV-2026-0848", journalRef: "JV-2026-0848", erpTarget: "SAP", amount: 125000, tax: 21250, status: "Success", sentAt: "04 Jun 2026 09:31", response: "200 OK — Journal posted. Doc# 900012848", awbNo: "420-8765432", chargeType: "Storage Charges", glAccount: "120100", costCenter: "CC001-KHI", payload: "{ \"invoice\": \"INV-2026-0848\", \"glAccount\": \"120100\", \"amount\": 125000, \"tax\": 21250 }", auditTrail: "04 Jun 2026 09:31: Sync initiated\n04 Jun 2026 09:31: SAP API called\n04 Jun 2026 09:31: 200 OK received" },
  { id: "3", syncId: "SYNC-2026-003", invoiceNo: "INV-2026-0849", journalRef: "JV-2026-0849", erpTarget: "SAP", amount: 18200, tax: 3094, status: "Pending", sentAt: "04 Jun 2026 09:32", response: "", awbNo: "420-7654321", chargeType: "Customs Clearance", glAccount: "120200", costCenter: "CC002-Customs", payload: "{ \"invoice\": \"INV-2026-0849\", \"glAccount\": \"120200\", \"amount\": 18200, \"tax\": 3094 }", auditTrail: "04 Jun 2026 09:32: Sync queued — awaiting batch window" },
  { id: "4", syncId: "SYNC-2026-004", invoiceNo: "INV-2026-0850", journalRef: "", erpTarget: "Oracle", amount: 87500, tax: 14875, status: "Failed", sentAt: "04 Jun 2026 09:33", response: "500 Internal Server Error — Oracle GL service timeout", awbNo: "420-6543210", chargeType: "Transport", glAccount: "120300", costCenter: "CC003-Trans", payload: "{ \"invoice\": \"INV-2026-0850\", \"glAccount\": \"120300\", \"amount\": 87500, \"tax\": 14875 }", auditTrail: "04 Jun 2026 09:33: Sync initiated\n04 Jun 2026 09:33: Oracle API called\n04 Jun 2026 09:35: 500 Error — timeout" },
  { id: "5", syncId: "SYNC-2026-005", invoiceNo: "INV-2026-0851", journalRef: "JV-2026-0851", erpTarget: "SAP", amount: 0, tax: 0, status: "Skipped", sentAt: "04 Jun 2026 09:34", response: "Zero amount — auto skipped", awbNo: "420-5432109", chargeType: "Bond Fee", glAccount: "120500", costCenter: "CC002-Customs", payload: "{ \"invoice\": \"INV-2026-0851\", \"glAccount\": \"120500\", \"amount\": 0, \"tax\": 0 }", auditTrail: "04 Jun 2026 09:34: Sync initiated\n04 Jun 2026 09:34: Zero amount detected — skipped" },
  { id: "6", syncId: "SYNC-2026-006", invoiceNo: "INV-2026-0852", journalRef: "JV-2026-0852", erpTarget: "SAP", amount: 45200, tax: 7684, status: "Success", sentAt: "04 Jun 2026 09:35", response: "200 OK — Journal posted. Doc# 900012852", awbNo: "420-4321098", chargeType: "Documentation", glAccount: "120600", costCenter: "CC001-KHI", payload: "{ \"invoice\": \"INV-2026-0852\", \"glAccount\": \"120600\", \"amount\": 45200, \"tax\": 7684 }", auditTrail: "04 Jun 2026 09:35: Sync initiated\n04 Jun 2026 09:35: SAP API called\n04 Jun 2026 09:35: 200 OK received" },
  { id: "7", syncId: "SYNC-2026-007", invoiceNo: "INV-2026-0853", journalRef: "", erpTarget: "Oracle", amount: 67500, tax: 11475, status: "Retrying", sentAt: "04 Jun 2026 09:36", response: "503 Service Unavailable — retry attempt 2/3", awbNo: "420-3210987", chargeType: "Insurance", glAccount: "120700", costCenter: "CC004-Insurance", payload: "{ \"invoice\": \"INV-2026-0853\", \"glAccount\": \"120700\", \"amount\": 67500, \"tax\": 11475 }", auditTrail: "04 Jun 2026 09:36: Sync initiated\n04 Jun 2026 09:36: Oracle API called\n04 Jun 2026 09:37: 503 — retry scheduled" },
  { id: "8", syncId: "SYNC-2026-008", invoiceNo: "INV-2026-0854", journalRef: "JV-2026-0854", erpTarget: "SAP", amount: 23400, tax: 3978, status: "Success", sentAt: "04 Jun 2026 09:37", response: "200 OK — Journal posted. Doc# 900012854", awbNo: "420-2109876", chargeType: "Fuel Surcharge", glAccount: "120800", costCenter: "CC003-Trans", payload: "{ \"invoice\": \"INV-2026-0854\", \"glAccount\": \"120800\", \"amount\": 23400, \"tax\": 3978 }", auditTrail: "04 Jun 2026 09:37: Sync initiated\n04 Jun 2026 09:37: SAP API called\n04 Jun 2026 09:37: 200 OK received" },
  { id: "9", syncId: "SYNC-2026-009", invoiceNo: "INV-2026-0855", journalRef: "", erpTarget: "SAP", amount: 189000, tax: 32130, status: "Pending", sentAt: "04 Jun 2026 09:38", response: "", awbNo: "420-1098765", chargeType: "Security Fee", glAccount: "120900", costCenter: "CC005-Security", payload: "{ \"invoice\": \"INV-2026-0855\", \"glAccount\": \"120900\", \"amount\": 189000, \"tax\": 32130 }", auditTrail: "04 Jun 2026 09:38: Sync queued — awaiting batch window" },
  { id: "10", syncId: "SYNC-2026-010", invoiceNo: "INV-2026-0856", journalRef: "JV-2026-0856", erpTarget: "SAP", amount: 52000, tax: 8840, status: "Success", sentAt: "04 Jun 2026 09:39", response: "200 OK — Journal posted. Doc# 900012856", awbNo: "420-0987654", chargeType: "Handling Charges", glAccount: "120000", costCenter: "CC006-LHE", payload: "{ \"invoice\": \"INV-2026-0856\", \"glAccount\": \"120000\", \"amount\": 52000, \"tax\": 8840 }", auditTrail: "04 Jun 2026 09:39: Sync initiated\n04 Jun 2026 09:39: SAP API called\n04 Jun 2026 09:39: 200 OK received" },
  { id: "11", syncId: "SYNC-2026-011", invoiceNo: "INV-2026-0857", journalRef: "", erpTarget: "Oracle", amount: 8900, tax: 1513, status: "Failed", sentAt: "04 Jun 2026 09:40", response: "401 Unauthorized — API token expired", awbNo: "420-9876543", chargeType: "Documentation", glAccount: "120600", costCenter: "CC001-KHI", payload: "{ \"invoice\": \"INV-2026-0857\", \"glAccount\": \"120600\", \"amount\": 8900, \"tax\": 1513 }", auditTrail: "04 Jun 2026 09:40: Sync initiated\n04 Jun 2026 09:40: Oracle API called\n04 Jun 2026 09:40: 401 — token expired" },
  { id: "12", syncId: "SYNC-2026-012", invoiceNo: "INV-2026-0858", journalRef: "JV-2026-0858", erpTarget: "SAP", amount: 31000, tax: 5270, status: "Success", sentAt: "04 Jun 2026 09:41", response: "200 OK — Journal posted. Doc# 900012858", awbNo: "420-8765432", chargeType: "Customs Clearance", glAccount: "120200", costCenter: "CC002-Customs", payload: "{ \"invoice\": \"INV-2026-0858\", \"glAccount\": \"120200\", \"amount\": 31000, \"tax\": 5270 }", auditTrail: "04 Jun 2026 09:41: Sync initiated\n04 Jun 2026 09:41: SAP API called\n04 Jun 2026 09:41: 200 OK received" },
];

export default function ERPBridgeMappingPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [showError, setShowError] = useState(false);
  const [showEmpty, setShowEmpty] = useState(false);
  const [mappings, setMappings] = useState<ERPMapping[]>(sampleMappings);
  const [filteredMappings, setFilteredMappings] = useState<ERPMapping[]>(sampleMappings);
  const [syncLogs] = useState<ERPSyncLog[]>(sampleSyncLogs);
  const [filteredLogs, setFilteredLogs] = useState<ERPSyncLog[]>(sampleSyncLogs);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<ERPSyncLog | null>(null);
  const [filters, setFilters] = useState({
    chargeType: "",
    glAccount: "",
    syncStatus: "",
    erpTarget: "",
    invoiceNo: "",
  });
  const { addToast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let filtered = [...mappings];
    if (filters.chargeType) filtered = filtered.filter(m => m.chargeType === filters.chargeType);
    if (filters.glAccount) filtered = filtered.filter(m => m.glAccount.toLowerCase().includes(filters.glAccount.toLowerCase()));
    if (filters.syncStatus) filtered = filtered.filter(m => m.syncStatus === filters.syncStatus);
    setFilteredMappings(filtered);

    let logFiltered = [...syncLogs];
    if (filters.syncStatus) logFiltered = logFiltered.filter(l => l.status === filters.syncStatus);
    if (filters.erpTarget) logFiltered = logFiltered.filter(l => l.erpTarget === filters.erpTarget);
    if (filters.invoiceNo) logFiltered = logFiltered.filter(l => l.invoiceNo.toLowerCase().includes(filters.invoiceNo.toLowerCase()));
    setFilteredLogs(logFiltered);
  }, [filters, mappings, syncLogs]);

  const handleEdit = (m: ERPMapping) => {
    addToast(`Mapping ${m.mappingId} opened for edit`, "success");
  };

  const handleDelete = (id: string) => {
    setMappings(mappings.filter(m => m.id !== id));
    addToast("Mapping deleted", "error");
  };

  const handlePush = (m: ERPMapping) => {
    addToast(`Mapping ${m.mappingId} pushed to ERP`, "success");
  };

  const handleMappingRetry = (m: ERPMapping) => {
    const updated = mappings.map(map => map.id === m.id ? { ...map, syncStatus: "Retrying" as const } : map);
    setMappings(updated);
    addToast(`Mapping ${m.mappingId} retry initiated`, "success");
  };

  const handleViewDetail = (l: ERPSyncLog) => {
    setSelectedLog(l);
    setDrawerOpen(true);
  };

  const handleViewPayload = (l: ERPSyncLog) => {
    addToast(`Payload for ${l.syncId} opened`, "success");
  };

  const handleRetryLog = (l: ERPSyncLog) => {
    addToast(`Retry initiated for ${l.syncId}`, "success");
  };

  const handleRetry = () => {
    setShowError(false);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const kpiData = {
    erpMappings: mappings.length,
    successfulPushes: syncLogs.filter(l => l.status === "Success").length,
    failedPushes: syncLogs.filter(l => l.status === "Failed").length,
    pendingJournals: syncLogs.filter(l => l.status === "Pending").length,
    glExceptions: syncLogs.filter(l => l.status === "Failed").length,
    lastSync: "04 Jun 2026 09:41",
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb + Title */}
      <div className="flex flex-col gap-3">
        <Breadcrumb
          items={[
            { label: "Finance Manager", href: "#" },
            { label: "ERP Bridge Mapping" },
          ]}
        />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h1 className="text-[24px] lg:text-[32px] font-bold text-[#0F172A] leading-[32px] lg:leading-[40px]">
              ERP Bridge Mapping
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
          title="ERP Bridge unavailable"
          message="ERP integration service could not be reached. Last successful sync: 09:30 AM."
          onRetry={handleRetry}
        />
      )}

      {/* Main Content */}
      {showEmpty ? (
        <EmptyState
          title="No ERP mappings configured"
          description="Create GL mapping rules to connect AirVault finance transactions with your SAP or Oracle ERP system."
          actionLabel="Create Mapping"
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
                  ERP Bridge is outside awarded contract scope and supports optional SAP/Oracle accounting integration.
                </span>
              </div>
            </div>
          )}

          {/* Top Actions */}
          {!isLoading && (
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => addToast("ERP mapping saved", "success")}
                className="h-9 px-4 rounded-xl text-[13px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90 flex items-center gap-2 whitespace-nowrap"
                style={{ backgroundColor: "#0B2545" }}
              >
                Add Mapping
              </button>
              <button
                onClick={() => addToast("Connection test initiated", "success")}
                className="h-9 px-3 rounded-xl border border-[#E2E8F0] text-[13px] font-semibold text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer transition-colors whitespace-nowrap"
              >
                Test Connection
              </button>
              <button
                onClick={() => addToast("Pending journals pushed", "success")}
                className="h-9 px-3 rounded-xl border border-[#E2E8F0] text-[13px] font-semibold text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer transition-colors whitespace-nowrap"
              >
                Push Pending Journals
              </button>
              <button
                onClick={() => addToast("Failed entries retried", "success")}
                className="h-9 px-3 rounded-xl border border-[#E2E8F0] text-[13px] font-semibold text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer transition-colors whitespace-nowrap"
              >
                Retry Failed
              </button>
              <button
                onClick={() => addToast("Mapping exported", "success")}
                className="h-9 px-3 rounded-xl border border-[#E2E8F0] text-[13px] font-semibold text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer transition-colors whitespace-nowrap"
              >
                Export Mapping
              </button>
            </div>
          )}

          {/* KPI Strip */}
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
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

          {/* Three column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: ERP Target + GL Form */}
            <div className="lg:col-span-3 flex flex-col gap-6">
              <ERPTargetCard />
              <GLMappingForm />
            </div>

            {/* Right: Tables */}
            <div className="lg:col-span-9 flex flex-col gap-6">
              {/* Posting Mappings Table */}
              {isLoading ? (
                <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
                  <div className="h-5 w-40 bg-[#F1F5F9] rounded animate-pulse mb-4" />
                  <LoadingSkeleton rows={5} columns={10} />
                </div>
              ) : (
                <PostingMappingsTable
                  mappings={filteredMappings}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onPush={handlePush}
                  onRetry={handleRetry}
                />
              )}

              {/* Sync Log Table */}
              {isLoading ? (
                <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
                  <div className="h-5 w-32 bg-[#F1F5F9] rounded animate-pulse mb-4" />
                  <LoadingSkeleton rows={5} columns={9} />
                </div>
              ) : (
                <SyncLogTable
                  logs={filteredLogs}
                  onViewDetail={handleViewDetail}
                  onViewPayload={handleViewPayload}
                  onRetry={handleRetryLog}
                />
              )}
            </div>
          </div>
        </>
      )}

      {/* Detail Drawer */}
      <DetailDrawer
        isOpen={drawerOpen}
        onClose={() => { setDrawerOpen(false); setSelectedLog(null); }}
        log={selectedLog}
      />
    </div>
  );
}