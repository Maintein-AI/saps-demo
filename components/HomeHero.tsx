"use client";

import { useState, useEffect } from "react";

export default function HomeHero() {
  const [time, setTime] = useState("");
  const [greeting, setGreeting] = useState("Good morning");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const h = now.getHours();
      setTime(
        now.toLocaleTimeString("en-PK", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
      setGreeting(
        h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening"
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="h-[160px] w-full flex items-center px-4 lg:px-8"
      style={{
        background: "linear-gradient(135deg, #0B2545 0%, #1B4F8B 100%)",
      }}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-4">
        <div>
          <p className="text-white text-[28px] font-bold leading-[36px]">
            {greeting}, Faisal
          </p>
          <p className="text-white/70 text-[14px] font-medium mt-1">
            Warehouse Manager
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="text-white text-[20px] font-bold tabular-nums">
            {time}
          </div>
          <div className="h-7 px-3 rounded-full bg-[#16A34A]/20 text-[#16A34A] border border-[#16A34A]/30 text-[12px] font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
            KHI · Operations ACTIVE
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-md text-[11px] font-bold bg-[#16A34A]/20 text-[#16A34A] border border-[#16A34A]/30">
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#16A34A] text-white text-[9px] font-bold">
                +
              </span>
              inc.
            </span>
            <span className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-md text-[11px] font-bold bg-[#DC2626]/20 text-[#DC2626] border border-[#DC2626]/30">
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#DC2626] text-white text-[9px] font-bold">
                -
              </span>
              exc
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}