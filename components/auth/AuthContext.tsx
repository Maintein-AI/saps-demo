"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";

export type AuthState = "guest" | "authenticated" | "locked" | "disabled" | "session_expired" | "permission_denied";

export type UserRole = "Message Builder User" | "Message Reviewer" | "Operations Administrator" | "Read-only User";

export interface User {
  username: string;
  fullName: string;
  email: string;
  mobile: string;
  station: string;
  substation: string;
  organization: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  authState: AuthState;
  login: (username: string, password: string) => Promise<{ success: boolean; reason?: string }>;
  logout: () => void;
  register: (data: RegistrationData) => Promise<{ success: boolean }>;
  requestAccess: () => void;
  setAuthState: (state: AuthState) => void;
}

export interface RegistrationData {
  fullName: string;
  username: string;
  email: string;
  mobile: string;
  station: string;
  substation: string;
  organization: string;
  role: UserRole;
  password: string;
  confirmPassword: string;
  termsAccepted: boolean;
}

const MOCK_USERS: Record<string, { password: string; user: User }> = {
  "opsadmin": {
    password: "AirVault2026!",
    user: {
      username: "opsadmin",
      fullName: "Ahmed Shaikh",
      email: "ahmed@shaheen-airport.com",
      mobile: "+92 300 1234567",
      station: "LHE",
      substation: "LAHORE",
      organization: "Shaheen Airport Services",
      role: "Operations Administrator",
    },
  },
  "builder1": {
    password: "Builder2026!",
    user: {
      username: "builder1",
      fullName: "Sarah Khan",
      email: "sarah@airvault.com",
      mobile: "+92 321 9876543",
      station: "KHI",
      substation: "KARACHI",
      organization: "AirVault Logistics",
      role: "Message Builder User",
    },
  },
  "reviewer1": {
    password: "Review2026!",
    user: {
      username: "reviewer1",
      fullName: "Bilal Mahmood",
      email: "bilal@airvault.com",
      mobile: "+92 333 4567890",
      station: "ISB",
      substation: "ISLAMABAD",
      organization: "AirVault Logistics",
      role: "Message Reviewer",
    },
  },
};

const AuthContext = createContext<AuthContextType | null>(null);

// Demo-mode default user — keeps the prototype navigable without forcing sign-in.
// The ULD sign-in / register / no-access screens still work when navigated to directly,
// so the auth UX is available for review but not enforced for the demo.
const DEMO_DEFAULT_USER: User = {
  username: "demo",
  fullName: "SAPS Demo User",
  email: "demo@shaheen-airport.com",
  mobile: "+92 300 0000000",
  station: "KHI",
  substation: "KARACHI",
  organization: "Shaheen Airport Services",
  role: "Operations Administrator",
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(DEMO_DEFAULT_USER);
  const [authState, setAuthState] = useState<AuthState>("authenticated");
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("airvault_auth");
      if (saved) {
        const parsed = JSON.parse(saved);
        setUser(parsed.user);
        setAuthState(parsed.authState || "authenticated");
      }
    } catch {}
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (!initialized) return;
    try {
      if (user && authState === "authenticated") {
        localStorage.setItem("airvault_auth", JSON.stringify({ user, authState }));
      } else if (!user || authState !== "authenticated") {
        localStorage.removeItem("airvault_auth");
      }
    } catch {}
  }, [user, authState, initialized]);

  const login = useCallback(async (username: string, password: string) => {
    await new Promise((r) => setTimeout(r, 800));

    if (username === "locked_user") {
      setAuthState("locked");
      setUser(null);
      return { success: false, reason: "locked" };
    }

    if (username === "disabled_user") {
      setAuthState("disabled");
      setUser(null);
      return { success: false, reason: "disabled" };
    }

    if (username === "no_perm_user") {
      setUser({
        username: "no_perm_user",
        fullName: "Guest Viewer",
        email: "guest@airvault.com",
        mobile: "+92 300 0000000",
        station: "LHE",
        substation: "LAHORE",
        organization: "External",
        role: "Read-only User",
      });
      setAuthState("permission_denied");
      return { success: false, reason: "permission_denied" };
    }

    const found = MOCK_USERS[username];
    if (!found || found.password !== password) {
      return { success: false, reason: "invalid" };
    }

    setUser(found.user);
    setAuthState("authenticated");
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setAuthState("guest");
    localStorage.removeItem("airvault_auth");
  }, []);

  const register = useCallback(async (data: RegistrationData) => {
    await new Promise((r) => setTimeout(r, 1000));
    return { success: true };
  }, []);

  const requestAccess = useCallback(() => {
    setAuthState("guest");
  }, []);

  const ctxSetAuthState = useCallback((state: AuthState) => {
    setAuthState(state);
    if (state !== "authenticated") {
      setUser(null);
      localStorage.removeItem("airvault_auth");
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        authState,
        login,
        logout,
        register,
        requestAccess,
        setAuthState: ctxSetAuthState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}