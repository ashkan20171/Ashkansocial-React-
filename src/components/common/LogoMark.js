import React from 'react';
import { Box } from '@mui/material';

/**
 * Premium LogoMark for Ashkan:
 * - Gradient orb with subtle noise/glow
 * - Stylized "A" monogram (inline SVG) for crisp rendering
 */
export default function LogoMark({ size = 28 }) {
  return (
    <Box
      sx={(th) => ({
        width: size,
        height: size,
        borderRadius: 999,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: th.palette.mode === 'dark' ? '0 16px 40px rgba(0,0,0,0.45)' : '0 16px 40px rgba(2,6,23,0.18)',
        background: `radial-gradient(70% 70% at 30% 30%, ${th.palette.secondary.main}, transparent 60%),
                     radial-gradient(80% 80% at 70% 70%, ${th.palette.primary.main}, transparent 62%),
                     linear-gradient(135deg, ${th.palette.primary.main}, ${th.palette.secondary.main})`,
        ':after': {
          content: '""',
          position: 'absolute',
          inset: 0,
          borderRadius: 999,
          pointerEvents: 'none',
          boxShadow: th.palette.mode === 'dark' ? '0 0 0 1px rgba(255,255,255,0.14) inset' : '0 0 0 1px rgba(2,6,23,0.10) inset',
        },
        transform: 'translateZ(0)',
        transition: 'transform 220ms ease, box-shadow 220ms ease',
        '&:hover': { transform: 'translateY(-2px) scale(1.05)' },
      })}
      aria-label="Ashkan"
    >
      {/* subtle grain */}
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          opacity: 0.10,
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27120%27 height=%27120%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.9%27 numOctaves=%272%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27120%27 height=%27120%27 filter=%27url(%23n)%27 opacity=%270.35%27/%3E%3C/svg%3E")',
          mixBlendMode: 'overlay',
          pointerEvents: 'none',
        }}
      />

      {/* monogram */}
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <svg width={Math.round(size * 0.62)} height={Math.round(size * 0.62)} viewBox="0 0 64 64" fill="none">
          <defs>
            <linearGradient id="ashkanA" x1="10" y1="10" x2="54" y2="54" gradientUnits="userSpaceOnUse">
              <stop stopColor="rgba(255,255,255,0.98)" />
              <stop offset="1" stopColor="rgba(255,255,255,0.78)" />
            </linearGradient>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1.2" result="blur" />
              <feColorMatrix
                in="blur"
                type="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.55 0"
                result="glow"
              />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* Stylized A */}
          <path
            d="M32 10L51 54H43.5L39.8 44.8H24.2L20.5 54H13L32 10Z"
            fill="url(#ashkanA)"
            filter="url(#glow)"
          />
          <path d="M27.2 38.8H36.8L32 26.6L27.2 38.8Z" fill="rgba(2,6,23,0.20)" />
        </svg>
      </Box>

      {/* highlight */}
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(40% 40% at 25% 20%, rgba(255,255,255,0.40), transparent 60%)',
          pointerEvents: 'none',
        }}
      />
    </Box>
  );
}
