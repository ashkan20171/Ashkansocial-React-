import React from 'react';
import { Button } from '@mui/material';

export default function AppButton({ sx, ...props }) {
  return (
    <Button
      sx={[
        { borderRadius: 999, fontWeight: 950, textTransform: 'none' },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...props}
    />
  );
}
