"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import Header from "./Header";
import Sidebar from "./Sidebar";
import RightDrawer from "./RightDrawer";
import ToastContainer from "./Toast";
import { ToastProvider } from "./ToastContext";

interface AppShellProps {
  children: React.ReactNode;
}

const portalMap: Record<string, string> = {
  "/": "Home",
  "/warehouse-manager": "Warehouse Manager",
  "/lifter-operator": "Lifter Operator",
  "/gate-entry": "Gate Entry",
  "/finance-manager": "Finance Manager",
  "/finance-manager/invoice-generation": "Finance Manager",
  "/finance-manager/waiver-workflow": "Finance Manager",
  "/finance-manager/payment-reconciliation": "Finance Manager",
  "/finance-manager/tariff-master-editor": "Finance Manager",
  "/finance-manager/multi-tariff-engine": "Finance Manager",
  "/finance-manager/payment-gateway-reconciliation": "Finance Manager",
  "/finance-manager/erp-bridge-mapping": "Finance Manager",
  "/planner": "Planner",
  "/planner/capacity-dashboard": "Planner",
  "/planner/slot-planner": "Planner",
  "/planner/resource-roster": "Planner",
  "/planner/demand-forecast": "Planner",
  "/operations-supervisor": "Operations Supervisor",
  "/operations-supervisor/live-ops-view": "Operations Supervisor",
  "/operations-supervisor/performance-console": "Operations Supervisor",
  "/operations-supervisor/escalation-inbox": "Operations Supervisor",
  "/operations-supervisor/shift-handover": "Operations Supervisor",
  "/operations-supervisor/mom-floor-notes": "Operations Supervisor",
  "/forwarding-agent": "Forwarding Agent",
  "/forwarding-agent/awb-entry-digital": "Forwarding Agent",
  "/forwarding-agent/dispatch-documents": "Forwarding Agent",
  "/forwarding-agent/driver-register": "Forwarding Agent",
  "/forwarding-agent/vehicle-register": "Forwarding Agent",
  "/forwarding-agent/payments": "Forwarding Agent",
  "/forwarding-agent/pickup-scheduling": "Forwarding Agent",
  "/forwarding-agent/notifications-history": "Forwarding Agent",
  "/cha": "CHA",
  "/cha/gd-filing-workbench": "CHA",
  "/cha/channel-specific-workflow": "CHA",
  "/cha/ooc-tracking": "CHA",
  "/cha/do-collection": "CHA",
  "/cha/payments": "CHA",
  "/cha/re-export-long-stay": "CHA",
  "/consignee": "Consignee",
  "/consignee/dashboard": "Consignee",
  "/consignee/my-shipments": "Consignee",
  "/consignee/notice-of-arrival": "Consignee",
  "/consignee/pay-do": "Consignee",
  "/consignee/schedule-pickup": "Consignee",
  "/consignee/pod-history": "Consignee",
  "/uld-message-builder": "ULD Management",
  "/uld-message-builder/scm": "ULD Management",
  "/uld-message-builder/ucm": "ULD Management",
  "/uld-message-builder/luc": "ULD Management",
  "/uld-message-builder/search": "ULD Management",
  "/uld-message-builder/import-ulds": "ULD Management",
  "/uld-message-builder/message-log": "ULD Management",
  "/uld-message-builder/permission-denied": "ULD Management",
  "/admin": "Admin / Super Admin",
  "/admin/users": "Admin / Super Admin",
  "/admin/roles": "Admin / Super Admin",
  "/admin/master-data": "Admin / Super Admin",
  "/admin/integrations": "Admin / Super Admin",
  "/admin/settings": "Admin / Super Admin",
  "/admin/audit-trail": "Admin / Super Admin",
  "/admin/event-log": "Admin / Super Admin",
  "/auditor": "Auditor",
  "/auditor/cargo-trace": "Auditor",
  "/auditor/financial-trace": "Auditor",
  "/auditor/rbac-snapshot": "Auditor",
  "/auditor/export-centre": "Auditor",
  "/reports": "Reports & Dashboards",
  "/notifications-messaging": "Notifications & Messaging",
  "/rfid-integration": "RFID Integration Console",
  "/integration-status": "Integration Status",
  "/qa-checklist": "QA Checklist",
};

const AUTH_PATHS = [
  "/uld-message-builder/sign-in",
  "/uld-message-builder/register",
  "/uld-message-builder/no-access",
  "/uld-message-builder/session-expired",
  "/uld-message-builder/permission-denied",
  "/uld-message-builder/forgot-password",
];

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();

  const isAuthPage = AUTH_PATHS.includes(pathname);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerContent, setDrawerContent] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const portalName = useMemo(() => {
    if (portalMap[pathname]) return portalMap[pathname];
    for (const [path, name] of Object.entries(portalMap)) {
      if (pathname.startsWith(path + "/") && path !== "/") return name;
    }
    return "Home";
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-dropdown]")) {
        setUserMenuOpen(false);
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggleDrawer = useCallback((content: string) => {
    setDrawerContent(content);
    setDrawerOpen(true);
    setNotificationsOpen(false);
    setUserMenuOpen(false);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setDrawerOpen(false);
  }, []);

  const handleOpenUserMenu = useCallback(() => {
    setUserMenuOpen((prev) => !prev);
    setNotificationsOpen(false);
  }, []);

  const handleToggleNotifications = useCallback(() => {
    setNotificationsOpen((prev) => !prev);
    setUserMenuOpen(false);
  }, []);

  if (isAuthPage) {
    return (
      <ToastProvider>
        <div className="min-h-screen" style={{ backgroundColor: "#F8FAFC" }}>
          {children}
          <ToastContainer />
        </div>
      </ToastProvider>
    );
  }

  return (
    <ToastProvider>
      <div className="h-screen flex flex-col overflow-hidden" style={{ backgroundColor: "#F8FAFC" }}>
        <Header
          portalName={portalName}
          onToggleDrawer={handleToggleDrawer}
          onOpenUserMenu={handleOpenUserMenu}
          userMenuOpen={userMenuOpen}
          onToggleNotifications={handleToggleNotifications}
          notificationsOpen={notificationsOpen}
          onToggleMobileSidebar={() => setSidebarMobileOpen((prev) => !prev)}
        />

        <div className="flex flex-1 overflow-hidden relative">
          {sidebarMobileOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-[45] lg:hidden"
              onClick={() => setSidebarMobileOpen(false)}
            />
          )}

          <div className={`${sidebarMobileOpen ? "fixed inset-y-0 left-0 z-[50] lg:static lg:z-auto" : "hidden lg:block"}`}>
            <Sidebar
              collapsed={sidebarCollapsed}
              onToggle={() => setSidebarCollapsed((prev) => !prev)}
              onMobileClose={() => setSidebarMobileOpen(false)}
            />
          </div>

          <main
            className="flex-1 overflow-y-auto transition-all duration-300 px-4 py-4 md:px-6 md:py-6 lg:px-8 lg:py-8"
          >
            <div className="max-w-[1440px] mx-auto">
              {children}
            </div>
          </main>
        </div>

        <RightDrawer
          isOpen={drawerOpen}
          onClose={handleCloseDrawer}
          content={drawerContent}
        />

        <ToastContainer />
      </div>
    </ToastProvider>
  );
}