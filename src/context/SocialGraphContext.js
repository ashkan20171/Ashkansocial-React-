import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { readJson, writeJson } from '../lib/storage';

const SocialGraphContext = createContext(null);
const KEY = 'ashkan.graph.v1';

const seed = {
  // username -> { followers:Set, following:Set } represented as arrays
  ashkan: { followers: ['sara', 'reza'], following: ['sara'] },
  sara: { followers: ['ashkan'], following: ['ashkan', 'reza'] },
  reza: { followers: ['sara'], following: [] },
};

function normalize(graph) {
  const g = graph || {};
  for (const u of Object.keys(g)) {
    g[u] = {
      followers: Array.from(new Set(g[u]?.followers || [])),
      following: Array.from(new Set(g[u]?.following || [])),
    };
  }
  return g;
}

export function SocialGraphProvider({ children }) {
  const [graph, setGraph] = useState(() => normalize(readJson(KEY, null) || seed));

  useEffect(() => {
    writeJson(KEY, normalize(graph));
  }, [graph]);

  const ensureUser = useCallback((username) => {
    if (!username) return;
    setGraph((prev) => {
      if (prev[username]) return prev;
      return { ...prev, [username]: { followers: [], following: [] } };
    });
  }, []);

  const stats = useCallback(
    (username) => {
      const u = graph[username] || { followers: [], following: [] };
      return { followers: u.followers.length, following: u.following.length };
    },
    [graph]
  );

  const isFollowing = useCallback(
    (viewer, target) => {
      if (!viewer || !target) return false;
      return (graph[viewer]?.following || []).includes(target);
    },
    [graph]
  );

  const toggleFollow = useCallback((viewer, target) => {
    if (!viewer || !target || viewer === target) return;

    setGraph((prev) => {
      const g = normalize({ ...prev });
      if (!g[viewer]) g[viewer] = { followers: [], following: [] };
      if (!g[target]) g[target] = { followers: [], following: [] };

      const isF = (g[viewer].following || []).includes(target);
      g[viewer].following = isF ? g[viewer].following.filter((x) => x !== target) : [...g[viewer].following, target];
      g[target].followers = isF ? g[target].followers.filter((x) => x !== viewer) : [...g[target].followers, viewer];

      return g;
    });
  }, []);

  const value = useMemo(
    () => ({
      graph,
      ensureUser,
      stats,
      isFollowing,
      toggleFollow,
    }),
    [graph, ensureUser, stats, isFollowing, toggleFollow]
  );

  return <SocialGraphContext.Provider value={value}>{children}</SocialGraphContext.Provider>;
}

export function useSocialGraph() {
  const ctx = useContext(SocialGraphContext);
  if (!ctx) throw new Error('useSocialGraph must be used within SocialGraphProvider');
  return ctx;
}
