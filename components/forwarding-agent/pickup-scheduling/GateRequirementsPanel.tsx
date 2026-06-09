"use client";

import { useState } from "react";
import {
  CheckCircle,
  XCircle,
  Check,
  FileCheck,
  DollarSign,
  UserCheck,
  Truck,
  ShieldCheck,
  Receipt,
} from "lucide-react";
import ScopeBadge from "@/components/ScopeBadge";

interface GateRequirementsPanelProps {
  pickupId?: string;
  awb?: string;
  do?: string;
}

interface CheckItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  checked: boolean;
}

export default function GateRequirementsPanel({ pickupId, awb, do: doNum }: GateRequirementsPanelProps) {
  const [items, setItems] = useState<CheckItem[]>([
    { id: "do", label: "DO issued", icon: <FileCheck size={14} />, checked: true },
    { id: "payment", label: "Payment cleared", icon: <DollarSign size={14} />, checked: true },
    { id: "driver", label: "Driver assigned", icon: <UserCheck size={14} />, checked: true },
    { id: "vehicle", label: "Vehicle assigned", icon: <Truck size={14} />, checked: true },
    { id: "authority", label: "Authority letter generated", icon: <ShieldCheck size={14} />, checked: false },
    { id: "prereg", label: "Gate pre-registration complete", icon: <Receipt size={14} />, checked: false },
  ]);

  const toggleItem = (id: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)));
  };

  const allChecked = items.every((item) => item.checked);
  const checkedCount = items.filter((item) => item.checked).length;

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <h3 className="text-[15px] font-bold text-[#0F172A]">Gate Requirements</h3>
          <ScopeBadge type="exc" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[12px] text-[#64748B]">{checkedCount}/{items.length} ready</span>
          {allChecked ? (
            <span className="inline-flex items-center gap-1 h-5 px-2 rounded-full text-[11px] font-semibold bg-[#DCFCE7] text-[#16A34A]">
              <CheckCircle size={12} />
              All Clear
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 h-5 px-2 rounded-full text-[11px] font-semibold bg-[#FEF3C7] text-[#D97706]">
              <XCircle size={12} />
              Pending
            </span>
          )}
        </div>
      </div>

      {pickupId && awb && (
        <div className="p-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] mb-4">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-[11px] text-[#64748B]">Pickup ID</p>
              <p className="text-[13px] font-semibold text-[#0F172A] font-mono">{pickupId}</p>
            </div>
            <div className="w-px h-8 bg-[#E2E8F0]" />
            <div>
              <p className="text-[11px] text-[#64748B]">AWB</p>
              <p className="text-[13px] font-semibold text-[#0F172A] font-mono">{awb}</p>
            </div>
            <div className="w-px h-8 bg-[#E2E8F0]" />
            <div>
              <p className="text-[11px] text-[#64748B]">DO</p>
              <p className="text-[13px] font-semibold text-[#0F172A] font-mono">{doNum}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => toggleItem(item.id)}
            className="flex items-center gap-3 h-10 px-3 rounded-xl border border-[#E2E8F0] cursor-pointer transition-colors hover:bg-[#F8FAFC]"
            style={{
              backgroundColor: item.checked ? "#F8FAFC" : "white",
              borderColor: item.checked ? "#16A34A" : "#E2E8F0",
            }}
          >
            <div
              className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
              style={{
                backgroundColor: item.checked ? "#16A34A" : "#F1F5F9",
                color: item.checked ? "white" : "#94A3B8",
              }}
            >
              {item.checked ? <Check size={12} /> : item.icon}
            </div>
            <span className={`text-[13px] font-medium ${item.checked ? "text-[#16A34A]" : "text-[#0F172A]"}`}>
              {item.label}
            </span>
            {item.checked && (
              <span className="ml-auto text-[11px] font-semibold text-[#16A34A]">Done</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}