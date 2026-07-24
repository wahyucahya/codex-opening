'use client';

import Link from 'next/link';
import { ScreenShare, UserCheck, Settings, Database, QrCode } from 'lucide-react';

export default function Home() {
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
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative Large Background Text */}
      <div
        style={{
          position: 'absolute',
          top: '5%',
          left: '-5%',
          fontSize: 'clamp(5rem, 15vw, 12rem)',
          fontWeight: 700,
          color: 'rgba(255, 255, 255, 0.015)',
          fontFamily: 'var(--font-heading)',
          zIndex: 1,
          pointerEvents: 'none',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
          transform: 'rotate(-3deg)',
        }}
      >
        CODEX CEREMONY
      </div>

      <div
        style={{
          width: '100%',
          maxWidth: 680,
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 40,
          zIndex: 2,
        }}
      >
        <div>
          {/* Asymmetric Badge */}
          <span
            style={{
              display: 'inline-block',
              padding: '6px 16px',
              background: 'var(--color-carolina-blue)',
              border: '2px solid var(--color-white)',
              fontSize: 12,
              fontWeight: 700,
              color: 'var(--color-bg-dark)',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              transform: 'rotate(-2deg)',
              boxShadow: '2px 2px 0px var(--color-white)',
              marginBottom: 16,
            }}
          >
            Realtime Ceremony Controller
          </span>
          
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.5rem, 7vw, 4.2rem)',
              fontWeight: 700,
              margin: '12px 0 16px 0',
              color: 'var(--color-white)',
              textTransform: 'uppercase',
              letterSpacing: '-1px',
              lineHeight: 1,
            }}
          >
            CODEX-2 OPENING
          </h1>
          <p
            style={{
              color: 'rgba(245, 243, 216, 0.8)',
              fontSize: 16,
              maxWidth: 520,
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            Halaman pusat kontrol untuk menguji sistem pembukaan ceremonial CODEX-2.
            Click peserta akan mengisi logo CODEX secara realtime.
          </p>
        </div>

        {/* Navigation Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 24,
            width: '100%',
          }}
        >
          {/* Card 1: Layar Utama */}
          <Link href="/layar" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div
              className="neobrutalist-card"
              style={{
                background: 'var(--color-card-dark)',
                border: '2.5px solid var(--color-white)',
                borderRadius: 'var(--radius-md)',
                padding: '32px 24px',
                textAlign: 'left',
                transition: 'var(--transition-smooth)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                height: '100%',
                boxShadow: 'var(--shadow-organic)',
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--color-carolina-blue)',
                  border: '2px solid var(--color-white)',
                  color: 'var(--color-bg-dark)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '2px 2px 0px var(--color-white)',
                }}
              >
                <ScreenShare size={24} />
              </div>
              <div>
                <h3
                  style={{
                    fontFamily: 'var(--font-heading)',
                    margin: '0 0 8px 0',
                    fontSize: 20,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: 'var(--color-white)',
                  }}
                >
                  Layar Proyektor
                </h3>
                <p style={{ margin: 0, fontSize: 14, color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.5 }}>
                  Tampilan visual logo utama CODEX yang akan terisi secara bertahap menggunakan cairan berwarna asli logo.
                </p>
              </div>
            </div>
          </Link>

          {/* Card 2: Halaman HP Peserta */}
          <Link href="/hadir/umum" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div
              className="neobrutalist-card"
              style={{
                background: 'var(--color-card-dark)',
                border: '2.5px solid var(--color-white)',
                borderRadius: 'var(--radius-md)',
                padding: '32px 24px',
                textAlign: 'left',
                transition: 'var(--transition-smooth)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                height: '100%',
                boxShadow: 'var(--shadow-organic)',
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--color-pistachio)',
                  border: '2px solid var(--color-white)',
                  color: 'var(--color-bg-dark)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '2px 2px 0px var(--color-white)',
                }}
              >
                <UserCheck size={24} />
              </div>
              <div>
                <h3
                  style={{
                    fontFamily: 'var(--font-heading)',
                    margin: '0 0 8px 0',
                    fontSize: 20,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: 'var(--color-white)',
                  }}
                >
                  Halaman Partisipasi
                </h3>
                <p style={{ margin: 0, fontSize: 14, color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.5 }}>
                  Simulasi halaman HP peserta. Scan QR atau klik tombol untuk ikut berpartisipasi menyalakan logo CODEX secara realtime.
                </p>
              </div>
            </div>
          </Link>

          {/* Card 3: Tampilan Kode QR (Dedicated QR Page) */}
          <Link href="/qr" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div
              className="neobrutalist-card"
              style={{
                background: 'var(--color-card-dark)',
                border: '2.5px solid var(--color-white)',
                borderRadius: 'var(--radius-md)',
                padding: '32px 24px',
                textAlign: 'left',
                transition: 'var(--transition-smooth)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                height: '100%',
                boxShadow: 'var(--shadow-organic)',
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--color-carolina-blue)',
                  border: '2px solid var(--color-white)',
                  color: 'var(--color-bg-dark)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '2px 2px 0px var(--color-white)',
                }}
              >
                <QrCode size={24} />
              </div>
              <div>
                <h3
                  style={{
                    fontFamily: 'var(--font-heading)',
                    margin: '0 0 8px 0',
                    fontSize: 20,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: 'var(--color-white)',
                  }}
                >
                  QR Code Partisipasi
                </h3>
                <p style={{ margin: 0, fontSize: 14, color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.5 }}>
                  Tampilan khusus kode QR dalam ukuran besar untuk diproyeksikan ke layar agar dipindai oleh peserta agar ikut menyalakan logo CODEX.
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* Footer Info */}
        <div
          style={{
            marginTop: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: 24,
            fontSize: 13,
            fontWeight: 600,
            color: 'rgba(255, 255, 255, 0.5)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Database size={15} />
            <span>Supabase Realtime</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Settings size={15} />
            <span>Next.js App Router</span>
          </div>
        </div>
      </div>

      {/* Local Hover styling using styled-jsx */}
      <style jsx>{`
        .neobrutalist-card:hover {
          transform: translate(-4px, -4px);
          box-shadow: 8px 8px 0px var(--color-pistachio) !important;
        }
      `}</style>
    </main>
  );
}
