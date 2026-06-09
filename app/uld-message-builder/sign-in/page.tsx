"use client";

import SignInForm from "@/components/auth/SignInForm";
import { AuthProvider } from "@/components/auth/AuthContext";

export default function SignInPage() {
  return (
    <AuthProvider>
      <SignInForm />
    </AuthProvider>
  );
}