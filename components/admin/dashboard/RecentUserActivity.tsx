"use client";
import DataTable from "@/components/DataTable";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { ArrowRight, UserCheck, UserX, Clock } from "lucide-react";
import Link from "next/link";

const columns = [
  { key: "user", header: "User", sortable: true },
  { key: "action", header: "Action", sortable: true },
  { key: "module", header: "Module", sortable: true },
  { key: "timestamp", header: "Timestamp", sortable: true },
  { key: "ip", header: "IP / Device", sortable: true },
];

const rows = [
  { user: <span className="text-[13px] font-semibold text-[#0F172A]">Ahmed Shaikh</span>, action: <span className="text-[13px] font-medium text-[#16A34A]">Login</span>, module: <span className="text-[13px] text-[#64748B]">Auth</span>, timestamp: <span className="text-[12px] text-[#64748B]">09:42 AM</span>, ip: <span className="text-[12px] text-[#94A3B8]">192.168.1.45</span> },
  { user: <span className="text-[13px] font-semibold text-[#0F172A]">Fatima Rizvi</span>, action: <span className="text-[13px] font-medium text-[#1B4F8B]">Role Updated</span>, module: <span className="text-[13px] text-[#64748B]">Users</span>, timestamp: <span className="text-[12px] text-[#64748B]">09:38 AM</span>, ip: <span className="text-[12px] text-[#94A3B8]">10.5.12.200</span> },
  { user: <span className="text-[13px] font-semibold text-[#0F172A]">Bilal Khan</span>, action: <span className="text-[13px] font-medium text-[#DC2626]">Failed Login</span>, module: <span className="text-[13px] text-[#64748B]">Auth</span>, timestamp: <span className="text-[12px] text-[#64748B]">09:35 AM</span>, ip: <span className="text-[12px] text-[#94A3B8]">203.0.113.42</span> },
  { user: <span className="text-[13px] font-semibold text-[#0F172A]">Sana Tariq</span>, action: <span className="text-[13px] font-medium text-[#D97706]">Master Data Edit</span>, module: <span className="text-[13px] text-[#64748B]">Master Data</span>, timestamp: <span className="text-[12px] text-[#64748B]">09:28 AM</span>, ip: <span className="text-[12px] text-[#94A3B8]">192.168.1.78</span> },
  { user: <span className="text-[13px] font-semibold text-[#0F172A]">Ahmed Shaikh</span>, action: <span className="text-[13px] font-medium text-[#1B4F8B]">Permission Change</span>, module: <span className="text-[13px] text-[#64748B]">Roles</span>, timestamp: <span className="text-[12px] text-[#64748B]">09:15 AM</span>, ip: <span className="text-[12px] text-[#94A3B8]">192.168.1.45</span> },
];

export default function RecentUserActivity({ isLoading }: { isLoading: boolean }) {
  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-[16px] font-bold text-[#0F172A]">Recent User Activity</h2>
        </div>
        <Link href="/admin/audit-trail" className="flex items-center gap-1 text-[13px] font-semibold text-[#1B4F8B] hover:text-[#0B2545] cursor-pointer transition-colors">
          Audit Trail <ArrowRight size={14} />
        </Link>
      </div>
      {isLoading ? (
        <LoadingSkeleton rows={5} columns={5} />
      ) : (
        <DataTable columns={columns} rows={rows} sortable />
      )}
      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[#E2E8F0]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#16A34A]/10 flex items-center justify-center">
            <UserCheck size={16} className="text-[#16A34A]" />
          </div>
          <div>
            <p className="text-[11px] text-[#64748B]">Active Now</p>
            <p className="text-[14px] font-bold text-[#0F172A]">47</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#DC2626]/10 flex items-center justify-center">
            <UserX size={16} className="text-[#DC2626]" />
          </div>
          <div>
            <p className="text-[11px] text-[#64748B]">Locked</p>
            <p className="text-[14px] font-bold text-[#0F172A]">9</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#D97706]/10 flex items-center justify-center">
            <Clock size={16} className="text-[#D97706]" />
          </div>
          <div>
            <p className="text-[11px] text-[#64748B]">Idle 30m+</p>
            <p className="text-[14px] font-bold text-[#0F172A]">12</p>
          </div>
        </div>
      </div>
    </div>
  );
}