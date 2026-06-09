"use client";

import { useState } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import ScopeBadge from "@/components/ScopeBadge";
import { useToast } from "@/components/ToastContext";
import ErrorState from "@/components/ErrorState";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import StepNavigation from "@/components/forwarding-agent/awb-entry-digital/StepNavigation";
import SectionA from "@/components/forwarding-agent/awb-entry-digital/SectionA";
import SectionB from "@/components/forwarding-agent/awb-entry-digital/SectionB";
import SectionC from "@/components/forwarding-agent/awb-entry-digital/SectionC";
import SectionD from "@/components/forwarding-agent/awb-entry-digital/SectionD";
import SectionE from "@/components/forwarding-agent/awb-entry-digital/SectionE";
import ValidationSummary from "@/components/forwarding-agent/awb-entry-digital/ValidationSummary";
import { Save, Send, FileCheck, RotateCcw } from "lucide-react";

const steps = [
  "identification",
  "flight-routing",
  "cargo-description",
  "document-uploads",
  "charges-payment",
];

const defaultData = {
  mawb: "157-90811223",
  hawbNumbers: ["HAWB-2026-001", "HAWB-2026-002"],
  consolId: "CONS-2026-8841",
  forwardingAgent: "Kuehne + Nagel Pakistan",
  cha: "Kuehne + Nagel CHA",
  consignee: "Pakistan Textile Mills Ltd",
  origin: "DXB",
  destination: "KHI",
  carrier: "Emirates SkyCargo",
  flightNumber: "EK602",
  flightDate: "2026-06-01",
  scheduledArrival: "2026-06-01T14:30",
  stops: 0,
  totalPieces: "2",
  totalWeight: "37.50",
  totalVolume: "0.288",
  cargoClass: "GCR",
  handlingCode: "GEN",
  natureOfGoods:
    "Garments and textile accessories for retail distribution. Packed in standard export cartons with moisture barrier lining.",
  specialHandling: [],
  pieceRows: [
    { id: 1, length: "60", width: "40", height: "30", weight: "12.5", pieces: "1" },
    { id: 2, length: "80", width: "60", height: "40", weight: "25.0", pieces: "1" },
  ],
  payMethod: "Credit account agent",
  gstNumber: "12-3456789-0",
  ntn: "1234567-8",
};

export default function AWBEntryDigitalPage() {
  const { addToast } = useToast();
  const [activeStep, setActiveStep] = useState("identification");
  const [data, setData] = useState<Record<string, any>>(defaultData);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
  const [touchedSteps, setTouchedSteps] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field: string, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const validateStep = (stepId: string, formData: Record<string, any>): string[] => {
    const errors: string[] = [];

    switch (stepId) {
      case "identification":
        if (!formData.mawb || !/^\d{3}-?\d{8}$/.test((formData.mawb || "").replace(/-/g, ""))) {
          errors.push("mawb");
        }
        if (!formData.consignee) {
          errors.push("consignee");
        }
        break;
      case "flight-routing":
        if (!formData.origin) errors.push("origin");
        if (!formData.destination) errors.push("destination");
        if (!formData.carrier) errors.push("carrier");
        if (!formData.flightNumber) errors.push("flightNumber");
        if (!formData.flightDate) errors.push("flightDate");
        if (!formData.scheduledArrival) errors.push("scheduledArrival");
        break;
      case "cargo-description":
        if (!formData.totalPieces || parseInt(formData.totalPieces) < 1) errors.push("totalPieces");
        if (!formData.totalWeight || parseFloat(formData.totalWeight) <= 0) errors.push("totalWeight");
        if (!formData.cargoClass) errors.push("cargoClass");
        if (!formData.handlingCode) errors.push("handlingCode");
        if (!formData.natureOfGoods || (formData.natureOfGoods || "").trim().length === 0) errors.push("natureOfGoods");
        if (!formData.pieceRows || formData.pieceRows.length === 0) errors.push("pieceMatrix");
        break;
      case "document-uploads": {
        const mawbFiles = formData.mawbPdf || [];
        const hawbFiles = formData.hawbPdf || [];
        const invFiles = formData.commercialInvoice || [];
        const plFiles = formData.packingList || [];
        if (!mawbFiles.length) errors.push("mawbPdf");
        if (!hawbFiles.length) errors.push("hawbPdf");
        if (!invFiles.length) errors.push("commercialInvoice");
        if (!plFiles.length) errors.push("packingList");
        if (errors.length > 0) errors.push("documents");
        break;
      }
      case "charges-payment":
        if (!formData.payMethod) errors.push("payMethod");
        break;
    }

    return errors;
  };

  const handleStepChange = (stepId: string) => {
    if (!touchedSteps.includes(activeStep)) {
      setTouchedSteps((prev) => [...prev, activeStep]);
    }
    const errs = validateStep(activeStep, data);
    setValidationErrors((prev) => ({ ...prev, [activeStep]: errs }));
    setActiveStep(stepId);
  };

  const handleSaveDraft = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      addToast("Draft saved successfully.", "success");
    }, 800);
  };

  const handleSubmit = () => {
    const allTouched = [...steps];
    setTouchedSteps(allTouched);

    const allErrors: Record<string, string[]> = {};
    steps.forEach((s) => {
      const errs = validateStep(s, data);
      if (errs.length > 0) allErrors[s] = errs;
    });
    setValidationErrors(allErrors);

    const totalErrors = Object.values(allErrors).reduce((sum, arr) => sum + arr.length, 0);
    if (totalErrors > 0) {
      const firstErrorStep = steps.find((s) => (allErrors[s] || []).length > 0);
      if (firstErrorStep) {
        setActiveStep(firstErrorStep);
      }
      addToast("Please fix validation errors before submitting.", "error");
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      addToast("AWB submitted to SAPS.", "success");
    }, 1500);
  };

  const handleValidateDocuments = () => {
    setTouchedSteps((prev) => [...prev, "document-uploads"]);
    const errs = validateStep("document-uploads", data);
    setValidationErrors((prev) => ({ ...prev, ["document-uploads"]: errs }));
    if (errs.length === 0) {
      addToast("All required documents validated.", "success");
    } else {
      addToast("Missing required documents.", "error");
    }
  };

  const handleReset = () => {
    setData(defaultData);
    setValidationErrors({});
    setTouchedSteps([]);
    setActiveStep("identification");
    addToast("Form reset to default values.", "success");
  };

  const getStepErrors = () => validationErrors[activeStep] || [];

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton rows={8} columns={3} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Breadcrumb
          items={[
            { label: "Home" },
            { label: "Forwarding Agent" },
            { label: "AWB Entry — Digital" },
          ]}
        />
        <div className="flex items-center gap-2.5">
          <h1 className="text-[22px] font-bold text-[#0F172A]">AWB Entry — Digital</h1>
          <ScopeBadge type="exc" />
        </div>
      </div>

      {error && (
        <ErrorState
          title="Failed to load form"
          message={error}
          onRetry={() => {
            setError(null);
            setLoading(true);
            setTimeout(() => setLoading(false), 500);
          }}
        />
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-3 sticky top-4">
            <StepNavigation
              activeStep={activeStep}
              onChange={handleStepChange}
              validationErrors={validationErrors}
              touchedSteps={touchedSteps}
            />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 md:p-6">
            {activeStep === "identification" && (
              <SectionA data={data} onChange={handleChange} errors={getStepErrors()} />
            )}
            {activeStep === "flight-routing" && (
              <SectionB data={data} onChange={handleChange} errors={getStepErrors()} />
            )}
            {activeStep === "cargo-description" && (
              <SectionC data={data} onChange={handleChange} errors={getStepErrors()} />
            )}
            {activeStep === "document-uploads" && (
              <SectionD data={data} onChange={handleChange} errors={getStepErrors()} />
            )}
            {activeStep === "charges-payment" && (
              <SectionE data={data} onChange={handleChange} errors={getStepErrors()} />
            )}

            <div className="flex flex-wrap items-center gap-3 mt-8 pt-6 border-t border-[#E2E8F0]">
              <button
                onClick={handleSaveDraft}
                disabled={submitting}
                className="flex items-center gap-2 h-10 px-4 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer transition-colors disabled:opacity-50 whitespace-nowrap"
              >
                <Save size={16} />
                Save Draft
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center gap-2 h-10 px-4 rounded-xl text-[13px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90 disabled:opacity-50 whitespace-nowrap"
                style={{ backgroundColor: "#0B2545" }}
              >
                <Send size={16} />
                {submitting ? "Submitting..." : "Submit to SAPS"}
              </button>
              <button
                onClick={handleValidateDocuments}
                className="flex items-center gap-2 h-10 px-4 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] hover:border-[#CBD5E1] cursor-pointer transition-colors whitespace-nowrap"
              >
                <FileCheck size={16} />
                Validate Documents
              </button>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 h-10 px-4 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:text-[#DC2626] hover:border-[#FCA5A5] cursor-pointer transition-colors whitespace-nowrap"
              >
                <RotateCcw size={16} />
                Cancel
              </button>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-72 flex-shrink-0">
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 sticky top-4">
            <ValidationSummary
              data={data}
              activeStep={activeStep}
              validationErrors={validationErrors}
              touchedSteps={touchedSteps}
              onStepClick={handleStepChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}