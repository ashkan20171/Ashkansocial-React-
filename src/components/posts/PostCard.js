import React, { useMemo, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Typography,
  alpha,
} from '@mui/material';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded';
import BookmarkRoundedIcon from '@mui/icons-material/BookmarkRounded';
import PushPinRoundedIcon from '@mui/icons-material/PushPinRounded';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import ShareRoundedIcon from '@mui/icons-material/ShareRounded';
import FlagRoundedIcon from '@mui/icons-material/FlagRounded';
import BlockRoundedIcon from '@mui/icons-material/BlockRounded';
import { useNavigate } from 'react-router-dom';
import { useUi } from '../../context/UiContext';
import { useToast } from '../../context/ToastContext';
import { useModeration } from '../../context/ModerationContext';
import TextRenderer from '../common/TextRenderer';
import { getInitials } from '../../lib/profile';

function fmtTime(ts) {
  try {
    const d = new Date(ts);
    return d.toLocaleString(undefined, { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

export default function PostCard({ post, onLike, onSave, onComment, onPin, onShare }) {
  const { locale } = useUi();
  const toast = useToast();
  const { isBlocked, toggleBlock, reportPost } = useModeration();
  const navigate = useNavigate();

  const [menuEl, setMenuEl] = useState(null);
  const menuOpen = Boolean(menuEl);

  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');

  const t = (fa, en) => (locale === 'fa' ? fa : en);

  const author = post?.author || { username: 'unknown', name: 'Unknown' };
  const authorName = author?.name || author?.username || 'Unknown';
  const initials = getInitials(authorName);
  const blocked = isBlocked(author?.username);

  const tags = useMemo(() => {
    const base = Array.isArray(post?.tags) ? post.tags : [];
    // fallback: parse hashtags from content
    const inText = (post?.content || '').match(/#([\p{L}0-9_]+)/gu) || [];
    const parsed = inText.map((x) => x.replace('#', '').toLowerCase());
    return Array.from(new Set([...base, ...parsed])).slice(0, 6);
  }, [post?.tags, post?.content]);

  const handleShare = async () => {
    const url = `${window.location.origin}/post/${post.id}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Ashkan', text: post?.content || '', url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.show(t('لینک کپی شد', 'Link copied'), 'success');
      }
      if (onShare) onShare(post.id);
    } catch (e) {
      toast.show(t('اشتراک‌گذاری انجام نشد', 'Share failed'), 'error');
    }
  };

  const openReport = () => {
    setMenuEl(null);
    setReportReason('');
    setReportOpen(true);
  };

  const submitReport = () => {
    reportPost(post.id, reportReason || 'unspecified');
    setReportOpen(false);
    toast.show(t('گزارش ثبت شد ✅', 'Report submitted ✅'), 'success');
  };

  const toggleBlockUser = () => {
    const u = author?.username;
    if (!u) return;
    toggleBlock(u);
    setMenuEl(null);
    toast.show(
      blocked ? t('کاربر از بلاک خارج شد', 'User unblocked') : t('کاربر بلاک شد', 'User blocked'),
      'info'
    );
  };

  return (
    <Box
      sx={(th) => ({
        borderRadius: 4,
        border: `1px solid ${th.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.07)'}`,
        background: th.palette.mode === 'dark' ? 'rgba(2,6,23,0.55)' : 'rgba(255,255,255,0.72)',
        backdropFilter: 'blur(10px)',
        boxShadow: th.palette.mode === 'dark' ? '0 18px 45px rgba(0,0,0,0.35)' : '0 18px 45px rgba(2,6,23,0.10)',
        overflow: 'hidden',
      })}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2 }}>
        <Stack direction="row" gap={1.25} alignItems="center" sx={{ minWidth: 0 }}>
          <Avatar sx={{ fontWeight: 950 }} src={author?.avatar || ''}>
            {initials}
          </Avatar>

          <Box sx={{ minWidth: 0 }}>
            <Stack direction="row" alignItems="center" gap={1} sx={{ minWidth: 0 }}>
              <Typography sx={{ fontWeight: 950 }} noWrap>
                {authorName}
              </Typography>
              <Typography sx={{ opacity: 0.7, fontWeight: 800 }} noWrap>
                @{author?.username}
              </Typography>
            </Stack>
            <Typography variant="caption" sx={{ opacity: 0.75, fontWeight: 800 }}>
              {fmtTime(post?.createdAt)}
              {post?.pinned ? ` • ${t('سنجاق‌شده', 'Pinned')}` : ''}
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" alignItems="center" gap={0.5}>
          <IconButton size="small" onClick={handleShare} aria-label="share">
            <ShareRoundedIcon fontSize="small" />
          </IconButton>

          <IconButton
            size="small"
            onClick={(e) => setMenuEl(e.currentTarget)}
            aria-label="more"
          >
            <MoreVertRoundedIcon fontSize="small" />
          </IconButton>

          <Menu
            anchorEl={menuEl}
            open={menuOpen}
            onClose={() => setMenuEl(null)}
            PaperProps={{ sx: { borderRadius: 3, minWidth: 220 } }}
          >
            <MenuItem
              onClick={() => {
                setMenuEl(null);
                navigate(`/post/${post.id}`);
              }}
            >
              {t('مشاهده جزئیات', 'View details')}
            </MenuItem>

            <MenuItem onClick={openReport}>
              <FlagRoundedIcon fontSize="small" style={{ marginInlineEnd: 10, opacity: 0.9 }} />
              {t('گزارش پست', 'Report post')}
            </MenuItem>

            <MenuItem onClick={toggleBlockUser}>
              <BlockRoundedIcon fontSize="small" style={{ marginInlineEnd: 10, opacity: 0.9 }} />
              {blocked ? t('خارج کردن از بلاک', 'Unblock user') : t('بلاک کاربر', 'Block user')}
            </MenuItem>
          </Menu>
        </Stack>
      </Stack>

      <Divider />

      <Box sx={{ p: 2 }}>
        <TextRenderer text={post?.content || ''} />

        {!!post?.image && (
          <Box
            sx={(th) => ({
              mt: 1.5,
              borderRadius: 3,
              overflow: 'hidden',
              border: `1px solid ${th.palette.mode === 'dark' ? 'rgba(255,255,255,0.10)' : 'rgba(15,23,42,0.08)'}`,
              cursor: 'pointer',
            })}
            onClick={() => navigate(`/post/${post.id}`)}
            role="button"
            tabIndex={0}
          >
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <img src={post.image} style={{ width: '100%', display: 'block' }} />
          </Box>
        )}

        {!!tags.length && (
          <Stack direction="row" gap={1} flexWrap="wrap" sx={{ mt: 1.5 }}>
            {tags.map((tag) => (
              <Chip
                key={tag}
                label={`#${tag}`}
                size="small"
                clickable
                onClick={() => navigate(`/tag/${encodeURIComponent(tag)}`)}
                sx={(th) => ({
                  borderRadius: 999,
                  fontWeight: 900,
                  bgcolor: alpha(th.palette.primary.main, th.palette.mode === 'dark' ? 0.12 : 0.08),
                })}
              />
            ))}
          </Stack>
        )}
      </Box>

      <Divider />

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 1.5, py: 1.1 }}>
        <Stack direction="row" gap={0.25} alignItems="center">
          <IconButton
            aria-label="like"
            onClick={() => onLike?.(post.id)}
          >
            {post?.likedByMe ? <FavoriteRoundedIcon /> : <FavoriteBorderRoundedIcon />}
          </IconButton>

          <IconButton
            aria-label="save"
            onClick={() => onSave?.(post.id)}
          >
            {post?.saved ? <BookmarkRoundedIcon /> : <BookmarkBorderRoundedIcon />}
          </IconButton>

          <IconButton
            aria-label="pin"
            onClick={() => onPin?.(post.id)}
          >
            {post?.pinned ? <PushPinRoundedIcon /> : <PushPinOutlinedIcon />}
          </IconButton>
        </Stack>

        <Button
          size="small"
          onClick={() => navigate(`/post/${post.id}`)}
          sx={{ borderRadius: 999, fontWeight: 900 }}
        >
          {t('نظر بده', 'Comment')}
        </Button>
      </Stack>

      <Dialog open={reportOpen} onClose={() => setReportOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 950 }}>{t('گزارش پست', 'Report post')}</DialogTitle>
        <DialogContent>
          <Typography sx={{ opacity: 0.8, fontWeight: 700, mb: 1 }}>
            {t('دلیل گزارش را بنویس (اختیاری):', 'Tell us why (optional):')}
          </Typography>
          <TextField
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
            placeholder={t('مثلا: اسپم، توهین، کلاه‌برداری...', 'e.g., spam, abuse, scam...')}
            fullWidth
            multiline
            minRows={3}
          />
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 2 }}>
          <Button onClick={() => setReportOpen(false)} sx={{ borderRadius: 999, fontWeight: 900 }}>
            {t('انصراف', 'Cancel')}
          </Button>
          <Button variant="contained" onClick={submitReport} sx={{ borderRadius: 999, fontWeight: 900 }}>
            {t('ثبت گزارش', 'Submit')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
