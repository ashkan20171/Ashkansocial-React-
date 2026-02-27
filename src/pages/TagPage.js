import React, { useMemo } from 'react';
import { Button, Card, CardContent, Chip, Divider, Stack, Typography } from '@mui/material';
import AppShell from '../components/layout/AppShell';
import PostCard from '../components/posts/PostCard';
import Reveal from '../components/ui/Reveal';
import { usePosts } from '../context/PostsContext';
import { useParams, useNavigate } from 'react-router-dom';
import { useUi } from '../context/UiContext';

export default function TagPage() {
  const { tag } = useParams();
  const navigate = useNavigate();
  const { locale } = useUi();
  const { posts, toggleLike, toggleSave, addComment } = usePosts();

  const normalized = (tag || '').replace(/^#/, '').toLowerCase();

  const filtered = useMemo(() => {
    const t = normalized;
    if (!t) return [];
    const rx = new RegExp(`#${t}(?![\p{L}0-9_])`, 'iu');
    return posts.filter((p) => rx.test(p.content || ''));
  }, [posts, normalized]);

  const related = useMemo(() => {
    // lightweight related tags from matched posts
    const tags = new Map();
    filtered.forEach((p) => {
      const m = (p.content || '').match(/#[\p{L}0-9_]+/gu) || [];
      m.forEach((x) => {
        const k = x.replace('#','').toLowerCase();
        if (k !== normalized) tags.set(k, (tags.get(k) || 0) + 1);
      });
    });
    return Array.from(tags.entries()).sort((a,b)=>b[1]-a[1]).slice(0,10).map(([k])=>k);
  }, [filtered, normalized]);

  return (
    <AppShell>
      <Stack gap={2}>
        <Card elevation={0} sx={{ borderRadius: 3 }}>
          <CardContent>
            <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
              <Stack>
                <Typography variant="h6" sx={{ fontWeight: 950 }}>
                  #{normalized || (locale === 'fa' ? 'هشتگ' : 'tag')}
                </Typography>
                <Typography sx={{ opacity: 0.75, fontWeight: 700 }}>
                  {locale === 'fa'
                    ? `${filtered.length} پست`
                    : `${filtered.length} posts`}
                </Typography>
              </Stack>
              <Button
                variant="outlined"
                sx={{ borderRadius: 999, fontWeight: 900 }}
                onClick={() => navigate('/explore')}
              >
                {locale === 'fa' ? 'کاوش' : 'Explore'}
              </Button>
            </Stack>

            {related.length ? (
              <>
                <Divider sx={{ my: 1.5 }} />
                <Stack direction="row" gap={1} flexWrap="wrap">
                  {related.map((t) => (
                    <Chip
                      key={t}
                      label={`#${t}`}
                      onClick={() => navigate(`/tag/${encodeURIComponent(t)}`)}
                      variant="outlined"
                      sx={{ fontWeight: 850 }}
                    />
                  ))}
                </Stack>
              </>
            ) : null}
          </CardContent>
        </Card>

        <Stack gap={2}>
          {filtered.length ? (
            filtered.map((p, i) => (
              <Reveal key={p.id} delay={i * 60}>
                <PostCard
                post={p}
                onLike={toggleLike}
                onSave={toggleSave}
                onComment={addComment}
              />
              </Reveal>
            ))
          ) : (
            <Card elevation={0} sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography sx={{ fontWeight: 900, opacity: 0.85 }}>
                  {locale === 'fa' ? 'پستی برای این هشتگ پیدا نشد.' : 'No posts for this tag.'}
                </Typography>
              </CardContent>
            </Card>
          )}
        </Stack>
      </Stack>
    </AppShell>
  );
}
