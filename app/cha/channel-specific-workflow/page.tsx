"use client";

import { useState } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import ChannelCaseSummary from "@/components/cha/channel-specific-workflow/ChannelCaseSummary";
import ChannelTabs from "@/components/cha/channel-specific-workflow/ChannelTabs";
import YellowChannelPanel from "@/components/cha/channel-specific-workflow/YellowChannelPanel";
import RedChannelPanel from "@/components/cha/channel-specific-workflow/RedChannelPanel";
import ChannelWorkflowTimeline from "@/components/cha/channel-specific-workflow/ChannelWorkflowTimeline";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";
import { useToast } from "@/components/ToastContext";
import { AlertTriangle, Gavel, MessageSquare } from "lucide-react";

export default function ChannelSpecificWorkflowPage() {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<"yellow" | "red">("yellow");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<"Yellow" | "Red">("Yellow");

  const handleRetry = () => {
    setLoading(true);
    setError(false);
    setTimeout(() => setLoading(false), 1200);
  };

  const handleViewDetail = (item: unknown) => {
    addToast("Detail view opened for selected record.", "success");
  };

  const handleSelectCase = (caseItem: { channel: "Yellow" | "Red" }) => {
    setSelectedChannel(caseItem.channel);
    setActiveTab(caseItem.channel === "Yellow" ? "yellow" : "red");
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-1">
          <Breadcrumb items={[
            { label: "Home", href: "/" },
            { label: "CHA", href: "/cha" },
            { label: "Channel-Specific Workflow" },
          ]} />
        </div>
        <div className="flex items-center gap-2 mb-4">
          <h1 className="text-[22px] font-bold text-[#0F172A]">Channel-Specific Workflow</h1>
        </div>
        <LoadingSkeleton rows={5} columns={6} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LoadingSkeleton rows={4} columns={4} />
          <LoadingSkeleton rows={4} columns={4} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-1">
          <Breadcrumb items={[
            { label: "Home", href: "/" },
            { label: "CHA", href: "/cha" },
            { label: "Channel-Specific Workflow" },
          ]} />
        </div>
        <div className="flex items-center gap-2 mb-4">
          <h1 className="text-[22px] font-bold text-[#0F172A]">Channel-Specific Workflow</h1>
        </div>
        <ErrorState
          title="Failed to load channel workflow data"
          message="Could not retrieve channel-specific workflow records. Please check your connection and try again."
          onRetry={handleRetry}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-1">
        <Breadcrumb items={[
          { label: "Home", href: "/" },
          { label: "CHA", href: "/cha" },
          { label: "Channel-Specific Workflow" },
        ]} />
      </div>

      <div className="flex items-center gap-2 mb-2">
        <h1 className="text-[22px] font-bold text-[#0F172A]">Channel-Specific Workflow</h1>
      </div>

      <ChannelCaseSummary onSelectCase={handleSelectCase} />

      <div className="flex items-center gap-4">
        <ChannelTabs activeTab={activeTab} onChange={setActiveTab} />
        <span className="text-[12px] text-[#64748B]">
          {activeTab === "yellow" ? (
            <span className="inline-flex items-center gap-1">
              <MessageSquare size={12} className="text-[#D97706]" />
              Managing Yellow channel queries
            </span>
          ) : (
            <span className="inline-flex items-center gap-1">
              <Gavel size={12} className="text-[#DC2626]" />
              Managing Red channel exams
            </span>
          )}
        </span>
      </div>

      {activeTab === "yellow" ? (
        <YellowChannelPanel onViewDetail={handleViewDetail} />
      ) : (
        <RedChannelPanel onViewDetail={handleViewDetail} />
      )}

      <ChannelWorkflowTimeline channel={selectedChannel} />
    </div>
  );
}