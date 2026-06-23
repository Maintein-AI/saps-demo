"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!username || !password) {
      setError("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/gate/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        const params = new URLSearchParams(window.location.search);
        const from = params.get("from") || "/";
        router.replace(from);
        router.refresh();
        return;
      }

      const data = await res.json().catch(() => ({}));
      setError(data.error || "Invalid username or password.");
      setLoading(false);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 flex overflow-hidden"
      style={{ backgroundColor: "#FAFBFD" }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-60 -left-40 w-[700px] h-[700px] rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, #C5F0E8 0%, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-60 -right-40 w-[700px] h-[700px] rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, #D8E8F8 0%, transparent 70%)" }}
        />
      </div>

      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ opacity: 0.04 }}
      >
        <svg width="100%" height="100%">
          <defs>
            <pattern
              id="signinGrid"
              width="50"
              height="50"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="25" cy="25" r="1" fill="#4A90C4" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#signinGrid)" />
        </svg>
      </div>

      <div className="relative z-10 flex w-full">
        <div className="hidden lg:flex lg:w-[55%] xl:w-[58%] relative overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="/login-bg.jpg"
              alt="Air Cargo Terminal"
              className="w-full h-full object-cover object-center"
            />
          </div>

          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, rgba(11,37,69,0.88) 0%, rgba(11,37,69,0.72) 40%, rgba(11,37,69,0.55) 100%)",
            }}
          />

          <div className="absolute inset-0 flex flex-col justify-end p-16">
            <div className="max-w-[480px]">
              <div className="mb-8">
                <div className="w-12 h-[3px] rounded-full mb-6" style={{ backgroundColor: "#7EC8E3" }} />
                <h2 className="text-[36px] font-extrabold text-white leading-[1.15] mb-4">
                  Command Your
                  <br />
                  Cargo Terminal
                </h2>
                <p className="text-[15px] leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>
                  From warehouse operations to gate management, ULD tracking to customs compliance — AirVault gives you complete visibility and control over every movement in your air cargo ecosystem.
                </p>
              </div>

              <div className="flex items-center gap-8">
                {[
                  { value: "50M+", label: "AWBs Processed" },
                  { value: "99.9%", label: "Platform Uptime" },
                  { value: "24/7", label: "Live Operations" },
                ].map((stat) => (
                  <div key={stat.label} className="flex flex-col gap-1">
                    <span className="text-[22px] font-extrabold text-white">{stat.value}</span>
                    <span className="text-[11px] font-medium uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.5)" }}>
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="absolute top-10 left-10">
            <img
              src="/airvault-logo.png"
              alt="AirVault"
              className="h-8 w-auto brightness-[100]"
            />
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 lg:px-12 xl:px-20">
          <div className="w-full max-w-[420px]">
            <div className="lg:hidden flex items-center justify-center mb-10">
              <img
                src="/airvault-logo.png"
                alt="AirVault"
                className="h-9 w-auto"
              />
            </div>

            <div className="mb-8">
              <h1 className="text-[28px] font-extrabold tracking-tight" style={{ color: "#0B2545" }}>
                Welcome back
              </h1>
              <p className="text-[14px] mt-2" style={{ color: "#64748B" }}>
                Sign in to your AirVault workspace
              </p>
            </div>

            <form onSubmit={handleSignIn} className="flex flex-col gap-5" noValidate>
              {error && (
                <div
                  className="flex items-center gap-2.5 px-4 py-3 rounded-lg text-[13px] font-medium"
                  style={{
                    backgroundColor: "rgba(220,38,38,0.06)",
                    color: "#DC2626",
                    border: "1px solid rgba(220,38,38,0.15)",
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold" style={{ color: "#334155" }}>
                  Username
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="w-full h-11 pl-10 pr-4 rounded-lg text-[14px] outline-none transition-all duration-200 border"
                    style={{
                      backgroundColor: "#F8FAFC",
                      borderColor: "#E2E8F0",
                      color: "#0F172A",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "#7EC8E3";
                      e.currentTarget.style.boxShadow = "0 0 0 3px rgba(126,200,227,0.15)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "#E2E8F0";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold" style={{ color: "#334155" }}>
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full h-11 pl-10 pr-10 rounded-lg text-[14px] outline-none transition-all duration-200 border"
                    style={{
                      backgroundColor: "#F8FAFC",
                      borderColor: "#E2E8F0",
                      color: "#0F172A",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "#7EC8E3";
                      e.currentTarget.style.boxShadow = "0 0 0 3px rgba(126,200,227,0.15)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "#E2E8F0";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-[#94A3B8] hover:text-[#64748B] cursor-pointer transition-colors"
                  >
                    {showPassword ? (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                        <path d="m14.12 14.12a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="h-12 w-full rounded-lg text-[15px] font-semibold text-white cursor-pointer transition-all duration-300 whitespace-nowrap mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  background: "linear-gradient(135deg, #7EC8E3, #5BA4C5)",
                  boxShadow: "0 4px 20px rgba(91,164,197,0.3)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "0 8px 28px rgba(91,164,197,0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 20px rgba(91,164,197,0.3)";
                }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    >
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <p className="text-center text-[13px] mt-8" style={{ color: "#94A3B8" }}>
              Need access?{" "}
              <span className="font-semibold cursor-pointer transition-colors hover:underline" style={{ color: "#5BA4C5" }}>
                Contact your administrator
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
