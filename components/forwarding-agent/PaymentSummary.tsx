import { CreditCard, Receipt, AlertTriangle, Clock, ArrowRight } from "lucide-react";

const items = [
  { label: "Outstanding PKR", value: "PKR 1,240,000", icon: <CreditCard size={16} className="text-[#DC2626]" />, color: "#DC2626" },
  { label: "Paid this month", value: "PKR 3,650,000", icon: <Receipt size={16} className="text-[#16A34A]" />, color: "#16A34A" },
  { label: "Invoices due today", value: "2", icon: <Clock size={16} className="text-[#D97706]" />, color: "#D97706" },
  { label: "Overdue invoices", value: "1", icon: <AlertTriangle size={16} className="text-[#DC2626]" />, color: "#DC2626" },
];

export default function PaymentSummary() {
  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <h3 className="text-[15px] font-bold text-[#0F172A]">Payment Summary</h3>
        </div>
        <button className="flex items-center gap-1 text-[12px] font-semibold text-[#1B4F8B] hover:text-[#0B2545] cursor-pointer transition-colors">
          View all <ArrowRight size={12} />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {items.map((item, i) => (
          <div key={i} className="rounded-xl border border-[#E2E8F0] p-4 hover:bg-[#F8FAFC] transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-[#F1F5F9] flex items-center justify-center">
                {item.icon}
              </div>
              <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">{item.label}</span>
            </div>
            <span className="text-[20px] font-bold" style={{ color: item.color }}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}