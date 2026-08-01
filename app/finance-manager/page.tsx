"use client";

import { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";
import { useToast } from "@/components/ToastContext";
import KPIStrip from "@/components/finance-manager/KPIStrip";
import BillingTrendChart from "@/components/finance-manager/BillingTrendChart";
import OutstandingAging from "@/components/finance-manager/OutstandingAging";
import WaiverRequests from "@/components/finance-manager/WaiverRequests";
import CollectionExceptions from "@/components/finance-manager/CollectionExceptions";
import BillingAlerts from "@/components/finance-manager/BillingAlerts";
import ExciseNavCards from "@/components/finance-manager/ExciseNavCards";

export default function FinanceDashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [showError, setShowError] = useState(false);
  const [showEmpty, setShowEmpty] = useState(false);
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

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb + Title */}
      <div className="flex flex-col gap-3">
        <Breadcrumb
          items={[
            { label: "Finance Manager", href: "#" },
            { label: "Dashboard" },
          ]}
        />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h1 className="text-[24px] lg:text-[32px] font-bold text-[#0F172A] leading-[32px] lg:leading-[40px]">
              Finance Dashboard
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

      {/* KPI Strip */}
      {showError ? (
        <ErrorState
          title="Finance data unavailable"
          message="ERP sync failed. Last successful sync: 09:30 AM."
          onRetry={handleRetry}
        />
      ) : isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
              <div className="h-4 w-24 bg-[#F1F5F9] rounded animate-pulse mb-3" />
              <div className="h-8 w-16 bg-[#F1F5F9] rounded animate-pulse" />
            </div>
          ))}
        </div>
      ) : (
        <KPIStrip />
      )}

      {/* Main Content */}
      {showEmpty ? (
        <EmptyState
          title="No finance activity for selected date"
          description="Try adjusting the date range or check back after the next billing cycle."
          actionLabel="Refresh Data"
          onAction={() => {
            setShowEmpty(false);
            setIsLoading(true);
            setTimeout(() => setIsLoading(false), 800);
          }}
        />
      ) : (
        <>
          {/* Row 1: Billing Trend + Outstanding Aging */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {isLoading ? (
                <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
                  <div className="h-5 w-32 bg-[#F1F5F9] rounded animate-pulse mb-4" />
                  <div className="h-64 bg-[#F1F5F9] rounded animate-pulse" />
                </div>
              ) : (
                <BillingTrendChart />
              )}
            </div>
            <div>
              {isLoading ? (
                <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
                  <div className="h-5 w-32 bg-[#F1F5F9] rounded animate-pulse mb-4" />
                  <div className="space-y-3">
                    <div className="h-6 w-full bg-[#F1F5F9] rounded animate-pulse" />
                    <div className="h-6 w-full bg-[#F1F5F9] rounded animate-pulse" />
                    <div className="h-6 w-full bg-[#F1F5F9] rounded animate-pulse" />
                    <div className="h-6 w-full bg-[#F1F5F9] rounded animate-pulse" />
                    <div className="h-6 w-full bg-[#F1F5F9] rounded animate-pulse" />
                  </div>
                </div>
              ) : (
                <OutstandingAging />
              )}
            </div>
          </div>

          {/* Row 2: Waiver + Collection */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              {isLoading ? (
                <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
                  <div className="h-5 w-32 bg-[#F1F5F9] rounded animate-pulse mb-4" />
                  <LoadingSkeleton rows={4} columns={8} />
                </div>
              ) : (
                <WaiverRequests />
              )}
            </div>
            <div>
              {isLoading ? (
                <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
                  <div className="h-5 w-32 bg-[#F1F5F9] rounded animate-pulse mb-4" />
                  <LoadingSkeleton rows={4} columns={6} />
                </div>
              ) : (
                <CollectionExceptions />
              )}
            </div>
          </div>

          {/* Row 3: Billing Alerts */}
          <div>
            {isLoading ? (
              <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
                <div className="h-5 w-32 bg-[#F1F5F9] rounded animate-pulse mb-4" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-20 bg-[#F1F5F9] rounded animate-pulse" />
                  ))}
                </div>
              </div>
            ) : (
              <BillingAlerts />
            )}
          </div>

          {/* Exc nav cards */}
          {!isLoading && !showError && <ExciseNavCards />}
        </>
      )}
    </div>
  );
}