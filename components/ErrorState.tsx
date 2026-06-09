import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export default function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-xl border border-[#DC2626]/20 bg-[#DC2626]/5">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#DC2626]/10 flex items-center justify-center">
        <AlertTriangle size={20} className="text-[#DC2626]" />
      </div>
      <div className="flex-1">
        <h3 className="text-[14px] font-bold text-[#0F172A] mb-1">{title}</h3>
        <p className="text-[13px] text-[#64748B] leading-relaxed">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-2 mt-3 h-8 px-3 rounded-lg text-[13px] font-semibold border border-[#DC2626]/30 text-[#DC2626] hover:bg-[#DC2626]/10 cursor-pointer transition-colors"
          >
            <RefreshCw size={14} />
            Retry
          </button>
        )}
      </div>
    </div>
  );
}