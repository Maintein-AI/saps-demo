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
  Network,
  FileScan,
  Boxes,
  TriangleAlert,
  Landmark,
  Coins,
  PackageCheck,
  Send,
  Repeat,
  PlaneTakeoff,
} from "lucide-react";

interface NavItem {
  label: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  href: string;
  subItems?: { label: string; href: string }[];
}

const navItems: NavItem[] = [
  { label: "Home", icon: LayoutDashboard, href: "/" },
  // P0-5 — the FC-12 module view + flow walkthroughs, alongside the
  // persona navigation below rather than replacing it.
  { label: "Module Map", icon: Network, href: "/modules" },
  // Phase 1 — the import spine, M01–M04 (FC-01 §01–14, FC-02).
  {
    label: "Import Documentation",
    icon: FileScan,
    href: "/import/flights",
    subItems: [
      { label: "Flight & Airline Data — M01", href: "/import/flights" },
      { label: "Document Repository — M02", href: "/import/documents" },
      { label: "OCR Intake Workbench", href: "/import/ocr-intake" },
      { label: "AWB Indexing — M03", href: "/import/indexing" },
      { label: "Manifest & IGM", href: "/import/manifest" },
      { label: "Cargo Acceptance — M04", href: "/import/acceptance" },
      { label: "Consolidation & Split", href: "/import/consolidation" },
      { label: "Arrival Advice / NOA", href: "/import/arrival-advice" },
    ],
  },
  // Phase 2 — storage & warehouse allocation, M05 (FC-03).
  {
    label: "Storage & Allocation",
    icon: Boxes,
    href: "/storage/master",
    subItems: [
      { label: "Cargo & Location Master", href: "/storage/master" },
      { label: "Allocation Engine", href: "/storage/allocation" },
      { label: "Logical vs Physical", href: "/storage/locations" },
      { label: "Tag Binding (RFID)", href: "/storage/rfid-binding" },
      { label: "Bonded Area", href: "/storage/bonded" },
    ],
  },
  // Phase 3 — exceptions & CDR, M06 + M16–M18 (FC-04, FC-10 A/B/C).
  {
    label: "Exceptions & CDR",
    icon: TriangleAlert,
    href: "/exceptions/queue",
    subItems: [
      { label: "Aging Dashboard", href: "/exceptions/queue" },
      { label: "CDR Workbench — M06", href: "/exceptions/cdr" },
      { label: "Damage Register", href: "/exceptions/damage" },
      { label: "Hold Register", href: "/exceptions/holds" },
      { label: "Mishandled Cargo — M17", href: "/exceptions/mishandled" },
      { label: "Re-export — M16", href: "/exceptions/re-export" },
      { label: "Long-stay / S.82 — M18", href: "/exceptions/long-stay" },
    ],
  },
  // Phase 4 — customs clearance & PSW gateway, M09 (FC-06).
  {
    label: "Customs Clearance",
    icon: Landmark,
    href: "/customs/gateway",
    subItems: [
      { label: "Gateway (PSW / WeBOC)", href: "/customs/gateway" },
      { label: "SD / GD Filing — M09", href: "/customs/filing" },
      { label: "Channels & OOC", href: "/customs/channels" },
      { label: "Detained Cargo", href: "/customs/detained" },
    ],
  },
  // Phase 5 — charges, invoice, waiver & delivery order, M10-M12 (FC-07).
  {
    label: "Billing & Release",
    icon: Coins,
    href: "/billing/calculator",
    subItems: [
      { label: "Charges Calculator — M10", href: "/billing/calculator" },
      { label: "Godown Rent Voucher — M11", href: "/billing/godown-rent" },
      { label: "Invoice & Waiver", href: "/billing/invoice" },
      { label: "Delivery Order — M12", href: "/billing/delivery-order" },
    ],
  },
  // Phase 6 — gate pass, dispatch, POD & closure, M13-M14 (FC-08).
  {
    label: "Dispatch & Closure",
    icon: PackageCheck,
    href: "/dispatch/gate-pass",
    subItems: [
      { label: "Gate Pass & Picking — M13", href: "/dispatch/gate-pass" },
      { label: "Gate-out & POD — M14", href: "/dispatch/gate-out" },
      { label: "AWB Closure & Archive", href: "/dispatch/closure" },
    ],
  },
  // Phase 7 — messaging & notification engine, M07-M08 (FC-05).
  {
    label: "Messaging & Alerts",
    icon: Send,
    href: "/messaging/iata",
    subItems: [
      { label: "IATA Cargo-IMP — M07", href: "/messaging/iata" },
      { label: "Notification Engine — M08", href: "/messaging/notifications" },
    ],
  },
  // Phase 8 — transhipment & bonded transfer, M15 (FC-09). New module.
  {
    label: "Transhipment",
    icon: Repeat,
    href: "/transhipment/register",
    subItems: [
      { label: "Bonded Register — M15", href: "/transhipment/register" },
      { label: "Inter-station Handoff", href: "/transhipment/handoff" },
    ],
  },
  // Phase 9 — export cargo, FC-11. P9-1 (revenue) and P9-6 (airmail) parked.
  // Named distinctly from the legacy "Export Cargo" section further down —
  // duplicate labels collide on the React key and on the FC-01 ordering below.
  {
    label: "Export (FC-11)",
    icon: PlaneTakeoff,
    href: "/export/acceptance",
    subItems: [
      { label: "Acceptance & Screening", href: "/export/acceptance" },
      { label: "Build-up & Declaration", href: "/export/buildup" },
    ],
  },
  {
    label: "Warehouse Manager",
    icon: Warehouse,
    href: "/warehouse-manager",
    subItems: [
      { label: "Dashboard", href: "/warehouse-manager" },
      { label: "AWB Register", href: "/warehouse-manager/awb-detail" },
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

/**
 * FC-01 — Master End-to-End Air Cargo Flow.
 *
 * Top-level navigation follows the flow's own sequence rather than the
 * persona grouping the demo started with, so walking the sidebar top to
 * bottom walks a consignment from airline handover to file closure.
 *
 * The §refs are FC-01's own step numbers (see FLOWS in lib/architecture.ts,
 * extracted from the FigJam board):
 *
 *   §01–14  handover → pouch opening → doc verification → AWB summary →
 *           manifest reconciliation → indexation → tagging → split &
 *           segregation → acceptance, weighing & condition check
 *   §15–16  storage allocation & data capture
 *   §17–18  IATA messaging (ARR / RCF / NFD) → Notice of Arrival
 *   §19     customs clearance tracking
 *   §20–22  charges → invoice → godown rent voucher → Delivery Order
 *   §23–27  gate pass → dispatch → POD / DLV → AWB closure & archive
 *
 * Two entries are branches that leave the main line rather than steps on it,
 * and sit at the end of the flow group: Exceptions (the §08 "discrepancy?"
 * decision, which hands off to FC-04) and Transhipment (FC-09, taken when
 * cargo never enters local import at all).
 *
 * Anything NOT on this list is a persona portal, a utility screen or a
 * separate flow (FC-11 export). Those keep their place below and are
 * prefixed with "." so the distinction is visible at a glance.
 */
const FC01_FLOW_ORDER = [
  "Import Documentation", //   §01–14  M01–M04
  "Storage & Allocation", //   §10, §15–16  M05
  "Messaging & Alerts", //     §17–18  M07–M08
  "Customs Clearance", //      §19  M09
  "Billing & Release", //      §20–22  M10–M12
  "Dispatch & Closure", //     §23–27  M13–M14, M20
  "Exceptions & CDR", //       branch — §08 discrepancy → FC-04
  "Transhipment", //           branch — FC-09
];

/**
 * Flow steps first, in FC-01 order; everything else after, marked with a
 * leading dot. Derived rather than hand-maintained, so a nav item added
 * later shows as off-flow until it is deliberately placed in the list above.
 */
const orderedNavItems: NavItem[] = (() => {
  const byLabel = new Map(navItems.map((i) => [i.label, i]));
  const onFlow = FC01_FLOW_ORDER.map((label) => byLabel.get(label)).filter(
    (i): i is NavItem => i !== undefined,
  );
  const offFlow = navItems
    .filter((i) => !FC01_FLOW_ORDER.includes(i.label))
    .map((i) => ({ ...i, label: `. ${i.label}` }));
  return [...onFlow, ...offFlow];
})();

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
          {orderedNavItems.map((item) => {
            const Icon = item.icon;

            /**
             * A section is "active" when the current route matches the section
             * itself OR any of its sub-items.
             *
             * Matching only on `item.href` breaks every section whose href
             * points at its first sub-item rather than a shared parent path
             * (Import, Storage, Exceptions, Customs, Billing, Dispatch,
             * Messaging, Transhipment, Export) — selecting a second sub-item
             * collapsed the section, because e.g. "/billing/godown-rent" does
             * not start with "/billing/calculator/".
             */
            const matches = (href: string) =>
              href !== "#" && (pathname === href || pathname.startsWith(href + "/"));

            const isActive =
              matches(item.href) || (item.subItems?.some((s) => matches(s.href)) ?? false);
            const isParentActive = isActive;
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