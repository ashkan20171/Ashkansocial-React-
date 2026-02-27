import React, { useMemo } from 'react';
import { Avatar, Box, Button, Card, CardContent, Stack, Typography, alpha } from '@mui/material';
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';
import { useNavigate } from 'react-router-dom';
import { useUi } from '../../context/UiContext';
import { getInitials, readProfile } from '../../lib/profile';

function isVerified(username) {
  return ['ashkan', 'sara'].includes((username || '').toLowerCase());
}

export default function UserCard({ username, displayName, subtitle, actionLabel, onAction, isFollowing }) {
  const navigate = useNavigate();
  const { locale } = useUi();

  const stored = useMemo(() => readProfile(username, null), [username]);
  const avatar = stored?.avatar || '';

  const name = displayName || username || 'User';
  const initials = getInitials(name);

  return (
    <Card elevation={0} sx={{ borderRadius: 3 }}>
      <CardContent sx={{ py: 1.5 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1.5}>
          <Stack direction="row" alignItems="center" gap={1.25} sx={{ minWidth: 0 }}>
            <Avatar
              src={avatar}
              onClick={() => navigate(`/u/${username}`)}
              sx={(th) => ({
                width: 46,
                height: 46,
                bgcolor: 'primary.main',
                fontWeight: 950,
                cursor: 'pointer',
                boxShadow: th.palette.mode === 'dark' ? '0 10px 22px rgba(0,0,0,0.35)' : '0 10px 22px rgba(2,6,23,0.12)',
              })}
            >
              {initials}
            </Avatar>

            <Box sx={{ minWidth: 0 }}>
              <Stack direction="row" alignItems="center" gap={0.75} sx={{ minWidth: 0 }}>
                <Typography
                  onClick={() => navigate(`/u/${username}`)}
                  sx={{ fontWeight: 950, cursor: 'pointer', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                >
                  {name}
                </Typography>
                {isVerified(username) ? (
                  <VerifiedRoundedIcon sx={{ fontSize: 18, opacity: 0.9 }} />
                ) : null}
              </Stack>
              <Typography variant="body2" sx={{ opacity: 0.78, fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                @{username}{subtitle ? ` • ${subtitle}` : ''}
              </Typography>
            </Box>
          </Stack>

          {onAction ? (
            <Button
              onClick={onAction}
              variant={isFollowing ? 'outlined' : 'contained'}
              color={isFollowing ? 'secondary' : 'primary'}
              size="small"
              sx={(th) => ({
                borderRadius: 999,
                fontWeight: 950,
                px: 1.6,
                ...(isFollowing
                  ? {
                      borderColor: alpha(th.palette.secondary.main, 0.6),
                      bgcolor: alpha(th.palette.secondary.main, th.palette.mode === 'dark' ? 0.16 : 0.08),
                    }
                  : {}),
              })}
            >
              {actionLabel || (locale === 'fa' ? 'دنبال کردن' : 'Follow')}
            </Button>
          ) : null}
        </Stack>
      </CardContent>
    </Card>
  );
}
