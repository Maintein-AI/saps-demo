"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Warehouse,
  Truck,
  Package,
  FileCheck,
  DollarSign,
  Calendar,
  Shield,
  Ship,
  UserCheck,
  Receipt,
  Forklift,
  Users,
  Settings,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  UserCog,
  X,
  MessageSquare,
  Bell,
  Radio,
} from "lucide-react";

interface NavItem {
  label: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  href: string;
  subItems?: { label: string; href: string }[];
}

const navItems: NavItem[] = [
  { label: "Home", icon: LayoutDashboard, href: "/" },
  {
    label: "Warehouse Manager",
    icon: Warehouse,
    href: "/warehouse-manager",
    subItems: [
      { label: "Dashboard", href: "/warehouse-manager" },
      { label: "AWB Detail", href: "/warehouse-manager/awb-detail" },
      { label: "Putaway", href: "/warehouse-manager/putaway" },
      { label: "Picking", href: "/warehouse-manager/picking" },
      { label: "Storage Map", href: "/warehouse-manager/storage-map" },
      { label: "Exceptions Queue", href: "/warehouse-manager/exceptions-queue" },
      { label: "Cold Chain Console", href: "/warehouse-manager/cold-chain" },
    ],
  },
  {
    label: "Gate Entry",
    icon: Truck,
    href: "/gate-entry",
    subItems: [
      { label: "Dashboard", href: "/gate-entry" },
      { label: "Vehicle Entry", href: "/gate-entry/vehicle-entry" },
      { label: "Vehicle Exit", href: "/gate-entry/vehicle-exit" },
      { label: "Live Vehicle Board", href: "/gate-entry/live-vehicle-board" },
      { label: "Driver Identity Register", href: "/gate-entry/driver-identity-register" },
      { label: "Authority Letter Digitisation", href: "/gate-entry/authority-letter-digitisation" },
    ],
  },
  {
    label: "Lifter Operator",
    icon: Forklift,
    href: "/lifter-operator",
    subItems: [
      { label: "My Tasks", href: "/lifter-operator/tasks" },
      { label: "Task Detail", href: "/lifter-operator/task-detail" },
      { label: "RFID Scan", href: "/lifter-operator/rfid-scan" },
      { label: "Movement Log", href: "/lifter-operator/movement-log" },
      { label: "Lifter Status", href: "/lifter-operator/lifter-status" },
    ],
  },
  {
    label: "Excise / Compliance",
    icon: FileCheck,
    href: "/excise-compliance",
    subItems: [
      { label: "Customs Queue", href: "/excise-compliance/customs-queue" },
      { label: "Channel Detail", href: "/excise-compliance/channel-detail" },
      { label: "OOC Capture", href: "/excise-compliance/ooc-capture" },
      { label: "Hold Register", href: "/excise-compliance/hold-register" },
      { label: "Section 82 / Long-Stay Register", href: "/excise-compliance/section-82-long-stay" },
      { label: "Customs Messaging Console", href: "/excise-compliance/customs-messaging" },
    ],
  },
  {
    label: "Finance Manager",
    icon: DollarSign,
    href: "/finance-manager",
    subItems: [
      { label: "Dashboard", href: "/finance-manager" },
      { label: "Invoice Generation", href: "/finance-manager/invoice-generation" },
      { label: "Waiver Workflow", href: "/finance-manager/waiver-workflow" },
      { label: "Payment Reconciliation", href: "/finance-manager/payment-reconciliation" },
      { label: "Tariff Master Editor", href: "/finance-manager/tariff-master-editor" },
      { label: "CMTS-grade Multi-Tariff Engine", href: "/finance-manager/multi-tariff-engine" },
      { label: "Payment Gateway Reconciliation", href: "/finance-manager/payment-gateway-reconciliation" },
      { label: "ERP Bridge Mapping", href: "/finance-manager/erp-bridge-mapping" },
    ],
  },
  {
    label: "Planner",
    icon: Calendar,
    href: "/planner",
    subItems: [
      { label: "Capacity Dashboard", href: "/planner/capacity-dashboard" },
      { label: "Slot Planner", href: "/planner/slot-planner" },
      { label: "Resource Roster", href: "/planner/resource-roster" },
      { label: "Demand Forecast", href: "/planner/demand-forecast" },
    ],
  },
  {
    label: "Operations Supervisor",
    icon: Shield,
    href: "/operations-supervisor",
    subItems: [
      { label: "Live Ops View", href: "/operations-supervisor/live-ops-view" },
      { label: "Performance Console", href: "/operations-supervisor/performance-console" },
      { label: "Escalation Inbox", href: "/operations-supervisor/escalation-inbox" },
      { label: "Shift Handover", href: "/operations-supervisor/shift-handover" },
      { label: "MoM / Floor Notes", href: "/operations-supervisor/mom-floor-notes" },
    ],
  },
  {
    label: "Forwarding Agent",
    icon: Ship,
    href: "/forwarding-agent",
    subItems: [
      { label: "Dashboard", href: "/forwarding-agent" },
      { label: "AWB Entry — Digital", href: "/forwarding-agent/awb-entry-digital" },
      { label: "Dispatch Documents", href: "/forwarding-agent/dispatch-documents" },
      { label: "Driver Register", href: "/forwarding-agent/driver-register" },
      { label: "Vehicle Register", href: "/forwarding-agent/vehicle-register" },
      { label: "Payments", href: "/forwarding-agent/payments" },
      { label: "Pickup Scheduling", href: "/forwarding-agent/pickup-scheduling" },
      { label: "Notifications & History", href: "/forwarding-agent/notifications-history" },
    ],
  },
  {
    label: "CHA",
    icon: UserCheck,
    href: "/cha",
    subItems: [
      { label: "Dashboard", href: "/cha" },
      { label: "GD Filing Workbench", href: "/cha/gd-filing-workbench" },
      { label: "Channel-Specific Workflow", href: "/cha/channel-specific-workflow" },
      { label: "OOC Tracking", href: "/cha/ooc-tracking" },
      { label: "DO Collection", href: "/cha/do-collection" },
      { label: "Payments", href: "/cha/payments" },
      { label: "Re-export / Long-Stay Console", href: "/cha/re-export-long-stay" },
    ],
  },
  { label: "Consignee", icon: Receipt, href: "/consignee/dashboard", subItems: [
      { label: "Dashboard", href: "/consignee/dashboard" },
      { label: "My Shipments", href: "/consignee/my-shipments" },
      { label: "Notice of Arrival", href: "/consignee/notice-of-arrival" },
      { label: "Pay & Download DO", href: "/consignee/pay-do" },
      { label: "Schedule Pickup", href: "/consignee/schedule-pickup" },
      { label: "POD History", href: "/consignee/pod-history" },
    ] },
  {
    label: "ULD Management",
    icon: MessageSquare,
    href: "/uld-message-builder",
    subItems: [
      { label: "Dashboard", href: "/uld-message-builder" },
      { label: "UCM", href: "/uld-message-builder/ucm" },
      { label: "SCM", href: "/uld-message-builder/scm" },
      { label: "LUC", href: "/uld-message-builder/luc" },
      { label: "Search", href: "/uld-message-builder/search" },
      { label: "Import ULDs", href: "/uld-message-builder/import-ulds" },
      { label: "Message Log", href: "/uld-message-builder/message-log" },
      { label: "Personal Settings", href: "/uld-message-builder" },
    ],
  },
  {
    label: "CMTS Absorption",
    icon: Package,
    href: "/cmts-absorption",
    subItems: [
      { label: "Overview", href: "/cmts-absorption" },
      { label: "Manifest Reconciliation", href: "/cmts-absorption/manifest-reconciliation" },
      { label: "AWB Consolidation & Split", href: "/cmts-absorption/awb-consolidation" },
      { label: "Godown Rent History", href: "/cmts-absorption/godown-rent-history" },
      { label: "Charges Calculator", href: "/cmts-absorption/charges-calculator" },
      { label: "Cargo Acceptance Check-in", href: "/cmts-absorption/cargo-acceptance" },
    ],
  },
  {
    label: "Export Cargo",
    icon: Ship,
    href: "/export-cargo",
    subItems: [
      { label: "Dashboard", href: "/export-cargo" },
      { label: "Export Acceptance", href: "/export-cargo/acceptance" },
      { label: "Export Customs", href: "/export-cargo/customs" },
      { label: "Manifest & Handover", href: "/export-cargo/manifest-handover" },
    ],
  },
  { label: "Admin / Super Admin", icon: UserCog, href: "/admin", subItems: [
      { label: "Dashboard", href: "/admin" },
      { label: "Users", href: "/admin/users" },
      { label: "Roles & Permissions", href: "/admin/roles" },
      { label: "Master Data Editor", href: "/admin/master-data" },
      { label: "Integration Console", href: "/admin/integrations" },
      { label: "System Settings", href: "/admin/settings" },
      { label: "Audit Trail Browser", href: "/admin/audit-trail" },
      { label: "Session & Event Log", href: "/admin/event-log" },
    ] },
  { label: "Auditor", icon: ClipboardList, href: "/auditor", subItems: [
      { label: "Auditor Home", href: "/auditor" },
      { label: "Cargo Trace", href: "/auditor/cargo-trace" },
      { label: "Financial Trace", href: "/auditor/financial-trace" },
      { label: "RBAC Snapshot", href: "/auditor/rbac-snapshot" },
      { label: "Export Centre", href: "/auditor/export-centre" },
    ] },
  { label: "Reports", icon: BarChart3, href: "/reports" },
  { label: "Notifications & Messaging", icon: Bell, href: "/notifications-messaging" },
  { label: "RFID Integration", icon: Radio, href: "/rfid-integration" },
  { label: "Integration Status", icon: Settings, href: "/integration-status" },
  { label: "QA Checklist", icon: ClipboardList, href: "/qa-checklist" },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  activePortal?: string;
  onMobileClose?: () => void;
}

export default function Sidebar({ collapsed, onToggle, onMobileClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className="flex-shrink-0 h-full flex flex-col border-r border-[#E2E8F0] bg-white transition-all duration-300 ease-in-out relative z-40"
      style={{ width: collapsed ? 64 : 240 }}
    >
      <div className="lg:hidden flex items-center justify-end px-3 py-2 border-b border-[#E2E8F0]">
        <button
          onClick={onMobileClose}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-3">
        <nav className="flex flex-col gap-0.5 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href !== "#" &&
              (pathname === item.href || pathname.startsWith(item.href + "/"));
            const isParentActive =
              item.href !== "#" && (pathname === item.href || pathname.startsWith(item.href + "/"));
            return (
              <div key={item.label}>
                <Link
                  href={item.href}
                  onClick={() => onMobileClose?.()}
                  className="relative flex items-center gap-3 h-10 rounded-lg transition-all duration-200 cursor-pointer no-underline"
                  style={{
                    paddingLeft: collapsed ? 16 : 12,
                    paddingRight: collapsed ? 16 : 12,
                    backgroundColor: isActive ? "#EBF0F7" : "transparent",
                    color: isActive ? "#0B2545" : "#64748B",
                  }}
                >
                  {isActive && (
                    <div
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full"
                      style={{ backgroundColor: "#0B2545" }}
                    />
                  )}
                  <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                    <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                  </div>
                  {!collapsed && (
                    <span className="text-[13px] font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                      {item.label}
                    </span>
                  )}
                </Link>
                {item.subItems && !collapsed && isParentActive && (
                  <div className="flex flex-col gap-0.5 mt-0.5 ml-2 pl-4 border-l-2 border-[#E2E8F0]">
                    {item.subItems.map((sub) => {
                      const isSubActive =
                        pathname === sub.href || pathname.startsWith(sub.href + "/");
                      return (
                        <Link
                          key={sub.label}
                          href={sub.href}
                          onClick={() => onMobileClose?.()}
                          className="relative flex items-center h-8 rounded-lg transition-all duration-200 cursor-pointer no-underline text-[12px] font-medium px-3"
                          style={{
                            backgroundColor: isSubActive ? "#EBF0F7" : "transparent",
                            color: isSubActive ? "#0B2545" : "#94A3B8",
                          }}
                        >
                          {sub.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      <div className="px-2 py-2 border-t border-[#E2E8F0]">
        <button
          onClick={onToggle}
          className="w-full h-8 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors"
        >
          {collapsed ? (
            <ChevronRight size={18} />
          ) : (
            <div className="flex items-center gap-2">
              <ChevronLeft size={18} />
              <span className="text-[12px] font-medium">Collapse</span>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
}