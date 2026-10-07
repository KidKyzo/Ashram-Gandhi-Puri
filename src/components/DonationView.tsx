"use client";

import React, { useState } from "react";
import { useToast } from "@/context/ToastContext";
import type { SiteSettingsData } from "@/types/content";

interface DonationViewProps {
  settings: SiteSettingsData;
}

export default function DonationView({ settings }: DonationViewProps) {
  const { showToast } = useToast();
  const [copyLabel, setCopyLabel] = useState("Copy account number");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [donorAmount, setDonorAmount] = useState("");
  const [proofFile, setProofFile] = useState<File | null>(null);

  const accountNumber = settings.accountNumber || "1450018046181";

  const handleCopy = () => {
    const done = () => {
      setCopyLabel("Copied!");
      showToast("Account number copied to clipboard.");
      setTimeout(() => setCopyLabel("Copy account number"), 2000);
    };

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(accountNumber).then(done, () => {
        showToast("Could not copy automatically. Please copy manually.");
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
        showToast("Could not copy automatically. Please copy manually.");
      }
      helper.remove();
    }
  };

  const handleConfirmDonation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorName || !donorEmail || !donorAmount) {
      showToast("Please fill in all fields before confirming.");
      return;
    }
    if (!proofFile) {
      showToast("Please upload your transfer proof before confirming.");
      return;
    }

    const numAmount = parseInt(donorAmount, 10);
    const formatted = isNaN(numAmount) ? donorAmount : numAmount.toLocaleString("id-ID");

    showToast(
      `Thank you, ${donorName}! Your donation of IDR ${formatted} has been received. We will verify your transfer proof (${proofFile.name}) and send a confirmation to ${donorEmail}.`
    );

    setDonorName("");
    setDonorEmail("");
    setDonorAmount("");
    setProofFile(null);
    setIsModalOpen(false);
  };

  return (
    <>
      <section className="page-hero on-dark" aria-labelledby="page-title">
        <img
          className="page-hero__bg"
          src="/assets/hero-photo-3.jpg"
          alt=""
          width="1280"
          height="471"
        />
        <div className="container">
          <p className="eyebrow eyebrow--light">Donate</p>
          <h1 id="page-title">Let&apos;s Share Kindness</h1>
          <p>
            Every donation, no matter how small, brings a big change for the future of those in
            need.
          </p>
        </div>
      </section>

      <section className="section section--tint" aria-label="Donation details">
        <div className="container donate-layout">
          <div className="donate-copy">
            <p className="eyebrow">Where your gift goes</p>
            <h2>Keeping the ashram&apos;s work going</h2>
            <p>
              Your help means a lot for the continuity of education programs, community
              empowerment, and environmental conservation at Ashram Gandhi Puri.
            </p>
            <ul className="check-list">
              <li>
                <span className="check-list__icon">
                  <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
                <span>
                  <strong>Education programs.</strong> Spiritual education, yoga and noble values
                  for young people.
                </span>
              </li>
              <li>
                <span className="check-list__icon">
                  <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
                <span>
                  <strong>Community empowerment.</strong> Volunteer programs and training open to
                  people from many regions.
                </span>
              </li>
              <li>
                <span className="check-list__icon">
                  <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
                <span>
                  <strong>Environmental conservation.</strong> Tree planting and organic farming
                  around the ashram.
                </span>
              </li>
              <li>
                <span className="check-list__icon">
                  <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
                <span>
                  <strong>Transparent giving.</strong> Transfers go straight to the foundation
                  account shown here, and we confirm each donation by email after verifying your
                  transfer proof.
                </span>
              </li>
            </ul>
          </div>

          <div className="donation-card">
            <h2>Be a part of Japa Malamitra</h2>
            <p>{settings.donationSubtitle}</p>

            <div className="bank-info">
              <h3>Transfer to our bank account</h3>
              <div className="bank-detail">
                <span className="bank-label">Bank</span>
                <span className="bank-value">{settings.bankName}</span>
              </div>
              <div className="bank-detail">
                <span className="bank-label">Account number</span>
                <span className="bank-value" id="account-number">
                  {accountNumber}
                </span>
              </div>
              <div className="bank-detail">
                <span className="bank-label">Account name</span>
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
              I have transferred — confirm donation
            </button>
            <p className="donation-note">You will be asked to upload your transfer receipt.</p>
          </div>
        </div>
      </section>

      {/* Donation Modal */}
      {isModalOpen && (
        <div
          id="donation-modal"
          className="modal-overlay active"
          aria-hidden="false"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div
            className="modal-box"
            role="dialog"
            aria-modal="true"
            aria-labelledby="donation-modal-title"
          >
            <button
              className="modal-close"
              id="modal-close-btn"
              type="button"
              aria-label="Close donation form"
              onClick={() => setIsModalOpen(false)}
            >
              <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>

            <h2 id="donation-modal-title">Donation form</h2>
            <p>Please fill in the details below to confirm your donation.</p>

            <form className="form" id="donation-form" onSubmit={handleConfirmDonation}>
              <div className="field">
                <label htmlFor="donor-name">Full name</label>
                <input
                  className="input"
                  type="text"
                  id="donor-name"
                  autoComplete="name"
                  placeholder="Your full name"
                  required
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="donor-email">Email address</label>
                <input
                  className="input"
                  type="email"
                  id="donor-email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  required
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="donor-amount">Donation amount (IDR)</label>
                <input
                  className="input"
                  type="number"
                  id="donor-amount"
                  inputMode="numeric"
                  placeholder="e.g. 50000"
                  min="1"
                  required
                  value={donorAmount}
                  onChange={(e) => setDonorAmount(e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="donor-proof">Upload transfer proof</label>
                <input
                  className="input"
                  type="file"
                  id="donor-proof"
                  accept="image/*"
                  required
                  aria-describedby="proof-hint"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setProofFile(e.target.files[0]);
                    }
                  }}
                />
                <span className="field-hint" id="proof-hint">
                  Please upload a photo or screenshot of your bank transfer receipt.
                </span>
              </div>
              <button type="submit" className="btn btn-primary btn-block">
                Confirm donation
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
