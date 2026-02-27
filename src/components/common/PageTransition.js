import React from 'react';
import { Box, Fade, useMediaQuery } from '@mui/material';

/**
 * Premium page transition without extra deps.
 * Respects prefers-reduced-motion.
 */
export default function PageTransition({ children }) {
  const reduce = useMediaQuery('(prefers-reduced-motion: reduce)');
  if (reduce) return <>{children}</>;

  return (
    <Fade in timeout={220} appear>
      <Box sx={{ animation: 'ashkanRouteIn 520ms cubic-bezier(.2,.8,.2,1) both' }}>
        {children}
      </Box>
    </Fade>
  );
}
