"use client";

import { useState, useEffect } from "react";
import AdminKPICard from "../AdminKPICard";
import RecentUserActivity from "./RecentUserActivity";
import IntegrationStatus from "./IntegrationStatus";
import MasterDataChanges from "./MasterDataChanges";
import SecurityAlerts from "./SecurityAlerts";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import ErrorState from "@/components/ErrorState";
import EmptyState from "@/components/EmptyState";
import { useToast } from "@/components/ToastContext";

export default function AdminDashboardContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [showError, setShowError] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleRetry = () => {
    setShowError(false);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div className="space-y-8">
      {showError ? (
        <ErrorState
          title="Dashboard data unavailable"
          message="The admin dashboard feed could not be refreshed. Last successful sync: 08:15 AM."
          onRetry={handleRetry}
        />
      ) : isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
              <div className="h-4 w-24 bg-[#F1F5F9] rounded animate-pulse mb-4" />
              <div className="h-8 w-16 bg-[#F1F5F9] rounded animate-pulse" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <AdminKPICard title="Active Users" value="184" subtitle="Across 8 portals" trend="up" trendValue="+12" />
          <AdminKPICard title="Locked Users" value="9" subtitle="Requires action" trend="down" trendValue="-3" />
          <AdminKPICard title="Roles Configured" value="17" subtitle="6 system, 11 custom" />
          <AdminKPICard title="Integration Health" value="87%" subtitle="13 of 15 online" trend="down" trendValue="-2" />
          <AdminKPICard title="Failed Events" value="23" subtitle="Last 24 hours" trend="up" trendValue="+5" />
          <AdminKPICard title="Audit Events Today" value="1,247" subtitle="28 critical" trend="up" trendValue="+12%" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentUserActivity isLoading={isLoading} />
        <IntegrationStatus isLoading={isLoading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MasterDataChanges isLoading={isLoading} />
        <SecurityAlerts isLoading={isLoading} />
      </div>
    </div>
  );
}