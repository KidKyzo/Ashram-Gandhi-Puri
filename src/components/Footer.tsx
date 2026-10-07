"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useToast } from "@/context/ToastContext";
import type { SiteSettingsData } from "@/types/content";
import emailjs from "@emailjs/browser";

interface FooterProps {
  settings?: SiteSettingsData;
}

export default function Footer({ settings }: FooterProps) {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      showToast("Please fill in all fields before sending.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "service_gndy8k8";
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_CONTACT_TEMPLATE_ID || "template_vhmny7r";
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "-thawvZg0wjq1LVEt";
      const staffEmail = process.env.NEXT_PUBLIC_STAFF_EMAIL || settings?.contactEmail || "ashramgandhipuriorg@gmail.com";

      const templateParams = {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        to_email: staffEmail,
        recipient_email: staffEmail,
        to_name: "Ashram Gandhi Puri Staff",
        from_name: formData.name,
        from_email: formData.email,
        reply_to: formData.email,
      };

      await emailjs.send(serviceId, templateId, templateParams, publicKey);

      showToast(
        `Thank you, ${formData.name}! Your message has been sent. We will get back to you soon.`,
        "success"
      );
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Contact form submission error:", error);
      showToast(
        "Could not send message right now. Please try again or contact us directly.",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="site-footer on-dark" id="contact">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link className="brand" href="/" aria-label="Ashram Gandhi Puri — home">
              <img
                className="brand__logo"
                src="/assets/logo-ngo-256.png"
                alt=""
                width={48}
                height={48}
                loading="lazy"
              />
              <span className="brand__name">
                Ashram Gandhi Puri<small>Klungkung · Bali</small>
              </span>
            </Link>
            <p>
              Spiritual education, yoga and community service — nurturing minds, hearts and
              communities since 1997.
            </p>
            <h2 className="footer-heading">Contact</h2>
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
                  >
                    View on Google Maps<span className="sr-only"> (opens in a new tab)</span>
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
                aria-label="Facebook (opens in a new tab)"
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
                aria-label="Instagram (opens in a new tab)"
              >
                <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
            </div>
          </div>

          <nav aria-label="Footer">
            <h2 className="footer-heading">Explore</h2>
            <ul className="footer-list">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/gallery">Gallery</Link>
              </li>
              <li>
                <Link href="/volunteer">Volunteer</Link>
              </li>
              <li>
                <Link href="/donation">Donate</Link>
              </li>
            </ul>
          </nav>

          <div className="footer-form">
            <h2 className="footer-heading" id="footer-form-title">
              Send us a message
            </h2>
            <p>
              Questions about visiting, volunteering or giving? Leave a note and we will reply by
              email.
            </p>
            <form
              className="form contact-form"
              aria-labelledby="footer-form-title"
              onSubmit={handleSubmit}
            >
              <div className="field">
                <label htmlFor="footer-name">Name</label>
                <input
                  className="input"
                  type="text"
                  id="footer-name"
                  name="name"
                  autoComplete="name"
                  placeholder="Your name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="field">
                <label htmlFor="footer-email">Email</label>
                <input
                  className="input"
                  type="email"
                  id="footer-email"
                  name="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="field">
                <label htmlFor="footer-message">Message</label>
                <textarea
                  className="input"
                  id="footer-message"
                  name="message"
                  rows={4}
                  placeholder="How can we help?"
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                ></textarea>
              </div>
              <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send message"}
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
          <p>©2026 Ashram Gandhi Puri. All rights reserved.</p>
          <p>Donations are received by Yayasan Ashram Gandhi Puri.</p>
        </div>
      </div>
    </footer>
  );
}
