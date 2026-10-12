"use client";

import { useEffect, useState } from "react";

const revealSelector = "main > section, main .gallery-card, main .timeline__item, main .stat";

export function SiteMotion() {
  useEffect(() => {
    const root = document.documentElement;
    const observer = "IntersectionObserver" in window
      ? new IntersectionObserver((entries, currentObserver) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              currentObserver.unobserve(entry.target);
            }
          }
        }, { threshold: 0.08, rootMargin: "0px 0px -48px 0px" })
      : null;

    const observeReveals = (scope: ParentNode) => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const descendants = Array.from(scope.querySelectorAll<HTMLElement>(revealSelector));
      const candidates = scope instanceof HTMLElement && scope.matches(revealSelector)
        ? [scope, ...descendants]
        : descendants;

      candidates.forEach((element) => {
        element.classList.add("reveal");
        if (element.classList.contains("is-visible")) return;
        if (observer) observer.observe(element);
        else element.classList.add("is-visible");
      });
    };

    root.classList.add("js");
    observeReveals(document);

    const mutations = new MutationObserver((records) => {
      records.forEach(({ addedNodes }) => {
        addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) observeReveals(node);
        });
      });
    });
    const main = document.querySelector("main");
    if (main) mutations.observe(main, { childList: true, subtree: true });

    return () => {
      mutations.disconnect();
      observer?.disconnect();
      root.classList.remove("js");
    };
  }, []);

  return null;
}

export function BackToTopButton({ label }: { label: string }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => setIsVisible(window.scrollY > 480);
    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  return (
    <button
      className={`back-to-top${isVisible ? " is-visible" : ""}`}
      type="button"
      aria-label={label}
      aria-hidden={!isVisible}
      tabIndex={isVisible ? 0 : -1}
      onClick={() => window.scrollTo({
        top: 0,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      })}
    >
      <span>{label}</span>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m6 14 6-6 6 6" />
      </svg>
    </button>
  );
}
