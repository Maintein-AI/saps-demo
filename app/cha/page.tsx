"use client";

import { useState, useEffect } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import ScopeBadge from "@/components/ScopeBadge";
import KPIStrip from "@/components/cha/KPIStrip";
import CustomsWorkQueue from "@/components/cha/CustomsWorkQueue";
import DOsReadyTable from "@/components/cha/DOsReadyTable";
import ChannelSummary from "@/components/cha/ChannelSummary";
import PaymentSummary from "@/components/cha/PaymentSummary";
import RecentActivity from "@/components/cha/RecentActivity";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";
import { useToast } from "@/components/ToastContext";
import {
  RefreshCw,
  ArrowRight,
  AlertTriangle,
  FileText,
  Gavel,
  Truck,
  CreditCard,
  Shield,
  Bell,
} from "lucide-react";

export default function CHADashboardPage() {
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

  const handleFileGD = () => {
    addToast("GD filing workbench opened.", "success");
  };

  const handleTrackOOC = () => {
    addToast("OOC tracking opened.", "success");
  };

  const handleAssignDO = () => {
    addToast("DO collection assignment opened.", "success");
  };

  const handlePayInvoice = () => {
    addToast("Payment gateway opened.", "success");
  };

  const handleReexport = () => {
    addToast("Re-export case opened.", "success");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <Breadcrumb
            items={[
              { label: "CHA", href: "/cha" },
              { label: "Dashboard" },
            ]}
          />
          <div className="flex items-center gap-3 mt-3">
            <h1 className="text-[24px] font-bold text-[#0F172A]">
              CHA Dashboard
            </h1>
            <ScopeBadge type="exc" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 h-9 px-4 rounded-xl text-[13px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90"
            style={{ backgroundColor: "#0B2545" }}
          >
            <RefreshCw size={16} /> Refresh
          </button>
          <button
            onClick={handleSimulateError}
            className="flex items-center gap-2 h-9 px-4 rounded-xl text-[13px] font-semibold border border-[#DC2626]/30 text-[#DC2626] hover:bg-[#DC2626]/10 cursor-pointer transition-colors"
          >
            <AlertTriangle size={16} /> Simulate Error
          </button>
          <button
            onClick={handleSimulateEmpty}
            className="flex items-center gap-2 h-9 px-4 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F1F5F9] cursor-pointer transition-colors"
          >
            <ArrowRight size={16} /> Simulate Empty
          </button>
        </div>
      </div>

      {error && (
        <ErrorState
          title="Failed to load CHA dashboard"
          message="Could not retrieve customs data. Please try again."
          onRetry={handleRefresh}
        />
      )}

      {empty && !error && !loading && (
        <EmptyState
          title="No active customs work items"
          description="No active GDs, DOs, or payment items for your CHA account."
          icon={<FileText size={28} className="text-[#94A3B8]" />}
          actionLabel="Refresh"
          onAction={handleRefresh}
        />
      )}

      {loading && !error && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-32 rounded-[16px] bg-[#F1F5F9] animate-pulse"
              />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-96 rounded-[16px] bg-[#F1F5F9] animate-pulse" />
            <div className="h-96 rounded-[16px] bg-[#F1F5F9] animate-pulse" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-80 rounded-[16px] bg-[#F1F5F9] animate-pulse" />
            <div className="h-80 rounded-[16px] bg-[#F1F5F9] animate-pulse" />
          </div>
          <div className="h-72 rounded-[16px] bg-[#F1F5F9] animate-pulse" />
        </div>
      )}

      {!loading && !error && !empty && (
        <div className="space-y-6">
          <KPIStrip />

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleFileGD}
              className="flex items-center gap-2 h-10 px-5 rounded-xl text-[13px] font-semibold text-white cursor-pointer hover:opacity-90 transition-colors"
              style={{ backgroundColor: "#0B2545" }}
            >
              <FileText size={16} /> File GD
            </button>
            <button
              onClick={handleTrackOOC}
              className="flex items-center gap-2 h-10 px-5 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F1F5F9] cursor-pointer transition-colors"
            >
              <Gavel size={16} /> Track OOC
            </button>
            <button
              onClick={handleAssignDO}
              className="flex items-center gap-2 h-10 px-5 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F1F5F9] cursor-pointer transition-colors"
            >
              <Truck size={16} /> Assign DO Collection
            </button>
            <button
              onClick={handlePayInvoice}
              className="flex items-center gap-2 h-10 px-5 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F1F5F9] cursor-pointer transition-colors"
            >
              <CreditCard size={16} /> Pay Invoice
            </button>
            <button
              onClick={handleReexport}
              className="flex items-center gap-2 h-10 px-5 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F1F5F9] cursor-pointer transition-colors"
            >
              <Shield size={16} /> Open Re-export Case
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CustomsWorkQueue
              onViewDetail={(item) =>
                addToast(
                  `GD ${item.gd} details opened.`,
                  "success"
                )
              }
            />
            <DOsReadyTable
              onViewDetail={(item) =>
                addToast(
                  `DO ${item.doNo} details opened.`,
                  "success"
                )
              }
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChannelSummary
              onViewChannel={(channel) =>
                addToast(
                  `${channel} channel workflow opened.`,
                  "success"
                )
              }
            />
            <PaymentSummary onPayInvoice={handlePayInvoice} />
          </div>

          <RecentActivity />
        </div>
      )}
    </div>
  );
}