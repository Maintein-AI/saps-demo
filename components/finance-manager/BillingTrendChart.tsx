"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import ScopeBadge from "@/components/ScopeBadge";

const data = [
  { date: "25 May", billed: 1800000, collected: 1500000 },
  { date: "26 May", billed: 2100000, collected: 1900000 },
  { date: "27 May", billed: 1950000, collected: 1700000 },
  { date: "28 May", billed: 2300000, collected: 2050000 },
  { date: "29 May", billed: 2200000, collected: 1800000 },
  { date: "30 May", billed: 2400000, collected: 2100000 },
  { date: "31 May", billed: 2470000, collected: 1890000 },
];

function formatPKR(value: number) {
  if (value >= 1_000_000) return `Rs. ${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `Rs. ${(value / 1_000).toFixed(0)}K`;
  return `Rs. ${value}`;
}

export default function BillingTrendChart() {
  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2.5">
          <h2 className="text-[15px] font-bold text-[#0F172A]">Billing Trend</h2>
          <ScopeBadge type="inc" />
        </div>
        <span className="text-[12px] text-[#64748B]">Last 7 days</span>
      </div>
      <div className="p-5">
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorBilled" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1B4F8B" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#1B4F8B" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorCollected" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16A34A" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#16A34A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12, fill: "#64748B" }}
                axisLine={{ stroke: "#E2E8F0" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#64748B" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={formatPKR}
                width={80}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #E2E8F0",
                  borderRadius: 12,
                  fontSize: 12,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
                formatter={(value: any) => [formatPKR(Number(value)), ""]}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: 12, paddingBottom: 8 }}
              />
              <Area
                type="monotone"
                dataKey="billed"
                name="Billed"
                stroke="#1B4F8B"
                strokeWidth={2}
                fill="url(#colorBilled)"
                dot={{ r: 3, fill: "#1B4F8B", strokeWidth: 0 }}
                activeDot={{ r: 5, fill: "#1B4F8B" }}
              />
              <Area
                type="monotone"
                dataKey="collected"
                name="Collected"
                stroke="#16A34A"
                strokeWidth={2}
                fill="url(#colorCollected)"
                dot={{ r: 3, fill: "#16A34A", strokeWidth: 0 }}
                activeDot={{ r: 5, fill: "#16A34A" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}