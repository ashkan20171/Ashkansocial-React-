import React from 'react';
import { TextField } from '@mui/material';

export default function AppTextField({ sx, ...props }) {
  return (
    <TextField
      sx={[
        { '& .MuiInputBase-root': { borderRadius: 2.5 } },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...props}
    />
  );
}
