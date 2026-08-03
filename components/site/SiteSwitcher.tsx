"use client";

/**
 * P0-2 · Site switcher.
 *
 * Sits in the app header on every route. Shows the active site, its
 * offline-capability and sync state (FC-12 platform layer), and lets an
 * HQ user drop into the cross-site view.
 */

import { useEffect, useRef, useState } from "react";
import { Building2, Check, ChevronDown, CloudOff, RefreshCw } from "lucide-react";
import { useSite } from "./SiteContext";
import { HQ, formatDateTime } from "@/lib/domain";

function syncTone(pendingOutbox: number) {
  if (pendingOutbox === 0) return { colour: "#16A34A", label: "In sync" };
  if (pendingOutbox < 10) return { colour: "#D97706", label: `${pendingOutbox} pending` };
  return { colour: "#DC2626", label: `${pendingOutbox} pending` };
}

export default function SiteSwitcher() {
  const { scope, setScope, site, isHq, sites } = useSite();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const label = isHq ? "HQ — All sites" : (site?.code ?? "");
  const sub = isHq ? HQ.city : (site?.city ?? "");

  return (
    <div className="relative" ref={ref} data-dropdown>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 h-9 pl-2.5 pr-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <Building2 size={16} className="text-white/70" />
        <div className="text-left hidden sm:block leading-tight">
          <p className="text-[12px] font-semibold text-white">{label}</p>
          <p className="text-[10px] text-white/55">{sub}</p>
        </div>
        <span className="sm:hidden text-[12px] font-semibold text-white">{label}</span>
        <ChevronDown size={14} className="text-white/60" />
      </button>

      {open && (
        <div
          className="absolute top-full right-0 mt-2 w-[300px] bg-white rounded-xl shadow-lg border border-[#E2E8F0] overflow-hidden z-50"
          role="listbox"
          data-dropdown
        >
          <div className="px-4 py-2.5 border-b border-[#E2E8F0]">
            <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Site</p>
          </div>

          {sites.map((s) => {
            const tone = syncTone(s.pendingOutbox);
            const active = scope === s.code;
            return (
              <button
                key={s.code}
                role="option"
                aria-selected={active}
                onClick={() => {
                  setScope(s.code);
                  setOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 hover:bg-[#F8FAFC] transition-colors cursor-pointer border-b border-[#F1F5F9] last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 text-[13px] font-bold text-[#0F172A]">{s.code}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-[#0F172A] truncate">{s.city}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: tone.colour }}
                      />
                      <span className="text-[11px] text-[#64748B]">{tone.label}</span>
                      {s.offlineCapable && (
                        <span
                          className="inline-flex items-center gap-1 text-[10px] text-[#94A3B8]"
                          title="Site node runs offline-capable (FC-12)"
                        >
                          <CloudOff size={10} /> offline-capable
                        </span>
                      )}
                    </div>
                  </div>
                  {active && <Check size={15} className="text-[#1B4F8B] flex-shrink-0" />}
                </div>
                <p className="text-[10px] text-[#94A3B8] mt-1 pl-12">
                  Last sync {formatDateTime(s.lastSyncAt)}
                </p>
              </button>
            );
          })}

          <div className="px-4 py-2.5 border-t border-[#E2E8F0] bg-[#F8FAFC]">
            <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
              Headquarters
            </p>
          </div>
          <button
            role="option"
            aria-selected={isHq}
            onClick={() => {
              setScope("HQ");
              setOpen(false);
            }}
            className="w-full text-left px-4 py-2.5 hover:bg-[#F8FAFC] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <RefreshCw size={15} className="text-[#1B4F8B] flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-[#0F172A]">{HQ.name}</p>
                <p className="text-[11px] text-[#64748B]">Cross-site oversight — all sites</p>
              </div>
              {isHq && <Check size={15} className="text-[#1B4F8B] flex-shrink-0" />}
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
