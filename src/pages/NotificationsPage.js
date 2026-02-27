import React, { useMemo, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  alpha,
} from '@mui/material';
import DoneAllRoundedIcon from '@mui/icons-material/DoneAllRounded';
import DeleteSweepRoundedIcon from '@mui/icons-material/DeleteSweepRounded';
import MarkEmailReadRoundedIcon from '@mui/icons-material/MarkEmailReadRounded';
import MarkEmailUnreadRoundedIcon from '@mui/icons-material/MarkEmailUnreadRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import ChatBubbleRoundedIcon from '@mui/icons-material/ChatBubbleRounded';
import AlternateEmailRoundedIcon from '@mui/icons-material/AlternateEmailRounded';
import PersonAddAlt1RoundedIcon from '@mui/icons-material/PersonAddAlt1Rounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';

import { useNavigate } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import EmptyState from '../components/ui/EmptyState';
import { useUi } from '../context/UiContext';
import { useNotifications } from '../context/NotificationsContext';

function dayKey(ts) {
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function dayLabel(key, locale) {
  const [y, m, dd] = key.split('-').map(Number);
  const d = new Date(y, m - 1, dd);
  const todayKey = dayKey(Date.now());
  const yKey = dayKey(Date.now() - 86400000);
  if (key === todayKey) return locale === 'fa' ? 'امروز' : 'Today';
  if (key === yKey) return locale === 'fa' ? 'دیروز' : 'Yesterday';
  return d.toLocaleDateString(locale === 'fa' ? 'fa-IR' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}
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

function typeMeta(type) {
  switch (type) {
    case 'like':
      return { icon: <FavoriteRoundedIcon />, key: 'like' };
    case 'comment':
      return { icon: <ChatBubbleRoundedIcon />, key: 'comment' };
    case 'mention':
      return { icon: <AlternateEmailRoundedIcon />, key: 'mention' };
    case 'follow':
      return { icon: <PersonAddAlt1RoundedIcon />, key: 'follow' };
    case 'system':
    default:
      return { icon: <InfoRoundedIcon />, key: 'system' };
  }
}

export default function NotificationsPage() {
  const { locale } = useUi();
  const { items, markAllRead, clearAll, toggleRead, markRead, unreadCount } = useNotifications();
  const navigate = useNavigate();

  const filters = useMemo(
    () => [
      { id: 'all', label: locale === 'fa' ? 'همه' : 'All' },
      { id: 'mention', label: locale === 'fa' ? 'منشن‌ها' : 'Mentions' },
      { id: 'like', label: locale === 'fa' ? 'لایک‌ها' : 'Likes' },
      { id: 'comment', label: locale === 'fa' ? 'کامنت‌ها' : 'Comments' },
      { id: 'follow', label: locale === 'fa' ? 'فالو' : 'Follows' },
      { id: 'system', label: locale === 'fa' ? 'سیستم' : 'System' },
    ],
    [locale]
  );

  const [filter, setFilter] = useState('all');
  const [onlyUnread, setOnlyUnread] = useState(false);

  const view = useMemo(() => {
    const resolved = (items || []).map((n) => ({
      ...n,
      title: locale === 'fa' ? n.titleFa : n.titleEn,
      body: locale === 'fa' ? n.bodyFa : n.bodyEn,
    }));

    const filtered = resolved.filter((n) => {
      if (onlyUnread && n.read) return false;
      if (filter === 'all') return true;
      return (n.type || 'system') === filter;
    });

    const map = new Map();
    filtered.forEach((n) => {
      const k = dayKey(n.createdAt || Date.now());
      map.set(k, [...(map.get(k) || []), n]);
    });

    return [...map.entries()].sort((a, b) => (a[0] < b[0] ? 1 : -1));
  }, [items, locale, filter, onlyUnread]);

  const empty = (items || []).length === 0;

  return (
    <AppShell>
      <Stack gap={2}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 0.5 }}>
          <Stack gap={0.25}>
            <Typography variant="h6" sx={{ fontWeight: 950 }}>
              {locale === 'fa' ? 'اعلان‌ها' : 'Notifications'}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.7, fontWeight: 700 }}>
              {locale === 'fa' ? `${unreadCount} خوانده‌نشده` : `${unreadCount} unread`}
            </Typography>
          </Stack>

          <Stack direction="row" gap={1}>
            <Button
              variant="outlined"
              onClick={markAllRead}
              startIcon={<DoneAllRoundedIcon />}
              sx={{ fontWeight: 900, borderRadius: 999 }}
            >
              {locale === 'fa' ? 'همه خوانده شد' : 'Mark all read'}
            </Button>
            <Button
              variant="text"
              color="inherit"
              onClick={clearAll}
              startIcon={<DeleteSweepRoundedIcon />}
              sx={{ fontWeight: 900, borderRadius: 999, opacity: 0.9 }}
            >
              {locale === 'fa' ? 'پاک کردن' : 'Clear'}
            </Button>
          </Stack>
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} gap={1} sx={{ px: 0.5, alignItems: { sm: 'center' } }}>
          <Stack direction="row" gap={1} sx={{ flexWrap: 'wrap' }}>
            {filters.map((f) => (
              <Chip
                key={f.id}
                label={f.label}
                onClick={() => setFilter(f.id)}
                variant={filter === f.id ? 'filled' : 'outlined'}
                color={filter === f.id ? 'secondary' : 'default'}
                sx={{ fontWeight: 900, borderRadius: 999 }}
              />
            ))}
          </Stack>

          <Box sx={{ flex: 1 }} />
          <Chip
            label={locale === 'fa' ? 'فقط خوانده‌نشده' : 'Unread only'}
            onClick={() => setOnlyUnread((s) => !s)}
            color={onlyUnread ? 'secondary' : 'default'}
            variant={onlyUnread ? 'filled' : 'outlined'}
            sx={{ fontWeight: 900, borderRadius: 999 }}
          />
        </Stack>

        {empty ? (
          <EmptyState
            title={locale === 'fa' ? 'اعلانی نداریم' : 'No notifications'}
            subtitle={
              locale === 'fa'
                ? 'وقتی کسی با تو تعامل کنه، اعلان‌ها اینجا نمایش داده می‌شن.'
                : 'When someone interacts with you, notifications will appear here.'
            }
            actionText={locale === 'fa' ? 'بازگشت به فید' : 'Back to feed'}
            onAction={() => navigate('/')}
          />
        ) : view.length === 0 ? (
          <EmptyState
            title={locale === 'fa' ? 'هیچی اینجا نیست' : 'Nothing here'}
            subtitle={locale === 'fa' ? 'فیلترها رو تغییر بده.' : 'Try changing filters.'}
            actionText={locale === 'fa' ? 'نمایش همه' : 'Show all'}
            onAction={() => {
              setFilter('all');
              setOnlyUnread(false);
            }}
          />
        ) : (
          <Stack gap={2}>
            {view.map(([k, list]) => (
              <Card key={k} elevation={0} sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Typography sx={{ fontWeight: 950, mb: 1 }}>{dayLabel(k, locale)}</Typography>
                  <Divider sx={{ mb: 1.25 }} />

                  <Stack gap={1}>
                    {list.map((n) => {
                      const meta = typeMeta(n.type);
                      const actor = n.actor?.name || n.actor?.username || (locale === 'fa' ? 'سیستم' : 'System');
                      const initials = (actor || 'A').slice(0, 1).toUpperCase();

                      return (
                        <Stack
                          key={n.id}
                          direction="row"
                          alignItems="flex-start"
                          justifyContent="space-between"
                          onClick={() => {
                            if (!n.read) markRead(n.id, true);
                            if (n.href) navigate(n.href);
                          }}
                          sx={(th) => ({
                            p: 1.25,
                            borderRadius: 2.75,
                            border: '1px solid',
                            borderColor: alpha(th.palette.divider, th.palette.mode === 'dark' ? 0.55 : 0.9),
                            backgroundColor: n.read
                              ? alpha(th.palette.background.paper, th.palette.mode === 'dark' ? 0.16 : 0.55)
                              : alpha(th.palette.secondary.main, th.palette.mode === 'dark' ? 0.18 : 0.10),
                            cursor: n.href ? 'pointer' : 'default',
                            transition: 'transform 140ms ease, box-shadow 140ms ease, background-color 140ms ease',
                            '&:hover': n.href
                              ? {
                                  transform: 'translateY(-1px)',
                                  boxShadow: th.palette.mode === 'dark'
                                    ? '0 18px 40px rgba(0,0,0,0.35)'
                                    : '0 18px 40px rgba(2,6,23,0.10)',
                                }
                              : {},
                          })}
                        >
                          <Stack direction="row" gap={1.25} alignItems="flex-start">
                            <Avatar
                              sx={(th) => ({
                                width: 38,
                                height: 38,
                                fontWeight: 950,
                                bgcolor: alpha(th.palette.primary.main, 0.18),
                                color: th.palette.primary.main,
                              })}
                            >
                              {initials}
                            </Avatar>

                            <Stack gap={0.25} sx={{ minWidth: 0 }}>
                              <Stack direction="row" alignItems="center" gap={1} sx={{ flexWrap: 'wrap' }}>
                                <Box
                                  sx={(th) => ({
                                    display: 'grid',
                                    placeItems: 'center',
                                    width: 26,
                                    height: 26,
                                    borderRadius: 99,
                                    bgcolor: alpha(th.palette.secondary.main, th.palette.mode === 'dark' ? 0.18 : 0.12),
                                  })}
                                >
                                  {meta.icon}
                                </Box>

                                <Typography sx={{ fontWeight: 950, lineHeight: 1.1 }}>
                                  {n.title || (locale === 'fa' ? 'اعلان' : 'Notification')}
                                </Typography>

                                <Typography variant="caption" sx={{ opacity: 0.65, fontWeight: 800 }}>
                                  • {timeAgo(n.createdAt, locale)}
                                </Typography>

                                {!n.read ? (
                                  <Box
                                    sx={(th) => ({
                                      width: 10,
                                      height: 10,
                                      borderRadius: 99,
                                      backgroundColor: th.palette.secondary.main,
                                      boxShadow: `0 0 0 6px ${alpha(th.palette.secondary.main, 0.18)}`,
                                    })}
                                  />
                                ) : null}
                              </Stack>

                              {n.body ? (
                                <Typography variant="body2" sx={{ opacity: 0.78, fontWeight: 650 }}>
                                  {n.body}
                                </Typography>
                              ) : null}
                            </Stack>
                          </Stack>

                          <Stack direction="row" gap={0.5} alignItems="center">
                            <Tooltip title={n.read ? (locale === 'fa' ? 'خوانده نشده' : 'Mark unread') : (locale === 'fa' ? 'خوانده شد' : 'Mark read')}>
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleRead(n.id);
                                }}
                              >
                                {n.read ? <MarkEmailUnreadRoundedIcon fontSize="small" /> : <MarkEmailReadRoundedIcon fontSize="small" />}
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </Stack>
                      );
                    })}
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </Stack>
    </AppShell>
  );
}
