import { Check, X, AlertCircle } from "lucide-react";
import ScopeBadge from "@/components/ScopeBadge";

interface ValidationItem {
  id: string;
  label: string;
  status: "pass" | "fail" | "pending";
}

const INITIAL_VALIDATIONS: ValidationItem[] = [
  { id: "awb", label: "AWB exists", status: "pass" },
  { id: "do", label: "DO exists", status: "pass" },
  { id: "cnic", label: "Driver CNIC matches", status: "pass" },
  { id: "vehicle", label: "Vehicle number matches", status: "fail" },
  { id: "expiry", label: "Authority letter not expired", status: "pass" },
  { id: "agent", label: "Forwarding Agent is recognized", status: "pass" },
  { id: "consignee", label: "Consignee matches record", status: "pending" },
];

interface ValidationPanelProps {
  visible: boolean;
}

export default function ValidationPanel({ visible }: ValidationPanelProps) {
  if (!visible) return null;

  const passCount = INITIAL_VALIDATIONS.filter((v) => v.status === "pass").length;
  const failCount = INITIAL_VALIDATIONS.filter((v) => v.status === "fail").length;
  const pendingCount = INITIAL_VALIDATIONS.filter((v) => v.status === "pending").length;

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-[14px] font-bold text-[#0F172A]">Validation Results</h3>
          <ScopeBadge type="exc" />
        </div>
        <div className="flex items-center gap-2">
          <span className="h-5 px-2 rounded-full text-[10px] font-bold bg-[#DCFCE7] text-[#16A34A]">
            {passCount} PASS
          </span>
          <span className="h-5 px-2 rounded-full text-[10px] font-bold bg-[#FEE2E2] text-[#DC2626]">
            {failCount} FAIL
          </span>
          {pendingCount > 0 && (
            <span className="h-5 px-2 rounded-full text-[10px] font-bold bg-[#FEF3C7] text-[#D97706]">
              {pendingCount} PENDING
            </span>
          )}
        </div>
      </div>

      <div className="space-y-2">
        {INITIAL_VALIDATIONS.map((item) => {
          const config = {
            pass: {
              bg: "#DCFCE7",
              text: "#16A34A",
              icon: <Check size={14} />,
              label: "PASS",
            },
            fail: {
              bg: "#FEE2E2",
              text: "#DC2626",
              icon: <X size={14} />,
              label: "FAIL",
            },
            pending: {
              bg: "#FEF3C7",
              text: "#D97706",
              icon: <AlertCircle size={14} />,
              label: "PENDING",
            },
          }[item.status];

          return (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 rounded-xl"
              style={{ backgroundColor: config.bg }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: config.text + "20" }}
                >
                  <span style={{ color: config.text }}>{config.icon}</span>
                </div>
                <span className="text-[13px] font-medium text-[#0F172A]">{item.label}</span>
              </div>
              <span
                className="h-5 px-2 rounded-full text-[10px] font-bold"
                style={{ backgroundColor: config.text + "20", color: config.text }}
              >
                {config.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}