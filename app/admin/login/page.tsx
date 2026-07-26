'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, AlertCircle, ArrowRight } from 'lucide-react';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login gagal.');
      }

      router.push('/admin');
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setLoading(false);
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
        background: 'var(--color-bg-dark)',
        color: 'var(--color-beige)',
        fontFamily: 'var(--font-body)',
        padding: 24,
      }}
    >
      <div className="ticket-wrapper" style={{ maxWidth: 400, width: '100%' }}>
        <div className="ticket" style={{ '--t-accent': 'var(--color-carolina-blue)', '--t-accent-glow': 'rgba(135, 174, 206, 0.4)' } as any}>
          <div className="t-main">
            <div className="t-content">
              <div className="t-header">
                <div className="t-logo">
                  <Lock size={20} style={{ color: 'var(--color-carolina-blue)' }} />
                  SECURITY
                </div>
                <div className="t-type">ADMIN ACCESS</div>
              </div>
              <div className="t-title" style={{ fontSize: '1.8rem' }}>SYSTEM<br />PANEL</div>
              <div className="t-subtitle" style={{ marginBottom: '1.5em' }}>
                Masukkan kata sandi admin untuk mengakses kontrol sistem.
              </div>

              <form onSubmit={handleLogin} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <input
                    type="password"
                    placeholder="Kata Sandi Admin"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      fontSize: 15,
                      background: 'rgba(255, 255, 255, 0.03)',
                      color: 'var(--color-white)',
                      border: '1.5px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: 'var(--radius-sm)',
                      outline: 'none',
                      transition: 'all 0.25s ease',
                      textAlign: 'center',
                      letterSpacing: password ? '3px' : 'normal',
                    }}
                    onFocus={(e) => {
                      e.target.style.border = '1.5px solid var(--color-carolina-blue)';
                      e.target.style.boxShadow = '0 0 12px rgba(135, 174, 206, 0.25)';
                    }}
                    onBlur={(e) => {
                      e.target.style.border = '1.5px solid rgba(255, 255, 255, 0.12)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                {error && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      color: '#FF5252',
                      fontSize: 13,
                      fontWeight: 600,
                      border: '1.5px solid rgba(255, 82, 82, 0.3)',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(255, 82, 82, 0.05)',
                    }}
                  >
                    <AlertCircle size={16} />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="cyber-button"
                  style={{ width: '100%', marginTop: 8 }}
                >
                  <div className="cyber-inner" style={{ background: 'linear-gradient(180deg, var(--color-fern-green), #000)', borderBottomColor: '#2b4412' }}>
                    <span>{loading ? 'Masuk...' : 'Masuk Admin'}</span>
                    <ArrowRight size={18} />
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
              <div className="t-barcode-id">CODEX-2-SECURE</div>
            </div>
            <div className="t-admit">
              <div className="t-admit-text">ROLE</div>
              <div className="t-admit-num" style={{ fontSize: '1.8em', color: 'var(--color-carolina-blue)' }}>SEC</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
