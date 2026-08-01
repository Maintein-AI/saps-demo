"use client";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import KPIStrip from "@/components/uld-message-builder/KPIStrip";
import WelcomeCard from "@/components/uld-message-builder/WelcomeCard";
import QuickActionCards from "@/components/uld-message-builder/QuickActionCards";
import RecentMessagesTable from "@/components/uld-message-builder/RecentMessagesTable";
import LastFiveMessages from "@/components/uld-message-builder/LastFiveMessages";

export default function ULDMessageBuilderPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-1.5 text-[12px] text-[#94A3B8]">
        <Link href="/" className="hover:text-[#64748B] transition-colors">Home</Link>
        <ChevronRight size={12} />
        <span className="text-[#64748B]">ULD Management</span>
      </div>

      <div className="flex items-center gap-2">
        <h1 className="text-[22px] font-bold text-[#0F172A]">ULD Management</h1>
      </div>

      <KPIStrip />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <WelcomeCard />
          <QuickActionCards />
        </div>
        <div className="space-y-6">
          <LastFiveMessages />
        </div>
      </div>

      <RecentMessagesTable />
    </div>
  );
}