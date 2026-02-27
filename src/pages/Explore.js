import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  alpha,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import AppShell from '../components/layout/AppShell';
import PostCard from '../components/posts/PostCard';
import PostCardSkeleton from '../components/ui/PostCardSkeleton';
import EmptyState from '../components/ui/EmptyState';
import Reveal from '../components/ui/Reveal';
import UserCard from '../components/discovery/UserCard';
import TagCard from '../components/discovery/TagCard';
import { useToast } from '../context/ToastContext';
import { usePosts } from '../components/posts/usePosts';
import { useUi } from '../context/UiContext';
import { useAuth } from '../context/AuthContext';
import { useSocialGraph } from '../context/SocialGraphContext';
import { extractHashtags, extractMentions } from '../lib/text';

const DEMO_NAMES = { ashkan: 'Ashkan', sara: 'Sara', reza: 'Reza' };

export default function Explore() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { locale, searchQuery, setSearchQuery } = useUi();
  const { stats, isFollowing, toggleFollow, ensureUser, graph } = useSocialGraph();
  const toast = useToast();
  const { posts, isLoading, toggleLike, toggleSave, togglePin, addComment } = usePosts();

  const [q, setQ] = useState(searchQuery || '');
  const [tab, setTab] = useState(0); // 0 posts, 1 people, 2 tags

  const viewer = user?.username || 'ashkan';

  useEffect(() => setQ(searchQuery || ''), [searchQuery]);

  useEffect(() => {
    const t = setTimeout(() => setSearchQuery(q), 220);
    return () => clearTimeout(t);
  }, [q, setSearchQuery]);

  const handleShare = async (postId) => {
    const url = `${window.location.origin}/post/${postId}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.show(locale === 'fa' ? 'لینک کپی شد ✅' : 'Link copied ✅', 'success');
    } catch (e) {
      const ta = document.createElement('textarea');
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      toast.show(locale === 'fa' ? 'لینک کپی شد ✅' : 'Link copied ✅', 'success');
    }
  };

  const facets = useMemo(() => {
    const tags = new Map();
    const users = new Map();

    (posts || []).forEach((p) => {
      extractHashtags(p.content || '').forEach((h) => tags.set(h, (tags.get(h) || 0) + 1));

      const au = String(p?.author?.username || '').replace(/^@/, '');
      if (au) users.set(au, (users.get(au) || 0) + 1);

      extractMentions(p.content || '').forEach((m) => users.set(m, (users.get(m) || 0) + 1));
    });

    const tagEntries = Array.from(tags.entries()).sort((a, b) => b[1] - a[1]);
    const userEntries = Array.from(users.entries()).sort((a, b) => b[1] - a[1]);

    return {
      tagEntries,
      userEntries,
      tagsTop: tagEntries.slice(0, 12).map(([x]) => x),
      usersTop: userEntries.slice(0, 10).map(([x]) => x),
    };
  }, [posts]);

  const allUsers = useMemo(() => {
    const set = new Set();
    Object.keys(graph || {}).forEach((u) => set.add(u));
    facets.usersTop.forEach((u) => set.add(u));
    (posts || []).forEach((p) => {
      const au = String(p?.author?.username || '').replace(/^@/, '');
      if (au) set.add(au);
    });
    set.add(viewer);
    return Array.from(set).filter(Boolean);
  }, [graph, facets.usersTop, posts, viewer]);

  // make sure graph entries exist
  useEffect(() => {
    allUsers.forEach((u) => ensureUser(u));
  }, [allUsers, ensureUser]);

  const query = useMemo(() => String(q || '').trim(), [q]);
  const qLower = useMemo(() => query.toLowerCase(), [query]);

  const filteredPosts = useMemo(() => {
    let base = posts || [];
    if (!qLower) return base;

    // support @user and #tag quickly
    const normalized = qLower.replace(/^@/, '').replace(/^#/, '');
    return base.filter((p) => {
      const content = (p.content || '').toLowerCase();
      const author = (p.author?.name || p.author?.username || '').toLowerCase();
      return (
        content.includes(qLower) ||
        author.includes(qLower) ||
        content.includes(`#${normalized}`) ||
        content.includes(`@${normalized}`) ||
        author.includes(normalized)
      );
    });
  }, [posts, qLower]);

  const filteredUsers = useMemo(() => {
    const qq = qLower.replace(/^@/, '');
    if (!qq) return allUsers;
    return allUsers.filter((u) => {
      const name = (DEMO_NAMES[u] || u).toLowerCase();
      return u.toLowerCase().includes(qq) || name.includes(qq);
    });
  }, [allUsers, qLower]);

  const filteredTags = useMemo(() => {
    const qq = qLower.replace(/^#/, '');
    if (!qq) return facets.tagEntries.slice(0, 12);
    return facets.tagEntries.filter(([t]) => t.toLowerCase().includes(qq)).slice(0, 20);
  }, [facets.tagEntries, qLower]);

  const suggestions = useMemo(() => {
    const following = new Set((graph?.[viewer]?.following || []).filter(Boolean));
    const candidates = new Map();

    // 1) friends-of-friends
    (graph?.[viewer]?.following || []).forEach((f) => {
      (graph?.[f]?.following || []).forEach((x) => {
        if (!x || x === viewer || following.has(x)) return;
        candidates.set(x, (candidates.get(x) || 0) + 3);
      });
    });

    // 2) active users by presence in posts
    facets.usersTop.forEach((u, idx) => {
      if (!u || u === viewer || following.has(u)) return;
      candidates.set(u, (candidates.get(u) || 0) + Math.max(1, 6 - idx));
    });

    // 3) small boost if has many followers
    allUsers.forEach((u) => {
      if (!u || u === viewer || following.has(u)) return;
      const s = stats(u);
      candidates.set(u, (candidates.get(u) || 0) + Math.min(3, Math.floor((s.followers || 0) / 2)));
    });

    return Array.from(candidates.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([u]) => u);
  }, [graph, viewer, facets.usersTop, allUsers, stats]);

  const t = (fa, en) => (locale === 'fa' ? fa : en);

  return (
    <AppShell>
      <Stack gap={2}>
        <Card elevation={0} sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography sx={{ fontWeight: 980, mb: 1 }}>
              {t('کاوش', 'Discover')}
            </Typography>

            <TextField
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t('جستجو در پست‌ها، افراد و هشتگ‌ها…', 'Search posts, people, and tags…')}
              fullWidth
              InputProps={{
                startAdornment: (
                  <Box sx={{ display: 'flex', alignItems: 'center', pr: 1, opacity: 0.75 }}>
                    <SearchRoundedIcon />
                  </Box>
                ),
              }}
            />

            <Divider sx={{ my: 1.5 }} />

            <Stack direction={{ xs: 'column', md: 'row' }} gap={1.25} alignItems={{ md: 'center' }} justifyContent="space-between">
              <Tabs
                value={tab}
                onChange={(_, v) => setTab(v)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  minHeight: 0,
                  '& .MuiTab-root': { minHeight: 0, py: 1, fontWeight: 950 },
                }}
              >
                <Tab label={`${t('پست‌ها', 'Posts')} (${filteredPosts.length})`} />
                <Tab label={`${t('افراد', 'People')} (${filteredUsers.length})`} />
                <Tab label={`${t('هشتگ‌ها', 'Tags')} (${filteredTags.length})`} />
              </Tabs>

              <Stack direction="row" gap={1} flexWrap="wrap" sx={{ justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                {facets.tagsTop.slice(0, 6).map((tag) => (
                  <Chip
                    key={tag}
                    label={`#${tag}`}
                    size="small"
                    onClick={() => {
                      setQ(`#${tag}`);
                      navigate(`/tag/${encodeURIComponent(tag)}`);
                    }}
                    sx={(th) => ({
                      fontWeight: 900,
                      borderRadius: 999,
                      bgcolor: alpha(th.palette.primary.main, th.palette.mode === 'dark' ? 0.14 : 0.08),
                    })}
                  />
                ))}
                {facets.usersTop.slice(0, 3).map((u) => (
                  <Chip
                    key={u}
                    label={`@${u}`}
                    size="small"
                    onClick={() => setQ(`@${u}`)}
                    sx={(th) => ({
                      fontWeight: 900,
                      borderRadius: 999,
                      bgcolor: alpha(th.palette.secondary.main, th.palette.mode === 'dark' ? 0.14 : 0.08),
                    })}
                  />
                ))}
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        {/* Layout */}
        <Stack direction={{ xs: 'column', lg: 'row' }} gap={2} alignItems="flex-start">
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {isLoading ? (
              <Stack gap={2}>
                {[0, 1, 2].map((i) => (
                  <Reveal key={i} delay={i * 60}>
                    <PostCardSkeleton />
                  </Reveal>
                ))}
              </Stack>
            ) : tab === 0 ? (
              filteredPosts.length ? (
                <Stack gap={2}>
                  {filteredPosts.map((p, i) => (
                    <Reveal key={p.id} delay={i * 45}>
                      <PostCard
                        post={p}
                        onPin={togglePin}
                        onShare={handleShare}
                        onLike={() => toggleLike(p.id)}
                        onSave={() => toggleSave(p.id)}
                        onTag={(tag) => navigate(`/tag/${encodeURIComponent(tag)}`)}
                        onComment={(id, text) => addComment(id, text)}
                      />
                    </Reveal>
                  ))}
                </Stack>
              ) : (
                <EmptyState
                  icon={<SearchRoundedIcon />}
                  title={t('چیزی پیدا نشد', 'Nothing found')}
                  subtitle={t('کلیدواژه دیگری امتحان کن.', 'Try a different keyword.')}
                />
              )
            ) : tab === 1 ? (
              filteredUsers.length ? (
                <Stack gap={1.25}>
                  {filteredUsers.slice(0, 20).map((u) => {
                    const s = stats(u);
                    const following = isFollowing(viewer, u);
                    return (
                      <Reveal key={u} delay={40}>
                        <UserCard
                          username={u}
                          displayName={DEMO_NAMES[u] || u}
                          subtitle={t(`${s.followers} دنبال‌کننده`, `${s.followers} followers`)}
                          actionLabel={u === viewer ? t('خودت', 'You') : following ? t('دنبال می‌کنی', 'Following') : t('دنبال کردن', 'Follow')}
                          isFollowing={following}
                          onAction={u === viewer ? null : () => toggleFollow(viewer, u)}
                        />
                      </Reveal>
                    );
                  })}
                </Stack>
              ) : (
                <EmptyState
                  icon={<SearchRoundedIcon />}
                  title={t('کسی پیدا نشد', 'No users found')}
                  subtitle={t('نام کاربری دیگری امتحان کن.', 'Try a different username.')}
                />
              )
            ) : (
              filteredTags.length ? (
                <Stack gap={1.25}>
                  {filteredTags.map(([tag, count]) => (
                    <Reveal key={tag} delay={35}>
                      <TagCard tag={tag} count={count} />
                    </Reveal>
                  ))}
                </Stack>
              ) : (
                <EmptyState
                  icon={<SearchRoundedIcon />}
                  title={t('هشتگی پیدا نشد', 'No tags found')}
                  subtitle={t('کلیدواژه دیگری امتحان کن.', 'Try a different keyword.')}
                />
              )
            )}
          </Box>

          {/* Right rail */}
          <Box sx={{ width: { xs: '100%', lg: 360 }, position: { lg: 'sticky' }, top: { lg: 84 } }}>
            <Stack gap={2}>
              <Card elevation={0} sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Typography sx={{ fontWeight: 980, mb: 1 }}>{t('ترندها', 'Trending')}</Typography>
                  <Stack gap={1}>
                    {facets.tagEntries.slice(0, 6).map(([tag, count]) => (
                      <Chip
                        key={tag}
                        label={`#${tag} • ${locale === 'fa' ? `${count} پست` : `${count} posts`}`}
                        onClick={() => navigate(`/tag/${encodeURIComponent(tag)}`)}
                        sx={(th) => ({
                          justifyContent: 'flex-start',
                          borderRadius: 2.5,
                          fontWeight: 900,
                          bgcolor: alpha(th.palette.primary.main, th.palette.mode === 'dark' ? 0.12 : 0.07),
                        })}
                      />
                    ))}
                  </Stack>
                </CardContent>
              </Card>

              <Card elevation={0} sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Typography sx={{ fontWeight: 980, mb: 1 }}>{t('پیشنهاد دنبال‌کردن', 'Suggested to follow')}</Typography>
                  <Stack gap={1.25}>
                    {suggestions.length ? (
                      suggestions.map((u) => {
                        const s = stats(u);
                        const following = isFollowing(viewer, u);
                        return (
                          <UserCard
                            key={u}
                            username={u}
                            displayName={DEMO_NAMES[u] || u}
                            subtitle={t(`${s.followers} دنبال‌کننده`, `${s.followers} followers`)}
                            actionLabel={following ? t('دنبال می‌کنی', 'Following') : t('دنبال کردن', 'Follow')}
                            isFollowing={following}
                            onAction={() => toggleFollow(viewer, u)}
                          />
                        );
                      })
                    ) : (
                      <Typography variant="body2" sx={{ opacity: 0.78, fontWeight: 800 }}>
                        {t('فعلاً پیشنهادی نداریم.', 'No suggestions yet.')}
                      </Typography>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Box>
        </Stack>
      </Stack>
    </AppShell>
  );
}
