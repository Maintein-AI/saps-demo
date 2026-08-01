"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ToastContext";
import Breadcrumb from "@/components/Breadcrumb";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";
import SearchCard from "@/components/excise-compliance/ooc-capture/SearchCard";
import OOCFormCard from "@/components/excise-compliance/ooc-capture/OOCFormCard";
import ValidationPanel from "@/components/excise-compliance/ooc-capture/ValidationPanel";
import RecentOOCTable from "@/components/excise-compliance/ooc-capture/RecentOOCTable";

interface AwbSummary {
  awb: string;
  gd: string;
  channel: string;
  cha: string;
  consignee: string;
  cargoClass: string;
  pieces: string;
  weight: string;
  status: string;
  holdStatus: string;
}

const sampleAWBs = [
  {
    awb: "214-45678901",
    gd: "GD-KHI-2026-00091",
    channel: "Yellow",
    cha: "Al-Huda Clearing",
    consignee: "Al Noor Traders",
    cargoClass: "General Cargo",
    pieces: "42",
    weight: "1,234.5 kg",
    status: "OOC Pending",
    holdStatus: "No active hold",
  },
  {
    awb: "157-90811223",
    gd: "GD-KHI-2026-00092",
    channel: "Green",
    cha: "Pak Gulf CHA",
    consignee: "Karachi Pharma Imports",
    cargoClass: "Pharmaceuticals",
    pieces: "24",
    weight: "856.2 kg",
    status: "OOC Pending",
    holdStatus: "No active hold",
  },
  {
    awb: "074-88219033",
    gd: "GD-KHI-2026-00093",
    channel: "Red",
    cha: "Swift Clear Agency",
    consignee: "Metro Engineering",
    cargoClass: "Machinery",
    pieces: "8",
    weight: "3,200.0 kg",
    status: "Examined",
    holdStatus: "Customs hold active",
  },
  {
    awb: "235-77890112",
    gd: "GD-KHI-2026-00094",
    channel: "Green",
    cha: "Al-Huda Clearing",
    consignee: "Sapphire Textiles",
    cargoClass: "Textiles",
    pieces: "156",
    weight: "2,450.0 kg",
    status: "OOC Pending",
    holdStatus: "No active hold",
  },
  {
    awb: "189-33445566",
    gd: "GD-KHI-2026-00095",
    channel: "Yellow",
    cha: "Pak Gulf CHA",
    consignee: "Universal Electronics",
    cargoClass: "Electronics",
    pieces: "35",
    weight: "1,120.0 kg",
    status: "OOC Pending",
    holdStatus: "ANF hold active",
  },
];

const recentOOCs = [
  {
    id: "1",
    oocRef: "OOC-KHI-2026-00421",
    awb: "312-99887766",
    gd: "GD-KHI-2026-00087",
    channel: "Green",
    consignee: "Golden Gate Traders",
    issuedAt: "31 May 2026 09:30",
    recordedBy: "Ayesha Khan",
    releaseStatus: "Released",
  },
  {
    id: "2",
    oocRef: "OOC-KHI-2026-00420",
    awb: "147-22113344",
    gd: "GD-KHI-2026-00086",
    channel: "Yellow",
    consignee: "Rashid & Sons",
    issuedAt: "31 May 2026 08:45",
    recordedBy: "Imran Ali",
    releaseStatus: "Released",
  },
  {
    id: "3",
    oocRef: "OOC-KHI-2026-00419",
    awb: "089-55443322",
    gd: "GD-KHI-2026-00085",
    channel: "Green",
    consignee: "Pakistan Chemicals",
    issuedAt: "30 May 2026 16:20",
    recordedBy: "Ayesha Khan",
    releaseStatus: "Released",
  },
  {
    id: "4",
    oocRef: "OOC-KHI-2026-00418",
    awb: "256-77889900",
    gd: "GD-KHI-2026-00084",
    channel: "Red",
    consignee: "Heavy Industries Ltd",
    issuedAt: "30 May 2026 14:10",
    recordedBy: "Tariq Ahmed",
    releaseStatus: "Pending Release",
  },
  {
    id: "5",
    oocRef: "OOC-KHI-2026-00417",
    awb: "198-11223344",
    gd: "GD-KHI-2026-00083",
    channel: "Green",
    consignee: "Fresh Foods Intl",
    issuedAt: "30 May 2026 11:00",
    recordedBy: "Imran Ali",
    releaseStatus: "Released",
  },
  {
    id: "6",
    oocRef: "OOC-KHI-2026-00416",
    awb: "275-66778899",
    gd: "GD-KHI-2026-00082",
    channel: "Yellow",
    consignee: "MediCare Pakistan",
    issuedAt: "30 May 2026 09:15",
    recordedBy: "Ayesha Khan",
    releaseStatus: "Released",
  },
];

export default function OOCCapturePage() {
  const { addToast } = useToast();
  const [selectedAWB, setSelectedAWB] = useState<AwbSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredAWBs = sampleAWBs.filter(
    (a) =>
      a.awb.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.gd.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.consignee.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleSelectAWB = (awb: AwbSummary) => {
    setSelectedAWB(awb);
    setSearchQuery(awb.awb);
    setShowDropdown(false);
    addToast(`AWB ${awb.awb} selected`, "success");
  };

  const handleSimulateError = () => {
    setError(true);
    setTimeout(() => setError(false), 3000);
  };

  const handleRecordOOC = () => {
    addToast("OOC recorded and cargo released", "success");
  };

  const handleSaveDraft = () => {
    addToast("OOC draft saved", "success");
  };

  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto p-6 lg:p-8">
        <div className="mb-6">
          <div className="h-4 w-32 bg-[#F1F5F9] rounded animate-pulse mb-3" />
          <div className="h-8 w-56 bg-[#F1F5F9] rounded animate-pulse" />
        </div>
        <div className="h-32 bg-[#F1F5F9] rounded-2xl animate-pulse mb-6" />
        <div className="h-96 bg-[#F1F5F9] rounded-2xl animate-pulse mb-6" />
        <div className="h-56 bg-[#F1F5F9] rounded-2xl animate-pulse mb-6" />
        <div className="h-64 bg-[#F1F5F9] rounded-2xl animate-pulse" />
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
            { label: "OOC Capture" },
          ]}
        />
        <div className="flex items-center gap-2.5 mt-3">
          <h1 className="text-[24px] font-bold text-[#0F172A]">OOC Capture</h1>
        </div>
      </div>

      {error && (
        <div className="mb-6">
          <ErrorState
            title="Failed to load OOC data"
            message="Unable to fetch OOC records from the customs system."
            onRetry={() => {
              setError(false);
              addToast("Retrying OOC data load", "success");
            }}
          />
        </div>
      )}

      <div className="mb-6">
        <SearchCard
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          showDropdown={showDropdown}
          setShowDropdown={setShowDropdown}
          filteredAWBs={filteredAWBs}
          onSelect={handleSelectAWB}
          selectedAWB={selectedAWB}
        />
      </div>

      {selectedAWB ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <OOCFormCard
              awb={selectedAWB}
              onRecordOOC={handleRecordOOC}
              onSaveDraft={handleSaveDraft}
            />
          </div>
          <div className="lg:col-span-1">
            <ValidationPanel awb={selectedAWB} />
          </div>
        </div>
      ) : (
        <div className="mb-6">
          <EmptyState
            title="Select an AWB to record OOC"
            description="Search for an AWB or GD number to begin recording the Out of Charge clearance."
          />
        </div>
      )}

      <div className="mb-6">
        <RecentOOCTable rows={recentOOCs} />
      </div>

      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={handleSimulateError}
          className="h-9 px-4 rounded-lg text-[13px] font-semibold border border-[#DC2626]/30 text-[#DC2626] hover:bg-[#DC2626]/10 cursor-pointer transition-colors"
        >
          Simulate Error
        </button>
        <button
          onClick={() => addToast("OOC data refreshed", "success")}
          className="h-9 px-4 rounded-lg text-[13px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90"
          style={{ backgroundColor: "#0B2545" }}
        >
          Simulate Success
        </button>
      </div>
    </div>
  );
}