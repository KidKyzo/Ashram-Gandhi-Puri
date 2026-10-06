"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Upload, CheckCircle2 } from "lucide-react";
import { useToast } from "@/context/ToastContext";

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DonationModal({ isOpen, onClose }: DonationModalProps) {
  const { showToast } = useToast();
  const modalRef = useRef<HTMLDivElement>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [proofFile, setProofFile] = useState<File | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !amount) {
      showToast("Please fill in all fields before confirming.", "error");
      return;
    }
    if (!proofFile) {
      showToast("Please upload your transfer proof receipt.", "error");
      return;
    }

    const numAmount = parseInt(amount, 10);
    const formattedAmount = isNaN(numAmount)
      ? amount
      : numAmount.toLocaleString("id-ID");

    showToast(
      `Thank you, ${name}! Your donation of IDR ${formattedAmount} has been registered. We will verify your proof (${proofFile.name}) and send confirmation to ${email}.`,
      "success"
    );

    // Reset form and close
    setName("");
    setEmail("");
    setAmount("");
    setProofFile(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="donation-modal-title"
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-purple-100 overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="bg-[#2E1065] text-white px-6 py-5 flex items-center justify-between">
          <div>
            <h2 id="donation-modal-title" className="font-heading font-semibold text-xl">
              Confirm Your Donation
            </h2>
            <p className="text-xs text-purple-200 mt-0.5">
              Yayasan Ashram Gandhi Puri Klungkung
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-purple-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-gray-800">
          <div>
            <label htmlFor="donor-name" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Full Name
            </label>
            <input
              id="donor-name"
              type="text"
              required
              placeholder="e.g. Bagoes Ariel"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#f1ad66] focus:ring-2 focus:ring-purple-200 text-sm transition-all outline-none"
            />
          </div>

          <div>
            <label htmlFor="donor-email" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <input
              id="donor-email"
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#f1ad66] focus:ring-2 focus:ring-purple-200 text-sm transition-all outline-none"
            />
          </div>

          <div>
            <label htmlFor="donor-amount" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Donation Amount (IDR)
            </label>
            <input
              id="donor-amount"
              type="number"
              min="1"
              required
              placeholder="e.g. 100000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#f1ad66] focus:ring-2 focus:ring-purple-200 text-sm transition-all outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Upload Transfer Proof
            </label>
            <div className="relative border-2 border-dashed border-purple-200 rounded-xl p-4 hover:border-purple-400 bg-purple-50/50 transition-colors text-center cursor-pointer">
              <input
                id="donor-proof"
                type="file"
                accept="image/*,.pdf"
                required
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setProofFile(e.target.files[0]);
                  }
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center gap-1.5">
                <Upload className="w-7 h-7 text-[#f1ad66]" />
                {proofFile ? (
                  <span className="text-xs font-medium text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 inline" />
                    {proofFile.name}
                  </span>
                ) : (
                  <>
                    <span className="text-xs font-medium text-purple-900">
                      Click to upload transfer screenshot or receipt
                    </span>
                    <span className="text-[11px] text-gray-500">
                      Supports JPG, PNG, WEBP, PDF
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl font-heading font-semibold text-white bg-[#CA8A04] hover:bg-[#B45309] shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
            >
              Confirm Donation Receipt
            </button>
            <p className="text-[11px] text-center text-gray-500 mt-2">
              Our treasurer will verify and email an official donation certificate.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
