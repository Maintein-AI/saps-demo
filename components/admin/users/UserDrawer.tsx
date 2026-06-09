"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/Modal";
import ScopeBadge from "@/components/ScopeBadge";

interface UserFormData {
  userId: string;
  username: string;
  name: string;
  email: string;
  mobile: string;
  roles: string;
  groups: string;
  status: string;
  ssoEnabled: boolean;
  tempPassword: string;
  forcePasswordReset: boolean;
}

const emptyForm: UserFormData = {
  userId: "",
  username: "",
  name: "",
  email: "",
  mobile: "",
  roles: "",
  groups: "",
  status: "Active",
  ssoEnabled: false,
  tempPassword: "",
  forcePasswordReset: false,
};

interface UserDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: UserFormData) => void;
  editData?: UserFormData | null;
}

export default function UserDrawer({ isOpen, onClose, onSave, editData }: UserDrawerProps) {
  const [form, setForm] = useState<UserFormData>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editData) {
      setForm(editData);
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [editData, isOpen]);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.username.trim()) errs.username = "Username is required";
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    if (!form.mobile.trim()) errs.mobile = "Mobile is required";
    if (form.tempPassword && form.tempPassword.length < 8) errs.tempPassword = "Minimum 8 characters";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSave(form);
    }
  };

  const update = (key: keyof UserFormData, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const inputClass = (key: string) =>
    `w-full h-10 px-3 rounded-xl border text-[13px] text-[#0F172A] outline-none transition-colors ${
      errors[key] ? "border-[#DC2626] bg-[#FEF2F2]" : "border-[#E2E8F0] bg-white focus:border-[#1B4F8B]"
    }`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editData ? "Edit User" : "Add User"}
      maxWidth={640}
      footer={
        <div className="flex items-center gap-3 justify-end">
          <button
            onClick={onClose}
            className="h-9 px-4 rounded-xl text-[13px] font-semibold text-[#64748B] border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] cursor-pointer transition-colors whitespace-nowrap"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="h-9 px-5 rounded-xl text-[13px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90 whitespace-nowrap"
            style={{ backgroundColor: "#0B2545" }}
          >
            {editData ? "Save Changes" : "Create User"}
          </button>
        </div>
      }
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">User ID</label>
          <input type="text" value={form.userId} onChange={(e) => update("userId", e.target.value)} className={inputClass("userId")} placeholder="e.g. USR-001" />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">Username *</label>
          <input type="text" value={form.username} onChange={(e) => update("username", e.target.value)} className={inputClass("username")} placeholder="e.g. ahmed.shaikh" />
          {errors.username && <p className="text-[11px] text-[#DC2626] mt-1">{errors.username}</p>}
        </div>
        <div className="col-span-2">
          <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">Full Name *</label>
          <input type="text" value={form.name} onChange={(e) => update("name", e.target.value)} className={inputClass("name")} placeholder="e.g. Ahmed Shaikh" />
          {errors.name && <p className="text-[11px] text-[#DC2626] mt-1">{errors.name}</p>}
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">Email *</label>
          <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className={inputClass("email")} placeholder="e.g. ahmed@shaheen-airport.com" />
          {errors.email && <p className="text-[11px] text-[#DC2626] mt-1">{errors.email}</p>}
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">Mobile *</label>
          <input type="text" value={form.mobile} onChange={(e) => update("mobile", e.target.value)} className={inputClass("mobile")} placeholder="+92 300 1234567" />
          {errors.mobile && <p className="text-[11px] text-[#DC2626] mt-1">{errors.mobile}</p>}
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">Role(s)</label>
          <input type="text" value={form.roles} onChange={(e) => update("roles", e.target.value)} className={inputClass("roles")} placeholder="e.g. warehouse_manager" />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">Groups</label>
          <input type="text" value={form.groups} onChange={(e) => update("groups", e.target.value)} className={inputClass("groups")} placeholder="e.g. KHI-Ops, LHE-Ops" />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">Status</label>
          <div className="flex gap-2">
            {["Active", "Locked", "Disabled"].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => update("status", s)}
                className="h-10 px-4 rounded-xl text-[13px] font-medium border cursor-pointer transition-colors whitespace-nowrap"
                style={{
                  backgroundColor: form.status === s ? (s === "Active" ? "#DCFCE7" : s === "Locked" ? "#FEF3C7" : "#F1F5F9") : "white",
                  borderColor: form.status === s ? (s === "Active" ? "#16A34A" : s === "Locked" ? "#D97706" : "#94A3B8") : "#E2E8F0",
                  color: form.status === s ? (s === "Active" ? "#16A34A" : s === "Locked" ? "#D97706" : "#64748B") : "#94A3B8",
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">SSO Enabled</label>
          <button
            type="button"
            onClick={() => update("ssoEnabled", !form.ssoEnabled)}
            className={`relative h-10 w-14 rounded-full transition-colors cursor-pointer ${form.ssoEnabled ? "bg-[#16A34A]" : "bg-[#CBD5E1]"}`}
          >
            <span className={`absolute top-1 w-8 h-8 rounded-full bg-white shadow-sm transition-transform ${form.ssoEnabled ? "left-[22px]" : "left-0.5"}`} />
          </button>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">Temporary Password</label>
          <input type="password" value={form.tempPassword} onChange={(e) => update("tempPassword", e.target.value)} className={inputClass("tempPassword")} placeholder="Min 8 characters" />
          {errors.tempPassword && <p className="text-[11px] text-[#DC2626] mt-1">{errors.tempPassword}</p>}
        </div>
        <div className="col-span-2 sm:col-span-1 flex items-end">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.forcePasswordReset} onChange={(e) => update("forcePasswordReset", e.target.checked)} className="w-4 h-4 rounded accent-[#0B2545]" />
            <span className="text-[13px] text-[#0F172A]">Force password reset on first login</span>
          </label>
        </div>
      </div>
    </Modal>
  );
}