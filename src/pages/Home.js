import React, { useMemo, useState } from 'react';
import { Stack, Typography } from '@mui/material';
import AppShell from '../components/layout/AppShell';
import PostComposer from '../components/posts/PostComposer';
import PostCard from '../components/posts/PostCard';
import PostCardSkeleton from '../components/ui/PostCardSkeleton';
import EmptyState from '../components/ui/EmptyState';
import Reveal from '../components/ui/Reveal';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { usePosts } from '../components/posts/usePosts';
import { useAuth } from '../context/AuthContext';
import { useUi } from '../context/UiContext';
import { t } from '../lib/i18n';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

export default function Home() {
  const { user } = useAuth();
  const { locale } = useUi();
  const toast = useToast();
  const navigate = useNavigate();
  const { posts, isLoading, addPost, toggleLike, toggleSave, togglePin, addComment } = usePosts();
  const [query, setQuery] = useState('');

  const handleShare = async (postId) => {
    const url = `${window.location.origin}/post/${postId}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.show(locale === 'fa' ? 'لینک کپی شد ✅' : 'Link copied ✅', 'success');
    } catch (e) {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      toast.show(locale === 'fa' ? 'لینک کپی شد ✅' : 'Link copied ✅', 'success');
    }
  };


  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter((p) => {
      const hay = `${p.content} ${p.author?.name} ${p.author?.username}`.toLowerCase();
      return hay.includes(q);
    });
  }, [posts, query]);

  return (
    <AppShell onSearch={setQuery}>
      <Stack gap={2}>
        <PostComposer
          onSubmit={({ content, image }) => {
            addPost({
              author: { name: user?.name || 'Ashkan', username: user?.username || 'ashkan' },
              content,
              image,
            });
            toast.show(locale === 'fa' ? 'پست با موفقیت ارسال شد' : 'Posted successfully', 'success');
          }}
        />


        {isLoading ? (
          <Stack gap={2}>
            {Array.from({ length: 3 }).map((_, i) => (
              <Reveal key={i} delay={i * 60}>
                <PostCardSkeleton />
              </Reveal>
            ))}
          </Stack>
        ) : (
        (filtered.length ? (
          <Stack gap={2}>
            {filtered.map((p, i) => (
              <Reveal key={p.id} delay={i * 60}>
                <PostCard
                  post={p}
                  onLike={(id) => {
                    toggleLike(id);
                  }}
                  onSave={(id) => {
                    toggleSave(id);
                    toast.show(locale === 'fa' ? 'ذخیره شد' : 'Saved', 'info');
                  }}
                  onComment={(id, text) => {
                    addComment(id, { text, parentId: null, author: { name: user?.name || 'Ashkan', username: user?.username || 'ashkan' } });
                  }}
                />
              </Reveal>
            ))}
          </Stack>
        ) : (
          <Typography sx={{ opacity: 0.75, fontWeight: 800, px: 1 }}>
            {t(locale, 'emptyFeed')}
          </Typography>
        ))
        )}
      </Stack>
    </AppShell>
  );
}
