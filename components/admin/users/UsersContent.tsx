"use client";

import { useState, useEffect } from "react";
import DataTable from "@/components/DataTable";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import ErrorState from "@/components/ErrorState";
import EmptyState from "@/components/EmptyState";
import { useToast } from "@/components/ToastContext";
import UserDrawer from "./UserDrawer";
import { Plus, CheckSquare, XSquare, Key, Link2, UserPlus, Search } from "lucide-react";

interface UserRecord {
  userId: string;
  username: string;
  name: string;
  email: string;
  mobile: string;
  roles: string;
  groups: string;
  lastLogin: string;
  status: "Active" | "Locked" | "Disabled";
}

const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  Active: { bg: "#DCFCE7", text: "#16A34A", dot: "#16A34A" },
  Locked: { bg: "#FEF3C7", text: "#D97706", dot: "#D97706" },
  Disabled: { bg: "#F1F5F9", text: "#64748B", dot: "#94A3B8" },
};

const mockUsers: UserRecord[] = [
  { userId: "USR-001", username: "ahmed.shaikh", name: "Ahmed Shaikh", email: "ahmed@shaheen-airport.com", mobile: "+92 300 1234567", roles: "warehouse_manager", groups: "KHI-Ops", lastLogin: "Today 09:42", status: "Active" },
  { userId: "USR-002", username: "fatima.rizvi", name: "Fatima Rizvi", email: "fatima@shaheen-airport.com", mobile: "+92 321 9876543", roles: "sys_admin", groups: "IT-Admin", lastLogin: "Today 09:38", status: "Active" },
  { userId: "USR-003", username: "bilal.khan", name: "Bilal Khan", email: "bilal@shaheen-airport.com", mobile: "+92 333 4567890", roles: "finance_manager", groups: "Finance", lastLogin: "Today 09:35", status: "Locked" },
  { userId: "USR-004", username: "sana.tariq", name: "Sana Tariq", email: "sana@shaheen-airport.com", mobile: "+92 345 1122334", roles: "cha_admin", groups: "CHA-Department", lastLogin: "Today 09:28", status: "Active" },
  { userId: "USR-005", username: "raza.akbar", name: "Raza Akbar", email: "raza@shaheen-airport.com", mobile: "+92 312 5544332", roles: "gate_entry", groups: "Gate-Ops", lastLogin: "Today 09:15", status: "Active" },
  { userId: "USR-006", username: "nadia.hassan", name: "Nadia Hassan", email: "nadia@shaheen-airport.com", mobile: "+92 301 8765432", roles: "planner", groups: "Planning", lastLogin: "Today 08:55", status: "Active" },
  { userId: "USR-007", username: "kamran.malik", name: "Kamran Malik", email: "kamran@shaheen-airport.com", mobile: "+92 334 9988776", roles: "ops_supervisor", groups: "KHI-Ops", lastLogin: "Today 08:40", status: "Active" },
  { userId: "USR-008", username: "azeem.qureshi", name: "Azeem Qureshi", email: "azeem@shaheen-airport.com", mobile: "+92 311 2233445", roles: "fa_user", groups: "LHE-Ops", lastLogin: "Yesterday", status: "Disabled" },
  { userId: "USR-009", username: "hina.akram", name: "Hina Akram", email: "hina@shaheen-airport.com", mobile: "+92 322 6677889", roles: "consignee", groups: "External", lastLogin: "2 days ago", status: "Active" },
  { userId: "USR-010", username: "owais.javed", name: "Owais Javed", email: "owais@shaheen-airport.com", mobile: "+92 304 5566778", roles: "lifter_operator", groups: "Floor-Ops", lastLogin: "Today 07:50", status: "Active" },
  { userId: "USR-011", username: "maryam.saeed", name: "Maryam Saeed", email: "maryam@shaheen-airport.com", mobile: "+92 335 1122990", roles: "auditor", groups: "Audit", lastLogin: "3 days ago", status: "Active" },
  { userId: "USR-012", username: "talha.mehmood", name: "Talha Mehmood", email: "talha@shaheen-airport.com", mobile: "+92 306 4455667", roles: "excise_compliance", groups: "Excise", lastLogin: "Today 07:20", status: "Locked" },
];

export default function UsersContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [showError, setShowError] = useState(false);
  const [users, setUsers] = useState<UserRecord[]>(mockUsers);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editUser, setEditUser] = useState<UserRecord | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const { addToast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const filteredUsers = users.filter((u) => {
    if (!searchTerm) return true;
    const s = searchTerm.toLowerCase();
    return u.name.toLowerCase().includes(s) || u.username.toLowerCase().includes(s) || u.email.toLowerCase().includes(s) || u.userId.toLowerCase().includes(s);
  });

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredUsers.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredUsers.map((u) => u.userId)));
    }
  };

  const bulkAction = (action: string) => {
    if (selectedIds.size === 0) {
      addToast("No users selected", "error");
      return;
    }
    setUsers((prev) =>
      prev.map((u) => {
        if (!selectedIds.has(u.userId)) return u;
        if (action === "enable") return { ...u, status: "Active" as const };
        if (action === "disable") return { ...u, status: "Disabled" as const };
        return u;
      })
    );
    addToast(`${selectedIds.size} user(s) ${action}d`, "success");
    setSelectedIds(new Set());
  };

  const handleSaveUser = (data: { userId: string; username: string; name: string; email: string; mobile: string; roles: string; groups: string; status: string }) => {
    if (editUser) {
      setUsers((prev) => prev.map((u) => (u.userId === editUser.userId ? { ...u, ...data, status: data.status as UserRecord["status"] } : u)));
      addToast("User updated successfully", "success");
    } else {
      const newUser: UserRecord = {
        ...data,
        lastLogin: "Never",
        status: data.status as UserRecord["status"],
      };
      setUsers((prev) => [...prev, newUser]);
      addToast("User created successfully", "success");
    }
    setDrawerOpen(false);
    setEditUser(null);
  };

  const columns = [
    {
      key: "checkbox",
      header: (
        <input
          type="checkbox"
          checked={selectedIds.size === filteredUsers.length && filteredUsers.length > 0}
          onChange={toggleSelectAll}
          className="w-4 h-4 rounded accent-[#0B2545] cursor-pointer"
        />
      ),
      width: "40px",
    },
    { key: "userId", header: "User ID", sortable: true },
    { key: "username", header: "Username", sortable: true },
    { key: "name", header: "Name", sortable: true },
    { key: "email", header: "Email", sortable: true },
    { key: "mobile", header: "Mobile", sortable: true },
    { key: "roles", header: "Role(s)", sortable: true },
    { key: "groups", header: "Groups", sortable: true },
    { key: "lastLogin", header: "Last Login", sortable: true },
    { key: "status", header: "Status", sortable: true },
    { key: "action", header: "Action", width: "80px" },
  ];

  const rows = filteredUsers.map((u) => {
    const sc = statusConfig[u.status];
    return {
      checkbox: (
        <input
          type="checkbox"
          checked={selectedIds.has(u.userId)}
          onChange={() => toggleSelect(u.userId)}
          className="w-4 h-4 rounded accent-[#0B2545] cursor-pointer"
        />
      ),
      userId: <span className="text-[13px] font-medium text-[#0F172A]">{u.userId}</span>,
      username: <span className="text-[13px] font-semibold text-[#1B4F8B]">{u.username}</span>,
      name: <span className="text-[13px] font-semibold text-[#0F172A]">{u.name}</span>,
      email: <span className="text-[12px] text-[#64748B]">{u.email}</span>,
      mobile: <span className="text-[12px] text-[#64748B]">{u.mobile}</span>,
      roles: <span className="text-[12px] text-[#64748B]">{u.roles}</span>,
      groups: <span className="text-[12px] text-[#64748B]">{u.groups}</span>,
      lastLogin: <span className="text-[12px] text-[#64748B]">{u.lastLogin}</span>,
      status: (
        <span
          className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full text-[11px] font-semibold whitespace-nowrap"
          style={{ backgroundColor: sc.bg, color: sc.text }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: sc.dot }} />
          {u.status}
        </span>
      ),
      action: (
        <button
          onClick={() => { setEditUser(u); setDrawerOpen(true); }}
          className="text-[12px] font-semibold text-[#1B4F8B] hover:text-[#0B2545] cursor-pointer transition-colors whitespace-nowrap"
        >
          Edit
        </button>
      ),
    };
  });

  if (showError) {
    return (
      <ErrorState
        title="Unable to load users"
        message="The user directory could not be fetched. Please check your connection and try again."
        onRetry={() => { setShowError(false); setIsLoading(true); setTimeout(() => setIsLoading(false), 1000); }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-[320px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search users..."
              className="w-full h-10 pl-10 pr-4 rounded-xl border border-[#E2E8F0] bg-white text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors"
            />
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => bulkAction("enable")} className="flex items-center gap-1.5 h-9 px-3 rounded-xl text-[12px] font-semibold text-[#16A34A] border border-[#16A34A]/30 bg-white hover:bg-[#DCFCE7] cursor-pointer transition-colors whitespace-nowrap">
            <CheckSquare size={14} /> Enable
          </button>
          <button onClick={() => bulkAction("disable")} className="flex items-center gap-1.5 h-9 px-3 rounded-xl text-[12px] font-semibold text-[#64748B] border border-[#E2E8F0] bg-white hover:bg-[#F1F5F9] cursor-pointer transition-colors whitespace-nowrap">
            <XSquare size={14} /> Disable
          </button>
          <button onClick={() => { addToast("Password reset triggered for selected users", "success"); }} className="flex items-center gap-1.5 h-9 px-3 rounded-xl text-[12px] font-semibold text-[#D97706] border border-[#D97706]/30 bg-white hover:bg-[#FEF3C7] cursor-pointer transition-colors whitespace-nowrap">
            <Key size={14} /> Force Password Reset
          </button>
          <button onClick={() => { addToast("SSO linking initiated", "success"); }} className="flex items-center gap-1.5 h-9 px-3 rounded-xl text-[12px] font-semibold text-[#1B4F8B] border border-[#1B4F8B]/30 bg-white hover:bg-[#DBEAFE] cursor-pointer transition-colors whitespace-nowrap">
            <Link2 size={14} /> SSO Link
          </button>
          <button onClick={() => { setEditUser(null); setDrawerOpen(true); }} className="flex items-center gap-1.5 h-9 px-4 rounded-xl text-[12px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90 whitespace-nowrap" style={{ backgroundColor: "#0B2545" }}>
            <UserPlus size={14} /> Add User
          </button>
        </div>
      </div>

      {isLoading ? (
        <LoadingSkeleton rows={8} columns={11} />
      ) : filteredUsers.length === 0 ? (
        <EmptyState title="No users found" description="Try adjusting your search or add a new user." actionLabel="Add User" onAction={() => { setEditUser(null); setDrawerOpen(true); }} />
      ) : (
        <DataTable columns={columns} rows={rows} sortable headerStyle="navy" />
      )}

      <UserDrawer
        isOpen={drawerOpen}
        onClose={() => { setDrawerOpen(false); setEditUser(null); }}
        onSave={handleSaveUser}
        editData={editUser ? { userId: editUser.userId, username: editUser.username, name: editUser.name, email: editUser.email, mobile: editUser.mobile, roles: editUser.roles, groups: editUser.groups, status: editUser.status, ssoEnabled: false, tempPassword: "", forcePasswordReset: false } : null}
      />
    </div>
  );
}