"use client";

import { useState } from "react";
import { Snowflake, Thermometer, AlertTriangle } from "lucide-react";
import ScopeBadge from "@/components/ScopeBadge";
import Breadcrumb from "@/components/Breadcrumb";
import { useToast } from "@/components/ToastContext";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";
import KPIStrip from "@/components/cold-chain/KPIStrip";
import RegimeCards from "@/components/cold-chain/RegimeCards";
import TemperatureTrend from "@/components/cold-chain/TemperatureTrend";
import AwbTable from "@/components/cold-chain/AwbTable";
import AnomalyTable from "@/components/cold-chain/AnomalyTable";

export default function ColdChainConsolePage() {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [empty, setEmpty] = useState(false);
  const [selectedRegime, setSelectedRegime] = useState<string | null>(null);

  const handleAcknowledge = (id: string) => {
    addToast("Anomaly " + id + " acknowledged", "success");
  };

  const handleCreateCDR = (id: string) => {
    addToast("CDR created from anomaly " + id, "success");
  };

  const handleExportLog = () => {
    addToast("Temperature log exported", "success");
  };

  return (
    <div className="min-h-screen bg-white p-6 lg:p-8">
      <div className="mb-6">
        <Breadcrumb
          items={[
            { label: "Warehouse Manager", href: "/warehouse-manager" },
            { label: "Cold Chain Console" },
          ]}
        />
      </div>

      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-[24px] font-bold text-[#0F172A]">Cold Chain Console</h1>
        <ScopeBadge type="inc" />
      </div>

      <div className="mb-4">
        <KPIStrip loading={loading} />
      </div>

      <div className="mb-6">
        {error && (
          <div className="mb-4">
            <ErrorState
              message="Failed to load cold chain data. Sensor gateway may be unreachable. Please retry."
              onRetry={() => setError(false)}
            />
          </div>
        )}

        {empty && !error && (
          <div className="rounded-xl border border-[#E2E8F0] bg-white">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-[#E2E8F0]">
              <h2 className="text-[16px] font-bold text-[#0F172A]">Cold Chain Regimes</h2>
              <ScopeBadge type="inc" />
            </div>
            <EmptyState
              title="No cold-chain cargo currently stored"
              description="No temperature-controlled AWBs are in active storage. Cold chain cargo will appear here when received."
              icon={<Snowflake size={28} className="text-[#94A3B8]" />}
            />
          </div>
        )}

        {loading && !error && !empty && (
          <div className="rounded-xl border border-[#E2E8F0] bg-white">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-[#E2E8F0]">
              <h2 className="text-[16px] font-bold text-[#0F172A]">Cold Chain Regimes</h2>
              <ScopeBadge type="inc" />
            </div>
            <div className="p-5">
              <LoadingSkeleton rows={4} columns={6} />
            </div>
          </div>
        )}

        {!loading && !error && !empty && (
          <RegimeCards onSelectRegime={setSelectedRegime} selectedRegime={selectedRegime} />
        )}
      </div>

      {!empty && !error && (
        <div className="mb-6">
          <TemperatureTrend
            selectedRegime={selectedRegime}
            onExportLog={handleExportLog}
          />
        </div>
      )}

      {!empty && !error && (
        <div className="mb-6">
          <AwbTable />
        </div>
      )}

      {!empty && !error && (
        <div className="mb-6">
          <AnomalyTable
            onAcknowledge={handleAcknowledge}
            onCreateCDR={handleCreateCDR}
          />
        </div>
      )}

      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => setLoading((l) => !l)}
          className="h-8 px-3 rounded-lg border border-[#E2E8F0] text-[12px] font-medium text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer transition-colors"
        >
          {loading ? "Stop Loading" : "Simulate Loading"}
        </button>
        <button
          onClick={() => setError((e) => !e)}
          className="h-8 px-3 rounded-lg border border-[#E2E8F0] text-[12px] font-medium text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer transition-colors"
        >
          {error ? "Clear Error" : "Simulate Error"}
        </button>
        <button
          onClick={() => setEmpty((e) => !e)}
          className="h-8 px-3 rounded-lg border border-[#E2E8F0] text-[12px] font-medium text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer transition-colors"
        >
          {empty ? "Show Data" : "Simulate Empty"}
        </button>
      </div>
    </div>
  );
}