"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

interface RightDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
}

export default function RightDrawer({ isOpen, onClose, content }: RightDrawerProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300"
          onClick={onClose}
        />
      )}
      <div
        className="fixed top-0 right-0 h-full bg-white shadow-xl z-[70] transition-transform duration-300 ease-out flex flex-col"
        style={{
          width: "100%",
          maxWidth: 380,
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
        }}
      >
        <div className="flex items-center justify-between px-5 h-[64px] border-b border-[#E2E8F0] flex-shrink-0">
          <h2 className="text-[16px] font-bold text-[#0F172A]">
            {content === "detail" && "Record Details"}
            {content === "audit" && "Audit Timeline"}
            {content === "rack" && "Rack Detail"}
            {content === "match" && "Manual Match"}
            {content === "excluded" && "Advanced Excluded Modules"}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {content === "detail" && (
            <div className="flex flex-col gap-4">
              <div className="p-4 rounded-xl border border-[#E2E8F0]">
                <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider mb-3">
                  General Information
                </p>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-[13px] text-[#64748B]">AWB Number</span>
                    <span className="text-[13px] font-medium text-[#0F172A]">117-23456789</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[13px] text-[#64748B]">HAWB Number</span>
                    <span className="text-[13px] font-medium text-[#0F172A]">HAWB-001234</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[13px] text-[#64748B]">Origin</span>
                    <span className="text-[13px] font-medium text-[#0F172A]">DXB - Dubai</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[13px] text-[#64748B]">Destination</span>
                    <span className="text-[13px] font-medium text-[#0F172A]">KHI - Karachi</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[13px] text-[#64748B]">Pieces</span>
                    <span className="text-[13px] font-medium text-[#0F172A]">42</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[13px] text-[#64748B]">Weight</span>
                    <span className="text-[13px] font-medium text-[#0F172A]">1,234.5 kg</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {(content === "audit" || content === "rack" || content === "match" || content === "excluded") && (
            <div className="flex items-center justify-center h-40">
              <p className="text-[14px] text-[#64748B]">Content will be populated based on context</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}