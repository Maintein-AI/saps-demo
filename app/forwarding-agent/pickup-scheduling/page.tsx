"use client";

import { useState } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import KPIStrip from "@/components/forwarding-agent/pickup-scheduling/KPIStrip";
import FilterBar from "@/components/forwarding-agent/pickup-scheduling/FilterBar";
import BayCalendar from "@/components/forwarding-agent/pickup-scheduling/BayCalendar";
import BookPickupDrawer from "@/components/forwarding-agent/pickup-scheduling/BookPickupDrawer";
import UpcomingPickupsTable from "@/components/forwarding-agent/pickup-scheduling/UpcomingPickupsTable";
import GateRequirementsPanel from "@/components/forwarding-agent/pickup-scheduling/GateRequirementsPanel";

type State = "loading" | "empty" | "error" | "idle";

interface Pickup {
  id: string;
  awb: string;
  do: string;
  driver: string;
  vehicle: string;
  slotDateTime: string;
  bay: string;
  cargoPieces: number;
  status: string;
}

export default function PickupSchedulingPage() {
  const [state, setState] = useState<State>("idle");
  const [bookDrawerOpen, setBookDrawerOpen] = useState(false);
  const [selectedBay, setSelectedBay] = useState<string | undefined>(undefined);
  const [selectedHour, setSelectedHour] = useState<string | undefined>(undefined);
  const [selectedPickup, setSelectedPickup] = useState<Pickup | undefined>(undefined);
  const [showGatePanel, setShowGatePanel] = useState(false);

  const handleFilter = () => {
    setState("idle");
  };

  const handleBook = (bay: string, hour: string) => {
    setSelectedBay(bay);
    setSelectedHour(hour);
    setBookDrawerOpen(true);
  };

  const handleEdit = (pickup: Pickup) => {
    setSelectedPickup(pickup);
    setSelectedBay(pickup.bay);
    setSelectedHour(pickup.slotDateTime.split(", ")[1]);
    setBookDrawerOpen(true);
  };

  const handleViewGate = (pickup: Pickup) => {
    setSelectedPickup(pickup);
    setShowGatePanel(true);
  };

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb
        items={[
          { label: "Forwarding Agent", href: "/forwarding-agent" },
          { label: "Pickup Scheduling" },
        ]}
      />

      <div className="flex items-center gap-2">
        <h1 className="text-[24px] font-bold text-[#0F172A]">Pickup Scheduling</h1>
      </div>

      <KPIStrip />

      <div className="flex flex-col gap-3">
        <FilterBar onFilter={handleFilter} />
      </div>

      {state === "loading" && (
        <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-[15px] font-bold text-[#0F172A]">Available Vehicle Bay Slots</h3>
          </div>
          <LoadingSkeleton rows={5} columns={8} />
        </div>
      )}

      {state === "empty" && (
        <EmptyState
          title="No available pickup slots"
          description="No available pickup slots for selected date. Try a different date or contact the Planner team."
          icon={<span className="text-[24px] text-[#94A3B8]">📅</span>}
          actionLabel="Refresh"
          onAction={() => setState("idle")}
        />
      )}

      {state === "error" && (
        <ErrorState
          message="Failed to load pickup slots. Please check your connection and try again."
          onRetry={() => setState("idle")}
        />
      )}

      {state === "idle" && (
        <>
          <BayCalendar onBook={handleBook} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <UpcomingPickupsTable
                onEdit={handleEdit}
                onViewGate={handleViewGate}
              />
            </div>
            <div className="lg:col-span-1">
              <GateRequirementsPanel
                pickupId={selectedPickup?.id}
                awb={selectedPickup?.awb}
                do={selectedPickup?.do}
              />
            </div>
          </div>
        </>
      )}

      <BookPickupDrawer
        isOpen={bookDrawerOpen}
        onClose={() => setBookDrawerOpen(false)}
        bay={selectedBay}
        hour={selectedHour}
      />
    </div>
  );
}