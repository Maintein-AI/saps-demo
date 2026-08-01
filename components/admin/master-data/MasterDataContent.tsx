"use client";

import { useState, useEffect } from "react";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import ErrorState from "@/components/ErrorState";
import EmptyState from "@/components/EmptyState";
import { useToast } from "@/components/ToastContext";
import { Plus, Edit3, Eye, Ban, History, Search, Check } from "lucide-react";

interface LookupItem {
  code: string;
  name: string;
  status: "Active" | "Disabled";
}

interface LookupGroup {
  key: string;
  label: string;
  items: LookupItem[];
}

const lookupGroups: LookupGroup[] = [
  {
    key: "airlines",
    label: "Airlines",
    items: [
      { code: "EK", name: "Emirates", status: "Active" },
      { code: "EY", name: "Etihad Airways", status: "Active" },
      { code: "QR", name: "Qatar Airways", status: "Active" },
      { code: "SV", name: "Saudia", status: "Active" },
      { code: "PA", name: "Airblue", status: "Active" },
      { code: "PK", name: "PIA — Pakistan International Airlines", status: "Active" },
      { code: "ER", name: "Serene Air", status: "Active" },
      { code: "TK", name: "Turkish Airlines", status: "Active" },
      { code: "GF", name: "Gulf Air", status: "Disabled" },
      { code: "WY", name: "Oman Air", status: "Active" },
    ],
  },
  {
    key: "airports",
    label: "Airports",
    items: [
      { code: "KHI", name: "Jinnah International — Karachi", status: "Active" },
      { code: "LHE", name: "Allama Iqbal — Lahore", status: "Active" },
      { code: "ISB", name: "Islamabad International", status: "Active" },
      { code: "PEW", name: "Bacha Khan — Peshawar", status: "Active" },
      { code: "MUX", name: "Multan International", status: "Active" },
      { code: "UET", name: "Quetta International", status: "Active" },
      { code: "DXB", name: "Dubai International", status: "Active" },
      { code: "AUH", name: "Abu Dhabi International", status: "Active" },
      { code: "DOH", name: "Hamad International — Doha", status: "Active" },
    ],
  },
  {
    key: "origin_dest",
    label: "Origin / Destination Pairs",
    items: [
      { code: "DXB-KHI", name: "Dubai → Karachi", status: "Active" },
      { code: "AUH-LHE", name: "Abu Dhabi → Lahore", status: "Active" },
      { code: "DOH-ISB", name: "Doha → Islamabad", status: "Active" },
      { code: "JED-KHI", name: "Jeddah → Karachi", status: "Active" },
      { code: "IST-LHE", name: "Istanbul → Lahore", status: "Active" },
      { code: "KWI-PEW", name: "Kuwait → Peshawar", status: "Active" },
    ],
  },
  {
    key: "cargo_classes",
    label: "Cargo Classes",
    items: [
      { code: "GCR", name: "General Cargo Rate", status: "Active" },
      { code: "ICG", name: "Integrated Cargo", status: "Active" },
      { code: "AFU", name: "Air Freight Unit", status: "Active" },
      { code: "UAB", name: "Unaccompanied Baggage", status: "Active" },
      { code: "DGR", name: "Dangerous Goods", status: "Active" },
      { code: "VAL", name: "Valuable Cargo", status: "Active" },
      { code: "HUM", name: "Human Remains", status: "Active" },
      { code: "DIP", name: "Diplomatic Mail", status: "Active" },
      { code: "PER", name: "Perishable Cargo", status: "Active" },
      { code: "AOG", name: "Aircraft on Ground", status: "Active" },
      { code: "VUN", name: "Vulnerable Cargo", status: "Active" },
      { code: "AVI", name: "Live Animals", status: "Active" },
    ],
  },
  {
    key: "handling_codes",
    label: "Handling Codes",
    items: [
      { code: "SPH", name: "Special Handling", status: "Active" },
      { code: "COL", name: "Cool / Cold Storage", status: "Active" },
      { code: "HEA", name: "Heavy Cargo", status: "Active" },
      { code: "PEF", name: "Perishable — Frozen", status: "Active" },
      { code: "PEM", name: "Perishable — Meat", status: "Active" },
      { code: "PIL", name: "Pharmaceuticals", status: "Active" },
    ],
  },
  {
    key: "charge_types",
    label: "Charge Types",
    items: [
      { code: "AWB_FEE", name: "Air Waybill Fee", status: "Active" },
      { code: "SCREENING", name: "Security Screening", status: "Active" },
      { code: "STORAGE", name: "Storage Charge", status: "Active" },
      { code: "COLD_STORAGE", name: "Cold Storage Surcharge", status: "Active" },
      { code: "DO_FEE", name: "Delivery Order Fee", status: "Active" },
      { code: "GATE_PASS", name: "Gate Pass Fee", status: "Active" },
      { code: "DEMURRAGE", name: "Demurrage", status: "Active" },
    ],
  },
  {
    key: "tariff_slabs",
    label: "Tariff Slabs",
    items: [
      { code: "GCR_0_45", name: "GCR 0–45 kg", status: "Active" },
      { code: "GCR_45_100", name: "GCR 45–100 kg", status: "Active" },
      { code: "GCR_100_300", name: "GCR 100–300 kg", status: "Active" },
      { code: "GCR_300_500", name: "GCR 300–500 kg", status: "Active" },
      { code: "GCR_500_PLUS", name: "GCR 500+ kg", status: "Active" },
    ],
  },
  {
    key: "cities",
    label: "Cities",
    items: [
      { code: "KHI", name: "Karachi", status: "Active" },
      { code: "LHE", name: "Lahore", status: "Active" },
      { code: "ISB", name: "Islamabad", status: "Active" },
      { code: "PEW", name: "Peshawar", status: "Active" },
      { code: "MUX", name: "Multan", status: "Active" },
      { code: "UET", name: "Quetta", status: "Active" },
      { code: "GWD", name: "Gwadar", status: "Active" },
    ],
  },
  {
    key: "countries",
    label: "Countries",
    items: [
      { code: "PK", name: "Pakistan", status: "Active" },
      { code: "AE", name: "United Arab Emirates", status: "Active" },
      { code: "SA", name: "Saudi Arabia", status: "Active" },
      { code: "QA", name: "Qatar", status: "Active" },
      { code: "TR", name: "Turkey", status: "Active" },
      { code: "KW", name: "Kuwait", status: "Active" },
      { code: "OM", name: "Oman", status: "Active" },
    ],
  },
  {
    key: "departments",
    label: "Departments",
    items: [
      { code: "OPS", name: "Operations", status: "Active" },
      { code: "FIN", name: "Finance", status: "Active" },
      { code: "HR", name: "Human Resources", status: "Active" },
      { code: "IT", name: "Information Technology", status: "Active" },
      { code: "CHA", name: "Customs Handling Agent", status: "Active" },
      { code: "GSE", name: "Ground Support Equipment", status: "Active" },
    ],
  },
  {
    key: "designations",
    label: "Designations",
    items: [
      { code: "WM", name: "Warehouse Manager", status: "Active" },
      { code: "LO", name: "Lifter Operator", status: "Active" },
      { code: "GE", name: "Gate Entry Officer", status: "Active" },
      { code: "FM", name: "Finance Manager", status: "Active" },
      { code: "PL", name: "Planner", status: "Active" },
      { code: "OS", name: "Operations Supervisor", status: "Active" },
      { code: "FA", name: "Forwarding Agent", status: "Active" },
      { code: "CO", name: "Consignee", status: "Active" },
    ],
  },
  {
    key: "channels",
    label: "Channels",
    items: [
      { code: "GREEN", name: "Green Channel", status: "Active" },
      { code: "YELLOW", name: "Yellow Channel", status: "Active" },
      { code: "RED", name: "Red Channel", status: "Active" },
    ],
  },
  {
    key: "banks",
    label: "Banks",
    items: [
      { code: "HBL", name: "Habib Bank Limited", status: "Active" },
      { code: "MEZ", name: "Meezan Bank", status: "Active" },
      { code: "NIFT", name: "NIFT", status: "Active" },
      { code: "UBL", name: "United Bank Limited", status: "Active" },
      { code: "BAF", name: "Bank Alfalah", status: "Active" },
      { code: "SCB", name: "Standard Chartered", status: "Active" },
    ],
  },
];

const statusColors: Record<string, { bg: string; text: string; dot: string }> = {
  Active: { bg: "#DCFCE7", text: "#16A34A", dot: "#16A34A" },
  Disabled: { bg: "#F1F5F9", text: "#64748B", dot: "#94A3B8" },
};

export default function MasterDataContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [showError, setShowError] = useState(false);
  const [activeGroup, setActiveGroup] = useState("airlines");
  const [data, setData] = useState(lookupGroups);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCode, setNewCode] = useState("");
  const [newName, setNewName] = useState("");
  const [editItem, setEditItem] = useState<{ groupKey: string; code: string } | null>(null);
  const [editName, setEditName] = useState("");
  const { addToast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const activeData = data.find((g) => g.key === activeGroup) || data[0];
  const filteredItems = activeData.items.filter((item) => {
    if (!searchTerm) return true;
    const s = searchTerm.toLowerCase();
    return item.code.toLowerCase().includes(s) || item.name.toLowerCase().includes(s);
  });

  const handleAdd = () => {
    if (!newCode.trim() || !newName.trim()) return;
    setData((prev) =>
      prev.map((g) => {
        if (g.key !== activeGroup) return g;
        return { ...g, items: [...g.items, { code: newCode.trim().toUpperCase(), name: newName.trim(), status: "Active" as const }] };
      })
    );
    addToast(`"${newName.trim()}" added to ${activeData.label}`, "success");
    setNewCode("");
    setNewName("");
    setShowAddForm(false);
  };

  const handleEdit = () => {
    if (!editItem || !editName.trim()) return;
    setData((prev) =>
      prev.map((g) => {
        if (g.key !== editItem.groupKey) return g;
        return {
          ...g,
          items: g.items.map((item) =>
            item.code === editItem.code ? { ...item, name: editName.trim() } : item
          ),
        };
      })
    );
    addToast("Item updated", "success");
    setEditItem(null);
    setEditName("");
  };

  const handleToggleStatus = (code: string) => {
    setData((prev) =>
      prev.map((g) => {
        if (g.key !== activeGroup) return g;
        return {
          ...g,
          items: g.items.map((item) =>
            item.code === code
              ? { ...item, status: item.status === "Active" ? ("Disabled" as const) : ("Active" as const) }
              : item
          ),
        };
      })
    );
    addToast("Status toggled", "success");
  };

  const handleViewAudit = (code: string) => {
    addToast(`Audit trail for ${code} — last modified by Fatima Rizvi at 09:28 AM`, "success");
  };

  if (showError) {
    return (
      <ErrorState title="Unable to load master data" message="Master data could not be fetched. Please retry." onRetry={() => { setShowError(false); setIsLoading(true); setTimeout(() => setIsLoading(false), 800); }} />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-1.5">
        {data.map((group) => (
          <button
            key={group.key}
            onClick={() => { setActiveGroup(group.key); setSearchTerm(""); setShowAddForm(false); }}
            className="h-8 px-3 rounded-lg text-[12px] font-semibold border cursor-pointer transition-colors whitespace-nowrap"
            style={{
              backgroundColor: activeGroup === group.key ? "#0B2545" : "white",
              color: activeGroup === group.key ? "white" : "#64748B",
              borderColor: activeGroup === group.key ? "#0B2545" : "#E2E8F0",
            }}
          >
            {group.label}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-[360px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`Search ${activeData.label}...`}
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-[#E2E8F0] bg-white text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors"
          />
        </div>
        <button onClick={() => setShowAddForm(true)} className="flex items-center gap-1.5 h-9 px-4 rounded-xl text-[12px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90 whitespace-nowrap" style={{ backgroundColor: "#0B2545" }}>
          <Plus size={14} /> Add {activeData.label.slice(0, -1)}
        </button>
      </div>

      {isLoading ? (
        <LoadingSkeleton rows={8} columns={4} />
      ) : filteredItems.length === 0 ? (
        <EmptyState title={`No ${activeData.label} found`} description="Try adjusting your search or add a new entry." actionLabel="Add New" onAction={() => setShowAddForm(true)} />
      ) : (
        <div className="rounded-xl border border-[#E2E8F0] bg-white overflow-hidden shadow-sm">
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: "#0B2545" }}>
                <th className="text-left text-[11px] font-bold uppercase tracking-wider text-white px-4 py-3">Code</th>
                <th className="text-left text-[11px] font-bold uppercase tracking-wider text-white px-4 py-3">Name</th>
                <th className="text-left text-[11px] font-bold uppercase tracking-wider text-white px-4 py-3">Status</th>
                <th className="text-right text-[11px] font-bold uppercase tracking-wider text-white px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item, idx) => {
                const sc = statusColors[item.status];
                return (
                  <tr key={item.code} className="border-b border-[#E2E8F0] last:border-b-0 transition-colors hover:bg-[#F8FAFC]" style={{ backgroundColor: idx % 2 === 1 ? "#F8FAFC" : "white" }}>
                    <td className="px-4 py-3 text-[13px] font-semibold text-[#1B4F8B]">{item.code}</td>
                    <td className="px-4 py-3">
                      {editItem?.code === item.code && editItem?.groupKey === activeGroup ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="h-9 px-3 rounded-xl border border-[#1B4F8B] bg-white text-[13px] text-[#0F172A] outline-none flex-1"
                            autoFocus
                          />
                          <button onClick={handleEdit} className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#16A34A] text-white cursor-pointer">
                            <Check size={14} />
                          </button>
                          <button onClick={() => setEditItem(null)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#F1F5F9] text-[#64748B] cursor-pointer">×</button>
                        </div>
                      ) : (
                        <span className="text-[13px] text-[#0F172A]">{item.name}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full text-[11px] font-semibold" style={{ backgroundColor: sc.bg, color: sc.text }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: sc.dot }} />
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => { setEditItem({ groupKey: activeGroup, code: item.code }); setEditName(item.name); }} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#DBEAFE] text-[#1B4F8B] cursor-pointer transition-colors" title="Edit">
                          <Edit3 size={13} />
                        </button>
                        <button onClick={() => handleToggleStatus(item.code)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F1F5F9] text-[#64748B] cursor-pointer transition-colors" title={item.status === "Active" ? "Disable" : "Enable"}>
                          <Ban size={13} />
                        </button>
                        <button onClick={() => handleViewAudit(item.code)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#FEF3C7] text-[#D97706] cursor-pointer transition-colors" title="View Audit Trail">
                          <History size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {showAddForm && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50" onClick={() => setShowAddForm(false)}>
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-[400px]" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-[16px] font-bold text-[#0F172A] mb-4">Add {activeData.label.slice(0, -1)}</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">Code</label>
                <input type="text" value={newCode} onChange={(e) => setNewCode(e.target.value)} placeholder="e.g. ABC" className="w-full h-10 px-3 rounded-xl border border-[#E2E8F0] bg-white text-[13px] outline-none focus:border-[#1B4F8B] transition-colors" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">Name</label>
                <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Full name" className="w-full h-10 px-3 rounded-xl border border-[#E2E8F0] bg-white text-[13px] outline-none focus:border-[#1B4F8B] transition-colors" />
              </div>
            </div>
            <div className="flex items-center gap-3 justify-end mt-4">
              <button onClick={() => setShowAddForm(false)} className="h-9 px-4 rounded-xl text-[13px] font-semibold text-[#64748B] border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] cursor-pointer transition-colors whitespace-nowrap">Cancel</button>
              <button onClick={handleAdd} className="h-9 px-5 rounded-xl text-[13px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90 whitespace-nowrap" style={{ backgroundColor: "#0B2545" }}>Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}