# 📸 DocScanner Live

Aplikasi web pengimbas dokumen (Document Scanner) berkuasa tinggi dan responsif. Bina fail PDF daripada kamera atau galeri, sunting gambar, susun muka surat, dan lekatkan cop air (*watermark*) vektor yang profesional — semuanya diproses secara 100% di dalam pelayar (*browser*) anda tanpa memerlukan pelayan luar (*serverless*).

![Paparan Antaramuka](https://via.placeholder.com/800x400.png?text=Letak+Screenshot+Aplikasi+Anda+Di+Sini)

## ✨ Ciri-Ciri Utama

- **📸 Kamera & Panduan Pintar:** Ambil gambar terus dari web kamera (peranti mudah alih atau PC) berserta kotak panduan ukuran dokumen sebenar (A4, Resit, & Kad Pengenalan).
- **✂️ Pemotong Gambar Pintar (Cropping):** Integrasi pemotong gambar manual untuk memastikan hanya bahagian dokumen yang penting diambil apabila memuat naik dari galeri.
- **🎨 Suntingan Gambar Visual:** Laras kecerahan, kontras, dan warna gambar secara manual, berserta penapis *Auto-Enhance* (Hitam & Putih) untuk teks yang lebih tajam.
- **🗂 Susunan Pintar (Collage Layout):** Susun berbilang gambar ke dalam 1 muka surat A4. Pilihan susunan tersedia: 1 Gambar, 2 Gambar (Sesuai untuk IC), Grid 4 Gambar, dan Grid 6 Gambar. Laras skala gambar secara bebas!
- **🔒 Cop Air Vektor (Vector Watermark):** Cop PDF anda untuk tujuan keselamatan (cth: "URUSAN BANK SAHAJA"). Sokongan tetapan saiz, warna, gaya susunan (Tengah, Bucu, Tiled/Berulang), serta kawalan kedudukan bebas (Paksi-X & Paksi-Y). Menggunakan teknologi vektor supaya saiz PDF kekal ringan (paras KB).
- **📱 Paparan Langsung (Live Preview) Dual-Mod:** Paparan *real-time* perubahan fail PDF setiap kali tetapan diubah. Menggunakan `<iframe/>` untuk kelajuan pada Desktop, dan teknologi pengolahan kanvas **PDF.js** khas untuk menyokong peranti mudah alih (iOS & Android).
- **⚡ Pemampatan Terbina (Auto-Compression):** Algoritma akan memampatkan saiz fail gambar yang besar (MB) menjadi kecil (KB) sebelum menukarkannya kepada format PDF.

## 🛡️ Privasi & Keselamatan Data

Aplikasi ini dibina dengan prinsip keselamatan pihak klien (*Client-Side Rendering*). 
**Tiada sebarang data, gambar, atau dokumen sulit yang diimbas akan dihantar atau disimpan di mana-mana pelayan / awan (cloud).** Segala pemprosesan memori, manipulasi gambar, dan penjanaan fail PDF berlaku sepenuhnya di dalam peranti anda sendiri (Sokongan penggunaan *Offline* / Tanpa Internet selepas dimuat turun).

## 🚀 Teknologi / *Tech Stack*

Projek ini dibina secara natif tanpa sebarang kerangka berat (Vanilla JS), namun dikuasakan oleh perpustakaan JavaScript yang dioptimumkan:

*   **Antaramuka (UI):** HTML5 & [Tailwind CSS](https://tailwindcss.com/)
*   **Pemotong Gambar:** [Cropper.js](https://fengyuanchen.github.io/cropperjs/)
*   **Pemampat Imej:** [browser-image-compression](https://www.npmjs.com/package/browser-image-compression)
*   **Penjana PDF:** [jsPDF](https://parall.ax/products/jspdf)
*   **Pemaparan Mobile PDF:** [PDF.js (Mozilla)](https://mozilla.github.io/pdf.js/)

## 💻 Cara Penggunaan (Pemasangan)

Kerana ia adalah aplikasi *Client-Side* sepenuhnya, tiada *NPM Install* atau persediaan pangkalan data (*database setup*) diperlukan.

1. Muat turun repo atau klon (*clone*) projek ini.
2. Pastikan anda mempunyai ketiga-tiga fail ini di dalam satu folder:
   - `index.html`
   - `style.css`
   - `script.js`
3. Buka fail `index.html` menggunakan mana-mana pelayar sesawang moden (Chrome, Safari, Edge, Firefox).
4. Sedia untuk mengimbas dokumen!

*(Nota: Fungsi Kamera mungkin memerlukan persekitaran selamat / HTTPS jika dihoskan pada pelayan web sebenar).*

## 🤝 Sumbangan (Contributing)

Sumbangan daripada komuniti amat dialu-alukan! Sama ada ia pembaikan pepijat (*bug fix*), penambahan ciri baharu, atau sekadar memperbaiki antaramuka. Sila buka *Issue* atau hantar *Pull Request*.

## 📝 Lesen

Projek ini dilesenkan di bawah [MIT License](LICENSE). Anda bebas untuk menggunakan, mengubah suai, dan mengedarkan perisian ini.