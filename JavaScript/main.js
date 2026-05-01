// ============================================================
// MAIN.JS - JavaScript for Ashram Gandhi Puri Website
// ============================================================
// This file contains simple JavaScript functions used across
// all pages. Each section is clearly labeled so you can
// easily find and modify specific features.
// ============================================================


// ------------------------------------------------------------
// 1. HAMBURGER MENU (used on ALL pages)
//    - Toggles the mobile navigation open/close
// ------------------------------------------------------------
const hamburger = document.getElementById("hamburger-btn");
const nav = document.getElementById("main-nav");

if (hamburger && nav) {
  hamburger.addEventListener("click", function () {
    nav.classList.toggle("open");
  });
}


// ------------------------------------------------------------
// 2. HIGHLIGHT ACTIVE NAV LINK (used on ALL pages)
//    - Automatically highlights the current page in the menu
// ------------------------------------------------------------
const navLinks = document.querySelectorAll(".nav-links a");
const currentPage = window.location.pathname.split("/").pop(); // Get current filename

navLinks.forEach(function (link) {
  if (link.getAttribute("href") === currentPage) {
    link.style.textDecoration = "underline"; // Underline the active page link
  }
});


// ------------------------------------------------------------
// 3. CONTACT FORM VALIDATION (used on contact.html)
//    - Shows an alert when the form is submitted
// ------------------------------------------------------------
const contactForm = document.querySelector(".contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Stop the page from reloading

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    // Simple check: make sure all fields are filled in
    if (name === "" || email === "" || message === "") {
      alert("Please fill in all fields before sending.");
    } else {
      alert("Thank you, " + name + "! Your message has been sent. We will get back to you soon.");
      contactForm.reset(); // Clear the form after submitting
    }
  });
}


// ------------------------------------------------------------
// 4. VOLUNTEER FORM VALIDATION (used on volunteer.html)
//    - Shows an alert when the form is submitted
// ------------------------------------------------------------
const volunteerForm = document.querySelector(".volunteer-form");

if (volunteerForm) {
  volunteerForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Stop the page from reloading

    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const nationality = document.getElementById("nationality").value.trim();
    const reason = document.getElementById("reason").value.trim();

    // Simple check: make sure all fields are filled in
    if (name === "" || phone === "" || nationality === "" || reason === "") {
      alert("Please fill in all fields before submitting.");
    } else {
      alert("Thank you, " + name + "! Your volunteer application has been submitted. We will contact you soon.");
      volunteerForm.reset(); // Clear the form after submitting
    }
  });
}


// ------------------------------------------------------------
// 5. DONATE BUTTON (used on donation.html)
//    - Shows a confirmation message when the button is clicked
// ------------------------------------------------------------
const donateBtn = document.querySelector(".donate-btn");

if (donateBtn) {
  donateBtn.addEventListener("click", function () {
    alert("Thank you for your generosity! You will be redirected to our donation portal.");
  });
}
