import { Scan, FolderOpen } from "lucide-react";

export default function ScanLoading() {
  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2.5">
          <div className="h-[22px] w-12 rounded-full bg-[#F1F5F9] animate-pulse" />
        </div>
      </div>
      <div className="p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 h-14 rounded-xl bg-[#F1F5F9] animate-pulse" />
          <div className="h-14 w-24 rounded-xl bg-[#F1F5F9] animate-pulse" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="h-20 rounded-lg bg-[#F1F5F9] animate-pulse" />
          <div className="h-20 rounded-lg bg-[#F1F5F9] animate-pulse" />
          <div className="h-20 rounded-lg bg-[#F1F5F9] animate-pulse" />
          <div className="h-20 rounded-lg bg-[#F1F5F9] animate-pulse" />
        </div>
        <div className="h-12 rounded-xl bg-[#F1F5F9] animate-pulse" />
      </div>
    </div>
  );
}