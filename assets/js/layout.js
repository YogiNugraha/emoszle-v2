document.addEventListener("DOMContentLoaded", () => {
  // ===============================================
  // Set tahun dinamis di footer
  const yearEl = document.getElementById("current-year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ===============================================
  // Logika Mobile Menu Toggle
  const menuToggle = document.querySelector(".menu-toggle");
  const mainNav = document.querySelector(".main-nav");

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", function () {
      mainNav.classList.toggle("is-open");
      this.classList.toggle("is-active");
    });
  }
});
