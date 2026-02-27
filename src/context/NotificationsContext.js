import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { readJson, writeJson } from '../lib/storage';

const NotificationsContext = createContext(null);
const KEY = 'ashkan.notifications.v2';

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationsProvider');
  return ctx;
}

const seed = [
  {
    id: 'n_seed_welcome',
    type: 'system', // system | like | comment | follow | mention | info
    titleFa: 'خوش آمدید 👋',
    titleEn: 'Welcome 👋',
    bodyFa: 'این نسخه یک دمو فرانت‌اند است. اعلان‌ها اینجا نمایش داده می‌شوند.',
    bodyEn: 'This is a frontend demo. Notifications will show up here.',
    href: '/',
    createdAt: Date.now() - 1000 * 60 * 45,
    read: false,
  },
  {
    id: 'n_seed_mention',
    type: 'mention',
    titleFa: 'منشن جدید',
    titleEn: 'New mention',
    bodyFa: '@ashkan تو را در یک پست منشن کرد.',
    bodyEn: '@ashkan mentioned you in a post.',
    href: '/explore',
    createdAt: Date.now() - 1000 * 60 * 12,
    read: false,
    actor: { username: 'ashkan', name: 'Ashkan' },
  },
];

function normalizeInput(payload = {}) {
  const {
    title, body, type = 'info', href,
    titleFa, titleEn, bodyFa, bodyEn,
    actor,
  } = payload;

  return {
    id: payload.id || `n_${Date.now()}_${Math.random().toString(16).slice(2)}`,
    type,
    titleFa: titleFa || title || '',
    titleEn: titleEn || title || '',
    bodyFa: bodyFa || body || '',
    bodyEn: bodyEn || body || '',
    href: href || payload.url || null,
    actor: actor || null,
    createdAt: payload.createdAt || Date.now(),
    read: Boolean(payload.read),
  };
}

export function NotificationsProvider({ children }) {
  const [items, setItems] = useState(() => readJson(KEY, null) || readJson('ashkan.notifications', null) || seed);

  const persist = useCallback((next) => {
    setItems(next);
    writeJson(KEY, next);
  }, []);

  const addNotification = useCallback(
    (payload) => {
      const n = normalizeInput(payload);
      const next = [n, ...items];
      persist(next);
      return n.id;
    },
    [items, persist]
  );

  const markRead = useCallback(
    (id, read = true) => {
      persist(items.map((x) => (x.id === id ? { ...x, read } : x)));
    },
    [items, persist]
  );

  const toggleRead = useCallback(
    (id) => {
      persist(items.map((x) => (x.id === id ? { ...x, read: !x.read } : x)));
    },
    [items, persist]
  );

  const markAllRead = useCallback(() => {
    persist(items.map((x) => ({ ...x, read: true })));
  }, [items, persist]);

  const clearAll = useCallback(() => {
    persist([]);
  }, [persist]);

  const unreadCount = useMemo(() => items.filter((x) => !x.read).length, [items]);

  const value = useMemo(
    () => ({
      // keep both names for backward compatibility
      items,
      notifications: items,
      unreadCount,
      addNotification,
      markRead,
      toggleRead,
      markAllRead,
      clearAll,
    }),
    [items, unreadCount, addNotification, markRead, toggleRead, markAllRead, clearAll]
  );

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}
