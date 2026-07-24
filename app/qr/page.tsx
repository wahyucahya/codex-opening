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
              className="action-btn"
              style={{
                padding: '10px 18px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--color-card-dark)',
                border: '2px solid var(--color-white)',
                boxShadow: '3px 3px 0px var(--color-white)',
                color: 'var(--color-white)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 13,
                cursor: 'pointer',
                fontWeight: 700,
                textTransform: 'uppercase',
                transition: 'all 0.15s ease-out',
              }}
            >
              <ArrowLeft size={16} />
              <span>Kembali</span>
            </button>
          </Link>

          <button
            onClick={toggleFullscreen}
            className="action-btn"
            style={{
              padding: '10px 18px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--color-card-dark)',
              border: '2px solid var(--color-white)',
              boxShadow: '3px 3px 0px var(--color-white)',
              color: 'var(--color-white)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 13,
              cursor: 'pointer',
              fontWeight: 700,
              textTransform: 'uppercase',
              transition: 'all 0.15s ease-out',
            }}
          >
            <Maximize size={16} />
            <span>Fullscreen</span>
          </button>
        </div>
      )}

      {/* Center QR Presenter Card */}
      <div
        style={{
          background: 'var(--color-card-dark)',
          border: '3px solid var(--color-white)',
          borderRadius: 'var(--radius-md)',
          boxShadow: isFullscreen ? 'none' : '10px 10px 0px var(--color-pistachio)',
          padding: isFullscreen ? '40px 60px' : '40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 28,
          maxWidth: isFullscreen ? 580 : 480,
          width: '95%',
          textAlign: 'center',
          position: 'relative',
          zIndex: 2,
          transition: 'all 0.3s ease-out',
          transform: 'rotate(-0.5deg)',
        }}
      >
        <div>
          <span
            style={{
              display: 'inline-block',
              padding: '4px 12px',
              background: 'var(--color-carolina-blue)',
              border: '2px solid var(--color-white)',
              fontSize: 11,
              fontWeight: 700,
              color: 'var(--color-bg-dark)',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              boxShadow: '2px 2px 0px var(--color-white)',
              marginBottom: 12,
            }}
          >
            Ceremony Participation
          </span>
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: isFullscreen ? 36 : 28,
              fontWeight: 700,
              margin: 0,
              color: 'var(--color-white)',
              textTransform: 'uppercase',
              lineHeight: 1.2,
            }}
          >
            Scan to Ignite
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: isFullscreen ? 15 : 13, margin: '8px 0 0 0', lineHeight: 1.5 }}>
            Silakan pindai kode QR di bawah untuk masuk ke halaman partisipasi dan ikut serta menyalakan logo CODEX secara realtime.
          </p>
        </div>

        {/* QR Code Graphic Wrapper */}
        <div
          style={{
            background: '#ffffff',
            padding: isFullscreen ? 24 : 16,
            borderRadius: 'var(--radius-sm)',
            border: '2.5px solid var(--color-white)',
            boxShadow: '6px 6px 0px var(--color-white)',
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

      <style jsx>{`
        .action-btn:hover {
          background-color: var(--color-pistachio) !important;
          color: var(--color-bg-dark) !important;
          transform: translate(-1px, -1px);
          box-shadow: 4px 4px 0px var(--color-white) !important;
        }
        .action-btn:active {
          transform: translate(1px, 1px);
          box-shadow: 2px 2px 0px var(--color-white) !important;
        }
      `}</style>
    </main>
  );
}
