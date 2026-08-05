"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Warehouse,
  Truck,
  Package,
  DollarSign,
  Calendar,
  Shield,
  Ship,
  UserCheck,
  Receipt,
  Forklift,
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
  // NOTE: `FileCheck` was the icon for the now-hidden "Excise / Compliance"
  // section (see HIDDEN ALTERNATES below). Its import was removed to avoid an
  // unused-import lint error. Re-add it if that section is un-hidden.
} from "lucide-react";

interface NavItem {
  label: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  href: string;
  subItems?: { label: string; href: string }[];
}

interface NavSection {
  /** Group heading shown above the items (hidden when the rail is collapsed). */
  heading?: string;
  items: NavItem[];
}

/* =============================================================================
 * MERGED NAVIGATION  ·  one coherent client-facing structure
 * -----------------------------------------------------------------------------
 * The demo previously shipped THREE overlapping navigations layered together —
 * (1) process/flow modules, (2) persona portals, (3) CMTS-absorption — which
 * duplicated the same screens on different routes and made the app feel
 * scattered. They are merged here into three clearly-labelled groups:
 *
 *   1. Operational Flow  — the FC-01 spine. The CANONICAL screen for each step.
 *   2. Role Views        — persona cockpits kept as entry points, NOT as
 *                          duplicate screens. Sub-items that merely re-skinned a
 *                          flow screen are commented out and point at the canon.
 *   3. System & Roadmap  — utilities + scope-delta (Phase 2 / out-of-scope)
 *                          items, clearly labelled so scope stays visible.
 *
 * NOTHING IS DELETED. Duplicate sections/screens are COMMENTED OUT under
 * "HIDDEN ALTERNATES" (top-level dups) or inline (duplicate sub-items), each
 * labelled with the canonical screen it maps to. To restore any of them, just
 * un-comment the block — every underlying /route and page still exists.
 * ===========================================================================*/

/* ── 1. Operational Flow — FC-01 order ──────────────────────────────────────
 * Walking this group top-to-bottom walks one consignment from airline handover
 * to file closure (FC-01 §01–27), with Exceptions/Transhipment as the branches
 * that leave the main line, and Export (FC-11) as the outbound counterpart.
 *   §01–14  handover → doc verification → AWB summary → reconciliation →
 *           indexation → tagging → segregation → acceptance & weighing
 *   §15–16  storage allocation      →  Storage & Allocation
 *   §17–18  IATA messaging / NOA    →  Messaging & Alerts
 *   §19     customs clearance       →  Customs Clearance
 *   §20–22  charges → invoice → DO  →  Billing & Release
 *   §23–27  gate pass → POD → close →  Dispatch & Closure
 * -------------------------------------------------------------------------- */
const operationalFlow: NavItem[] = [
  {
    label: "Import Documentation",
    icon: FileScan,
    href: "/import/flights",
    subItems: [
      { label: "Flight & Airline Data — M01", href: "/import/flights" }, //     §01–05
      { label: "Manifest & IGM", href: "/import/manifest" }, //                 §06
      { label: "OCR Intake Workbench", href: "/import/ocr-intake" }, //         §06a–06d
      { label: "AWB Summary Sheet", href: "/import/summary" }, //               §07–08
      { label: "AWB Indexing — M03", href: "/import/indexing" }, //             §09
      { label: "Cargo Acceptance — M04", href: "/import/acceptance" }, //       §11–13  (CANONICAL cargo acceptance)
      { label: "Consolidation & Split", href: "/import/consolidation" }, //     §11–12
      { label: "Arrival Advice / NOA", href: "/import/arrival-advice" }, //     §30
      { label: "Document Repository — M02", href: "/import/documents" }, //     supporting
    ],
  },
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
  {
    label: "Messaging & Alerts",
    icon: Send,
    href: "/messaging/iata",
    subItems: [
      { label: "IATA Cargo-IMP — M07", href: "/messaging/iata" }, //            CANONICAL messaging
      { label: "Notification Engine — M08", href: "/messaging/notifications" },
    ],
  },
  {
    label: "Customs Clearance",
    icon: Landmark,
    href: "/customs/gateway",
    subItems: [
      { label: "Gateway (PSW / WeBOC)", href: "/customs/gateway" }, //          CANONICAL customs
      { label: "SD / GD Filing — M09", href: "/customs/filing" },
      { label: "Channels & OOC", href: "/customs/channels" },
      { label: "Detained Cargo", href: "/customs/detained" },
    ],
  },
  {
    label: "Billing & Release",
    icon: Coins,
    href: "/billing/calculator",
    subItems: [
      { label: "Charges Calculator — M10", href: "/billing/calculator" }, //    CANONICAL charges (full FC-07 arithmetic)
      { label: "Godown Rent Voucher — M11", href: "/billing/godown-rent" }, //  CANONICAL godown rent
      { label: "Invoice & Waiver", href: "/billing/invoice" },
      { label: "Delivery Order — M12", href: "/billing/delivery-order" },
    ],
  },
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
  {
    label: "Exceptions & CDR",
    icon: TriangleAlert,
    href: "/exceptions/queue",
    subItems: [
      { label: "Aging Dashboard", href: "/exceptions/queue" }, //               CANONICAL exceptions
      { label: "CDR Workbench — M06", href: "/exceptions/cdr" },
      { label: "Damage Register", href: "/exceptions/damage" },
      { label: "Hold Register", href: "/exceptions/holds" }, //                 CANONICAL hold register
      { label: "Mishandled Cargo — M17", href: "/exceptions/mishandled" },
      { label: "Re-export — M16", href: "/exceptions/re-export" },
      { label: "Long-stay / S.82 — M18", href: "/exceptions/long-stay" }, //    CANONICAL Section 82
    ],
  },
  {
    label: "Transhipment",
    icon: Repeat,
    href: "/transhipment/register",
    subItems: [
      { label: "Bonded Register — M15", href: "/transhipment/register" },
      { label: "Inter-station Handoff", href: "/transhipment/handoff" },
    ],
  },
  {
    // Outbound counterpart of the import flow (FC-11). CANONICAL export.
    // Supersedes the persona "Export Cargo" draft (see HIDDEN ALTERNATES).
    label: "Export (FC-11)",
    icon: PlaneTakeoff,
    href: "/export/booking",
    subItems: [
      { label: "Booking & Allotment", href: "/export/booking" }, //            E01
      { label: "Acceptance & Screening", href: "/export/acceptance" }, //      E02–E04, E06
      { label: "Customs & ANF", href: "/export/customs" }, //                  E05
      { label: "Classification & Warehousing", href: "/export/warehousing" }, //E07–E08
      { label: "Build-up & Declaration", href: "/export/buildup" }, //         E09–E11
      { label: "Uplift & Closure", href: "/export/uplift" }, //                E12–E13
    ],
  },
];

/* ── 2. Role Views — persona cockpits (entry points, not duplicate screens) ── */
const roleViews: NavItem[] = [
  {
    label: "Warehouse Manager",
    icon: Warehouse,
    href: "/warehouse-manager",
    subItems: [
      { label: "Dashboard", href: "/warehouse-manager" },
      { label: "AWB Register", href: "/warehouse-manager/awb-detail" },
      { label: "Putaway", href: "/warehouse-manager/putaway" },
      { label: "Picking", href: "/warehouse-manager/picking" },
      { label: "Storage Map", href: "/warehouse-manager/storage-map" }, //     unique visual — kept
      { label: "Cold Chain Console", href: "/warehouse-manager/cold-chain" },
      // HIDDEN (duplicate) — "Exceptions Queue" duplicates Operational Flow →
      // Exceptions & CDR → Aging Dashboard (/exceptions/queue). Kept per no-delete.
      // { label: "Exceptions Queue", href: "/warehouse-manager/exceptions-queue" },
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
    // Finance persona cockpit. Overlaps Operational Flow → Billing & Release on
    // invoice/waiver, but carries unique screens (reconciliation, tariff editor,
    // ERP bridge), so it is kept as a role view rather than hidden.
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
  {
    label: "Consignee",
    icon: Receipt,
    href: "/consignee/dashboard",
    subItems: [
      { label: "Dashboard", href: "/consignee/dashboard" },
      { label: "My Shipments", href: "/consignee/my-shipments" },
      { label: "Notice of Arrival", href: "/consignee/notice-of-arrival" },
      { label: "Pay & Download DO", href: "/consignee/pay-do" },
      { label: "Schedule Pickup", href: "/consignee/schedule-pickup" },
      { label: "POD History", href: "/consignee/pod-history" },
    ],
  },
  {
    label: "Admin / Super Admin",
    icon: UserCog,
    href: "/admin",
    subItems: [
      { label: "Dashboard", href: "/admin" },
      { label: "Users", href: "/admin/users" },
      { label: "Roles & Permissions", href: "/admin/roles" },
      { label: "Master Data Editor", href: "/admin/master-data" },
      { label: "Integration Console", href: "/admin/integrations" },
      { label: "System Settings", href: "/admin/settings" },
      { label: "Audit Trail Browser", href: "/admin/audit-trail" },
      { label: "Session & Event Log", href: "/admin/event-log" },
    ],
  },
  {
    label: "Auditor",
    icon: ClipboardList,
    href: "/auditor",
    subItems: [
      { label: "Auditor Home", href: "/auditor" },
      { label: "Cargo Trace", href: "/auditor/cargo-trace" },
      { label: "Financial Trace", href: "/auditor/financial-trace" },
      { label: "RBAC Snapshot", href: "/auditor/rbac-snapshot" },
      { label: "Export Centre", href: "/auditor/export-centre" },
    ],
  },
];

/* ── 3. System & Roadmap — utilities + scope-delta (Phase 2) items ──────────── */
const systemAndRoadmap: NavItem[] = [
  { label: "Module Map", icon: Network, href: "/modules" },
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
    ],
  },
  {
    // SCOPE-DELTA — kept VISIBLE (not hidden) and labelled Phase 2, so the
    // "outside awarded Annexure-G scope" question stays on the table for the
    // client. Duplicate sub-screens are commented out and point at the canon.
    label: "CMTS Absorption · Phase 2",
    icon: Package,
    href: "/cmts-absorption",
    subItems: [
      { label: "Overview", href: "/cmts-absorption" },
      { label: "Manifest Reconciliation", href: "/cmts-absorption/manifest-reconciliation" },
      { label: "AWB Consolidation & Split", href: "/cmts-absorption/awb-consolidation" },
      { label: "Godown Rent History", href: "/cmts-absorption/godown-rent-history" },
      // HIDDEN (duplicate) — Charges Calculator duplicates Operational Flow →
      // Billing & Release → Charges Calculator (/billing/calculator). Kept.
      // { label: "Charges Calculator", href: "/cmts-absorption/charges-calculator" },
      // HIDDEN (duplicate) — Cargo Acceptance Check-in duplicates Operational
      // Flow → Import Documentation → Cargo Acceptance (/import/acceptance). Kept.
      // { label: "Cargo Acceptance Check-in", href: "/cmts-absorption/cargo-acceptance" },
    ],
  },
  { label: "Reports", icon: BarChart3, href: "/reports" },
  { label: "Notifications & Messaging", icon: Bell, href: "/notifications-messaging" },
  { label: "RFID Integration", icon: Radio, href: "/rfid-integration" },
  { label: "Integration Status", icon: Settings, href: "/integration-status" },
  // HIDDEN (internal/dev) — "QA Checklist" is a build-QA screen, not client-facing.
  // Kept per no-delete; un-comment to restore. { label: "QA Checklist", icon: ClipboardList, href: "/qa-checklist" },
];

/* ─────────────────────────────────────────────────────────────────────────────
 * HIDDEN ALTERNATES  ·  top-level sections removed from the visible nav
 * -----------------------------------------------------------------------------
 * Kept per the no-delete policy. Every /route and page below still exists and
 * is reachable by URL; only the sidebar entry is hidden. Un-comment to restore.
 *
 * 1) "Excise / Compliance"  →  MERGED into two canonical groups:
 *      • Customs Queue / Channel Detail / OOC Capture  → Customs Clearance
 *        (Gateway PSW/WeBOC, SD/GD Filing, Channels & OOC, Detained Cargo)
 *      • Hold Register / Section 82 / Customs Messaging → Exceptions & CDR
 *        (Hold Register, Long-stay / S.82) + Messaging & Alerts
 *    Icon was `FileCheck` (import removed above).
 *
 *   {
 *     label: "Excise / Compliance", icon: FileCheck, href: "/excise-compliance",
 *     subItems: [
 *       { label: "Customs Queue", href: "/excise-compliance/customs-queue" },
 *       { label: "Channel Detail", href: "/excise-compliance/channel-detail" },
 *       { label: "OOC Capture", href: "/excise-compliance/ooc-capture" },
 *       { label: "Hold Register", href: "/excise-compliance/hold-register" },
 *       { label: "Section 82 / Long-Stay Register", href: "/excise-compliance/section-82-long-stay" },
 *       { label: "Customs Messaging Console", href: "/excise-compliance/customs-messaging" },
 *     ],
 *   },
 *
 * 2) "Export Cargo"  →  DUPLICATE of Operational Flow → Export (FC-11), and it
 *    is the FC-11 "preview build / draft awaiting SAPS sign-off". The polished
 *    Export (FC-11) is the canon; this persona copy is hidden.
 *
 *   {
 *     label: "Export Cargo", icon: Ship, href: "/export-cargo",
 *     subItems: [
 *       { label: "Dashboard", href: "/export-cargo" },
 *       { label: "Export Acceptance", href: "/export-cargo/acceptance" },
 *       { label: "Export Customs", href: "/export-cargo/customs" },
 *       { label: "Manifest & Handover", href: "/export-cargo/manifest-handover" },
 *     ],
 *   },
 * ───────────────────────────────────────────────────────────────────────────*/

const navSections: NavSection[] = [
  { items: [{ label: "Home", icon: LayoutDashboard, href: "/" }] },
  { heading: "Operational Flow", items: operationalFlow },
  { heading: "Role Views", items: roleViews },
  { heading: "System & Roadmap", items: systemAndRoadmap },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  activePortal?: string;
  onMobileClose?: () => void;
}

export default function Sidebar({ collapsed, onToggle, onMobileClose }: SidebarProps) {
  const pathname = usePathname();

  /**
   * A section item is "active" when the current route matches the item itself
   * OR any of its sub-items. Matching only on `item.href` breaks sections whose
   * href points at their first sub-item (e.g. "/billing/godown-rent" does not
   * start with "/billing/calculator/").
   */
  const matches = (href: string) =>
    href !== "#" && (pathname === href || pathname.startsWith(href + "/"));

  const renderItem = (item: NavItem) => {
    const Icon = item.icon;
    const isActive =
      matches(item.href) || (item.subItems?.some((s) => matches(s.href)) ?? false);

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
        {item.subItems && !collapsed && isActive && (
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
  };

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
          {navSections.map((section, idx) => (
            <div key={section.heading ?? `section-${idx}`} className="flex flex-col gap-0.5">
              {section.heading && !collapsed && (
                <div className="px-3 pt-4 pb-1 text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8] select-none">
                  {section.heading}
                </div>
              )}
              {section.items.map(renderItem)}
            </div>
          ))}
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
