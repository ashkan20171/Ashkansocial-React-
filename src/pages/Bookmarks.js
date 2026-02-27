import React, { useMemo } from 'react';
import { Stack, Typography } from '@mui/material';
import AppShell from '../components/layout/AppShell';
import PostCard from '../components/posts/PostCard';
import PostCardSkeleton from '../components/ui/PostCardSkeleton';
import EmptyState from '../components/ui/EmptyState';
import Reveal from '../components/ui/Reveal';
import BookmarkRoundedIcon from '@mui/icons-material/BookmarkRounded';
import { usePosts } from '../components/posts/usePosts';
import { useUi } from '../context/UiContext';

export default function Bookmarks() {
  const { locale } = useUi();
  const { posts, isLoading, toggleLike, toggleSave, addComment } = usePosts();

  const saved = useMemo(() => posts.filter((p) => p.saved), [posts]);

  return (
    <AppShell>
      <Stack gap={2}>
        <Typography variant="h6" sx={{ fontWeight: 900, px: 1 }}>
          {locale === 'fa' ? 'نشان‌شده‌ها' : 'Bookmarks'}
        </Typography>

        {isLoading ? (
          <Stack gap={2}>
            {[0,1].map((i)=> <PostCardSkeleton key={i} />)}
          </Stack>
        ) : saved.length ? (
          <Stack gap={2}>
            {saved.map((p, i) => (
              <Reveal key={p.id} delay={i * 60}>
                <PostCard
                  post={p}
                  onLike={toggleLike}
                  onSave={toggleSave}
                  onComment={addComment}
                />
              </Reveal>
            ))}
          </Stack>
        ) : (
          <EmptyState
            icon={<BookmarkRoundedIcon />}
            title={locale === 'fa' ? 'هنوز چیزی ذخیره نکردی' : 'No bookmarks yet'}
            subtitle={locale === 'fa' ? 'پست‌های مورد علاقه‌ات رو نشان کن تا بعداً راحت پیداشون کنی.' : 'Save your favorite posts to find them later.'}
          />
        )}
      </Stack>
    </AppShell>
  );
}
