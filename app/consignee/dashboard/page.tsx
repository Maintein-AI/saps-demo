"use client";

import { useState, useEffect } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import ScopeBadge from "@/components/ScopeBadge";
import KPIStrip from "@/components/consignee/dashboard/KPIStrip";
import MainCardGrid from "@/components/consignee/dashboard/MainCardGrid";
import ShipmentSummary from "@/components/consignee/dashboard/ShipmentSummary";
import RecentNotices from "@/components/consignee/dashboard/RecentNotices";
import UpcomingPickups from "@/components/consignee/dashboard/UpcomingPickups";
import RecentShipments from "@/components/consignee/dashboard/RecentShipments";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";
import { useToast } from "@/components/ToastContext";
import {
  RefreshCw,
  ArrowRight,
  AlertTriangle,
  Package,
  Bell,
  CreditCard,
  Truck,
  FileText,
} from "lucide-react";

export default function ConsigneeDashboardPage() {
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

  const handleNav = (route: string) => {
    const labels: Record<string, string> = {
      shipments: "My Shipments",
      notices: "Notices",
      "pay-do": "Pay & Download DO",
      pickup: "Schedule Pickup",
      pod: "POD History",
    };
    addToast(`${labels[route] || route} opened.`, "success");
  };

  const handleViewShipment = (s: { awb: string }) => {
    addToast(`Shipment ${s.awb} details opened.`, "success");
  };

  const handlePayCharges = (s: { awb: string }) => {
    addToast(`Payment gateway opened for ${s.awb}.`, "success");
  };

  const handleDownloadDO = (s: { awb: string }) => {
    addToast(`DO downloaded for ${s.awb}.`, "success");
  };

  const handleSchedulePickup = (s?: { awb: string; doNo?: string }) => {
    if (s) {
      addToast(`Pickup scheduling opened for ${s.awb}.`, "success");
    } else {
      addToast("Pickup scheduling opened.", "success");
    }
  };

  const handleViewPOD = (s: { awb: string }) => {
    addToast(`POD downloaded for ${s.awb}.`, "success");
  };

  const handleViewNotice = (n: { awb: string; type: string }) => {
    addToast(`Notice detail for ${n.awb} (${n.type}) opened.`, "success");
  };

  const handleViewPickup = (p: { awb: string; doNo: string }) => {
    addToast(`Pickup detail for DO ${p.doNo} opened.`, "success");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <Breadcrumb
            items={[
              { label: "Consignee", href: "/consignee/dashboard" },
              { label: "Dashboard" },
            ]}
          />
          <div className="flex items-center gap-3 mt-3">
            <h1 className="text-[24px] font-bold text-[#0F172A]">
              Consignee Dashboard
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
          title="Failed to load Consignee dashboard"
          message="Could not retrieve your shipment data. Please try again."
          onRetry={handleRefresh}
        />
      )}

      {empty && !error && !loading && (
        <EmptyState
          title="No shipments linked to your account."
          description="No active shipments, notices, or pickups are linked to your consignee profile. Contact your CHA or SAPS support if you believe this is an error."
          icon={<Package size={28} className="text-[#94A3B8]" />}
          actionLabel="Refresh"
          onAction={handleRefresh}
        />
      )}

      {loading && !error && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-32 rounded-[16px] bg-[#F1F5F9] animate-pulse" />
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-48 rounded-[16px] bg-[#F1F5F9] animate-pulse" />
            ))}
          </div>
          <div className="h-56 rounded-[16px] bg-[#F1F5F9] animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-80 rounded-[16px] bg-[#F1F5F9] animate-pulse" />
            <div className="h-80 rounded-[16px] bg-[#F1F5F9] animate-pulse" />
          </div>
          <div className="h-96 rounded-[16px] bg-[#F1F5F9] animate-pulse" />
        </div>
      )}

      {!loading && !error && !empty && (
        <div className="space-y-6">
          <KPIStrip />

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleNav("shipments")}
              className="flex items-center gap-2 h-10 px-5 rounded-xl text-[13px] font-semibold text-white cursor-pointer hover:opacity-90 transition-colors"
              style={{ backgroundColor: "#0B2545" }}
            >
              <Package size={16} /> View My Shipments
            </button>
            <button
              onClick={() => handleNav("notices")}
              className="flex items-center gap-2 h-10 px-5 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F1F5F9] cursor-pointer transition-colors"
            >
              <Bell size={16} /> View Notices
            </button>
            <button
              onClick={() => handleNav("pay-do")}
              className="flex items-center gap-2 h-10 px-5 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F1F5F9] cursor-pointer transition-colors"
            >
              <CreditCard size={16} /> Pay & Download DO
            </button>
            <button
              onClick={() => handleSchedulePickup()}
              className="flex items-center gap-2 h-10 px-5 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F1F5F9] cursor-pointer transition-colors"
            >
              <Truck size={16} /> Schedule Pickup
            </button>
            <button
              onClick={() => handleNav("pod")}
              className="flex items-center gap-2 h-10 px-5 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F1F5F9] cursor-pointer transition-colors"
            >
              <FileText size={16} /> View POD History
            </button>
          </div>

          <MainCardGrid onNav={handleNav} />

          <ShipmentSummary />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentNotices onView={handleViewNotice} />
            <UpcomingPickups onView={handleViewPickup} onSchedulePickup={() => handleSchedulePickup()} />
          </div>

          <RecentShipments
            onViewShipment={handleViewShipment}
            onPayCharges={handlePayCharges}
            onDownloadDO={handleDownloadDO}
            onSchedulePickup={handleSchedulePickup}
            onViewPOD={handleViewPOD}
          />
        </div>
      )}
    </div>
  );
}