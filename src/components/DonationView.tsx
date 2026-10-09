"use client";

import { useToast } from "@/context/ToastContext";
import type { SiteSettingsData } from "@/types/content";
import React, { useState } from "react";
import DonationModal from "@/components/DonationModal";

interface DonationViewProps {
  settings: SiteSettingsData;
}

export default function DonationView({ settings }: DonationViewProps) {
  const { showToast } = useToast();
  const [copyLabel, setCopyLabel] = useState("Copy account number");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const accountNumber = settings.accountNumber || "1450018046181";

  const handleCopy = () => {
    const done = () => {
      setCopyLabel("Copied!");
      showToast("Nomor rekening berhasil disalin.");
      setTimeout(() => setCopyLabel("Copy account number"), 2000);
    };

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(accountNumber).then(done, () => {
        showToast("Gagal menyalin otomatis. Silakan salin manual.");
      });
    } else {
      const helper = document.createElement("textarea");
      helper.value = accountNumber;
      helper.setAttribute("readonly", "");
      helper.style.position = "absolute";
      helper.style.left = "-9999px";
      document.body.appendChild(helper);
      helper.select();
      try {
        document.execCommand("copy");
        done();
      } catch {
        showToast("Gagal menyalin otomatis. Silakan salin manual.");
      }
      helper.remove();
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="page-hero" aria-labelledby="page-title">
        <div className="container">
          <p className="eyebrow">Dana Punia & Donasi</p>
          <h1 id="page-title">Mari Berbagi Kebaikan & Kebijaksanaan</h1>
          <p>
            Setiap punia dan kebaikan yang Anda berikan mengalir untuk kelangsungan pendidikan
            spiritual, pembinaan santri yoga, dan kelestarian lingkungan Ashram Gandhi Puri.
          </p>
        </div>
      </section>

      {/* Donation Details & Bank Account Info */}
      <section className="section section--tint" aria-label="Donation details">
        <div className="container donate-layout">
          <div className="donate-copy">
            <p className="eyebrow">Penyaluran Dana Punia</p>
            <h2>Menjaga Amanah & Dedikasi Ashram</h2>
            <p>
              Dukungan Anda memberikan napas bagi keberlangsungan pelayanan sosial dan pembinaan
              generasi muda di Ashram Gandhi Puri Sevagram, Klungkung, Bali.
            </p>
            <ul className="check-list">
              <li>
                <span className="check-list__icon">
                  <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
                <span>
                  <strong>Pendidikan Spiritual & Yoga.</strong> Beasiswa dan biaya pembinaan santri
                  pasraman, modul yoga, dan nilai-nilai luhur Mahatma Gandhi.
                </span>
              </li>
              <li>
                <span className="check-list__icon">
                  <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
                <span>
                  <strong>Pemberdayaan Masyarakat & Relawan.</strong> Program pelatihan pemuda, bakti
                  sosial kemanusiaan, serta dialog persaudaraan lintas budaya.
                </span>
              </li>
              <li>
                <span className="check-list__icon">
                  <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
                <span>
                  <strong>Konservasi Lingkungan Organik.</strong> Penanaman pohon, pemeliharaan kebun
                  organik, dan pengelolaan sampah pasraman yang berkelanjutan.
                </span>
              </li>
              <li>
                <span className="check-list__icon">
                  <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
                <span>
                  <strong>Verifikasi Donasi.</strong> Seluruh transfer masuk langsung ke rekening
                  resmi yayasan dan bukti transfer diperiksa oleh bendahara sebelum donasi dikonfirmasi.
                </span>
              </li>
            </ul>
          </div>

          <div className="donation-card">
            <h2>Bagian dari Japa Malamitra</h2>
            <p>{settings.donationSubtitle}</p>

            <div className="bank-info">
              <h3>Transfer ke Rekening Resmi</h3>
              <div className="bank-detail">
                <span className="bank-label">Bank</span>
                <span className="bank-value">{settings.bankName}</span>
              </div>
              <div className="bank-detail">
                <span className="bank-label">Nomor Rekening</span>
                <span className="bank-value" id="account-number">
                  {accountNumber}
                </span>
              </div>
              <div className="bank-detail">
                <span className="bank-label">Nama Pemilik Rekening</span>
                <span className="bank-value">{settings.accountName}</span>
              </div>
              <button
                type="button"
                className="btn btn-secondary btn-sm copy-btn"
                id="copy-btn"
                onClick={handleCopy}
              >
                <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                  <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                </svg>
                <span id="copy-btn-label">{copyLabel}</span>
              </button>
            </div>

            <button
              type="button"
              className="btn btn-primary donate-btn"
              id="donate-btn"
              aria-haspopup="dialog"
              onClick={() => setIsModalOpen(true)}
            >
              Saya sudah transfer — Konfirmasi Donasi
            </button>
            <p className="donation-note">
              Anda akan diminta mengunggah struk atau foto bukti transfer bank.
            </p>
          </div>
        </div>
      </section>

      {/* Modal Konfirmasi Donasi */}
      <DonationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
