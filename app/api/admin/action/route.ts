import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

// Buat client server menggunakan service role key (membypass RLS untuk menghapus/mereset data)
const supabaseServer = createClient(supabaseUrl, supabaseKey);

export async function POST(req: NextRequest) {
  try {
    // Verifikasi token JWT
    const token = req.cookies.get('admin_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized. Silakan login.' }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden. Sesi tidak valid.' }, { status: 403 });
    }

    const { action, payload } = await req.json();

    if (action === 'reset') {
      // Hapus semua data dari tabel attendance
      const { error } = await supabaseServer
        .from('attendance')
        .delete()
        .neq('token', 'system-admin-reserved-token-to-allow-match-all');

      if (error) {
        throw new Error(error.message);
      }

      return NextResponse.json({ success: true, message: 'Data click berhasil direset' });
    }

    if (action === 'simulate') {
      const mockName = payload?.name || `Simulasi_${Math.floor(100 + Math.random() * 900)}`;
      const dbToken = `${mockName}_${crypto.randomUUID()}`;

      const { error } = await supabaseServer
        .from('attendance')
        .insert({ token: dbToken });

      if (error) {
        throw new Error(error.message);
      }

      return NextResponse.json({ success: true, message: `Simulasi tap ${mockName} berhasil` });
    }

    if (action === 'update-settings') {
      const { target, sound, particles } = payload;
      const updatePayload: any = { total_target: target, sound_enabled: sound };

      if (particles !== undefined) {
        updatePayload.particles_enabled = particles;
      }

      // Update pengaturan ke tabel settings di Supabase
      let { error } = await supabaseServer
        .from('settings')
        .update(updatePayload)
        .eq('id', 'default');

      if (error && error.code === '42703') { // 42703 = undefined_column (particles_enabled doesn't exist yet)
        // Fallback: update target & sound only
        const fallbackResult = await supabaseServer
          .from('settings')
          .update({ total_target: target, sound_enabled: sound })
          .eq('id', 'default');
        error = fallbackResult.error;
      }

      if (error) {
        // Jika error karena tabel settings belum ada
        if (error.code === '42P01') {
          return NextResponse.json({
            error: 'Tabel "settings" belum dibuat di database Supabase Anda. Silakan jalankan query SQL di schema.sql terlebih dahulu.'
          }, { status: 400 });
        }
        throw new Error(error.message);
      }

      return NextResponse.json({ success: true, message: 'Pengaturan berhasil diperbarui' });
    }

    if (action === 'ping') {
      return NextResponse.json({ success: true, authenticated: true });
    }

    // Jika ingin log out, hapus cookies
    if (action === 'logout') {
      const response = NextResponse.json({ success: true, message: 'Logout berhasil' });
      response.cookies.set({
        name: 'admin_token',
        value: '',
        maxAge: 0,
        path: '/',
      });
      return response;
    }

    return NextResponse.json({ error: 'Action tidak valid' }, { status: 400 });
  } catch (error: any) {
    console.error('Error in admin action API:', error);
    return NextResponse.json(
      { error: error.message || 'Terjadi kesalahan server.' },
      { status: 500 }
    );
  }
}
