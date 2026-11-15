JAYA PORTFOLIO
==============

STRUKTUR FOLDER
- index.html       : halaman utama website
- css/style.css    : seluruh kode tampilan (CSS)
- js/script.js     : seluruh kode interaksi (JavaScript)
- assets/images/   : simpan foto profil dan gambar proyek di sini
- assets/icons/    : simpan ikon website di sini

CARA MENJALANKAN
1. Ekstrak folder jaya-portfolio jika masih berbentuk ZIP.
2. Buka folder jaya-portfolio di Visual Studio Code.
3. Buka file index.html menggunakan browser, atau gunakan ekstensi Live Server.

CARA MENGUBAH DATA
- Buka js/script.js, edit bagian CONFIG paling atas: email, github, instagram.
- Foto hero   : assets/images/profile.png  (PNG TRANSPARAN / sudah remove background)
- Foto About  : assets/images/about.jpg
- Gambar proyek: assets/images/project-1.jpg ... project-4.jpg
  (jika file ada, otomatis menggantikan placeholder)
- Klik kartu proyek -> tampil besar dengan deskripsi di bawahnya (tombol panah / Esc).

KOMENTAR PUBLIK (supaya semua pengunjung bisa saling melihat komentar)
Website statis tidak punya server, jadi butuh database gratis. Cara termudah: Firebase.
1. Buka console.firebase.google.com -> Add project.
2. Build -> Realtime Database -> Create database.
3. Tab "Rules", isi lalu Publish:
   {
     "rules": {
       "comments": {
         ".read": true,
         "$id": {
           ".write": "!data.exists()",
           ".validate": "newData.hasChildren(['name','message','ts']) && newData.child('name').isString() && newData.child('name').val().length <= 30 && newData.child('message').isString() && newData.child('message').val().length <= 300"
         }
       }
     }
   }
   (pengunjung hanya bisa menambah komentar, tidak bisa mengedit/menghapus)
4. Salin URL database (mis. https://xxx-default-rtdb.firebaseio.com) ke
   CONFIG.commentsDbUrl di js/script.js.
Sebelum diisi, komentar hanya tersimpan di browser pengunjung itu sendiri (mode demo).
Untuk menghapus komentar yang tidak pantas: lewat Firebase Console.

CATATAN
- Desain dan fitur dari file HTML sumber dipertahankan.
- Ganti YOUR PHOTO dan placeholder proyek dengan foto/gambar milikmu.
- Ganti tautan GitHub, Instagram, dan alamat email contoh pada index.html.

Dibuat dari file jaya_portfolio_website.html.
