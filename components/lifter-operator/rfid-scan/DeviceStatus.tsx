"use client";

import { useState } from "react";
import { Smartphone, Battery, Wifi, Signal, Bluetooth, Clock, RefreshCw } from "lucide-react";
import ScopeBadge from "../../ScopeBadge";
import { useToast } from "../../ToastContext";

interface DeviceStatusProps {
  isError: boolean;
  setIsError: (v: boolean) => void;
}

export default function DeviceStatus({ isError, setIsError }: DeviceStatusProps) {
  const { addToast } = useToast();
  const [battery, setBattery] = useState(78);
  const [signalQuality, setSignalQuality] = useState(92);
  const [lastSync, setLastSync] = useState("11:47:22");
  const [readerStatus, setReaderStatus] = useState("Active");
  const [connectivity, setConnectivity] = useState("Wi-Fi + 4G");

  const handleRetry = () => {
    setIsError(false);
    setBattery(78);
    setSignalQuality(92);
    setLastSync("11:47:22");
    setReaderStatus("Active");
    setConnectivity("Wi-Fi + 4G");
    addToast("Handheld reconnected successfully", "success");
  };

  const handleSync = () => {
    setLastSync(new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    addToast("Device synced successfully", "success");
  };

  if (isError) {
    return (
      <div className="bg-white rounded-xl border border-[#DC2626]/30 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#DC2626]/20 bg-[#FEE2E2]/50">
          <div className="flex items-center gap-2.5">
            <h2 className="text-[16px] font-bold text-[#0F172A]">Device Status</h2>
            <ScopeBadge type="inc" />
          </div>
          <span className="text-[12px] font-bold text-[#DC2626]">DISCONNECTED</span>
        </div>
        <div className="p-5">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#DC2626]/10 flex items-center justify-center flex-shrink-0">
              <Smartphone size={20} className="text-[#DC2626]" />
            </div>
            <div>
              <h3 className="text-[14px] font-bold text-[#DC2626] mb-1">RFID Handheld Disconnected</h3>
              <p className="text-[13px] text-[#64748B]">Check Bluetooth pairing and device power</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] p-3">
              <p className="text-[11px] text-[#94A3B8] uppercase font-semibold tracking-wider">Device ID</p>
              <p className="text-[14px] font-semibold text-[#0F172A] mt-1">HH-RFID-04</p>
            </div>
            <div className="bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] p-3">
              <p className="text-[11px] text-[#94A3B8] uppercase font-semibold tracking-wider">Battery</p>
              <p className="text-[14px] font-semibold text-[#DC2626] mt-1">—</p>
            </div>
            <div className="bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] p-3">
              <p className="text-[11px] text-[#94A3B8] uppercase font-semibold tracking-wider">Reader Status</p>
              <p className="text-[14px] font-semibold text-[#DC2626] mt-1">Offline</p>
            </div>
            <div className="bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] p-3">
              <p className="text-[11px] text-[#94A3B8] uppercase font-semibold tracking-wider">Signal</p>
              <p className="text-[14px] font-semibold text-[#DC2626] mt-1">—</p>
            </div>
          </div>
          <button
            onClick={handleRetry}
            className="w-full h-12 rounded-xl text-[14px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90 whitespace-nowrap"
            style={{ backgroundColor: "#DC2626" }}
          >
            <span className="flex items-center justify-center gap-2">
              <RefreshCw size={16} />
              Retry Connection
            </span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2.5">
          <h2 className="text-[16px] font-bold text-[#0F172A]">Device Status</h2>
          <ScopeBadge type="inc" />
        </div>
        <span className="text-[12px] font-bold text-[#16A34A]">ONLINE</span>
      </div>
      <div className="p-5">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] p-3">
            <div className="flex items-center gap-2 mb-1">
              <Smartphone size={14} className="text-[#94A3B8]" />
              <p className="text-[11px] text-[#94A3B8] uppercase font-semibold tracking-wider">Device ID</p>
            </div>
            <p className="text-[14px] font-semibold text-[#0F172A]">HH-RFID-04</p>
          </div>
          <div className="bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] p-3">
            <div className="flex items-center gap-2 mb-1">
              <Battery size={14} className="text-[#94A3B8]" />
              <p className="text-[11px] text-[#94A3B8] uppercase font-semibold tracking-wider">Battery</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${battery}%`,
                    backgroundColor: battery > 50 ? "#16A34A" : battery > 20 ? "#D97706" : "#DC2626",
                  }}
                />
              </div>
              <span className="text-[13px] font-bold text-[#0F172A]">{battery}%</span>
            </div>
          </div>
          <div className="bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] p-3">
            <div className="flex items-center gap-2 mb-1">
              <Wifi size={14} className="text-[#94A3B8]" />
              <p className="text-[11px] text-[#94A3B8] uppercase font-semibold tracking-wider">Connectivity</p>
            </div>
            <p className="text-[14px] font-semibold text-[#0F172A]">{connectivity}</p>
          </div>
          <div className="bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] p-3">
            <div className="flex items-center gap-2 mb-1">
              <Clock size={14} className="text-[#94A3B8]" />
              <p className="text-[11px] text-[#94A3B8] uppercase font-semibold tracking-wider">Last Sync</p>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-[14px] font-semibold text-[#0F172A]">{lastSync}</p>
              <button
                onClick={handleSync}
                className="w-6 h-6 flex items-center justify-center rounded hover:bg-[#E2E8F0] text-[#64748B] cursor-pointer transition-colors"
              >
                <RefreshCw size={12} />
              </button>
            </div>
          </div>
          <div className="bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] p-3">
            <div className="flex items-center gap-2 mb-1">
              <Bluetooth size={14} className="text-[#94A3B8]" />
              <p className="text-[11px] text-[#94A3B8] uppercase font-semibold tracking-wider">Reader Status</p>
            </div>
            <p className="text-[14px] font-semibold text-[#16A34A]">{readerStatus}</p>
          </div>
          <div className="bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] p-3">
            <div className="flex items-center gap-2 mb-1">
              <Signal size={14} className="text-[#94A3B8]" />
              <p className="text-[11px] text-[#94A3B8] uppercase font-semibold tracking-wider">Signal Quality</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#16A34A] transition-all"
                  style={{ width: `${signalQuality}%` }}
                />
              </div>
              <span className="text-[13px] font-bold text-[#0F172A]">{signalQuality}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}