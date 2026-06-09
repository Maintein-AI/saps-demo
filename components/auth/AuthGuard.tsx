"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "./AuthContext";

const PUBLIC_AUTH_PATHS = [
  "/uld-message-builder/sign-in",
  "/uld-message-builder/register",
  "/uld-message-builder/no-access",
  "/uld-message-builder/session-expired",
  "/uld-message-builder/permission-denied",
  "/uld-message-builder/forgot-password",
];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { authState } = useAuth();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const isPublicAuthPath = PUBLIC_AUTH_PATHS.includes(pathname);
    const isHomePath = pathname === "/";

    if (isPublicAuthPath || isHomePath) {
      setChecking(false);
      return;
    }

    if (authState === "guest") {
      router.replace("/uld-message-builder/no-access");
    } else if (authState === "session_expired") {
      router.replace("/uld-message-builder/session-expired");
    } else if (authState === "permission_denied") {
      router.replace("/uld-message-builder/permission-denied");
    } else if (authState === "locked") {
      router.replace("/uld-message-builder/sign-in");
    } else if (authState === "disabled") {
      router.replace("/uld-message-builder/sign-in");
    }

    setChecking(false);
  }, [authState, pathname, router]);

  if (checking) return null;

  return <>{children}</>;
}