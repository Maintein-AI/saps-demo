"use client";

import { useState, useEffect } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import ScopeBadge from "@/components/ScopeBadge";
import KPIStrip from "@/components/forwarding-agent/KPIStrip";
import NextPickups from "@/components/forwarding-agent/NextPickups";
import RecentNotifications from "@/components/forwarding-agent/RecentNotifications";
import AWBFilingStatus from "@/components/forwarding-agent/AWBFilingStatus";
import PaymentSummary from "@/components/forwarding-agent/PaymentSummary";
import MyAWBs from "@/components/forwarding-agent/MyAWBs";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";
import { useToast } from "@/components/ToastContext";
import { RefreshCw, ArrowRight, AlertTriangle, PackagePlus, FileUp, Truck, CreditCard, Bell, FileText } from "lucide-react";

export default function ForwardingAgentDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [empty, setEmpty] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setError(false);
    setEmpty(false);
    setTimeout(() => {
      setLoading(false);
      addToast("Dashboard refreshed.", "success");
    }, 1000);
  };

  const handleSimulateError = () => {
    setError(true);
    setLoading(false);
  };

  const handleSimulateEmpty = () => {
    setEmpty(true);
    setLoading(false);
  };

  const handleCreateAWB = () => {
    addToast("AWB entry created.", "success");
  };

  const handleUploadDocs = () => {
    addToast("Document upload started.", "success");
  };

  const handleSchedulePickup = () => {
    addToast("Pickup scheduling opened.", "success");
  };

  const handlePayInvoice = () => {
    addToast("Payment gateway opened.", "success");
  };

  const handleViewNotifications = () => {
    addToast("Notifications panel opened.", "success");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <Breadcrumb items={[
            { label: "Forwarding Agent", href: "/forwarding-agent" },
            { label: "Dashboard" }
          ]} />
          <div className="flex items-center gap-3 mt-3">
            <h1 className="text-[24px] font-bold text-[#0F172A]">Forwarding Agent Dashboard</h1>
            <ScopeBadge type="exc" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleRefresh} className="flex items-center gap-2 h-9 px-4 rounded-xl text-[13px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90" style={{ backgroundColor: "#0B2545" }}>
            <RefreshCw size={16} /> Refresh
          </button>
          <button onClick={handleSimulateError} className="flex items-center gap-2 h-9 px-4 rounded-xl text-[13px] font-semibold border border-[#DC2626]/30 text-[#DC2626] hover:bg-[#DC2626]/10 cursor-pointer transition-colors">
            <AlertTriangle size={16} /> Simulate Error
          </button>
          <button onClick={handleSimulateEmpty} className="flex items-center gap-2 h-9 px-4 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F1F5F9] cursor-pointer transition-colors">
            <ArrowRight size={16} /> Simulate Empty
          </button>
        </div>
      </div>

      {error && (
        <ErrorState title="Failed to load dashboard" message="Could not retrieve forwarding agent data. Please try again." onRetry={handleRefresh} />
      )}

      {empty && !error && !loading && (
        <EmptyState title="No active AWBs" description="No active AWBs for your forwarding agency." icon={<FileText size={28} className="text-[#94A3B8]" />} actionLabel="Refresh" onAction={handleRefresh} />
      )}

      {loading && !error && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-32 rounded-[16px] bg-[#F1F5F9] animate-pulse" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-96 rounded-[16px] bg-[#F1F5F9] animate-pulse" />
            <div className="h-96 rounded-[16px] bg-[#F1F5F9] animate-pulse" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-72 rounded-[16px] bg-[#F1F5F9] animate-pulse" />
            <div className="h-72 rounded-[16px] bg-[#F1F5F9] animate-pulse" />
          </div>
          <div className="h-72 rounded-[16px] bg-[#F1F5F9] animate-pulse" />
        </div>
      )}

      {!loading && !error && !empty && (
        <div className="space-y-6">
          <KPIStrip />

          <div className="flex flex-wrap items-center gap-3">
            <button onClick={handleCreateAWB} className="flex items-center gap-2 h-10 px-5 rounded-xl text-[13px] font-semibold text-white cursor-pointer hover:opacity-90 transition-colors" style={{ backgroundColor: "#0B2545" }}>
              <PackagePlus size={16} /> Create AWB Entry
            </button>
            <button onClick={handleUploadDocs} className="flex items-center gap-2 h-10 px-5 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F1F5F9] cursor-pointer transition-colors">
              <FileUp size={16} /> Upload Documents
            </button>
            <button onClick={handleSchedulePickup} className="flex items-center gap-2 h-10 px-5 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F1F5F9] cursor-pointer transition-colors">
              <Truck size={16} /> Schedule Pickup
            </button>
            <button onClick={handlePayInvoice} className="flex items-center gap-2 h-10 px-5 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F1F5F9] cursor-pointer transition-colors">
              <CreditCard size={16} /> Pay Invoice
            </button>
            <button onClick={handleViewNotifications} className="flex items-center gap-2 h-10 px-5 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F1F5F9] cursor-pointer transition-colors">
              <Bell size={16} /> View Notifications
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <NextPickups />
            <RecentNotifications />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AWBFilingStatus />
            <PaymentSummary />
          </div>

          <MyAWBs />
        </div>
      )}
    </div>
  );
}