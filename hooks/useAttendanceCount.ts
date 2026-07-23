'use client';

import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';

/**
 * Berlangganan realtime ke tabel `attendance` di Supabase.
 * Setiap ada INSERT baru (peserta menekan tombol), count bertambah
 * dan layar utama otomatis update tanpa refresh.
 */
export function useAttendanceCount(total: number, onNewAttendance?: (token: string) => void) {
  const [count, setCount] = useState(0);
  const [ready, setReady] = useState(false);

  // Simpan callback ke ref agar tidak men-trigger re-subscribe jika referensi fungsi berubah
  const onNewAttendanceRef = useRef(onNewAttendance);
  useEffect(() => {
    onNewAttendanceRef.current = onNewAttendance;
  }, [onNewAttendance]);

  useEffect(() => {
    let active = true;

    const fetchInitialCount = async () => {
      try {
        const { count: initial, error } = await supabase
          .from('attendance')
          .select('*', { count: 'exact', head: true });
        
        if (error) {
          console.error('Error fetching initial count:', error);
          return;
        }

        if (active) {
          setCount(initial ?? 0);
          setReady(true);
        }
      } catch (err) {
        console.error('Error in fetchInitialCount:', err);
      }
    };

    fetchInitialCount();

    const channel = supabase
      .channel('attendance-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'attendance' },
        (payload) => {
          setCount((c) => c + 1);
          const insertedToken = (payload.new as any)?.token;
          if (insertedToken && onNewAttendanceRef.current) {
            onNewAttendanceRef.current(insertedToken);
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'attendance' },
        () => {
          // Ketika data dihapus/direset, ambil ulang jumlah akuratnya dari database
          fetchInitialCount();
        }
      )
      .subscribe((status, err) => {
        console.log(`[Supabase Realtime] Subscription status: ${status}`, err || '');
      });

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const percent = total > 0 ? Math.min(100, (count / total) * 100) : 0;

  return { count, percent, ready };
}

