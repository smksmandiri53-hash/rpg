# Mandiri Game — RPG Dunia Terbuka

Game RPG browser sederhana yang bisa dimainkan di komputer dan HP Android. Tidak perlu instalasi aplikasi.

## Fitur versi awal
- Dunia 2D top-down yang bisa dijelajahi.
- Kontrol keyboard (WASD/panah) dan tombol sentuh.
- Koin, skor, XP, level, misi, penduduk/NPC.
- Simpan progres pada browser perangkat.
- Papan peringkat lokal pada perangkat yang sama.
- Tidak memerlukan backend untuk mulai bermain.

> Catatan: GitHub Pages hanya meng-host file statis. Papan peringkat versi awal bersifat lokal, bukan global. Untuk peringkat global yang sama di semua perangkat, ikuti bagian Firebase di bawah.

## Struktur file
```text
mandiri-game/
├── index.html
├── style.css
├── game.js
└── README.md
```

## A. Buat repository GitHub
1. Buka https://github.com dan login.
2. Klik **+** → **New repository**.
3. Isi nama repository: `mandiri-game`.
4. Pilih **Public**.
5. Klik **Create repository**.

## B. Unggah file
Cara termudah tanpa aplikasi tambahan:
1. Pada repository, klik **Add file** → **Create new file**.
2. Buat `index.html`, tempel kode dari file ini/arsip proyek, lalu klik **Commit changes**.
3. Ulangi untuk `style.css` dan `game.js`. (Jika memakai ZIP, ekstrak ZIP dulu di komputer, lalu gunakan **Add file → Upload files** untuk mengunggah ketiga file sekaligus.)
4. Pastikan ketiga file ada di folder utama repository, bukan di dalam subfolder.

## C. Aktifkan GitHub Pages
1. Buka repository `mandiri-game`.
2. Klik **Settings** → **Pages**.
3. Di **Build and deployment**, pilih **Deploy from a branch**.
4. Pilih branch `main` dan folder `/(root)`.
5. Klik **Save**.
6. Tunggu beberapa menit. URL biasanya:
   `https://USERNAME.github.io/mandiri-game/`
   Ganti `USERNAME` dengan nama akun GitHub kamu.
7. Buka URL tersebut. Jika belum muncul, tunggu 2–5 menit lalu refresh.

Panduan resmi: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## D. Cara bermain
- Komputer: WASD atau tombol panah untuk bergerak.
- Tekan `E` atau spasi untuk aksi/interaksi.
- HP Android: gunakan tombol arah di kiri bawah dan tombol AKSI di kanan bawah.
- Dekati koin untuk mengambilnya otomatis.
- Dekati penduduk di desa, lalu tekan E/AKSI untuk menyelesaikan misi.
- Gunakan **Simpan Permainan** untuk menyimpan progres di browser yang sama.

## E. Mengaktifkan papan peringkat online global (opsional, Firebase)
Ini adalah langkah lanjutan. Papan peringkat lokal sudah berjalan tanpa konfigurasi.

### 1. Buat proyek Firebase
1. Buka https://console.firebase.google.com/
2. Klik **Add project** dan buat proyek, misalnya `mandiri-game`.
3. Pada ringkasan proyek, tambahkan aplikasi Web (`</>`).
4. Daftarkan aplikasi dan salin `firebaseConfig`.
5. Buka **Build → Realtime Database** lalu **Create Database**.
6. Pilih lokasi yang sesuai. Jangan biarkan aturan database terbuka untuk publik dalam penggunaan nyata.

### 2. Buat aturan yang aman
Untuk leaderboard global yang dapat dipercaya, jangan izinkan semua pengunjung menulis skor tanpa autentikasi dan validasi server. Jika aturan `".write": true` digunakan, siapa pun bisa memalsukan skor atau menghapus data. Gunakan Firebase Authentication dan aturan berbasis UID, lalu untuk skor kompetitif tambahkan Cloud Functions/server-side validation. Konfigurasi produksi perlu dirancang sesuai skema database dan alur login game.

### 3. Hubungkan leaderboard
Versi yang disertakan belum mengirim skor ke Firebase karena konfigurasi proyek dan kebijakan keamanan belum tersedia. Jangan menempelkan service-account key atau kredensial rahasia ke JavaScript/Repository. Firebase web config sendiri bukan rahasia, tetapi keamanan wajib ditegakkan dengan Security Rules, Authentication dan/atau App Check.

Dokumentasi resmi:
- Menambahkan Firebase ke web: https://firebase.google.com/docs/web/setup
- Memulai Realtime Database: https://firebase.google.com/docs/database/web/start
- Membaca/menulis data: https://firebase.google.com/docs/database/web/read-and-write

## Pemecahan masalah
- Halaman 404: pastikan file bernama persis `index.html` dan berada di root branch `main`.
- CSS/game tidak muncul: pastikan `style.css` dan `game.js` berada sejajar dengan `index.html`.
- Perubahan belum tampil: tunggu deployment selesai, lalu lakukan hard refresh (Ctrl+F5) atau hapus cache.
- Kontrol sentuh tidak merespons: buka URL HTTPS GitHub Pages di browser terbaru, bukan pratinjau editor file.
- Progres tidak muncul di perangkat lain: penyimpanan saat ini lokal per browser; sinkronisasi global memerlukan backend.

## Lisensi
Bebas dimodifikasi untuk pembelajaran dan pengembangan Mandiri Game.
