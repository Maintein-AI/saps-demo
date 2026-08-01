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
import { useToast } from "@/components/ToastContext";
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

const rows = [
  {
    awb: <Link href="/warehouse-manager/awb-detail" className="text-[13px] font-semibold text-[#1B4F8B] hover:text-[#0B2545] cursor-pointer transition-colors">214-45678901</Link>,
    hawb: "HBL-2091",
    status: <StatusBadge status="Awaiting Putaway" />,
    pieces: "24 pcs",
    weight: "1,240 kg",
    origin: "DXB",
    zone: "AFU-R2-L1",
    arrival: "09:35",
  },
  {
    awb: <Link href="/warehouse-manager/awb-detail" className="text-[13px] font-semibold text-[#1B4F8B] hover:text-[#0B2545] cursor-pointer transition-colors">157-90811223</Link>,
    hawb: "HAWB-7781",
    status: <StatusBadge status="Stored" />,
    pieces: "8 pcs",
    weight: "420 kg",
    origin: "DOH",
    zone: "Cold-COL-01",
    arrival: "10:20",
  },
  {
    awb: <Link href="/warehouse-manager/awb-detail" className="text-[13px] font-semibold text-[#1B4F8B] hover:text-[#0B2545] cursor-pointer transition-colors">074-88219033</Link>,
    hawb: "HAWB-4412",
    status: <StatusBadge status="Customs Filed" />,
    pieces: "16 pcs",
    weight: "680 kg",
    origin: "IST",
    zone: "GCR-R5-L2",
    arrival: "11:05",
  },
  {
    awb: <Link href="/warehouse-manager/awb-detail" className="text-[13px] font-semibold text-[#1B4F8B] hover:text-[#0B2545] cursor-pointer transition-colors">331-11245678</Link>,
    hawb: "HBL-5543",
    status: <StatusBadge status="Awaiting Putaway" />,
    pieces: "32 pcs",
    weight: "2,100 kg",
    origin: "JED",
    zone: "AFU-R3-L2",
    arrival: "11:42",
  },
  {
    awb: <Link href="/warehouse-manager/awb-detail" className="text-[13px] font-semibold text-[#1B4F8B] hover:text-[#0B2545] cursor-pointer transition-colors">618-77654321</Link>,
    hawb: "HAWB-9902",
    status: <StatusBadge status="Stored" />,
    pieces: "12 pcs",
    weight: "890 kg",
    origin: "RUH",
    zone: "PER-R1-L1",
    arrival: "12:15",
  },
  {
    awb: <Link href="/warehouse-manager/awb-detail" className="text-[13px] font-semibold text-[#1B4F8B] hover:text-[#0B2545] cursor-pointer transition-colors">445-33445566</Link>,
    hawb: "HBL-1123",
    status: <StatusBadge status="Awaiting Putaway" />,
    pieces: "6 pcs",
    weight: "340 kg",
    origin: "KWI",
    zone: "GCR-R6-L3",
    arrival: "12:48",
  },
  {
    awb: <Link href="/warehouse-manager/awb-detail" className="text-[13px] font-semibold text-[#1B4F8B] hover:text-[#0B2545] cursor-pointer transition-colors">882-99887766</Link>,
    hawb: "HAWB-2234",
    status: <StatusBadge status="Customs Filed" />,
    pieces: "45 pcs",
    weight: "3,200 kg",
    origin: "AUH",
    zone: "VAL-R4-L2",
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
    <div className="flex flex-col gap-8">
      {/* Breadcrumb + Title */}
      <div className="flex flex-col gap-3">
        <Breadcrumb
          items={[
            { label: "Warehouse Manager", href: "#" },
            { label: "Dashboard" },
          ]}
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-[24px] lg:text-[32px] font-bold text-[#0F172A] leading-[32px] lg:leading-[40px]">
              Warehouse Manager Dashboard
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
                href="#"
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
                href="#"
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
            href="#"
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