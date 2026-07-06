-- Migration: Add is_free column to play_short_drama
-- Tanggal: 2026-07-06
-- Deskripsi: Menambahkan kolom is_free (Free/VIP) untuk menentukan
--            apakah episode dapat ditonton gratis atau khusus member VIP.

-- Langkah 1: Tambahkan kolom is_free ke tabel play_short_drama
ALTER TABLE play_short_drama
    ADD COLUMN IF NOT EXISTS is_free user_membership DEFAULT 'Free';

-- Langkah 2 (Opsional): Jika ingin set semua episode lama sebagai 'Free'
-- UPDATE play_short_drama SET is_free = 'Free' WHERE is_free IS NULL;

-- Langkah 3 (Opsional): Jika ingin set semua episode lama sebagai 'VIP'
-- UPDATE play_short_drama SET is_free = 'VIP' WHERE is_free IS NULL;

-- Verifikasi perubahan
-- SELECT id, episode, is_free FROM play_short_drama LIMIT 10;
