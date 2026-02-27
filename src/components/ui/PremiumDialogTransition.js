import React from 'react';
import { Grow } from '@mui/material';

/**
 * Premium dialog transition (no extra deps).
 * Subtle grow + fade timing for a modern feel.
 */
const PremiumDialogTransition = React.forwardRef(function PremiumDialogTransition(props, ref) {
  return <Grow ref={ref} {...props} timeout={{ enter: 260, exit: 180 }} />;
});

export default PremiumDialogTransition;
