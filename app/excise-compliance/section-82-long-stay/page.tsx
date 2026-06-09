"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ToastContext";
import Breadcrumb from "@/components/Breadcrumb";
import ScopeBadge from "@/components/ScopeBadge";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";
import KPIStrip from "@/components/excise-compliance/section-82-long-stay/KPIStrip";
import WorkflowStageCards from "@/components/excise-compliance/section-82-long-stay/WorkflowStageCards";
import FilterBar from "@/components/excise-compliance/section-82-long-stay/FilterBar";
import LongStayTable from "@/components/excise-compliance/section-82-long-stay/LongStayTable";
import DetailDrawer from "@/components/excise-compliance/section-82-long-stay/DetailDrawer";

interface LongStayRow {
  id: string;
  caseNum: string;
  awb: string;
  hawb: string;
  consignee: string;
  cargoClass: string;
  pieces: string;
  weight: string;
  arrivalDate: string;
  daysInStorage: number;
  noticeStatus: string;
  currentStage: string;
  customsDecision: string;
  finalDisposition: string;
  owner: string;
  freePeriodExpiry: string;
  escalationDate: string;
  remarks: string;
}

const sampleRows: LongStayRow[] = [
  {
    id: "1",
    caseNum: "LS-2026-00451",
    awb: "214-45678901",
    hawb: "HBL-2091",
    consignee: "Al Noor Traders",
    cargoClass: "AFU",
    pieces: "24",
    weight: "1,240 kg",
    arrivalDate: "12 Apr 2026",
    daysInStorage: 49,
    noticeStatus: "Notice Sent",
    currentStage: "Customs Decision",
    customsDecision: "Pending",
    finalDisposition: "—",
    owner: "Compliance",
    freePeriodExpiry: "26 Apr 2026",
    escalationDate: "—",
    remarks: "Awaiting consignee response",
  },
  {
    id: "2",
    caseNum: "LS-2026-00452",
    awb: "157-90811223",
    hawb: "HAWB-7781",
    consignee: "Karachi Pharma Imports",
    cargoClass: "PER",
    pieces: "8",
    weight: "420 kg",
    arrivalDate: "08 Apr 2026",
    daysInStorage: 53,
    noticeStatus: "Escalated",
    currentStage: "Customs Decision",
    customsDecision: "Release Approved",
    finalDisposition: "Release",
    owner: "Compliance",
    freePeriodExpiry: "22 Apr 2026",
    escalationDate: "28 May 2026",
    remarks: "Customs cleared for release",
  },
  {
    id: "3",
    caseNum: "LS-2026-00453",
    awb: "074-88219033",
    hawb: "HAWB-4412",
    consignee: "Metro Engineering",
    cargoClass: "GCR",
    pieces: "16",
    weight: "680 kg",
    arrivalDate: "01 Apr 2026",
    daysInStorage: 60,
    noticeStatus: "Final Notice",
    currentStage: "Final Disposition",
    customsDecision: "Auction",
    finalDisposition: "Auction Pending",
    owner: "Warehouse",
    freePeriodExpiry: "15 Apr 2026",
    escalationDate: "16 May 2026",
    remarks: "Auction scheduled for 15 Jun 2026",
  },
  {
    id: "4",
    caseNum: "LS-2026-00454",
    awb: "189-22334455",
    hawb: "HAWB-9922",
    consignee: "United Textiles Ltd",
    cargoClass: "TXL",
    pieces: "42",
    weight: "2,100 kg",
    arrivalDate: "15 Mar 2026",
    daysInStorage: 77,
    noticeStatus: "Notice Sent",
    currentStage: "Notify",
    customsDecision: "Pending",
    finalDisposition: "—",
    owner: "Compliance",
    freePeriodExpiry: "29 Mar 2026",
    escalationDate: "—",
    remarks: "Consignee contacted via email",
  },
  {
    id: "5",
    caseNum: "LS-2026-00455",
    awb: "312-66778899",
    hawb: "HBL-1177",
    consignee: "Pak Electronics",
    cargoClass: "ELC",
    pieces: "12",
    weight: "350 kg",
    arrivalDate: "20 Feb 2026",
    daysInStorage: 100,
    noticeStatus: "Final Notice",
    currentStage: "Final Disposition",
    customsDecision: "Disposal",
    finalDisposition: "Disposal Approved",
    owner: "Compliance",
    freePeriodExpiry: "06 Mar 2026",
    escalationDate: "15 Apr 2026",
    remarks: "Disposal approved by customs",
  },
  {
    id: "6",
    caseNum: "LS-2026-00456",
    awb: "147-11223344",
    hawb: "HAWB-3355",
    consignee: "Al Noor Traders",
    cargoClass: "AFU",
    pieces: "30",
    weight: "1,500 kg",
    arrivalDate: "10 May 2026",
    daysInStorage: 21,
    noticeStatus: "Notice Sent",
    currentStage: "Escalate",
    customsDecision: "Pending",
    finalDisposition: "—",
    owner: "Warehouse",
    freePeriodExpiry: "24 May 2026",
    escalationDate: "—",
    remarks: "Second notice sent",
  },
  {
    id: "7",
    caseNum: "LS-2026-00457",
    awb: "089-55667788",
    hawb: "HAWB-2288",
    consignee: "Seafood Pakistan",
    cargoClass: "PER",
    pieces: "18",
    weight: "900 kg",
    arrivalDate: "25 Mar 2026",
    daysInStorage: 67,
    noticeStatus: "Escalated",
    currentStage: "Customs Decision",
    customsDecision: "Release Approved",
    finalDisposition: "Released",
    owner: "Compliance",
    freePeriodExpiry: "08 Apr 2026",
    escalationDate: "20 May 2026",
    remarks: "Released after customs clearance",
  },
];

export default function Section82LongStayPage() {
  const { addToast } = useToast();
  const [rows, setRows] = useState<LongStayRow[]>(sampleRows);
  const [filteredRows, setFilteredRows] = useState<LongStayRow[]>(sampleRows);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedRow, setSelectedRow] = useState<LongStayRow | null>(null);
  const [filters, setFilters] = useState({
    awb: "",
    consignee: "",
    daysInStorage: "",
    noticeStatus: "All",
    currentStage: "All",
    customsDecision: "All",
    cargoClass: "",
  });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let result = [...rows];
    if (filters.awb) {
      result = result.filter((r) => r.awb.toLowerCase().includes(filters.awb.toLowerCase()));
    }
    if (filters.consignee) {
      result = result.filter((r) => r.consignee.toLowerCase().includes(filters.consignee.toLowerCase()));
    }
    if (filters.daysInStorage) {
      result = result.filter((r) => r.daysInStorage >= parseInt(filters.daysInStorage));
    }
    if (filters.noticeStatus !== "All") {
      result = result.filter((r) => r.noticeStatus === filters.noticeStatus);
    }
    if (filters.currentStage !== "All") {
      result = result.filter((r) => r.currentStage === filters.currentStage);
    }
    if (filters.customsDecision !== "All") {
      result = result.filter((r) => r.customsDecision === filters.customsDecision);
    }
    if (filters.cargoClass) {
      result = result.filter((r) => r.cargoClass.toLowerCase().includes(filters.cargoClass.toLowerCase()));
    }
    setFilteredRows(result);
  }, [filters, rows]);

  const handleSimulateError = () => {
    setError(true);
    setTimeout(() => setError(false), 3000);
  };

  const handleViewDetail = (row: LongStayRow) => {
    setSelectedRow(row);
    setShowDetail(true);
  };

  const handleGenerateNotice = (row: LongStayRow) => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === row.id ? { ...r, noticeStatus: "Notice Sent" } : r
      )
    );
    addToast(`Notice generated for case ${row.caseNum}`, "success");
  };

  const handleEscalate = (row: LongStayRow) => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === row.id
          ? { ...r, noticeStatus: "Escalated", currentStage: "Customs Decision", escalationDate: "31 May 2026" }
          : r
      )
    );
    addToast(`Case ${row.caseNum} escalated to customs`, "success");
  };

  const handleRecordDecision = (row: LongStayRow) => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === row.id ? { ...r, customsDecision: "Release Approved", currentStage: "Final Disposition" } : r
      )
    );
    addToast(`Customs decision recorded for case ${row.caseNum}`, "success");
  };

  const handleRecordDisposition = (row: LongStayRow) => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === row.id ? { ...r, finalDisposition: "Auction Pending", currentStage: "Final Disposition" } : r
      )
    );
    addToast(`Final disposition recorded for case ${row.caseNum}`, "success");
  };

  const longStayCount = rows.length;
  const noticeDue = rows.filter((r) => r.daysInStorage > 30 && r.noticeStatus === "Notice Sent").length;
  const escalatedToCustoms = rows.filter((r) => r.noticeStatus === "Escalated").length;
  const customsDecisionPending = rows.filter((r) => r.customsDecision === "Pending").length;
  const auctionDisposal = rows.filter((r) => r.customsDecision === "Auction" || r.customsDecision === "Disposal").length;
  const releasedAfterEscalation = rows.filter((r) => r.finalDisposition === "Released" || r.finalDisposition === "Release").length;

  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto p-6 lg:p-8">
        <div className="mb-6">
          <div className="h-4 w-32 bg-[#F1F5F9] rounded animate-pulse mb-3" />
          <div className="h-8 w-64 bg-[#F1F5F9] rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-28 bg-[#F1F5F9] rounded-2xl animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 bg-[#F1F5F9] rounded-2xl animate-pulse" />
          ))}
        </div>
        <div className="h-12 bg-[#F1F5F9] rounded-2xl animate-pulse mb-6" />
        <div className="h-80 bg-[#F1F5F9] rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8">
      <div className="mb-6">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Excise & Compliance", href: "/excise-compliance" },
            { label: "Section 82 / Long-Stay Register" },
          ]}
        />
        <div className="flex items-center gap-2.5 mt-3">
          <h1 className="text-[24px] font-bold text-[#0F172A]">Section 82 / Long-Stay Register</h1>
          <ScopeBadge type="inc" />
        </div>
      </div>

      {error && (
        <div className="mb-6">
          <ErrorState
            title="Failed to load long-stay register"
            message="Unable to fetch long-stay records from the system."
            onRetry={() => {
              setError(false);
              addToast("Retrying long-stay register load", "success");
            }}
          />
        </div>
      )}

      <div className="mb-6">
        <KPIStrip
          longStay={longStayCount}
          noticeDue={noticeDue}
          escalated={escalatedToCustoms}
          decisionPending={customsDecisionPending}
          auctionDisposal={auctionDisposal}
          releasedAfter={releasedAfterEscalation}
        />
      </div>

      <div className="mb-6">
        <WorkflowStageCards />
      </div>

      <div className="mb-6">
        <FilterBar
          filters={filters}
          setFilters={setFilters}
        />
      </div>

      <div className="mb-6">
        {filteredRows.length > 0 ? (
          <LongStayTable
            rows={filteredRows}
            onViewDetail={handleViewDetail}
            onGenerateNotice={handleGenerateNotice}
            onEscalate={handleEscalate}
            onRecordDecision={handleRecordDecision}
            onRecordDisposition={handleRecordDisposition}
          />
        ) : (
          <EmptyState
            title="No long-stay cargo found"
            description="No long-stay cargo matches the selected filters. Try adjusting your search criteria."
          />
        )}
      </div>

      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={handleSimulateError}
          className="h-9 px-4 rounded-lg text-[13px] font-semibold border border-[#DC2626]/30 text-[#DC2626] hover:bg-[#DC2626]/10 cursor-pointer transition-colors"
        >
          Simulate Error
        </button>
        <button
          onClick={() => addToast("Long-stay register refreshed", "success")}
          className="h-9 px-4 rounded-lg text-[13px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90"
          style={{ backgroundColor: "#0B2545" }}
        >
          Simulate Success
        </button>
      </div>

      <DetailDrawer
        isOpen={showDetail}
        onClose={() => {
          setShowDetail(false);
          setSelectedRow(null);
        }}
        row={selectedRow}
      />
    </div>
  );
}