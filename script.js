(function () {
  "use strict";

  const header = document.querySelector(".site-header");
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll(".nav-menu a");
  const revealElements = document.querySelectorAll(".reveal");
  const contactForm = document.querySelector(".contact-form");
  const formStatus = document.getElementById("form-status");
  const yearEl = document.getElementById("year");

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* Sticky header shadow on scroll */
  function onScroll() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Mobile navigation */
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      const isOpen = navMenu.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    });

    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        navMenu.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Open menu");
      });
    });
  }

  /* Scroll reveal animations */
  if ("IntersectionObserver" in window && revealElements.length) {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      revealElements.forEach(function (el) {
        el.classList.add("is-visible");
      });
    } else {
      const observer = new IntersectionObserver(
        function (entries, obs) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
      );

      revealElements.forEach(function (el) {
        observer.observe(el);
      });
    }
  } else {
    revealElements.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* Contact form — works with Formspree on static hosting */
  if (contactForm && formStatus) {
    contactForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      const action = contactForm.getAttribute("action") || "";
      if (action.includes("YOUR_FORM_ID")) {
        formStatus.textContent =
          "Set up Formspree: replace YOUR_FORM_ID in index.html with your form ID.";
        formStatus.className = "form-status is-error";
        return;
      }

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";
      formStatus.textContent = "";
      formStatus.className = "form-status";

      try {
        const response = await fetch(action, {
          method: "POST",
          body: new FormData(contactForm),
          headers: { Accept: "application/json" },
        });

        if (response.ok) {
          contactForm.reset();
          formStatus.textContent = "Thanks! Your message was sent.";
          formStatus.className = "form-status is-success";
        } else {
          throw new Error("Form submission failed");
        }
      } catch (error) {
        formStatus.textContent = "Something went wrong. Try emailing me directly.";
        formStatus.className = "form-status is-error";
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  }
})();
