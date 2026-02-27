import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Skeleton,
  Stack,
  Tab,
  Tabs,
  Typography,
  alpha,
} from '@mui/material';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import PhotoCameraRoundedIcon from '@mui/icons-material/PhotoCameraRounded';
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useUi } from '../../context/UiContext';
import { usePosts } from '../../context/PostsContext';
import { useSocialGraph } from '../../context/SocialGraphContext';
import { readProfile, writeProfile, getInitials } from '../../lib/profile';
import Reveal from '../ui/Reveal';
import PostCard from '../posts/PostCard';

function isVerified(username) {
  return ['ashkan', 'sara'].includes((username || '').toLowerCase());
}

function Stat({ label, value }) {
  return (
    <Stack sx={{ minWidth: 92 }}>
      <Typography sx={{ fontWeight: 950, fontSize: 18 }}>{value}</Typography>
      <Typography variant="caption" sx={{ opacity: 0.75, fontWeight: 800 }}>
        {label}
      </Typography>
    </Stack>
  );
}

export default function ProfileView({ username }) {
  const { user } = useAuth();
  const { locale } = useUi();
  const { posts, isLoading, toggleLike, toggleSave, addComment, togglePin } = usePosts();
  const { ensureUser, stats, isFollowing, toggleFollow } = useSocialGraph();
  const navigate = useNavigate();

  const viewer = user?.username || 'ashkan';
  const target = username || viewer;
  const self = viewer === target;

  const [tab, setTab] = useState(0);
  const [busy, setBusy] = useState(false);

  const coverInputRef = useRef(null);
  const avatarInputRef = useRef(null);

  // profile storage (cover/avatar/bio)
  const [profile, setProfile] = useState(() => {
    const base =
      readProfile(target, null) || {
        cover:
          'https://images.unsplash.com/photo-1519682577862-22b62b24e493?auto=format&fit=crop&w=1800&q=60',
        avatar: '',
        bio:
          locale === 'fa'
            ? 'یک بیو کوتاه بنویس تا پروفایلت حرفه‌ای‌تر بشه.'
            : 'Add a short bio to make your profile feel premium.',
      };
    return base;
  });

  useEffect(() => {
    ensureUser(target);
    const stored = readProfile(target, null);
    if (stored) setProfile(stored);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  const mine = useMemo(() => posts.filter((p) => p.author?.username === target), [posts, target]);
  const saved = useMemo(() => posts.filter((p) => p.saved), [posts]);
  const liked = useMemo(() => posts.filter((p) => p.likedByMe), [posts]);
  const media = useMemo(() => mine.filter((p) => !!p.image), [mine]);

  const stat = stats(target);

  const displayName = useMemo(() => {
    if (self) return user?.name || 'You';
    // basic demo mapping
    if (target === 'ashkan') return 'Ashkan';
    if (target === 'sara') return 'Sara';
    if (target === 'reza') return 'Reza';
    return target;
  }, [self, user, target]);

  const initials = getInitials(displayName);

  const follow = isFollowing(viewer, target);

  const handlePick = async (file, type) => {
    if (!file) return;
    if (!file.type?.startsWith('image/')) return;

    setBusy(true);
    try {
      const reader = new FileReader();
      const dataUrl = await new Promise((res, rej) => {
        reader.onerror = () => rej(new Error('read failed'));
        reader.onload = () => res(reader.result);
        reader.readAsDataURL(file);
      });

      const next = { ...profile, [type]: dataUrl };
      setProfile(next);
      writeProfile(target, next);
    } finally {
      setBusy(false);
    }
  };

  const t = (fa, en) => (locale === 'fa' ? fa : en);

  return (
    <Stack gap={2.25}>
      {/* Cover + sticky header */}
      <Card elevation={0} sx={{ borderRadius: 4, overflow: 'hidden' }}>
        <Box
          sx={(th) => ({
            height: { xs: 180, md: 220 },
            position: 'relative',
            backgroundImage: `url(${profile.cover})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            '&:after': {
              content: '""',
              position: 'absolute',
              inset: 0,
              background:
                th.palette.mode === 'dark'
                  ? 'linear-gradient(180deg, rgba(2,6,23,0.1), rgba(2,6,23,0.65))'
                  : 'linear-gradient(180deg, rgba(2,6,23,0.05), rgba(2,6,23,0.5))',
            },
          })}
        >
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'flex-end',
              p: 2,
              zIndex: 2,
              gap: 1,
            }}
          >
            {self ? (
              <>
                <input
                  ref={coverInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => handlePick(e.target.files?.[0], 'cover')}
                />
                <Button
                  disabled={busy}
                  onClick={() => coverInputRef.current?.click()}
                  variant="contained"
                  size="small"
                  startIcon={<PhotoCameraRoundedIcon />}
                  sx={(th) => ({
                    borderRadius: 999,
                    fontWeight: 900,
                    bgcolor: alpha(th.palette.common.white, th.palette.mode === 'dark' ? 0.16 : 0.18),
                    color: th.palette.common.white,
                    backdropFilter: 'blur(10px)',
                    '&:hover': { bgcolor: alpha(th.palette.common.white, th.palette.mode === 'dark' ? 0.22 : 0.24) },
                  })}
                >
                  {t('کاور', 'Cover')}
                </Button>
              </>
            ) : null}
          </Box>

          <Box
            sx={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 2,
              p: { xs: 2, md: 2.5 },
            }}
          >
            <Stack direction="row" alignItems="flex-end" justifyContent="space-between" gap={2}>
              <Stack direction="row" gap={1.5} alignItems="flex-end">
                <Box sx={{ position: 'relative' }}>
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => handlePick(e.target.files?.[0], 'avatar')}
                  />
                  <Avatar
                    src={profile.avatar || ''}
                    sx={(th) => ({
                      width: { xs: 84, md: 104 },
                      height: { xs: 84, md: 104 },
                      border: `3px solid ${alpha(th.palette.common.white, th.palette.mode === 'dark' ? 0.28 : 0.85)}`,
                      bgcolor: 'primary.main',
                      fontWeight: 950,
                      fontSize: 30,
                      boxShadow: th.palette.mode === 'dark' ? '0 18px 44px rgba(0,0,0,0.55)' : '0 18px 44px rgba(2,6,23,0.25)',
                    })}
                  >
                    {initials}
                  </Avatar>

                  {self ? (
                    <Button
                      disabled={busy}
                      onClick={() => avatarInputRef.current?.click()}
                      size="small"
                      variant="contained"
                      sx={(th) => ({
                        position: 'absolute',
                        bottom: -10,
                        right: -10,
                        minWidth: 0,
                        width: 38,
                        height: 38,
                        borderRadius: 999,
                        p: 0,
                        bgcolor: th.palette.mode === 'dark' ? 'rgba(2,6,23,0.65)' : 'rgba(255,255,255,0.78)',
                        color: th.palette.mode === 'dark' ? 'white' : 'rgba(2,6,23,0.9)',
                        backdropFilter: 'blur(10px)',
                        boxShadow: th.palette.mode === 'dark' ? '0 10px 26px rgba(0,0,0,0.55)' : '0 10px 26px rgba(2,6,23,0.20)',
                        '&:hover': { bgcolor: th.palette.mode === 'dark' ? 'rgba(2,6,23,0.78)' : 'rgba(255,255,255,0.92)' },
                      })}
                    >
                      <PhotoCameraRoundedIcon fontSize="small" />
                    </Button>
                  ) : null}
                </Box>

                <Box sx={{ pb: 0.75 }}>
                  <Stack direction="row" alignItems="center" gap={1}>
                    <Typography sx={{ fontWeight: 980, color: 'common.white', fontSize: { xs: 20, md: 24 } }}>
                      {displayName}
                    </Typography>
                    {isVerified(target) ? (
                      <Chip
                        icon={<VerifiedRoundedIcon />}
                        label={t('تایید شده', 'Verified')}
                        size="small"
                        sx={(th) => ({
                          borderRadius: 999,
                          fontWeight: 900,
                          color: 'common.white',
                          bgcolor: alpha(th.palette.primary.main, 0.32),
                          backdropFilter: 'blur(10px)',
                          '& .MuiChip-icon': { color: 'common.white' },
                        })}
                      />
                    ) : null}
                  </Stack>
                  <Typography sx={{ opacity: 0.9, fontWeight: 800, color: alpha('#fff', 0.9) }}>
                    @{target}
                  </Typography>
                </Box>
              </Stack>

              <Stack direction="row" gap={1} alignItems="center" sx={{ pb: 0.75 }}>
                {self ? (
                  <Button
                    variant="outlined"
                    startIcon={<EditRoundedIcon />}
                    sx={(th) => ({
                      borderRadius: 999,
                      px: 2,
                      fontWeight: 950,
                      color: 'common.white',
                      borderColor: alpha('#fff', 0.42),
                      bgcolor: alpha('#000', 0.18),
                      backdropFilter: 'blur(10px)',
                      '&:hover': { borderColor: alpha('#fff', 0.62), bgcolor: alpha('#000', 0.26) },
                    })}
                    href="/edit-profile"
                  >
                    {t('ویرایش', 'Edit')}
                  </Button>
                ) : (
                  <>
                    <Button
                      variant={follow ? 'outlined' : 'contained'}
                      color={follow ? 'secondary' : 'primary'}
                      onClick={() => toggleFollow(viewer, target)}
                      sx={(th) => ({
                        borderRadius: 999,
                        px: 2,
                        fontWeight: 980,
                        ...(follow
                          ? {
                              borderColor: alpha(th.palette.secondary.main, 0.6),
                              bgcolor: alpha(th.palette.secondary.main, th.palette.mode === 'dark' ? 0.16 : 0.08),
                            }
                          : {}),
                      })}
                    >
                      {t(follow ? 'دنبال می‌کنی' : 'دنبال کردن', follow ? 'Following' : 'Follow')}
                    </Button>

                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => navigate(`/messages?to=${target}`)}
                      sx={(th) => ({
                        borderRadius: 999,
                        px: 2,
                        fontWeight: 980,
                        borderColor: alpha(th.palette.primary.main, th.palette.mode === 'dark' ? 0.5 : 0.45),
                      })}
                    >
                      {t('پیام', 'Message')}
                    </Button>
                  </>
                )}
              </Stack>
            </Stack>
          </Box>
        </Box>

        <CardContent sx={{ pt: 2.25 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={7}>
              {isLoading ? (
                <Stack gap={1}>
                  <Skeleton variant="text" width="55%" />
                  <Skeleton variant="text" width="85%" />
                </Stack>
              ) : (
                <Typography sx={{ opacity: 0.9, fontWeight: 650 }}>
                  {profile.bio || t('بیو', 'Bio')}
                </Typography>
              )}
            </Grid>

            <Grid item xs={12} md={5}>
              <Stack direction="row" justifyContent={{ xs: 'flex-start', md: 'flex-end' }} gap={2}>
                <Stat label={t('پست‌ها', 'Posts')} value={mine.length} />
                <Stat label={t('دنبال‌کننده', 'Followers')} value={stat.followers} />
                <Stat label={t('دنبال‌شونده', 'Following')} value={stat.following} />
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card elevation={0} sx={{ borderRadius: 4 }}>
        <CardContent sx={{ pb: 1 }}>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ minHeight: 0, '& .MuiTab-root': { fontWeight: 950, minHeight: 0, py: 1 } }}
          >
            <Tab label={t('پست‌ها', 'Posts')} />
            <Tab label={t('مدیا', 'Media')} />
            <Tab label={t('ذخیره‌شده', 'Saved')} />
            <Tab label={t('لایک‌شده', 'Liked')} />
          </Tabs>
          <Divider sx={{ mt: 1 }} />
        </CardContent>
      </Card>

      {/* Feed */}
      <Stack gap={2}>
        {(tab === 0 ? mine : tab === 1 ? media : tab === 2 ? saved : liked).length ? (
          (tab === 0 ? mine : tab === 1 ? media : tab === 2 ? saved : liked).map((p, i) => (
            <Reveal key={p.id} delay={i * 55}>
              <PostCard
                post={p}
                onLike={toggleLike}
                onSave={toggleSave}
                onComment={addComment}
                onPin={togglePin}
              />
            </Reveal>
          ))
        ) : (
          <Typography sx={{ opacity: 0.78, fontWeight: 850, px: 1 }}>
            {t('چیزی برای نمایش نیست.', 'Nothing to show.')}
          </Typography>
        )}
      </Stack>
    </Stack>
  );
}
