"use client";

import { AuthProvider } from "@/components/auth/AuthContext";
import PermissionDeniedScreen from "@/components/auth/PermissionDeniedScreen";

export default function PermissionDeniedPage() {
  return (
    <AuthProvider>
      <PermissionDeniedScreen />
    </AuthProvider>
  );
}