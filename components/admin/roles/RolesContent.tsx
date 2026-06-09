"use client";

import { useState, useEffect } from "react";
import ScopeBadge from "@/components/ScopeBadge";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import ErrorState from "@/components/ErrorState";
import EmptyState from "@/components/EmptyState";
import { useToast } from "@/components/ToastContext";
import { Plus, Copy, Save, GitCompare, Download, Check, X, Lock, Unlock } from "lucide-react";

const actions = ["View", "Create", "Update", "Delete", "Approve", "Export"];
const roles = [
  "warehouse_manager", "gate_entry", "lifter_operator", "excise_compliance",
  "finance_manager", "planner", "ops_supervisor", "fa_admin", "fa_user",
  "cha_admin", "cha_user", "consignee", "gse_manager", "hr_admin",
  "hr_user", "sys_admin", "auditor",
];

const modules = [
  "Warehouse Manager — Dashboard",
  "Warehouse Manager — AWB Detail",
  "Warehouse Manager — Putaway",
  "Warehouse Manager — Picking",
  "Warehouse Manager — Storage Map",
  "Warehouse Manager — Exceptions Queue",
  "Warehouse Manager — Cold Chain",
  "Gate Entry — Dashboard",
  "Gate Entry — Vehicle Entry",
  "Gate Entry — Vehicle Exit",
  "Gate Entry — Live Vehicle Board",
  "Gate Entry — Driver Identity Register",
  "Gate Entry — Authority Letter",
  "Lifter Operator — Tasks",
  "Lifter Operator — Task Detail",
  "Lifter Operator — RFID Scan",
  "Lifter Operator — Movement Log",
  "Lifter Operator — Lifter Status",
  "Excise / Compliance — Customs Queue",
  "Excise / Compliance — Channel Detail",
  "Excise / Compliance — OOC Capture",
  "Excise / Compliance — Hold Register",
  "Excise / Compliance — Section 82",
  "Excise / Compliance — Customs Messaging",
  "Finance Manager — Dashboard",
  "Finance Manager — Invoice Generation",
  "Finance Manager — Waiver Workflow",
  "Finance Manager — Payment Reconciliation",
  "Finance Manager — Tariff Editor",
  "Finance Manager — Multi-Tariff Engine",
  "Finance Manager — Payment Gateway Reconciliation",
  "Finance Manager — ERP Bridge",
  "Planner — Capacity Dashboard",
  "Planner — Slot Planner",
  "Planner — Resource Roster",
  "Planner — Demand Forecast",
  "Ops Supervisor — Live Ops",
  "Ops Supervisor — Performance Console",
  "Ops Supervisor — Escalation Inbox",
  "Ops Supervisor — Shift Handover",
  "Ops Supervisor — MoM Floor Notes",
  "Forwarding Agent — Dashboard",
  "Forwarding Agent — AWB Entry",
  "Forwarding Agent — Dispatch Documents",
  "Forwarding Agent — Driver Register",
  "Forwarding Agent — Vehicle Register",
  "Forwarding Agent — Payments",
  "Forwarding Agent — Pickup Scheduling",
  "Forwarding Agent — Notifications",
  "CHA — Dashboard",
  "CHA — GD Filing",
  "CHA — Channel Workflow",
  "CHA — OOC Tracking",
  "CHA — DO Collection",
  "CHA — Payments",
  "CHA — Re-export Long-Stay",
  "Consignee — Dashboard",
  "Consignee — My Shipments",
  "Consignee — Notice of Arrival",
  "Consignee — Pay & Download DO",
  "Consignee — Schedule Pickup",
  "Consignee — POD History",
  "ULD Message Builder — Dashboard",
  "ULD Message Builder — UCM",
  "ULD Message Builder — SCM",
  "ULD Message Builder — LUC",
  "ULD Message Builder — Search",
  "ULD Message Builder — Import ULDs",
  "ULD Message Builder — Message Log",
  "Admin — Dashboard",
  "Admin — Users",
  "Admin — Roles & Permissions",
  "Admin — Master Data Editor",
  "Admin — Integration Console",
  "Admin — System Settings",
  "Admin — Audit Trail",
  "Admin — Session & Event Log",
];

function generateDefaultMatrix(): Record<string, Record<string, boolean>> {
  const matrix: Record<string, Record<string, boolean>> = {};
  modules.forEach((mod) => {
    matrix[mod] = {};
    actions.forEach((act) => {
      matrix[mod][act] = false;
    });
  });

  modules.forEach((mod) => {
    if (mod.startsWith("Warehouse Manager")) {
      matrix[mod].View = true;
      if (!mod.includes("Dashboard") && !mod.includes("Storage Map")) {
        matrix[mod].Create = true;
        matrix[mod].Update = true;
      }
      if (mod.includes("Putaway") || mod.includes("Picking")) {
        matrix[mod].Export = true;
      }
    }
    if (mod.startsWith("Gate Entry")) {
      matrix[mod].View = true;
      if (mod.includes("Vehicle Entry") || mod.includes("Vehicle Exit")) {
        matrix[mod].Create = true;
        matrix[mod].Update = true;
      }
    }
    if (mod.startsWith("Lifter Operator")) {
      matrix[mod].View = true;
      matrix[mod].Create = mod.includes("RFID Scan");
      matrix[mod].Update = mod.includes("RFID Scan");
    }
    if (mod.startsWith("Excise / Compliance")) {
      matrix[mod].View = true;
      matrix[mod].Update = mod.includes("Hold Register");
      matrix[mod].Export = true;
    }
    if (mod.startsWith("Finance Manager")) {
      matrix[mod].View = true;
      if (mod.includes("Invoice") || mod.includes("Waiver")) {
        matrix[mod].Approve = true;
        matrix[mod].Export = true;
      }
      matrix[mod].Export = true;
    }
    if (mod.startsWith("Planner")) {
      matrix[mod].View = true;
      matrix[mod].Create = true;
      matrix[mod].Update = true;
    }
    if (mod.startsWith("Ops Supervisor")) {
      matrix[mod].View = true;
      matrix[mod].Approve = mod.includes("Escalation") || mod.includes("Handover");
      matrix[mod].Export = true;
    }
    if (mod.startsWith("Forwarding Agent")) {
      matrix[mod].View = true;
      matrix[mod].Create = mod.includes("AWB Entry") || mod.includes("Driver") || mod.includes("Vehicle");
      matrix[mod].Update = mod.includes("AWB Entry");
      matrix[mod].Export = mod.includes("Dashboard");
    }
    if (mod.startsWith("CHA")) {
      matrix[mod].View = true;
      matrix[mod].Create = mod.includes("GD Filing");
      matrix[mod].Export = true;
    }
    if (mod.startsWith("Consignee")) {
      matrix[mod].View = true;
      if (mod.includes("Pay") || mod.includes("Schedule")) {
        matrix[mod].Create = true;
      }
    }
    if (mod.startsWith("ULD Message Builder")) {
      matrix[mod].View = true;
      matrix[mod].Create = mod.includes("UCM") || mod.includes("SCM");
      matrix[mod].Export = mod.includes("Search") || mod.includes("Import");
    }
    if (mod.startsWith("Admin")) {
      matrix[mod].View = true;
      matrix[mod].Create = mod.includes("Users") || mod.includes("Roles");
      matrix[mod].Update = mod.includes("Users") || mod.includes("Roles") || mod.includes("Master") || mod.includes("Settings");
      matrix[mod].Delete = mod.includes("Users");
      matrix[mod].Export = mod.includes("Audit") || mod.includes("Session");
    }
  });

  return matrix;
}

export default function RolesContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [showError, setShowError] = useState(false);
  const [selectedRole, setSelectedRole] = useState("sys_admin");
  const [matrix, setMatrix] = useState<Record<string, Record<string, boolean>>>({});
  const [compareRole, setCompareRole] = useState<string | null>(null);
  const [compareMatrix, setCompareMatrix] = useState<Record<string, Record<string, boolean>>>({});
  const [showCreateRole, setShowCreateRole] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [allRoles, setAllRoles] = useState([...roles]);
  const [editing, setEditing] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setMatrix(generateDefaultMatrix());
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setMatrix(generateDefaultMatrix());
  }, [selectedRole]);

  const togglePermission = (module: string, action: string) => {
    if (!editing) return;
    setMatrix((prev) => ({
      ...prev,
      [module]: {
        ...prev[module],
        [action]: !prev[module][action],
      },
    }));
  };

  const handleSave = () => {
    setEditing(false);
    addToast("Permissions saved successfully", "success");
  };

  const handleCreateRole = () => {
    if (!newRoleName.trim()) return;
    const slug = newRoleName.toLowerCase().replace(/\s+/g, "_");
    setAllRoles((prev) => [...prev, slug]);
    setSelectedRole(slug);
    setMatrix(generateDefaultMatrix());
    setShowCreateRole(false);
    setNewRoleName("");
    setEditing(true);
    addToast(`Role "${newRoleName}" created`, "success");
  };

  const handleCloneRole = () => {
    const clonedName = selectedRole + "_clone";
    setAllRoles((prev) => [...prev, clonedName]);
    setSelectedRole(clonedName);
    addToast(`Role "${selectedRole}" cloned as "${clonedName}"`, "success");
  };

  const handleCompare = () => {
    if (compareRole) {
      setCompareMatrix(generateDefaultMatrix());
      addToast(`Comparing "${selectedRole}" with "${compareRole}"`, "success");
    }
  };

  const allCheck = (action: string) => {
    if (!editing) return;
    const newVal = !(matrix[Object.keys(matrix)[0]]?.[action] ?? false);
    setMatrix((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((mod) => {
        next[mod] = { ...next[mod], [action]: newVal };
      });
      return next;
    });
  };

  const allRowCheck = (module: string) => {
    if (!editing) return;
    const newVal = !(matrix[module]?.View ?? false);
    setMatrix((prev) => ({
      ...prev,
      [module]: {
        View: newVal,
        Create: newVal,
        Update: newVal,
        Delete: newVal,
        Approve: newVal,
        Export: newVal,
      },
    }));
  };

  if (showError) {
    return (
      <ErrorState
        title="Unable to load RBAC matrix"
        message="The permissions matrix could not be loaded. Please try again."
        onRetry={() => { setShowError(false); setIsLoading(true); setTimeout(() => setIsLoading(false), 800); }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[12px] font-semibold text-[#64748B]">Role:</span>
          <div className="relative flex items-center">
            <div className="flex flex-wrap gap-1.5 max-w-[500px]">
              {allRoles.map((r) => (
                <button
                  key={r}
                  onClick={() => { setSelectedRole(r); setCompareRole(null); setEditing(false); }}
                  className="h-8 px-3 rounded-lg text-[12px] font-semibold border cursor-pointer transition-colors whitespace-nowrap"
                  style={{
                    backgroundColor: selectedRole === r ? "#0B2545" : "white",
                    color: selectedRole === r ? "white" : "#64748B",
                    borderColor: selectedRole === r ? "#0B2545" : "#E2E8F0",
                  }}
                >
                  {r.replace(/_/g, " ")}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => setShowCreateRole(true)} className="flex items-center gap-1.5 h-9 px-3 rounded-xl text-[12px] font-semibold text-[#16A34A] border border-[#16A34A]/30 bg-white hover:bg-[#DCFCE7] cursor-pointer transition-colors whitespace-nowrap">
            <Plus size={14} /> Create Role
          </button>
          <button onClick={handleCloneRole} className="flex items-center gap-1.5 h-9 px-3 rounded-xl text-[12px] font-semibold text-[#1B4F8B] border border-[#1B4F8B]/30 bg-white hover:bg-[#DBEAFE] cursor-pointer transition-colors whitespace-nowrap">
            <Copy size={14} /> Clone Role
          </button>
          {editing ? (
            <button onClick={handleSave} className="flex items-center gap-1.5 h-9 px-4 rounded-xl text-[12px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90 whitespace-nowrap" style={{ backgroundColor: "#0B2545" }}>
              <Save size={14} /> Save Permissions
            </button>
          ) : (
            <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 h-9 px-3 rounded-xl text-[12px] font-semibold text-[#D97706] border border-[#D97706]/30 bg-white hover:bg-[#FEF3C7] cursor-pointer transition-colors whitespace-nowrap">
              <Unlock size={14} /> Edit Permissions
            </button>
          )}
          <div className="flex items-center gap-1.5">
            <div className="relative">
              <button
                onClick={() => {
                  const r = prompt("Enter role to compare:");
                  if (r) setCompareRole(r);
                }}
                className="flex items-center gap-1.5 h-9 px-3 rounded-xl text-[12px] font-semibold text-[#7C3AED] border border-[#7C3AED]/30 bg-white hover:bg-[#EDE9FE] cursor-pointer transition-colors whitespace-nowrap"
              >
                <GitCompare size={14} /> Compare Roles
              </button>
            </div>
          </div>
          <button onClick={() => addToast("RBAC matrix exported", "success")} className="flex items-center gap-1.5 h-9 px-3 rounded-xl text-[12px] font-semibold text-[#64748B] border border-[#E2E8F0] bg-white hover:bg-[#F1F5F9] cursor-pointer transition-colors whitespace-nowrap">
            <Download size={14} /> Export Matrix
          </button>
        </div>
      </div>

      {isLoading ? (
        <LoadingSkeleton rows={12} columns={7} />
      ) : (
        <div className="rounded-xl border border-[#E2E8F0] bg-white overflow-hidden shadow-sm">
          <div className="overflow-x-auto" style={{ maxHeight: "70vh" }}>
            <table className="w-full min-w-[900px]">
              <thead>
                <tr style={{ backgroundColor: "#0B2545" }}>
                  <th className="text-left text-[11px] font-bold uppercase tracking-wider text-white px-4 py-3 whitespace-nowrap sticky left-0 z-10" style={{ backgroundColor: "#0B2545", minWidth: "280px" }}>
                    Module / Screen
                    {editing && (
                      <span className="ml-2 text-[10px] font-normal text-white/60">— editing</span>
                    )}
                  </th>
                  {actions.map((act) => (
                    <th key={act} className="text-center text-[11px] font-bold uppercase tracking-wider text-white px-3 py-3 whitespace-nowrap cursor-pointer hover:bg-[#1B4F8B] transition-colors" onClick={() => allCheck(act)}>
                      {act}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {modules.map((mod, idx) => (
                  <tr
                    key={mod}
                    className="border-b border-[#E2E8F0] last:border-b-0 transition-colors hover:bg-[#F8FAFC]"
                    style={{ backgroundColor: idx % 2 === 1 ? "#F8FAFC" : "white" }}
                  >
                    <td className="px-4 py-2.5 text-[12px] font-medium text-[#0F172A] whitespace-nowrap sticky left-0 z-5 cursor-pointer" style={{ backgroundColor: idx % 2 === 1 ? "#F8FAFC" : "white" }} onClick={() => allRowCheck(mod)}>
                      {mod}
                    </td>
                    {actions.map((act) => {
                      const checked = matrix[mod]?.[act] ?? false;
                      const diff = compareRole && compareMatrix[mod]?.[act] !== checked;
                      return (
                        <td
                          key={act}
                          className={`text-center px-2 py-2.5 transition-colors ${editing ? "cursor-pointer hover:bg-[#EBF0F7]" : ""}`}
                          onClick={() => togglePermission(mod, act)}
                        >
                          {checked ? (
                            <Check size={18} className={`mx-auto ${diff ? "text-[#D97706]" : "text-[#16A34A]"}`} />
                          ) : (
                            <X size={18} className={`mx-auto ${diff ? "text-[#DC2626]" : "text-[#CBD5E1]"}`} />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showCreateRole && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50" onClick={() => setShowCreateRole(false)}>
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-[400px]" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-[16px] font-bold text-[#0F172A] mb-4">Create New Role</h3>
            <input
              type="text"
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
              placeholder="e.g. Regional Manager"
              className="w-full h-10 px-3 rounded-xl border border-[#E2E8F0] bg-white text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors mb-4"
            />
            <div className="flex items-center gap-3 justify-end">
              <button onClick={() => setShowCreateRole(false)} className="h-9 px-4 rounded-xl text-[13px] font-semibold text-[#64748B] border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] cursor-pointer transition-colors whitespace-nowrap">
                Cancel
              </button>
              <button onClick={handleCreateRole} className="h-9 px-5 rounded-xl text-[13px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90 whitespace-nowrap" style={{ backgroundColor: "#0B2545" }}>
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}