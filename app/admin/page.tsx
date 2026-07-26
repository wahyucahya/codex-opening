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
          <div className="ticket-wrapper">
            <div className="ticket" style={{ '--t-accent': 'var(--color-carolina-blue)', '--t-accent-glow': 'rgba(135, 174, 206, 0.4)' } as any}>
              <div className="t-main" style={{ minHeight: '380px', display: 'flex', flexDirection: 'column' }}>
                <div className="t-content" style={{ display: 'flex', flexDirection: 'column', gap: 20, flex: 1 }}>
                  <div className="t-header" style={{ marginBottom: 0 }}>
                    <div className="t-logo">
                      <Settings size={20} style={{ color: 'var(--color-carolina-blue)' }} />
                      CONFIG
                    </div>
                    <div className="t-type">SYSTEM SETTINGS</div>
                  </div>

                  <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <label style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: 'var(--t-text-muted)', letterSpacing: '0.5px' }}>Target Click</label>
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
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1.5px solid rgba(255, 255, 255, 0.12)',
                            borderRadius: 'var(--radius-sm)',
                            color: 'var(--color-white)',
                            fontSize: 15,
                            fontWeight: 700,
                            outline: 'none',
                            transition: 'all 0.2s ease',
                          }}
                          onFocus={(e) => {
                            e.target.style.border = '1.5px solid var(--color-carolina-blue)';
                            e.target.style.boxShadow = '0 0 10px rgba(135, 174, 206, 0.2)';
                          }}
                          onBlur={(e) => {
                            e.target.style.border = '1.5px solid rgba(255, 255, 255, 0.12)';
                            e.target.style.boxShadow = 'none';
                          }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase' }}>Suara Chime Realtime</span>
                        <span style={{ fontSize: 11, color: 'rgba(255, 255, 255, 0.4)', lineHeight: 1.3 }}>
                          Efek suara di proyektor saat tap.
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSoundEnabled(!soundEnabled)}
                        style={{
                          padding: '8px 14px',
                          borderRadius: 'var(--radius-sm)',
                          background: soundEnabled ? 'rgba(175, 208, 110, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                          border: soundEnabled ? '1.5px solid var(--color-pistachio)' : '1.5px solid rgba(255, 255, 255, 0.15)',
                          color: soundEnabled ? 'var(--color-pistachio)' : 'rgba(255, 255, 255, 0.6)',
                          cursor: 'pointer',
                          fontWeight: 700,
                          fontSize: 12,
                          textTransform: 'uppercase',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          transition: 'all 0.2s ease',
                          boxShadow: soundEnabled ? '0 0 10px rgba(175, 208, 110, 0.15)' : 'none',
                        }}
                      >
                        {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
                        <span>{soundEnabled ? 'Aktif' : 'Mute'}</span>
                      </button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: 12 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase' }}>Partikel Layar</span>
                        <span style={{ fontSize: 11, color: 'rgba(255, 255, 255, 0.4)', lineHeight: 1.3 }}>
                          Ikon teknologi melayang setelah 100%.
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setParticlesEnabled(!particlesEnabled)}
                        style={{
                          padding: '8px 14px',
                          borderRadius: 'var(--radius-sm)',
                          background: particlesEnabled ? 'rgba(175, 208, 110, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                          border: particlesEnabled ? '1.5px solid var(--color-pistachio)' : '1.5px solid rgba(255, 255, 255, 0.15)',
                          color: particlesEnabled ? 'var(--color-pistachio)' : 'rgba(255, 255, 255, 0.6)',
                          cursor: 'pointer',
                          fontWeight: 700,
                          fontSize: 12,
                          textTransform: 'uppercase',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          transition: 'all 0.2s ease',
                          boxShadow: particlesEnabled ? '0 0 10px rgba(175, 208, 110, 0.15)' : 'none',
                        }}
                      >
                        {particlesEnabled ? <Zap size={14} /> : <VolumeX size={14} />}
                        <span>{particlesEnabled ? 'Aktif' : 'Mute'}</span>
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="cyber-button"
                      style={{ width: '100%', marginTop: 'auto' }}
                    >
                      <div className="cyber-inner" style={{ background: 'linear-gradient(180deg, var(--color-carolina-blue), #000)', borderBottomColor: '#2b446a' }}>
                        <span>Simpan Pengaturan</span>
                      </div>
                    </button>
                  </form>
                </div>
                <div className="t-perforation" style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', transform: 'translateY(50%)' }}>
                  <div className="t-perf-line" />
                </div>
              </div>
              <div className="t-stub">
                <div className="t-barcode-container">
                  <div className="t-barcode" />
                  <div className="t-barcode-id">CODEX-2-CONFIG</div>
                </div>
                <div className="t-admit">
                  <div className="t-admit-text">SYS</div>
                  <div className="t-admit-num" style={{ fontSize: '1.8em', color: 'var(--color-carolina-blue)' }}>CFG</div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Simulasi Tap Peserta */}
          <div className="ticket-wrapper">
            <div className="ticket" style={{ '--t-accent': 'var(--color-pistachio)', '--t-accent-glow': 'rgba(175, 208, 110, 0.4)' } as any}>
              <div className="t-main" style={{ minHeight: '380px', display: 'flex', flexDirection: 'column' }}>
                <div className="t-content" style={{ display: 'flex', flexDirection: 'column', gap: 20, flex: 1 }}>
                  <div className="t-header" style={{ marginBottom: 0 }}>
                    <div className="t-logo">
                      <Zap size={20} style={{ color: 'var(--color-pistachio)' }} />
                      SIMULATE
                    </div>
                    <div className="t-type">TEST UTILITY</div>
                  </div>

                  <p style={{ fontSize: 13, color: 'rgba(255, 255, 255, 0.6)', margin: 0, lineHeight: 1.5 }}>
                    Kirim simulasi data click langsung dari sistem untuk menguji jalannya animasi visual proyektor dan chime.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
                    <label style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: 'var(--t-text-muted)', letterSpacing: '0.5px' }}>Nama / No. Kursi Simulasi</label>
                    <input
                      type="text"
                      placeholder="Contoh: Meja 5, Budi, dll."
                      value={simulateName}
                      onChange={(e) => setSimulateName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1.5px solid rgba(255, 255, 255, 0.12)',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--color-white)',
                        fontSize: 15,
                        fontWeight: 700,
                        outline: 'none',
                        transition: 'all 0.2s ease',
                      }}
                      onFocus={(e) => {
                        e.target.style.border = '1.5px solid var(--color-pistachio)';
                        e.target.style.boxShadow = '0 0 10px rgba(175, 208, 110, 0.2)';
                      }}
                      onBlur={(e) => {
                        e.target.style.border = '1.5px solid rgba(255, 255, 255, 0.12)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>

                  <button
                    onClick={handleSimulateTap}
                    disabled={loading}
                    className="cyber-button"
                    style={{ width: '100%', marginTop: 'auto' }}
                  >
                    <div className="cyber-inner" style={{ background: 'linear-gradient(180deg, var(--color-pistachio), #000)', borderBottomColor: '#3d5222', color: '#fff', textShadow: '1px 1px #000, 0 0 9px var(--color-pistachio)' }}>
                      <span>Simulasikan Tap ⚡</span>
                    </div>
                  </button>
                </div>
                <div className="t-perforation" style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', transform: 'translateY(50%)' }}>
                  <div className="t-perf-line" />
                </div>
              </div>
              <div className="t-stub">
                <div className="t-barcode-container">
                  <div className="t-barcode" />
                  <div className="t-barcode-id">CODEX-2-TESTER</div>
                </div>
                <div className="t-admit">
                  <div className="t-admit-text">TAP</div>
                  <div className="t-admit-num" style={{ fontSize: '1.8em', color: 'var(--color-pistachio)' }}>SIM</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Reset Count (Destructive action) */}
        <div className="ticket-wrapper" style={{ marginTop: 28 }}>
          <div className="ticket" style={{ '--t-accent': '#FF5252', '--t-accent-glow': 'rgba(255, 82, 82, 0.4)' } as any}>
            <div className="t-main">
              <div className="t-content" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="t-header" style={{ marginBottom: 0 }}>
                  <div className="t-logo" style={{ color: '#FF5252' }}>
                    <AlertTriangle size={20} />
                    DANGER ZONE
                  </div>
                  <div className="t-type" style={{ color: '#FF5252', borderColor: '#FF5252', boxShadow: '0 0 8px rgba(255, 82, 82, 0.3)' }}>DESTRUCT PASS</div>
                </div>

                <p style={{ fontSize: 13, color: 'rgba(255, 255, 255, 0.6)', margin: 0, lineHeight: 1.5 }}>
                  Membersihkan seluruh database attendance. Hal ini akan mereset hitungan di layar proyektor kembali menjadi 0 (Kosong) seketika untuk persiapan acara baru.
                </p>

                <button
                  onClick={handleResetCount}
                  disabled={loading}
                  className="cyber-button"
                  style={{ display: 'inline-block', width: 'fit-content', marginTop: 8 }}
                >
                  <div className="cyber-inner" style={{ background: 'linear-gradient(180deg, #FF5252, #000)', borderBottomColor: '#6a1d1d', color: '#fff', textShadow: '1px 1px #000, 0 0 9px #FF5252' }}>
                    <span>Reset Semua Data Click</span>
                  </div>
                </button>
              </div>
              <div className="t-perforation" style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', transform: 'translateY(50%)' }}>
                <div className="t-perf-line" />
              </div>
            </div>
            <div className="t-stub">
              <div className="t-barcode-container">
                <div className="t-barcode" />
                <div className="t-barcode-id">CODEX-2-RESET</div>
              </div>
              <div className="t-admit">
                <div className="t-admit-text">WARN</div>
                <div className="t-admit-num" style={{ fontSize: '1.8em', color: '#FF5252' }}>RST</div>
              </div>
            </div>
          </div>
        </div>
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
          background-color: rgba(255, 255, 255, 0.1) !important;
          border-color: rgba(255, 255, 255, 0.4) !important;
        }
      `}</style>
    </main>
  );
}
