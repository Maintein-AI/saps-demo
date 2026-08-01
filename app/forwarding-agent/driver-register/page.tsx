"use client";

import { useState } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import ErrorState from "@/components/ErrorState";
import EmptyState from "@/components/EmptyState";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import KPIStrip from "@/components/forwarding-agent/driver-register/KPIStrip";
import FilterBar from "@/components/forwarding-agent/driver-register/FilterBar";
import DriverListTable from "@/components/forwarding-agent/driver-register/DriverListTable";
import DriverProfileDrawer from "@/components/forwarding-agent/driver-register/DriverProfileDrawer";
import VisitHistoryDrawer from "@/components/forwarding-agent/driver-register/VisitHistoryDrawer";
import AssignAWBDrawer from "@/components/forwarding-agent/driver-register/AssignAWBDrawer";
import { Users, FolderOpen } from "lucide-react";

interface Driver {
  id: string;
  name: string;
  cnic: string;
  mobile: string;
  photo: string;
  license: string;
  licenseExpiry: string;
  allowedAWBs: string[];
  allowedDOs: string[];
  lastVisit: string;
  status: "Active" | "Blocked" | "License Expired" | "Verification Required";
  notes: string;
}

export default function DriverRegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [empty, setEmpty] = useState(false);
  const [profileDrawerOpen, setProfileDrawerOpen] = useState(false);
  const [profileMode, setProfileMode] = useState<"add" | "edit">("add");
  const [selectedDriver, setSelectedDriver] = useState<Driver | undefined>();
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);
  const [assignDrawerOpen, setAssignDrawerOpen] = useState(false);

  const handleFilter = () => {
    // filter logic
  };

  const handleEdit = (driver: Driver) => {
    setSelectedDriver(driver);
    setProfileMode("edit");
    setProfileDrawerOpen(true);
  };

  const handleAdd = () => {
    setSelectedDriver(undefined);
    setProfileMode("add");
    setProfileDrawerOpen(true);
  };

  const handleViewHistory = (driver: Driver) => {
    setSelectedDriver(driver);
    setHistoryDrawerOpen(true);
  };

  const handleAssign = (driver: Driver) => {
    setSelectedDriver(driver);
    setAssignDrawerOpen(true);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Breadcrumb
          items={[
            { label: "Forwarding Agent", href: "/forwarding-agent" },
            { label: "Driver Register" },
          ]}
        />
        <div className="flex items-center gap-3">
          <h1 className="text-[22px] font-bold text-[#0F172A]">Driver Register</h1>
        </div>
      </div>

      <KPIStrip />

      <FilterBar onFilter={handleFilter} />

      {error && (
        <ErrorState
          message="Failed to load driver data. Please check your connection and try again."
          onRetry={() => setError(false)}
        />
      )}

      {loading ? (
        <LoadingSkeleton rows={6} columns={10} />
      ) : empty ? (
        <EmptyState
          title="No drivers registered yet"
          description="Your forwarding agency has not registered any drivers. Add drivers to enable AWB/DO pickup scheduling."
          icon={<Users size={28} className="text-[#94A3B8]" />}
          actionLabel="Add Driver"
          onAction={handleAdd}
        />
      ) : (
        <DriverListTable
          onEdit={handleEdit}
          onViewHistory={handleViewHistory}
          onAssign={handleAssign}
          onAdd={handleAdd}
        />
      )}

      <DriverProfileDrawer
        isOpen={profileDrawerOpen}
        onClose={() => setProfileDrawerOpen(false)}
        driver={selectedDriver}
        mode={profileMode}
      />

      <VisitHistoryDrawer
        isOpen={historyDrawerOpen}
        onClose={() => setHistoryDrawerOpen(false)}
        driver={selectedDriver}
      />

      <AssignAWBDrawer
        isOpen={assignDrawerOpen}
        onClose={() => setAssignDrawerOpen(false)}
        driver={selectedDriver}
      />
    </div>
  );
}