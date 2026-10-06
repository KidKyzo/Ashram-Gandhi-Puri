# Ashram Gandhi Puri — Next.js + Tailwind CSS Edition

Versi modern dari website **Ashram Gandhi Puri**, dikonversi dari HTML/CSS statis ke **Next.js (App Router)** dengan **TypeScript** dan **Tailwind CSS**.

---

## 🚀 Cara Menjalankan Secara Lokal

Masuk ke direktori `next-app`:
```bash
cd next-app
npm run dev
```

Buka browser di [http://localhost:3000](http://localhost:3000).

Untuk membuat production build:
```bash
npm run build
npm run start
```

---

## 📁 Struktur Halaman & Routing

| Halaman | URL Next.js | File Sumber Asli |
| :--- | :--- | :--- |
| **Home** | `/` | `pages/index.html` |
| **Gallery** | `/gallery` | `pages/gallery.html` |
| **Volunteer** | `/volunteer` | `pages/volunteer.html` |
| **Donation** | `/donation` | `pages/donation.html` |

---

## 🛠️ Stack & Fitur Baru

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (Type safety ketat)
- **Styling**: Tailwind CSS v4 dengan token tema resmi Ashram Gandhi Puri
- **Typography**: Google Fonts via `next/font/google` (`Fredoka` untuk heading, `Nunito` untuk body text)
- **Icons**: Lucide React (Standar SVG modern, bebas emoji)
- **Interaktivitas**:
  - **Gallery Search & Sort**: Real-time filtering dan sorting (newest/oldest) dengan live count status
  - **Bank Account 1-Click Copy**: Fitur salin nomor rekening Bank Mandiri dengan feedback status visual
  - **Accessible Donation Modal**: Trap fokus, tombol Escape, dan upload bukti transfer
  - **Toast Notifications**: Sistem notifikasi mengambang untuk seluruh feedback form & interaksi pengguna
  - **Mobile Responsive Drawer**: Navigasi responsif untuk mobile dan tablet

---

## 🛡️ Catatan Keamanan Tugas Kampus

Versi asli vanilla HTML/CSS/JS tetap tersimpan secara aman di direktori root `../pages` dan `../css` sehingga file tugas awal tidak hilang dan aman untuk kriteria penilaian dosen.
