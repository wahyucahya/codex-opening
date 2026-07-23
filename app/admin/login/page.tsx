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
        }}
      >
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: 'var(--radius-sm)',
            background: 'var(--color-carolina-blue)',
            border: '2px solid var(--color-white)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-bg-dark)',
            boxShadow: '3px 3px 0px var(--color-white)',
          }}
        >
          <Lock size={28} />
        </div>

        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 26,
              fontWeight: 700,
              textTransform: 'uppercase',
              margin: 0,
              color: 'var(--color-white)',
            }}
          >
            Admin Panel
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: 13, margin: 0 }}>
            Masukkan kata sandi admin untuk mengakses kontrol sistem.
          </p>
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
                background: 'var(--color-bg-dark)',
                color: 'var(--color-white)',
                border: '2px solid var(--color-white)',
                borderRadius: 'var(--radius-sm)',
                outline: 'none',
                boxShadow: 'inset 2px 2px 0px rgba(0,0,0,0.5)',
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
                border: '1.5px solid #FF5252',
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
            className="neobrutalist-btn"
            style={{
              width: '100%',
              padding: '16px 20px',
              fontSize: 16,
              fontWeight: 700,
              fontFamily: 'var(--font-heading)',
              textTransform: 'uppercase',
              borderRadius: 'var(--radius-sm)',
              border: '2.5px solid var(--color-white)',
              color: 'var(--color-bg-dark)',
              background: 'var(--color-pistachio)',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '4px 4px 0px var(--color-white)',
              transition: 'all 0.15s ease-out',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <span>{loading ? 'Masuk...' : 'Masuk Admin'}</span>
            <ArrowRight size={18} />
          </button>
        </form>
      </div>

      <style jsx>{`
        .neobrutalist-btn:hover:not(:disabled) {
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
