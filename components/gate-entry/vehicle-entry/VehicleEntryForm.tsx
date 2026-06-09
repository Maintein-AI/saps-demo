"use client";

import { useState } from "react";
import { Camera, Upload, Search, X, Check, ChevronDown, Truck } from "lucide-react";

interface VehicleEntryFormProps {
  onSubmit?: (data: Record<string, string>) => void;
}

const vehicleTypes = ["Pickup", "Truck", "Container", "Bike", "Car", "Van"];
const purposes = ["Cargo pickup", "Cargo drop", "Visitor", "Supplier", "Staff"];
const agents = ["DB Schenker", "Gerry's", "DHL", "Agility", "Kerry Logistics", "—"];

const docs = [
  "DO-90871",
  "DO-90865",
  "DO-90872",
  "DO-90868",
  "AWB 214-45678901",
  "AWB 157-90811223",
  "AWB 074-88219033",
];

export default function VehicleEntryForm({ onSubmit }: VehicleEntryFormProps) {
  const [form, setForm] = useState({
    vehicleNumber: "",
    vehicleType: "",
    driverCnic: "",
    driverName: "",
    driverMobile: "",
    purpose: "",
    linkedDoc: "",
    forwardingAgent: "",
    gateGuard: "Sgt. Imran Haider",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [docSearch, setDocSearch] = useState("");
  const [driverPhoto, setDriverPhoto] = useState(false);
  const [vehiclePhoto, setVehiclePhoto] = useState(false);
  const [authorityLetter, setAuthorityLetter] = useState(false);

  const isCargoPickup = form.purpose === "Cargo pickup";

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
    setOpenDropdown(null);
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field, form[field as keyof typeof form]);
  };

  const validateField = (field: string, value: string) => {
    let msg = "";
    switch (field) {
      case "vehicleNumber":
        if (!value) msg = "Vehicle number is required";
        else if (!/^[A-Z]{3}-\d{4}$/.test(value.toUpperCase())) msg = "Format: ABC-1234";
        break;
      case "vehicleType":
        if (!value) msg = "Vehicle type is required";
        break;
      case "driverCnic":
        if (!value) msg = "CNIC is required";
        else if (!/^\d{13}$/.test(value)) msg = "Must be 13 digits";
        break;
      case "driverName":
        if (!value) msg = "Driver name is required";
        break;
      case "driverMobile":
        if (!value) msg = "Mobile number is required";
        else if (!/^03\d{9}$/.test(value)) msg = "Must start with 03 and be 11 digits";
        break;
      case "purpose":
        if (!value) msg = "Purpose is required";
        break;
      case "linkedDoc":
        if (isCargoPickup && !value) msg = "DO / AWB is required for cargo pickup";
        break;
    }
    if (msg) {
      setErrors((prev) => ({ ...prev, [field]: msg }));
    }
  };

  const validateAll = () => {
    const newErrors: Record<string, string> = {};
    const fields = ["vehicleNumber", "vehicleType", "driverCnic", "driverName", "driverMobile", "purpose"];
    if (isCargoPickup) fields.push("linkedDoc");
    fields.forEach((f) => {
      const val = form[f as keyof typeof form];
      let msg = "";
      switch (f) {
        case "vehicleNumber":
          if (!val) msg = "Vehicle number is required";
          else if (!/^[A-Z]{3}-\d{4}$/.test(val.toUpperCase())) msg = "Format: ABC-1234";
          break;
        case "vehicleType":
          if (!val) msg = "Vehicle type is required";
          break;
        case "driverCnic":
          if (!val) msg = "CNIC is required";
          else if (!/^\d{13}$/.test(val)) msg = "Must be 13 digits";
          break;
        case "driverName":
          if (!val) msg = "Driver name is required";
          break;
        case "driverMobile":
          if (!val) msg = "Mobile number is required";
          else if (!/^03\d{9}$/.test(val)) msg = "Must start with 03 and be 11 digits";
          break;
        case "purpose":
          if (!val) msg = "Purpose is required";
          break;
        case "linkedDoc":
          if (isCargoPickup && !val) msg = "DO / AWB is required for cargo pickup";
          break;
      }
      if (msg) newErrors[f] = msg;
    });
    setErrors(newErrors);
    setTouched(Object.fromEntries(fields.map((f) => [f, true])));
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateAll()) {
      onSubmit?.(form);
    }
  };

  const handleClear = () => {
    setForm({
      vehicleNumber: "",
      vehicleType: "",
      driverCnic: "",
      driverName: "",
      driverMobile: "",
      purpose: "",
      linkedDoc: "",
      forwardingAgent: "",
      gateGuard: "Sgt. Imran Haider",
    });
    setErrors({});
    setTouched({});
    setDriverPhoto(false);
    setVehiclePhoto(false);
    setAuthorityLetter(false);
    setDocSearch("");
  };

  const handleSaveDraft = () => {
    onSubmit?.({ ...form, status: "draft" });
  };

  const filteredDocs = docs.filter((d) =>
    d.toLowerCase().includes(docSearch.toLowerCase())
  );

  const renderDropdown = (
    field: string,
    options: string[],
    placeholder: string,
    required: boolean
  ) => {
    const isOpen = openDropdown === field;
    const value = form[field as keyof typeof form];
    const hasError = touched[field] && errors[field];

    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpenDropdown(isOpen ? null : field)}
          className="w-full h-12 px-4 rounded-xl border text-left text-[14px] font-medium flex items-center justify-between cursor-pointer transition-colors"
          style={{
            borderColor: hasError ? "#DC2626" : isOpen ? "#1B4F8B" : "#E2E8F0",
            backgroundColor: "white",
            color: value ? "#0F172A" : "#94A3B8",
          }}
        >
          <span className={value ? "text-[#0F172A]" : "text-[#94A3B8]"}>
            {value || placeholder}
            {required && !value && <span className="text-[#DC2626] ml-1">*</span>}
          </span>
          <ChevronDown
            size={16}
            className={`text-[#94A3B8] transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </button>
        {isOpen && (
          <div className="absolute z-20 left-0 right-0 mt-1 bg-white rounded-xl border border-[#E2E8F0] shadow-lg overflow-hidden">
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => updateField(field, opt)}
                className="w-full text-left px-4 py-2.5 text-[13px] hover:bg-[#F8FAFC] cursor-pointer transition-colors flex items-center justify-between"
              >
                <span className={value === opt ? "font-semibold text-[#0B2545]" : "text-[#0F172A]"}>
                  {opt}
                </span>
                {value === opt && <Check size={14} className="text-[#16A34A]" />}
              </button>
            ))}
          </div>
        )}
        {hasError && (
          <p className="text-[12px] text-[#DC2626] mt-1.5 ml-1">{errors[field]}</p>
        )}
      </div>
    );
  };

  const renderInput = (
    field: string,
    placeholder: string,
    required: boolean,
    props: { type?: string; maxLength?: number; autoComplete?: string; readOnly?: boolean; value?: string } = {}
  ) => {
    const hasError = touched[field] && errors[field];
    const val = props.value !== undefined ? props.value : form[field as keyof typeof form];

    return (
      <div>
        <input
          type={props.type || "text"}
          value={val}
          onChange={(e) => {
            const v = e.target.value;
            if (field === "driverCnic" && v.length > 13) return;
            if (field === "driverMobile" && v.length > 11) return;
            updateField(field, v);
          }}
          onBlur={() => handleBlur(field)}
          readOnly={props.readOnly}
          maxLength={props.maxLength}
          autoComplete={props.autoComplete}
          className="w-full h-12 px-4 rounded-xl border text-[14px] font-medium transition-colors outline-none"
          style={{
            borderColor: hasError ? "#DC2626" : "#E2E8F0",
            backgroundColor: props.readOnly ? "#F8FAFC" : "white",
            color: props.readOnly ? "#64748B" : "#0F172A",
          }}
          placeholder={placeholder + (required ? " *" : "")}
        />
        {hasError && (
          <p className="text-[12px] text-[#DC2626] mt-1.5 ml-1">{errors[field]}</p>
        )}
      </div>
    );
  };

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <Truck size={20} className="text-[#1B4F8B]" />
        <h2 className="text-[18px] font-semibold text-[#0F172A] leading-[28px]">
          Vehicle Entry Form
        </h2>
        <span className="inline-flex items-center justify-center h-[22px] px-2.5 rounded-full text-[11px] font-bold tracking-[0.3px] lowercase select-none text-white bg-[#16A34A]">
          inc.
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Vehicle Number */}
        {renderInput("vehicleNumber", "KHI-4582", true, { autoComplete: "off" })}

        {/* Vehicle Type */}
        {renderDropdown("vehicleType", vehicleTypes, "Select vehicle type", true)}

        {/* Driver CNIC */}
        {renderInput("driverCnic", "4210112345671", true, { maxLength: 13, autoComplete: "off" })}

        {/* Driver Name */}
        {renderInput("driverName", "Ahmed Raza", true, { autoComplete: "off" })}

        {/* Driver Mobile */}
        {renderInput("driverMobile", "03001234567", true, { maxLength: 11, autoComplete: "off" })}

        {/* Purpose */}
        {renderDropdown("purpose", purposes, "Select purpose", true)}

        {/* Linked AWB / DO — conditional */}
        {isCargoPickup && (
          <div className="md:col-span-2">
            <div className="relative">
              <div className="relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                <input
                  type="text"
                  value={docSearch}
                  onChange={(e) => setDocSearch(e.target.value)}
                  onFocus={() => setOpenDropdown("linkedDoc")}
                  className="w-full h-12 pl-10 pr-4 rounded-xl border text-[14px] font-medium transition-colors outline-none"
                  style={{
                    borderColor: touched.linkedDoc && errors.linkedDoc ? "#DC2626" : "#E2E8F0",
                    backgroundColor: "white",
                    color: "#0F172A",
                  }}
                  placeholder="Search DO / AWB..."
                />
                {form.linkedDoc && (
                  <button
                    onClick={() => updateField("linkedDoc", "")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-[#F1F5F9] text-[#64748B] cursor-pointer hover:bg-[#E2E8F0]"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
              {openDropdown === "linkedDoc" && (
                <div className="absolute z-20 left-0 right-0 mt-1 bg-white rounded-xl border border-[#E2E8F0] shadow-lg overflow-hidden">
                  {filteredDocs.length > 0 ? (
                    filteredDocs.map((d) => (
                      <button
                        key={d}
                        onClick={() => {
                          updateField("linkedDoc", d);
                          setDocSearch("");
                        }}
                        className="w-full text-left px-4 py-2.5 text-[13px] hover:bg-[#F8FAFC] cursor-pointer transition-colors flex items-center justify-between"
                      >
                        <span className={form.linkedDoc === d ? "font-semibold text-[#0B2545]" : "text-[#0F172A]"}>
                          {d}
                        </span>
                        {form.linkedDoc === d && <Check size={14} className="text-[#16A34A]" />}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-[13px] text-[#94A3B8]">No results found</div>
                  )}
                </div>
              )}
              {touched.linkedDoc && errors.linkedDoc && (
                <p className="text-[12px] text-[#DC2626] mt-1.5 ml-1">{errors.linkedDoc}</p>
              )}
            </div>
          </div>
        )}

        {/* Forwarding Agent — conditional */}
        {isCargoPickup && (
          renderDropdown("forwardingAgent", agents, "Select forwarding agent", false)
        )}

        {/* Driver Photo */}
        <div className="md:col-span-2">
          <label className="block text-[13px] font-semibold text-[#0F172A] mb-2">
            Driver Photo
            <span className="text-[#94A3B8] font-normal ml-1">(First visit required)</span>
          </label>
          <button
            onClick={() => setDriverPhoto(!driverPhoto)}
            className="w-full h-20 rounded-xl border-2 border-dashed flex items-center justify-center gap-3 cursor-pointer transition-colors"
            style={{
              borderColor: driverPhoto ? "#16A34A" : "#E2E8F0",
              backgroundColor: driverPhoto ? "#F0FDF4" : "#F8FAFC",
            }}
          >
            {driverPhoto ? (
              <>
                <Check size={20} className="text-[#16A34A]" />
                <span className="text-[14px] font-semibold text-[#16A34A]">Photo captured</span>
              </>
            ) : (
              <>
                <Camera size={20} className="text-[#94A3B8]" />
                <span className="text-[14px] text-[#64748B]">Tap to capture photo</span>
              </>
            )}
          </button>
        </div>

        {/* Authority Letter */}
        <div className="md:col-span-2">
          <label className="block text-[13px] font-semibold text-[#0F172A] mb-2">
            Authority Letter
            <span className="text-[#94A3B8] font-normal ml-1">(Required for cargo pickup, max 5 MB)</span>
          </label>
          <button
            onClick={() => setAuthorityLetter(!authorityLetter)}
            className="w-full h-20 rounded-xl border-2 border-dashed flex items-center justify-center gap-3 cursor-pointer transition-colors"
            style={{
              borderColor: authorityLetter ? "#16A34A" : "#E2E8F0",
              backgroundColor: authorityLetter ? "#F0FDF4" : "#F8FAFC",
            }}
          >
            {authorityLetter ? (
              <>
                <Check size={20} className="text-[#16A34A]" />
                <span className="text-[14px] font-semibold text-[#16A34A]">Authority letter uploaded</span>
              </>
            ) : (
              <>
                <Upload size={20} className="text-[#94A3B8]" />
                <span className="text-[14px] text-[#64748B]">Tap to upload PDF or JPG</span>
              </>
            )}
          </button>
        </div>

        {/* Vehicle Photo */}
        <div className="md:col-span-2">
          <label className="block text-[13px] font-semibold text-[#0F172A] mb-2">
            Vehicle Photo
            <span className="text-[#94A3B8] font-normal ml-1">(Optional)</span>
          </label>
          <button
            onClick={() => setVehiclePhoto(!vehiclePhoto)}
            className="w-full h-20 rounded-xl border-2 border-dashed flex items-center justify-center gap-3 cursor-pointer transition-colors"
            style={{
              borderColor: vehiclePhoto ? "#16A34A" : "#E2E8F0",
              backgroundColor: vehiclePhoto ? "#F0FDF4" : "#F8FAFC",
            }}
          >
            {vehiclePhoto ? (
              <>
                <Check size={20} className="text-[#16A34A]" />
                <span className="text-[14px] font-semibold text-[#16A34A]">Photo captured</span>
              </>
            ) : (
              <>
                <Camera size={20} className="text-[#94A3B8]" />
                <span className="text-[14px] text-[#64748B]">Tap to capture vehicle photo</span>
              </>
            )}
          </button>
        </div>

        {/* Entry Timestamp — auto */}
        <div>
          <label className="block text-[13px] font-semibold text-[#0F172A] mb-2">Entry Timestamp</label>
          <input
            type="text"
            value={new Date().toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
            readOnly
            className="w-full h-12 px-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-[14px] text-[#64748B] cursor-default"
          />
        </div>

        {/* Gate Guard — auto */}
        <div>
          <label className="block text-[13px] font-semibold text-[#0F172A] mb-2">Gate Guard</label>
          <input
            type="text"
            value={form.gateGuard}
            readOnly
            className="w-full h-12 px-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-[14px] text-[#64748B] cursor-default"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 pt-6 border-t border-[#E2E8F0]">
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleSubmit}
            className="flex-1 h-14 rounded-xl text-[15px] font-bold text-white cursor-pointer transition-colors hover:opacity-90"
            style={{ backgroundColor: "#16A34A" }}
          >
            Allow Entry
          </button>
          <button
            onClick={() => onSubmit?.({ ...form, status: "hold" })}
            className="flex-1 h-14 rounded-xl text-[15px] font-bold text-[#D97706] border-2 border-[#D97706] cursor-pointer transition-colors hover:bg-[#FEF3C7]"
          >
            Hold for Verification
          </button>
          <button
            onClick={() => onSubmit?.({ ...form, status: "reject" })}
            className="flex-1 h-14 rounded-xl text-[15px] font-bold text-[#DC2626] border-2 border-[#DC2626] cursor-pointer transition-colors hover:bg-[#FEE2E2]"
          >
            Reject
          </button>
        </div>
        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={handleSaveDraft}
            className="h-10 px-5 rounded-xl text-[13px] font-semibold text-[#64748B] border border-[#E2E8F0] hover:bg-[#F8FAFC] cursor-pointer transition-colors"
          >
            Save Draft
          </button>
          <button
            onClick={handleClear}
            className="h-10 px-5 rounded-xl text-[13px] font-semibold text-[#64748B] border border-[#E2E8F0] hover:bg-[#F8FAFC] cursor-pointer transition-colors"
          >
            Clear Form
          </button>
        </div>
      </div>
    </div>
  );
}