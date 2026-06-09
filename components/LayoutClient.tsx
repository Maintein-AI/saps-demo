"use client";

import { usePathname } from "next/navigation";
import AppShell from "@/components/AppShell";
import { AuthProvider } from "@/components/auth/AuthContext";
import AuthGuard from "@/components/auth/AuthGuard";

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
        <AppShell>{children}</AppShell>
      </AuthGuard>
    </AuthProvider>
  );
}