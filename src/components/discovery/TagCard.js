import React from 'react';
import { Card, CardContent, Stack, Typography, Chip, alpha } from '@mui/material';
import WhatshotRoundedIcon from '@mui/icons-material/WhatshotRounded';
import { useNavigate } from 'react-router-dom';
import { useUi } from '../../context/UiContext';

export default function TagCard({ tag, count }) {
  const navigate = useNavigate();
  const { locale } = useUi();

  return (
    <Card elevation={0} sx={{ borderRadius: 3, cursor: 'pointer' }} onClick={() => navigate(`/tag/${encodeURIComponent(tag)}`)}>
      <CardContent sx={{ py: 1.5 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1.25}>
          <Stack>
            <Typography sx={{ fontWeight: 950 }}>#{tag}</Typography>
            <Typography variant="body2" sx={{ opacity: 0.78, fontWeight: 800 }}>
              {locale === 'fa' ? `${count} پست` : `${count} posts`}
            </Typography>
          </Stack>

          <Chip
            icon={<WhatshotRoundedIcon />}
            label={locale === 'fa' ? 'ترند' : 'Trending'}
            size="small"
            sx={(th) => ({
              borderRadius: 999,
              fontWeight: 900,
              bgcolor: alpha(th.palette.primary.main, th.palette.mode === 'dark' ? 0.18 : 0.10),
            })}
          />
        </Stack>
      </CardContent>
    </Card>
  );
}
