"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, User, Mail, Phone, Building2, MapPin, Shield, Lock, CheckCircle, AlertCircle, ChevronLeft } from "lucide-react";
import ScopeBadge from "@/components/ScopeBadge";
import { useAuth, UserRole } from "./AuthContext";

const ROLES: UserRole[] = [
  "Message Builder User",
  "Message Reviewer",
  "Operations Administrator",
  "Read-only User",
];

const STATIONS = ["LHE", "KHI", "ISB", "PEW", "MUX", "UET"];

export default function RegistrationForm() {
  const router = useRouter();
  const { register } = useAuth();

  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    mobile: "",
    station: "",
    substation: "",
    organization: "",
    role: "" as UserRole | "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const updateField = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.fullName.trim()) errs.fullName = "Full name is required.";
    if (!form.username.trim()) errs.username = "Username is required.";
    else if (form.username.length < 4) errs.username = "Username must be at least 4 characters.";
    if (!form.email.trim()) errs.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email address.";
    if (!form.mobile.trim()) errs.mobile = "Mobile number is required.";
    if (!form.station) errs.station = "Station is required.";
    if (!form.substation.trim()) errs.substation = "Substation is required.";
    if (!form.organization.trim()) errs.organization = "Organization is required.";
    if (!form.role) errs.role = "Requested role is required.";
    if (!form.password) errs.password = "Password is required.";
    else if (form.password.length < 8) errs.password = "Password must be at least 8 characters.";
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/.test(form.password))
      errs.password = "Password must include uppercase, lowercase, number, and special character.";
    if (!form.confirmPassword) errs.confirmPassword = "Please confirm your password.";
    else if (form.password !== form.confirmPassword) errs.confirmPassword = "Passwords do not match.";
    if (!form.termsAccepted) errs.termsAccepted = "You must accept the terms.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const result = await register({
      ...form,
      role: form.role as UserRole,
    });
    setIsSubmitting(false);

    if (result.success) {
      setSubmitSuccess(true);
    }
  };

  const inputClass = (field: string) =>
    `w-full h-10 pl-10 pr-3 rounded-lg border text-[14px] text-[#0F172A] placeholder-[#94A3B8] outline-none transition-all ${
      errors[field]
        ? "border-[#DC2626] focus:ring-1 focus:ring-[#DC2626]/20"
        : "border-[#E2E8F0] focus:border-[#1B4F8B] focus:ring-1 focus:ring-[#1B4F8B]/20"
    }`;

  if (submitSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "#F8FAFC" }}>
        <div className="w-full max-w-[440px] bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-[#16A34A]/10 flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={32} className="text-[#16A34A]" />
          </div>
          <h2 className="text-[18px] font-bold text-[#0F172A] mb-2">Registration Request Submitted</h2>
          <p className="text-[13px] text-[#64748B] leading-relaxed mb-6">
            Your registration request has been received. An administrator will review your request and notify you via email.
          </p>
          <Link
            href="/uld-message-builder/sign-in"
            className="inline-flex items-center gap-2 h-10 px-5 rounded-xl text-[14px] font-bold text-white cursor-pointer transition-colors hover:opacity-90"
            style={{ backgroundColor: "#0B2545" }}
          >
            Return to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10" style={{ backgroundColor: "#F8FAFC" }}>
      <div className="w-full max-w-[520px]">
        <div className="text-center mb-6">
          <img 
            src="/airvault-logo.png"
            alt="AirVault"
            className="h-9 w-auto mx-auto"
          />
          <p className="text-[13px] text-[#64748B] mt-1">ULD Aviation Message Builder</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <h1 className="text-[18px] font-bold text-[#0F172A]">Registration</h1>
              <ScopeBadge type="exc" />
            </div>
            <Link
              href="/uld-message-builder/sign-in"
              className="flex items-center gap-1 text-[12px] font-semibold text-[#64748B] hover:text-[#0F172A] cursor-pointer transition-colors"
            >
              <ChevronLeft size={14} />
              Back to Sign In
            </Link>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
              <div className="sm:col-span-2">
                <label className="block text-[12px] font-semibold text-[#0F172A] mb-1.5">Full Name</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"><User size={16} /></div>
                  <input type="text" value={form.fullName} onChange={(e) => updateField("fullName", e.target.value)} className={inputClass("fullName")} placeholder="Ahmed Shaikh" />
                </div>
                {errors.fullName && <p className="text-[11px] text-[#DC2626] mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#0F172A] mb-1.5">Username</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"><User size={16} /></div>
                  <input type="text" autoComplete="username" value={form.username} onChange={(e) => updateField("username", e.target.value)} className={inputClass("username")} placeholder="opsadmin" />
                </div>
                {errors.username && <p className="text-[11px] text-[#DC2626] mt-1">{errors.username}</p>}
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#0F172A] mb-1.5">Email</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"><Mail size={16} /></div>
                  <input type="email" autoComplete="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} className={inputClass("email")} placeholder="ahmed@shaheen-airport.com" />
                </div>
                {errors.email && <p className="text-[11px] text-[#DC2626] mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#0F172A] mb-1.5">Mobile</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"><Phone size={16} /></div>
                  <input type="tel" autoComplete="tel" value={form.mobile} onChange={(e) => updateField("mobile", e.target.value)} className={inputClass("mobile")} placeholder="+92 300 1234567" />
                </div>
                {errors.mobile && <p className="text-[11px] text-[#DC2626] mt-1">{errors.mobile}</p>}
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#0F172A] mb-1.5">Station</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"><MapPin size={16} /></div>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        const menu = document.getElementById("station-dropdown");
                        if (menu) menu.classList.toggle("hidden");
                      }}
                      className={`w-full h-10 pl-10 pr-8 rounded-lg border text-left text-[14px] outline-none transition-all ${errors.station ? "border-[#DC2626]" : "border-[#E2E8F0]"} ${form.station ? "text-[#0F172A]" : "text-[#94A3B8]"}`}
                    >
                      {form.station || "Select station"}
                      <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
                    </button>
                    <div id="station-dropdown" className="hidden absolute top-full left-0 right-0 mt-1 bg-white border border-[#E2E8F0] rounded-lg shadow-lg z-10 max-h-[180px] overflow-y-auto">
                      {STATIONS.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => {
                            updateField("station", s);
                            const menu = document.getElementById("station-dropdown");
                            if (menu) menu.classList.add("hidden");
                          }}
                          className="w-full text-left px-3 py-2 text-[13px] text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer transition-colors"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                {errors.station && <p className="text-[11px] text-[#DC2626] mt-1">{errors.station}</p>}
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#0F172A] mb-1.5">Substation</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"><MapPin size={16} /></div>
                  <input type="text" value={form.substation} onChange={(e) => updateField("substation", e.target.value)} className={inputClass("substation")} placeholder="LAHORE" />
                </div>
                {errors.substation && <p className="text-[11px] text-[#DC2626] mt-1">{errors.substation}</p>}
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#0F172A] mb-1.5">Organization</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"><Building2 size={16} /></div>
                  <input type="text" value={form.organization} onChange={(e) => updateField("organization", e.target.value)} className={inputClass("organization")} placeholder="Shaheen Airport Services" />
                </div>
                {errors.organization && <p className="text-[11px] text-[#DC2626] mt-1">{errors.organization}</p>}
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#0F172A] mb-1.5">Requested Role</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"><Shield size={16} /></div>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        const menu = document.getElementById("role-dropdown");
                        if (menu) menu.classList.toggle("hidden");
                      }}
                      className={`w-full h-10 pl-10 pr-8 rounded-lg border text-left text-[14px] outline-none transition-all ${errors.role ? "border-[#DC2626]" : "border-[#E2E8F0]"} ${form.role ? "text-[#0F172A]" : "text-[#94A3B8]"}`}
                    >
                      {form.role || "Select role"}
                      <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
                    </button>
                    <div id="role-dropdown" className="hidden absolute top-full left-0 right-0 mt-1 bg-white border border-[#E2E8F0] rounded-lg shadow-lg z-10">
                      {ROLES.map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => {
                            updateField("role", r);
                            const menu = document.getElementById("role-dropdown");
                            if (menu) menu.classList.add("hidden");
                          }}
                          className="w-full text-left px-3 py-2 text-[13px] text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer transition-colors"
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                {errors.role && <p className="text-[11px] text-[#DC2626] mt-1">{errors.role}</p>}
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#0F172A] mb-1.5">Password</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"><Lock size={16} /></div>
                  <input type={showPassword ? "text" : "password"} autoComplete="new-password" value={form.password} onChange={(e) => updateField("password", e.target.value)} className={inputClass("password")} placeholder="Min. 8 characters" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#64748B] cursor-pointer" tabIndex={-1}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="text-[11px] text-[#DC2626] mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#0F172A] mb-1.5">Confirm Password</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"><Lock size={16} /></div>
                  <input type={showConfirm ? "text" : "password"} autoComplete="new-password" value={form.confirmPassword} onChange={(e) => updateField("confirmPassword", e.target.value)} className={inputClass("confirmPassword")} placeholder="Re-enter password" />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#64748B] cursor-pointer" tabIndex={-1}>
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-[11px] text-[#DC2626] mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            <div className="mt-5 mb-5">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.termsAccepted}
                  onChange={(e) => updateField("termsAccepted", e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded border-[#CBD5E1] text-[#0B2545] focus:ring-[#0B2545]"
                />
                <span className="text-[12px] text-[#64748B] leading-relaxed">
                  I accept the{" "}
                  <button type="button" className="font-semibold text-[#1B4F8B] hover:underline cursor-pointer">Terms of Service</button>
                  {" "}and{" "}
                  <button type="button" className="font-semibold text-[#1B4F8B] hover:underline cursor-pointer">Privacy Policy</button>
                </span>
              </label>
              {errors.termsAccepted && <p className="text-[11px] text-[#DC2626] mt-1 ml-6">{errors.termsAccepted}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 rounded-xl text-[14px] font-bold text-white cursor-pointer transition-all whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-90"
              style={{ backgroundColor: "#0B2545" }}
            >
              {isSubmitting ? "Submitting..." : "Submit Registration Request"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}