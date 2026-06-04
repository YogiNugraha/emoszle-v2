<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>E-Moszle - <?= isset($data['title']) ? $data['title'] : 'Puzzle Permainan Tradisional' ?></title>
  <base href="<?= BASEURL ?>">


  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;900&display=swap" rel="stylesheet">
  <link href="assets/vendor/bootstrap-icons/bootstrap-icons.css" rel="stylesheet">
  <!-- Core CSS -->
  <link href="assets/css/global.css" rel="stylesheet">
  <link href="assets/css/components.css" rel="stylesheet">
  <link href="assets/css/layout.css" rel="stylesheet">

  <!-- Dynamic Page CSS -->
  <?php if (isset($data['css'])): ?>
    <?php foreach ($data['css'] as $cssFile): ?>
      <link href="assets/css/pages/<?= htmlspecialchars($cssFile, ENT_QUOTES, 'UTF-8') ?>" rel="stylesheet">
    <?php endforeach; ?>
  <?php endif; ?>

</head>

<body class="homepage-body">
  <div id="preloader">
    <div class="spinner"></div>
  </div>
  <header id="site-header">
    <div class="header-container">
      <div class="logo">
        <a href="<?= BASEURL ?>">E-Moszle</a>
      </div>
      <nav class="main-nav">
        <ul>
          <li><a href="<?= BASEURL ?>" class="nav-link <?= (isset($data['title']) && $data['title'] == 'Home') ? 'active' : '' ?>" data-target="hero">Home</a></li>

          <li><a href="#games" class="nav-link" data-target="games">Permainan</a></li>
          <li><a href="#tentang" class="nav-link" data-target="tentang">Tentang</a></li>
          <li><a href="#video-panduan" class="nav-link" data-target="video-panduan">Video</a></li>
          <li><a href="#modul" class="nav-link" data-target="modul">Modul</a></li>

          <li><a href="puzzle" class="btn btn-primary-nav nav-link <?= (isset($data['title']) && $data['title'] == 'Puzzle') ? 'active' : '' ?>" data-target="puzzle">Mainkan Sekarang!</a></li>
        </ul>
      </nav>
      <button class="menu-toggle" aria-label="Buka Menu">
        <span class="hamburger"></span>
      </button>
    </div>
  </header>
