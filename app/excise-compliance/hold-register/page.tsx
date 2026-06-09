"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ToastContext";
import Breadcrumb from "@/components/Breadcrumb";
import ScopeBadge from "@/components/ScopeBadge";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";
import KPIStrip from "@/components/excise-compliance/hold-register/KPIStrip";
import FilterBar from "@/components/excise-compliance/hold-register/FilterBar";
import HoldTable from "@/components/excise-compliance/hold-register/HoldTable";
import AddHoldDrawer from "@/components/excise-compliance/hold-register/AddHoldDrawer";
import ReleaseHoldDrawer from "@/components/excise-compliance/hold-register/ReleaseHoldDrawer";
import AuditTimeline from "@/components/excise-compliance/hold-register/AuditTimeline";

interface HoldRow {
  id: string;
  holdNum: string;
  awb: string;
  hawb: string;
  holdType: string;
  reason: string;
  createdAt: string;
  createdBy: string;
  owner: string;
  status: string;
  age: string;
  cargoClass: string;
}

const sampleRows: HoldRow[] = [
  {
    id: "1",
    holdNum: "HOLD-2026-00112",
    awb: "214-45678901",
    hawb: "HBL-2091",
    holdType: "Customs",
    reason: "Pending document verification",
    createdAt: "31 May 2026 10:30",
    createdBy: "Sana Khan",
    owner: "Compliance",
    status: "Active",
    age: "2h 15m",
    cargoClass: "General Cargo",
  },
  {
    id: "2",
    holdNum: "HOLD-2026-00113",
    awb: "157-90811223",
    hawb: "HAWB-7781",
    holdType: "ANF",
    reason: "Clearance reference pending",
    createdAt: "31 May 2026 11:05",
    createdBy: "Imran Ali",
    owner: "Compliance",
    status: "Active",
    age: "1h 40m",
    cargoClass: "Pharmaceuticals",
  },
  {
    id: "3",
    holdNum: "HOLD-2026-00114",
    awb: "074-88219033",
    hawb: "HAWB-4412",
    holdType: "Discrepancy",
    reason: "Wrong weight",
    createdAt: "31 May 2026 11:30",
    createdBy: "Ahmed Khan",
    owner: "Warehouse",
    status: "Under Review",
    age: "45m",
    cargoClass: "Machinery",
  },
  {
    id: "4",
    holdNum: "HOLD-2026-00115",
    awb: "235-77890112",
    hawb: "HAWB-3310",
    holdType: "ASF",
    reason: "Security screening pending",
    createdAt: "31 May 2026 09:45",
    createdBy: "Tariq Ahmed",
    owner: "Operations",
    status: "Active",
    age: "3h",
    cargoClass: "Textiles",
  },
  {
    id: "5",
    holdNum: "HOLD-2026-00116",
    awb: "189-33445566",
    hawb: "HAWB-5523",
    holdType: "Internal",
    reason: "Awaiting duty payment confirmation",
    createdAt: "31 May 2026 08:20",
    createdBy: "Sana Khan",
    owner: "Finance",
    status: "Escalated",
    age: "4h 25m",
    cargoClass: "Electronics",
  },
  {
    id: "6",
    holdNum: "HOLD-2026-00117",
    awb: "312-99887766",
    hawb: "HBL-1190",
    holdType: "Customs",
    reason: "Missing commercial invoice",
    createdAt: "31 May 2026 07:30",
    createdBy: "Imran Ali",
    owner: "Compliance",
    status: "Active",
    age: "5h 15m",
    cargoClass: "Perishable",
  },
  {
    id: "7",
    holdNum: "HOLD-2026-00118",
    awb: "147-22113344",
    hawb: "HAWB-8821",
    holdType: "Discrepancy",
    reason: "Piece count mismatch",
    createdAt: "31 May 2026 06:45",
    createdBy: "Ahmed Khan",
    owner: "Warehouse",
    status: "Resolved",
    age: "6h",
    cargoClass: "General Cargo",
  },
  {
    id: "8",
    holdNum: "HOLD-2026-00119",
    awb: "089-55443322",
    hawb: "HAWB-7733",
    holdType: "ANF",
    reason: "NOC clearance required",
    createdAt: "30 May 2026 18:00",
    createdBy: "Tariq Ahmed",
    owner: "Compliance",
    status: "Released",
    age: "18h",
    cargoClass: "Chemicals",
  },
];

const auditEvents = [
  {
    action: "Hold Created",
    user: "Sana Khan",
    timestamp: "31 May 2026 10:30",
    oldStatus: "—",
    newStatus: "Active",
    remarks: "Document verification pending",
  },
  {
    action: "Hold Updated",
    user: "Imran Ali",
    timestamp: "31 May 2026 11:15",
    oldStatus: "Active",
    newStatus: "Escalated",
    remarks: "Escalated to supervisor",
  },
  {
    action: "Hold Updated",
    user: "Ahmed Khan",
    timestamp: "31 May 2026 11:45",
    oldStatus: "Escalated",
    newStatus: "Under Review",
    remarks: "Under review by compliance officer",
  },
  {
    action: "Hold Released",
    user: "Tariq Ahmed",
    timestamp: "31 May 2026 12:00",
    oldStatus: "Under Review",
    newStatus: "Released",
    remarks: "Documents verified and cleared",
  },
];

export default function HoldRegisterPage() {
  const { addToast } = useToast();
  const [rows, setRows] = useState<HoldRow[]>(sampleRows);
  const [filteredRows, setFilteredRows] = useState<HoldRow[]>(sampleRows);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showAddDrawer, setShowAddDrawer] = useState(false);
  const [showReleaseDrawer, setShowReleaseDrawer] = useState(false);
  const [showAudit, setShowAudit] = useState(false);
  const [selectedHold, setSelectedHold] = useState<HoldRow | null>(null);
  const [filters, setFilters] = useState({
    awb: "",
    holdType: "All",
    status: "All",
    createdBy: "",
    owner: "",
    age: "",
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
    if (filters.holdType !== "All") {
      result = result.filter((r) => r.holdType === filters.holdType);
    }
    if (filters.status !== "All") {
      result = result.filter((r) => r.status === filters.status);
    }
    if (filters.createdBy) {
      result = result.filter((r) => r.createdBy.toLowerCase().includes(filters.createdBy.toLowerCase()));
    }
    if (filters.owner) {
      result = result.filter((r) => r.owner.toLowerCase().includes(filters.owner.toLowerCase()));
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

  const handleRelease = (row: HoldRow) => {
    setSelectedHold(row);
    setShowReleaseDrawer(true);
  };

  const handleConfirmRelease = (releaseNotes: string) => {
    if (selectedHold) {
      setRows((prev) =>
        prev.map((r) =>
          r.id === selectedHold.id ? { ...r, status: "Released" } : r
        )
      );
      addToast(
        `Hold ${selectedHold.holdNum} released — ${releaseNotes}`,
        "success"
      );
    }
    setShowReleaseDrawer(false);
    setSelectedHold(null);
  };

  const handleAddHold = (newHold: Omit<HoldRow, "id" | "age" | "createdAt">) => {
    const id = (rows.length + 1).toString();
    const createdAt = "31 May 2026 12:30";
    const age = "Just now";
    setRows((prev) => [
      {
        ...newHold,
        id,
        createdAt,
        age,
      } as HoldRow,
      ...prev,
    ]);
    addToast(`Hold ${newHold.holdNum} created`, "success");
    setShowAddDrawer(false);
  };

  const handleEscalate = (row: HoldRow) => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === row.id ? { ...r, status: "Escalated" } : r
      )
    );
    addToast(`Hold ${row.holdNum} escalated`, "success");
  };

  const handleViewAudit = (row: HoldRow) => {
    setSelectedHold(row);
    setShowAudit(true);
  };

  const activeCount = rows.filter((r) => r.status === "Active").length;
  const customsCount = rows.filter((r) => r.holdType === "Customs").length;
  const anfCount = rows.filter((r) => r.holdType === "ANF").length;
  const asfCount = rows.filter((r) => r.holdType === "ASF").length;
  const internalCount = rows.filter((r) => r.holdType === "Internal").length;
  const discrepancyCount = rows.filter((r) => r.holdType === "Discrepancy").length;

  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto p-6 lg:p-8">
        <div className="mb-6">
          <div className="h-4 w-32 bg-[#F1F5F9] rounded animate-pulse mb-3" />
          <div className="h-8 w-48 bg-[#F1F5F9] rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-28 bg-[#F1F5F9] rounded-2xl animate-pulse" />
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
            { label: "Hold Register" },
          ]}
        />
        <div className="flex items-center gap-2.5 mt-3">
          <h1 className="text-[24px] font-bold text-[#0F172A]">Hold Register</h1>
          <ScopeBadge type="inc" />
        </div>
      </div>

      {error && (
        <div className="mb-6">
          <ErrorState
            title="Failed to load hold register"
            message="Unable to fetch hold records from the system."
            onRetry={() => {
              setError(false);
              addToast("Retrying hold register load", "success");
            }}
          />
        </div>
      )}

      <div className="mb-6">
        <KPIStrip
          active={activeCount}
          customs={customsCount}
          anf={anfCount}
          asf={asfCount}
          internal={internalCount}
          discrepancy={discrepancyCount}
        />
      </div>

      <div className="mb-6">
        <FilterBar
          filters={filters}
          setFilters={setFilters}
          onAddHold={() => setShowAddDrawer(true)}
        />
      </div>

      <div className="mb-6">
        {filteredRows.length > 0 ? (
          <HoldTable
            rows={filteredRows}
            onRelease={handleRelease}
            onEscalate={handleEscalate}
            onViewAudit={handleViewAudit}
          />
        ) : (
          <EmptyState
            title="No active holds found"
            description="No holds match the selected filters. Try adjusting your search criteria."
          />
        )}
      </div>

      {showAudit && selectedHold && (
        <div className="mb-6">
          <AuditTimeline
            holdNum={selectedHold.holdNum}
            events={auditEvents}
            onClose={() => setShowAudit(false)}
          />
        </div>
      )}

      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={handleSimulateError}
          className="h-9 px-4 rounded-lg text-[13px] font-semibold border border-[#DC2626]/30 text-[#DC2626] hover:bg-[#DC2626]/10 cursor-pointer transition-colors"
        >
          Simulate Error
        </button>
        <button
          onClick={() => addToast("Hold register refreshed", "success")}
          className="h-9 px-4 rounded-lg text-[13px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90"
          style={{ backgroundColor: "#0B2545" }}
        >
          Simulate Success
        </button>
      </div>

      <AddHoldDrawer
        isOpen={showAddDrawer}
        onClose={() => setShowAddDrawer(false)}
        onSubmit={handleAddHold}
      />

      <ReleaseHoldDrawer
        isOpen={showReleaseDrawer}
        onClose={() => {
          setShowReleaseDrawer(false);
          setSelectedHold(null);
        }}
        onSubmit={handleConfirmRelease}
        holdNum={selectedHold?.holdNum || ""}
      />
    </div>
  );
}