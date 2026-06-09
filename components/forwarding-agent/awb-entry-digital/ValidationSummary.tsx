import { AlertTriangle, CheckCircle, Circle } from "lucide-react";

interface ValidationSummaryProps {
  data: Record<string, any>;
  activeStep: string;
  validationErrors: Record<string, string[]>;
  touchedSteps: string[];
  onStepClick: (id: string) => void;
}

const stepDefinitions = [
  { id: "identification", label: "A. Identification", required: ["mawb", "consignee"] },
  { id: "flight-routing", label: "B. Flight & Routing", required: ["origin", "destination", "carrier", "flightNumber", "flightDate", "scheduledArrival"] },
  { id: "cargo-description", label: "C. Cargo Description", required: ["totalPieces", "totalWeight", "cargoClass", "handlingCode", "natureOfGoods", "pieceRows"] },
  { id: "document-uploads", label: "D. Document Uploads", required: ["mawbPdf", "hawbPdf", "commercialInvoice", "packingList"] },
  { id: "charges-payment", label: "E. Charges & Payment", required: ["payMethod"] },
];

export default function ValidationSummary({
  data,
  activeStep,
  validationErrors,
  touchedSteps,
  onStepClick,
}: ValidationSummaryProps) {
  const getStepStatus = (step: (typeof stepDefinitions)[0]) => {
    const hasRequired = step.required.every((field) => {
      if (field === "pieceRows") {
        const rows = data[field];
        return Array.isArray(rows) && rows.length > 0;
      }
      const val = data[field];
      if (Array.isArray(val)) return val.length > 0;
      if (typeof val === "string") return val.trim() !== "";
      if (typeof val === "number") return val > 0;
      return !!val;
    });

    const hasErrors = (validationErrors[step.id] || []).length > 0 && touchedSteps.includes(step.id);

    if (hasErrors) return "error";
    if (hasRequired) return "complete";
    return "incomplete";
  };

  const completedCount = stepDefinitions.filter((s) => getStepStatus(s) === "complete").length;
  const errorCount = stepDefinitions.filter((s) => getStepStatus(s) === "error").length;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <h3 className="text-[14px] font-bold text-[#0F172A]">Validation Summary</h3>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="text-center p-3 rounded-xl bg-[#F1F5F9]">
          <p className="text-[18px] font-bold text-[#0F172A]">{completedCount}</p>
          <p className="text-[11px] text-[#64748B] font-medium">Complete</p>
        </div>
        <div className="text-center p-3 rounded-xl bg-[#F1F5F9]">
          <p className="text-[18px] font-bold text-[#0F172A]">{errorCount}</p>
          <p className="text-[11px] text-[#64748B] font-medium">Errors</p>
        </div>
        <div className="text-center p-3 rounded-xl bg-[#F1F5F9]">
          <p className="text-[18px] font-bold text-[#0F172A]">{5 - completedCount}</p>
          <p className="text-[11px] text-[#64748B] font-medium">Remaining</p>
        </div>
      </div>

      <div className="space-y-1">
        {stepDefinitions.map((step) => {
          const status = getStepStatus(step);
          const isActive = step.id === activeStep;
          const errorList = validationErrors[step.id] || [];

          return (
            <button
              key={step.id}
              onClick={() => onStepClick(step.id)}
              className="w-full text-left rounded-lg px-3 py-2.5 transition-all cursor-pointer"
              style={{
                backgroundColor: isActive ? "#EBF0F7" : "transparent",
              }}
            >
              <div className="flex items-center gap-2.5">
                {status === "complete" ? (
                  <CheckCircle size={16} className="text-[#16A34A] flex-shrink-0" />
                ) : status === "error" ? (
                  <AlertTriangle size={16} className="text-[#DC2626] flex-shrink-0" />
                ) : (
                  <Circle size={16} className="text-[#94A3B8] flex-shrink-0" />
                )}
                <span
                  className="text-[13px] font-medium"
                  style={{
                    color: status === "error" ? "#DC2626" : isActive ? "#0B2545" : "#0F172A",
                  }}
                >
                  {step.label}
                </span>
              </div>
              {status === "error" && errorList.length > 0 && (
                <div className="ml-6.5 mt-1 space-y-0.5">
                  {errorList.slice(0, 3).map((err, i) => (
                    <p key={i} className="text-[11px] text-[#DC2626]">
                      {err}
                    </p>
                  ))}
                  {errorList.length > 3 && (
                    <p className="text-[11px] text-[#DC2626]">+{errorList.length - 3} more errors</p>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}