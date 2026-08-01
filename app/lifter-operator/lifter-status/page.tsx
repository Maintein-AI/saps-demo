"use client";

import { useState } from "react";
import { Home, Forklift, Battery, AlertTriangle, Truck } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";
import { useToast } from "@/components/ToastContext";
import CurrentAsset from "@/components/lifter-operator/lifter-status/CurrentAsset";
import BatteryStatus from "@/components/lifter-operator/lifter-status/BatteryStatus";
import ChargingStation from "@/components/lifter-operator/lifter-status/ChargingStation";
import RecentEvents from "@/components/lifter-operator/lifter-status/RecentEvents";
import FaultDrawer from "@/components/lifter-operator/lifter-status/FaultDrawer";

const assetData = {
  id: "FL-03",
  type: "Forklift",
  operator: "Ahmed Khan",
  status: "Available",
  battery: 68,
  location: "AFU Aisle 02",
  lastCharge: "08:10 AM",
  lastMovement: "11:42 AM",
  activeTasks: 1,
  maintenanceWarning: "Brake pad wear due in 48 hours",
};

function LoadingSkeleton() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl border border-[#E2E8F0] bg-white p-5 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-32 h-5 rounded bg-[#E2E8F0] animate-pulse" />
              <div className="w-10 h-5 rounded bg-[#E2E8F0] animate-pulse" />
            </div>
            <div className="w-full h-20 rounded-xl bg-[#E2E8F0] animate-pulse" />
            <div className="grid grid-cols-2 gap-3">
              <div className="h-14 rounded-xl bg-[#E2E8F0] animate-pulse" />
              <div className="h-14 rounded-xl bg-[#E2E8F0] animate-pulse" />
              <div className="h-14 rounded-xl bg-[#E2E8F0] animate-pulse" />
              <div className="h-14 rounded-xl bg-[#E2E8F0] animate-pulse" />
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-32 h-5 rounded bg-[#E2E8F0] animate-pulse" />
          <div className="w-10 h-5 rounded bg-[#E2E8F0] animate-pulse" />
        </div>
        <div className="h-40 rounded-xl bg-[#E2E8F0] animate-pulse" />
      </div>
    </div>
  );
}

export default function LifterStatusPage() {
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [faultOpen, setFaultOpen] = useState(false);

  const breadcrumbItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Lifter Operator", href: "/lifter-operator" },
    { label: "Lifter Status", href: "#" },
  ];

  const handleReportFault = () => {
    addToast("Fault reported successfully", "success");
  };

  return (
    <div className="space-y-5">
      <Breadcrumb items={breadcrumbItems} />

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0B2545] flex items-center justify-center">
            <Forklift size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-[22px] font-bold text-[#0F172A] tracking-tight">
              Lifter Status / Charging
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFaultOpen(true)}
            className="h-10 px-4 rounded-xl text-[13px] font-semibold border border-[#DC2626]/30 text-[#DC2626] hover:bg-[#FEF2F2] cursor-pointer transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <AlertTriangle size={16} />
            Report Lifter Fault
          </button>
        </div>
      </div>

      {/* State Toggles */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => { setIsLoading(false); setIsError(false); setIsEmpty(false); }}
          className="h-7 px-3 rounded-lg text-[11px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer transition-colors"
        >
          Normal
        </button>
        <button
          onClick={() => { setIsLoading(true); setIsError(false); setIsEmpty(false); }}
          className="h-7 px-3 rounded-lg text-[11px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer transition-colors"
        >
          Loading
        </button>
        <button
          onClick={() => { setIsLoading(false); setIsError(true); setIsEmpty(false); }}
          className="h-7 px-3 rounded-lg text-[11px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer transition-colors"
        >
          Error
        </button>
        <button
          onClick={() => { setIsLoading(false); setIsError(false); setIsEmpty(true); }}
          className="h-7 px-3 rounded-lg text-[11px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer transition-colors"
        >
          Empty
        </button>
      </div>

      {/* States */}
      {isLoading && <LoadingSkeleton />}

      {isError && (
        <div className="space-y-5">
          <ErrorState
            title="Lifter status failed to load"
            message="Unable to fetch lifter asset data from the server. The connection may be down or the asset is not registered."
            onRetry={() => setIsError(false)}
          />
          <LoadingSkeleton />
        </div>
      )}

      {isEmpty && (
        <EmptyState
          title="No lifter asset assigned"
          description="You do not currently have a lifter asset assigned to your operator ID. Contact the supervisor to get a vehicle assigned."
          icon={<Truck size={28} className="text-[#94A3B8]" />}
        />
      )}

      {/* Normal State */}
      {!isLoading && !isError && !isEmpty && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <CurrentAsset asset={assetData} />
            <BatteryStatus
              battery={assetData.battery}
              runtime="3 hrs 42 min"
              threshold={30}
              status={assetData.battery >= 60 ? "Good" : assetData.battery >= 30 ? "Low" : "Critical"}
            />
            <ChargingStation />
          </div>

          <RecentEvents />
        </div>
      )}

      {/* Fault Drawer */}
      <FaultDrawer
        isOpen={faultOpen}
        onClose={() => setFaultOpen(false)}
        assetId={assetData.id}
        assetType={assetData.type}
        location={assetData.location}
        onSubmit={handleReportFault}
      />
    </div>
  );
}