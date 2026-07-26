'use client';

interface FillLogoProps {
  /** Persentase 0-100, seberapa penuh logo terisi dari bawah */
  percent: number;
  size?: number | string;
}

/**
 * Teknik: dua salinan logo yang sama ditumpuk.
 * - Lapis bawah: outline Delft Blue, SELALU terlihat penuh.
 * - Lapis atas: versi berwarna asli dengan gradien SVG aslinya, dipotong (clip-path) oleh <rect>
 *   yang bergerak naik sesuai persentase.
 */
export default function FillLogo({ percent, size = 360 }: FillLogoProps) {
  const clamped = Math.max(0, Math.min(100, percent));
  const VB = 1080; // viewBox logo CODEX asli (1080x1080)

  const fillHeight = (VB * clamped) / 100;
  const fillY = VB - fillHeight;

  // Render all paths with optional fill configurations
  const renderPaths = (isOutline: boolean) => (
    <>
      {/* Sayap Kiri Atas */}
      <g transform="matrix(1,0,0,1,-71.450374,0)">
        <g transform="matrix(1,0,0,1,-12.912949,0)">
          <path
            d="M392.138,634.489C296.018,574.525 252.031,479.279 305.597,287.064C372.692,219.414 434.882,168.713 434.882,168.713C605.788,403.33 354.059,399.463 354.059,548.726C354.059,585.754 370.569,611.892 392.138,634.489Z"
            fill={isOutline ? 'none' : 'url(#_Linear1)'}
          />
        </g>
      </g>
      {/* Sayap Kiri Bawah */}
      <g transform="matrix(1,0,0,1,-71.450374,0)">
        <g transform="matrix(1,0,0,1,-12.912949,0)">
          <path
            d="M392.138,634.489C453.58,698.86 556.07,734.498 434.882,911.287C434.882,911.287 141.709,686.035 141.709,540.281C141.709,468.776 227.016,366.295 305.597,287.064C252.031,479.279 296.018,574.525 392.138,634.489Z"
            fill={isOutline ? 'none' : 'url(#_Linear2)'}
          />
        </g>
      </g>
      {/* Sayap Kanan Atas */}
      <g transform="matrix(1,0,0,-1,71.450374,1080)">
        <g transform="matrix(-1,0,0,-1,1092.912949,1080)">
          <path
            d="M392.138,634.489C296.018,574.525 252.031,479.279 305.597,287.064C372.692,219.414 434.882,168.713 434.882,168.713C605.788,403.33 354.059,399.463 354.059,548.726C354.059,585.754 370.569,611.892 392.138,634.489Z"
            fill={isOutline ? 'none' : 'url(#_Linear3)'}
          />
        </g>
      </g>
      {/* Sayap Kanan Bawah */}
      <g transform="matrix(1,0,0,-1,71.450374,1080)">
        <g transform="matrix(-1,0,0,-1,1092.912949,1080)">
          <path
            d="M392.138,634.489C453.58,698.86 556.07,734.498 434.882,911.287C434.882,911.287 141.709,686.035 141.709,540.281C141.709,468.776 227.016,366.295 305.597,287.064C252.031,479.279 296.018,574.525 392.138,634.489Z"
            fill={isOutline ? 'none' : 'url(#_Linear4)'}
          />
        </g>
      </g>
      {/* Diamond Tengah */}
      <g transform="matrix(0.946448,-0.946448,0.946448,0.946448,-504.937456,545.964271)">
        <path
          d="M658.551,486.859L658.551,610.902C658.551,633.722 640.024,652.249 617.203,652.249L493.161,652.249C470.34,652.249 451.813,633.722 451.813,610.902L451.813,486.859C451.813,464.038 470.34,445.511 493.161,445.511L617.203,445.511C640.024,445.511 658.551,464.038 658.551,486.859Z"
          fill={isOutline ? 'none' : 'url(#_Linear5)'}
        />
      </g>
    </>
  );

  return (
    <div
      style={{ width: size, height: size, position: 'relative' }}
      aria-label={`Logo terisi ${clamped.toFixed(0)} persen`}
    >
      {/* Definisikan gradien asli dari logo.svg */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="_Linear1" x1="0" y1="0" x2="1" y2="0" gradientUnits="userSpaceOnUse" gradientTransform="matrix(46.869499,-473.914763,473.914763,46.869499,388.428615,634.488758)">
            <stop offset="0" stopColor="rgb(32,44,96)" stopOpacity="1" />
            <stop offset="0.42" stopColor="rgb(67,84,129)" stopOpacity="1" />
            <stop offset="1" stopColor="rgb(143,172,202)" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="_Linear2" x1="0" y1="0" x2="1" y2="0" gradientUnits="userSpaceOnUse" gradientTransform="matrix(-290.821686,-604.835311,604.835311,-290.821686,432.530738,911.28713)">
            <stop offset="0" stopColor="rgb(32,44,96)" stopOpacity="1" />
            <stop offset="0.49" stopColor="rgb(75,102,146)" stopOpacity="1" />
            <stop offset="1" stopColor="rgb(89,121,162)" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="_Linear3" x1="0" y1="0" x2="1" y2="0" gradientUnits="userSpaceOnUse" gradientTransform="matrix(46.869499,-473.914763,473.914763,46.869499,388.428615,634.488758)">
            <stop offset="0" stopColor="rgb(32,44,96)" stopOpacity="1" />
            <stop offset="0.42" stopColor="rgb(67,84,129)" stopOpacity="1" />
            <stop offset="1" stopColor="rgb(143,172,202)" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="_Linear4" x1="0" y1="0" x2="1" y2="0" gradientUnits="userSpaceOnUse" gradientTransform="matrix(-290.821686,-604.835311,604.835311,-290.821686,432.530738,911.28713)">
            <stop offset="0" stopColor="rgb(32,44,96)" stopOpacity="1" />
            <stop offset="0.49" stopColor="rgb(75,102,146)" stopOpacity="1" />
            <stop offset="1" stopColor="rgb(89,121,162)" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="_Linear5" x1="0" y1="0" x2="1" y2="0" gradientUnits="userSpaceOnUse" gradientTransform="matrix(-145.384739,145.384739,-145.384739,-145.384739,609.313892,494.748412)">
            <stop offset="0" stopColor="rgb(248,202,7)" stopOpacity="1" />
            <stop offset="0.53" stopColor="rgb(253,173,2)" stopOpacity="1" />
            <stop offset="1" stopColor="rgb(255,162,0)" stopOpacity="1" />
          </linearGradient>
        </defs>
      </svg>

      {/* Lapis 1: outline tebal White, penuh dari awal */}
      <svg
        viewBox={`0 0 ${VB} ${VB}`}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      >
        <g stroke="var(--color-white)" strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" fill="none">
          {renderPaths(true)}
        </g>
      </svg>

      {/* Lapis 2: versi berwarna asli, terpotong sesuai persentase kehadiran */}
      <svg
        viewBox={`0 0 ${VB} ${VB}`}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      >
        <defs>
          <clipPath id="fill-clip">
            <rect
              x={0}
              y={fillY}
              width={VB}
              height={fillHeight}
              style={{ transition: 'y 900ms cubic-bezier(0.4,0,0.2,1), height 900ms cubic-bezier(0.4,0,0.2,1)' }}
            />
          </clipPath>
        </defs>
        <g clipPath="url(#fill-clip)">
          {renderPaths(false)}
        </g>
      </svg>

      {/* Garis permukaan "cairan" biar terasa hidup, menggunakan warna Pistachio */}
      <svg
        viewBox={`0 0 ${VB} ${VB}`}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      >
        <defs>
          <clipPath id="line-clip">
            <g>
              {renderPaths(false)}
            </g>
          </clipPath>
        </defs>
        <line
          x1={0}
          x2={VB}
          y1={fillY}
          y2={fillY}
          stroke="var(--color-pistachio)"
          strokeWidth={14}
          opacity={percent > 0 && percent < 100 ? 0.95 : 0}
          clipPath="url(#line-clip)"
          style={{ transition: 'y1 900ms cubic-bezier(0.4,0,0.2,1), y2 900ms cubic-bezier(0.4,0,0.2,1)' }}
        />
      </svg>
    </div>
  );
}
