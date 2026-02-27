import React, { useMemo, useState } from 'react';
import { Avatar, Box, Button, IconButton, Stack, Typography, alpha } from '@mui/material';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import ReplyRoundedIcon from '@mui/icons-material/ReplyRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { useUi } from '../../context/UiContext';
import CommentComposer from './CommentComposer';

function timeAgo(ts, locale) {
  const diff = Date.now() - (ts || Date.now());
  const mins = Math.max(0, Math.floor(diff / 60000));
  if (mins < 1) return locale === 'fa' ? 'اکنون' : 'now';
  if (mins < 60) return locale === 'fa' ? `${mins} دقیقه` : `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return locale === 'fa' ? `${hrs} ساعت` : `${hrs}h`;
  const days = Math.floor(hrs / 24);
  return locale === 'fa' ? `${days} روز` : `${days}d`;
}

export default function CommentItem({
  comment,
  depth = 0,
  canDelete = false,
  onToggleLike,
  onReply,
  onEdit,
  onDelete,
  children,
}) {
  const { locale } = useUi();
  const [replyOpen, setReplyOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const displayName = comment?.author?.name || comment?.author?.username || (locale === 'fa' ? 'کاربر' : 'User');
  const username = comment?.author?.username ? `@${comment.author.username}` : '';

  const bubble = useMemo(
    () => ({
      borderRadius: 2.75,
      border: '1px solid',
      borderColor: 'divider',
      bgcolor: (th) => alpha(th.palette.background.paper, th.palette.mode === 'dark' ? 0.35 : 0.7),
      p: 1.25,
    }),
    []
  );

  return (
    <Stack gap={1} sx={{ pl: depth ? { xs: 0, sm: Math.min(depth * 2.5, 9) } : 0 }}>
      <Stack direction="row" gap={1.25} alignItems="flex-start">
        <Avatar sx={{ width: 34, height: 34, fontWeight: 900 }}>
          {(displayName || 'U').slice(0, 1).toUpperCase()}
        </Avatar>

        <Box sx={{ flex: 1 }}>
          <Box sx={bubble}>
            <Stack direction="row" alignItems="baseline" justifyContent="space-between" gap={1}>
              <Stack direction="row" gap={1} alignItems="baseline" sx={{ minWidth: 0, flexWrap: 'wrap' }}>
                <Typography sx={{ fontWeight: 950, lineHeight: 1.1 }}>{displayName}</Typography>
                {username ? (
                  <Typography sx={{ opacity: 0.65, fontWeight: 750, fontSize: 12 }}>{username}</Typography>
                ) : null}
                <Typography sx={{ opacity: 0.6, fontWeight: 750, fontSize: 12 }}>
                  • {timeAgo(comment?.createdAt, locale)}
                </Typography>
              </Stack>

              {canDelete ? (
                <Stack direction="row" gap={0.25} alignItems="center">
                  <IconButton
                    size="small"
                    onClick={() => setEditOpen((s) => !s)}
                    aria-label={locale === 'fa' ? 'ویرایش' : 'Edit'}
                  >
                    <EditRoundedIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => onDelete?.(comment.id)}
                    aria-label={locale === 'fa' ? 'حذف' : 'Delete'}
                  >
                    <DeleteRoundedIcon fontSize="small" />
                  </IconButton>
                </Stack>
              ) : null}
            </Stack>

            {!editOpen ? (
              <Typography sx={{ mt: 0.5, fontWeight: 750, whiteSpace: 'pre-wrap' }}>{comment?.text}</Typography>
            ) : (
              <Box sx={{ mt: 1 }}>
                <CommentComposer
                  compact
                  autoFocus
                  initialValue={comment?.text || ''}
                  placeholder={locale === 'fa' ? 'ویرایش نظر…' : 'Edit comment…'}
                  onSubmit={(t) => {
                    onEdit?.(comment.id, t);
                    setEditOpen(false);
                  }}
                  onCancel={() => setEditOpen(false)}
                />
              </Box>
            )}
          </Box>

          <Stack direction="row" alignItems="center" gap={0.5} sx={{ mt: 0.6 }}>
            <Button
              size="small"
              startIcon={comment?.likedByMe ? <FavoriteRoundedIcon /> : <FavoriteBorderRoundedIcon />}
              sx={{ borderRadius: 999, fontWeight: 900 }}
              onClick={() => onToggleLike?.(comment.id)}
            >
              {locale === 'fa' ? 'لایک' : 'Like'} {comment?.likes ? `(${comment.likes})` : ''}
            </Button>

            <Button
              size="small"
              startIcon={<ReplyRoundedIcon />}
              sx={{ borderRadius: 999, fontWeight: 900 }}
              onClick={() => setReplyOpen((s) => !s)}
            >
              {locale === 'fa' ? 'پاسخ' : 'Reply'}
            </Button>
          </Stack>

          {replyOpen ? (
            <Box sx={{ mt: 1 }}>
              <CommentComposer
                compact
                autoFocus
                placeholder={locale === 'fa' ? 'پاسخ…' : 'Write a reply…'}
                onSubmit={(t) => {
                  onReply?.(comment.id, t);
                  setReplyOpen(false);
                }}
                onCancel={() => setReplyOpen(false)}
              />
            </Box>
          ) : null}

          {children ? <Box sx={{ mt: 1 }}>{children}</Box> : null}
        </Box>
      </Stack>
    </Stack>
  );
}
