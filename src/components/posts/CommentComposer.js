import React, { useMemo, useState } from 'react';
import { Box, Button, IconButton, Stack, TextField, Typography } from '@mui/material';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useUi } from '../../context/UiContext';

export default function CommentComposer({
  placeholder,
  onSubmit,
  onCancel,
  autoFocus = false,
  compact = false,
  initialValue = '',
}) {
  const { locale } = useUi();
  const [text, setText] = useState(initialValue || '');

  const strings = useMemo(() => {
    const fa = locale === 'fa';
    return {
      send: fa ? 'ارسال' : 'Send',
      cancel: fa ? 'لغو' : 'Cancel',
      ph: fa ? 'نظر خود را بنویس…' : 'Write a comment…',
    };
  }, [locale]);

  return (
    <Box>
      <Stack direction="row" alignItems="center" gap={1}>
        <TextField
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder || strings.ph}
          fullWidth
          size={compact ? 'small' : 'medium'}
          autoFocus={autoFocus}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              const v = text.trim();
              if (!v) return;
              onSubmit?.(v);
              setText('');
            }
          }}
        />
        <Button
          variant="contained"
          startIcon={<SendRoundedIcon />}
          sx={{ borderRadius: 999, fontWeight: 950, px: 2 }}
          onClick={() => {
            const v = text.trim();
            if (!v) return;
            onSubmit?.(v);
            setText('');
          }}
        >
          {strings.send}
        </Button>

        {onCancel ? (
          <IconButton
            aria-label={strings.cancel}
            onClick={() => {
              setText('');
              onCancel?.();
            }}
          >
            <CloseRoundedIcon />
          </IconButton>
        ) : null}
      </Stack>

      {!compact ? (
        <Typography sx={{ mt: 0.75, opacity: 0.75, fontWeight: 700, fontSize: 12 }}>
          {locale === 'fa'
            ? 'برای ارسال سریع Enter را بزن. برای خط جدید Shift+Enter.'
            : 'Press Enter to send. Use Shift+Enter for a new line.'}
        </Typography>
      ) : null}
    </Box>
  );
}
