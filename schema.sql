-- Jalankan di Supabase SQL Editor

create table if not exists attendance (
  id uuid primary key default gen_random_uuid(),
  token text unique not null,
  created_at timestamptz default now()
);

alter table attendance enable row level security;

-- Semua orang boleh insert (peserta menekan tombol dari HP masing-masing,
-- tidak login). Kalau mau lebih aman, bisa dibatasi lewat Edge Function
-- yang memvalidasi token terhadap daftar peserta terdaftar.
create policy "public can insert attendance"
  on attendance for insert
  with check (true);

-- Layar utama perlu baca jumlah (count) secara realtime
create policy "public can read attendance"
  on attendance for select
  using (true);

-- Semua orang boleh men-delete data (agar admin panel bisa bekerja meskipun tanpa service_role key)
create policy "public can delete attendance"
  on attendance for delete
  using (true);

-- Aktifkan Realtime untuk tabel ini lewat:
-- Database > Replication > pilih tabel "attendance"
-- (atau: alter publication supabase_realtime add table attendance;)


-- ==========================================
-- TABEL PENGATURAN (SETTINGS) UNTUK ADMIN
-- ==========================================

create table if not exists settings (
  id text primary key default 'default',
  total_target integer default 100,
  sound_enabled boolean default false,
  updated_at timestamptz default now()
);

-- Masukkan data awal jika belum ada
insert into settings (id, total_target, sound_enabled)
values ('default', 100, false)
on conflict (id) do nothing;

-- Aktifkan RLS
alter table settings enable row level security;

-- Semua orang boleh membaca pengaturan
create policy "public can read settings"
  on settings for select
  using (true);

-- Semua orang boleh mengupdate pengaturan (agar sinkronisasi realtime bekerja jika serverless backend mengupdate)
create policy "public can update settings"
  on settings for update
  using (true);

-- Aktifkan Realtime untuk tabel settings:
-- alter publication supabase_realtime add table settings;

