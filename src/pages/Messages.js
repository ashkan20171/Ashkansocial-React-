import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  alpha,
} from '@mui/material';
import { CheckRounded, CloseRounded, SearchRounded, SendRounded } from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import EmptyState from '../components/ui/EmptyState';
import Reveal from '../components/ui/Reveal';
import { useUi } from '../context/UiContext';
import { useMessages } from '../context/MessagesContext';

function fmtTime(ts, locale) {
  try {
    return new Intl.DateTimeFormat(locale === 'fa' ? 'fa-IR' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(ts));
  } catch {
    return '';
  }
}

function initials(name) {
  if (!name) return '?';
  return name.trim().slice(0, 1).toUpperCase();
}

function TypingDots() {
  return (
    <Box
      aria-label="typing"
      sx={(th) => ({
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.6,
        px: 1.4,
        py: 0.9,
        borderRadius: 999,
        border: `1px solid ${alpha(th.palette.divider, th.palette.mode === 'dark' ? 0.5 : 0.9)}`,
        background: alpha(th.palette.background.paper, th.palette.mode === 'dark' ? 0.35 : 0.9),
        '& span': {
          width: 6,
          height: 6,
          borderRadius: 99,
          background: alpha(th.palette.text.primary, 0.55),
          display: 'inline-block',
          animation: 'ashkanDot 1.1s ease-in-out infinite',
        },
        '& span:nth-of-type(2)': { animationDelay: '0.15s' },
        '& span:nth-of-type(3)': { animationDelay: '0.3s' },
      })}
    >
      <span />
      <span />
      <span />
    </Box>
  );
}

export default function Messages() {
  const { locale } = useUi();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const {
    me,
    conversations,
    activeId,
    setActiveId,
    activeConversation,
    typing,
    requests,
    totalUnread,
    unreadCount,
    markRead,
    upsertConversation,
    sendMessage,
    acceptRequest,
    declineRequest,
  } = useMessages();

  const [tab, setTab] = useState('inbox'); // inbox | requests
  const [q, setQ] = useState('');
  const [text, setText] = useState('');

  const threadRef = useRef(null);

  // Support deep link: /messages?to=username
  useEffect(() => {
    const to = params.get('to');
    if (to) {
      upsertConversation(to);
      setTab('inbox');
      // remove param for cleanliness
      navigate('/messages', { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Mark read + auto scroll
  useEffect(() => {
    if (activeId) markRead(activeId);
    const el = threadRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [activeId, activeConversation?.messages?.length, markRead]);

  const filteredConversations = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return conversations;
    return conversations.filter((c) => {
      const other = c.participants.find((p) => p !== me) || me;
      const hay = `${other} ${(c.messages?.[c.messages.length - 1]?.text || '')}`.toLowerCase();
      return hay.includes(query);
    });
  }, [q, conversations, me]);

  const activeOther = useMemo(() => {
    if (!activeConversation) return null;
    return activeConversation.participants.find((p) => p !== me) || me;
  }, [activeConversation, me]);

  const canSend = text.trim().length > 0;

  const handleSend = () => {
    if (!activeOther || !canSend) return;
    const result = sendMessage({ to: activeOther, text });
    setText('');
    if (result?.requested) {
      // if message became a request, switch tab and show it
      setTab('requests');
    }
  };

  const inboxEmpty = conversations.length === 0;
  const requestsEmpty = requests.length === 0;

  return (
    <AppShell>
      <Stack gap={2}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 1 }}>
          <Stack>
            <Typography variant="h6" sx={{ fontWeight: 950 }}>
              {locale === 'fa' ? 'پیام‌ها' : 'Messages'}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.75, fontWeight: 700 }}>
              {locale === 'fa' ? 'گفتگوها، درخواست‌ها و چت سریع' : 'Conversations, requests, and fast chat'}
            </Typography>
          </Stack>

          <Badge color="secondary" badgeContent={totalUnread} invisible={!totalUnread}>
            <Chip
              label={locale === 'fa' ? 'Inbox' : 'Inbox'}
              sx={(th) => ({
                fontWeight: 900,
                borderRadius: 999,
                background: alpha(th.palette.secondary.main, th.palette.mode === 'dark' ? 0.16 : 0.12),
              })}
            />
          </Badge>
        </Stack>

        <Reveal>
          <Stack direction={{ xs: 'column', md: 'row' }} gap={2} alignItems="stretch">
            {/* Left column */}
            <Card elevation={0} sx={{ borderRadius: 3, width: { xs: '100%', md: 360 } }}>
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ px: 1.5, pt: 1.5 }}>
                  <Tabs
                    value={tab}
                    onChange={(_, v) => setTab(v)}
                    variant="fullWidth"
                    sx={(th) => ({
                      minHeight: 44,
                      '& .MuiTab-root': { minHeight: 44, fontWeight: 900 },
                      '& .MuiTabs-indicator': {
                        height: 3,
                        borderRadius: 999,
                        background: `linear-gradient(135deg, ${th.palette.primary.main}, ${th.palette.secondary.main})`,
                      },
                    })}
                  >
                    <Tab
                      value="inbox"
                      label={
                        <Stack direction="row" gap={1} alignItems="center">
                          <span>{locale === 'fa' ? 'گفتگوها' : 'Inbox'}</span>
                          <Badge
                            color="secondary"
                            badgeContent={totalUnread}
                            invisible={!totalUnread}
                            sx={{ '& .MuiBadge-badge': { fontWeight: 900 } }}
                          />
                        </Stack>
                      }
                    />
                    <Tab
                      value="requests"
                      label={
                        <Stack direction="row" gap={1} alignItems="center">
                          <span>{locale === 'fa' ? 'درخواست‌ها' : 'Requests'}</span>
                          <Badge
                            color="secondary"
                            badgeContent={requests.length}
                            invisible={!requests.length}
                            sx={{ '& .MuiBadge-badge': { fontWeight: 900 } }}
                          />
                        </Stack>
                      }
                    />
                  </Tabs>

                  {tab === 'inbox' && (
                    <TextField
                      value={q}
                      onChange={(e) => setQ(e.target.value)}
                      fullWidth
                      placeholder={locale === 'fa' ? 'جستجو...' : 'Search...'}
                      size="small"
                      sx={{ mt: 1.2 }}
                      InputProps={{
                        startAdornment: (
                          <Box sx={{ display: 'inline-flex', alignItems: 'center', mr: 1, opacity: 0.7 }}>
                            <SearchRounded fontSize="small" />
                          </Box>
                        ),
                      }}
                    />
                  )}
                </Box>

                <Divider sx={{ mt: 1.4 }} />

                {tab === 'inbox' ? (
                  inboxEmpty ? (
                    <Box sx={{ p: 2 }}>
                      <EmptyState
                        title={locale === 'fa' ? 'هنوز گفتگویی نیست' : 'No conversations yet'}
                        subtitle={
                          locale === 'fa'
                            ? 'وقتی با کسی چت کنی، اینجا نمایش داده میشه.'
                            : 'When you start chatting, it will show up here.'
                        }
                        actionText={locale === 'fa' ? 'برو به اکسپلور' : 'Go explore'}
                        onAction={() => navigate('/explore')}
                      />
                    </Box>
                  ) : (
                    <List sx={{ p: 1, display: 'grid', gap: 0.5 }}>
                      {filteredConversations.map((c) => {
                        const other = c.participants.find((p) => p !== me) || me;
                        const last = (c.messages || [])[c.messages.length - 1];
                        const unread = unreadCount(c);
                        return (
                          <ListItemButton
                            key={c.id}
                            selected={c.id === activeId}
                            onClick={() => setActiveId(c.id)}
                            sx={(th) => ({
                              borderRadius: 2,
                              '&.Mui-selected': {
                                backgroundColor: alpha(th.palette.secondary.main, th.palette.mode === 'dark' ? 0.16 : 0.12),
                              },
                            })}
                          >
                            <Badge
                              color="secondary"
                              badgeContent={unread}
                              invisible={!unread}
                              overlap="circular"
                              sx={{ '& .MuiBadge-badge': { fontWeight: 900 } }}
                            >
                              <Avatar sx={{ width: 36, height: 36, mr: 1.2 }}>{initials(other)}</Avatar>
                            </Badge>
                            <ListItemText
                              primary={
                                <Stack direction="row" alignItems="center" justifyContent="space-between">
                                  <Typography sx={{ fontWeight: 950 }}>{other}</Typography>
                                  <Typography variant="caption" sx={{ opacity: 0.65, fontWeight: 800 }}>
                                    {last?.at ? fmtTime(last.at, locale) : ''}
                                  </Typography>
                                </Stack>
                              }
                              secondary={
                                <Typography variant="body2" sx={{ opacity: 0.75, fontWeight: 700 }} noWrap>
                                  {last?.text || (locale === 'fa' ? 'گفتگو را شروع کن…' : 'Start a conversation…')}
                                </Typography>
                              }
                            />
                          </ListItemButton>
                        );
                      })}
                    </List>
                  )
                ) : requestsEmpty ? (
                  <Box sx={{ p: 2 }}>
                    <EmptyState
                      title={locale === 'fa' ? 'درخواستی نیست' : 'No requests'}
                      subtitle={locale === 'fa' ? 'درخواست پیام جدیدی نداری.' : "You don't have any message requests."}
                      actionText={locale === 'fa' ? 'برگشت به گفتگوها' : 'Back to inbox'}
                      onAction={() => setTab('inbox')}
                    />
                  </Box>
                ) : (
                  <List sx={{ p: 1, display: 'grid', gap: 0.5 }}>
                    {requests.map((r) => (
                      <Box
                        key={r.id}
                        sx={(th) => ({
                          borderRadius: 2,
                          border: `1px solid ${alpha(th.palette.divider, th.palette.mode === 'dark' ? 0.4 : 0.9)}`,
                          p: 1.2,
                        })}
                      >
                        <Stack direction="row" gap={1.2} alignItems="center">
                          <Avatar sx={{ width: 36, height: 36 }}>{initials(r.from)}</Avatar>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography sx={{ fontWeight: 950 }}>{r.from}</Typography>
                            <Typography variant="body2" sx={{ opacity: 0.75, fontWeight: 700 }} noWrap>
                              {r.preview}
                            </Typography>
                          </Box>
                          <Stack direction="row" gap={0.5}>
                            <IconButton
                              aria-label="accept"
                              onClick={() => {
                                acceptRequest(r.id);
                                setTab('inbox');
                                upsertConversation(r.from);
                              }}
                              sx={(th) => ({
                                borderRadius: 2,
                                background: alpha(th.palette.success.main, th.palette.mode === 'dark' ? 0.18 : 0.12),
                              })}
                            >
                              <CheckRounded />
                            </IconButton>
                            <IconButton
                              aria-label="decline"
                              onClick={() => declineRequest(r.id)}
                              sx={(th) => ({
                                borderRadius: 2,
                                background: alpha(th.palette.error.main, th.palette.mode === 'dark' ? 0.18 : 0.12),
                              })}
                            >
                              <CloseRounded />
                            </IconButton>
                          </Stack>
                        </Stack>
                      </Box>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>

            {/* Right column */}
            <Card elevation={0} sx={{ borderRadius: 3, flex: 1, minHeight: 520 }}>
              <CardContent sx={{ p: 0, display: 'flex', flexDirection: 'column', height: '100%' }}>
                {!activeConversation ? (
                  <Box sx={{ p: 2 }}>
                    <EmptyState
                      title={locale === 'fa' ? 'یک گفتگو را انتخاب کن' : 'Select a conversation'}
                      subtitle={locale === 'fa' ? 'از ستون سمت چپ شروع کن.' : 'Pick one from the left panel.'}
                      actionText={locale === 'fa' ? 'برو اکسپلور' : 'Explore'}
                      onAction={() => navigate('/explore')}
                    />
                  </Box>
                ) : (
                  <>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2 }}>
                      <Stack direction="row" gap={1.2} alignItems="center">
                        <Avatar sx={{ width: 38, height: 38 }}>{initials(activeOther)}</Avatar>
                        <Box>
                          <Typography sx={{ fontWeight: 950 }}>{activeOther}</Typography>
                          <Typography variant="caption" sx={{ opacity: 0.7, fontWeight: 800 }}>
                            @{activeOther}
                          </Typography>
                        </Box>
                      </Stack>
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{ borderRadius: 999, fontWeight: 900 }}
                        onClick={() => navigate(`/u/${activeOther}`)}
                      >
                        {locale === 'fa' ? 'پروفایل' : 'Profile'}
                      </Button>
                    </Stack>
                    <Divider />

                    <Box ref={threadRef} sx={{ p: 2, flex: 1, overflow: 'auto' }}>
                      <Stack gap={1}>
                        {(activeConversation.messages || []).map((m) => {
                          const mine = m.from === me;
                          return (
                            <Stack key={m.id} direction="row" justifyContent={mine ? 'flex-end' : 'flex-start'}>
                              <Box
                                sx={(th) => ({
                                  maxWidth: '78%',
                                  px: 1.5,
                                  py: 1,
                                  borderRadius: 3,
                                  border: '1px solid',
                                  borderColor: alpha(th.palette.divider, th.palette.mode === 'dark' ? 0.5 : 0.9),
                                  background: mine
                                    ? `linear-gradient(135deg, ${alpha(th.palette.secondary.main, 0.22)}, ${alpha(
                                        th.palette.primary.main,
                                        0.16
                                      )})`
                                    : alpha(th.palette.background.paper, th.palette.mode === 'dark' ? 0.32 : 0.92),
                                })}
                              >
                                <Typography sx={{ fontWeight: 750, whiteSpace: 'pre-wrap' }}>{m.text}</Typography>
                                <Typography variant="caption" sx={{ opacity: 0.65, fontWeight: 800, mt: 0.4, display: 'block' }}>
                                  {fmtTime(m.at, locale)}
                                </Typography>
                              </Box>
                            </Stack>
                          );
                        })}

                        {typing?.[activeConversation.id] && (
                          <Stack direction="row" justifyContent="flex-start">
                            <TypingDots />
                          </Stack>
                        )}
                      </Stack>
                    </Box>

                    <Divider />
                    <Stack direction="row" gap={1} sx={{ p: 2 }}>
                      <TextField
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        fullWidth
                        placeholder={locale === 'fa' ? 'پیام...' : 'Message...'}
                        multiline
                        maxRows={4}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                          }
                        }}
                      />
                      <Button
                        variant="contained"
                        disabled={!canSend}
                        onClick={handleSend}
                        endIcon={<SendRounded />}
                        sx={(th) => ({
                          fontWeight: 950,
                          borderRadius: 999,
                          px: 2.2,
                          background: `linear-gradient(135deg, ${th.palette.primary.main}, ${th.palette.secondary.main})`,
                        })}
                      >
                        {locale === 'fa' ? 'ارسال' : 'Send'}
                      </Button>
                    </Stack>

                    <Typography variant="caption" sx={{ px: 2, pb: 1.6, opacity: 0.65, fontWeight: 800 }}>
                      {locale === 'fa' ? 'Enter برای ارسال • Shift+Enter خط جدید' : 'Enter to send • Shift+Enter for newline'}
                    </Typography>
                  </>
                )}
              </CardContent>
            </Card>
          </Stack>
        </Reveal>
      </Stack>

      <style>{`
        @keyframes ashkanDot {
          0%, 100% { transform: translateY(0); opacity: .55; }
          50% { transform: translateY(-3px); opacity: 1; }
        }
      `}</style>
    </AppShell>
  );
}
