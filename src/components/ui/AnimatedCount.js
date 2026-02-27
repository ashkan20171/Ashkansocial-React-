import React from 'react';
import { Box, keyframes } from '@mui/material';

/**
 * AnimatedCount
 * Smoothly animates numbers when they change (micro-interaction for likes/comments),
 * with a subtle "pop" when the value increases.
 */
const pop = keyframes`
  0% { transform: translateY(0) scale(1); filter: brightness(1); }
  35% { transform: translateY(-1px) scale(1.08); filter: brightness(1.06); }
  100% { transform: translateY(0) scale(1); filter: brightness(1); }
`;

export default function AnimatedCount({ value, durationMs = 240, sx }) {
  const [display, setDisplay] = React.useState(value);
  const raf = React.useRef(null);
  const prev = React.useRef(value);
  const [bump, setBump] = React.useState(0);

  React.useEffect(() => {
    const from = Number(prev.current ?? value);
    const to = Number(value ?? 0);
    prev.current = to;

    if (Number.isNaN(from) || Number.isNaN(to) || from === to) {
      setDisplay(to);
      return;
    }

    if (to > from) setBump((x) => x + 1);

    const start = performance.now();
    const step = (t) => {
      const p = Math.min(1, (t - start) / durationMs);
      // easeOutQuart
      const eased = 1 - Math.pow(1 - p, 4);
      const next = Math.round(from + (to - from) * eased);
      setDisplay(next);
      if (p < 1) raf.current = requestAnimationFrame(step);
    };

    raf.current = requestAnimationFrame(step);
    return () => raf.current && cancelAnimationFrame(raf.current);
  }, [value, durationMs]);

  return (
    <Box
      component="span"
      sx={{
        display: 'inline-block',
        animation: bump ? `${pop} 320ms ease-out` : 'none',
        ...sx,
      }}
      // key ensures pop retriggers even if value increases quickly
      key={`cnt_${bump}`}
    >
      {display}
    </Box>
  );
}
