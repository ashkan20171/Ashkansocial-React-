import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { readJson, writeJson } from '../lib/storage';
import { useModeration } from './ModerationContext';

const PostsContext = createContext(null);

export function usePosts() {
  const ctx = useContext(PostsContext);
  if (!ctx) throw new Error('usePosts must be used within PostsProvider');
  return ctx;
}

const STORAGE_KEY = 'ashkan.posts.v6';

// Small helper for stable IDs in demo mode
function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function seedPosts() {
  const now = Date.now();
  return [
    {
      id: uid(),
      author: { username: 'ashkan', name: 'Ashkan' },
      content: 'Welcome to Ashkan ✨\nTry #hashtags, mentions like @sara, and rich text.',
      createdAt: now - 1000 * 60 * 55,
      tags: ['welcome', 'ashkan'],
      likedByMe: false,
      saved: false,
      pinned: true,
      comments: [],
    },
    {
      id: uid(),
      author: { username: 'sara', name: 'Sara' },
      content: 'New drop: premium UI + moderation tools ✅\n#design #ui',
      createdAt: now - 1000 * 60 * 35,
      tags: ['design', 'ui'],
      likedByMe: true,
      saved: true,
      pinned: false,
      comments: [{ id: uid(), author: { username: 'ashkan', name: 'Ashkan' }, text: 'Looks great 🔥', createdAt: now - 1000 * 60 * 30 }],
    },
  ];
}

export function PostsProvider({ children }) {
  const { isBlocked } = useModeration();

  const [isLoading, setIsLoading] = useState(true);

  const [allPosts, setAllPosts] = useState(() => {
    const persisted = readJson(STORAGE_KEY, null);
    if (Array.isArray(persisted) && persisted.length) return persisted;
    const initial = seedPosts();
    writeJson(STORAGE_KEY, initial);
    return initial;
  });

  // Simulate a tiny loading time for skeletons.
  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 420);
    return () => clearTimeout(t);
  }, []);

  // Persist
  useEffect(() => {
    writeJson(STORAGE_KEY, allPosts);
  }, [allPosts]);

  // Filter blocked users at the very edge so the app never sees blocked content.
  const posts = useMemo(() => {
    return allPosts.filter((p) => !isBlocked(p?.author?.username));
  }, [allPosts, isBlocked]);

  const toggleLike = useCallback((postId) => {
    setAllPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, likedByMe: !p.likedByMe } : p))
    );
  }, []);

  const toggleSave = useCallback((postId) => {
    setAllPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, saved: !p.saved } : p))
    );
  }, []);

  const togglePin = useCallback((postId) => {
    setAllPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, pinned: !p.pinned } : p))
    );
  }, []);

  const addPost = useCallback((post) => {
    const next = { ...post, id: post.id || uid(), createdAt: post.createdAt || Date.now(), comments: post.comments || [] };
    setAllPosts((prev) => [next, ...prev]);
  }, []);

  const deletePost = useCallback((postId) => {
    setAllPosts((prev) => prev.filter((p) => p.id !== postId));
  }, []);

  const addComment = useCallback((postId, comment) => {
    setAllPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const c = typeof comment === 'string'
          ? { id: uid(), author: { username: 'me', name: 'You' }, text: comment, createdAt: Date.now() }
          : { id: uid(), createdAt: Date.now(), ...comment };
        return { ...p, comments: [...(p.comments || []), c] };
      })
    );
  }, []);

  const value = useMemo(
    () => ({
      posts,
      allPosts, // kept for internal pages that want unfiltered access; prefer posts.
      isLoading,
      addPost,
      deletePost,
      toggleLike,
      toggleSave,
      togglePin,
      addComment,
    }),
    [posts, allPosts, isLoading, addPost, deletePost, toggleLike, toggleSave, togglePin, addComment]
  );

  return <PostsContext.Provider value={value}>{children}</PostsContext.Provider>;
}
