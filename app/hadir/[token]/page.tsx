'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Bot, CheckCircle2, AlertCircle, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

/**
 * URL yang dikodekan di QR peserta: https://domain-anda.com/hadir/<token>
 * `token` unik per peserta (bisa UUID atau nomor kursi).
 * 
 * Agar peserta bisa mengklik berkali-kali tanpa terhalang UNIQUE constraint
 * pada tabel `attendance`, kita menambahkan UUID acak di belakang token.
 * Hal ini juga memicu event INSERT secara realtime di layar utama untuk setiap klik.
 */
export default function HadirPage({ params }: { params: { token: string } }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [clickCount, setClickCount] = useState(0);

  // Load click count from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(`codex_clicks_${params.token}`);
    if (saved) {
      setClickCount(parseInt(saved) || 0);
    }
  }, [params.token]);

  const handlePress = async () => {
    setStatus('loading');
    setErrorMessage('');

    // Gabungkan token dengan UUID agar selalu unik di database dan memicu realtime insert
    const baseToken = params.token || 'umum';
    const dbToken = `${baseToken}_${crypto.randomUUID()}`;

    try {
      const { error } = await supabase
        .from('attendance')
        .insert({ token: dbToken });

      if (error) {
        setErrorMessage(error.message || 'Terjadi kesalahan sistem.');
        setStatus('error');
        // Auto reset error state setelah 3 detik agar tombol bisa diklik lagi
        setTimeout(() => setStatus('idle'), 3000);
        return;
      }

      // Success feedback
      const newCount = clickCount + 1;
      setClickCount(newCount);
      localStorage.setItem(`codex_clicks_${params.token}`, newCount.toString());
      setStatus('done');

      // Trigger local confetti effect from the button area
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#437118', '#afd06e', '#87aece']
      });

      // Reset ke status idle setelah 1 detik agar bisa diklik lagi
      setTimeout(() => {
        setStatus('idle');
      }, 1000);

    } catch (err) {
      console.error(err);
      setErrorMessage('Koneksi gagal. Periksa koneksi internet Anda.');
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <main
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24,
        background: 'var(--color-bg-dark)',
        color: 'var(--color-beige)',
        textAlign: 'center',
        padding: 24,
        fontFamily: 'var(--font-body)',
        position: 'relative',
      }}
    >
      <div
        className="neobrutalist-card"
        style={{
          width: '100%',
          maxWidth: 400,
          background: 'var(--color-card-dark)',
          border: '2.5px solid var(--color-white)',
          borderRadius: 'var(--radius-md)',
          padding: '40px 24px',
          boxShadow: 'var(--shadow-organic)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 24,
          zIndex: 2,
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 'var(--radius-sm)',
            background: status === 'done' ? 'var(--color-pistachio)' : 'var(--color-carolina-blue)',
            border: '2px solid var(--color-white)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-bg-dark)',
            boxShadow: '3px 3px 0px var(--color-white)',
            transition: 'all 0.3s ease',
          }}
        >
          {status === 'done' ? <CheckCircle2 size={30} /> : <Bot size={30} />}
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 26,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '-0.5px',
              margin: 0,
              color: 'var(--color-white)',
            }}
          >
            Welcome to CODEX-2
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 14, lineHeight: 1.5, margin: 0, padding: '0 10px' }}>
            Tekan tombol di bawah berulang kali untuk menyalakan dan mengirim energi ke logo CODEX di layar utama!
          </p>
        </div>

        {clickCount > 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'var(--color-carolina-blue)',
              border: '2px solid var(--color-white)',
              padding: '8px 18px',
              borderRadius: 'var(--radius-sm)',
              fontSize: 14,
              fontWeight: 700,
              color: 'var(--color-bg-dark)',
              boxShadow: '2px 2px 0px var(--color-white)',
            }}
          >
            <Zap size={14} fill="var(--color-bg-dark)" />
            <span>Energi Anda: {clickCount}x ⚡</span>
          </div>
        )}

        <button
          onClick={handlePress}
          disabled={status === 'loading'}
          className="neobrutalist-btn"
          style={{
            width: '100%',
            maxWidth: 280,
            padding: '18px 24px',
            fontSize: 16,
            fontWeight: 700,
            fontFamily: 'var(--font-heading)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            borderRadius: 'var(--radius-sm)',
            border: '2.5px solid var(--color-white)',
            color: status === 'done' ? 'var(--color-bg-dark)' : 'var(--color-white)',
            background: status === 'done'
              ? 'var(--color-pistachio)'
              : 'var(--color-fern-green)',
            cursor: status === 'loading' ? 'not-allowed' : 'pointer',
            opacity: status === 'loading' ? 0.7 : 1,
            boxShadow: '4px 4px 0px var(--color-white)',
            transition: 'all 0.15s ease-out',
            marginTop: 10,
          }}
        >
          {status === 'loading' && 'Mengirim...'}
          {status === 'done' && 'Energi Terkirim! +1'}
          {status === 'idle' && 'Kirim Energi ⚡'}
          {status === 'error' && 'Gagal Mengirim'}
        </button>

        {status === 'error' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#FF5252', fontSize: 13, marginTop: 5, fontWeight: 600 }}>
            <AlertCircle size={16} />
            <span>{errorMessage || 'Gagal mengirim, silakan coba lagi.'}</span>
          </div>
        )}
      </div>

      <style jsx>{`
        .neobrutalist-btn:hover:not(:disabled) {
          background-color: var(--color-pistachio) !important;
          color: var(--color-bg-dark) !important;
          transform: translate(-2px, -2px);
          box-shadow: 6px 6px 0px var(--color-white) !important;
        }
        .neobrutalist-btn:active:not(:disabled) {
          transform: translate(2px, 2px);
          box-shadow: 2px 2px 0px var(--color-white) !important;
        }
      `}</style>
    </main>
  );
}
