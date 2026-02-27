import React from 'react';
import { Box } from '@mui/material';

/**
 * Lightweight stagger / reveal animation without extra deps.
 * Respects prefers-reduced-motion.
 */
export default function Reveal({ children, delay = 0, sx }) {
  return (
    <Box
      sx={{
        animation: 'ashkanEnter 520ms cubic-bezier(.2,.8,.2,1) both',
        animationDelay: `${delay}ms`,
        '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}
