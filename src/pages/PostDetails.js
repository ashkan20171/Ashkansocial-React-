import React, { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Stack,
  TextField,
  Typography,
  alpha,
} from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import ShareRoundedIcon from '@mui/icons-material/ShareRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';

import { useParams, useNavigate } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import PostCard from '../components/posts/PostCard';
import CommentsThread from '../components/posts/CommentsThread';
import CommentComposer from '../components/posts/CommentComposer';
import { usePosts } from '../context/PostsContext';
import { useUi } from '../context/UiContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

export default function PostDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { locale } = useUi();
  const { user } = useAuth();

  const {
    posts,
    toggleLike,
    toggleSave,
    togglePin,
    addComment,
    toggleCommentLike,
    editComment,
    deleteComment,
    deletePost,
    editPost,
  } = usePosts();

  const post = useMemo(() => posts.find((p) => p.id === id), [posts, id]);

  const [shareOpen, setShareOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [draftContent, setDraftContent] = useState('');
  const [draftImage, setDraftImage] = useState('');

  const t = (fa, en) => (locale === 'fa' ? fa : en);

  const handleShare = async (postId) => {
    const url = `${window.location.origin}/post/${postId}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.show(t('لینک کپی شد ✅', 'Link copied ✅'), 'success');
    } catch (e) {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      toast.show(t('لینک کپی شد ✅', 'Link copied ✅'), 'success');
    }
  };

  if (!post) {
    return (
      <AppShell>
        <Card elevation={0} sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography sx={{ fontWeight: 900 }}>{t('پست پیدا نشد.', 'Post not found.')}</Typography>
            <Button sx={{ mt: 2, borderRadius: 999, fontWeight: 900 }} onClick={() => navigate('/')}>
              {t('بازگشت', 'Back')}
            </Button>
          </CardContent>
        </Card>
      </AppShell>
    );
  }

  const isMine = (user?.username && post.author?.username) ? user.username === post.author.username : false;

  return (
    <AppShell>
      <Stack gap={2.25}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
          <Stack direction="row" alignItems="center" gap={1}>
            <IconButton onClick={() => navigate(-1)}>
              <ArrowBackRoundedIcon />
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: 950 }}>
              {t('جزئیات پست', 'Post details')}
            </Typography>
          </Stack>

          <Stack direction="row" gap={0.5}>
            <IconButton onClick={() => setShareOpen(true)} aria-label="share">
              <ShareRoundedIcon />
            </IconButton>

            {isMine ? (
              <>
                <IconButton
                  onClick={() => {
                    setDraftContent(post.content || '');
                    setDraftImage(post.image || '');
                    setEditOpen(true);
                  }}
                  aria-label="edit"
                >
                  <EditRoundedIcon />
                </IconButton>
                <IconButton
                  onClick={() => {
                    deletePost(post.id);
                    toast.show(t('حذف شد.', 'Deleted.'), 'success');
                    navigate('/');
                  }}
                  aria-label="delete"
                >
                  <DeleteRoundedIcon />
                </IconButton>
              </>
            ) : null}
          </Stack>
        </Stack>

        <PostCard
          post={post}
          onPin={togglePin}
          onShare={handleShare}
          onLike={toggleLike}
          onSave={toggleSave}
          onComment={addComment}
        />

        <Card elevation={0} sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 2.25 }}>
            <Typography sx={{ fontWeight: 950, mb: 1 }}>{t('همه نظرات', 'All comments')}</Typography>

            <CommentComposer
              onSubmit={(text) => {
                addComment(post.id, { text, parentId: null, author: user || null });
              }}
            />

            <Divider sx={{ my: 1.25 }} />

            <CommentsThread
              comments={post.comments || []}
              currentUser={user}
              onToggleLike={(commentId) => toggleCommentLike(post.id, commentId)}
              onReply={(parentId, text) => addComment(post.id, { text, parentId, author: user || null })}
              onEdit={(commentId, text) => editComment(post.id, commentId, text)}
              onDelete={(commentId) => deleteComment(post.id, commentId)}
            />
          </CardContent>
        </Card>

        {/* Share dialog */}
        <Dialog open={shareOpen} onClose={() => setShareOpen(false)} fullWidth maxWidth="sm">
          <DialogTitle sx={{ fontWeight: 950 }}>{t('اشتراک‌گذاری', 'Share')}</DialogTitle>
          <DialogContent>
            <Typography sx={{ opacity: 0.8, fontWeight: 650, mb: 1 }}>
              {t('لینک این پست را کپی کنید:', 'Copy the link to this post:')}
            </Typography>
            <Card
              elevation={0}
              sx={(th) => ({ borderRadius: 2.5, border: '1px solid', borderColor: th.palette.divider })}
            >
              <CardContent sx={{ p: 1.5 }}>
                <Typography sx={{ fontFamily: 'monospace', fontSize: 13, wordBreak: 'break-all' }}>
                  {`${window.location.origin}/post/${post.id}`}
                </Typography>
              </CardContent>
            </Card>
          </DialogContent>
          <DialogActions sx={{ p: 2, pt: 0 }}>
            <Button sx={{ borderRadius: 999, fontWeight: 900 }} onClick={() => setShareOpen(false)}>
              {t('بستن', 'Close')}
            </Button>
            <Button
              variant="contained"
              startIcon={<ContentCopyRoundedIcon />}
              sx={{ borderRadius: 999, fontWeight: 950 }}
              onClick={() => handleShare(post.id)}
            >
              {t('کپی لینک', 'Copy link')}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit dialog */}
        <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="sm">
          <DialogTitle sx={{ fontWeight: 950 }}>{t('ویرایش پست', 'Edit post')}</DialogTitle>
          <DialogContent>
            <Stack gap={1.25} sx={{ mt: 1 }}>
              <TextField
                value={draftContent}
                onChange={(e) => setDraftContent(e.target.value)}
                label={t('متن پست', 'Content')}
                fullWidth
                multiline
                minRows={4}
              />
              <TextField
                value={draftImage}
                onChange={(e) => setDraftImage(e.target.value)}
                label={t('لینک تصویر (اختیاری)', 'Image URL (optional)')}
                fullWidth
              />
              {draftImage ? (
                <Box
                  component="img"
                  src={draftImage}
                  alt="preview"
                  sx={(th) => ({
                    mt: 0.5,
                    width: '100%',
                    height: 220,
                    objectFit: 'cover',
                    borderRadius: 2.5,
                    border: '1px solid',
                    borderColor: th.palette.divider,
                    boxShadow: th.palette.mode === 'dark' ? '0 16px 44px rgba(0,0,0,0.35)' : '0 16px 44px rgba(2,6,23,0.12)',
                  })}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                  onLoad={(e) => {
                    e.currentTarget.style.display = 'block';
                  }}
                />
              ) : null}
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2, pt: 0 }}>
            <Button sx={{ borderRadius: 999, fontWeight: 900 }} onClick={() => setEditOpen(false)}>
              {t('انصراف', 'Cancel')}
            </Button>
            <Button
              variant="contained"
              sx={{ borderRadius: 999, fontWeight: 950 }}
              onClick={() => {
                const c = (draftContent || '').trim();
                if (!c) {
                  toast.show(t('متن خالی است.', 'Content is empty.'), 'warning');
                  return;
                }
                editPost(post.id, { content: draftContent, image: draftImage });
                toast.show(t('ذخیره شد.', 'Saved.'), 'success');
                setEditOpen(false);
              }}
            >
              {t('ذخیره', 'Save')}
            </Button>
          </DialogActions>
        </Dialog>
      </Stack>
    </AppShell>
  );
}
