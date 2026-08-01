"use client";

import { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";
import { useToast } from "@/components/ToastContext";
import InvoiceSourceCard from "@/components/finance-manager/invoice-generation/InvoiceSourceCard";
import CargoSummaryCard from "@/components/finance-manager/invoice-generation/CargoSummaryCard";
import LineItemsTable from "@/components/finance-manager/invoice-generation/LineItemsTable";
import BillingValidation from "@/components/finance-manager/invoice-generation/BillingValidation";
import RecentInvoices from "@/components/finance-manager/invoice-generation/RecentInvoices";

export interface CargoData {
  awb: string;
  hawb: string;
  pieces: number;
  actualWeight: number;
  volumetricWeight: number;
  chargeableWeight: number;
  arrivalDate: string;
  freePeriodExpiry: string;
  billingStatus: string;
  consignee: string;
  cha: string;
  forwardingAgent: string;
  cargoClass: string;
  storageDays: number;
  do?: string;
}

const sampleCargo: Record<string, CargoData> = {
  "214-45678901": {
    awb: "214-45678901",
    hawb: "HBL-2091",
    pieces: 24,
    actualWeight: 1240,
    volumetricWeight: 1350,
    chargeableWeight: 1350,
    arrivalDate: "25 May 2026",
    freePeriodExpiry: "29 May 2026",
    billingStatus: "Unbilled",
    consignee: "Al Noor Traders",
    cha: "Al-Huda Clearing",
    forwardingAgent: "Skyline Forwarders",
    cargoClass: "General Cargo",
    storageDays: 6,
    do: "DO-2026-00891",
  },
  "157-90811223": {
    awb: "157-90811223",
    hawb: "HAWB-7781",
    pieces: 8,
    actualWeight: 420,
    volumetricWeight: 380,
    chargeableWeight: 420,
    arrivalDate: "28 May 2026",
    freePeriodExpiry: "01 Jun 2026",
    billingStatus: "Unbilled",
    consignee: "Karachi Pharma Imports",
    cha: "Pak Gulf CHA",
    forwardingAgent: "MedEx Logistics",
    cargoClass: "Pharma",
    storageDays: 3,
    do: "DO-2026-00892",
  },
  "074-88219033": {
    awb: "074-88219033",
    hawb: "HAWB-4412",
    pieces: 16,
    actualWeight: 680,
    volumetricWeight: 720,
    chargeableWeight: 720,
    arrivalDate: "26 May 2026",
    freePeriodExpiry: "30 May 2026",
    billingStatus: "Unbilled",
    consignee: "Metro Engineering",
    cha: "Swift Clear Agency",
    forwardingAgent: "Global Freight PK",
    cargoClass: "DG",
    storageDays: 5,
    do: "DO-2026-00893",
  },
};

const sampleLineItems = [
  { lineType: "Storage", awbHawb: "214-45678901 / HBL-2091", pieces: 24, weightBasis: "Chargeable", rate: 12, days: 6, amount: 97200 },
  { lineType: "Surcharge", awbHawb: "214-45678901 / HBL-2091", pieces: 24, weightBasis: "Chargeable", rate: 3, days: 1, amount: 24300 },
  { lineType: "Demurrage", awbHawb: "214-45678901 / HBL-2091", pieces: 24, weightBasis: "Chargeable", rate: 18, days: 2, amount: 48600 },
  { lineType: "Adjustment", awbHawb: "214-45678901 / HBL-2091", pieces: 24, weightBasis: "Chargeable", rate: 0, days: 1, amount: -5000 },
];

const recentInvoices = [
  { id: "INV-2026-00491", awb: "999-11223344", consignee: "Sindh Textile Mills", amount: 145000, status: "Sent", generatedAt: "30 May 2026 14:30", generatedBy: "Sana Khan" },
  { id: "INV-2026-00492", awb: "111-55667788", consignee: "Habib Auto Parts", amount: 78000, status: "Paid", generatedAt: "30 May 2026 11:15", generatedBy: "Imran Ali" },
  { id: "INV-2026-00493", awb: "222-33445566", consignee: "Lahore Chemicals", amount: 245000, status: "Overdue", generatedAt: "29 May 2026 16:45", generatedBy: "Ahmed Khan" },
  { id: "INV-2026-00494", awb: "333-77889900", consignee: "Faisal Edibles", amount: 52000, status: "Sent", generatedAt: "29 May 2026 09:20", generatedBy: "Sana Khan" },
  { id: "INV-2026-00495", awb: "444-22334455", consignee: "K-Electric Spares", amount: 112000, status: "Draft", generatedAt: "28 May 2026 13:00", generatedBy: "Imran Ali" },
  { id: "INV-2026-00496", awb: "555-66778899", consignee: "Pakistan Oilfields", amount: 198000, status: "Paid", generatedAt: "28 May 2026 10:30", generatedBy: "Ahmed Khan" },
];

export default function InvoiceGenerationPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [showError, setShowError] = useState(false);
  const [showEmpty, setShowEmpty] = useState(false);
  const [mode, setMode] = useState("AWB");
  const [selectedAWB, setSelectedAWB] = useState("");
  const [selectedDO, setSelectedDO] = useState("");
  const [cargo, setCargo] = useState<CargoData | null>(null);
  const [lineItems, setLineItems] = useState(sampleLineItems);
  const [validationChecks, setValidationChecks] = useState({
    awbExists: false,
    doExists: false,
    tariffActive: false,
    weightAvailable: false,
    storageDays: false,
    noDuplicate: false,
    waiverChecked: false,
    taxApplied: false,
  });
  const { addToast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleAWBSelect = (awb: string) => {
    setSelectedAWB(awb);
    const data = sampleCargo[awb];
    if (data) {
      setCargo(data);
      setSelectedDO(data.do || "");
      setValidationChecks({
        awbExists: true,
        doExists: !!data.do,
        tariffActive: true,
        weightAvailable: true,
        storageDays: true,
        noDuplicate: true,
        waiverChecked: true,
        taxApplied: true,
      });
    } else {
      setCargo(null);
    }
  };

  const handleDOSelect = (doNum: string) => {
    setSelectedDO(doNum);
    const entry = Object.values(sampleCargo).find((c) => c.do === doNum);
    if (entry) {
      setCargo(entry);
      setSelectedAWB(entry.awb);
      setValidationChecks({
        awbExists: true,
        doExists: true,
        tariffActive: true,
        weightAvailable: true,
        storageDays: true,
        noDuplicate: true,
        waiverChecked: true,
        taxApplied: true,
      });
    } else {
      setCargo(null);
    }
  };

  const handleRetry = () => {
    setShowError(false);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleGenerate = () => {
    addToast("Invoice generated successfully", "success");
  };

  const handleSaveDraft = () => {
    addToast("Invoice draft saved", "success");
  };

  const handlePreviewPDF = () => {
    addToast("Invoice PDF preview opened", "success");
  };

  const handleEmail = () => {
    addToast("Invoice emailed to consignee and CHA", "success");
  };

  const handleClear = () => {
    setSelectedAWB("");
    setSelectedDO("");
    setCargo(null);
    setValidationChecks({
      awbExists: false,
      doExists: false,
      tariffActive: false,
      weightAvailable: false,
      storageDays: false,
      noDuplicate: false,
      waiverChecked: false,
      taxApplied: false,
    });
  };

  const subtotal = lineItems.reduce((s, item) => s + item.amount, 0);
  const gst = Math.round(subtotal * 0.18);
  const grandTotal = subtotal + gst;

  const passedChecks = Object.values(validationChecks).filter(Boolean).length;
  const totalChecks = Object.values(validationChecks).length;

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb + Title */}
      <div className="flex flex-col gap-3">
        <Breadcrumb
          items={[
            { label: "Finance Manager", href: "#" },
            { label: "Invoice Generation" },
          ]}
        />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h1 className="text-[24px] lg:text-[32px] font-bold text-[#0F172A] leading-[32px] lg:leading-[40px]">
              Invoice Generation
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

      {/* Error Banner */}
      {showError && (
        <ErrorState
          title="Billing engine unavailable"
          message="Tariff engine could not be reached. Last successful sync: 09:30 AM."
          onRetry={handleRetry}
        />
      )}

      {/* Main Content */}
      {showEmpty ? (
        <EmptyState
          title="Select AWB, DO, or batch to generate invoice"
          description="Search for a cargo record to begin invoice generation. All chargeable items will be computed automatically."
          actionLabel="Clear Selection"
          onAction={() => {
            setShowEmpty(false);
            handleClear();
          }}
        />
      ) : (
        <>
          {/* Invoice Source */}
          {isLoading ? (
            <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
              <div className="h-5 w-32 bg-[#F1F5F9] rounded animate-pulse mb-4" />
              <div className="h-10 w-full bg-[#F1F5F9] rounded animate-pulse mb-4" />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="h-10 bg-[#F1F5F9] rounded animate-pulse" />
                <div className="h-10 bg-[#F1F5F9] rounded animate-pulse" />
                <div className="h-10 bg-[#F1F5F9] rounded animate-pulse" />
              </div>
            </div>
          ) : (
            <InvoiceSourceCard
              mode={mode}
              onModeChange={setMode}
              selectedAWB={selectedAWB}
              selectedDO={selectedDO}
              onAWBSelect={handleAWBSelect}
              onDOSelect={handleDOSelect}
            />
          )}

          {/* Cargo selected state */}
          {cargo && !isLoading && !showError && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left: Cargo Summary + Line Items + Totals */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                <CargoSummaryCard cargo={cargo} />
                <LineItemsTable
                  items={lineItems}
                  subtotal={subtotal}
                  gst={gst}
                  grandTotal={grandTotal}
                  onGenerate={handleGenerate}
                  onSaveDraft={handleSaveDraft}
                  onPreviewPDF={handlePreviewPDF}
                  onEmail={handleEmail}
                  onClear={handleClear}
                />
              </div>

              {/* Right: Billing Validation */}
              <div>
                <BillingValidation
                  checks={validationChecks}
                  passed={passedChecks}
                  total={totalChecks}
                />
              </div>
            </div>
          )}

          {/* Recent Invoices */}
          {isLoading ? (
            <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
              <div className="h-5 w-32 bg-[#F1F5F9] rounded animate-pulse mb-4" />
              <LoadingSkeleton rows={4} columns={7} />
            </div>
          ) : (
            <RecentInvoices invoices={recentInvoices} />
          )}
        </>
      )}
    </div>
  );
}