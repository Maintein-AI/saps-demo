"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import ScopeBadge from "@/components/ScopeBadge";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";
import { useToast } from "@/components/ToastContext";
import LifecycleBar from "@/components/awb-detail/LifecycleBar";
import AwbSummaryCard from "@/components/awb-detail/AwbSummaryCard";
import OverviewTab from "@/components/awb-detail/OverviewTab";
import PiecesTab from "@/components/awb-detail/PiecesTab";
import StorageTab from "@/components/awb-detail/StorageTab";
import ChargesTab from "@/components/awb-detail/ChargesTab";
import CustomsTab from "@/components/awb-detail/CustomsTab";
import MessagingTab from "@/components/awb-detail/MessagingTab";
import AuditTab from "@/components/awb-detail/AuditTab";

const tabs = [
  "Overview",
  "Pieces",
  "Storage",
  "Charges",
  "Customs",
  "Messaging",
  "Audit",
];

const lifecycleSteps = [
  "Awaited",
  "Received",
  "Pouch Opened",
  "Manifest Reconciled",
  "Indexed",
  "Tagged (RFID)",
  "Segregated",
  "Accepted",
  "Weighed & Inspected",
  "Storage Allocated",
  "Stored",
  "Customs Filed",
  "Customs Channel Assigned",
  "Cleared (OOC)",
  "Charges Invoiced",
  "Paid",
  "DO Issued",
  "Gate Pass Issued",
  "Picked",
  "POD Captured",
  "Dispatched",
  "DLV Sent",
  "Closed",
];

const currentState = "Stored";

export default function AwbDetailPage() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [isLoading, setIsLoading] = useState(true);
  const [showError, setShowError] = useState(false);
  const [showEmpty, setShowEmpty] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleRetry = () => {
    setShowError(false);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 800);
  };

  const renderTabContent = () => {
    if (showEmpty) {
      return (
        <EmptyState
          title="No data in this tab"
          description="This tab contains no records for the selected AWB."
          actionLabel="Refresh"
          onAction={() => setShowEmpty(false)}
        />
      );
    }
    if (isLoading) {
      return <LoadingSkeleton rows={6} columns={4} />;
    }
    switch (activeTab) {
      case "Overview":
        return <OverviewTab />;
      case "Pieces":
        return <PiecesTab />;
      case "Storage":
        return <StorageTab />;
      case "Charges":
        return <ChargesTab />;
      case "Customs":
        return <CustomsTab />;
      case "Messaging":
        return <MessagingTab />;
      case "Audit":
        return <AuditTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb + Title */}
      <div className="flex flex-col gap-3">
        <Breadcrumb
          items={[
            { label: "Warehouse Manager", href: "/warehouse-manager" },
            { label: "AWB Detail" },
          ]}
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/warehouse-manager"
              className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#E2E8F0] text-[#64748B] cursor-pointer transition-colors"
            >
              <ArrowLeft size={18} />
            </Link>
            <h1 className="text-[24px] lg:text-[32px] font-bold text-[#0F172A] leading-[32px] lg:leading-[40px]">
              AWB Detail
            </h1>
            <ScopeBadge type="inc" />
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

      {/* Top Summary Card */}
      {showError ? (
        <ErrorState
          title="AWB detail unavailable"
          message="Failed to load AWB 214-45678901. The record may have been moved or deleted."
          onRetry={handleRetry}
        />
      ) : isLoading ? (
        <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="h-3 w-20 bg-[#F1F5F9] rounded animate-pulse" />
                <div className="h-5 w-16 bg-[#F1F5F9] rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <AwbSummaryCard />
      )}

      {/* Lifecycle Bar */}
      {!showError && (
        <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-[16px] font-semibold text-[#0F172A]">
              AWB Lifecycle
            </h2>
            <ScopeBadge type="inc" />
          </div>
          {isLoading ? (
            <div className="h-16 bg-[#F1F5F9] rounded animate-pulse" />
          ) : (
            <LifecycleBar steps={lifecycleSteps} current={currentState} />
          )}
        </div>
      )}

      {/* Tabs */}
      {!showError && (
        <div className="flex flex-col gap-0">
          <div className="flex items-center gap-0 border-b border-[#E2E8F0] overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setShowEmpty(false);
                }}
                className="relative h-10 px-4 text-[13px] font-medium whitespace-nowrap cursor-pointer transition-colors"
                style={{
                  color: activeTab === tab ? "#0B2545" : "#64748B",
                  borderBottom: activeTab === tab ? "2px solid #0B2545" : "2px solid transparent",
                  marginBottom: -1,
                }}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="rounded-b-[16px] border border-t-0 border-[#E2E8F0] bg-white p-6 shadow-sm">
            {renderTabContent()}
          </div>
        </div>
      )}
    </div>
  );
}