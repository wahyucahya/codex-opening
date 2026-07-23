'use client';

import FillLogo from '@/components/FillLogo';
import { useAttendanceCount } from '@/hooks/useAttendanceCount';

const TOTAL_PESERTA = 100;

export default function LayarPage() {
  const { count, percent, ready } = useAttendanceCount(TOTAL_PESERTA);

  return (
    <main
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 32,
        background: 'radial-gradient(circle at 50% 30%, #10102A 0%, #050510 70%)',
      }}
    >
      <FillLogo percent={ready ? percent : 0} size={480} />
      <p style={{ fontSize: 40, fontWeight: 800, color: 'white', letterSpacing: 1 }}>
        {count} / {TOTAL_PESERTA} <span style={{ opacity: 0.6, fontWeight: 500 }}>peserta hadir</span>
      </p>
      {percent >= 100 && (
        <p style={{ fontSize: 20, color: '#00E5FF' }}>CODEX-2 resmi dibuka 🎉</p>
      )}
    </main>
  );
}
