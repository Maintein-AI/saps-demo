import ScopeBadge from "@/components/ScopeBadge";
import { Calendar, Clock, User, ArrowDownRight, ArrowUpRight, AlertTriangle, Package, Truck } from "lucide-react";

export default function SummaryCard() {
  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[15px] font-bold text-[#0F172A]">Current Shift Summary</h3>
        <ScopeBadge type="inc" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={14} className="text-[#64748B]" />
            <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Shift Date</span>
          </div>
          <div className="text-[14px] font-bold text-[#0F172A]">01 Jun 2026</div>
        </div>
        <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={14} className="text-[#64748B]" />
            <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Shift</span>
          </div>
          <div className="text-[14px] font-bold text-[#0F172A]">Day Shift A</div>
        </div>
        <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-4">
          <div className="flex items-center gap-2 mb-2">
            <ArrowDownRight size={14} className="text-[#DC2626]" />
            <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Outgoing</span>
          </div>
          <div className="text-[14px] font-bold text-[#0F172A]">Kamran Ali</div>
        </div>
        <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-4">
          <div className="flex items-center gap-2 mb-2">
            <ArrowUpRight size={14} className="text-[#16A34A]" />
            <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Incoming</span>
          </div>
          <div className="text-[14px] font-bold text-[#0F172A]">Sana Iqbal</div>
        </div>
        <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={14} className="text-[#64748B]" />
            <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Start / End</span>
          </div>
          <div className="text-[14px] font-bold text-[#0F172A]">06:00 / 14:00</div>
        </div>
        <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-4">
          <div className="flex items-center gap-2 mb-2">
            <Package size={14} className="text-[#1B4F8B]" />
            <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">AWBs Handled</span>
          </div>
          <div className="text-[14px] font-bold text-[#0F172A]">142</div>
        </div>
        <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-4">
          <div className="flex items-center gap-2 mb-2">
            <Truck size={14} className="text-[#1B4F8B]" />
            <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Dispatches</span>
          </div>
          <div className="text-[14px] font-bold text-[#0F172A]">38</div>
        </div>
        <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={14} className="text-[#D97706]" />
            <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Open Exceptions</span>
          </div>
          <div className="text-[14px] font-bold text-[#DC2626]">7</div>
        </div>
        <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={14} className="text-[#DC2626]" />
            <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Equipment Issues</span>
          </div>
          <div className="text-[14px] font-bold text-[#DC2626]">2</div>
        </div>
        <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-4">
          <div className="flex items-center gap-2 mb-2">
            <User size={14} className="text-[#64748B]" />
            <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Staff On Duty</span>
          </div>
          <div className="text-[14px] font-bold text-[#0F172A]">24</div>
        </div>
      </div>
    </div>
  );
}