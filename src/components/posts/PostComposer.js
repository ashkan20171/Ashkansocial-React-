import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Popper,
  Stack,
  TextField,
  Tooltip,
  Typography,
  alpha,
} from '@mui/material';
import AddPhotoAlternateRoundedIcon from '@mui/icons-material/AddPhotoAlternateRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';

import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useUi } from '../../context/UiContext';
import { usePosts } from './usePosts';
import { extractHashtags, extractMentions } from '../../lib/text';

const DRAFT_KEY = 'ashkan.postcomposer.draft.v2';

export default function PostComposer({ onSubmit }) {
  const { user } = useAuth();
  const { locale } = useUi();
  const toast = useToast();
  const { posts } = usePosts();

  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  const maxLen = 280;

  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [showImage, setShowImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // autocomplete state
  const [caret, setCaret] = useState(0);
  const [token, setToken] = useState(null);
  const [openSuggest, setOpenSuggest] = useState(false);

  // restore draft once
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const d = JSON.parse(raw);
      if (d?.content) setContent(String(d.content).slice(0, maxLen));
      if (d?.imageUrl) {
        setImageUrl(String(d.imageUrl));
        setShowImage(true);
      }
      if (d?.content || d?.imageUrl) toast.show(locale === 'fa' ? 'پیش‌نویس بازیابی شد' : 'Draft restored', 'info');
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // autosave draft
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        const payload = { content, imageUrl: showImage ? imageUrl : '', ts: Date.now() };
        if (!payload.content?.trim() && !payload.imageUrl) {
          localStorage.removeItem(DRAFT_KEY);
          return;
        }
        localStorage.setItem(DRAFT_KEY, JSON.stringify(payload));
      } catch {}
    }, 240);
    return () => clearTimeout(t);
  }, [content, imageUrl, showImage]);

  const remaining = maxLen - content.length;
  const canPost = content.trim().length > 0 && remaining >= 0;

  const users = useMemo(() => {
    const base = new Set(['ashkan', 'openai', 'reactjs', 'scania']);
    (posts || []).forEach((p) => {
      const u = p?.author?.username;
      if (u) base.add(String(u).replace(/^@/, ''));
    });
    (posts || []).forEach((p) => extractMentions(p?.content || '').forEach((m) => base.add(m)));
    return Array.from(base).sort();
  }, [posts]);

  const tags = useMemo(() => {
    const base = new Set(['AshkanSocial', 'React', 'UI', 'CleanCode', 'DesignSystem']);
    (posts || []).forEach((p) => extractHashtags(p?.content || '').forEach((h) => base.add(h)));
    return Array.from(base).sort();
  }, [posts]);

  const getTokenAtCaret = (text, pos) => {
    const left = text.slice(0, pos);
    const m = left.match(/(^|\s)([@#])([\p{L}0-9_]{0,32})$/u);
    if (!m) return null;
    const symbol = m[2];
    const query = m[3] || '';
    const start = pos - query.length - 1;
    return { symbol, query, start, end: pos };
  };

  const suggestions = useMemo(() => {
    if (!token) return [];
    const list = token.symbol === '@' ? users : tags;
    const q = (token.query || '').toLowerCase();
    return list.filter((x) => x.toLowerCase().startsWith(q)).slice(0, 7);
  }, [token, users, tags]);

  const applySuggestion = (value) => {
    if (!token) return;
    const before = content.slice(0, token.start);
    const after = content.slice(caret);
    const insert = `${token.symbol}${value} `;
    const next = (before + insert + after).slice(0, maxLen);
    setContent(next);
    setOpenSuggest(false);
    setToken(null);
    requestAnimationFrame(() => {
      try {
        const el = inputRef.current?.querySelector?.('textarea');
        if (!el) return;
        const p = Math.min(before.length + insert.length, maxLen);
        el.focus();
        el.setSelectionRange(p, p);
      } catch {}
    });
  };

  const setFromFile = async (file) => {
    if (!file) return;
    if (!file.type?.startsWith('image/')) {
      toast.show(locale === 'fa' ? 'فقط تصویر مجاز است' : 'Images only', 'warning');
      return;
    }
    if (file.size > 2.5 * 1024 * 1024) {
      toast.show(locale === 'fa' ? 'حجم تصویر زیاد است' : 'Image too large', 'warning');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImageUrl(String(reader.result || ''));
      setShowImage(true);
    };
    reader.readAsDataURL(file);
  };

  const handleSend = async () => {
    if (!canPost || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 220));
      onSubmit?.({
        author: user || { name: 'Guest', username: 'guest' },
        content: content.trim(),
        image: showImage ? imageUrl : '',
      });
      localStorage.removeItem(DRAFT_KEY);
      setContent('');
      setImageUrl('');
      setShowImage(false);
      setOpenSuggest(false);
      setToken(null);
      toast.show(locale === 'fa' ? 'ارسال شد' : 'Sent', 'success');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card elevation={0} sx={{ borderRadius: 3 }}>
      <CardContent>
        <Stack gap={1.2}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography sx={{ fontWeight: 950 }}>
              {locale === 'fa' ? 'پست جدید' : 'New post'}
            </Typography>

            <Chip
              size="small"
              label={locale === 'fa' ? `${remaining} کاراکتر` : `${remaining} chars`}
              sx={(th) => ({
                fontWeight: 900,
                borderRadius: 999,
                bgcolor: alpha(th.palette.primary.main, th.palette.mode === 'dark' ? 0.14 : 0.08),
              })}
            />
          </Stack>

          <TextField
            value={content}
            onChange={(e) => {
              const v = String(e.target.value || '').slice(0, maxLen);
              const p = e.target.selectionStart ?? v.length;
              setContent(v);
              setCaret(p);
              const tk = getTokenAtCaret(v, p);
              setToken(tk);
              setOpenSuggest(!!tk);
            }}
            onKeyDown={(e) => {
              if (!openSuggest || !suggestions.length) return;
              if (e.key === 'Escape') {
                setOpenSuggest(false);
                return;
              }
              if (e.key === 'Enter') {
                const first = suggestions[0];
                if (first) {
                  e.preventDefault();
                  applySuggestion(first);
                }
              }
            }}
            placeholder={locale === 'fa' ? 'چه خبر؟…' : "What's happening…"}
            fullWidth
            multiline
            minRows={3}
            inputRef={inputRef}
            inputProps={{ maxLength: maxLen }}
            helperText={<span style={{ fontWeight: 800, opacity: 0.78 }}>{locale === 'fa' ? 'از @ برای منشن و از # برای هشتگ استفاده کن' : 'Use @ for mentions and # for hashtags'}</span>}
          />

          <Popper open={openSuggest && !!suggestions.length} anchorEl={inputRef.current} placement="bottom-start" sx={{ zIndex: 1500 }}>
            <Paper
              elevation={0}
              sx={(th) => ({
                mt: 1,
                width: { xs: 280, sm: 360 },
                borderRadius: 3,
                overflow: 'hidden',
                border: `1px solid ${th.palette.mode === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(2,6,23,0.10)'}`,
                background: th.palette.mode === 'dark' ? 'rgba(2,6,23,0.88)' : 'rgba(255,255,255,0.92)',
                backdropFilter: 'blur(14px) saturate(150%)',
              })}
            >
              <List dense disablePadding>
                {suggestions.map((s) => (
                  <ListItemButton key={s} onClick={() => applySuggestion(s)}>
                    <ListItemText primaryTypographyProps={{ fontWeight: 900 }} primary={`${token?.symbol || ''}${s}`} />
                  </ListItemButton>
                ))}
              </List>
            </Paper>
          </Popper>

          {showImage && (
            <Box
              sx={(th) => ({
                position: 'relative',
                borderRadius: 3,
                overflow: 'hidden',
                border: `1px solid ${th.palette.mode === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(2,6,23,0.10)'}`,
              })}
            >
              <Box component="img" src={imageUrl} alt="preview" sx={{ width: '100%', display: 'block' }} />
              <IconButton
                onClick={() => {
                  setShowImage(false);
                  setImageUrl('');
                }}
                sx={(th) => ({
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  bgcolor: alpha(th.palette.background.paper, th.palette.mode === 'dark' ? 0.55 : 0.75),
                  backdropFilter: 'blur(10px)',
                })}
              >
                <CloseRoundedIcon />
              </IconButton>
            </Box>
          )}

          <Divider />

          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" gap={1} alignItems="center">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => setFromFile(e.target.files?.[0])}
              />
              <Tooltip title={locale === 'fa' ? 'افزودن تصویر' : 'Add image'}>
                <IconButton onClick={() => fileInputRef.current?.click()}>
                  <AddPhotoAlternateRoundedIcon />
                </IconButton>
              </Tooltip>
            </Stack>

            <Button
              variant="contained"
              endIcon={<SendRoundedIcon />}
              disabled={!canPost || isSubmitting}
              onClick={handleSend}
              sx={{ borderRadius: 999, fontWeight: 900, px: 2.2 }}
            >
              {locale === 'fa' ? 'ارسال' : 'Post'}
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
