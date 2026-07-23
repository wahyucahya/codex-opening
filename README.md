# Simbolisme Pembukaan CODEX-2 — Logo Terisi oleh Kehadiran Peserta

## Alur

1. Setiap peserta dapat QR code (bisa satu QR sama untuk semua, atau unik per
   orang jika ingin cegah duplikat).
2. Scan QR → membuka halaman `/hadir/[token]` di HP peserta.
3. Peserta tekan tombol "Nyalakan CODEX" → insert 1 baris ke tabel
   `attendance` di Supabase.
4. Halaman `/layar` (ditampilkan di proyektor) berlangganan Supabase
   Realtime, setiap ada insert baru langsung menambah hitungan dan
   menganimasikan logo CODEX terisi sedikit demi sedikit dari bawah ke atas.
5. Saat semua 100 peserta sudah menekan tombol, logo terisi penuh — momen
   ini bisa jadi puncak simbolis pembukaan seminar.

## Setup singkat

1. Buat project Supabase, jalankan `supabase/schema.sql` di SQL Editor.
2. Aktifkan Realtime untuk tabel `attendance` (Database > Replication).
3. Install dependency di project Next.js:
   ```
   npm install @supabase/supabase-js
   ```
4. Tambahkan `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```
5. Copy folder `components`, `hooks`, `lib`, dan `app` ke project Next.js
   (App Router) Anda.
6. Ganti nilai `d="..."` pada `<path id="codex-logo-path">` di
   `components/FillLogo.tsx` dengan path SVG logo CODEX yang asli.
7. Generate QR code yang mengarah ke `https://domain-anda.com/hadir/<token>`
   untuk tiap peserta (atau satu QR statis kalau tidak perlu anti-duplikat).
8. Buka `/layar` di laptop yang tersambung ke proyektor saat acara dimulai.

## Kalau tidak butuh anti-duplikat

Cukup pakai satu QR yang sama untuk semua peserta, arahkan ke
`/hadir/umum` (halaman statis tanpa `[token]`), dan hapus constraint
`unique` pada kolom token di schema.sql — insert token acak (`crypto.randomUUID()`)
di client tiap kali tombol ditekan.

## Variasi lanjutan (opsional)

- Tambah suara "chime" tiap ada peserta baru menekan tombol di layar utama.
- Tambah partikel/confetti saat mencapai 100%.
- Ganti hitungan linear dengan easing supaya isian terasa lebih "hidup"
  (sudah pakai `cubic-bezier` di transition CSS).
- Gunakan `framer-motion` untuk animasi surface cairan yang lebih halus
  kalau ingin lebih dari sekadar CSS transition.
