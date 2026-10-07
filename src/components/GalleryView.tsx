"use client";

import type { GalleryItem } from "@/types/content";
import Image from "next/image";
import { useMemo, useState } from "react";

export default function GalleryView({ items }: { items: GalleryItem[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const filteredData = useMemo(() => {
    const list = items.filter((item) =>
      item.title.toLowerCase().includes(searchTerm.trim().toLowerCase())
    );

    return list.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });
  }, [items, searchTerm, sortOrder]);

  return (
    <>
      <section className="page-hero on-dark" aria-labelledby="page-title">
        <Image
          className="page-hero__bg"
          src="/assets/hero-photo-4.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
        />
        <div className="container">
          <p className="eyebrow eyebrow--light">Gallery</p>
          <h1 id="page-title">Activities &amp; Gallery</h1>
          <p>
            Stories from the ashram — retreats, trainings, celebrations and acts of service by our
            community.
          </p>
        </div>
      </section>

      <section className="section section--tint" aria-label="Browse activities">
        <div className="container">
          <form className="gallery-controls" role="search" onSubmit={(e) => e.preventDefault()}>
            <div className="field search-field">
              <label htmlFor="search-input">Search activities</label>
              <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                className="input"
                type="search"
                id="search-input"
                placeholder="Search by title…"
                autoComplete="off"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="sort-select">Sort by</label>
              <select
                className="input"
                id="sort-select"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest")}
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
              </select>
            </div>
          </form>

          <p className="gallery-status" id="gallery-status" role="status" aria-live="polite">
            Showing {filteredData.length} of {items.length} activities
          </p>

          <div className="gallery-grid" id="gallery-container">
            {filteredData.length === 0 ? (
              <div className="gallery-empty">
                <h2>No activities found</h2>
                <p>Try a different search term to see more of our activities.</p>
              </div>
            ) : (
              filteredData.map((item) => {
                const isSafeUrl =
                  typeof item.source === "string" &&
                  (item.source.startsWith("https://") || item.source.startsWith("http://"));
                const safeHref = isSafeUrl ? item.source : "#";

                return (
                  <a
                    key={item.id}
                    href={safeHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gallery-card"
                  >
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
                      Read the story<span className="sr-only"> (opens in a new tab)</span>
                      <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </a>
              );
            })
            )}
          </div>
        </div>
      </section>
    </>
  );
}
