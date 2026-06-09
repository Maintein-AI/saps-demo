"use client";

import { useState } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import ScopeBadge from "@/components/ScopeBadge";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import KPIStrip from "@/components/forwarding-agent/notifications-history/KPIStrip";
import FilterBar from "@/components/forwarding-agent/notifications-history/FilterBar";
import NotificationList from "@/components/forwarding-agent/notifications-history/NotificationList";
import ActionHistoryTable from "@/components/forwarding-agent/notifications-history/ActionHistoryTable";
import NotificationDetailDrawer from "@/components/forwarding-agent/notifications-history/NotificationDetailDrawer";

type State = "loading" | "empty" | "error" | "idle";

interface Notification {
  id: string;
  type: string;
  awb: string;
  message: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  time: string;
  status: "Unread" | "Read" | "Action Required" | "Resolved";
  readAt?: string;
  relatedEntity?: string;
}

export default function NotificationsHistoryPage() {
  const [state, setState] = useState<State>("idle");
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | undefined>(undefined);

  const handleFilter = () => {
    setState("idle");
  };

  const handleView = (notification: Notification) => {
    setSelectedNotification(notification);
    setDetailDrawerOpen(true);
  };

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb
        items={[
          { label: "Forwarding Agent", href: "/forwarding-agent" },
          { label: "Notifications & History" },
        ]}
      />

      <div className="flex items-center gap-2">
        <h1 className="text-[24px] font-bold text-[#0F172A]">Notifications & History</h1>
        <ScopeBadge type="exc" />
      </div>

      <KPIStrip />

      <div className="flex flex-col gap-3">
        <FilterBar onFilter={handleFilter} />
      </div>

      {state === "loading" && (
        <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-[15px] font-bold text-[#0F172A]">Notifications</h3>
            <ScopeBadge type="exc" />
          </div>
          <LoadingSkeleton rows={5} columns={6} />
        </div>
      )}

      {state === "empty" && (
        <EmptyState
          title="No notifications found"
          description="No notifications match your current filters. Try adjusting your search criteria or check back later."
          icon={<span className="text-[24px] text-[#94A3B8]">📭</span>}
          actionLabel="Refresh"
          onAction={() => setState("idle")}
        />
      )}

      {state === "error" && (
        <ErrorState
          message="Failed to load notifications. Please check your connection and try again."
          onRetry={() => setState("idle")}
        />
      )}

      {state === "idle" && (
        <>
          <NotificationList onView={handleView} />
          <ActionHistoryTable />
        </>
      )}

      <NotificationDetailDrawer
        isOpen={detailDrawerOpen}
        onClose={() => setDetailDrawerOpen(false)}
        notification={selectedNotification}
      />
    </div>
  );
}