window.onload = function () {

  // ===============================================
  // Set tahun dinamis di footer
  if (document.getElementById("current-year")) {
    document.getElementById("current-year").textContent =
      new Date().getFullYear();
  }

  // ===== TAMBAHKAN LOGIKA MENU TOGGLE INI =====
  const menuToggle = document.querySelector(".menu-toggle");
  const mainNav = document.querySelector(".main-nav");

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", function () {
      mainNav.classList.toggle("is-open");
      this.classList.toggle("is-active");
    });
  }
  // ===========================================
};

// ===== LOGIKA BARU UNTUK NAVLINK AKTIF SAAT SCROLL (SCROLLSPY) =====

// Jalankan hanya jika kita berada di halaman yang memiliki navigasi section
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".main-nav .nav-link");

if (sections.length > 0 && navLinks.length > 0) {
  // Fungsi untuk mengubah status aktif
  const activateLink = (id) => {
    navLinks.forEach((link) => {
      link.classList.remove("active");
      // Cek jika data-target dari link sama dengan id section
      if (link.dataset.target === id) {
        link.classList.add("active");
      }
    });
  };

  // Buat Observer
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // entry.isIntersecting berarti section sedang terlihat di layar
        // entry.intersectionRatio > 0.4 berarti lebih dari 40% section terlihat
        if (entry.isIntersecting && entry.intersectionRatio > 0.4) {
          activateLink(entry.target.id);
        }
      });
    },
    {
      threshold: 0.4, // Atur seberapa banyak bagian section harus terlihat (0.4 = 40%)
    }
  );

  // "Awasi" setiap section
  sections.forEach((section) => {
    observer.observe(section);
  });
}
// ====================================================================

// ===== LOGIKA BARU UNTUK TAB VIDEO =====
const videoTabs = document.querySelectorAll(".video-tab-btn");
const videoPlayer = document.getElementById("video-player");

// Pastikan elemennya ada di halaman sebelum menjalankan kode
if (videoTabs.length > 0 && videoPlayer) {
  videoTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      // 1. Ambil ID video dari atribut data-*
      const videoId = tab.dataset.videoId;

      // 2. Buat URL embed yang baru
      const newVideoSrc = `https://www.youtube.com/embed/${videoId}`;

      // 3. Ganti sumber (src) dari iframe
      videoPlayer.src = newVideoSrc;

      // 4. Atur class 'active' pada tombol
      // Hapus 'active' dari semua tombol dulu
      videoTabs.forEach((t) => t.classList.remove("active"));
      // Tambahkan 'active' hanya ke tombol yang di-klik
      tab.classList.add("active");
    });
  });
}
