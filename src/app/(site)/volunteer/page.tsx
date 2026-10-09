"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useToast } from "@/context/ToastContext";

export default function VolunteerPage() {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    nationality: "",
  });
  const [honeypot, setHoneypot] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone || !formData.nationality) {
      showToast("Please fill in all fields before submitting.", "error");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showToast("Please provide a valid email address.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "volunteer", ...formData, honeypot }),
      });
      if (!response.ok) throw new Error("Volunteer application could not be sent.");

      showToast(
        `Thank you, ${formData.name}! Your volunteer application has been submitted. We will contact you soon.`,
        "success"
      );
      setFormData({ name: "", email: "", phone: "", nationality: "" });
      setHoneypot("");
    } catch (error) {
      console.error("Volunteer application submission error:", error);
      showToast(
        "Could not send application right now. Please try again or email us directly at ashramgandhipuriorg@gmail.com.",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section className="page-hero" aria-labelledby="page-title">
        <div className="container">
          <p className="eyebrow">Vishramapuri Volunteer Program</p>
          <h1 id="page-title">Become a Volunteer</h1>
          <p>
            Join our Vishramapuri Volunteer Program to empower the community and make a positive
            impact.
          </p>
        </div>
      </section>

      <section className="section section--tint" aria-label="Volunteer application">
        <div className="container volunteer-layout">
          <div className="volunteer-media">
            <figure>
              <Image
                src="/assets/volunteer-program.jpg"
                alt="Collage of volunteers and teachers sharing time together in the ashram gardens"
                width={1400}
                height={788}
                sizes="(max-width: 768px) 100vw, 50vw"
                loading="lazy"
              />
              <figcaption>Volunteers and teachers at Ashram Gandhi Puri Sevagram.</figcaption>
            </figure>

            <h2>What volunteering looks like</h2>
            <ul className="check-list">
              <li>
                <span className="check-list__icon">
                  <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
                Join Yoga and Dharma Talk sessions led by experienced teachers.
              </li>
              <li>
                <span className="check-list__icon">
                  <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
                Live alongside residents in a healthy, simple ashram lifestyle.
              </li>
              <li>
                <span className="check-list__icon">
                  <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
                Support community and environmental programs, from organic farming to tree planting.
              </li>
            </ul>
          </div>

          <div className="form-card">
            <h2 id="volunteer-form-title">Register as a volunteer</h2>
            <p>Fill out the form below and we will contact you by email.</p>
            <form
              className="form volunteer-form"
              aria-labelledby="volunteer-form-title"
              onSubmit={handleSubmit}
            >
              <div style={{ display: "none" }} aria-hidden="true">
                <label htmlFor="website">Leave empty</label>
                <input
                  type="text"
                  id="website"
                  name="website"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>
              <div className="field">
                <label htmlFor="name">Full name</label>
                <input
                  className="input"
                  type="text"
                  id="name"
                  name="name"
                  autoComplete="name"
                  placeholder="Your name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="field">
                <label htmlFor="email">Email address</label>
                <input
                  className="input"
                  type="email"
                  id="email"
                  name="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="field">
                <label htmlFor="phone">Phone number</label>
                <input
                  className="input"
                  type="tel"
                  id="phone"
                  name="phone"
                  autoComplete="tel"
                  placeholder="+62 …"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="field">
                <label htmlFor="nationality">Nationality</label>
                <input
                  className="input"
                  type="text"
                  id="nationality"
                  name="nationality"
                  autoComplete="country-name"
                  placeholder="Your nationality"
                  required
                  value={formData.nationality}
                  onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                />
              </div>
              <button className="btn btn-primary btn-block" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit application"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
