"use client";

import { useState, useEffect } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import ScopeBadge from "@/components/ScopeBadge";
import ErrorState from "@/components/ErrorState";
import { useToast } from "@/components/ToastContext";
import VehicleEntryForm from "@/components/gate-entry/vehicle-entry/VehicleEntryForm";
import VerificationPanel from "@/components/gate-entry/vehicle-entry/VerificationPanel";
import RecentVisits from "@/components/gate-entry/vehicle-entry/RecentVisits";

export default function VehicleEntryPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [showError, setShowError] = useState(false);
  const { addToast } = useToast();

  const [formData, setFormData] = useState<Record<string, string>>({});

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleRetry = () => {
    setShowError(false);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleFormAction = (data: Record<string, string>) => {
    setFormData(data);
    const status = data.status || "allow";
    if (status === "allow" || status === "draft") {
      addToast("Vehicle entry recorded", "success");
    } else if (status === "hold") {
      addToast("Vehicle held for verification", "success");
    } else if (status === "reject") {
      addToast("Vehicle entry rejected", "error");
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Breadcrumb + Title */}
      <div className="flex flex-col gap-3">
        <Breadcrumb
          items={[
            { label: "Gate Entry", href: "#" },
            { label: "Vehicle Entry" },
          ]}
        />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h1 className="text-[24px] lg:text-[32px] font-bold text-[#0F172A] leading-[32px] lg:leading-[40px]">
              Vehicle Entry
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
                setIsLoading(true);
                setTimeout(() => setIsLoading(false), 1000);
                addToast("Loading state simulated", "success");
              }}
              className="text-[12px] font-semibold text-[#1B4F8B] hover:text-[#0B2545] cursor-pointer transition-colors"
            >
              Simulate Loading
            </button>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {showError && (
        <ErrorState
          title="Entry form unavailable"
          message="Connection to the gate management system failed. Retry or use offline paper form."
          onRetry={handleRetry}
        />
      )}

      {/* Main Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Skeleton */}
          <div className="lg:col-span-2 rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
            <div className="h-5 w-48 bg-[#F1F5F9] rounded animate-pulse mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-12 rounded-xl bg-[#F1F5F9] animate-pulse" />
              ))}
              <div className="md:col-span-2 h-20 rounded-xl bg-[#F1F5F9] animate-pulse" />
              <div className="md:col-span-2 h-20 rounded-xl bg-[#F1F5F9] animate-pulse" />
              <div className="h-12 rounded-xl bg-[#F1F5F9] animate-pulse" />
              <div className="h-12 rounded-xl bg-[#F1F5F9] animate-pulse" />
            </div>
            <div className="mt-8 pt-6 border-t border-[#E2E8F0]">
              <div className="h-14 rounded-xl bg-[#F1F5F9] animate-pulse" />
            </div>
          </div>

          {/* Right Panel Skeleton */}
          <div className="space-y-6">
            <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
              <div className="h-5 w-40 bg-[#F1F5F9] rounded animate-pulse mb-6" />
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-16 rounded-xl bg-[#F1F5F9] animate-pulse mb-3" />
              ))}
            </div>
            <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
              <div className="h-5 w-32 bg-[#F1F5F9] rounded animate-pulse mb-6" />
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-14 rounded-xl bg-[#F1F5F9] animate-pulse mb-2" />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Form */}
          <div className="lg:col-span-2">
            <VehicleEntryForm onSubmit={handleFormAction} />
          </div>

          {/* Right: Verification + Recent Visits */}
          <div className="space-y-6">
            <VerificationPanel
              vehicleNumber={formData?.vehicleNumber || "KHI-4582"}
              driverCnic={formData?.driverCnic || "4210112345671"}
              driverName={formData?.driverName || "Ahmed Raza"}
              purpose={formData?.purpose || "Cargo pickup"}
              linkedDoc={formData?.linkedDoc || "DO-90871"}
            />
            <RecentVisits />
          </div>
        </div>
      )}
    </div>
  );
}