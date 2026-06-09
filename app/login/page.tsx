"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ShieldCheck, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
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
      className="flex min-h-screen items-center justify-center p-4"
      style={{ background: "linear-gradient(135deg, #0B2545 0%, #13315C 100%)" }}
    >
      <div className="w-full max-w-[400px] rounded-[20px] bg-white p-8 shadow-2xl">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0B2545]">
            <ShieldCheck size={28} className="text-white" />
          </div>
          <h1 className="text-[20px] font-bold text-[#0F172A]">Restricted Access</h1>
          <p className="mt-1 text-[13px] text-[#64748B]">
            Sign in to view this project.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-[#334155]">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              autoFocus
              required
              className="h-11 rounded-xl border border-[#E2E8F0] px-3.5 text-[14px] text-[#0F172A] outline-none transition-colors focus:border-[#1B4F8B] focus:ring-2 focus:ring-[#1B4F8B]/20"
              placeholder="Enter your username"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-[#334155]">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              className="h-11 rounded-xl border border-[#E2E8F0] px-3.5 text-[14px] text-[#0F172A] outline-none transition-colors focus:border-[#1B4F8B] focus:ring-2 focus:ring-[#1B4F8B]/20"
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <div className="rounded-xl bg-[#FEF2F2] px-3.5 py-2.5 text-[12px] font-medium text-[#DC2626]">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-1 flex h-11 items-center justify-center gap-2 rounded-xl bg-[#0B2545] text-[14px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Signing in…
              </>
            ) : (
              <>
                <Lock size={16} />
                Sign in
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
