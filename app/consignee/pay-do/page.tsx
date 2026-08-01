"use client";

import { useState, useEffect } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import KPIStrip from "@/components/consignee/pay-do/KPIStrip";
import PayDOContent from "@/components/consignee/pay-do/PayDOContent";
import ErrorState from "@/components/ErrorState";
import { useToast } from "@/components/ToastContext";
import { RefreshCw, ArrowRight, AlertTriangle, CreditCard } from "lucide-react";

export default function PayDOPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setError(false);
    setTimeout(() => {
      setLoading(false);
      addToast("Charges data refreshed.", "success");
    }, 1000);
  };

  const handleSimulateError = () => {
    setError(true);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <Breadcrumb
            items={[
              { label: "Consignee", href: "/consignee/dashboard" },
              { label: "Pay & Download DO" },
            ]}
          />
          <div className="flex items-center gap-3 mt-3">
            <h1 className="text-[24px] font-bold text-[#0F172A]">Pay & Download DO</h1>
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
        </div>
      </div>

      {error && (
        <ErrorState
          title="Failed to load charges"
          message="Could not retrieve payment data. Please try again."
          onRetry={handleRefresh}
        />
      )}

      {loading && !error && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-32 rounded-[16px] bg-[#F1F5F9] animate-pulse" />
            ))}
          </div>
          <div className="h-[200px] rounded-[16px] bg-[#F1F5F9] animate-pulse" />
          <div className="h-[400px] rounded-[16px] bg-[#F1F5F9] animate-pulse" />
          <div className="h-[200px] rounded-[16px] bg-[#F1F5F9] animate-pulse" />
        </div>
      )}

      {!loading && !error && (
        <>
          <KPIStrip />
          <PayDOContent />
        </>
      )}
    </div>
  );
}