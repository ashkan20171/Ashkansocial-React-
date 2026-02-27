import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { readJson, writeJson } from '../lib/storage';
import { useAuth } from './AuthContext';
import { useSocialGraph } from './SocialGraphContext';

const MessagesContext = createContext(null);

const KEY = 'ashkan.messages.v2';

const now = () => Date.now();

const seed = {
  conversations: [
    {
      id: 'c_sara',
      participants: ['ashkan', 'sara'],
      messages: [
        { id: 'm1', from: 'sara', text: 'Hey! How are you?', at: now() - 1000 * 60 * 60 * 6, readBy: ['sara'] },
        { id: 'm2', from: 'ashkan', text: "I'm great 😄 You?", at: now() - 1000 * 60 * 60 * 5.8, readBy: ['ashkan'] },
        { id: 'm3', from: 'sara', text: 'Loved your latest post 🔥', at: now() - 1000 * 60 * 90, readBy: ['sara'] },
      ],
    },
    {
      id: 'c_reza',
      participants: ['ashkan', 'reza'],
      messages: [{ id: 'm4', from: 'reza', text: 'Wanna play badminton tomorrow?', at: now() - 1000 * 60 * 35, readBy: ['reza'] }],
    },
  ],
  requests: [
    {
      id: 'r_ali',
      from: 'ali',
      to: 'ashkan',
      preview: 'Hi! Can I message you?',
      at: now() - 1000 * 60 * 50,
    },
  ],
};

function ensureShape(data) {
  const d = data || {};
  return {
    conversations: Array.isArray(d.conversations) ? d.conversations : [],
    requests: Array.isArray(d.requests) ? d.requests : [],
  };
}

function otherParticipant(conv, me) {
  return conv.participants.find((p) => p !== me) || me;
}

export function MessagesProvider({ children }) {
  const { user } = useAuth();
  const { isFollowing, ensureUser } = useSocialGraph();

  const me = user?.username || 'ashkan';

  const [data, setData] = useState(() => ensureShape(readJson(KEY, null) || seed));
  const [activeId, setActiveId] = useState(null);

  // typing indicator map: convId -> boolean
  const [typing, setTyping] = useState({}); 
  const timersRef = useRef({});

  useEffect(() => {
    // ensure me exists in graph
    ensureUser(me);
  }, [ensureUser, me]);

  useEffect(() => {
    writeJson(KEY, data);
  }, [data]);

  const conversations = useMemo(() => {
    // sort by last message
    const list = [...(data.conversations || [])];
    list.sort((a, b) => (b.messages?.[b.messages.length - 1]?.at || 0) - (a.messages?.[a.messages.length - 1]?.at || 0));
    return list;
  }, [data.conversations]);

  const activeConversation = useMemo(() => conversations.find((c) => c.id === activeId) || null, [conversations, activeId]);

  useEffect(() => {
    // choose first conversation by default
    if (!activeId && conversations.length) setActiveId(conversations[0].id);
  }, [activeId, conversations]);

  const unreadCount = useCallback(
    (conv) => {
      const msgs = conv?.messages || [];
      return msgs.filter((m) => m.from !== me && !(m.readBy || []).includes(me)).length;
    },
    [me]
  );

  const totalUnread = useMemo(() => conversations.reduce((sum, c) => sum + unreadCount(c), 0), [conversations, unreadCount]);

  const markRead = useCallback(
    (convId) => {
      if (!convId) return;
      setData((prev) => {
        const next = ensureShape({ ...prev });
        next.conversations = next.conversations.map((c) => {
          if (c.id !== convId) return c;
          const messages = (c.messages || []).map((m) => {
            if (m.from === me) return m;
            const rb = new Set(m.readBy || []);
            rb.add(me);
            return { ...m, readBy: Array.from(rb) };
          });
          return { ...c, messages };
        });
        return next;
      });
    },
    [me]
  );

  const upsertConversation = useCallback(
    (withUser) => {
      if (!withUser) return null;
      const other = typeof withUser === 'string' ? withUser : withUser.username;
      if (!other) return null;

      // ensure graph user exists
      ensureUser(other);

      const id = `c_${[me, other].sort().join('_')}`;
      setData((prev) => {
        const next = ensureShape({ ...prev });
        const exists = next.conversations.find((c) => c.id === id);
        if (exists) return next;
        next.conversations = [
          { id, participants: [me, other], messages: [] },
          ...next.conversations,
        ];
        return next;
      });
      setActiveId(id);
      return id;
    },
    [ensureUser, me]
  );

  const acceptRequest = useCallback(
    (requestId) => {
      setData((prev) => {
        const next = ensureShape({ ...prev });
        const req = next.requests.find((r) => r.id === requestId);
        if (!req) return next;
        next.requests = next.requests.filter((r) => r.id !== requestId);

        const other = req.from;
        const id = `c_${[me, other].sort().join('_')}`;
        const exists = next.conversations.find((c) => c.id === id);
        if (!exists) {
          next.conversations = [
            {
              id,
              participants: [me, other],
              messages: [{ id: `m_${now()}`, from: other, text: req.preview, at: req.at, readBy: [other] }],
            },
            ...next.conversations,
          ];
        }
        return next;
      });
    },
    [me]
  );

  const declineRequest = useCallback((requestId) => {
    setData((prev) => {
      const next = ensureShape({ ...prev });
      next.requests = next.requests.filter((r) => r.id !== requestId);
      return next;
    });
  }, []);

  const sendMessage = useCallback(
    ({ to, text }) => {
      const messageText = (text || '').trim();
      if (!to || !messageText) return;

      const other = typeof to === 'string' ? to : to.username;
      if (!other) return;

      // If not following, go to requests (message requests feature)
      if (!isFollowing(me, other)) {
        setData((prev) => {
          const next = ensureShape({ ...prev });
          next.requests = [
            { id: `r_${me}_${other}_${now()}`, from: me, to: other, preview: messageText.slice(0, 140), at: now() },
            ...next.requests,
          ];
          return next;
        });
        return { requested: true };
      }

      const convId = upsertConversation(other);

      const myMsg = { id: `m_${now()}`, from: me, text: messageText, at: now(), readBy: [me] };

      setData((prev) => {
        const next = ensureShape({ ...prev });
        next.conversations = next.conversations.map((c) => {
          if (c.id !== convId) return c;
          return { ...c, messages: [...(c.messages || []), myMsg] };
        });
        return next;
      });

      // Fake "typing" + reply to feel realtime
      const replyDelay = 700 + Math.floor(Math.random() * 1100);
      const typingDelay = 250 + Math.floor(Math.random() * 450);

      // clear existing timers for conv
      const timers = timersRef.current[convId] || [];
      timers.forEach((t) => clearTimeout(t));
      timersRef.current[convId] = [];

      const t1 = setTimeout(() => {
        setTyping((prev) => ({ ...prev, [convId]: true }));
      }, typingDelay);

      const t2 = setTimeout(() => {
        setTyping((prev) => ({ ...prev, [convId]: false }));
        const replies = [
          'Nice! ✅',
          'Got it 👍',
          'Sounds good ✨',
          'Haha 😄',
          'Cool — tell me more!',
          'Ok 👌',
        ];
        const theirMsg = {
          id: `m_${now()}_${Math.random().toString(16).slice(2)}`,
          from: other,
          text: replies[Math.floor(Math.random() * replies.length)],
          at: now(),
          readBy: [other],
        };
        setData((prev) => {
          const next = ensureShape({ ...prev });
          next.conversations = next.conversations.map((c) => {
            if (c.id !== convId) return c;
            return { ...c, messages: [...(c.messages || []), theirMsg] };
          });
          return next;
        });
      }, replyDelay);

      timersRef.current[convId] = [t1, t2];

      return { requested: false };
    },
    [isFollowing, me, upsertConversation]
  );

  const requests = data.requests || [];

  const value = useMemo(
    () => ({
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
    }),
    [
      me,
      conversations,
      activeId,
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
    ]
  );

  return <MessagesContext.Provider value={value}>{children}</MessagesContext.Provider>;
}

export function useMessages() {
  const ctx = useContext(MessagesContext);
  if (!ctx) throw new Error('useMessages must be used within MessagesProvider');
  return ctx;
}
