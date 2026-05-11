// ============================================================
// MAIN.JS - JavaScript for Ashram Gandhi Puri Website
// ============================================================
// This file contains simple JavaScript functions used across
// all pages. Each section is clearly labeled so you can
// easily find and modify specific features.
// ============================================================

// Initialize EmailJS (Make sure the EmailJS SDK is included in the HTML)
if (typeof emailjs !== 'undefined') {
  emailjs.init({
    // Replace with your actual EmailJS Public Key
    publicKey: "-thawvZg0wjq1LVEt",
  });
}

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
    const btn = contactForm.querySelector('button[type="submit"]');
    const originalBtnText = btn.innerText;
    btn.innerText = "Sending...";

    emailjs.sendForm('service_gndy8k8', 'template_vhmny7r', contactForm, {
      publicKey: '-thawvZg0wjq1LVEt'
    })
      .then(() => {
        showToast("Thank you, " + name + "! Your message has been sent. We will get back to you soon.");
        contactForm.reset(); // Clear the form 
      })
      .catch((error) => {
        showToast("Failed to send the message. Please try again later.");
        console.error("EmailJS Error:", error);
      })
      .finally(() => {
        btn.innerText = originalBtnText;
      });
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
    const btn = volunteerForm.querySelector('button[type="submit"]');
    const originalBtnText = btn.innerText;
    btn.innerText = "Submitting...";

    // REPLACE 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID_VOLUNTEER' with your actual IDs
    emailjs.sendForm('service_gndy8k8', 'template_wforxm1', volunteerForm, {
      publicKey: '-thawvZg0wjq1LVEt'
    })
      .then(() => {
        showToast("Thank you, " + name + "! Your volunteer application has been submitted. We will contact you soon.");
        volunteerForm.reset(); // Clear the form 
      })
      .catch((error) => {
        showToast("Failed to submit application. Please try again later.");
        console.error("EmailJS Error:", error);
      })
      .finally(() => {
        btn.innerText = originalBtnText;
      });
  });
}


// ------------------------------------------------------------
// 5. DONATION MODAL (used on donation.html)
//    - Opens a popup form when the donate button is clicked
//    - Closes when the X button or the dark background is clicked
//    - Validates the form (name, email, amount, transfer proof)
//    - Shows thank-you alert on submit
// ------------------------------------------------------------

// Step 1: Get references to the HTML elements we need
const donateBtn = document.getElementById("donate-btn");       // The donate button
const donationModal = document.getElementById("donation-modal");   // The modal overlay (dark background)
const closeBtn = document.getElementById("modal-close-btn"); // The X button inside the modal
const donationForm = document.getElementById("donation-form");   // The <form> inside the modal
const copyBtn = document.getElementById("copy-btn");        // The "Copy Account Number" button
const accountNumber = document.getElementById("account-number"); // The span that contains the account number

// Step 2: Open the modal when the donate button is clicked
if (donateBtn && donationModal) {
  donateBtn.addEventListener("click", function () {
    donationModal.classList.add("active"); // Adding "active" class makes it visible (see donation.css)
  });
}

// Step 3: Close the modal when the X button is clicked
if (closeBtn && donationModal) {
  closeBtn.addEventListener("click", function () {
    donationModal.classList.remove("active"); // Removing "active" hides the modal again
  });
}

// Step 4: Close the modal when clicking outside the white box (on the dark background)
if (donationModal) {
  donationModal.addEventListener("click", function (event) {
    // event.target is what was actually clicked
    // If the click was directly on the overlay (not the box inside), close the modal
    if (event.target === donationModal) {
      donationModal.classList.remove("active");
    }
  });
}

// Step 5: Copy account number to clipboard when copy button is clicked
if (copyBtn && accountNumber) {
  copyBtn.addEventListener("click", function () {
    // navigator.clipboard.writeText() copies text to the user's clipboard
    navigator.clipboard.writeText(accountNumber.textContent).then(function () {
      // Temporarily change the button text to give feedback to the user
      copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
      // After 2 seconds, revert the button text back to original
      setTimeout(function () {
        copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy Account Number';
      }, 2000);
    });
  });
}

// Step 6: Handle the form submission
if (donationForm) {
  donationForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Stop the page from reloading on submit

    // Get the values the user typed in each field
    const name = document.getElementById("donor-name").value.trim();
    const email = document.getElementById("donor-email").value.trim();
    const amount = document.getElementById("donor-amount").value.trim();

    // Get the file upload input — .files[0] = the first selected file
    const proofInput = document.getElementById("donor-proof");
    const proofFile = proofInput.files[0]; // undefined if no file selected

    // Check if any field is empty OR no file was uploaded
    if (name === "" || email === "" || amount === "") {
      showToast("Please fill in all fields before confirming.");
    } else if (!proofFile) {
      // proofFile is undefined = no file was chosen by the user
      showToast("Please upload your transfer proof before confirming.");
    } else {
      // All fields are filled and a file was uploaded — show a thank-you message
      showToast(
        "Thank you, " + name + "!" +
        " Your donation of IDR " + parseInt(amount).toLocaleString("id-ID") +
        " has been received. We will verify your transfer proof (" + proofFile.name + ")" +
        " and send a confirmation to " + email + "."
      );
      donationForm.reset();                        // Clear all form fields
      donationModal.classList.remove("active");   // Close the modal
    }
  });
}


// ------------------------------------------------------------
// 6. Carousel (used on index.html)
//    - Automated sliding image for hero section
// ------------------------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
  const carousel = document.querySelector(".carousel");
  const slides = document.querySelectorAll(".carousel-slide");

  if (!carousel || slides.length === 0) return;

  let currentIndex = 0;

  function showSlide(index) {
    if (index < 0) {
      currentIndex = slides.length - 1;
    } else if (index >= slides.length) {
      currentIndex = 0;
    }
    carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
  }

  // Auto-advance every 3 seconds
  setInterval(function () {
    currentIndex++;
    showSlide(currentIndex);
  }, 3000);
});

// Adding Toast for Aesthetic Purposes
function showToast(message) {
  const container = document.getElementById('toast-container');
  if (container.children.length >= 3) {
    container.children[0].remove();
  }
  const toast = document.createElement('div');

  toast.classList.add('toast');
  toast.innerText = message;

  container.appendChild(toast);

  setTimeout(function () {
    toast.classList.add('fade-out');
    setTimeout(function () {
      toast.remove();
    }, 500);
  }, 1800);

}