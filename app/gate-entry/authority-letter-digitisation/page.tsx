"use client";

import { useState } from "react";
import { Upload, FileText, CheckCircle, AlertTriangle, RefreshCw } from "lucide-react";
import AppShell from "@/components/AppShell";
import Breadcrumb from "@/components/Breadcrumb";
import { useToast } from "@/components/ToastContext";
import ErrorState from "@/components/ErrorState";
import EmptyState from "@/components/EmptyState";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import UploadScanCard from "@/components/gate-entry/authority-letter-digitisation/UploadScanCard";
import OCRReviewCard from "@/components/gate-entry/authority-letter-digitisation/OCRReviewCard";
import ValidationPanel from "@/components/gate-entry/authority-letter-digitisation/ValidationPanel";
import RecentLettersTable from "@/components/gate-entry/authority-letter-digitisation/RecentLettersTable";

export default function AuthorityLetterDigitisationPage() {
  const { addToast } = useToast();
  const [hasFile, setHasFile] = useState(false);
  const [isOCRRunning, setIsOCRRunning] = useState(false);
  const [ocrComplete, setOcrComplete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFileUpload = () => {
    setHasFile(true);
    setOcrComplete(false);
    setError(null);
    setSuccess(null);
  };

  const handleCameraCapture = () => {
    setHasFile(true);
    setOcrComplete(false);
    setError(null);
    setSuccess(null);
  };

  const handleRunOCR = () => {
    setIsOCRRunning(true);
    setError(null);
    setTimeout(() => {
      setIsOCRRunning(false);
      setOcrComplete(true);
      addToast("OCR extraction complete", "success");
    }, 2000);
  };

  const handleSave = () => {
    addToast("Authority letter data saved", "success");
  };

  const handleReject = () => {
    setHasFile(false);
    setOcrComplete(false);
    addToast("Authority letter rejected", "error");
  };

  const handleDownload = () => {
    addToast("Extracted record downloaded", "success");
  };

  const handleLinkToEntry = () => {
    addToast("Authority letter linked to vehicle entry", "success");
  };

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  const handleSimulateError = () => {
    setError("OCR engine failed to process the scanned image. Please retry or upload a clearer copy.");
  };

  return (
    <AppShell>
      <div className="p-6 space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Gate Entry", href: "/gate-entry" },
            { label: "Authority Letter Digitisation" },
          ]}
        />

        {/* Page Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#EBF0F7] flex items-center justify-center">
            <FileText size={20} className="text-[#0B2545]" />
          </div>
          <div>
            <h1 className="text-[22px] font-bold text-[#0F172A]">Authority Letter Digitisation</h1>
            <p className="text-[12px] text-[#64748B]">Digitise authority letters using OCR extraction</p>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="flex items-start gap-4 p-4 rounded-xl border border-[#DC2626]/20 bg-[#DC2626]/5">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#DC2626]/10 flex items-center justify-center">
              <AlertTriangle size={20} className="text-[#DC2626]" />
            </div>
            <div className="flex-1">
              <h3 className="text-[14px] font-bold text-[#0F172A] mb-1">OCR Processing Failed</h3>
              <p className="text-[13px] text-[#64748B] leading-relaxed">{error}</p>
              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={handleRetry}
                  className="flex items-center gap-2 h-8 px-3 rounded-lg text-[13px] font-semibold border border-[#DC2626]/30 text-[#DC2626] hover:bg-[#DC2626]/10 cursor-pointer transition-colors"
                >
                  <RefreshCw size={14} />
                  Retry
                </button>
                <button
                  onClick={() => {
                    setError(null);
                    setHasFile(false);
                    setOcrComplete(false);
                  }}
                  className="flex items-center gap-2 h-8 px-3 rounded-lg text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer transition-colors"
                >
                  Clear & Re-upload
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success Banner */}
        {success && (
          <div className="flex items-center gap-3 p-4 rounded-xl border border-[#16A34A]/20 bg-[#16A34A]/5">
            <CheckCircle size={20} className="text-[#16A34A] flex-shrink-0" />
            <p className="text-[13px] font-semibold text-[#16A34A]">{success}</p>
          </div>
        )}

        {/* Top Instruction Card */}
        <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[14px] font-bold text-[#0F172A]">Scan or Upload Authority Letter</h3>
          </div>
          <p className="text-[13px] text-[#64748B] leading-relaxed">
            Upload or scan the authority letter. OCR will extract key fields for review before linking it to vehicle entry.
          </p>
          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={handleSimulateError}
              className="h-7 px-3 rounded-lg border border-[#E2E8F0] text-[11px] font-semibold text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer"
            >
              Simulate Error
            </button>
            <button
              onClick={() => {
                setHasFile(true);
                setOcrComplete(true);
                setSuccess("Authority letter linked successfully.");
                addToast("Authority letter linked successfully", "success");
              }}
              className="h-7 px-3 rounded-lg border border-[#E2E8F0] text-[11px] font-semibold text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer"
            >
              Simulate Success
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[14px] font-bold text-[#0F172A]">OCR Processing</h3>
            </div>
            <LoadingSkeleton rows={4} columns={3} />
          </div>
        )}

        {/* Main Grid */}
        {!loading && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Left Column: Upload + OCR */}
            <div className="lg:col-span-2 space-y-5">
              <UploadScanCard
                onFileUpload={handleFileUpload}
                onCameraCapture={handleCameraCapture}
                onRunOCR={handleRunOCR}
                hasFile={hasFile}
                isOCRRunning={isOCRRunning}
              />

              <OCRReviewCard
                visible={ocrComplete}
                onSave={handleSave}
                onReject={handleReject}
                onDownload={handleDownload}
              />

              {/* Empty State when no file */}
              {!hasFile && !ocrComplete && !error && (
                <EmptyState
                  title="Upload an authority letter"
                  description="Drag and drop a PDF, JPG, or PNG file, or scan using the camera to begin OCR digitisation."
                  icon={<Upload size={28} className="text-[#94A3B8]" />}
                />
              )}
            </div>

            {/* Right Column: Validation + Actions */}
            <div className="space-y-5">
              <ValidationPanel visible={ocrComplete} />

              {ocrComplete && (
                <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[14px] font-bold text-[#0F172A]">Actions</h3>
                  </div>
                  <div className="space-y-2">
                    <button
                      onClick={handleLinkToEntry}
                      className="w-full flex items-center justify-center gap-2 h-10 rounded-lg text-[13px] font-semibold text-white cursor-pointer hover:opacity-90"
                      style={{ backgroundColor: "#16A34A" }}
                    >
                      <CheckCircle size={16} />
                      Link to Vehicle Entry
                    </button>
                    <button
                      onClick={handleSave}
                      className="w-full flex items-center justify-center gap-2 h-10 rounded-lg text-[13px] font-semibold text-white cursor-pointer hover:opacity-90"
                      style={{ backgroundColor: "#0B2545" }}
                    >
                      <FileText size={16} />
                      Save Corrected Data
                    </button>
                    <button
                      onClick={handleDownload}
                      className="w-full flex items-center justify-center gap-2 h-10 rounded-lg border border-[#E2E8F0] text-[13px] font-semibold text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer"
                    >
                      Download Extracted Record
                    </button>
                    <button
                      onClick={handleReject}
                      className="w-full flex items-center justify-center gap-2 h-10 rounded-lg border border-[#DC2626]/30 text-[13px] font-semibold text-[#DC2626] hover:bg-[#DC2626]/10 cursor-pointer"
                    >
                      <AlertTriangle size={16} />
                      Reject Letter
                    </button>
                    <button
                      onClick={() => {
                        setHasFile(false);
                        setOcrComplete(false);
                        setError(null);
                        setSuccess(null);
                      }}
                      className="w-full flex items-center justify-center gap-2 h-10 rounded-lg border border-[#E2E8F0] text-[13px] font-semibold text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer"
                    >
                      Re-scan
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Recent Letters Table */}
        <RecentLettersTable loading={loading} />
      </div>
    </AppShell>
  );
}