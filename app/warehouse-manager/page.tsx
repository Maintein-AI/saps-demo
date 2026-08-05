"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import KPICard from "@/components/KPICard";
import DataTable from "@/components/DataTable";
import RackHeatmap from "@/components/RackHeatmap";
import ExceptionChips from "@/components/ExceptionChips";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";
import StatusBadge from "@/components/StatusBadge";
// import { useToast } from "@/components/ToastContext"; // used only by the hidden Simulate controls
import { ArrowRight } from "lucide-react";

const columns = [
  { key: "awb", header: "AWB #", sortable: true },
  { key: "hawb", header: "HAWB #", sortable: true },
  { key: "status", header: "Status", sortable: true },
  { key: "pieces", header: "Pieces", sortable: true },
  { key: "weight", header: "Weight", sortable: true },
  { key: "origin", header: "Origin", sortable: true },
  { key: "zone", header: "Storage Zone", sortable: true },
  { key: "arrival", header: "Arrival", sortable: true },
];

// Live AWB Queue — re-pointed to the canonical AWB hub (/awb/{id}) instead of
// the generic AWB Register list (/warehouse-manager/awb-detail), and aligned to
// the real domain AWB set so every row opens a matching shipment that traces
// end-to-end. (Previous rows used ad-hoc AWB numbers not present in the domain.)
const awbLinkClass =
  "text-[13px] font-semibold text-[#1B4F8B] hover:text-[#0B2545] cursor-pointer transition-colors";

const rows = [
  {
    awb: <Link href="/awb/1" className={awbLinkClass}>214-45678901</Link>,
    hawb: "HBL-2091",
    status: <StatusBadge status="Stored" />,
    pieces: "24 pcs",
    weight: "1,240 kg",
    origin: "DXB",
    zone: "AFU-R2-L1",
    arrival: "09:35",
  },
  {
    awb: <Link href="/awb/2" className={awbLinkClass}>176-88213340</Link>,
    hawb: "HAWB-7781",
    status: <StatusBadge status="Delivered" />,
    pieces: "48 pcs",
    weight: "2,180 kg",
    origin: "DOH",
    zone: "GCR-R5-L2",
    arrival: "10:20",
  },
  {
    awb: <Link href="/awb/4" className={awbLinkClass}>157-33448821</Link>,
    hawb: "HAWB-4412",
    status: <StatusBadge status="DO Issued" />,
    pieces: "6 pcs",
    weight: "380 kg",
    origin: "AUH",
    zone: "ICG-PRZ",
    arrival: "11:05",
  },
  {
    awb: <Link href="/awb/6" className={awbLinkClass}>306-77120943</Link>,
    hawb: "HBL-5543",
    status: <StatusBadge status="Closed" />,
    pieces: "30 pcs",
    weight: "1,420 kg",
    origin: "LHR",
    zone: "GCR-R3-L1",
    arrival: "11:42",
  },
  {
    awb: <Link href="/awb/7" className={awbLinkClass}>020-55839014</Link>,
    hawb: "HAWB-9902",
    status: <StatusBadge status="Stored" />,
    pieces: "12 pcs",
    weight: "780 kg",
    origin: "FRA",
    zone: "DGR-R1-L1",
    arrival: "12:15",
  },
  {
    awb: <Link href="/awb/8" className={awbLinkClass}>176-44029183</Link>,
    hawb: "HBL-1123",
    status: <StatusBadge status="Gate Pass" />,
    pieces: "40 pcs",
    weight: "920 kg",
    origin: "DOH",
    zone: "PER-R1-L2",
    arrival: "12:48",
  },
  {
    awb: <Link href="/awb/10" className={awbLinkClass}>618-22910385</Link>,
    hawb: "HAWB-2234",
    status: <StatusBadge status="Notified (NOA)" />,
    pieces: "8 pcs",
    weight: "441 kg",
    origin: "DXB",
    zone: "AVI-R4-L2",
    arrival: "13:20",
  },
];

const rowActions = () => (
  <div className="flex flex-col py-1">
    <button className="text-left px-3 py-2 text-[12px] text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer">
      View Detail
    </button>
    <button className="text-left px-3 py-2 text-[12px] text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer">
      Assign Putaway
    </button>
    <button className="text-left px-3 py-2 text-[12px] text-[#DC2626] hover:bg-[#DC2626]/5 cursor-pointer">
      Flag Exception
    </button>
  </div>
);

export default function WarehouseManagerDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [showError, setShowError] = useState(false);
  const [showEmpty, setShowEmpty] = useState(false);
  // const { addToast } = useToast(); // used only by the hidden Simulate controls (below)

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
    <div className="flex flex-col gap-8">
      {/* Breadcrumb + Title */}
      <div className="flex flex-col gap-3">
        <Breadcrumb
          items={[
            { label: "Warehouse Manager", href: "/warehouse-manager" },
            { label: "Dashboard" },
          ]}
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-[24px] lg:text-[32px] font-bold text-[#0F172A] leading-[32px] lg:leading-[40px]">
              Warehouse Manager Dashboard
            </h1>
          </div>
          {/* HIDDEN (demo scaffolding) — "Simulate Error" / "Simulate Empty"
              toggles are dev/QA controls, not client-facing. Kept per no-delete
              policy; un-comment to restore (also re-enable the useToast import
              and the `addToast` line above).
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
          */}
        </div>
      </div>

      {/* KPI Strip */}
      {showError ? (
        <ErrorState
          title="Dashboard data unavailable"
          message="KPI feed could not be refreshed. Last successful sync: 10:45 AM."
          onRetry={handleRetry}
        />
      ) : isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm"
            >
              <div className="h-4 w-24 bg-[#F1F5F9] rounded animate-pulse mb-4" />
              <div className="h-8 w-16 bg-[#F1F5F9] rounded animate-pulse" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <KPICard
            title="AWBs awaiting putaway"
            value="42"
            subtitle="8% from yesterday"
            trend="down"
            trendValue="-8%"
          />
          <KPICard
            title="AWBs awaiting pick"
            value="18"
            subtitle="3 new today"
            trend="up"
            trendValue="+3"
          />
          <KPICard
            title="Exception count"
            value="7"
            subtitle="2 critical"
            trend="up"
            trendValue="+2"
          />
          <KPICard
            title="Rack utilisation"
            value="73%"
            subtitle="106 of 144 racks active"
          />
          <KPICard
            title="ULD pits status"
            value="12/16"
            subtitle="4 pits available"
          />
        </div>
      )}

      {/* Main Content - Two Column */}
      {showEmpty ? (
        <EmptyState
          title="No AWBs awaiting action"
          description="All current shipments have been processed. New arrivals will appear here."
          actionLabel="Refresh Queue"
          onAction={() => setShowEmpty(false)}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Live AWB Queue */}
          <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h2 className="text-[18px] font-semibold text-[#0F172A] leading-[28px]">
                  Live AWB Queue
                </h2>
              </div>
              <Link
                href="/warehouse-manager/awb-detail"
                className="flex items-center gap-1 text-[13px] font-semibold text-[#1B4F8B] hover:text-[#0B2545] cursor-pointer transition-colors"
              >
                View All <ArrowRight size={14} />
              </Link>
            </div>
            {isLoading ? (
              <LoadingSkeleton rows={5} columns={8} />
            ) : (
              <DataTable
                columns={columns}
                rows={rows}
                sortable
                rowActions={rowActions}
              />
            )}
          </div>

          {/* Rack Heatmap */}
          <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h2 className="text-[18px] font-semibold text-[#0F172A] leading-[28px]">
                  Rack Heatmap
                </h2>
              </div>
              <Link
                href="/warehouse-manager/storage-map"
                className="flex items-center gap-1 text-[13px] font-semibold text-[#1B4F8B] hover:text-[#0B2545] cursor-pointer transition-colors"
              >
                Storage Map <ArrowRight size={14} />
              </Link>
            </div>
            {isLoading ? (
              <div className="grid grid-cols-12 gap-x-2 gap-y-3">
                {Array.from({ length: 144 }).map((_, i) => (
                  <div key={i} className="flex flex-col items-center gap-0.5">
                    <div className="w-3 h-1.5 rounded-sm bg-[#F1F5F9] animate-pulse" />
                    <div className="w-3 h-1.5 rounded-sm bg-[#F1F5F9] animate-pulse" />
                    <div className="w-3 h-1.5 rounded-sm bg-[#F1F5F9] animate-pulse" />
                  </div>
                ))}
              </div>
            ) : (
              <RackHeatmap />
            )}
          </div>
        </div>
      )}

      {/* Exception Summary */}
      <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-[18px] font-semibold text-[#0F172A] leading-[28px]">
              Exception Summary
            </h2>
          </div>
          <Link
            href="/exceptions/queue"
            className="flex items-center gap-1 text-[13px] font-semibold text-[#1B4F8B] hover:text-[#0B2545] cursor-pointer transition-colors"
          >
            Queue <ArrowRight size={14} />
          </Link>
        </div>
        <ExceptionChips />
      </div>
    </div>
  );
}