import React from 'react';
import { Card, CardContent, Skeleton, Stack } from '@mui/material';

export default function PostCardSkeleton() {
  return (
    <Card elevation={0} sx={{ borderRadius: 3, overflow: 'hidden' }}>
      <CardContent sx={{ p: 2.25 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" gap={1.25}>
            <Skeleton variant="circular" width={40} height={40} />
            <Stack gap={0.4}>
              <Skeleton variant="text" width={140} />
              <Skeleton variant="text" width={210} />
            </Stack>
          </Stack>
          <Skeleton variant="rounded" width={84} height={24} sx={{ borderRadius: 999 }} />
        </Stack>

        <Stack sx={{ mt: 1.5 }} gap={0.6}>
          <Skeleton variant="text" />
          <Skeleton variant="text" width="92%" />
          <Skeleton variant="text" width="72%" />
        </Stack>
      </CardContent>

      <Skeleton variant="rectangular" height={220} />

      <CardContent sx={{ p: 1.5 }}>
        <Stack direction="row" alignItems="center" gap={1}>
          <Skeleton variant="circular" width={34} height={34} />
          <Skeleton variant="text" width={28} />
          <Skeleton variant="circular" width={34} height={34} sx={{ ml: 1 }} />
          <Skeleton variant="text" width={28} />
          <Skeleton variant="circular" width={34} height={34} sx={{ ml: 'auto' }} />
        </Stack>

        <Skeleton variant="rounded" height={38} sx={{ mt: 1.5, borderRadius: 2 }} />
      </CardContent>
    </Card>
  );
}