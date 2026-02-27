import React from 'react';
import {
  Box,
  Badge,
  BottomNavigation,
  BottomNavigationAction,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Drawer,
  Fab,
  IconButton,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
  alpha,
  keyframes,
} from '@mui/material';
import { useUi } from '../../context/UiContext';
import { usePosts } from '../../context/PostsContext';
import { useToast } from '../../context/ToastContext';
import { useNotifications } from '../../context/NotificationsContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { extractHashtags } from '../../lib/text';
import SidebarNav from './SidebarNav';
import TopBar from './TopBar';
import PremiumDialogTransition from '../ui/PremiumDialogTransition';

import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import SendRoundedIcon from '@mui/icons-material/SendRounded';

import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ExploreRoundedIcon from '@mui/icons-material/ExploreRounded';
import ChatBubbleRoundedIcon from '@mui/icons-material/ChatBubbleRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';


export default function AppShell({ children, onSearch }) {
  const { setSearchQuery, locale } = useUi();
  const handleSearch = onSearch || ((q) => setSearchQuery(q));
  const navigate = useNavigate();
  const [mobileDrawerOpen, setMobileDrawerOpen] = React.useState(false);

  const [quickOpen, setQuickOpen] = React.useState(false);

  const sidebar = (
    <Paper elevation={0} sx={{ height: '100%', borderRadius: 0 }}>
      <SidebarNav />
    </Paper>
  );

  const fabPulse = keyframes`
    0% { transform: translateY(0) scale(1); box-shadow: 0 12px 34px rgba(0,0,0,0.18); }
    50% { transform: translateY(-2px) scale(1.02); box-shadow: 0 18px 44px rgba(0,0,0,0.22); }
    100% { transform: translateY(0) scale(1); box-shadow: 0 12px 34px rgba(0,0,0,0.18); }
  `;

  return (
    <Box
      sx={(th) => ({
        minHeight: '100vh',
        backgroundColor: th.palette.background.default,
        position: 'relative',
        overflow: 'hidden',
        '&:before': {
          content: '""',
          position: 'absolute',
          inset: -2,
          pointerEvents: 'none',
          background:
            th.palette.mode === 'dark'
              ? `radial-gradient(900px 520px at 10% 0%, ${alpha(th.palette.primary.main, 0.18)}, transparent 55%),
                 radial-gradient(900px 520px at 90% 10%, ${alpha(th.palette.secondary.main, 0.16)}, transparent 55%),
                 radial-gradient(1100px 620px at 50% 110%, ${alpha(th.palette.primary.main, 0.10)}, transparent 60%)`
              : `radial-gradient(900px 520px at 10% 0%, ${alpha(th.palette.primary.main, 0.12)}, transparent 55%),
                 radial-gradient(900px 520px at 90% 10%, ${alpha(th.palette.secondary.main, 0.10)}, transparent 55%),
                 radial-gradient(1100px 620px at 50% 110%, ${alpha(th.palette.primary.main, 0.06)}, transparent 60%)`,
        },
      })}
    >
      <TopBar onSearch={handleSearch} />

      <Container maxWidth="lg" sx={{ py: 2.5, pb: { xs: 12, md: 2.5 } }}>
        <Stack direction={{ xs: 'column', md: 'row' }} gap={2.5} alignItems="flex-start">
          <Box sx={{ display: { xs: 'none', md: 'block' }, width: 260, position: 'sticky', top: 88 }}>
            <Paper elevation={0} sx={{ overflow: 'hidden' }}>
              {sidebar}
            </Paper>
          </Box>

          <Box sx={{ flex: 1, width: '100%' }}>{children}</Box>

          <Box sx={{ display: { xs: 'none', lg: 'block' }, width: 320, position: 'sticky', top: 88 }}>
            <Paper elevation={0} sx={{ p: 2 }}>
              <RightRail />
            </Paper>
          </Box>
        </Stack>
      </Container>

      <Tooltip title={locale === 'fa' ? 'پست جدید' : 'New post'} placement="left">
        <Fab
          color="secondary"
          onClick={() => setQuickOpen(true)}
          sx={(th) => ({
            position: 'fixed',
            right: 20,
            bottom: { xs: 82, md: 20 },
            zIndex: 1200,
            borderRadius: 999,
            fontWeight: 900,
            animation: `${fabPulse} 3.2s ease-in-out infinite`,
            background: `linear-gradient(135deg, ${th.palette.secondary.main}, ${th.palette.primary.main})`,
          })}
        >
          <AddRoundedIcon />
        </Fab>
      </Tooltip>


      {/* Mobile bottom navigation */}
      <MobileBottomNav onMenu={() => setMobileDrawerOpen(true)} />

<QuickPostDialog
        open={quickOpen}
        onClose={() => setQuickOpen(false)}
        onGoFull={() => {
          setQuickOpen(false);
          navigate('/new');
        }}
      />

      {/* Mobile sidebar (optional future enhancement): keep code ready */}
      <Drawer
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        PaperProps={{ sx: { width: 280 } }}
      >
        {sidebar}
      </Drawer>
    </Box>
  );
}

function MobileBottomNav({ onMenu }) {
  const { locale } = useUi();
  const navigate = useNavigate();
  const location = useLocation();
  const { unreadCount } = useNotifications();

  const value = React.useMemo(() => {
    const p = location.pathname || '/';
    if (p.startsWith('/explore') || p.startsWith('/tag')) return 'explore';
    if (p.startsWith('/messages')) return 'messages';
    if (p.startsWith('/notifications')) return 'notifications';
    if (p.startsWith('/profile') || p.startsWith('/u/')) return 'profile';
    return 'home';
  }, [location.pathname]);

  return (
    <Paper
      elevation={0}
      sx={(th) => ({
        display: { xs: 'block', md: 'none' },
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1200,
        borderTop: `1px solid ${alpha(th.palette.divider, th.palette.mode === 'dark' ? 0.6 : 0.9)}`,
        backgroundColor: alpha(th.palette.background.paper, th.palette.mode === 'dark' ? 0.72 : 0.84),
        backdropFilter: 'blur(16px)',
      })}
    >
      <BottomNavigation
        showLabels={false}
        value={value}
        onChange={(_, next) => {
          if (next === 'menu') return onMenu?.();
          if (next === 'home') return navigate('/');
          if (next === 'explore') return navigate('/explore');
          if (next === 'messages') return navigate('/messages');
          if (next === 'notifications') return navigate('/notifications');
          if (next === 'profile') return navigate('/profile');
        }}
        sx={{
          height: 64,
        }}
      >
        <BottomNavigationAction value="home" label="Home" icon={<HomeRoundedIcon />} />
        <BottomNavigationAction value="explore" label="Explore" icon={<ExploreRoundedIcon />} />
        <BottomNavigationAction value="messages" label="Messages" icon={<ChatBubbleRoundedIcon />} />
        <BottomNavigationAction
          value="notifications"
          label="Notifications"
          icon={
            <Badge color="secondary" overlap="circular" badgeContent={unreadCount || 0}>
              <NotificationsRoundedIcon />
            </Badge>
          }
        />
        <BottomNavigationAction value="profile" label="Profile" icon={<PersonRoundedIcon />} />
        <BottomNavigationAction value="menu" label="Menu" icon={<MenuRoundedIcon />} />
      </BottomNavigation>

      <Typography
        variant="caption"
        sx={{ display: 'none' }}
        aria-hidden="true"
      >
        {locale === 'fa' ? 'ناوبری' : 'Navigation'}
      </Typography>
    </Paper>
  );
}
function RightRail() {
  const { locale, setSearchQuery } = useUi();
  const { posts } = usePosts();
  const navigate = useNavigate();

  const trending = React.useMemo(() => {
    const counts = new Map();
    posts.forEach((p) => {
      extractHashtags(p.content).forEach((tag) => {
        counts.set(tag, (counts.get(tag) || 0) + 1);
      });
    });
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([tag, count]) => ({ tag, count }));
  }, [posts]);

  const suggested = React.useMemo(
    () => [
      { name: 'Scania', username: 'scania' },
      { name: 'OpenAI', username: 'openai' },
      { name: 'React', username: 'reactjs' },
    ],
    []
  );

  return (
    <Stack gap={2}>
      <PaperCard
        title={locale === 'fa' ? 'ترندینگ' : 'Trending'}
        items={trending.length ? trending.map((t) => ({ label: `#${t.tag}`, meta: `${t.count}` })) : []}
        emptyText={locale === 'fa' ? 'هنوز هشتگی نداریم.' : 'No tags yet.'}
        onPick={(label) => {
          const tag = String(label).replace('#', '');
          navigate(`/tag/${encodeURIComponent(tag)}`);
        }}
      />

      <PaperCard
        title={locale === 'fa' ? 'پیشنهاد برای دنبال کردن' : 'Suggested'}
        items={suggested.map((u) => ({ label: u.name, meta: `@${u.username}` }))}
        onPick={() => {
          setSearchQuery('');
          navigate('/profile');
        }}
      />
    </Stack>
  );
}

function PaperCard({ title, items, onPick, emptyText }) {
  return (
    <Paper
      elevation={0}
      sx={(th) => ({
        p: 1.5,
        borderRadius: 3,
        border: '1px solid',
        borderColor: alpha(th.palette.divider, th.palette.mode === 'dark' ? 0.55 : 0.9),
        background:
          th.palette.mode === 'dark'
            ? `linear-gradient(180deg, ${alpha(th.palette.background.paper, 0.92)}, ${alpha(
                th.palette.background.paper,
                0.76
              )})`
            : `linear-gradient(180deg, ${alpha('#ffffff', 0.98)}, ${alpha('#ffffff', 0.86)})`,
      })}
    >
      <Typography variant="subtitle1" sx={{ fontWeight: 900, px: 1, pt: 0.5 }}>
        {title}
      </Typography>

      <Stack sx={{ mt: 1 }}>
        {items?.length ? (
          items.map((it) => (
            <Button
              key={`${it.label}-${it.meta}`}
              onClick={() => onPick?.(it.label)}
              sx={(th) => ({
                justifyContent: 'space-between',
                textTransform: 'none',
                borderRadius: 2,
                px: 1,
                py: 0.9,
                color: 'text.primary',
                '&:hover': {
                  backgroundColor: alpha(th.palette.secondary.main, th.palette.mode === 'dark' ? 0.12 : 0.08),
                },
              })}
            >
              <span style={{ fontWeight: 800 }}>{it.label}</span>
              <span style={{ opacity: 0.72 }}>{it.meta}</span>
            </Button>
          ))
        ) : (
          <Typography variant="body2" sx={{ px: 1, py: 1, opacity: 0.75 }}>
            {emptyText || '—'}
          </Typography>
        )}
      </Stack>
    </Paper>
  );
}

function QuickPostDialog({ open, onClose, onGoFull }) {
  const { locale } = useUi();
  const { addPost } = usePosts();
  const toast = useToast();
  const navigate = useNavigate();

  const [content, setContent] = React.useState('');
  const [image, setImage] = React.useState('');
  const fileInputRef = React.useRef(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [pickedName, setPickedName] = React.useState('');

  const readFileAsDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(String(r.result || ''));
      r.onerror = reject;
      r.readAsDataURL(file);
    });

  const acceptFile = async (file) => {
    if (!file) return;
    if (!file.type?.startsWith('image/')) {
      toast.show(locale === 'fa' ? 'فقط فایل تصویر مجاز است.' : 'Only image files are allowed.', 'warning');
      return;
    }
    const MAX = 350 * 1024; // keep localStorage safe
    if (file.size > MAX) {
      toast.show(
        locale === 'fa'
          ? 'حجم تصویر زیاد است. لطفاً فایل کوچک‌تر انتخاب کن یا لینک تصویر وارد کن.'
          : 'Image is too large. Pick a smaller file or paste an image URL.',
        'warning'
      );
      return;
    }
    try {
      const dataUrl = await readFileAsDataUrl(file);
      setImage(dataUrl);
      setPickedName(file.name);
      toast.show(locale === 'fa' ? 'تصویر اضافه شد ✅' : 'Image attached ✅', 'success');
    } catch {
      toast.show(locale === 'fa' ? 'خواندن فایل ناموفق بود.' : 'Failed to read file.', 'error');
    }
  };


  React.useEffect(() => {
    if (!open) {
      setContent('');
      setImage('');
    }
  }, [open]);

  const canSend = content.trim().length >= 2;

  const handleSend = () => {
    if (!canSend) return;
    const createdId = addPost({ content: content.trim(), image: image.trim() || null });
    toast.show(locale === 'fa' ? 'پست منتشر شد ✨' : 'Posted ✨', 'success');
    onClose?.();
    if (createdId) navigate(`/post/${createdId}`);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth TransitionComponent={PremiumDialogTransition} BackdropProps={{ sx: { backdropFilter: 'blur(10px)' } }}>
      <DialogTitle sx={{ pb: 1 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
          <Stack>
            <Typography sx={{ fontWeight: 900 }}>{locale === 'fa' ? 'پست سریع' : 'Quick post'}</Typography>
            <Typography variant="body2" sx={{ opacity: 0.72 }}>
              {locale === 'fa'
                ? 'یک پست کوتاه بساز، یا برای امکانات کامل وارد صفحه ساخت پست شو.'
                : 'Create a quick post, or go to the full composer.'}
            </Typography>
          </Stack>

          <IconButton onClick={onClose} aria-label="close">
            <CloseRoundedIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Stack gap={1.25}>
          <TextField
            autoFocus
            value={content}
            onChange={(e) => setContent(e.target.value)}
            multiline
            minRows={3}
            placeholder={locale === 'fa' ? 'چی تو ذهنته؟ #هشتگ' : "What's on your mind? #tags"}
          />

          <TextField
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder={locale === 'fa' ? 'لینک تصویر (اختیاری)' : 'Image URL (optional)'}
            InputProps={{
              startAdornment: (
                <Box sx={{ display: 'flex', alignItems: 'center', pr: 1, opacity: 0.75 }}>
                  <ImageOutlinedIcon fontSize="small" />
                </Box>
              ),
            }}
          />

                    <Paper
            elevation={0}
            onDragEnter={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsDragging(true);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsDragging(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsDragging(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsDragging(false);
              const f = e.dataTransfer?.files?.[0];
              acceptFile(f);
            }}
            sx={(th) => ({
              p: 1.25,
              borderRadius: 3,
              border: '1px dashed',
              cursor: 'pointer',
              userSelect: 'none',
              borderColor: isDragging
                ? th.palette.secondary.main
                : alpha(th.palette.divider, th.palette.mode === 'dark' ? 0.6 : 0.9),
              backgroundColor: isDragging
                ? alpha(th.palette.secondary.main, th.palette.mode === 'dark' ? 0.18 : 0.10)
                : alpha(th.palette.secondary.main, th.palette.mode === 'dark' ? 0.06 : 0.04),
              transition: 'all 180ms ease',
            })}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => acceptFile(e.target.files?.[0])}
            />

            <Stack direction="row" alignItems="center" gap={1} justifyContent="space-between">
              <Stack direction="row" alignItems="center" gap={1}>
                <ImageOutlinedIcon fontSize="small" />
                <Typography sx={{ fontWeight: 800 }}>
                  {locale === 'fa' ? 'عکس را بکش و رها کن' : 'Drag & drop an image'}
                </Typography>
              </Stack>
              <Button variant="text" size="small" sx={{ fontWeight: 800 }}>
                {locale === 'fa' ? 'انتخاب فایل' : 'Pick file'}
              </Button>
            </Stack>

            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: 0.5 }}>
              <Typography variant="body2" sx={{ opacity: 0.72 }}>
                {pickedName
                  ? (locale === 'fa' ? `انتخاب شد: ${pickedName}` : `Selected: ${pickedName}`)
                  : (locale === 'fa'
                      ? 'یا روی این بخش کلیک کن. (فایل‌های کوچک بهترند)'
                      : 'Or click here. (Smaller files work best)')}
              </Typography>

              {pickedName ? (
                <Button
                  size="small"
                  variant="text"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPickedName('');
                    setImage('');
                    toast.show(locale === 'fa' ? 'پیوست حذف شد' : 'Attachment removed', 'info');
                  }}
                  sx={{ fontWeight: 900 }}
                >
                  {locale === 'fa' ? 'حذف' : 'Remove'}
                </Button>
              ) : null}
            </Stack>

            <Typography variant="caption" sx={{ display: 'block', mt: 0.75, opacity: 0.6 }}>
              {locale === 'fa'
                ? 'نکته: در نسخه دمو، پست‌ها در localStorage ذخیره می‌شوند.'
                : 'Note: In this demo, posts are persisted in localStorage.'}
            </Typography>
          </Paper>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 2.5, pb: 2 }}>
        <Button onClick={onGoFull} variant="text" sx={{ fontWeight: 800 }}>
          {locale === 'fa' ? 'ویرایشگر کامل' : 'Full composer'}
        </Button>

        <Box sx={{ flex: 1 }} />

        <Button onClick={onClose} variant="outlined" sx={{ fontWeight: 800 }}>
          {locale === 'fa' ? 'انصراف' : 'Cancel'}
        </Button>

        <Button
          onClick={handleSend}
          disabled={!canSend}
          variant="contained"
          endIcon={<SendRoundedIcon />}
          sx={(th) => ({
            fontWeight: 900,
            borderRadius: 999,
            px: 2,
            background: `linear-gradient(135deg, ${th.palette.primary.main}, ${th.palette.secondary.main})`,
          })}
        >
          {locale === 'fa' ? 'انتشار' : 'Post'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}