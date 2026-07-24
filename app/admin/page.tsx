'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import ConfirmModal from '@/components/ConfirmModal';
import {
  Settings,
  Users,
  Volume2,
  VolumeX,
  RotateCcw,
  Zap,
  LogOut,
  AlertTriangle,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [totalTarget, setTotalTarget] = useState(100);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [particlesEnabled, setParticlesEnabled] = useState(true);
  const [simulateName, setSimulateName] = useState('');
  const [loading, setLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const router = useRouter();

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      try {
        const res = await fetch('/api/admin/action', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'ping' }),
        });

        if (res.status === 401 || res.status === 403) {
          router.push('/admin/login');
          return;
        }

        // Ambil data pengaturan awal jika auth valid
        const { data, error: fetchErr } = await supabase
          .from('settings')
          .select('*')
          .eq('id', 'default')
          .maybeSingle();

        if (fetchErr) {
          console.error(fetchErr);
        }

        if (data) {
          setTotalTarget(data.total_target);
          setSoundEnabled(data.sound_enabled);
          setParticlesEnabled(data.particles_enabled !== false);
        }

        setAuthChecked(true);
      } catch (err) {
        console.error(err);
        router.push('/admin/login');
      }
    };

    checkAuthAndLoad();
  }, [router]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update-settings',
          payload: { target: totalTarget, sound: soundEnabled, particles: particlesEnabled },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal memperbarui pengaturan.');
      }

      setMessage('Pengaturan berhasil diperbarui!');
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateTap = async () => {
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'simulate',
          payload: { name: simulateName },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal mengirim simulasi tap.');
      }

      setMessage(`Simulasi tap "${simulateName || 'Peserta Anonim'}" berhasil dikirim!`);
      setSimulateName('');
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetCount = () => {
    setIsConfirmOpen(true);
  };

  const executeResetCount = async () => {
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset' }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal mereset data.');
      }

      setMessage('Data click berhasil dikosongkan!');
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'logout' }),
      });
      router.push('/admin/login');
    } catch (err) {
      console.error(err);
    }
  };

  if (!authChecked) {
    return (
      <main
        style={{
          minHeight: '100dvh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--color-bg-dark)',
          color: 'var(--color-beige)',
        }}
      >
        <p style={{ fontWeight: 700, fontSize: 16 }}>Memverifikasi Sesi Admin...</p>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: '100dvh',
        background: 'var(--color-bg-dark)',
        color: 'var(--color-beige)',
        fontFamily: 'var(--font-body)',
        padding: '40px 24px',
      }}
    >
      <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 32 }}>
        {/* Header Dashboard */}
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '2.5px solid var(--color-white)',
            paddingBottom: 20,
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
                fontWeight: 700,
                textTransform: 'uppercase',
                margin: 0,
                color: 'var(--color-white)',
              }}
            >
              Control Panel Admin
            </h1>
            <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: 13, margin: '4px 0 0 0' }}>
              Kelola jalannya ceremonial Pembukaan CODEX-2 secara realtime.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="logout-btn"
            style={{
              padding: '10px 16px',
              borderRadius: 'var(--radius-sm)',
              background: 'transparent',
              border: '2px solid var(--color-white)',
              color: 'var(--color-white)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              textTransform: 'uppercase',
              transition: 'all 0.15s ease-out',
            }}
          >
            <LogOut size={16} />
            <span>Keluar</span>
          </button>
        </header>

        {/* Notifikasi feedback */}
        {message && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              color: 'var(--color-bg-dark)',
              background: 'var(--color-pistachio)',
              border: '2.5px solid var(--color-white)',
              padding: '14px 18px',
              borderRadius: 'var(--radius-sm)',
              boxShadow: '3px 3px 0px var(--color-white)',
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            <CheckCircle2 size={20} />
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              color: '#FF5252',
              background: 'rgba(255, 82, 82, 0.1)',
              border: '2.5px solid #FF5252',
              padding: '14px 18px',
              borderRadius: 'var(--radius-sm)',
              boxShadow: '3px 3px 0px #FF5252',
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Dashboard Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 28,
          }}
        >
          {/* Card 1: Pengaturan Target & Suara */}
          <section
            className="admin-card"
            style={{
              background: 'var(--color-card-dark)',
              border: '2.5px solid var(--color-white)',
              borderRadius: 'var(--radius-md)',
              padding: 28,
              boxShadow: 'var(--shadow-organic)',
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Settings size={20} />
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 18,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  margin: 0,
                  color: 'var(--color-white)',
                }}
              >
                Pengaturan Layar
              </h2>
            </div>

            <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase' }}>Target Click</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Users size={18} style={{ color: 'rgba(255,255,255,0.4)' }} />
                  <input
                    type="number"
                    min="1"
                    value={totalTarget}
                    onChange={(e) => setTotalTarget(Math.max(1, parseInt(e.target.value) || 1))}
                    style={{
                      flex: 1,
                      padding: '10px 12px',
                      background: 'var(--color-bg-dark)',
                      border: '2px solid var(--color-white)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--color-white)',
                      fontSize: 15,
                      fontWeight: 700,
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase' }}>Suara Chime Realtime</span>
                  <span style={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.5)' }}>
                    Nyalakan efek suara di proyektor saat ada tap.
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-sm)',
                    background: soundEnabled ? 'var(--color-pistachio)' : 'transparent',
                    border: '2px solid var(--color-white)',
                    color: soundEnabled ? 'var(--color-bg-dark)' : 'var(--color-white)',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: 12,
                    textTransform: 'uppercase',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
                  <span>{soundEnabled ? 'Aktif' : 'Mute'}</span>
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: 16 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase' }}>Partikel Layar</span>
                  <span style={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.5)' }}>
                    Nyalakan ikon teknologi melayang setelah 100%.
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setParticlesEnabled(!particlesEnabled)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-sm)',
                    background: particlesEnabled ? 'var(--color-pistachio)' : 'transparent',
                    border: '2px solid var(--color-white)',
                    color: particlesEnabled ? 'var(--color-bg-dark)' : 'var(--color-white)',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: 12,
                    textTransform: 'uppercase',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  {particlesEnabled ? <Zap size={14} /> : <VolumeX size={14} />}
                  <span>{particlesEnabled ? 'Aktif' : 'Mute'}</span>
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="action-btn"
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  fontSize: 14,
                  fontWeight: 700,
                  fontFamily: 'var(--font-heading)',
                  textTransform: 'uppercase',
                  borderRadius: 'var(--radius-sm)',
                  border: '2px solid var(--color-white)',
                  color: 'var(--color-bg-dark)',
                  background: 'var(--color-carolina-blue)',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: '3px 3px 0px var(--color-white)',
                  transition: 'all 0.15s ease-out',
                }}
              >
                Simpan Pengaturan
              </button>
            </form>
          </section>

          {/* Card 2: Simulasi Tap Peserta */}
          <section
            className="admin-card"
            style={{
              background: 'var(--color-card-dark)',
              border: '2.5px solid var(--color-white)',
              borderRadius: 'var(--radius-md)',
              padding: 28,
              boxShadow: 'var(--shadow-organic)',
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Zap size={20} />
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 18,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  margin: 0,
                  color: 'var(--color-white)',
                }}
              >
                Simulasi Click
              </h2>
            </div>

            <p style={{ fontSize: 13, color: 'rgba(255, 255, 255, 0.6)', margin: 0, lineHeight: 1.4 }}>
              Kirim simulasi data click langsung dari sistem untuk menguji jalannya animasi visual proyektor dan chime.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase' }}>Nama / No. Kursi Simulasi</label>
              <input
                type="text"
                placeholder="Contoh: Meja 5, Budi, dll."
                value={simulateName}
                onChange={(e) => setSimulateName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'var(--color-bg-dark)',
                  border: '2px solid var(--color-white)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--color-white)',
                  fontSize: 15,
                  fontWeight: 700,
                  outline: 'none',
                }}
              />
            </div>

            <button
              onClick={handleSimulateTap}
              disabled={loading}
              className="action-btn"
              style={{
                width: '100%',
                padding: '14px 18px',
                fontSize: 14,
                fontWeight: 700,
                fontFamily: 'var(--font-heading)',
                textTransform: 'uppercase',
                borderRadius: 'var(--radius-sm)',
                border: '2px solid var(--color-white)',
                color: 'var(--color-bg-dark)',
                background: 'var(--color-pistachio)',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '3px 3px 0px var(--color-white)',
                transition: 'all 0.15s ease-out',
                marginTop: 'auto',
              }}
            >
              Simulasikan Tap ⚡
            </button>
          </section>
        </div>

        {/* Card 3: Reset Count (Destructive action) */}
        <section
          style={{
            background: 'var(--color-card-dark)',
            border: '2.5px solid #FF5252',
            borderRadius: 'var(--radius-md)',
            padding: 28,
            boxShadow: '4px 4px 0px #FF5252',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#FF5252' }}>
            <AlertTriangle size={22} />
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 18,
                fontWeight: 700,
                textTransform: 'uppercase',
                margin: 0,
              }}
            >
              Zona Destruktif
            </h2>
          </div>

          <p style={{ fontSize: 13, color: 'rgba(255, 255, 255, 0.6)', margin: 0, lineHeight: 1.4 }}>
            Membersihkan seluruh database attendance. Hal ini akan mereset hitungan di layar proyektor kembali menjadi 0 (Kosong) seketika untuk persiapan acara baru.
          </p>

          <button
            onClick={handleResetCount}
            disabled={loading}
            className="reset-btn"
            style={{
              alignSelf: 'flex-start',
              padding: '12px 24px',
              fontSize: 13,
              fontWeight: 700,
              fontFamily: 'var(--font-heading)',
              textTransform: 'uppercase',
              borderRadius: 'var(--radius-sm)',
              border: '2px solid #FF5252',
              color: '#FF5252',
              background: 'transparent',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s ease-out',
            }}
          >
            Reset Semua Data Click
          </button>
        </section>
      </div>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={executeResetCount}
        title="Konfirmasi Reset"
        message="PERINGATAN KERAS! Apakah Anda yakin ingin menghapus SEMUA data click? Tindakan ini tidak bisa dibatalkan dan hitungan di layar utama akan kembali menjadi 0 secara instan."
        confirmText="Reset Sekarang"
        cancelText="Batal"
        type="danger"
      />

      <style jsx>{`
        .logout-btn:hover {
          background-color: var(--color-white) !important;
          color: var(--color-bg-dark) !important;
        }
        .action-btn:hover:not(:disabled) {
          transform: translate(-1px, -1px);
          box-shadow: 4px 4px 0px var(--color-white) !important;
        }
        .action-btn:active:not(:disabled) {
          transform: translate(1px, 1px);
          box-shadow: 2px 2px 0px var(--color-white) !important;
        }
        .reset-btn:hover:not(:disabled) {
          background-color: #FF5252 !important;
          color: var(--color-bg-dark) !important;
        }
      `}</style>
    </main>
  );
}
