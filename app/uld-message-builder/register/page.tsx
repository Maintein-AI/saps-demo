"use client";

import RegistrationForm from "@/components/auth/RegistrationForm";
import { AuthProvider } from "@/components/auth/AuthContext";

export default function RegisterPage() {
  return (
    <AuthProvider>
      <RegistrationForm />
    </AuthProvider>
  );
}