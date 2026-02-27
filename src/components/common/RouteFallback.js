import React from 'react';
import { Box, CircularProgress, Skeleton, Stack, Typography } from '@mui/material';

export default function RouteFallback() {
  return (
    <Box sx={{ px: { xs: 2, md: 3 }, py: 3 }}>
      <Stack direction="row" alignItems="center" gap={1.25} sx={{ mb: 2 }}>
        <CircularProgress size={18} />
        <Typography sx={{ fontWeight: 850, opacity: 0.85 }}>Loading…</Typography>
      </Stack>

      <Stack gap={1.25}>
        <Skeleton variant="rounded" height={56} />
        <Skeleton variant="rounded" height={140} />
        <Skeleton variant="rounded" height={140} />
      </Stack>
    </Box>
  );
}
