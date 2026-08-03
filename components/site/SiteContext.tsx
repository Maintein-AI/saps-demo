"use client";

/**
 * P0-2 · Site & HQ context.
 *
 * FC-12 platform amendment:
 *   "Per-site node (KHI / LHE / PEW) — local MySQL, offline-capable, runs M01–M20"
 *   "Islamabad HQ — cross-site oversight, RBAC control, backups; CDC / outbox sync"
 *
 * Multi-site is not new — CMTS already carries `CityId` on ~30 tables and
 * `Comp_Code` / `Off_Code` on ~20. What AirVault adds is the HQ tier, which
 * is what "HQ" scope means here: all sites at once.
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { SITES, type Site, type SiteCode, type SiteScope } from "@/lib/domain";

const STORAGE_KEY = "airvault.site-scope";

interface SiteContextValue {
  /** Active scope — a site code, or "HQ" for the cross-site view. */
  scope: SiteScope;
  setScope: (s: SiteScope) => void;
  /** The active site record; null in HQ mode. */
  site: Site | null;
  isHq: boolean;
  sites: Site[];
  /** True once the persisted scope has been read — avoids a hydration flash. */
  ready: boolean;
}

const SiteCtx = createContext<SiteContextValue | null>(null);

export function SiteProvider({ children }: { children: React.ReactNode }) {
  // Always start at the same scope on server and client; the persisted value
  // is applied after mount so the two renders agree.
  const [scope, setScopeState] = useState<SiteScope>("KHI");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === "HQ" || SITES.some((s) => s.code === saved)) {
        setScopeState(saved as SiteScope);
      }
    } catch {
      // Private mode / storage disabled — the default scope is fine.
    }
    setReady(true);
  }, []);

  const setScope = useCallback((s: SiteScope) => {
    setScopeState(s);
    try {
      window.localStorage.setItem(STORAGE_KEY, s);
    } catch {
      // Non-fatal — selection just will not survive a reload.
    }
  }, []);

  const value = useMemo<SiteContextValue>(
    () => ({
      scope,
      setScope,
      site: scope === "HQ" ? null : (SITES.find((s) => s.code === scope) ?? null),
      isHq: scope === "HQ",
      sites: SITES,
      ready,
    }),
    [scope, setScope, ready],
  );

  return <SiteCtx.Provider value={value}>{children}</SiteCtx.Provider>;
}

export function useSite(): SiteContextValue {
  const ctx = useContext(SiteCtx);
  if (!ctx) {
    throw new Error("useSite must be used inside <SiteProvider>");
  }
  return ctx;
}

/** Convenience for list screens: the scope to pass to `lib/domain` queries. */
export function useSiteScope(): SiteScope {
  return useSite().scope;
}

export type { SiteCode, SiteScope };
