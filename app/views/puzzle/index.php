<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <meta name="theme-color" content="#20c997" />
  <title>E‑Moszle – Puzzle</title>
  <base href="<?= BASEURL ?>">


  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;900&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="assets/css/global.css" />
  <link rel="stylesheet" href="assets/css/components.css" />
  <link rel="stylesheet" href="assets/css/layout.css" />
  <link rel="stylesheet" href="assets/css/pages/puzzle.css" />
</head>

<body>
  <a class="skip-link" href="puzzle#main">Lewati ke konten utama</a>

  <header id="site-header">
    <div class="header-container">
      <div class="logo">
        <a href="<?= BASEURL ?>">E‑Moszle</a>
      </div>
    </div>
  </header>

  <main id="main" class="site-main container">
    <!-- Toolbar / Controls -->
    <section id="controls" class="toolbar" role="toolbar" aria-label="Kontrol permainan">
      <a href="<?= BASEURL ?>" id="back-btn" class="btn btn-secondary" aria-label="Kembali ke Halaman Utama">Kembali</a>

      <div class="control-group">
        <label for="difficulty">Tingkat Kesulitan</label>
        <div class="select-wrap">
          <select id="difficulty">
            <option value="easy" selected>Mudah (3×2)</option>
            <option value="normal">Normal (4×3)</option>
            <option value="hard">Sulit (5×4)</option>
          </select>
        </div>
      </div>

      <div class="control-group">
        <label for="image-select">Pilih Gambar</label>
        <div class="select-wrap">
          <select id="image-select">
            <option value="assets/img/engklek-kapal.png" selected>Engklek Kapal</option>
            <option value="assets/img/engklek-gunung.png">Engklek Gunung</option>
            <option value="assets/img/gobak-sodor.png">Gobak Sodor</option>
            <option value="assets/img/ular-naga.png">Ular Naga</option>
          </select>
        </div>
      </div>

      <div class="toolbar-actions">
        <button id="restart-btn" class="btn btn-primary" type="button">Ulangi</button>
        <button id="mute-btn" class="btn btn-warning mute-button" type="button" aria-pressed="false" aria-label="Nyalakan atau Matikan Musik">🔊</button>
      </div>
    </section>

    <!-- Stats -->
    <section id="stats" class="stats" aria-label="Status permainan">
      <div class="stat"><span class="stat-label">Waktu</span> <span id="timer" aria-live="polite">00:00</span></div>
      <div class="stat"><span class="stat-label">Gerakan</span> <span id="move-count" aria-live="polite">0</span></div>
      <div class="stat"><span class="stat-label">Rekor</span> <span id="high-score" aria-live="polite">--:--</span></div>
    </section>

    <!-- Game Stage -->
    <section id="game-container" class="game-stage">
      <div class="card piece-card">
        <h2 class="card-title">Potongan</h2>
        <div id="piece-container" class="pieces" aria-label="Kumpulan potongan puzzle"></div>
      </div>

      <div class="card board-card">
        <h2 class="card-title">Papan</h2>
        <div class="board-scroll" aria-label="Area papan – scroll jika melebihi layar">
          <div id="board" aria-label="Papan puzzle"></div>
        </div>
      </div>

      <div class="card reference-card" id="reference-container" aria-label="Gambar acuan puzzle">
        <h2 class="card-title">Gambar Acuan</h2>
        <img id="reference-image" src="assets/img/engklek-kapal.png" alt="Gambar acuan puzzle" loading="lazy" />
      </div>

      <button id="hint-btn" class="btn btn-fab" type="button" aria-label="Beri petunjuk satu potongan">💡</button>
    </section>
  </main>

  <div id="win-modal" class="modal hidden" role="dialog" aria-modal="true" aria-labelledby="win-title">
    <div class="modal-content" tabindex="-1">
      <h2 id="win-title">Asyik, Berhasil! 🎉</h2>
      <p>Kamu menyelesaikan puzzle dengan:</p>
      <p>Waktu: <strong id="final-time">00:00</strong></p>
      <p>Total Gerakan: <strong id="final-moves">0</strong></p>
      <button id="play-again-btn" class="btn btn-accent" type="button">Main Lagi</button>
    </div>
  </div>

  <footer id="site-footer" class="site-footer">
    <div class="footer-content container">
      <div class="footer-extra-info">
        <div class="info-column">
          <h4>Artikel & Panduan</h4>
          <p>Unduh artikel panduan lengkap E‑Moszle <a href="path/ke/artikel-anda.pdf" target="_blank" rel="noopener">di sini</a>.</p>
        </div>
        <div class="info-column">
          <h4>Kontak</h4>
          <p>Founder E‑Moszle<br /><a href="mailto:hanaastrianur@umkuningan.ac.id">hanaastrianur@umkuningan.ac.id</a></p>
        </div>
      </div>

      <p class="footer-message">Dibuat dengan ❤️ di Kuningan, Indonesia.</p>

      <div class="social-links" aria-label="Sosial media">
        <a href="https://github.com/your-username" target="_blank" rel="noopener" title="GitHub" aria-label="GitHub">
          <span class="sr-only">GitHub</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
        </a>
        <a href="https://instagram.com/your-username" target="_blank" rel="noopener" title="Instagram" aria-label="Instagram">
          <span class="sr-only">Instagram</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.012 3.584-.07 4.85c-.148 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.85s.012-3.584.07-4.85c.149-3.225 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.85-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.059 1.689.073 4.948.073s3.667-.014 4.947-.072c4.354-.2 6.782-2.618 6.979-6.98.059-1.281.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44 1.441-.645 1.441-1.44-.645-1.44-1.441-1.44z" />
          </svg>
        </a>
      </div>

      <p class="copyright">&copy; <span id="current-year"></span> <a href="#">E‑Moszle Project</a>. All Rights Reserved.</p>
    </div>
  </footer>

  <audio id="drop-sound" src="assets/sounds/click.mp3" preload="auto"></audio>
  <audio id="win-sound" src="assets/sounds/win.mp3" preload="auto"></audio>
  <audio id="bg-music" src="assets/sounds/music.mp3" preload="auto" loop></audio>

  <script>
    window.selectedGame = '<?= isset($data["game"]) ? htmlspecialchars($data["game"], ENT_QUOTES, "UTF-8") : "" ?>';
  </script>
  <script type="module" src="assets/js/main-puzzle.js"></script>
</body>

</html>
