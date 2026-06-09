"use client";

import { useEffect, useState } from "react";
import { X, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "./ToastContext";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error";
}

export default function ToastContainer() {
  const { toasts } = useToast();
  return (
    <div className="fixed top-4 left-4 right-4 sm:left-auto sm:right-4 z-[100] flex flex-col gap-2 sm:w-[360px]">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}

function ToastItem({ toast }: { toast: Toast }) {
  const { removeToast } = useToast();
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const duration = 4000;
    const interval = 50;
    const decrement = 100 / (duration / interval);
    const timer = setInterval(() => {
      setProgress((prev) => Math.max(0, prev - decrement));
    }, interval);
    const removeTimer = setTimeout(() => {
      removeToast(toast.id);
    }, duration);
    return () => {
      clearInterval(timer);
      clearTimeout(removeTimer);
    };
  }, [toast.id, removeToast]);

  return (
    <div
      className="relative rounded-xl overflow-hidden shadow-lg border p-4 pr-10"
      style={{
        borderRadius: 12,
        padding: 16,
        borderColor: toast.type === "success" ? "#16A34A" : "#DC2626",
        backgroundColor: toast.type === "success" ? "#16A34A" : "#DC2626",
      }}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {toast.type === "success" ? (
            <CheckCircle size={18} className="text-white" />
          ) : (
            <AlertCircle size={18} className="text-white" />
          )}
        </div>
        <div className="flex-1">
          <p className="text-[13px] font-medium text-white leading-snug">
            {toast.message}
          </p>
        </div>
      </div>
      <button
        onClick={() => removeToast(toast.id)}
        className="absolute top-3.5 right-3 w-5 h-5 flex items-center justify-center text-white/70 hover:text-white cursor-pointer transition-colors"
      >
        <X size={14} />
      </button>
      <div
        className="absolute bottom-0 left-0 h-[2px] bg-white/30"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}