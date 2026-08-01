import { Clock, CheckCircle, TrendingUp, AlertTriangle, Truck } from "lucide-react";

export default function TodaySummary() {
  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-[15px] font-bold text-[#0F172A]">Today&#39;s Summary</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#EBF0F7] flex items-center justify-center flex-shrink-0">
            <Truck size={20} className="text-[#0B2545]" />
          </div>
          <div>
            <p className="text-[20px] font-bold text-[#0F172A]">2.4 km</p>
            <p className="text-[12px] text-[#64748B]">Total distance</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#DCFCE7] flex items-center justify-center flex-shrink-0">
            <CheckCircle size={20} className="text-[#16A34A]" />
          </div>
          <div>
            <p className="text-[20px] font-bold text-[#0F172A]">14</p>
            <p className="text-[12px] text-[#64748B]">Completed tasks</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] flex items-center justify-center flex-shrink-0">
            <Clock size={20} className="text-[#D97706]" />
          </div>
          <div>
            <p className="text-[20px] font-bold text-[#0F172A]">8.2 min</p>
            <p className="text-[12px] text-[#64748B]">Avg task time</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FEF2F2] flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={20} className="text-[#DC2626]" />
          </div>
          <div>
            <p className="text-[20px] font-bold text-[#0F172A]">1</p>
            <p className="text-[12px] text-[#64748B]">Exceptions reported</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F3E8FF] flex items-center justify-center flex-shrink-0">
            <TrendingUp size={20} className="text-[#7C3AED]" />
          </div>
          <div>
            <p className="text-[20px] font-bold text-[#0F172A]">FL-04</p>
            <p className="text-[12px] text-[#64748B]">Active lifter</p>
          </div>
        </div>
      </div>
    </div>
  );
}