"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ToastContext";
import { usePathname } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";
import SummaryCard from "@/components/excise-compliance/channel-detail/SummaryCard";
import ChannelSwitcher from "@/components/excise-compliance/channel-detail/ChannelSwitcher";
import GreenPanel from "@/components/excise-compliance/channel-detail/GreenPanel";
import YellowPanel from "@/components/excise-compliance/channel-detail/YellowPanel";
import RedPanel from "@/components/excise-compliance/channel-detail/RedPanel";
import TimelineCard from "@/components/excise-compliance/channel-detail/TimelineCard";

interface SummaryData {
  awb: string;
  gd: string;
  channel: string;
  cha: string;
  consignee: string;
  filedAt: string;
  status: string;
  age: string;
  cargoClass: string;
  pieces: string;
  weight: string;
}

const sampleSummary: SummaryData = {
  awb: "214-45678901",
  gd: "GD-KHI-2026-00091",
  channel: "Yellow",
  cha: "Al-Huda Clearing",
  consignee: "Al Noor Traders",
  filedAt: "31 May 2026 10:20",
  status: "Under Review",
  age: "2h 15m",
  cargoClass: "General Cargo",
  pieces: "42",
  weight: "1,234.5 kg",
};

export default function ChannelDetailPage() {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState("yellow");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selected, setSelected] = useState(true);
  const [currentChannel, setCurrentChannel] = useState("Yellow");

  const summaryData = selected ? sampleSummary : null;

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleSimulateError = () => {
    setError(true);
    setTimeout(() => setError(false), 3000);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    const channelMap: Record<string, string> = {
      green: "Green",
      yellow: "Yellow",
      red: "Red",
    };
    setCurrentChannel(channelMap[tab]);
    addToast(`Switched to ${channelMap[tab]} Channel`, "success");
  };

  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto p-6 lg:p-8">
        <div className="mb-6">
          <div className="h-4 w-32 bg-[#F1F5F9] rounded animate-pulse mb-3" />
          <div className="h-8 w-64 bg-[#F1F5F9] rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 bg-[#F1F5F9] rounded-2xl animate-pulse" />
          ))}
        </div>
        <div className="h-64 bg-[#F1F5F9] rounded-2xl animate-pulse mb-6" />
        <div className="h-96 bg-[#F1F5F9] rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (!selected) {
    return (
      <div className="flex-1 overflow-y-auto p-6 lg:p-8">
        <div className="mb-6">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Excise & Compliance", href: "/excise-compliance" },
              { label: "Channel Detail" },
            ]}
          />
          <div className="flex items-center gap-2.5 mt-3">
            <h1 className="text-[24px] font-bold text-[#0F172A]">Channel Detail</h1>
          </div>
        </div>
        <EmptyState
          title="Select an AWB to view channel detail"
          description="Navigate to the Customs Queue and select an AWB to review its channel-specific workflow."
        />
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
            { label: "Channel Detail" },
          ]}
        />
        <div className="flex items-center gap-2.5 mt-3">
          <h1 className="text-[24px] font-bold text-[#0F172A]">Channel Detail</h1>
        </div>
      </div>

      {error && (
        <div className="mb-6">
          <ErrorState
            title="Failed to load channel data"
            message="Unable to fetch channel details from the customs system."
            onRetry={() => {
              setError(false);
              addToast("Retrying channel data load", "success");
            }}
          />
        </div>
      )}

      <div className="mb-6">
        <SummaryCard data={sampleSummary} />
      </div>

      <div className="mb-6">
        <ChannelSwitcher activeTab={activeTab} onChange={handleTabChange} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          {activeTab === "green" && <GreenPanel awb={sampleSummary.awb} />}
          {activeTab === "yellow" && <YellowPanel awb={sampleSummary.awb} />}
          {activeTab === "red" && <RedPanel awb={sampleSummary.awb} />}
        </div>
        <div className="lg:col-span-1">
          <TimelineCard status={sampleSummary.status} />
        </div>
      </div>

      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={handleSimulateError}
          className="h-9 px-4 rounded-lg text-[13px] font-semibold border border-[#DC2626]/30 text-[#DC2626] hover:bg-[#DC2626]/10 cursor-pointer transition-colors"
        >
          Simulate Error
        </button>
        <button
          onClick={() => addToast("Workflow updated successfully", "success")}
          className="h-9 px-4 rounded-lg text-[13px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90"
          style={{ backgroundColor: "#0B2545" }}
        >
          Simulate Success
        </button>
      </div>
    </div>
  );
}