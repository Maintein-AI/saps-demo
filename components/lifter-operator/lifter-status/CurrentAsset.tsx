"use client";

import { useState } from "react";
import {
  Battery,
  Zap,
  Clock,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Activity,
  ArrowUp,
  ArrowDown,
  Calendar,
  Hash,
  Truck,
  User,
  Wrench,
} from "lucide-react";

interface CurrentAssetProps {
  asset: {
    id: string;
    type: string;
    operator: string;
    status: string;
    battery: number;
    location: string;
    lastCharge: string;
    lastMovement: string;
    activeTasks: number;
    maintenanceWarning: string;
  };
}

export default function CurrentAsset({ asset }: CurrentAssetProps) {
  const [onCharge, setOnCharge] = useState(false);
  const [available, setAvailable] = useState(false);

  const statusColor =
    asset.status === "Available"
      ? "#16A34A"
      : asset.status === "On Charge"
      ? "#D97706"
      : asset.status === "In Use"
      ? "#1B4F8B"
      : "#DC2626";
  const statusBg =
    asset.status === "Available"
      ? "#DCFCE7"
      : asset.status === "On Charge"
      ? "#FEF3C7"
      : asset.status === "In Use"
      ? "#DBEAFE"
      : "#FEE2E2";

  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-white p-5">
      <div className="flex items-center gap-2 mb-5">
        <h2 className="text-[16px] font-bold text-[#0F172A]">Current Lifter Asset</h2>
      </div>

      <div className="flex items-center gap-4 mb-5">
        <div className="w-14 h-14 rounded-2xl bg-[#0B2545] flex items-center justify-center flex-shrink-0">
          <Truck size={28} className="text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-[20px] font-bold text-[#0F172A]">{asset.id}</p>
            <span
              className="inline-flex items-center gap-1 h-6 px-2.5 rounded-full text-[12px] font-bold"
              style={{ backgroundColor: statusBg, color: statusColor }}
            >
              <Activity size={12} />
              {asset.status}
            </span>
          </div>
          <p className="text-[14px] text-[#64748B] mt-0.5">{asset.type}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="flex items-center gap-2.5 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] p-3">
          <div className="w-9 h-9 rounded-lg bg-[#DBEAFE] flex items-center justify-center flex-shrink-0">
            <User size={16} className="text-[#1B4F8B]" />
          </div>
          <div>
            <p className="text-[11px] text-[#94A3B8] font-medium">Operator</p>
            <p className="text-[14px] font-bold text-[#0F172A]">{asset.operator}</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] p-3">
          <div className="w-9 h-9 rounded-lg bg-[#FEF3C7] flex items-center justify-center flex-shrink-0">
            <Battery size={16} className="text-[#D97706]" />
          </div>
          <div>
            <p className="text-[11px] text-[#94A3B8] font-medium">Battery</p>
            <p className="text-[14px] font-bold text-[#0F172A]">{asset.battery}%</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] p-3">
          <div className="w-9 h-9 rounded-lg bg-[#F1F5F9] flex items-center justify-center flex-shrink-0">
            <MapPin size={16} className="text-[#64748B]" />
          </div>
          <div>
            <p className="text-[11px] text-[#94A3B8] font-medium">Location</p>
            <p className="text-[14px] font-bold text-[#0F172A]">{asset.location}</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] p-3">
          <div className="w-9 h-9 rounded-lg bg-[#F1F5F9] flex items-center justify-center flex-shrink-0">
            <Hash size={16} className="text-[#64748B]" />
          </div>
          <div>
            <p className="text-[11px] text-[#94A3B8] font-medium">Active Tasks</p>
            <p className="text-[14px] font-bold text-[#0F172A]">{asset.activeTasks}</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] p-3">
          <div className="w-9 h-9 rounded-lg bg-[#F1F5F9] flex items-center justify-center flex-shrink-0">
            <Clock size={16} className="text-[#64748B]" />
          </div>
          <div>
            <p className="text-[11px] text-[#94A3B8] font-medium">Last Charge</p>
            <p className="text-[14px] font-bold text-[#0F172A]">{asset.lastCharge}</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] p-3">
          <div className="w-9 h-9 rounded-lg bg-[#F1F5F9] flex items-center justify-center flex-shrink-0">
            <Calendar size={16} className="text-[#64748B]" />
          </div>
          <div>
            <p className="text-[11px] text-[#94A3B8] font-medium">Last Movement</p>
            <p className="text-[14px] font-bold text-[#0F172A]">{asset.lastMovement}</p>
          </div>
        </div>
      </div>

      {asset.maintenanceWarning && (
        <div className="flex items-start gap-2 bg-[#FEF3C7]/40 rounded-xl border border-[#D97706]/20 p-3 mb-5">
          <AlertTriangle size={16} className="text-[#D97706] mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-[13px] font-bold text-[#D97706]">Maintenance Warning</p>
            <p className="text-[13px] text-[#64748B] mt-0.5">{asset.maintenanceWarning}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setOnCharge(!onCharge)}
          className="h-14 rounded-xl text-[15px] font-bold text-white cursor-pointer transition-colors hover:opacity-90 active:scale-[0.98] flex items-center justify-center gap-2"
          style={{ backgroundColor: onCharge ? "#D97706" : "#0B2545" }}
        >
          <Zap size={18} />
          {onCharge ? "On Charge" : "Mark On Charge"}
        </button>
        <button
          onClick={() => setAvailable(!available)}
          className="h-14 rounded-xl text-[15px] font-bold border border-[#16A34A]/30 text-[#16A34A] hover:bg-[#DCFCE7] cursor-pointer transition-colors active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <CheckCircle2 size={18} />
          {available ? "Available" : "Mark Available"}
        </button>
      </div>
    </div>
  );
}