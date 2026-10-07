"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setIsOpen(false);
  }

  return (
    <header className={`site-header ${isScrolled ? "is-scrolled" : ""}`} id="site-header">
      <div className="container site-header__inner">
        <Link className="brand" href="/" aria-label="Ashram Gandhi Puri — home">
          <Image
            className="brand__logo"
            src="/assets/logo-ngo-96.webp"
            alt="Ashram Gandhi Puri Logo"
            width={48}
            height={48}
            priority
          />
          <span className="brand__name">
            Ashram Gandhi Puri<small>Klungkung · Bali</small>
          </span>
        </Link>
        <button
          className="nav-toggle"
          id="nav-toggle"
          type="button"
          aria-expanded={isOpen}
          aria-controls="main-nav"
          aria-label="Toggle navigation menu"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="nav-toggle__bars" aria-hidden="true"></span>
        </button>
        <nav className={`site-nav ${isOpen ? "is-open" : ""}`} id="main-nav" aria-label="Primary">
          <ul className="nav-links">
            <li>
              <Link href="/" aria-current={pathname === "/" ? "page" : undefined}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/gallery" aria-current={pathname === "/gallery" ? "page" : undefined}>
                Gallery
              </Link>
            </li>
            <li>
              <Link href="/volunteer" aria-current={pathname === "/volunteer" ? "page" : undefined}>
                Volunteer
              </Link>
            </li>
            <li className="nav-cta">
              <Link className="btn btn-primary btn-sm" href="/donation">
                Donate
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
