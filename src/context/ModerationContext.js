import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { readJson, writeJson } from '../lib/storage';

const ModerationContext = createContext(null);
const KEY = 'ashkan.moderation.v1';

export function useModeration() {
  const ctx = useContext(ModerationContext);
  if (!ctx) throw new Error('useModeration must be used within ModerationProvider');
  return ctx;
}

export function ModerationProvider({ children }) {
  const persisted = readJson(KEY, { blocked: [], reports: [] });

  const [blocked, setBlocked] = useState(Array.isArray(persisted?.blocked) ? persisted.blocked : []);
  const [reports, setReports] = useState(Array.isArray(persisted?.reports) ? persisted.reports : []);

  useEffect(() => {
    writeJson(KEY, { blocked, reports });
  }, [blocked, reports]);

  const value = useMemo(() => {
    const normalize = (u) => (u || '').toLowerCase();

    const isBlocked = (username) => blocked.includes(normalize(username));

    const toggleBlock = (username) => {
      const u = normalize(username);
      if (!u) return;
      setBlocked((prev) => (prev.includes(u) ? prev.filter((x) => x !== u) : [...prev, u]));
    };

    const reportPost = ({ postId, author, reason }) => {
      const r = {
        id: `r_${Date.now()}_${Math.random().toString(16).slice(2)}`,
        postId,
        author: normalize(author),
        reason: reason || '',
        createdAt: Date.now(),
      };
      setReports((prev) => [r, ...prev].slice(0, 200));
      return r;
    };

    return { blocked, reports, isBlocked, toggleBlock, reportPost, clearReports: () => setReports([]) };
  }, [blocked, reports]);

  return <ModerationContext.Provider value={value}>{children}</ModerationContext.Provider>;
}
