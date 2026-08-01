"use client";

import { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import ErrorState from "@/components/ErrorState";
import EmptyState from "@/components/EmptyState";
import { useToast } from "@/components/ToastContext";
import KPIStrip from "@/components/gate-entry/driver-identity-register/KPIStrip";
import FilterBar from "@/components/gate-entry/driver-identity-register/FilterBar";
import DriverRegistryTable from "@/components/gate-entry/driver-identity-register/DriverRegistryTable";
import DriverDrawer from "@/components/gate-entry/driver-identity-register/DriverDrawer";
import VisitHistoryTable from "@/components/gate-entry/driver-identity-register/VisitHistoryTable";

const mockDrivers = [
  {
    name: "Ahmed Raza",
    cnic: "4210112345671",
    mobile: "03001234567",
    license: "LHR-458201",
    licenseExpiry: "15 Dec 2026",
    agents: "DB Schenker",
    awbs: "DO-90871",
    lastVisit: "31 May 2026",
    status: "Active",
  },
  {
    name: "Imran Ali",
    cnic: "3520211223344",
    mobile: "03011234567",
    license: "KHI-772102",
    licenseExpiry: "22 Mar 2027",
    agents: "Gerry's",
    awbs: "AWB 214-45678901",
    lastVisit: "31 May 2026",
    status: "Active",
  },
  {
    name: "Salman Khan",
    cnic: "4220119876543",
    mobile: "03021234567",
    license: "ISB-209903",
    licenseExpiry: "08 Jun 2026",
    agents: "—",
    awbs: "—",
    lastVisit: "30 May 2026",
    status: "Expired License",
  },
  {
    name: "Nadeem Hussain",
    cnic: "4210198765432",
    mobile: "03031234567",
    license: "LHE-300104",
    licenseExpiry: "10 Nov 2027",
    agents: "DHL",
    awbs: "DO-90865",
    lastVisit: "31 May 2026",
    status: "Active",
  },
  {
    name: "Farooq Ahmed",
    cnic: "3520298765432",
    mobile: "03041234567",
    license: "RWP-771205",
    licenseExpiry: "01 Jan 2025",
    agents: "Gerry's",
    awbs: "AWB 157-90811223",
    lastVisit: "30 May 2026",
    status: "Blocked",
  },
  {
    name: "Kamran Ali",
    cnic: "4210187654321",
    mobile: "03051234567",
    license: "FSB-112306",
    licenseExpiry: "14 Sep 2026",
    agents: "DHL",
    awbs: "DO-90872",
    lastVisit: "29 May 2026",
    status: "Verification Required",
  },
];

const mockVisits = [
  {
    date: "31 May 2026",
    vehicle: "KHI-4582",
    purpose: "Cargo pickup",
    doc: "DO-90871",
    entryTime: "09:40",
    exitTime: "11:15",
    result: "Cleared",
    guard: "Sgt. Imran Haider",
  },
  {
    date: "31 May 2026",
    vehicle: "BJU-7721",
    purpose: "Cargo drop",
    doc: "AWB 214-45678901",
    entryTime: "10:15",
    exitTime: "12:30",
    result: "Cleared",
    guard: "Sgt. Tariq",
  },
  {
    date: "30 May 2026",
    vehicle: "LEA-2099",
    purpose: "Supplier",
    doc: "—",
    entryTime: "10:35",
    exitTime: "11:05",
    result: "Hold",
    guard: "Sgt. Imran Haider",
  },
  {
    date: "29 May 2026",
    vehicle: "KHI-3001",
    purpose: "Cargo pickup",
    doc: "DO-90865",
    entryTime: "08:20",
    exitTime: "10:45",
    result: "Cleared",
    guard: "Sgt. Tariq",
  },
  {
    date: "28 May 2026",
    vehicle: "RWP-7712",
    purpose: "Cargo drop",
    doc: "AWB 157-90811223",
    entryTime: "11:00",
    exitTime: "13:20",
    result: "Cleared",
    guard: "Sgt. Imran Haider",
  },
];

export default function DriverIdentityRegisterPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [showError, setShowError] = useState(false);
  const [showEmpty, setShowEmpty] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [drawerMode, setDrawerMode] = useState("add");
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [drivers, setDrivers] = useState(mockDrivers);
  const { addToast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleRetry = () => {
    setShowError(false);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleAdd = () => {
    setDrawerMode("add");
    setSelectedDriver(null);
    setShowDrawer(true);
  };

  const handleEdit = (driver: any) => {
    setDrawerMode("edit");
    setSelectedDriver(driver);
    setShowDrawer(true);
  };

  const handleSave = () => {
    setShowDrawer(false);
    addToast("Driver record saved", "success");
  };

  const handleBlock = (driver: any) => {
    addToast(`Driver ${driver.name} blocked`, "error");
  };

  const handleViewHistory = (driver: any) => {
    addToast(`Viewing visit history for ${driver.name}`, "success");
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Breadcrumb + Title */}
      <div className="flex flex-col gap-3">
        <Breadcrumb
          items={[
            { label: "Gate Entry", href: "#" },
            { label: "Driver Identity Register" },
          ]}
        />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h1 className="text-[24px] lg:text-[32px] font-bold text-[#0F172A] leading-[32px] lg:leading-[40px]">
              Driver Identity Register
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
                setIsLoading(true);
                setTimeout(() => setIsLoading(false), 1000);
                addToast("Loading state simulated", "success");
              }}
              className="text-[12px] font-semibold text-[#1B4F8B] hover:text-[#0B2545] cursor-pointer transition-colors"
            >
              Simulate Loading
            </button>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {showError && (
        <ErrorState
          title="Driver registry unavailable"
          message="Connection to the driver database failed. Retry or use offline records."
          onRetry={handleRetry}
        />
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
                <div className="h-4 w-24 bg-[#F1F5F9] rounded animate-pulse mb-4" />
                <div className="h-8 w-16 bg-[#F1F5F9] rounded animate-pulse" />
              </div>
            ))}
          </div>
          <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
            <div className="h-5 w-48 bg-[#F1F5F9] rounded animate-pulse mb-5" />
            <div className="h-10 w-full bg-[#F1F5F9] rounded-xl animate-pulse mb-5" />
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-14 rounded-xl bg-[#F1F5F9] animate-pulse" />
              ))}
            </div>
          </div>
          <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
            <div className="h-5 w-48 bg-[#F1F5F9] rounded animate-pulse mb-5" />
            <div className="h-48 rounded-xl bg-[#F1F5F9] animate-pulse" />
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* KPI Strip */}
          <KPIStrip />

          {/* Empty State */}
          {showEmpty ? (
            <EmptyState
              title="No drivers registered yet"
              description="Start digitising the driver registry by adding the first driver record."
              actionLabel="Add First Driver"
              onAction={() => { setShowEmpty(false); handleAdd(); }}
            />
          ) : (
            <>
              {/* Filter Bar */}
              <FilterBar />

              {/* Add Driver Button */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="text-[18px] font-semibold text-[#0F172A]">Driver Registry</h2>
                </div>
                <button
                  onClick={handleAdd}
                  className="h-10 px-5 rounded-xl text-[13px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90 flex items-center gap-2"
                  style={{ backgroundColor: "#0B2545" }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" />
                    <path d="M12 5v14" />
                  </svg>
                  Add Driver
                </button>
              </div>

              {/* Driver Table */}
              <DriverRegistryTable
                drivers={drivers}
                onEdit={handleEdit}
                onBlock={handleBlock}
                onViewHistory={handleViewHistory}
              />

              {/* Visit History */}
              <div className="flex items-center gap-3 mt-2">
                <h2 className="text-[18px] font-semibold text-[#0F172A]">Driver Visit History</h2>
              </div>
              <VisitHistoryTable visits={mockVisits} />
            </>
          )}
        </div>
      )}

      {/* Drawer */}
      <DriverDrawer
        isOpen={showDrawer}
        onClose={() => setShowDrawer(false)}
        mode={drawerMode}
        driver={selectedDriver}
        onSave={handleSave}
      />
    </div>
  );
}