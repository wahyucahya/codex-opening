'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAttendanceCount } from '@/hooks/useAttendanceCount';
import { Bot, CheckCircle2, AlertCircle, Zap, Volume2, VolumeX } from 'lucide-react';
import confetti from 'canvas-confetti';

const getDeviceSound = (token: string): string => {
  if (typeof window === 'undefined') return 'chime';
  
  const saved = localStorage.getItem('codex_device_sound');
  if (saved) return saved;
  
  const SOUNDS = ['chime', 'zap', 'retro', 'powerup', 'sparkle'];
  if (token && token !== 'umum') {
    let hash = 0;
    for (let i = 0; i < token.length; i++) {
      hash = token.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % SOUNDS.length;
    const assignedSound = SOUNDS[index];
    localStorage.setItem('codex_device_sound', assignedSound);
    return assignedSound;
  }
  
  const randomIndex = Math.floor(Math.random() * SOUNDS.length);
  const assignedSound = SOUNDS[randomIndex];
  localStorage.setItem('codex_device_sound', assignedSound);
  return assignedSound;
};

const SOUND_DETAILS: Record<string, { icon: string; name: string }> = {
  chime: { icon: '🔔', name: 'Chime' },
  zap: { icon: '⚡', name: 'Laser' },
  retro: { icon: '🪙', name: 'Retro' },
  powerup: { icon: '📈', name: 'Power Up' },
  sparkle: { icon: '✨', name: 'Sparkle' },
};

const playAudioEffect = (soundId: string) => {
  if (typeof window === 'undefined') return;
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const now = ctx.currentTime;
    
    switch (soundId) {
      case 'chime': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.1); // A5
        osc.frequency.exponentialRampToValueAtTime(1174.66, now + 0.25); // D6
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
        osc.start(now);
        osc.stop(now + 0.85);
        break;
      }
      case 'zap': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        
        osc.type = 'sawtooth';
        filter.type = 'lowpass';
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        
        osc.frequency.setValueAtTime(1000, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.25);
        
        filter.frequency.setValueAtTime(1800, now);
        filter.frequency.exponentialRampToValueAtTime(200, now + 0.25);
        
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        
        osc.start(now);
        osc.stop(now + 0.35);
        break;
      }
      case 'retro': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'square';
        
        osc.frequency.setValueAtTime(987.77, now); // B5
        osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6
        
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.setValueAtTime(0.06, now + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        
        osc.start(now);
        osc.stop(now + 0.35);
        break;
      }
      case 'powerup': {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc1.type = 'triangle';
        osc2.type = 'sine';
        
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);
        
        osc1.frequency.setValueAtTime(196.00, now); // G3
        osc1.frequency.setValueAtTime(261.63, now + 0.08); // C4
        osc1.frequency.setValueAtTime(329.63, now + 0.16); // E4
        osc1.frequency.linearRampToValueAtTime(783.99, now + 0.32); // G5
        
        osc2.frequency.setValueAtTime(198, now);
        osc2.frequency.setValueAtTime(263.63, now + 0.08);
        osc2.frequency.setValueAtTime(331.63, now + 0.16);
        osc2.frequency.linearRampToValueAtTime(785.99, now + 0.32);
        
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        
        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.5);
        osc2.stop(now + 0.5);
        break;
      }
      case 'sparkle': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.05); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.1); // G5
        osc.frequency.setValueAtTime(1046.50, now + 0.15); // C6
        osc.frequency.setValueAtTime(1318.51, now + 0.2); // E6
        osc.frequency.setValueAtTime(1567.98, now + 0.25); // G6
        
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        
        osc.start(now);
        osc.stop(now + 0.5);
        break;
      }
      default:
        break;
    }
  } catch (err) {
    console.error('Audio playback failed:', err);
  }
};

/**
 * URL yang dikodekan di QR peserta: https://domain-anda.com/hadir/<token>
 * `token` unik per peserta (bisa UUID atau nomor kursi).
 * 
 * Agar peserta bisa mengklik berkali-kali tanpa terhalang UNIQUE constraint
 * pada tabel `attendance`, kita menambahkan UUID acak di belakang token.
 * Hal ini juga memicu event INSERT secara realtime di layar utama untuk setiap klik.
 */
export default function HadirPage({ params }: { params: { token: string } }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [clickCount, setClickCount] = useState(0);
  const [totalTarget, setTotalTarget] = useState(100);
  const [techFallbackName, setTechFallbackName] = useState('Cyber Guest');
  
  // Sound states
  const [globalSoundEnabled, setGlobalSoundEnabled] = useState(false);
  const [localSoundEnabled, setLocalSoundEnabled] = useState(true);
  const [deviceSound, setDeviceSound] = useState('chime');

  // Load click count and fallback name from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(`codex_clicks_${params.token}`);
    if (saved) {
      setClickCount(parseInt(saved) || 0);
    }

    const savedLocalSound = localStorage.getItem('codex_local_sound');
    if (savedLocalSound !== null) {
      setLocalSoundEnabled(savedLocalSound === 'true');
    }

    const assigned = getDeviceSound(params.token);
    setDeviceSound(assigned);

    const savedFallback = localStorage.getItem('codex_tech_fallback_name');
    if (savedFallback) {
      setTechFallbackName(savedFallback);
    } else {
      const coolTechNames = [
        'Cyber Netrunner',
        'Quantum Voyager',
        'Matrix Phantom',
        'Syntax Overlord',
        'Byte Crusader',
        'Neural Sentinel',
        'Kernel Nomad',
        'Aether Architect',
        'Pixel Rogue',
        'Daemon Warden',
        'Binary Pioneer',
        'Helix Hacker'
      ];
      const randomName = coolTechNames[Math.floor(Math.random() * coolTechNames.length)];
      localStorage.setItem('codex_tech_fallback_name', randomName);
      setTechFallbackName(randomName);
    }
  }, [params.token]);

  // Fetch settings & listen to updates
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const { data } = await supabase
          .from('settings')
          .select('total_target, sound_enabled')
          .eq('id', 'default')
          .maybeSingle();

        if (data) {
          setTotalTarget(data.total_target);
          setGlobalSoundEnabled(!!data.sound_enabled);
        }
      } catch (err) {
        console.error(err);
      }
    };

    loadSettings();

    const settingsChannel = supabase
      .channel('hadir-settings-realtime')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'settings', filter: 'id=eq.default' },
        (payload) => {
          if (payload.new) {
            setTotalTarget((payload.new as any).total_target);
            setGlobalSoundEnabled(!!(payload.new as any).sound_enabled);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(settingsChannel);
    };
  }, []);

  const { count, ready } = useAttendanceCount(totalTarget);
  const isLimitReached = ready && count >= totalTarget;

  const toggleLocalSound = () => {
    const nextVal = !localSoundEnabled;
    setLocalSoundEnabled(nextVal);
    localStorage.setItem('codex_local_sound', nextVal.toString());
    if (nextVal && globalSoundEnabled) {
      playAudioEffect(deviceSound);
    }
  };

  const handlePress = async () => {
    // Play sound immediately if enabled (specific sound for this device)
    if (globalSoundEnabled && localSoundEnabled) {
      playAudioEffect(deviceSound);
    }

    setStatus('loading');
    setErrorMessage('');

    // Gabungkan token dengan UUID agar selalu unik di database dan memicu realtime insert
    const baseToken = params.token && params.token !== 'umum'
      ? params.token
      : techFallbackName;
    const dbToken = `${baseToken}_${crypto.randomUUID()}`;

    try {
      const { error } = await supabase
        .from('attendance')
        .insert({ token: dbToken });

      if (error) {
        setErrorMessage(error.message || 'Terjadi kesalahan sistem.');
        setStatus('error');
        // Auto reset error state setelah 3 detik agar tombol bisa diklik lagi
        setTimeout(() => setStatus('idle'), 3000);
        return;
      }

      // Success feedback
      const newCount = clickCount + 1;
      setClickCount(newCount);
      localStorage.setItem(`codex_clicks_${params.token}`, newCount.toString());
      setStatus('done');

      // Trigger local confetti effect from the button area
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#202c60', '#f8ca07', '#8facca']
      });

      // Reset ke status idle setelah 1 detik agar bisa diklik lagi
      setTimeout(() => {
        setStatus('idle');
      }, 1000);

    } catch (err) {
      console.error(err);
      setErrorMessage('Koneksi gagal. Periksa koneksi internet Anda.');
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const cleanToken = params.token && params.token !== 'umum'
    ? (params.token.includes('_') ? params.token.substring(0, params.token.lastIndexOf('_')) : params.token)
    : null;
    
  let displayName = cleanToken;
  if (cleanToken) {
    try {
      displayName = decodeURIComponent(cleanToken);
    } catch (e) {}
  } else {
    displayName = techFallbackName;
  }

  return (
    <main
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-bg-dark)',
        padding: 24,
        fontFamily: 'var(--font-body)',
        position: 'relative',
      }}
    >
      <div className="ticket-wrapper" style={{ maxWidth: '22em', width: '100%', margin: '0 auto' }}>
        <div className="ticket">
          <div className="t-main">
            <div className="t-content">
              <div className="t-header">
                <div className="t-logo">
                  <img src="/logo.svg" alt="CODEX Logo" width={32} height={32} />
                  CODEX
                </div>
                <div className="t-type">Codex Pass</div>
              </div>
              <div className="t-title">Codex-2<br />Opening</div>
              <div className="t-subtitle">Interactive Opening Ceremony</div>
              <div className="t-details">
                <div className="t-detail-item">
                  <span className="t-label">Name</span><span className="t-value">{displayName}</span>
                </div>
                <div className="t-detail-item">
                  <span className="t-label">Date</span><span className="t-value">August 5, 2026</span>
                </div>
                <div className="t-detail-item">
                  <span className="t-label">Venue</span><span className="t-value">Putra Bangsa University Hall</span>
                </div>
                <div className="t-detail-item">
                  <span className="t-label">Gateway</span><span className="t-value">{params.token === 'umum' ? 'Public' : params.token}</span>
                </div>
              </div>

              <div style={{ marginTop: '2.5em', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.2em' }}>
                <p style={{ color: 'var(--t-text-muted)', fontSize: '1.1em', lineHeight: 1.5, margin: 0, textAlign: 'center' }}>
                  {isLimitReached 
                    ? 'Target energi telah terpenuhi! Logo CODEX sudah menyala sepenuhnya. Terima kasih!'
                    : 'Tekan tombol di bawah untuk mengirim energi ke logo CODEX!'}
                </p>
                
                <button
                  onClick={handlePress}
                  disabled={status === 'loading' || isLimitReached}
                  className="button"
                >
                  <div className="inner">
                    {status === 'loading' && 'Mengirim... ⚡'}
                    {status === 'done' && 'Energi Terkirim! +1 ⚡'}
                    {isLimitReached && 'Target Tercapai! ⚡'}
                    {!isLimitReached && status === 'idle' && 'Kirim Energi ⚡'}
                    {!isLimitReached && status === 'error' && 'Gagal Mengirim ⚡'}
                  </div>
                </button>

                {status === 'error' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6em', color: '#FF5252', fontSize: '1em', marginTop: '0.5em', fontWeight: 600 }}>
                    <AlertCircle size={16} />
                    <span>{errorMessage || 'Gagal mengirim, silakan coba lagi.'}</span>
                  </div>
                )}

                {/* Sound Settings Panel */}
                <div style={{
                  width: '100%',
                  marginTop: '0.8em',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxSizing: 'border-box'
                }}>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '2px'
                  }}>
                    <span style={{
                      fontSize: '0.75em',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      color: 'var(--t-text-muted)',
                      fontWeight: 700
                    }}>
                      Sound Effects
                    </span>
                    <span style={{
                      fontSize: '0.7em',
                      color: 'var(--t-text-muted)',
                      opacity: 0.8
                    }}>
                      Suara Anda: {SOUND_DETAILS[deviceSound]?.icon} {SOUND_DETAILS[deviceSound]?.name}
                    </span>
                  </div>
                  
                  <button
                    onClick={toggleLocalSound}
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: localSoundEnabled && globalSoundEnabled ? 'var(--t-accent)' : '#ef4444',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '0.9em',
                      fontWeight: 700,
                      transition: 'all 0.2s'
                    }}
                  >
                    {(!globalSoundEnabled) ? (
                      <>
                        <VolumeX size={14} />
                        <span style={{ color: '#ff4d4d' }}>Admin Muted</span>
                      </>
                    ) : localSoundEnabled ? (
                      <>
                        <Volume2 size={14} />
                        <span>ON</span>
                      </>
                    ) : (
                      <>
                        <VolumeX size={14} />
                        <span>MUTE</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
            <div className="t-perforation" style={{position: 'absolute', bottom: 0, left: 0, width: '100%', transform: 'translateY(50%)'}}>
              <div className="t-perf-line" />
            </div>
          </div>
          <div className="t-stub">
            <div className="t-barcode-container">
              <div className="t-barcode" />
              <div className="t-barcode-id">CODEX-2-2026-{params.token.toUpperCase()}</div>
            </div>
            <div className="t-admit">
              <div className="t-admit-text">Energy</div>
              <div className="t-admit-num">{clickCount}</div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .ticket-wrapper {
          --t-bg: #1e1e24;
          --t-bg-light: #2b2b36;
          --t-accent: #f8ca07;
          --t-accent-glow: rgba(248, 202, 7, 0.5);
          --t-text-main: #f8fafc;
          --t-text-muted: #94a3b8;
          font-size: 14px;
          perspective: 1000px;
          display: inline-block;
          text-align: left;
        }

        .ticket {
          position: relative;
          width: 22em;
          color: var(--t-text-main);
          font-family: "Space Grotesk", "Segoe UI", system-ui, sans-serif;
          transform-style: preserve-3d;
          transition:
            transform 0.6s cubic-bezier(0.23, 1, 0.32, 1),
            box-shadow 0.6s ease;
          box-shadow:
            0 20px 40px rgba(0, 0, 0, 0.8),
            0 0 0 1px rgba(255, 255, 255, 0.05);
          background: transparent;
          filter: drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.5));
        }

        .ticket-wrapper:hover .ticket {
          transform: rotateX(5deg) rotateY(-10deg) scale(1.02);
          box-shadow:
            20px 20px 40px rgba(0, 0, 0, 0.6),
            0 0 0 1px rgba(255, 255, 255, 0.1),
            -5px -5px 20px var(--t-accent-glow);
        }

        .ticket::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 1em;
          pointer-events: none;
          background: linear-gradient(
            115deg,
            transparent 0%,
            transparent 40%,
            rgba(255, 255, 255, 0.1) 45%,
            rgba(255, 255, 255, 0.3) 50%,
            rgba(255, 255, 255, 0.1) 55%,
            transparent 60%,
            transparent 100%
          );
          z-index: 10;
          background-size: 250% 250%;
          background-position: 100% 100%;
          transition: background-position 0.6s cubic-bezier(0.23, 1, 0.32, 1);
          mix-blend-mode: overlay;
        }

        .ticket-wrapper:hover .ticket::after {
          background-position: 0% 0%;
        }

        .t-main {
          padding: 2em;
          position: relative;
          overflow: hidden;
          background: radial-gradient(
              circle at bottom left,
              transparent 1em,
              var(--t-bg) 1.05em
            ),
            radial-gradient(circle at bottom right, transparent 1em, var(--t-bg) 1.05em);
          background-size: 51% 100%;
          background-position:
            bottom left,
            bottom right;
          background-repeat: no-repeat;
          border-top-left-radius: 1em;
          border-top-right-radius: 1em;
        }

        .t-main::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: linear-gradient(
              rgba(248, 202, 7, 0.08) 1px,
              transparent 1px
            ),
            linear-gradient(90deg, rgba(248, 202, 7, 0.08) 1px, transparent 1px);
          background-size: 2em 2em;
          opacity: 0.6;
          z-index: 0;
          pointer-events: none;
          transform: perspective(500px) rotateX(20deg) scale(1.5);
          animation: grid-scroll 20s linear infinite;
        }

        @keyframes grid-scroll {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 0 4em;
          }
        }

        .t-content {
          position: relative;
          z-index: 1;
        }

        .t-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2em;
        }

        .t-logo {
          display: flex;
          align-items: center;
          gap: 0.5em;
          font-weight: 900;
          font-size: 1.2em;
          letter-spacing: -0.05em;
          color: #fff;
        }

        .t-logo svg {
          width: 1.5em;
          height: 1.5em;
          fill: var(--t-accent);
          filter: drop-shadow(0 0 5px var(--t-accent));
          animation: logo-pulse 3s ease-in-out infinite alternate;
        }

        @keyframes logo-pulse {
          0% {
            filter: drop-shadow(0 0 2px var(--t-accent));
          }
          100% {
            filter: drop-shadow(0 0 10px var(--t-accent)) brightness(1.2);
          }
        }

        .t-type {
          font-size: 0.6em;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: var(--t-accent);
          border: 1px solid var(--t-accent);
          padding: 0.4em 0.8em;
          border-radius: 99em;
          font-weight: 700;
        }

        .t-title {
          font-size: 2.5em;
          font-weight: 900;
          line-height: 1.1;
          margin-bottom: 0.2em;
          text-transform: uppercase;
          background: linear-gradient(135deg, #fff 0%, #a5b4fc 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .t-subtitle {
          color: var(--t-text-muted);
          font-size: 0.9em;
          margin-bottom: 2.5em;
        }

        .t-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5em;
          margin-bottom: 1em;
        }

        .t-detail-item {
          display: flex;
          flex-direction: column;
          gap: 0.2em;
        }

        .t-label {
          font-size: 0.6em;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--t-text-muted);
        }

        .t-value {
          font-size: 1.1em;
          font-weight: 700;
          color: var(--t-text-main);
        }

        .t-perforation {
          display: flex;
          justify-content: space-between;
          height: 1em;
          align-items: center;
          position: relative;
          z-index: 2;
        }

        .t-perf-line {
          flex-grow: 1;
          height: 0;
          border-top: 2px dashed rgba(255, 255, 255, 0.2);
          margin: 0 1.5em;
        }

        .t-stub {
          padding: 2em;
          background: radial-gradient(
              circle at top left,
              transparent 1em,
              var(--t-bg-light) 1.05em
            ),
            radial-gradient(
              circle at top right,
              transparent 1em,
              var(--t-bg-light) 1.05em
            );
          background-size: 51% 100%;
          background-position:
            top left,
            top right;
          background-repeat: no-repeat;
          border-bottom-left-radius: 1em;
          border-bottom-right-radius: 1em;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
        }

        .t-barcode-container {
          display: flex;
          flex-direction: column;
          gap: 0.5em;
        }

        .t-barcode {
          width: 10em;
          height: 3em;
          background: repeating-linear-gradient(
            90deg,
            #fff 0,
            #fff 2px,
            transparent 2px,
            transparent 4px,
            #fff 4px,
            #fff 5px,
            transparent 5px,
            transparent 8px,
            #fff 8px,
            #fff 12px,
            transparent 12px,
            transparent 15px,
            #fff 15px,
            #fff 16px,
            transparent 16px,
            transparent 18px
          );
          opacity: 0.8;
        }

        .t-barcode-id {
          font-family: monospace;
          font-size: 0.7em;
          color: var(--t-text-muted);
          letter-spacing: 0.2em;
          text-align: justify;
        }

        .t-admit {
          text-align: right;
        }

        .t-admit-text {
          font-size: 0.7em;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--t-text-muted);
        }

        .t-admit-num {
          font-size: 3em;
          font-weight: 900;
          line-height: 1;
          color: var(--t-accent);
          text-shadow: 0 0 15px var(--t-accent-glow);
        }

        .ticket-wrapper:active .ticket {
          transform: rotateX(15deg) rotateY(-5deg) scale(0.98);
        }

        .ticket-wrapper:active .t-stub {
          transform: translateY(5px) rotateZ(2deg);
          opacity: 0.8;
          transition:
            transform 0.2s ease,
            opacity 0.2s ease;
        }

        /* Button Styles */
        .button {
          cursor: pointer;
          border: solid 4px #161616;
          border-top: none;
          border-radius: 20px;
          position: relative;
          box-shadow: 0px 4px 10px #00000062, 0px 10px 40px -10px #000000a6,
            0px 12px 45px -15px #00000071;
          transition: all 0.3s ease;
          background: transparent;
          padding: 0;
          width: 100%;
          max-width: 280px;
          margin-top: 10px;
        }
        .inner {
          padding: 12px 16px;
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-weight: 700;
          letter-spacing: 1px;
          border-bottom: solid 3px #374e72;
          border-radius: 16px;
          background: linear-gradient(180deg, #5771a5, #000);
          color: #fff;
          text-shadow: 1px 1px #000, 0 0 9px #fff;
          text-transform: uppercase;
          transition: all 0.15s ease-out;
        }
        .button:active:not(:disabled) {
          box-shadow: none;
          transform: translateY(4px);
        }
        .button:active:not(:disabled) .inner {
          border-bottom-width: 0px;
        }
        .button:disabled {
          cursor: not-allowed;
          box-shadow: none;
          opacity: 0.7;
          transform: translateY(4px);
        }
        .button:disabled .inner {
          background: linear-gradient(180deg, #4b4b4b, #222);
          border-bottom-color: #333;
          text-shadow: none;
          color: #888;
        }
      `}</style>
    </main>
  );
}
