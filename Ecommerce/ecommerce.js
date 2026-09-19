/* =============================================
   ecommerce.js — Cara Fashion Store
   ============================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* ─── Mobile Navigation ─── */
  const bar   = document.getElementById("bar");
  const close = document.getElementById("close");
  const nav   = document.getElementById("navbar");

  if (bar) {
    bar.addEventListener("click", () => {
      nav.classList.add("active");
      document.body.style.overflow = "hidden";
    });
  }

  if (close) {
    close.addEventListener("click", () => {
      nav.classList.remove("active");
      document.body.style.overflow = "";
    });
  }

  // Close nav when clicking outside on mobile
  document.addEventListener("click", (e) => {
    if (
      nav &&
      nav.classList.contains("active") &&
      !nav.contains(e.target) &&
      e.target !== bar
    ) {
      nav.classList.remove("active");
      document.body.style.overflow = "";
    }
  });

  /* ─── Sticky Header ─── */
  const header = document.getElementById("header");
  if (header) {
    const onScroll = () => {
      if (window.scrollY > 60) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ─── Scroll-triggered Reveal Animations ─── */
  const animateEls = document.querySelectorAll(".animate-up");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    animateEls.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback: show all immediately
    animateEls.forEach((el) => el.classList.add("visible"));
  }

  /* ─── Product Image Switcher (sproduct.html) ─── */
  const mainImg  = document.getElementById("MainImg");
  const smallImgs = document.querySelectorAll(".small-img");
  const smallCols = document.querySelectorAll(".small-img-col");

  if (mainImg && smallImgs.length) {
    smallImgs.forEach((img, i) => {
      img.addEventListener("click", () => {
        // Fade transition
        mainImg.style.opacity = "0";
        mainImg.style.transform = "scale(0.97)";
        setTimeout(() => {
          mainImg.src = img.src;
          mainImg.style.opacity = "1";
          mainImg.style.transform = "scale(1)";
        }, 180);

        // Active border on thumbnails
        smallCols.forEach((col) => col.classList.remove("active"));
        if (smallCols[i]) smallCols[i].classList.add("active");
      });
    });

    // Smooth transition style
    mainImg.style.transition = "opacity 0.2s ease, transform 0.2s ease";
  }

  /* ─── Wishlist Heart Toggle ─── */
  const wishlistBtns = document.querySelectorAll(".pro-wishlist");
  wishlistBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const icon = btn.querySelector("i");
      const isActive = icon.classList.contains("fas");
      icon.classList.toggle("fas", !isActive);
      icon.classList.toggle("far", isActive);
      icon.style.color = isActive ? "" : "#e53e3e";
      btn.style.background = isActive ? "rgba(255,255,255,0.9)" : "rgba(229,62,62,0.1)";
      btn.style.borderColor = isActive ? "transparent" : "rgba(229,62,62,0.3)";

      // Micro-bounce animation
      btn.style.transform = "scale(1.3)";
      setTimeout(() => { btn.style.transform = ""; }, 200);
    });
  });

  /* ─── Newsletter Form Feedback ─── */
  const newsletterForms = document.querySelectorAll("#newsletter .form");
  newsletterForms.forEach((form) => {
    const input  = form.querySelector("input");
    const button = form.querySelector("button");
    if (!input || !button) return;

    button.addEventListener("click", () => {
      const email = input.value.trim();
      if (!email || !email.includes("@")) {
        input.style.borderColor = "#e53e3e";
        input.placeholder = "Please enter a valid email";
        setTimeout(() => {
          input.style.borderColor = "";
          input.placeholder = "Your email address";
        }, 2000);
        return;
      }

      button.textContent = "✓ Subscribed!";
      button.style.background = "#2d7a1f";
      input.value = "";
      input.disabled = true;
      button.disabled = true;

      setTimeout(() => {
        button.textContent = "Sign Up";
        button.style.background = "";
        input.disabled = false;
        button.disabled = false;
      }, 4000);
    });
  });

  /* ─── Contact Form Submission Feedback ─── */
  const contactForm = document.querySelector("#form-details form");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector("button[type='submit']");
      if (!btn) return;
      const original = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
      btn.style.background = "#2d7a1f";
      btn.disabled = true;
      contactForm.reset();
      setTimeout(() => {
        btn.innerHTML = original;
        btn.style.background = "";
        btn.disabled = false;
      }, 4000);
    });
  }

  /* ─── Cart Quantity Live Subtotal ─── */
  const cartInputs = document.querySelectorAll("#cart table tbody input[type='number']");
  cartInputs.forEach((input) => {
    input.addEventListener("change", updateCartTotal);
    input.addEventListener("input", updateCartTotal);
  });

  function updateCartTotal() {
    const rows = document.querySelectorAll("#cart table tbody tr");
    let total = 0;

    rows.forEach((row) => {
      const priceCell = row.cells[3];
      const qtyInput  = row.querySelector("input[type='number']");
      const subCell   = row.cells[5];

      if (!priceCell || !qtyInput || !subCell) return;

      const price = parseFloat(priceCell.textContent.replace("$", "")) || 0;
      const qty   = Math.max(1, parseInt(qtyInput.value) || 1);
      const sub   = price * qty;

      subCell.textContent = "$" + sub.toFixed(2);
      total += sub;
    });

    // Update total display cells
    const totalCells = document.querySelectorAll("#Subtotal table td:nth-child(2)");
    if (totalCells.length >= 2) {
      totalCells[0].textContent = "$" + total.toFixed(2);
      totalCells[totalCells.length - 1].innerHTML = "<strong>$" + total.toFixed(2) + "</strong>";
    }
  }

  /* ─── Remove Cart Item ─── */
  const removeLinks = document.querySelectorAll("#cart table tbody a");
  removeLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const row = link.closest("tr");
      if (!row) return;
      row.style.transition = "opacity 0.3s ease, transform 0.3s ease";
      row.style.opacity = "0";
      row.style.transform = "translateX(20px)";
      setTimeout(() => {
        row.remove();
        updateCartTotal();
      }, 300);
    });
  });

  /* ─── Smooth Scroll for Anchor Links ─── */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const target = document.querySelector(anchor.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  /* ─── Add to Cart Button Feedback (sproduct.html) ─── */
  const addToCartBtn = document.querySelector(
    "#prodetails .single-pro-details button.normal"
  );
  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", () => {
      const original = addToCartBtn.innerHTML;
      addToCartBtn.innerHTML = '<i class="fas fa-check"></i> Added to Cart!';
      addToCartBtn.style.background = "#2d7a1f";
      setTimeout(() => {
        addToCartBtn.innerHTML = original;
        addToCartBtn.style.background = "";
      }, 2500);
    });
  }

  /* ─── Coupon Code Apply Feedback ─── */
  const couponBtn = document.querySelector("#coupon button");
  const couponInput = document.querySelector("#coupon input");
  if (couponBtn && couponInput) {
    couponBtn.addEventListener("click", () => {
      const code = couponInput.value.trim().toUpperCase();
      if (code === "CARA20") {
        couponBtn.textContent = "✓ Applied!";
        couponBtn.style.background = "#2d7a1f";
        couponInput.style.borderColor = "#2d7a1f";
      } else if (code === "") {
        couponInput.placeholder = "Enter a code first";
      } else {
        couponBtn.textContent = "Invalid";
        couponBtn.style.background = "#e53e3e";
        setTimeout(() => {
          couponBtn.textContent = "Apply";
          couponBtn.style.background = "";
          couponInput.value = "";
        }, 2000);
      }
    });
  }

});