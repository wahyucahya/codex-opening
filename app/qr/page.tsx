'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Maximize, Copy, Check, QrCode } from 'lucide-react';

export default function QRPage() {
  const [qrUrl, setQrUrl] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setQrUrl(`${window.location.origin}/hadir/umum`);
    }
  }, []);

  // Listen to fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      const el = document.documentElement as any;
      const requestMethod = el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen || el.msRequestFullscreen;
      if (requestMethod) {
        requestMethod.call(el);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(qrUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Gagal menyalin tautan:', err);
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
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative large background text */}
      <div
        style={{
          position: 'absolute',
          bottom: '-2%',
          left: '-5%',
          fontSize: 'clamp(6rem, 20vw, 16rem)',
          fontWeight: 700,
          color: 'rgba(255, 255, 255, 0.015)',
          fontFamily: 'var(--font-heading)',
          zIndex: 1,
          pointerEvents: 'none',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
          transform: 'rotate(-4deg)',
        }}
      >
        PARTISIPASI
      </div>

      {/* Header controls (Hidden if in fullscreen mode for clean projection) */}
      {!isFullscreen && (
        <div
          style={{
            position: 'absolute',
            top: 32,
            left: 40,
            right: 40,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 10,
          }}
        >
          <Link href="/" style={{ textDecoration: 'none' }}>
            <button
              style={{
                padding: '10px 18px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1.5px solid rgba(255, 255, 255, 0.15)',
                color: 'rgba(255, 255, 255, 0.8)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 13,
                cursor: 'pointer',
                fontWeight: 700,
                textTransform: 'uppercase',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
              }}
            >
              <ArrowLeft size={16} />
              <span>Kembali</span>
            </button>
          </Link>

          <button
            onClick={toggleFullscreen}
            style={{
              padding: '10px 18px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1.5px solid rgba(255, 255, 255, 0.15)',
              color: 'rgba(255, 255, 255, 0.8)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 13,
              cursor: 'pointer',
              fontWeight: 700,
              textTransform: 'uppercase',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
            }}
          >
            <Maximize size={16} />
            <span>Fullscreen</span>
          </button>
        </div>
      )}

      {/* Center QR Presenter Card styled as Ticket */}
      <div className="ticket-wrapper" style={{ maxWidth: isFullscreen ? 580 : 480, width: '95%', margin: '0 auto', zIndex: 2 }}>
        <div className="ticket" style={{ '--t-accent': 'var(--color-pistachio)', '--t-accent-glow': 'rgba(175, 208, 110, 0.4)' } as any}>
          <div className="t-main" style={{ padding: isFullscreen ? '40px 60px' : '40px 32px' }}>
            <div className="t-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
              <div className="t-header" style={{ width: '100%', marginBottom: 0 }}>
                <div className="t-logo">
                  <QrCode size={20} style={{ color: 'var(--color-pistachio)' }} />
                  GATEWAY
                </div>
                <div className="t-type">PARTISIPASI PASS</div>
              </div>

              <div>
                <h1
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: isFullscreen ? 36 : 28,
                    fontWeight: 900,
                    margin: 0,
                    color: 'var(--color-white)',
                    textTransform: 'uppercase',
                    lineHeight: 1.2,
                  }}
                >
                  Scan to Ignite
                </h1>
                <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: isFullscreen ? 15 : 13, margin: '8px 0 0 0', lineHeight: 1.5 }}>
                  Silakan pindai kode QR di bawah untuk masuk ke halaman partisipasi dan ikut serta menyalakan logo CODEX secara realtime.
                </p>
              </div>

              {/* QR Code Graphic Wrapper */}
              <div
                style={{
                  background: '#ffffff',
                  padding: isFullscreen ? 24 : 16,
                  borderRadius: 'var(--radius-sm)',
                  border: '1.5px solid var(--color-pistachio)',
                  boxShadow: '0 0 25px rgba(175, 208, 110, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease-out',
                }}
              >
                {qrUrl && (
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=400x400&color=0a0b14&bgcolor=ffffff&data=${encodeURIComponent(qrUrl)}`}
                    alt="Hadir QR Code"
                    style={{
                      width: '100%',
                      maxWidth: isFullscreen ? 360 : 260,
                      aspectRatio: '1/1',
                      display: 'block',
                    }}
                  />
                )}
              </div>

              {/* URL and copy tools */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1.5px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '8px 12px',
                  }}
                >
                  <span
                    style={{
                      fontSize: isFullscreen ? 14 : 12,
                      fontFamily: 'var(--font-body)',
                      color: 'var(--color-pistachio)',
                      fontWeight: 700,
                      wordBreak: 'break-all',
                      flex: 1,
                      textAlign: 'left',
                    }}
                  >
                    {qrUrl}
                  </span>
                  {!isFullscreen && (
                    <button
                      onClick={handleCopy}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'rgba(255, 255, 255, 0.6)',
                        cursor: 'pointer',
                        padding: 4,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'var(--transition-fast)',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-white)')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)')}
                      title="Salin Tautan"
                    >
                      {copied ? <Check size={16} style={{ color: 'var(--color-pistachio)' }} /> : <Copy size={16} />}
                    </button>
                  )}
                </div>
                {isFullscreen && (
                  <span style={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.4)' }}>
                    Tekan ESC untuk keluar dari layar penuh
                  </span>
                )}
              </div>
            </div>
            <div className="t-perforation" style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', transform: 'translateY(50%)' }}>
              <div className="t-perf-line" />
            </div>
          </div>
          <div className="t-stub" style={{ padding: isFullscreen ? '24px 60px' : '20px 32px' }}>
            <div className="t-barcode-container">
              <div className="t-barcode" />
              <div className="t-barcode-id">CODEX-2-HADIR</div>
            </div>
            <div className="t-admit">
              <div className="t-admit-text">GATE</div>
              <div className="t-admit-num" style={{ fontSize: '1.8em', color: 'var(--color-pistachio)' }}>QR</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
