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
          {/* Cyber Capsule Badge */}
          <span
            style={{
              display: 'inline-block',
              padding: '6px 16px',
              background: 'rgba(135, 174, 206, 0.1)',
              border: '1px solid var(--color-carolina-blue)',
              borderRadius: '99px',
              fontSize: 12,
              fontWeight: 700,
              color: 'var(--color-carolina-blue)',
              textTransform: 'uppercase',
              letterSpacing: '1.2px',
              boxShadow: '0 0 10px rgba(135, 174, 206, 0.2)',
              marginBottom: 16,
            }}
          >
            Realtime Ceremony Controller
          </span>
          
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.5rem, 7vw, 4.2rem)',
              fontWeight: 900,
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
              color: 'rgba(245, 243, 216, 0.75)',
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

        {/* Navigation Cards styled as Tickets */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 28,
            width: '100%',
          }}
        >
          {/* Card 1: Layar Utama */}
          <Link href="/layar" style={{ textDecoration: 'none', color: 'inherit' }} className="ticket-wrapper">
            <div className="ticket" style={{ '--t-accent': 'var(--color-carolina-blue)', '--t-accent-glow': 'rgba(135, 174, 206, 0.4)' } as any}>
              <div className="t-main">
                <div className="t-content">
                  <div className="t-header">
                    <div className="t-logo">
                      <ScreenShare size={20} />
                      SCREEN
                    </div>
                    <div className="t-type">PROJECTION PASS</div>
                  </div>
                  <div className="t-title">LAYAR<br />PROYEKTOR</div>
                  <div className="t-subtitle">Tampilan visual utama CODEX</div>
                  <div className="t-details">
                    <div className="t-detail-item">
                      <span className="t-label">Mode</span>
                      <span className="t-value">Liquid Fluid</span>
                    </div>
                    <div className="t-detail-item">
                      <span className="t-label">Output</span>
                      <span className="t-value">Projector</span>
                    </div>
                  </div>
                </div>
                <div className="t-perforation" style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', transform: 'translateY(50%)' }}>
                  <div className="t-perf-line" />
                </div>
              </div>
              <div className="t-stub">
                <div className="t-barcode-container">
                  <div className="t-barcode" />
                  <div className="t-barcode-id">CODEX-2-PROJ</div>
                </div>
                <div className="t-admit">
                  <div className="t-admit-text">OPEN</div>
                  <div className="t-admit-num" style={{ fontSize: '1.8em', fontWeight: 700 }}>➔</div>
                </div>
              </div>
            </div>
          </Link>

          {/* Card 2: Halaman HP Peserta */}
          <Link href="/hadir/umum" style={{ textDecoration: 'none', color: 'inherit' }} className="ticket-wrapper">
            <div className="ticket" style={{ '--t-accent': 'var(--color-pistachio)', '--t-accent-glow': 'rgba(175, 208, 110, 0.4)' } as any}>
              <div className="t-main">
                <div className="t-content">
                  <div className="t-header">
                    <div className="t-logo">
                      <UserCheck size={20} />
                      HADIR
                    </div>
                    <div className="t-type">MEMBER PASS</div>
                  </div>
                  <div className="t-title">HALAMAN<br />PESERTA</div>
                  <div className="t-subtitle">Halaman tap pengirim energi</div>
                  <div className="t-details">
                    <div className="t-detail-item">
                      <span className="t-label">Mode</span>
                      <span className="t-value">Attendance</span>
                    </div>
                    <div className="t-detail-item">
                      <span className="t-label">Access</span>
                      <span className="t-value">Public/Seat</span>
                    </div>
                  </div>
                </div>
                <div className="t-perforation" style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', transform: 'translateY(50%)' }}>
                  <div className="t-perf-line" />
                </div>
              </div>
              <div className="t-stub">
                <div className="t-barcode-container">
                  <div className="t-barcode" />
                  <div className="t-barcode-id">CODEX-2-HADIR</div>
                </div>
                <div className="t-admit">
                  <div className="t-admit-text">OPEN</div>
                  <div className="t-admit-num" style={{ fontSize: '1.8em', fontWeight: 700 }}>➔</div>
                </div>
              </div>
            </div>
          </Link>

          {/* Card 3: Tampilan Kode QR */}
          <Link href="/qr" style={{ textDecoration: 'none', color: 'inherit' }} className="ticket-wrapper">
            <div className="ticket" style={{ '--t-accent': 'var(--color-carolina-blue)', '--t-accent-glow': 'rgba(135, 174, 206, 0.4)' } as any}>
              <div className="t-main">
                <div className="t-content">
                  <div className="t-header">
                    <div className="t-logo">
                      <QrCode size={20} />
                      QR CODE
                    </div>
                    <div className="t-type">QR ACCESS</div>
                  </div>
                  <div className="t-title">QR CODE<br />GATEWAY</div>
                  <div className="t-subtitle">Tampilan QR Code ukuran besar</div>
                  <div className="t-details">
                    <div className="t-detail-item">
                      <span className="t-label">Target</span>
                      <span className="t-value">Projection Screen</span>
                    </div>
                    <div className="t-detail-item">
                      <span className="t-label">Scanning</span>
                      <span className="t-value">Open Invite</span>
                    </div>
                  </div>
                </div>
                <div className="t-perforation" style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', transform: 'translateY(50%)' }}>
                  <div className="t-perf-line" />
                </div>
              </div>
              <div className="t-stub">
                <div className="t-barcode-container">
                  <div className="t-barcode" />
                  <div className="t-barcode-id">CODEX-2-QRCODE</div>
                </div>
                <div className="t-admit">
                  <div className="t-admit-text">OPEN</div>
                  <div className="t-admit-num" style={{ fontSize: '1.8em', fontWeight: 700 }}>➔</div>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Footer Info */}
        <div
          style={{
            marginTop: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: 24,
            fontSize: 13,
            fontWeight: 600,
            color: 'rgba(255, 255, 255, 0.4)',
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

    </main>
  );
}
