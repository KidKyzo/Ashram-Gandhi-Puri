"use client";

import { useTranslation } from "@/context/LocaleContext";

import { useToast } from "@/context/ToastContext";
import type { SiteSettingsData } from "@/types/content";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

interface FooterProps {
  settings?: SiteSettingsData;
}

export default function Footer({ settings }: FooterProps) {
  const { locale, t, href } = useTranslation();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [honeypot, setHoneypot] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      showToast(t("Please fill in all fields before sending."), "error");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showToast(t("Please enter a valid email address."), "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "contact", ...formData, honeypot }),
      });
      if (!response.ok) throw new Error("Contact message could not be sent.");

      showToast(
        locale === "id"
          ? `Terima kasih, ${formData.name}! Pesan Anda telah dikirim. Kami akan segera menghubungi Anda.`
          : `Thank you, ${formData.name}! Your message has been sent. We will get back to you soon.`,
        "success"
      );
      setFormData({ name: "", email: "", message: "" });
      setHoneypot("");
    } catch (error) {
      console.error("Contact form submission error:", error);
      showToast(
        t("Could not send message right now. Please try again or contact us directly."),
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="site-footer" id="contact">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link className="brand" href={href("/")} aria-label={t("Ashram Gandhi Puri — home")}>
              <Image
                className="brand__logo"
                src="/assets/logo-ngo-96.webp"
                alt={t("Ashram Gandhi Puri Logo")}
                width={48}
                height={48}
                loading="lazy"
              />
              <span className="brand__name">{t(" Ashram Gandhi Puri")}<small>{t("Klungkung · Bali")}</small>
              </span>
            </Link>
            <p>{t(" Spiritual education, yoga and community service — nurturing minds, hearts and communities since 1997. ")}</p>
            <h2 className="footer-heading">{t("Contact")}</h2>
            <ul className="contact-list">
              <li>
                <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <address style={{ whiteSpace: "pre-line" }}>
                  {settings?.address || "Ashram Gandhi Puri Sevagram\nJalan Raya Gunaksa 99, Klungkung, Indonesia"}
                  {"\n"}
                  <a
                    href={
                      settings?.googleMapsUrl ||
                      "https://www.google.com/maps/search/?api=1&query=Ashram+Gandhi+Puri+Sevagram"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >{t(" View on Google Maps")}<span className="sr-only">{t(" (opens in a new tab)")}</span>
                  </a>
                </address>
              </li>
              <li>
                <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <a
                  href={`mailto:${
                    settings?.contactEmail || "ashramgandhipuriorg@gmail.com"
                  }`}
                >
                  {settings?.contactEmail || "ashramgandhipuriorg@gmail.com"}
                </a>
              </li>
            </ul>
            <div className="socials">
              <a
                href={
                  settings?.facebookUrl ||
                  "https://www.facebook.com/profile.php?id=100078784072776"
                }
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t("Facebook (opens in a new tab)")}
              >
                <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a
                href={
                  settings?.instagramUrl ||
                  "https://www.instagram.com/ashramgandhipuri/"
                }
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t("Instagram (opens in a new tab)")}
              >
                <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
            </div>
          </div>

          <nav aria-label={t("Footer")}>
            <h2 className="footer-heading">{t("Explore")}</h2>
            <ul className="footer-list">
              <li>
                <Link href={href("/")}>{t("Home")}</Link>
              </li>
              <li>
                <Link href={href("/gallery")}>{t("Gallery")}</Link>
              </li>
              <li>
                <Link href={href("/volunteer")}>{t("Volunteer")}</Link>
              </li>
              <li>
                <Link href={href("/donation")}>{t("Donate")}</Link>
              </li>
            </ul>
          </nav>

          <div className="footer-form">
            <h2 className="footer-heading" id="footer-form-title">{t(" Send us a message ")}</h2>
            <p>{t(" Questions about visiting, volunteering or giving? Leave a note and we will reply by email. ")}</p>
            <form
              className="form contact-form"
              aria-labelledby="footer-form-title"
              onSubmit={handleSubmit}
            >
              <div style={{ display: "none" }} aria-hidden="true">
                <label htmlFor="company_website">{t("Leave empty")}</label>
                <input
                  type="text"
                  id="company_website"
                  name="company_website"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>
              <div className="field">
                <label htmlFor="footer-name">{t("Name")}</label>
                <input
                  className="input"
                  type="text"
                  id="footer-name"
                  name="name"
                  autoComplete="name"
                  placeholder={t("Your name")}
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="field">
                <label htmlFor="footer-email">{t("Email")}</label>
                <input
                  className="input"
                  type="email"
                  id="footer-email"
                  name="email"
                  autoComplete="email"
                  placeholder={t("you@example.com")}
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="field">
                <label htmlFor="footer-message">{t("Message")}</label>
                <textarea
                  className="input"
                  id="footer-message"
                  name="message"
                  rows={4}
                  placeholder={t("How can we help?")}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                ></textarea>
              </div>
              <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? t("Sending...") : t("Send message")}
                <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="m22 2-7 20-4-9-9-4Z" />
                  <path d="M22 2 11 13" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom__inner">
          <p>{t("©2026 Ashram Gandhi Puri. All rights reserved.")}</p>
          <p>{t("Donations are received by Yayasan Ashram Gandhi Puri.")}</p>
        </div>
      </div>
    </footer>
  );
}
