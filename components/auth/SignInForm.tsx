"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuth } from "./AuthContext";

export default function SignInForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const usernameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => usernameRef.current?.focus(), 600);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim()) {
      setError("Username is required.");
      return;
    }
    if (!password) {
      setError("Password is required.");
      return;
    }

    setIsSubmitting(true);
    const result = await login(username.trim(), password);
    setIsSubmitting(false);

    if (result.success) {
      router.push("/uld-message-builder");
    } else {
      if (result.reason === "locked") {
        setError("Your account has been locked. Please contact support.");
      } else if (result.reason === "disabled") {
        setError("Your account has been disabled. Please contact your administrator.");
      } else if (result.reason === "permission_denied") {
        router.push("/uld-message-builder/permission-denied");
      } else {
        setError("Invalid username or password. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden" style={{ backgroundColor: "#060B14" }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-60 -right-60 w-[900px] h-[900px] rounded-full opacity-20" style={{ background: "radial-gradient(circle, #1B3A5C 0%, transparent 70%)" }} />
        <div className="absolute -bottom-80 -left-60 w-[800px] h-[800px] rounded-full opacity-15" style={{ background: "radial-gradient(circle, #1A2E4A 0%, transparent 70%)" }} />
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full opacity-10" style={{ background: "radial-gradient(circle, #2D1B3D 0%, transparent 70%)" }} />
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ opacity: 0.06 }}>
        <svg width="100%" height="100%">
          <defs>
            <pattern id="loginGrid" width="50" height="50" patternUnits="userSpaceOnUse">
              <circle cx="25" cy="25" r="0.8" fill="#3B82F6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#loginGrid)" />
        </svg>
      </div>

      <div className="absolute top-[15%] left-[8%] w-px h-40 opacity-20" style={{ background: "linear-gradient(to bottom, transparent, #3B82F6, transparent)" }} />
      <div className="absolute top-[20%] left-[10%] w-px h-32 opacity-15" style={{ background: "linear-gradient(to bottom, transparent, #60A5FA, transparent)" }} />
      <div className="absolute bottom-[25%] right-[10%] w-px h-48 opacity-18" style={{ background: "linear-gradient(to bottom, transparent, #8B5CF6, transparent)" }} />

      <div className="absolute top-[28%] right-[22%] w-2 h-2 rounded-full opacity-30" style={{ backgroundColor: "#3B82F6" }} />
      <div className="absolute bottom-[35%] left-[18%] w-1.5 h-1.5 rounded-full opacity-25" style={{ backgroundColor: "#60A5FA" }} />
      <div className="absolute top-[45%] left-[78%] w-2 h-2 rounded-full opacity-25" style={{ backgroundColor: "#8B5CF6" }} />

      <div className="absolute inset-0 z-0">
        <img
          src="/signin-bg.jpg"
          alt=""
          className="w-full h-full object-cover"
          style={{ filter: "blur(4px) brightness(0.35) saturate(0.6)" }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(6,11,20,0.7) 0%, rgba(8,16,30,0.6) 40%, rgba(6,11,20,0.7) 100%)" }} />
      </div>

      <div className="relative z-10 w-full max-w-[440px] mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <img 
            src="/airvault-logo.png"
            alt="AirVault"
            className="h-20 w-auto mx-auto mb-4 brightness-0 invert"
          />
        </div>

        <div
          className="rounded-[24px] p-8 shadow-2xl"
          style={{
            background: "rgba(15,23,42,0.55)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(55,65,81,0.45)",
            boxShadow: "0 8px 48px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)",
          }}
        >
          <div className="text-center mb-7">
            <h1 className="text-[22px] font-extrabold tracking-tight text-white">Welcome Back</h1>
            <p className="text-[13px] mt-1.5" style={{ color: "#94A3B8" }}>Login to continue to AIRVAULT</p>
          </div>

          {error && (
            <div className="flex items-start gap-3 p-3.5 rounded-xl mb-5" style={{ background: "rgba(220,38,38,0.12)", border: "1px solid rgba(220,38,38,0.25)" }}>
              <AlertCircle size={16} className="text-[#EF4444] mt-0.5 flex-shrink-0" />
              <p className="text-[13px] text-[#FCA5A5] leading-relaxed">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-5">
              <label htmlFor="username" className="block text-[12px] font-semibold mb-2 tracking-wide" style={{ color: "#CBD5E1" }}>
                Username
              </label>
              <div
                className="relative rounded-xl overflow-hidden transition-all duration-300"
                style={{
                  background: "rgba(30,41,59,0.5)",
                  border: focusedField === "username" ? "1.5px solid rgba(59,130,246,0.5)" : "1.5px solid rgba(55,65,81,0.5)",
                  boxShadow: focusedField === "username" ? "0 0 0 3px rgba(59,130,246,0.1)" : "none",
                }}
              >
                <div className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: focusedField === "username" ? "#60A5FA" : "#64748B" }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <input
                  ref={usernameRef}
                  id="username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setFocusedField("username")}
                  onBlur={() => setFocusedField(null)}
                  className="w-full h-12 pl-12 pr-4 bg-transparent text-[14px] outline-none text-white placeholder:text-[#475569]"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            <div className="mb-5">
              <label htmlFor="password" className="block text-[12px] font-semibold mb-2 tracking-wide" style={{ color: "#CBD5E1" }}>
                Password
              </label>
              <div
                className="relative rounded-xl overflow-hidden transition-all duration-300"
                style={{
                  background: "rgba(30,41,59,0.5)",
                  border: focusedField === "password" ? "1.5px solid rgba(59,130,246,0.5)" : "1.5px solid rgba(55,65,81,0.5)",
                  boxShadow: focusedField === "password" ? "0 0 0 3px rgba(59,130,246,0.1)" : "none",
                }}
              >
                <div className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: focusedField === "password" ? "#60A5FA" : "#64748B" }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  className="w-full h-12 pl-12 pr-12 bg-transparent text-[14px] outline-none text-white placeholder:text-[#475569]"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer transition-colors"
                  style={{ color: "#64748B" }}
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onMouseEnter={(e) => e.currentTarget.style.color = "#60A5FA"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "#64748B"}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mb-7">
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    className={`w-[18px] h-[18px] rounded-md border-2 flex items-center justify-center transition-all duration-200 ${rememberMe ? "border-transparent" : "border-[#475569]"}`}
                    style={{ background: rememberMe ? "linear-gradient(135deg, #3B82F6, #2563EB)" : "rgba(30,41,59,0.5)" }}
                  >
                    {rememberMe && (
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-[12px] select-none" style={{ color: "#94A3B8" }}>Remember Me</span>
              </label>
              <Link
                href="/uld-message-builder/forgot-password"
                className="text-[12px] font-semibold transition-colors"
                style={{ color: "#60A5FA" }}
                onMouseEnter={(e) => e.currentTarget.style.color = "#93C5FD"}
                onMouseLeave={(e) => e.currentTarget.style.color = "#60A5FA"}
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 rounded-xl text-[15px] font-bold text-white cursor-pointer transition-all duration-300 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
              style={{
                background: isSubmitting ? "linear-gradient(135deg, #1D4ED8, #1E40AF)" : "linear-gradient(135deg, #3B82F6, #2563EB)",
                boxShadow: "0 6px 24px rgba(37,99,235,0.35)",
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "0 10px 32px rgba(37,99,235,0.5)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 6px 24px rgba(37,99,235,0.35)";
              }}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Login"
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 flex flex-col gap-2" style={{ borderTop: "1px solid rgba(55,65,81,0.4)" }}>
            <Link
              href="/uld-message-builder/register"
              className="w-full h-10 rounded-xl text-[13px] font-semibold flex items-center justify-center cursor-pointer transition-all duration-200"
              style={{
                color: "#CBD5E1",
                background: "rgba(30,41,59,0.4)",
                border: "1px solid rgba(55,65,81,0.4)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(30,41,59,0.7)";
                e.currentTarget.style.borderColor = "rgba(59,130,246,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(30,41,59,0.4)";
                e.currentTarget.style.borderColor = "rgba(55,65,81,0.4)";
              }}
            >
              Create an Account
            </Link>
            <Link
              href="/uld-message-builder/no-access"
              className="w-full text-center text-[12px] transition-colors py-1.5"
              style={{ color: "#64748B" }}
              onMouseEnter={(e) => e.currentTarget.style.color = "#60A5FA"}
              onMouseLeave={(e) => e.currentTarget.style.color = "#64748B"}
            >
              Need help? Contact Support
            </Link>
          </div>
        </div>

        <p className="text-center text-[11px] mt-6" style={{ color: "rgba(100,116,139,0.6)" }}>
          AirVault &mdash; Smart Air Cargo Operations Platform
        </p>
      </div>
    </div>
  );
}