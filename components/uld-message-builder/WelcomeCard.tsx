import { Plane } from "lucide-react";

export default function WelcomeCard() {
  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-[#EBF0F7] flex items-center justify-center flex-shrink-0">
          <Plane size={24} className="text-[#0B2545]" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-[17px] font-bold text-[#0F172A]">Aviation ULD Management</h2>
          </div>
          <p className="text-[13px] text-[#64748B] leading-relaxed">
            Create, review, submit, correct, search, and export operational ULD messages.
          </p>
        </div>
      </div>
    </div>
  );
}