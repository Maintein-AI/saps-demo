"use client";

import { useState } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import ScopeBadge from "@/components/ScopeBadge";
import ErrorState from "@/components/ErrorState";
import EmptyState from "@/components/EmptyState";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import KPIStrip from "@/components/forwarding-agent/vehicle-register/KPIStrip";
import FilterBar from "@/components/forwarding-agent/vehicle-register/FilterBar";
import VehicleListTable from "@/components/forwarding-agent/vehicle-register/VehicleListTable";
import VehicleProfileDrawer from "@/components/forwarding-agent/vehicle-register/VehicleProfileDrawer";
import VehicleVisitHistoryDrawer from "@/components/forwarding-agent/vehicle-register/VehicleVisitHistoryDrawer";
import AssignPickupDrawer from "@/components/forwarding-agent/vehicle-register/AssignPickupDrawer";
import { Truck } from "lucide-react";

interface Vehicle {
  id: string;
  plate: string;
  type: string;
  capacity: string;
  photo: string;
  owner: string;
  insuranceExpiry: string;
  lastVisit: string;
  status: "Active" | "Blocked" | "Insurance Expired" | "Verification Required";
  notes: string;
}

export default function VehicleRegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [empty, setEmpty] = useState(false);
  const [profileDrawerOpen, setProfileDrawerOpen] = useState(false);
  const [profileMode, setProfileMode] = useState<"add" | "edit">("add");
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | undefined>();
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);
  const [assignDrawerOpen, setAssignDrawerOpen] = useState(false);

  const handleFilter = () => {
    // filter logic
  };

  const handleEdit = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setProfileMode("edit");
    setProfileDrawerOpen(true);
  };

  const handleAdd = () => {
    setSelectedVehicle(undefined);
    setProfileMode("add");
    setProfileDrawerOpen(true);
  };

  const handleViewHistory = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setHistoryDrawerOpen(true);
  };

  const handleAssign = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setAssignDrawerOpen(true);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Breadcrumb
          items={[
            { label: "Forwarding Agent", href: "/forwarding-agent" },
            { label: "Vehicle Register" },
          ]}
        />
        <div className="flex items-center gap-3">
          <h1 className="text-[22px] font-bold text-[#0F172A]">Vehicle Register</h1>
          <ScopeBadge type="exc" />
        </div>
      </div>

      <KPIStrip />

      <FilterBar onFilter={handleFilter} />

      {error && (
        <ErrorState
          message="Failed to load vehicle data. Please check your connection and try again."
          onRetry={() => setError(false)}
        />
      )}

      {loading ? (
        <LoadingSkeleton rows={6} columns={9} />
      ) : empty ? (
        <EmptyState
          title="No vehicles registered yet"
          description="Your forwarding agency has not registered any vehicles. Add vehicles to enable pickup scheduling and gate pre-registration."
          icon={<Truck size={28} className="text-[#94A3B8]" />}
          actionLabel="Add Vehicle"
          onAction={handleAdd}
        />
      ) : (
        <VehicleListTable
          onEdit={handleEdit}
          onViewHistory={handleViewHistory}
          onAssign={handleAssign}
          onAdd={handleAdd}
        />
      )}

      <VehicleProfileDrawer
        isOpen={profileDrawerOpen}
        onClose={() => setProfileDrawerOpen(false)}
        vehicle={selectedVehicle}
        mode={profileMode}
      />

      <VehicleVisitHistoryDrawer
        isOpen={historyDrawerOpen}
        onClose={() => setHistoryDrawerOpen(false)}
        vehicle={selectedVehicle}
      />

      <AssignPickupDrawer
        isOpen={assignDrawerOpen}
        onClose={() => setAssignDrawerOpen(false)}
        vehicle={selectedVehicle}
      />
    </div>
  );
}