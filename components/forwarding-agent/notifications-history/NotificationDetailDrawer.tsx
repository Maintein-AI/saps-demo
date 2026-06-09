"use client";

import { useEffect, useState } from "react";
import { X, Bell, Hash, AlertTriangle, Clock, Check, Calendar, MessageSquare, User, FileText } from "lucide-react";
import ScopeBadge from "@/components/ScopeBadge";
import { useToast } from "@/components/ToastContext";

interface Notification {
  id: string;
  type: string;
  awb: string;
  message: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  time: string;
  status: "Unread" | "Read" | "Action Required" | "Resolved";
  readAt?: string;
  relatedEntity?: string;
  createdAt?: string;
}

interface NotificationDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notification?: Notification;
}

const priorityConfig: Record<string, { bg: string; text: string }> = {
  Low: { bg: "#F1F5F9", text: "#64748B" },
  Medium: { bg: "#FEF3C7", text: "#D97706" },
  High: { bg: "#FEE2E2", text: "#DC2626" },
  Critical: { bg: "#DC2626", text: "#FFFFFF" },
};

const statusConfig: Record<string, { bg: string; text: string }> = {
  Unread: { bg: "#EBF0F7", text: "#1B4F8B" },
  Read: { bg: "#F1F5F9", text: "#64748B" },
  "Action Required": { bg: "#FEE2E2", text: "#DC2626" },
  Resolved: { bg: "#DCFCE7", text: "#16A34A" },
};

export default function NotificationDetailDrawer({ isOpen, onClose, notification }: NotificationDetailDrawerProps) {
  const [resolutionNotes, setResolutionNotes] = useState("");
  const { addToast } = useToast();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setResolutionNotes("");
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!notification) return null;

  const pc = priorityConfig[notification.priority];
  const sc = statusConfig[notification.status];

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
          maxWidth: 420,
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
        }}
      >
        <div className="flex items-center justify-between px-5 h-[64px] border-b border-[#E2E8F0] flex-shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="text-[16px] font-bold text-[#0F172A]">Notification Detail</h2>
            <ScopeBadge type="exc" />
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <div className="flex flex-col gap-4">
            <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: pc.bg, color: pc.text }}
                >
                  <Bell size={20} />
                </div>
                <div>
                  <p className="text-[14px] font-bold text-[#0F172A]">{notification.type}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-flex items-center gap-1 h-5 px-2 rounded-full text-[11px] font-semibold" style={{ backgroundColor: pc.bg, color: pc.text }}>
                      <AlertTriangle size={10} />
                      {notification.priority}
                    </span>
                    <span className="inline-flex items-center gap-1 h-5 px-2 rounded-full text-[11px] font-semibold" style={{ backgroundColor: sc.bg, color: sc.text }}>
                      {notification.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[12px] font-semibold text-[#64748B]">Notification Type</span>
                <span className="text-[13px] font-medium text-[#0F172A]">{notification.type}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[12px] font-semibold text-[#64748B]">AWB #</span>
                <span className="text-[13px] font-mono text-[#1B4F8B]">{notification.awb}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[12px] font-semibold text-[#64748B]">Related Entity</span>
                <span className="text-[13px] font-medium text-[#0F172A]">{notification.relatedEntity || notification.type}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[12px] font-semibold text-[#64748B]">Created At</span>
                <span className="text-[13px] text-[#64748B]">01 Jun 2026, 10:00</span>
              </div>
              {notification.readAt && (
                <div className="flex justify-between items-center">
                  <span className="text-[12px] font-semibold text-[#64748B]">Read At</span>
                  <span className="text-[13px] text-[#64748B]">{notification.readAt}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-[12px] font-semibold text-[#64748B]">Action Required</span>
                <span className={`text-[13px] font-medium ${notification.status === "Action Required" ? "text-[#DC2626]" : "text-[#64748B]"}`}>
                  {notification.status === "Action Required" ? "Yes" : "No"}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-[#E2E8F0]">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare size={14} className="text-[#1B4F8B]" />
                <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Message</p>
              </div>
              <p className="text-[13px] text-[#334155] leading-relaxed">{notification.message}</p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileText size={14} className="text-[#1B4F8B]" />
                <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Resolution Notes</p>
              </div>
              <textarea
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                className="w-full h-24 px-3 py-2 rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors bg-white resize-none"
                placeholder="Enter resolution notes..."
                maxLength={500}
              />
              <p className="text-[11px] text-[#94A3B8] mt-1 text-right">{resolutionNotes.length}/500</p>
            </div>

            <div className="p-4 rounded-xl border border-[#E2E8F0]">
              <div className="flex items-center gap-2 mb-3">
                <Clock size={14} className="text-[#1B4F8B]" />
                <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Timeline</p>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#1B4F8B] mt-1.5 flex-shrink-0" />
                  <div>
                    <p className="text-[12px] font-semibold text-[#0F172A]">Notification created</p>
                    <p className="text-[11px] text-[#64748B]">01 Jun 2026, 10:00</p>
                  </div>
                </div>
                {notification.status !== "Unread" && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#16A34A] mt-1.5 flex-shrink-0" />
                    <div>
                      <p className="text-[12px] font-semibold text-[#0F172A]">Notification read</p>
                      <p className="text-[11px] text-[#64748B]">{notification.readAt || "01 Jun 2026, 10:30"}</p>
                    </div>
                  </div>
                )}
                {notification.status === "Resolved" && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#64748B] mt-1.5 flex-shrink-0" />
                    <div>
                      <p className="text-[12px] font-semibold text-[#0F172A]">Notification resolved</p>
                      <p className="text-[11px] text-[#64748B]">01 Jun 2026, 11:00</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="px-5 py-4 border-t border-[#E2E8F0] flex items-center gap-3">
          <button
            onClick={() => {
              addToast("Notification updated.", "success");
              onClose();
            }}
            className="flex-1 flex items-center justify-center gap-2 h-10 rounded-xl text-[13px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90"
            style={{ backgroundColor: "#0B2545" }}
          >
            <Check size={16} />
            <span className="whitespace-nowrap">Save</span>
          </button>
          <button
            onClick={onClose}
            className="flex items-center justify-center gap-2 h-10 px-4 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] cursor-pointer hover:bg-[#F8FAFC] transition-colors"
          >
            <X size={16} />
            <span className="whitespace-nowrap">Close</span>
          </button>
        </div>
      </div>
    </>
  );
}