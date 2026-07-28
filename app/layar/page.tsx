'use client';

import { useEffect, useState } from 'react';
import { useAttendanceCount } from '@/hooks/useAttendanceCount';
import FillLogo from '@/components/FillLogo';
import Logo2 from '@/components/Logo2';
import ParticleOverlay from '@/components/ParticleOverlay';
import confetti from 'canvas-confetti';
import { Volume2, VolumeX, Users, Trophy, Maximize } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

interface CheckInToast {
  id: string;
  message: string;
  emoji: string;
  isExiting: boolean;
  animationType: string;
}

export default function LayarPage() {
  const [totalTarget, setTotalTarget] = useState(100);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [particlesEnabled, setParticlesEnabled] = useState(true);
  const [recentCheckIns, setRecentCheckIns] = useState<CheckInToast[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

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

  const enterFullscreen = () => {
    const el = document.documentElement as any;
    const requestMethod = el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen || el.msRequestFullscreen;
    if (requestMethod) {
      requestMethod.call(el);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setIsAdmin(params.get('admin') === 'true');
      if (params.get('admin') === 'true') {
        setSoundEnabled(true);
      }
    }

    // Load initial settings
    const loadSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('settings')
          .select('*')
          .eq('id', 'default')
          .maybeSingle();

        if (data) {
          setTotalTarget(data.total_target);
          setSoundEnabled(data.sound_enabled);
          setParticlesEnabled(data.particles_enabled !== false);
        }
      } catch (err) {
        console.error('Gagal mengambil data pengaturan dari Supabase settings table:', err);
      }
    };

    loadSettings();

    // Berlangganan ke perubahan tabel settings secara realtime
    const settingsChannel = supabase
      .channel('settings-realtime')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'settings', filter: 'id=eq.default' },
        (payload) => {
          if (payload.new) {
            const newSettings = payload.new as any;
            setTotalTarget(newSettings.total_target);
            setSoundEnabled(newSettings.sound_enabled);
            setParticlesEnabled(newSettings.particles_enabled !== false);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(settingsChannel);
    };
  }, []);

  const handleNewAttendance = (insertedToken: string) => {
    
    // Hilangkan suffix UUID dari token untuk mendapatkan nama/id asli
    const cleanToken = insertedToken.includes('_') 
      ? insertedToken.substring(0, insertedToken.lastIndexOf('_')) 
      : insertedToken;
      
    let message = '';
    if (cleanToken === 'umum' || !cleanToken) {
      message = `Seseorang menyalakan CODEX!`;
    } else {
      let displayName = cleanToken;
      try {
        displayName = decodeURIComponent(cleanToken);
      } catch (e) {}
      message = `"${displayName}" menyalakan CODEX!`;
    }
    
    const id = Math.random().toString(36).substring(2, 9);
    const emojis = [
      '/emoji/sticker1.webp',
      '/emoji/sticker2.webp',
      '/emoji/sticker3.webp',
      '/emoji/sticker4.webp',
      '/emoji/sticker5.webp',
      '/emoji/sticker6.webp',
      '/emoji/sticker7.webp',
      '/emoji/sticker8.webp'
    ];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

    const animationTypes = ['spin', 'bounce', 'swing', 'flip'];
    const randomAnimation = animationTypes[Math.floor(Math.random() * animationTypes.length)];

    const newToast: CheckInToast = {
      id,
      message,
      emoji: randomEmoji,
      isExiting: false,
      animationType: randomAnimation
    };

    setRecentCheckIns((prev) => [newToast, ...prev].slice(0, 5));

    // Setelah 4 detik, tandai untuk exit animation
    setTimeout(() => {
      setRecentCheckIns((prev) =>
        prev.map((t) => (t.id === id ? { ...t, isExiting: true } : t))
      );
    }, 4000);

    // Setelah 4.4 detik (400ms durasi animasi exit), hapus dari list
    setTimeout(() => {
      setRecentCheckIns((prev) => prev.filter((t) => t.id !== id));
    }, 4400);
  };

  const { count, percent, ready } = useAttendanceCount(totalTarget, handleNewAttendance);

  // Massive confetti blast when reaching 100%
  useEffect(() => {
    if (percent >= 100 && ready) {
      const duration = 10 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 35, spread: 360, ticks: 80, zIndex: 1000 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 75 * (timeLeft / duration);
        
        // Confetti from left and right corners
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: ['#202c60', '#f8ca07', '#8facca', '#ffa200']
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: ['#202c60', '#f8ca07', '#8facca', '#ffa200']
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [percent, ready]);

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
        '--logo-size': 'min(42vh, 360px)',
      } as any}
    >
      <ParticleOverlay active={percent >= 100 && ready && particlesEnabled} />

      {/* Background Grid - Delft Blue / White tint */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.015) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.015) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse at center, black, transparent 80%)',
          pointerEvents: 'none',
        }}
      />

      {/* Decorative large background text */}
      <div
        style={{
          position: 'absolute',
          bottom: '-2%',
          right: '-5%',
          fontSize: 'clamp(6rem, 18vw, 15rem)',
          fontWeight: 700,
          color: 'rgba(255, 255, 255, 0.01)',
          fontFamily: 'var(--font-heading)',
          zIndex: 1,
          pointerEvents: 'none',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
          transform: 'rotate(2deg)',
        }}
      >
        CODEX
      </div>

      {/* Header controls (Absolute top) - Hanya muncul jika diakses via admin (?admin=true) */}
      {isAdmin && (
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Target setting card */}
            <div
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--color-card-dark)',
                border: '2px solid var(--color-white)',
                boxShadow: '3px 3px 0px var(--color-white)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 13,
                fontWeight: 700,
                color: 'var(--color-white)',
              }}
            >
              <Users size={16} />
              <span style={{ textTransform: 'uppercase' }}>Target:</span>
              <input
                type="number"
                value={totalTarget}
                onChange={(e) => setTotalTarget(Math.max(1, parseInt(e.target.value) || 1))}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--color-white)',
                  width: 50,
                  fontWeight: 800,
                  fontSize: 14,
                  outline: 'none',
                  textAlign: 'center',
                }}
              />
            </div>

            {/* Sound controller card */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="header-btn"
              style={{
                padding: '10px 18px',
                borderRadius: 'var(--radius-sm)',
                background: soundEnabled ? 'var(--color-pistachio)' : 'var(--color-card-dark)',
                border: '2px solid var(--color-white)',
                boxShadow: '3px 3px 0px var(--color-white)',
                color: soundEnabled ? 'var(--color-bg-dark)' : 'var(--color-white)',
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
              {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              <span>Sound {soundEnabled ? 'ON' : 'OFF'}</span>
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.5px', color: 'var(--color-white)' }}>
              SUPABASE REALTIME: <span style={{ color: ready ? 'var(--color-pistachio)' : '#FF5252' }}>{ready ? 'CONNECTED ✓' : 'CONNECTING...'}</span>
            </div>
            {!isFullscreen && (
              <button
                onClick={enterFullscreen}
                className="header-btn"
                style={{
                  padding: '10px 18px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
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
              >
                <Maximize size={16} />
                <span>Fullscreen</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Floating Fullscreen button - Hanya muncul jika bukan admin dan tidak sedang fullscreen */}
      {!isAdmin && !isFullscreen && (
        <button
          onClick={enterFullscreen}
          className="header-btn"
          style={{
            position: 'absolute',
            top: 32,
            right: 40,
            padding: '10px 18px',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: 'rgba(255, 255, 255, 0.8)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 13,
            cursor: 'pointer',
            fontWeight: 700,
            textTransform: 'uppercase',
            zIndex: 100,
            transition: 'all 0.2s ease',
          }}
        >
          <Maximize size={16} />
          <span>Fullscreen</span>
        </button>
      )}

      {/* Main Container constrained to presentation aspect ratio and safe height */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'clamp(16px, 4vh, 32px)',
          zIndex: 2,
          width: '100%',
          maxWidth: '1200px',
          maxHeight: '82vh', // Safe maximum height to avoid vertical overflow
          margin: 'auto',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            textAlign: 'center',
            maxWidth: 900,
            width: '100%',
            opacity: percent >= 100 && ready ? 0 : 1,
            transform: percent >= 100 && ready ? 'translateY(-30px) scale(0.95)' : 'translateY(0) scale(1)',
            transition: 'all 1000ms cubic-bezier(0.16, 1, 0.3, 1)',
            pointerEvents: percent >= 100 && ready ? 'none' : 'auto',
          }}
        >
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.2rem, 5.5vh, 3.5rem)',
              fontWeight: 900,
              margin: 0,
              color: 'var(--color-white)',
              letterSpacing: '-1px',
              textTransform: 'uppercase',
              lineHeight: 1.1,
            }}
          >
            Pembukaan <span style={{ whiteSpace: 'nowrap' }}>CODEX-2</span>
          </h1>
          <p style={{ opacity: 0.8, fontSize: 'clamp(0.85rem, 1.8vh, 1rem)', marginTop: 6, fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--color-carolina-blue)' }}>
            Nyalakan Energi Teknologi Bersama
          </p>
        </div>

        {/* Logo Container with multi-layered backlight glow */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'clamp(20px, 4vh, 40px)',
            borderRadius: '50%',
          }}
        >
          {/* 1. Orbit Ring (Slow rotation in background) */}
          <div
            className="orbit-ring"
            style={{
              position: 'absolute',
              width: 'calc(1.22 * var(--logo-size))',
              height: 'calc(1.22 * var(--logo-size))',
              borderRadius: '50%',
              border: '2px dashed rgba(255, 255, 255, 0.05)',
              pointerEvents: 'none',
            }}
          />

          {/* 2. Outer Ambient Glow (Vibrant cyan/green blend that scales with filling percentage) */}
          <div
            style={{
              position: 'absolute',
              width: 'calc(1.11 * var(--logo-size))',
              height: 'calc(1.11 * var(--logo-size))',
              borderRadius: '50%',
              background: 'radial-gradient(circle at center, rgba(135, 174, 206, 0.25) 0%, rgba(175, 208, 110, 0.15) 50%, transparent 70%)',
              filter: 'blur(50px)',
              transform: `scale(${1.1 + percent / 150})`,
              transition: 'transform 1000ms cubic-bezier(0.34, 1.56, 0.64, 1)',
              opacity: 0.6 + (percent / 250),
              pointerEvents: 'none',
            }}
          />

          {/* 3. Core Intense Glow (Pulsing yellow/green core, reacts to percent) */}
          <div
            className="core-glow"
            style={{
              position: 'absolute',
              width: 'calc(0.77 * var(--logo-size))',
              height: 'calc(0.77 * var(--logo-size))',
              borderRadius: '50%',
              background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.15) 0%, rgba(175, 208, 110, 0.35) 40%, rgba(248, 202, 7, 0.15) 75%, transparent 100%)',
              filter: 'blur(30px)',
              pointerEvents: 'none',
              transform: `scale(${1 + percent / 300})`,
              transition: 'transform 1000ms cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          />

          {/* Logo transition block: cross-fades FillLogo to Logo2 at 100% with scale & blur effects */}
          <div
            style={{
              position: 'relative',
              width: 'var(--logo-size)',
              height: 'var(--logo-size)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: percent >= 100 && ready ? 'scale(1.5)' : 'scale(1)',
              transition: 'transform 1200ms cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            {/* FillLogo (Liquid Progress) */}
            <div
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: percent >= 100 && ready ? 0 : 1,
                transform: percent >= 100 && ready ? 'scale(0.8) rotate(-15deg)' : 'scale(1) rotate(0deg)',
                filter: percent >= 100 && ready ? 'blur(12px)' : 'none',
                transition: 'all 1000ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                pointerEvents: percent >= 100 && ready ? 'none' : 'auto',
              }}
            >
              <FillLogo percent={percent} size="var(--logo-size)" />
            </div>

            {/* Logo2 (Complete brand logo with text & entrance animations) */}
            <div
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: percent >= 100 && ready ? 1 : 0,
                transform: percent >= 100 && ready ? 'scale(1) rotate(0deg)' : 'scale(1.25) rotate(15deg)',
                filter: percent >= 100 && ready ? 'none' : 'blur(12px)',
                transition: 'all 1000ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                pointerEvents: percent >= 100 && ready ? 'auto' : 'none',
              }}
            >
              {percent >= 100 && ready && <Logo2 size="var(--logo-size)" />}
            </div>
          </div>
        </div>

        {/* Counts & Percentage Meter */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'clamp(8px, 1.5vh, 16px)',
            opacity: percent >= 100 && ready ? 0 : 1,
            transform: percent >= 100 && ready ? 'translateY(30px) scale(0.95)' : 'translateY(0) scale(1)',
            transition: 'all 1000ms cubic-bezier(0.16, 1, 0.3, 1)',
            pointerEvents: percent >= 100 && ready ? 'none' : 'auto',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, color: 'var(--color-white)' }}>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(3.5rem, 8vh, 5.2rem)', fontWeight: 900, lineHeight: 1, letterSpacing: '-2px' }}>
              {count}
            </span>
            <span style={{ fontSize: 'clamp(1.5rem, 3vh, 2.2rem)', opacity: 0.5, fontWeight: 700 }}>
              / {totalTarget}
            </span>
          </div>

          <div
            style={{
              fontFamily: 'var(--font-heading)',
              textTransform: 'uppercase',
              fontSize: '1.1rem',
              fontWeight: 900,
              color: 'var(--color-carolina-blue)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(135, 174, 206, 0.1)',
              padding: '8px 24px',
              borderRadius: '99px',
              border: '1.5px solid var(--color-carolina-blue)',
              boxShadow: '0 0 15px rgba(135, 174, 206, 0.25)',
              letterSpacing: '1px',
            }}
          >
            {percent >= 100 && <Trophy size={18} style={{ color: 'var(--color-carolina-blue)' }} />}
            <span>{percent.toFixed(0)}% TERPENUHI</span>
          </div>
        </div>
      </div>

      {/* Recent Activity Toast Feed (Absolute Bottom Left) */}
      {percent < 100 && (
        <div
          style={{
            position: 'absolute',
            bottom: 32,
            left: 40,
            display: 'flex',
            flexDirection: 'column-reverse',
            gap: 12,
            zIndex: 10,
          }}
        >
          {recentCheckIns.map((toast) => (
            <div
              key={toast.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: toast.isExiting 
                  ? 'toastExit 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards' 
                  : `toastEnter${toast.animationType.charAt(0).toUpperCase() + toast.animationType.slice(1)} 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards`,
                transformOrigin: 'bottom left',
                boxSizing: 'border-box',
                perspective: '1000px',
              }}
            >
              <img 
                src={toast.emoji} 
                alt="emoji" 
                style={{ 
                  width: 40, 
                  height: 40, 
                  objectFit: 'contain',
                  flexShrink: 0
                }} 
              />
            </div>
          ))}
        </div>
      )}
      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes toastEnterSpin {
          0% {
            opacity: 0;
            transform: translateY(40px) scale(0) rotate(-270deg);
            max-height: 0px;
            margin-bottom: -12px;
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1) rotate(0deg);
            max-height: 40px;
            margin-bottom: 0px;
          }
        }
        @keyframes toastEnterBounce {
          0% {
            opacity: 0;
            transform: translateY(60px) scale(0.3);
            max-height: 0px;
            margin-bottom: -12px;
          }
          50% {
            opacity: 1;
            transform: translateY(-20px) scale(1.4);
            max-height: 40px;
            margin-bottom: 0px;
          }
          75% {
            transform: translateY(10px) scale(0.85);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            max-height: 40px;
            margin-bottom: 0px;
          }
        }
        @keyframes toastEnterSwing {
          0% {
            opacity: 0;
            transform: translateX(-50px) scale(0.5) rotate(-30deg);
            max-height: 0px;
            margin-bottom: -12px;
          }
          40% {
            transform: translateX(15px) scale(1.1) rotate(15deg);
            max-height: 40px;
            margin-bottom: 0px;
          }
          70% {
            transform: translateX(-5px) scale(0.95) rotate(-10deg);
          }
          100% {
            opacity: 1;
            transform: translateX(0) scale(1) rotate(0deg);
            max-height: 40px;
            margin-bottom: 0px;
          }
        }
        @keyframes toastEnterFlip {
          0% {
            opacity: 0;
            transform: translateY(30px) rotateY(90deg) scale(0.5);
            max-height: 0px;
            margin-bottom: -12px;
          }
          50% {
            opacity: 1;
            transform: translateY(-10px) rotateY(-20deg) scale(1.2);
            max-height: 40px;
            margin-bottom: 0px;
          }
          100% {
            opacity: 1;
            transform: translateY(0) rotateY(0deg) scale(1);
            max-height: 40px;
            margin-bottom: 0px;
          }
        }
        @keyframes toastExit {
          0% {
            opacity: 1;
            transform: scale(1) rotate(0deg);
            max-height: 40px;
            margin-bottom: 0px;
          }
          30% {
            opacity: 1;
            transform: scale(1.2) rotate(-20deg);
          }
          100% {
            opacity: 0;
            transform: scale(0) rotate(540deg) translateY(-80px);
            max-height: 0px;
            margin-bottom: -12px;
            overflow: hidden;
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulseGlow {
          0%, 100% {
            opacity: 0.7;
            filter: blur(30px);
          }
          50% {
            opacity: 0.95;
            filter: blur(36px);
          }
        }
        .orbit-ring {
          animation: spin 60s linear infinite;
        }
        .core-glow {
          animation: pulseGlow 4s ease-in-out infinite;
        }
        .header-btn:hover {
          background-color: rgba(255, 255, 255, 0.08) !important;
          border-color: rgba(255, 255, 255, 0.4) !important;
          color: #fff !important;
        }
      `}</style>
    </main>
  );
}
