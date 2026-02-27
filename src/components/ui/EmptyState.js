import React from 'react';
import { Box, Button, Paper, Stack, Typography, alpha } from '@mui/material';

/**
 * EmptyState
 * Premium empty placeholders with optional call-to-action.
 */
export default function EmptyState({
  title,
  subtitle,
  actionText,
  onAction,
  icon,
  sx,
}) {
  return (
    <Paper
      elevation={0}
      sx={(th) => ({
        p: { xs: 2, sm: 3 },
        borderRadius: 4,
        border: '1px solid',
        borderColor: 'divider',
        background:
          th.palette.mode === 'dark'
            ? `linear-gradient(180deg, ${alpha(th.palette.background.paper, 0.9)}, ${alpha(
                th.palette.background.paper,
                0.75
              )})`
            : `linear-gradient(180deg, ${alpha('#ffffff', 0.95)}, ${alpha('#ffffff', 0.78)})`,
        ...sx,
      })}
    >
      <Stack gap={1.25} alignItems="flex-start">
        {icon ? (
          <Box
            sx={(th) => ({
              width: 44,
              height: 44,
              borderRadius: 3,
              display: 'grid',
              placeItems: 'center',
              bgcolor: alpha(th.palette.secondary.main, th.palette.mode === 'dark' ? 0.18 : 0.12),
              color: th.palette.secondary.main,
            })}
          >
            {icon}
          </Box>
        ) : null}

        <Typography sx={{ fontWeight: 950, fontSize: 18 }}>{title}</Typography>
        {subtitle ? (
          <Typography sx={{ opacity: 0.78, fontWeight: 700, lineHeight: 1.7 }}>
            {subtitle}
          </Typography>
        ) : null}

        {actionText ? (
          <Button
            onClick={onAction}
            variant="contained"
            sx={{ borderRadius: 999, fontWeight: 900, px: 2.25 }}
          >
            {actionText}
          </Button>
        ) : null}
      </Stack>
    </Paper>
  );
}