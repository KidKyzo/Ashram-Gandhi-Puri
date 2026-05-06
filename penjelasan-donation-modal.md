# Penjelasan Kode — Donation Modal Form

Fitur ini menampilkan **popup form donasi** ketika user mengklik tombol "Continue Donation".
Tiga file yang diubah: `donation.html`, `donation.css`, dan `main.js`.

---

## 1. `donation.html` — Struktur Halaman

### Perubahan 1: Tambah `id` pada tombol Donate

```html
<button class="donate-btn" id="donate-btn">Continue Donation</button>
```

| Bagian | Fungsi |
|---|---|
| `class="donate-btn"` | Sudah ada sebelumnya, untuk styling CSS |
| `id="donate-btn"` | **Baru ditambahkan** — digunakan JavaScript untuk mendeteksi kapan tombol ini diklik |

> `id` bersifat unik per halaman, berbeda dengan `class` yang bisa dipakai banyak elemen.

---

### Perubahan 2: Tambah elemen Modal (Popup Form)

```html
<!-- Modal ditempatkan di luar <main>, tapi masih di dalam <body> -->
<div id="donation-modal" class="modal-overlay">

  <div class="modal-box">

    <!-- Tombol X untuk menutup modal -->
    <button class="modal-close" id="modal-close-btn">&times;</button>

    <h3>Donation Form</h3>
    <p>Please fill in the details below to proceed with your donation.</p>

    <form id="donation-form">

      <!-- Field Nama -->
      <div class="form-group">
        <label for="donor-name">Full Name</label>
        <input type="text" id="donor-name" placeholder="Your full name" />
      </div>

      <!-- Field Email -->
      <div class="form-group">
        <label for="donor-email">Email Address</label>
        <input type="email" id="donor-email" placeholder="your@email.com" />
      </div>

      <!-- Field Jumlah Donasi -->
      <div class="form-group">
        <label for="donor-amount">Donation Amount (IDR)</label>
        <input type="number" id="donor-amount" placeholder="e.g. 50000" min="1" />
      </div>

      <!-- Dropdown Metode Pembayaran -->
      <div class="form-group">
        <label for="donor-payment">Payment Method</label>
        <select id="donor-payment">
          <option value="">-- Select --</option>
          <option value="bank-transfer">Bank Transfer</option>
          <option value="credit-card">Credit Card</option>
          <option value="e-wallet">E-Wallet</option>
        </select>
      </div>

      <!-- Tombol Submit -->
      <button type="submit" class="donate-btn" style="width: 100%;">Confirm Donation</button>
    </form>

  </div>
</div>
```

| Elemen / Atribut | Fungsi |
|---|---|
| `id="donation-modal"` | ID unik agar JavaScript bisa menemukan dan menampilkan modal ini |
| `class="modal-overlay"` | CSS class untuk membuat latar gelap di belakang popup |
| `class="modal-box"` | CSS class untuk kotak putih di tengah layar |
| `id="modal-close-btn"` | ID untuk tombol X, digunakan JS agar tombol ini menutup modal |
| `&times;` | Kode HTML untuk simbol × (X) |
| `id="donation-form"` | ID untuk elemen `<form>`, digunakan JS untuk mendeteksi submit |
| `class="form-group"` | Membungkus setiap pasangan label + input, untuk spacing yang rapi |
| `for="donor-name"` | Menghubungkan `<label>` ke `<input>` dengan `id` yang sama |
| `type="email"` | Browser otomatis memvalidasi format email (harus ada `@`) |
| `type="number"` | Hanya menerima angka |
| `min="1"` | Jumlah donasi minimal 1 |
| `<select>` + `<option>` | Membuat dropdown pilihan metode pembayaran |
| `type="submit"` | Tombol ini mentrigger event `submit` pada form saat diklik |

---

## 2. `donation.css` — Tampilan Modal

```css
/* Latar gelap di belakang popup */
.modal-overlay {
  display: none;           /* Disembunyikan secara default */
  position: fixed;         /* Tetap di layar meskipun halaman di-scroll */
  top: 0; left: 0;
  width: 100%; height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Hitam transparan 50% */
  z-index: 1000;           /* Tampil di atas semua elemen lain */
  justify-content: center; /* Pusatkan modal secara horizontal */
  align-items: center;     /* Pusatkan modal secara vertikal */
}

/* Ketika JS menambahkan class "active", modal ditampilkan */
.modal-overlay.active {
  display: flex;
}
```

> **Kenapa `display: flex` bukan `display: block`?**
> Karena `flex` + `justify-content: center` + `align-items: center` adalah cara termudah untuk menaruh elemen tepat di tengah layar.

```css
/* Kotak putih isi form */
.modal-box {
  background-color: #ffffff;
  padding: 2.5rem 2rem;
  border-radius: 10px;
  width: 100%;
  max-width: 480px;   /* Agar tidak terlalu lebar di layar besar */
  position: relative; /* Diperlukan agar tombol X bisa diposisikan di sudut */
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}
```

```css
/* Tombol X di pojok kanan atas */
.modal-close {
  position: absolute; /* Keluar dari alur normal, posisi relatif ke .modal-box */
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.8rem;
  cursor: pointer;
  color: #999;
}
```

```css
/* Setiap baris label + input */
.form-group {
  margin-bottom: 1.2rem;
  text-align: left;
}

.form-group label {
  display: block;     /* Label di baris sendiri, di atas input */
  margin-bottom: 0.4rem;
  font-weight: 600;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  box-sizing: border-box; /* Padding tidak menambah lebar total elemen */
  transition: border-color 0.2s;
}

/* Highlight border saat input difokus */
.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--primary-color);
}
```

---

## 3. `main.js` — Logika JavaScript

```js
// Step 1: Ambil referensi elemen HTML yang dibutuhkan
const donateBtn     = document.getElementById("donate-btn");
const donationModal = document.getElementById("donation-modal");
const closeBtn      = document.getElementById("modal-close-btn");
const donationForm  = document.getElementById("donation-form");
```

> `document.getElementById("...")` = cari elemen di halaman berdasarkan `id`-nya.

---

```js
// Step 2: Buka modal saat tombol donate diklik
if (donateBtn && donationModal) {
  donateBtn.addEventListener("click", function () {
    donationModal.classList.add("active");
  });
}
```

| Kode | Fungsi |
|---|---|
| `if (donateBtn && donationModal)` | Cek dulu apakah elemen ada di halaman, agar tidak error di halaman lain |
| `addEventListener("click", ...)` | Pasang "pendengar" — jalankan fungsi ketika diklik |
| `classList.add("active")` | Tambahkan class `active` ke modal → CSS `.modal-overlay.active` membuatnya tampil |

---

```js
// Step 3: Tutup modal saat tombol X diklik
if (closeBtn && donationModal) {
  closeBtn.addEventListener("click", function () {
    donationModal.classList.remove("active");
  });
}
```

> `classList.remove("active")` = kebalikan dari `.add()`, menghilangkan class sehingga modal tersembunyi lagi.

---

```js
// Step 4: Tutup modal jika klik di luar kotak (di latar gelap)
if (donationModal) {
  donationModal.addEventListener("click", function (event) {
    if (event.target === donationModal) {
      donationModal.classList.remove("active");
    }
  });
}
```

> `event.target` = elemen yang **benar-benar diklik** user.
> Jika user klik di dalam `.modal-box`, `event.target` bukan `donationModal`, jadi modal tidak tertutup.
> Jika user klik latar gelap, `event.target === donationModal`, maka modal ditutup.

---

```js
// Step 5: Proses submit form
if (donationForm) {
  donationForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Cegah halaman reload

    const name    = document.getElementById("donor-name").value.trim();
    const email   = document.getElementById("donor-email").value.trim();
    const amount  = document.getElementById("donor-amount").value.trim();
    const payment = document.getElementById("donor-payment").value;

    if (name === "" || email === "" || amount === "" || payment === "") {
      alert("Please fill in all fields before confirming.");
    } else {
      alert("Thank you, " + name + "! Your donation of IDR "
        + parseInt(amount).toLocaleString("id-ID")
        + " has been received. We will send a confirmation to " + email + ".");
      donationForm.reset();
      donationModal.classList.remove("active");
    }
  });
}
```

| Kode | Fungsi |
|---|---|
| `event.preventDefault()` | Hentikan perilaku default form (reload halaman) |
| `.value.trim()` | Ambil isi input dan hapus spasi di awal/akhir |
| `parseInt(amount).toLocaleString("id-ID")` | Ubah angka menjadi format mata uang Indonesia, misal `50000` → `50.000` |
| `donationForm.reset()` | Kosongkan semua field form setelah submit berhasil |
| `classList.remove("active")` | Tutup modal setelah submit berhasil |

---

## Ringkasan Alur Kerja

```
User klik "Continue Donation"
         ↓
JS: donationModal.classList.add("active")
         ↓
CSS: .modal-overlay.active { display: flex } → Modal muncul
         ↓
User isi form → klik "Confirm Donation"
         ↓
JS: cek semua field terisi?
    ├── Tidak → alert("Please fill in all fields...")
    └── Ya   → alert("Thank you...") → reset form → tutup modal
```
