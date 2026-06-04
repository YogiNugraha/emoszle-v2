document.addEventListener("DOMContentLoaded", () => {
  // ===== LOGIKA NAVLINK AKTIF SAAT SCROLL (SCROLLSPY) =====
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".main-nav .nav-link");

  if (sections.length > 0 && navLinks.length > 0) {
    const activateLink = (id) => {
      navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.dataset.target === id) {
          link.classList.add("active");
        }
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.4) {
            activateLink(entry.target.id);
          }
        });
      },
      { threshold: 0.4 }
    );

    sections.forEach((section) => {
      observer.observe(section);
    });
  }

  // ===== LOGIKA TAB VIDEO =====
  const videoTabs = document.querySelectorAll(".video-tab-btn");
  const videoPlayer = document.getElementById("video-player");

  if (videoTabs.length > 0 && videoPlayer) {
    videoTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const videoId = tab.dataset.videoId;
        const newVideoSrc = `https://www.youtube.com/embed/${videoId}`;
        videoPlayer.src = newVideoSrc;

        videoTabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
      });
    });
  }
});
