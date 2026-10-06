// ============================================================
// MAIN.JS - JavaScript for Ashram Gandhi Puri Website
// ============================================================
// Shared by all pages. Each section is clearly labeled so you can
// easily find and modify specific features.
// ============================================================

// Initialize EmailJS (the EmailJS SDK is loaded before this file in each page)
if (typeof emailjs !== "undefined") {
  emailjs.init({
    // Replace with your actual EmailJS Public Key
    publicKey: "-thawvZg0wjq1LVEt",
  });
}

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

// ------------------------------------------------------------
// 1. MOBILE NAVIGATION (used on ALL pages)
//    - Toggles the menu, keeps aria-expanded in sync
//    - Closes on Escape, link click, or when resized to desktop
// ------------------------------------------------------------
const navToggle = document.getElementById("nav-toggle");
const mainNav = document.getElementById("main-nav");

function setNavOpen(open) {
  if (!navToggle || !mainNav) return;
  mainNav.classList.toggle("is-open", open);
  navToggle.setAttribute("aria-expanded", String(open));
}

if (navToggle && mainNav) {
  navToggle.addEventListener("click", function () {
    setNavOpen(navToggle.getAttribute("aria-expanded") !== "true");
  });

  mainNav.addEventListener("click", function (event) {
    if (event.target.closest("a")) setNavOpen(false);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && mainNav.classList.contains("is-open")) {
      setNavOpen(false);
      navToggle.focus();
    }
  });

  window.matchMedia("(min-width: 900px)").addEventListener("change", function (e) {
    if (e.matches) setNavOpen(false);
  });
}

// ------------------------------------------------------------
// 2. HEADER SHADOW ON SCROLL (used on ALL pages)
// ------------------------------------------------------------
const siteHeader = document.getElementById("site-header");

if (siteHeader) {
  const updateHeader = function () {
    siteHeader.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
}

// ------------------------------------------------------------
// 3. FOOTER INQUIRY FORM (used on ALL pages)
//    - Sends the message with EmailJS and shows a toast
// ------------------------------------------------------------
const contactForm = document.querySelector(".contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Stop the page from reloading

    const name = contactForm.elements["name"].value.trim();
    const btn = contactForm.querySelector('button[type="submit"]');
    const originalBtnHTML = btn.innerHTML;
    btn.disabled = true;
    btn.textContent = "Sending...";

    if (typeof emailjs === "undefined") {
      showToast("Failed to send the message. Please try again later.");
      btn.disabled = false;
      btn.innerHTML = originalBtnHTML;
      return;
    }

    emailjs
      .sendForm("service_gndy8k8", "template_vhmny7r", contactForm, {
        publicKey: "-thawvZg0wjq1LVEt",
      })
      .then(() => {
        showToast(
          "Thank you, " + name + "! Your message has been sent. We will get back to you soon.",
        );
        contactForm.reset();
      })
      .catch((error) => {
        showToast("Failed to send the message. Please try again later.");
        console.error("EmailJS Error:", error);
      })
      .finally(() => {
        btn.disabled = false;
        btn.innerHTML = originalBtnHTML;
      });
  });
}

// ------------------------------------------------------------
// 4. VOLUNTEER FORM (used on volunteer.html)
//    - Sends the application with EmailJS and shows a toast
// ------------------------------------------------------------
const volunteerForm = document.querySelector(".volunteer-form");

if (volunteerForm) {
  volunteerForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = volunteerForm.elements["name"].value.trim();
    const btn = volunteerForm.querySelector('button[type="submit"]');
    const originalBtnText = btn.textContent;
    btn.disabled = true;
    btn.textContent = "Submitting...";

    if (typeof emailjs === "undefined") {
      showToast("Failed to submit application. Please try again later.");
      btn.disabled = false;
      btn.textContent = originalBtnText;
      return;
    }

    emailjs
      .sendForm("service_gndy8k8", "template_wforxm1", volunteerForm, {
        publicKey: "-thawvZg0wjq1LVEt",
      })
      .then(() => {
        showToast(
          "Thank you, " + name + "! Your volunteer application has been submitted. We will contact you soon.",
        );
        volunteerForm.reset();
      })
      .catch((error) => {
        showToast("Failed to submit application. Please try again later.");
        console.error("EmailJS Error:", error);
      })
      .finally(() => {
        btn.disabled = false;
        btn.textContent = originalBtnText;
      });
  });
}

// ------------------------------------------------------------
// 5. DONATION MODAL (used on donation.html)
//    - Opens an accessible dialog when the confirm button is clicked
//    - Closes with the X button, Escape, or a click on the backdrop
//    - Keeps keyboard focus inside the dialog while it is open
//    - Validates the form (name, email, amount, transfer proof)
// ------------------------------------------------------------
const donateBtn = document.getElementById("donate-btn");
const donationModal = document.getElementById("donation-modal");
const closeBtn = document.getElementById("modal-close-btn");
const donationForm = document.getElementById("donation-form");
const copyBtn = document.getElementById("copy-btn");
const copyBtnLabel = document.getElementById("copy-btn-label");
const accountNumber = document.getElementById("account-number");

let modalOpener = null;

function getModalFocusable() {
  return donationModal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  );
}

function openModal() {
  modalOpener = document.activeElement;
  donationModal.classList.add("active");
  donationModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  const first = document.getElementById("donor-name");
  if (first) first.focus();
}

function closeModal() {
  donationModal.classList.remove("active");
  donationModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  if (modalOpener) modalOpener.focus();
}

if (donateBtn && donationModal) {
  donateBtn.addEventListener("click", openModal);

  if (closeBtn) closeBtn.addEventListener("click", closeModal);

  donationModal.addEventListener("click", function (event) {
    if (event.target === donationModal) closeModal();
  });

  document.addEventListener("keydown", function (event) {
    if (!donationModal.classList.contains("active")) return;

    if (event.key === "Escape") {
      closeModal();
    } else if (event.key === "Tab") {
      const items = getModalFocusable();
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
}

if (copyBtn && accountNumber && copyBtnLabel) {
  copyBtn.addEventListener("click", function () {
    const text = accountNumber.textContent.trim();
    const done = function () {
      copyBtnLabel.textContent = "Copied!";
      showToast("Account number copied to clipboard.");
      setTimeout(function () {
        copyBtnLabel.textContent = "Copy account number";
      }, 2000);
    };

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done, function () {
        showToast("Could not copy automatically. Please copy the number manually.");
      });
    } else {
      // Fallback for non-secure contexts (e.g. opening the file directly)
      const helper = document.createElement("textarea");
      helper.value = text;
      helper.setAttribute("readonly", "");
      helper.style.position = "absolute";
      helper.style.left = "-9999px";
      document.body.appendChild(helper);
      helper.select();
      try {
        document.execCommand("copy");
        done();
      } catch (err) {
        showToast("Could not copy automatically. Please copy the number manually.");
      }
      helper.remove();
    }
  });
}

if (donationForm) {
  donationForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const name = document.getElementById("donor-name").value.trim();
    const email = document.getElementById("donor-email").value.trim();
    const amount = document.getElementById("donor-amount").value.trim();
    const proofInput = document.getElementById("donor-proof");
    const proofFile = proofInput.files[0];

    // Check if any field is empty OR no file was uploaded
    if (name === "" || email === "" || amount === "") {
      showToast("Please fill in all fields before confirming.");
    } else if (!proofFile) {
      showToast("Please upload your transfer proof before confirming.");
    } else {
      // All fields are filled and a file was uploaded: show a thank-you message
      showToast(
        "Thank you, " + name + "!" +
          " Your donation of IDR " + parseInt(amount, 10).toLocaleString("id-ID") +
          " has been received. We will verify your transfer proof (" + proofFile.name + ")" +
          " and send a confirmation to " + email + ".",
      );
      donationForm.reset();
      closeModal();
    }
  });
}

// ------------------------------------------------------------
// 6. SCROLL REVEAL (used on index.html)
//    - Fades sections in as they enter the viewport
//    - Content is visible by default if JS or IntersectionObserver is missing
// ------------------------------------------------------------
const revealItems = document.querySelectorAll(".reveal");

if (revealItems.length) {
  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach(function (el) {
      el.classList.add("is-visible");
    });
  } else {
    const revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const el = entry.target;
            el.classList.add("is-visible");
            observer.unobserve(el);
            // After the entrance finishes, hand control back to the element's own
            // hover/focus transitions.
            const delay = parseInt(el.style.transitionDelay, 10) || 0;
            setTimeout(function () {
              el.classList.remove("reveal", "is-visible");
              el.style.transitionDelay = "";
            }, 600 + delay);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    revealItems.forEach(function (el, i) {
      // Small stagger for siblings revealed together
      el.style.transitionDelay = (i % 4) * 80 + "ms";
      revealObserver.observe(el);
    });
  }
}

// ------------------------------------------------------------
// 7. IMPACT COUNTERS (used on index.html)
//    - Counts up to data-count when visible (static text is the fallback)
// ------------------------------------------------------------
const counters = document.querySelectorAll("[data-count]");

function runCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  const suffix = el.dataset.suffix || "";
  const duration = 1400;
  const start = performance.now();

  function frame(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(target * eased).toLocaleString("en-US") + suffix;
    if (progress < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

if (counters.length && !prefersReducedMotion && "IntersectionObserver" in window) {
  const counterObserver = new IntersectionObserver(
    function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          runCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 },
  );
  counters.forEach(function (el) {
    counterObserver.observe(el);
  });
}

// ------------------------------------------------------------
// 8. TOAST (used on ALL pages)
//    - Short status messages; announced to screen readers via the
//      #toast-container live region. Stays visible long enough to read.
// ------------------------------------------------------------
function showToast(message) {
  const container = document.getElementById("toast-container");
  if (!container) return;

  if (container.children.length >= 3) {
    container.children[0].remove();
  }
  const toast = document.createElement("div");

  toast.classList.add("toast");
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(function () {
    toast.classList.add("fade-out");
    setTimeout(function () {
      toast.remove();
    }, 500);
  }, 5000);
}