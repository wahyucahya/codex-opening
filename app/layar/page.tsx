'use client';

import { useEffect, useState } from 'react';
import { useAttendanceCount } from '@/hooks/useAttendanceCount';
import FillLogo from '@/components/FillLogo';
import Logo2 from '@/components/Logo2';
import ParticleOverlay from '@/components/ParticleOverlay';
import confetti from 'canvas-confetti';
import { Volume2, VolumeX, Users, Trophy, Maximize } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

export default function LayarPage() {
  const [totalTarget, setTotalTarget] = useState(100);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [particlesEnabled, setParticlesEnabled] = useState(true);
  const [recentCheckIns, setRecentCheckIns] = useState<string[]>([]);
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

  // Play audio chime using Web Audio API (completely self-contained, no files needed)
  const playChime = () => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1); // A5
      osc.frequency.exponentialRampToValueAtTime(1174.66, ctx.currentTime + 0.25); // D6
      
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
      
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.85);
    } catch (err) {
      console.error('Audio chime failed:', err);
    }
  };

  const handleNewAttendance = (insertedToken: string) => {
    playChime();
    
    // Hilangkan suffix UUID dari token untuk mendapatkan nama/id asli
    const cleanToken = insertedToken.includes('_') 
      ? insertedToken.substring(0, insertedToken.lastIndexOf('_')) 
      : insertedToken;
      
    let message = '';
    if (cleanToken === 'umum' || !cleanToken) {
      message = `Seseorang menyalakan CODEX! ⚡`;
    } else {
      let displayName = cleanToken;
      try {
        displayName = decodeURIComponent(cleanToken);
      } catch (e) {}
      message = `"${displayName}" menyalakan CODEX! ⚡`;
    }
    
    setRecentCheckIns((prev) => [message, ...prev].slice(0, 5));
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
          colors: ['#437118', '#afd06e', '#87aece', '#202c60']
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: ['#437118', '#afd06e', '#87aece', '#202c60']
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
        padding: 40,
        position: 'relative',
        overflow: 'hidden',
      }}
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
            zIndex: 100,
            transition: 'all 0.15s ease-out',
          }}
        >
          <Maximize size={16} />
          <span>Fullscreen</span>
        </button>
      )}

      {/* Main Container */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 40,
          zIndex: 2,
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
              fontSize: 'clamp(2.5rem, 6vw, 3.8rem)',
              fontWeight: 700,
              margin: 0,
              color: 'var(--color-white)',
              letterSpacing: '-1px',
              textTransform: 'uppercase',
            }}
          >
            Pembukaan <span style={{ whiteSpace: 'nowrap' }}>CODEX-2</span>
          </h1>
          <p style={{ opacity: 0.8, fontSize: '1rem', marginTop: 8, fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--color-carolina-blue)' }}>
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
            padding: 40,
            borderRadius: '50%',
          }}
        >
          {/* 1. Orbit Ring (Slow rotation in background) */}
          <div
            className="orbit-ring"
            style={{
              position: 'absolute',
              width: 440,
              height: 440,
              borderRadius: '50%',
              border: '2px dashed rgba(255, 255, 255, 0.05)',
              pointerEvents: 'none',
            }}
          />

          {/* 2. Outer Ambient Glow (Vibrant cyan/green blend that scales with filling percentage) */}
          <div
            style={{
              position: 'absolute',
              width: 400,
              height: 400,
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
              width: 280,
              height: 280,
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
              width: 360,
              height: 360,
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
              <FillLogo percent={percent} size={360} />
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
              {percent >= 100 && ready && <Logo2 size={360} />}
            </div>
          </div>
        </div>

        {/* Counts & Percentage Meter */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
            opacity: percent >= 100 && ready ? 0 : 1,
            transform: percent >= 100 && ready ? 'translateY(30px) scale(0.95)' : 'translateY(0) scale(1)',
            transition: 'all 1000ms cubic-bezier(0.16, 1, 0.3, 1)',
            pointerEvents: percent >= 100 && ready ? 'none' : 'auto',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, color: 'var(--color-white)' }}>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '5rem', fontWeight: 700, lineHeight: 1, letterSpacing: '-2px' }}>
              {count}
            </span>
            <span style={{ fontSize: '2rem', opacity: 0.5, fontWeight: 700 }}>
              / {totalTarget}
            </span>
          </div>

          <div
            style={{
              fontFamily: 'var(--font-heading)',
              textTransform: 'uppercase',
              fontSize: '1.2rem',
              fontWeight: 700,
              color: 'var(--color-bg-dark)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'var(--color-carolina-blue)',
              padding: '8px 24px',
              borderRadius: 'var(--radius-sm)',
              border: '2.5px solid var(--color-white)',
              boxShadow: '3px 3px 0px var(--color-white)',
              transform: 'rotate(-1deg)',
            }}
          >
            {percent >= 100 && <Trophy size={20} style={{ color: 'var(--color-bg-dark)' }} />}
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
          {recentCheckIns.map((toast, i) => (
            <div
              key={i}
              style={{
                padding: '12px 20px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--color-card-dark)',
                border: '2px solid var(--color-white)',
                boxShadow: '3px 3px 0px var(--color-white)',
                fontSize: 14,
                fontWeight: 700,
                color: 'var(--color-white)',
                animation: 'slideUp 0.3s ease-out forwards',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-pistachio)', border: '1px solid var(--color-white)' }} />
              {toast}
            </div>
          ))}
        </div>
      )}
      {/* CSS Animations */}
      <style jsx global>{`
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
          background-color: var(--color-pistachio) !important;
          color: var(--color-bg-dark) !important;
          transform: translate(-1px, -1px);
          box-shadow: 4px 4px 0px var(--color-white) !important;
        }
        .header-btn:active {
          transform: translate(1px, 1px);
          box-shadow: 2px 2px 0px var(--color-white) !important;
        }
      `}</style>
    </main>
  );
}
