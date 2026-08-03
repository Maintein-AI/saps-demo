"use client";

import { usePathname } from "next/navigation";
import AppShell from "@/components/AppShell";
import { AuthProvider } from "@/components/auth/AuthContext";
import AuthGuard from "@/components/auth/AuthGuard";
import { SiteProvider } from "@/components/site/SiteContext";

const NO_APP_SHELL_PATHS = [
  "/",
  "/login",
  "/uld-message-builder/sign-in",
  "/uld-message-builder/register",
  "/uld-message-builder/forgot-password",
  "/uld-message-builder/no-access",
  "/uld-message-builder/session-expired",
  "/uld-message-builder/permission-denied",
];

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const skipShell = NO_APP_SHELL_PATHS.includes(pathname);

  if (skipShell) {
    return <>{children}</>;
  }

  return (
    <AuthProvider>
      <AuthGuard>
        <SiteProvider>
          <AppShell>{children}</AppShell>
        </SiteProvider>
      </AuthGuard>
    </AuthProvider>
  );
}