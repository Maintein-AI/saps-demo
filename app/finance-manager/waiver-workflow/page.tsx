"use client";

import { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import ScopeBadge from "@/components/ScopeBadge";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";
import { useToast } from "@/components/ToastContext";
import KPIStrip from "@/components/finance-manager/waiver-workflow/KPIStrip";
import WorkflowStepper from "@/components/finance-manager/waiver-workflow/WorkflowStepper";
import RequesterForm from "@/components/finance-manager/waiver-workflow/RequesterForm";
import ApproverPanel from "@/components/finance-manager/waiver-workflow/ApproverPanel";
import PendingWaiversTable from "@/components/finance-manager/waiver-workflow/PendingWaiversTable";
import AuditTrail from "@/components/finance-manager/waiver-workflow/AuditTrail";

export interface WaiverRequest {
  id: string;
  invoiceId: string;
  awb: string;
  consignee: string;
  originalAmount: number;
  reason: string;
  waiverType: string;
  waiverValue: number;
  requestedBy: string;
  requestedAt: string;
  status: string;
  age: string;
  approver?: string;
  approvalStatus?: string;
  approvalNotes?: string;
  approvedAmount?: number;
  creditNoteId?: string;
  approvalTimestamp?: string;
  documentUploaded?: boolean;
  reviewStarted?: boolean;
  creditNoteCreated?: boolean;
  invoiceUpdated?: boolean;
  auditLocked?: boolean;
}

const sampleWaivers: WaiverRequest[] = [
  {
    id: "WVR-2026-0121",
    invoiceId: "INV-2026-00487",
    awb: "214-45678901",
    consignee: "Al Noor Traders",
    originalAmount: 165100,
    reason: "Airline delay",
    waiverType: "Percentage",
    waiverValue: 25,
    requestedBy: "Imran Ali",
    requestedAt: "31 May 2026 09:15",
    status: "Pending",
    age: "4h",
    documentUploaded: true,
    reviewStarted: false,
    creditNoteCreated: false,
    invoiceUpdated: false,
    auditLocked: false,
  },
  {
    id: "WVR-2026-0122",
    invoiceId: "INV-2026-00489",
    awb: "157-90811223",
    consignee: "Karachi Pharma Imports",
    originalAmount: 89200,
    reason: "Customs hold",
    waiverType: "Fixed Amount",
    waiverValue: 15000,
    requestedBy: "Sana Khan",
    requestedAt: "31 May 2026 10:30",
    status: "Pending",
    age: "3h",
    documentUploaded: true,
    reviewStarted: false,
    creditNoteCreated: false,
    invoiceUpdated: false,
    auditLocked: false,
  },
  {
    id: "WVR-2026-0123",
    invoiceId: "INV-2026-00490",
    awb: "074-88219033",
    consignee: "Metro Engineering",
    originalAmount: 125000,
    reason: "Force majeure",
    waiverType: "Percentage",
    waiverValue: 50,
    requestedBy: "Ahmed Khan",
    requestedAt: "31 May 2026 08:00",
    status: "Pending",
    age: "5h",
    documentUploaded: true,
    reviewStarted: true,
    creditNoteCreated: false,
    invoiceUpdated: false,
    auditLocked: false,
  },
  {
    id: "WVR-2026-0124",
    invoiceId: "INV-2026-00485",
    awb: "999-11223344",
    consignee: "Sindh Textile Mills",
    originalAmount: 145000,
    reason: "Billing correction",
    waiverType: "Fixed Amount",
    waiverValue: 8000,
    requestedBy: "Imran Ali",
    requestedAt: "30 May 2026 14:00",
    status: "Approved",
    age: "1d",
    approver: "Farooq Ahmed",
    approvalStatus: "Approved",
    approvalNotes: "Verified with billing engine. Correct charge.",
    approvedAmount: 8000,
    creditNoteId: "CN-2026-0091",
    approvalTimestamp: "30 May 2026 16:45",
    documentUploaded: true,
    reviewStarted: true,
    creditNoteCreated: true,
    invoiceUpdated: true,
    auditLocked: true,
  },
  {
    id: "WVR-2026-0125",
    invoiceId: "INV-2026-00486",
    awb: "111-55667788",
    consignee: "Habib Auto Parts",
    originalAmount: 78000,
    reason: "Govt cargo",
    waiverType: "Percentage",
    waiverValue: 100,
    requestedBy: "Sana Khan",
    requestedAt: "30 May 2026 11:20",
    status: "Approved",
    age: "1d",
    approver: "Farooq Ahmed",
    approvalStatus: "Approved",
    approvalNotes: "Government exemption policy confirmed.",
    approvedAmount: 78000,
    creditNoteId: "CN-2026-0092",
    approvalTimestamp: "30 May 2026 13:00",
    documentUploaded: true,
    reviewStarted: true,
    creditNoteCreated: true,
    invoiceUpdated: true,
    auditLocked: true,
  },
  {
    id: "WVR-2026-0126",
    invoiceId: "INV-2026-00488",
    awb: "222-33445566",
    consignee: "Lahore Chemicals",
    originalAmount: 245000,
    reason: "Concession",
    waiverType: "Fixed Amount",
    waiverValue: 45000,
    requestedBy: "Ahmed Khan",
    requestedAt: "29 May 2026 09:30",
    status: "Rejected",
    age: "2d",
    approver: "Farooq Ahmed",
    approvalStatus: "Rejected",
    approvalNotes: "Insufficient justification. Missing freight forwarder approval.",
    approvedAmount: 0,
    approvalTimestamp: "29 May 2026 14:00",
    documentUploaded: true,
    reviewStarted: true,
    creditNoteCreated: false,
    invoiceUpdated: false,
    auditLocked: true,
  },
  {
    id: "WVR-2026-0127",
    invoiceId: "INV-2026-00484",
    awb: "333-77889900",
    consignee: "Faisal Edibles",
    originalAmount: 52000,
    reason: "Airline delay",
    waiverType: "Percentage",
    waiverValue: 15,
    requestedBy: "Imran Ali",
    requestedAt: "29 May 2026 08:45",
    status: "Clarification",
    age: "2d",
    approver: "Farooq Ahmed",
    approvalStatus: "Clarification",
    approvalNotes: "Please attach gate pass delay confirmation.",
    approvalTimestamp: "29 May 2026 11:00",
    documentUploaded: true,
    reviewStarted: true,
    creditNoteCreated: false,
    invoiceUpdated: false,
    auditLocked: false,
  },
];

export default function WaiverWorkflowPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [showError, setShowError] = useState(false);
  const [showEmpty, setShowEmpty] = useState(false);
  const [selectedWaiver, setSelectedWaiver] = useState<WaiverRequest | null>(null);
  const [waivers, setWaivers] = useState<WaiverRequest[]>(sampleWaivers);
  const [approvalNotes, setApprovalNotes] = useState("");
  const [approvedAmount, setApprovedAmount] = useState("");
  const { addToast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleSelectWaiver = (waiver: WaiverRequest) => {
    setSelectedWaiver(waiver);
    setApprovalNotes(waiver.approvalNotes || "");
    setApprovedAmount(
      waiver.approvedAmount ? waiver.approvedAmount.toString() : ""
    );
  };

  const handleApprove = () => {
    if (!selectedWaiver) return;
    const updated = waivers.map((w) =>
      w.id === selectedWaiver.id
        ? {
            ...w,
            status: "Approved",
            approvalStatus: "Approved",
            approver: "Farooq Ahmed",
            approvedAmount: parseFloat(approvedAmount) || w.waiverValue,
            creditNoteId: "CN-2026-0093",
            approvalTimestamp: "31 May 2026 13:30",
            reviewStarted: true,
            creditNoteCreated: true,
            invoiceUpdated: true,
            auditLocked: true,
          }
        : w
    );
    setWaivers(updated);
    setSelectedWaiver(null);
    addToast("Waiver request approved", "success");
  };

  const handleReject = () => {
    if (!selectedWaiver) return;
    const updated = waivers.map((w) =>
      w.id === selectedWaiver.id
        ? {
            ...w,
            status: "Rejected",
            approvalStatus: "Rejected",
            approver: "Farooq Ahmed",
            approvedAmount: 0,
            approvalTimestamp: "31 May 2026 13:30",
            reviewStarted: true,
            creditNoteCreated: false,
            invoiceUpdated: false,
            auditLocked: true,
          }
        : w
    );
    setWaivers(updated);
    setSelectedWaiver(null);
    addToast("Waiver request rejected", "error");
  };

  const handleClarification = () => {
    if (!selectedWaiver) return;
    const updated = waivers.map((w) =>
      w.id === selectedWaiver.id
        ? {
            ...w,
            status: "Clarification",
            approvalStatus: "Clarification",
            approver: "Farooq Ahmed",
            approvalTimestamp: "31 May 2026 13:30",
            reviewStarted: true,
            auditLocked: false,
          }
        : w
    );
    setWaivers(updated);
    setSelectedWaiver(null);
    addToast("Clarification requested", "success");
  };

  const handleRetry = () => {
    setShowError(false);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const pendingCount = waivers.filter((w) => w.status === "Pending").length;
  const approvedToday = waivers.filter((w) => w.status === "Approved").length;
  const rejectedToday = waivers.filter((w) => w.status === "Rejected").length;
  const creditNotes = waivers.filter((w) => w.creditNoteCreated).length;
  const totalWaiver = waivers.reduce((s, w) => s + (w.approvedAmount || w.waiverValue), 0);

  const kpiData = {
    pending: pendingCount,
    approved: approvedToday,
    rejected: rejectedToday,
    creditNotes: creditNotes,
    totalValue: totalWaiver,
  };

  const selectedWaiverFull = waivers.find((w) => w.id === selectedWaiver?.id) || selectedWaiver;

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb + Title */}
      <div className="flex flex-col gap-3">
        <Breadcrumb
          items={[
            { label: "Finance Manager", href: "#" },
            { label: "Waiver Workflow" },
          ]}
        />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h1 className="text-[24px] lg:text-[32px] font-bold text-[#0F172A] leading-[32px] lg:leading-[40px]">
              Waiver Workflow
            </h1>
            <ScopeBadge type="inc" />
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
          title="Waiver engine unavailable"
          message="Approval workflow service could not be reached. Last successful sync: 09:30 AM."
          onRetry={handleRetry}
        />
      )}

      {/* Main Content */}
      {showEmpty ? (
        <EmptyState
          title="No waiver requests pending"
          description="All waiver requests have been processed. New requests will appear here when submitted."
          actionLabel="Refresh"
          onAction={() => {
            setShowEmpty(false);
            setIsLoading(true);
            setTimeout(() => setIsLoading(false), 1000);
          }}
        />
      ) : (
        <>
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

          {/* Workflow Stepper */}
          {isLoading ? (
            <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
              <div className="h-5 w-32 bg-[#F1F5F9] rounded animate-pulse mb-4" />
              <div className="h-4 w-full bg-[#F1F5F9] rounded animate-pulse" />
            </div>
          ) : (
            <WorkflowStepper selectedWaiver={selectedWaiverFull} />
          )}

          {/* Two column layout: Requester + Approver */}
          {selectedWaiverFull && !isLoading && !showError && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RequesterForm waiver={selectedWaiverFull} />
              <ApproverPanel
                waiver={selectedWaiverFull}
                approvalNotes={approvalNotes}
                onNotesChange={setApprovalNotes}
                approvedAmount={approvedAmount}
                onAmountChange={setApprovedAmount}
                onApprove={handleApprove}
                onReject={handleReject}
                onClarification={handleClarification}
              />
            </div>
          )}

          {/* Pending Waivers Table */}
          {isLoading ? (
            <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
              <div className="h-5 w-32 bg-[#F1F5F9] rounded animate-pulse mb-4" />
              <LoadingSkeleton rows={5} columns={10} />
            </div>
          ) : (
            <PendingWaiversTable
              waivers={waivers}
              selectedId={selectedWaiver?.id || ""}
              onSelect={handleSelectWaiver}
            />
          )}

          {/* Audit Trail */}
          {isLoading ? (
            <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
              <div className="h-5 w-32 bg-[#F1F5F9] rounded animate-pulse mb-4" />
              <div className="h-24 w-full bg-[#F1F5F9] rounded animate-pulse" />
            </div>
          ) : (
            <AuditTrail waiver={selectedWaiverFull} />
          )}
        </>
      )}
    </div>
  );
}