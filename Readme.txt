# E-Moszle
# Game Puzzle Gambar Interaktif (Interactive Jigsaw Puzzle)

![Lisensi MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

Sebuah game puzzle gambar berbasis web yang modern, interaktif, dan kaya fitur. Proyek ini dibangun dari nol dengan fokus pada pengalaman pengguna yang menyenangkan, desain yang ceria, dan fungsionalitas yang fleksibel. Pemain dapat memilih tingkat kesulitan, gambar, dan mencoba memecahkan rekor waktu mereka sendiri.

### [➡️ Link Demo Langsung (Jika ada)](https://#) 
*(Ganti tanda # dengan link ke game Anda jika sudah di-hosting online)*

---

## 📸 Tampilan Game

Letakkan screenshot terbaik dari game Anda di sini! Ganti `link_ke_screenshot.jpg` dengan path gambar Anda setelah diunggah ke repo.

![Tampilan Game Puzzle](link_ke_screenshot.jpg)

---

## ✨ Fitur Utama

Game ini dikemas dengan berbagai fitur untuk memberikan pengalaman bermain yang lengkap:

* **Mekanisme Drag & Drop:** Antarmuka seret-dan-lepas yang intuitif untuk menyusun puzzle.
* **Sistem Tukar Potongan (Swap):** Pemain bisa menukar posisi potongan puzzle yang sudah ada di papan, memungkinkan strategi "trial and error".
* **Pilihan Tingkat Kesulitan:** Tiga tingkat kesulitan (Mudah, Normal, Sulit) yang secara dinamis mengubah jumlah baris dan kolom puzzle.
* **Pilihan Gambar Puzzle:** Pemain dapat memilih gambar yang ingin mereka mainkan dari beberapa opsi yang tersedia.
* **Sistem Skor Tertinggi (High Score):** Menggunakan `localStorage` browser untuk menyimpan dan menampilkan rekor waktu tercepat untuk setiap kombinasi kesulitan dan gambar.
* **Timer & Penghitung Gerakan:** Melacak waktu bermain dan jumlah gerakan yang dilakukan untuk setiap sesi.
* **Pembaruan *Real-time*:** Papan puzzle, gambar acuan, dan rekor langsung diperbarui saat pemain mengubah pilihan di dropdown, memberikan pengalaman seperti aplikasi modern (AJAX-like).
* **Desain Responsif:** Tampilan game beradaptasi dengan baik di berbagai ukuran layar, dari desktop hingga perangkat mobile.
* **Audio Interaktif:** Dilengkapi dengan musik latar yang menenangkan dan efek suara saat potongan diletakkan atau saat memenangkan permainan.
* **Kontrol Audio:** Tombol mute/unmute untuk mengontrol musik latar.
* **Layar Kemenangan Profesional:** Jendela modal (pop-up) yang elegan muncul saat menang, menampilkan statistik permainan dan pesan rekor baru.
* **Footer Profesional:** Dilengkapi dengan footer yang berisi hak cipta dengan tahun dinamis, dan link sosial media.

---

## 🛠️ Teknologi yang Digunakan

* **HTML5:** Untuk struktur dasar dan konten halaman.
* **CSS3:** Untuk styling, layout, dan animasi.
    * **Flexbox & Grid:** Untuk membangun layout yang kompleks dan responsif.
    * **CSS Variables:** Untuk manajemen tema dan palet warna yang mudah.
    * **Transitions & Animations:** Untuk interaksi yang lebih hidup.
* **JavaScript (ES6+):** Sebagai otak utama yang menangani semua logika game.
    * **Manipulasi DOM:** Untuk membuat, mengubah, dan menggerakkan semua elemen puzzle secara dinamis.
    * **HTML Drag & Drop API:** Untuk fungsionalitas inti seret-dan-lepas.
    * **Web Storage API (`localStorage`):** Untuk menyimpan data skor tertinggi.
    * **Web Audio API:** Untuk memutar suara dan musik.
* **PHP (Sangat Minimal):** Digunakan pada file `.php` untuk menyisipkan variabel `$base_url`, sebuah praktik yang baik untuk menangani path aset dalam lingkungan server.

---

## 📂 Struktur Folder

Proyek ini diorganisir dengan struktur folder yang bersih dan mudah dipahami.

/
├── puzzle.php          # File utama game
├── index.php           # Halaman utama (jika ada)
├── script.js           # Semua logika JavaScript
├── style.css           # Semua styling CSS
├── README.md           # File yang sedang Anda baca
└── assets/             # Folder untuk semua aset
├── images/         # Untuk semua file gambar (puzzle, background, ikon)
└── sounds/         # Untuk semua file audio (musik, sfx)

---

## 🚀 Instalasi dan Cara Menjalankan

Karena proyek ini menggunakan sedikit kode PHP (`<?= $base_url ?>`), Anda perlu menjalankannya di lingkungan server lokal.

1.  **Clone Repositori**
    ```bash
    git clone [https://github.com/your-username/nama-repo-anda.git](https://github.com/your-username/nama-repo-anda.git)
    ```

2.  **Siapkan Server Lokal**
    * Gunakan aplikasi seperti **XAMPP**, MAMP, atau WAMP.
    * Pindahkan seluruh folder proyek yang sudah di-clone ke dalam direktori `htdocs` (untuk XAMPP) atau `www` (untuk WAMP/MAMP).

3.  **Definisikan `$base_url` (Jika Perlu)**
    * Buka file `puzzle.php` (atau file konfigurasi utama Anda seperti `index.php`).
    * Pastikan variabel `$base_url` sudah didefinisikan sebelum digunakan. Contoh:
        ```php
        <?php $base_url = "http://localhost/nama-folder-proyek"; ?>
        ```

4.  **Buka di Browser**
    * Jalankan server Apache dari panel kontrol XAMPP Anda.
    * Buka browser dan akses game melalui URL: `http://localhost/nama-folder-proyek/puzzle.php`

---

## 🎨 Kustomisasi

Game ini dibuat agar mudah untuk dikustomisasi.

### Menambah Gambar Puzzle Baru
1.  Letakkan file gambar baru Anda di dalam folder `assets/images/`.
2.  Buka file `puzzle.php` dan tambahkan `<option>` baru di dalam `<select id="image-select">`.
    ```html
    <option value="<?= $base_url ?>/assets/images/nama-gambar-baru.jpg">Nama Puzzle Baru</option>
    ```

### Menambah Tingkat Kesulitan Baru
1.  Buka file `script.js` dan tambahkan entri baru di dalam objek `difficulties`.
    ```javascript
    const difficulties = {
        // ...tingkat kesulitan lain
        ultimate: { rows: 8, cols: 8 }
    };
    ```
2.  Buka file `puzzle.php` dan tambahkan `<option>` baru di dalam `<select id="difficulty">`.
    ```html
    <option value="ultimate">Ultimate (8x8)</option>
    ```

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah Lisensi MIT. Lihat file `LICENSE` untuk detailnya.

---

## ❤️ Ucapan Terima Kasih

* Proyek ini adalah hasil dari serangkaian dialog interaktif, menunjukkan bagaimana sebuah ide sederhana bisa berkembang menjadi aplikasi yang lengkap.
* Terima kasih kepada **Google Fonts** untuk font "Nunito" yang ceria.
* Aset suara dan gambar diambil dari sumber-sumber bebas royalti.

Dibuat dengan semangat belajar di Cigugur, Indonesia.