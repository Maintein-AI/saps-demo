import { SearchX, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-20 h-20 rounded-2xl bg-[#F1F5F9] flex items-center justify-center mb-6">
        <SearchX size={36} className="text-[#94A3B8]" />
      </div>
      <h1 className="text-[32px] font-bold text-[#0F172A] leading-[40px] mb-2">404</h1>
      <p className="text-[16px] font-semibold text-[#334155] mb-3">Page not found</p>
      <p className="text-[14px] text-[#64748B] max-w-[320px] mb-8">
        The page you are looking for does not exist or has been moved.
      </p>
      <button
        className="flex items-center gap-2 h-9 px-4 rounded-xl text-[13px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90"
        style={{ backgroundColor: "#0B2545" }}
      >
        <Home size={14} />
        Back to Dashboard
      </button>
    </div>
  );
}