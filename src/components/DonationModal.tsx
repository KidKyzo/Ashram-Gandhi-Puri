"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Upload, CheckCircle2, Loader2 } from "lucide-react";
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
  const [category, setCategory] = useState("Pendidikan & Yoga");
  const [notes, setNotes] = useState("");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const focusableSelector = 'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href]';
    modalRef.current?.querySelector<HTMLElement>(focusableSelector)?.focus();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isSubmitting) {
        onClose();
      }
      if (e.key === "Tab") {
        const controls = modalRef.current?.querySelectorAll<HTMLElement>(focusableSelector);
        if (!controls?.length) return;
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
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
      previousFocus?.focus();
    };
  }, [isOpen, onClose, isSubmitting]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !amount) {
      showToast("Mohon lengkapi semua data wajib sebelum konfirmasi.", "error");
      return;
    }
    if (!proofFile) {
      showToast("Mohon lampirkan foto/screenshot bukti transfer bank.", "error");
      return;
    }

    const numAmount = parseInt(amount, 10);
    if (isNaN(numAmount) || numAmount < 10000) {
      showToast("Nominal donasi minimal Rp 10.000.", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("amount", amount);
      formData.append("category", category);
      formData.append("notes", notes);
      formData.append("proof", proofFile);

      const response = await fetch("/api/donations/confirm", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Gagal memproses konfirmasi donasi.");
      }

      const formattedAmount = numAmount.toLocaleString("id-ID");

      if (!result.donorEmailSent) {
        showToast(
          `Konfirmasi donasi IDR ${formattedAmount} telah dikirim ke bendahara (Ref: ${result.transactionId}), tetapi email ke ${email} belum terkirim. Mohon hubungi yayasan jika memerlukan bantuan.`,
          "info"
        );
      } else {
        showToast(
          `Matur Suksma, ${name}! Konfirmasi donasi IDR ${formattedAmount} diterima. Email penerimaan telah dikirim ke ${email}; transfer masih menunggu verifikasi bendahara.`,
          "success"
        );
      }

      // Reset form and close
      setName("");
      setEmail("");
      setAmount("");
      setCategory("Pendidikan & Yoga");
      setNotes("");
      setProofFile(null);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan koneksi";
      showToast(msg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="donation-modal fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="donation-modal-title"
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-lg bg-white rounded-lg shadow-2xl border border-[var(--color-border)] overflow-hidden animate-in zoom-in-95 duration-200 my-auto max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="bg-white border-b border-[var(--color-border)] text-[var(--color-text)] px-6 py-5 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h2 id="donation-modal-title" className="donation-modal__title font-heading font-semibold text-xl">
              Konfirmasi Donasi / Dana Punia
            </h2>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
              Yayasan Ashram Gandhi Puri Sevagram
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-tint)] transition-colors cursor-pointer"
            aria-label="Tutup form donasi"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-gray-800">
          <div>
            <label htmlFor="donor-name" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Nama Lengkap / Inisial Donatur <span className="text-red-500">*</span>
            </label>
            <input
              id="donor-name"
              type="text"
              required
              placeholder="Contoh: Ketut Suastika / Hamba Tuhan"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-md border border-gray-200 focus:border-[var(--color-deep)] focus:ring-2 focus:ring-[var(--color-deep)] text-sm transition-all outline-none"
            />
          </div>

          <div>
            <label htmlFor="donor-email" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Alamat Email (Untuk Tanda Terima) <span className="text-red-500">*</span>
            </label>
            <input
              id="donor-email"
              type="email"
              required
              placeholder="emailanda@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-md border border-gray-200 focus:border-[var(--color-deep)] focus:ring-2 focus:ring-[var(--color-deep)] text-sm transition-all outline-none"
            />
            <p className="text-[11px] text-[var(--color-text-muted)] mt-1">
              Data donatur dan bukti transfer digunakan untuk memeriksa konfirmasi donasi.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="donor-amount" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Nominal Transfer (IDR) <span className="text-red-500">*</span>
              </label>
              <input
                id="donor-amount"
                type="number"
                min="10000"
                step="5000"
                required
                placeholder="Contoh: 100000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-2.5 rounded-md border border-gray-200 focus:border-[var(--color-deep)] focus:ring-2 focus:ring-[var(--color-deep)] text-sm transition-all outline-none"
              />
            </div>

            <div>
              <label htmlFor="donor-category" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Peruntukan Program
              </label>
              <select
                id="donor-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-md border border-gray-200 focus:border-[var(--color-deep)] focus:ring-2 focus:ring-[var(--color-deep)] text-sm transition-all outline-none bg-white cursor-pointer"
              >
                <option value="Pendidikan & Yoga">Pendidikan & Yoga</option>
                <option value="Operasional Ashram">Operasional Ashram</option>
                <option value="Konservasi Lingkungan">Konservasi Lingkungan</option>
                <option value="Dana Punia Umum">Dana Punia Umum</option>
                <option value="Bakti Sosial & Kemanusiaan">Bakti Sosial & Kemanusiaan</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="donor-notes" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Doa / Pesan / Catatan (Opsional)
            </label>
            <input
              id="donor-notes"
              type="text"
              placeholder="Contoh: Untuk beasiswa santri yoga pasraman"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2.5 rounded-md border border-gray-200 focus:border-[var(--color-deep)] focus:ring-2 focus:ring-[var(--color-deep)] text-sm transition-all outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Upload Bukti Transfer Bank <span className="text-red-500">*</span>
            </label>
            <div className="relative border-2 border-dashed border-[var(--color-border)] rounded-md p-4 hover:border-[var(--color-border)] bg-[var(--color-tint)] transition-colors text-center cursor-pointer">
              <input
                id="donor-proof"
                type="file"
                accept="image/jpeg,image/png,image/webp,application/pdf"
                required
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setProofFile(e.target.files[0]);
                  }
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center gap-1.5">
                <Upload className="w-7 h-7 text-[var(--color-primary-dark)]" />
                {proofFile ? (
                  <span className="text-xs font-medium text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 inline" />
                    {proofFile.name}
                  </span>
                ) : (
                  <>
                    <span className="text-xs font-medium text-[var(--color-text)]">
                      Klik untuk mengunggah tangkapan layar / struk transfer
                    </span>
                    <span className="text-[11px] text-gray-500">
                      Format didukung: JPG, PNG, WEBP, PDF (Maks. 5 MB)
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-md font-heading font-semibold text-[var(--color-deep)] bg-[var(--color-primary)] hover:bg-[#EAA05A] shadow-none transition-all duration-200 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memproses & Mengirimkan Email...</span>
                </>
              ) : (
                <span>Konfirmasi Donasi Saya</span>
              )}
            </button>
            <p className="text-[11px] text-center text-gray-500 mt-2">
              Bendahara akan memeriksa mutasi bank sebelum mengonfirmasi donasi Anda.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
