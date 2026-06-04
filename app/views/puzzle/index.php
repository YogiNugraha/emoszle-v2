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

  <header id="site-header" class="puzzle-header">
    <div class="header-container puzzle-header-container">
      <div class="logo">
        <a href="<?= BASEURL ?>">E‑Moszle</a>
      </div>
      <!-- Stats moved to header -->
      <div id="header-stats" class="header-stats" aria-label="Status permainan">
        <div class="header-stat">
          <i class="bi bi-clock"></i> <span id="timer" aria-live="polite">00:00</span>
        </div>
        <div class="header-stat">
          <i class="bi bi-arrows-move"></i> <span id="move-count" aria-live="polite">0</span>
        </div>
        <div class="header-stat">
          <i class="bi bi-trophy"></i> <span id="high-score" aria-live="polite">--:--</span>
        </div>
      </div>
    </div>
  </header>

  <main id="main" class="game-layout">
    <aside class="game-sidebar">
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

      <!-- Reference Image -->
      <div class="card reference-card" id="reference-container" aria-label="Gambar acuan puzzle">
        <h2 class="card-title">Gambar Acuan</h2>
        <p id="reference-name" style="text-align: center; font-weight: bold; margin-bottom: 8px; color: var(--text-color);">Engklek Kapal</p>
        <img id="reference-image" src="assets/img/engklek-kapal.png" alt="Gambar acuan puzzle" loading="lazy" />
      </div>
    </aside>

    <section class="game-core">
      <!-- Board Area -->
      <div class="card board-card">
        <h2 class="card-title sr-only">Papan</h2>
        <div class="board-scroll" aria-label="Area papan">
          <div id="board" aria-label="Papan puzzle"></div>
        </div>
      </div>

      <!-- Pieces Tray -->
      <div class="card piece-card">
        <h2 class="card-title sr-only">Potongan</h2>
        <div id="piece-container" class="pieces" aria-label="Kumpulan potongan puzzle"></div>
      </div>

      <button id="hint-btn" class="btn btn-fab" type="button" aria-label="Beri petunjuk satu potongan">💡</button>
      <button id="mobile-ref-btn" class="btn btn-fab mobile-only-btn" type="button" aria-label="Lihat Gambar Acuan">🖼️</button>
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

  <div id="reference-modal" class="modal hidden" role="dialog" aria-modal="true" aria-labelledby="ref-title">
    <div class="modal-content" tabindex="-1">
      <h2 id="ref-title">Gambar Acuan</h2>
      <p id="modal-reference-name" style="text-align: center; font-weight: bold; margin-bottom: 8px; color: var(--text-color);">Engklek Kapal</p>
      <img id="modal-reference-image" src="assets/img/engklek-kapal.png" alt="Gambar acuan puzzle" style="width: 100%; border-radius: 8px; margin-bottom: 16px;" />
      <button id="close-ref-btn" class="btn btn-secondary" type="button">Tutup</button>
    </div>
  </div>


  <audio id="drop-sound" src="assets/sounds/click.mp3" preload="auto"></audio>
  <audio id="win-sound" src="assets/sounds/win.mp3" preload="auto"></audio>
  <audio id="bg-music" src="assets/sounds/music.mp3" preload="auto" loop></audio>

  <script>
    window.selectedGame = '<?= isset($data["game"]) ? htmlspecialchars($data["game"], ENT_QUOTES, "UTF-8") : "" ?>';
  </script>
  <script type="module" src="assets/js/main-puzzle.js"></script>
</body>

</html>
