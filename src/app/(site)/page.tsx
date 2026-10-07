import React from "react";
import Image from "next/image";
import Link from "next/link";
import { getMilestones, getSiteSettings, getGalleryItems } from "@/lib/content";

export const revalidate = 60;

export default async function HomePage() {
  const [milestones, settings, galleryItems] = await Promise.all([
    getMilestones(),
    getSiteSettings(),
    getGalleryItems(),
  ]);
  return (
    <>
      {/* ============ HERO ============ */}
      <section className="hero on-dark" aria-labelledby="hero-title">
        <Image
          className="hero__bg"
          src="/assets/hero-photo-5.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
        />
        <div className="container">
          <div className="hero__content">
            <p className="eyebrow eyebrow--light">{settings.heroEyebrow}</p>
            <h1 id="hero-title">{settings.heroTitle}</h1>
            <p className="hero__lead">{settings.heroSubtitle}</p>
            <div className="hero__actions">
              <Link className="btn btn-primary" href="/donation">
                Donate Now
              </Link>
              <Link className="btn btn-secondary btn-secondary--light" href="/volunteer">
                Become a Volunteer
              </Link>
            </div>
            {(Boolean(settings.heroFact1) || Boolean(settings.heroFact2) || Boolean(settings.heroFact3)) && (
              <ul className="hero__meta" aria-label="Quick facts">
                {Boolean(settings.heroFact1) && (
                  <li>
                    <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {settings.heroFact1}
                  </li>
                )}
                {Boolean(settings.heroFact2) && (
                  <li>
                    <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                      <rect width="18" height="18" x="3" y="4" rx="2" />
                      <path d="M16 2v4M8 2v4M3 10h18" />
                    </svg>
                    {settings.heroFact2}
                  </li>
                )}
                {Boolean(settings.heroFact3) && (
                  <li>
                    <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                    </svg>
                    {settings.heroFact3}
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>
      </section>

      {/* ============ ABOUT ============ */}
      <section className="section section--white" id="about" aria-labelledby="about-title">
        <div className="container split">
          <div className="about__copy">
            <p className="eyebrow">About Us</p>
            <h2 id="about-title">Where religious theory meets daily practice</h2>
            <p className="lead">
              Ashram Gandhi Puri is a non-formal educational institution that provides deliberate
              religious coaching — balancing the theory learned in formal schools with the practice
              the religion itself calls for.
            </p>
            <p>
              At Ashram Gandhi Puri Klungkung, residents are forged through spiritual sadhana such
              as Puja, Gita chanting, Sarirashrama, Upanishads and Yoga. Students are also
              introduced to organic farming and a healthy, simple lifestyle, so they are ready to
              step into society.
            </p>

            <ul className="pillars" aria-label="What residents practise">
              <li>
                <span className="pillars__icon">
                  <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
                Puja &amp; Gita chanting
              </li>
              <li>
                <span className="pillars__icon">
                  <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
                Yoga &amp; Sarirashrama
              </li>
              <li>
                <span className="pillars__icon">
                  <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
                Upanishads study
              </li>
              <li>
                <span className="pillars__icon">
                  <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
                Organic farming &amp; simple living
              </li>
            </ul>

            <a className="link-arrow" href="#founder">
              <span>Meet our founder</span>
              <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </a>
          </div>

          <figure className="media-frame">
            <Image
              src="/assets/hero-photo-2.jpg"
              alt="Ashram residents, teachers and guests gathered with young dancers inside an open Balinese pavilion"
              width={1068}
              height={801}
              sizes="(max-width: 768px) 100vw, 50vw"
              loading="lazy"
            />
            <div className="media-badge">
              <strong>1997</strong>
              <span>
                Founded in
                <br />
                Klungkung, Bali
              </span>
            </div>
          </figure>
        </div>
      </section>

      {/* ============ IMPACT ============ */}
      <section
        className="section section--dark impact on-dark"
        id="impact"
        aria-labelledby="impact-title"
      >
        <div className="container">
          <div className="section-head">
            <p className="eyebrow eyebrow--light">Our Impact</p>
            <h2 id="impact-title">Nearly three decades of service, in numbers</h2>
            <p>Every figure below comes from activities we have published on this site.</p>
          </div>
          <ul className="stats">
            <li className="stat">
              <p className="stat__value">28+</p>
              <p className="stat__label">Years of service</p>
              <p className="stat__note">Since our founding on 6 September 1997.</p>
            </li>
            <li className="stat">
              <p className="stat__value">25</p>
              <p className="stat__label">Shantisena sent abroad</p>
              <p className="stat__note">Sent to Turkey, Dubai, Poland and India in 2022.</p>
            </li>
            <li className="stat">
              <p className="stat__value">1,000</p>
              <p className="stat__label">Trees planted</p>
              <p className="stat__note">
                Planted in 2024 to protect the environment for the community.
              </p>
            </li>
            <li className="stat">
              <p className="stat__value">30</p>
              <p className="stat__label">Yoga teachers in training</p>
              <p className="stat__note">Joined our 100-hour course in December 2025.</p>
            </li>
          </ul>
        </div>
      </section>

      {/* ============ MILESTONES ============ */}
      <section className="section section--white" id="milestones" aria-labelledby="milestones-title">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Historical Journey</p>
            <h2 id="milestones-title">Important milestones of Ashram Gandhi Puri</h2>
          </div>

          <ol className="timeline">
            {milestones.map((item, idx) => (
              <li key={idx} className="timeline__item">
                <time className="timeline__year" dateTime={item.year}>
                  {item.year}
                </time>
                <span className="timeline__node" aria-hidden="true"></span>
                <article className="card timeline__card">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ============ ACTIVITIES ============ */}
      <section className="section section--tint" id="activities" aria-labelledby="activities-title">
        <div className="container">
          <div className="section-head section-head--split">
            <div>
              <p className="eyebrow">Activities</p>
              <h2 id="activities-title">Life and learning at the ashram</h2>
            </div>
            <Link className="link-arrow" href="/gallery">
              <span>View all activities</span>
              <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="gallery-grid">
            {galleryItems.slice(0, 3).map((item) => (
              <Link key={item.id} className="gallery-card" href="/gallery">
                <div className="gallery-card__media">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={800}
                    height={500}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    loading="lazy"
                  />
                </div>
                <div className="gallery-card__body">
                  <span className="gallery-card__meta">
                    <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                      <rect width="18" height="18" x="3" y="4" rx="2" />
                      <path d="M16 2v4M8 2v4M3 10h18" />
                    </svg>
                    <time dateTime={item.date}>{item.date_display}</time>
                  </span>
                  <h3 className="gallery-card__title">{item.title}</h3>
                  <p className="gallery-card__text">{item.description}</p>
                  <span className="gallery-card__more">
                    See in gallery
                    <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FOUNDER ============ */}
      <section className="section section--white founder" id="founder" aria-labelledby="founder-title">
        <div className="container split split--reverse">
          <div className="founder__copy">
            <p className="eyebrow">{settings.founderEyebrow}</p>
            <h2 id="founder-title">{settings.founderName}</h2>
            <p style={{ whiteSpace: "pre-line" }}>{settings.founderBio}</p>
            <ul className="award-list" aria-label="Awards">
              {settings.founderAwards.map((item, idx) => (
                <li key={idx}>
                  <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="12" cy="8" r="6" />
                    <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
                  </svg>
                  {item.award}
                </li>
              ))}
            </ul>
            <a className="link-arrow" href="#milestones">
              <span>Read the full journey</span>
              <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </a>
          </div>

          <figure className="media-frame split__media">
            <Image
              src="/assets/hero-photo-1.jpg"
              alt="Ida Rsi Putra Manuaba, in white, receiving the Padma Shri award from the President of India"
              width={1080}
              height={700}
              sizes="(max-width: 768px) 100vw, 50vw"
              loading="lazy"
            />
            <figcaption>Receiving the Padma Shri at Rashtrapati Bhavan, 2020.</figcaption>
          </figure>
        </div>
      </section>

      {/* ============ JOIN CTA ============ */}
      <section className="cta-band on-dark" aria-labelledby="cta-title">
        <Image
          className="cta-band__bg"
          src="/assets/hero-photo-3.jpg"
          alt=""
          fill
          sizes="100vw"
          loading="lazy"
        />
        <div className="container">
          <h2 id="cta-title">Be part of the story</h2>
          <p>
            Your gift or your time keeps education, community empowerment and environmental care
            alive at Ashram Gandhi Puri.
          </p>
          <div className="cta-band__actions">
            <Link className="btn btn-primary" href="/donation">
              Donate Now
            </Link>
            <Link className="btn btn-secondary btn-secondary--light" href="/volunteer">
              Become a Volunteer
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
