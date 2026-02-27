import React from 'react';
import { Card, alpha } from '@mui/material';

/**
 * AppCard
 * Premium card wrapper with subtle border + hover shimmer (no extra deps).
 */
export default function AppCard({ sx, ...props }) {
  return (
    <Card
      elevation={0}
      sx={(th) => [
        {
          borderRadius: 3,
          overflow: 'hidden',
          position: 'relative',
          border: '1px solid',
          borderColor: alpha(th.palette.divider, th.palette.mode === 'dark' ? 0.55 : 0.9),
          backgroundImage:
            th.palette.mode === 'dark'
              ? `linear-gradient(180deg, ${alpha(th.palette.background.paper, 0.92)}, ${alpha(
                  th.palette.background.paper,
                  0.78
                )})`
              : `linear-gradient(180deg, ${alpha('#ffffff', 0.98)}, ${alpha('#ffffff', 0.86)})`,
          transition: 'transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease, transform 180ms ease',
          '&:hover': { transform: 'translateY(-2px) rotateX(.7deg) rotateY(-.7deg)',
            transform: 'translateY(-1px)',
            boxShadow: th.palette.mode === 'dark' ? '0 18px 54px rgba(0,0,0,0.35)' : '0 18px 54px rgba(2,6,23,0.10)',
            borderColor: alpha(th.palette.secondary.main, th.palette.mode === 'dark' ? 0.38 : 0.26),
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: -2,
            pointerEvents: 'none',
            opacity: 0,
            background:
              th.palette.mode === 'dark'
                ? `linear-gradient(120deg, transparent 0%, ${alpha('#ffffff', 0.08)} 18%, transparent 36%)`
                : `linear-gradient(120deg, transparent 0%, ${alpha('#000000', 0.04)} 18%, transparent 36%)`,
            transform: 'translateX(-120%)',
          },
          '&:hover::before': {
            opacity: 1,
            animation: 'ashkanShimmer 980ms cubic-bezier(.2,.8,.2,1) both',
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...props}
    />
  );
}
