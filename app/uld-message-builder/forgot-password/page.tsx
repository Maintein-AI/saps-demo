"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ChevronLeft, CheckCircle, AlertCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "#F8FAFC" }}>
        <div className="w-full max-w-[420px] bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-[#16A34A]/10 flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={32} className="text-[#16A34A]" />
          </div>
          <h2 className="text-[18px] font-bold text-[#0F172A] mb-2">Reset Link Sent</h2>
          <p className="text-[13px] text-[#64748B] leading-relaxed mb-6">
            If an account exists for <strong>{email}</strong>, you will receive a password reset link shortly.
          </p>
          <Link
            href="/uld-message-builder/sign-in"
            className="inline-flex items-center gap-2 h-10 px-5 rounded-xl text-[14px] font-bold text-white cursor-pointer transition-colors hover:opacity-90"
            style={{ backgroundColor: "#0B2545" }}
          >
            <ChevronLeft size={16} />
            Return to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "#F8FAFC" }}>
      <div className="w-full max-w-[420px]">
        <div className="text-center mb-8">
          <img 
            src="https://storage.readdy-site.link/project_files/7dc78ca5-5248-4b2d-8589-6bb75925d7bd/cc3fcb98-8b2d-464a-b39e-cf7f7577fc4e_ChatGPT_Image_Jun_9__2026__02_46_34_AM-removebg-preview.png?v=1f20150c9684bbc711c43d8d8b346460"
            alt="AirVault"
            className="h-10 w-auto mx-auto"
          />
          <p className="text-[14px] text-[#64748B] mt-1">ULD Aviation Message Builder</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-[18px] font-bold text-[#0F172A]">Forgot Password</h1>
            <Link
              href="/uld-message-builder/sign-in"
              className="flex items-center gap-1 text-[12px] font-semibold text-[#64748B] hover:text-[#0F172A] cursor-pointer transition-colors"
            >
              <ChevronLeft size={14} />
              Back
            </Link>
          </div>

          <p className="text-[13px] text-[#64748B] leading-relaxed mb-5">
            Enter your registered email address and we will send you a link to reset your password.
          </p>

          {error && (
            <div className="flex items-start gap-3 p-3 rounded-lg bg-[#DC2626]/5 border border-[#DC2626]/20 mb-5">
              <AlertCircle size={16} className="text-[#DC2626] mt-0.5 flex-shrink-0" />
              <p className="text-[13px] text-[#DC2626] leading-relaxed">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-5">
              <label className="block text-[12px] font-semibold text-[#0F172A] mb-1.5">Email Address</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-10 pl-10 pr-3 rounded-lg border border-[#E2E8F0] text-[14px] text-[#0F172A] placeholder-[#94A3B8] outline-none focus:border-[#1B4F8B] focus:ring-1 focus:ring-[#1B4F8B]/20 transition-all"
                  placeholder="ahmed@shaheen-airport.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 rounded-xl text-[14px] font-bold text-white cursor-pointer transition-all whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-90"
              style={{ backgroundColor: "#0B2545" }}
            >
              {isSubmitting ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}