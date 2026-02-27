import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { readJson, writeJson } from '../lib/storage';

const UiContext = createContext(null);

export function useUi() {
  const ctx = useContext(UiContext);
  if (!ctx) throw new Error('useUi must be used within UiProvider');
  return ctx;
}

// ✅ v3: direction is derived from locale (en->ltr, fa->rtl) and is NOT stored separately
const STORAGE_KEY = 'ashkan.ui.v3';
const LEGACY_KEY = 'ashkan.ui.v2';

export function UiProvider({ children }) {
  const persisted = readJson(STORAGE_KEY, null);
  const legacy = persisted ? null : readJson(LEGACY_KEY, null);

  // Migrate ONLY color mode from legacy.
  // Default to dark for a more premium, less "white" experience on fresh starts.
  const [mode, setMode] = useState(persisted?.mode || legacy?.mode || 'dark');

  // Default language: English. Persisted locale is respected.
  const [locale, setLocaleState] = useState(persisted?.locale || 'en');

  const [searchQuery, setSearchQuery] = useState('');

  // ✅ direction strictly follows locale
  const direction = locale === 'fa' ? 'rtl' : 'ltr';

  useEffect(() => {
    writeJson(STORAGE_KEY, { mode, locale });
  }, [mode, locale]);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = direction;
    document.body.dir = direction;
  }, [locale, direction]);

  const setLocale = (nextLocale) => {
    const v = nextLocale === 'fa' ? 'fa' : 'en';
    setLocaleState(v);
  };

  const value = useMemo(
    () => ({
      mode,
      setMode,
      locale,
      setLocale,
      direction,

      searchQuery,
      setSearchQuery,
      clearSearch: () => setSearchQuery(''),

      toggleMode: () => setMode((m) => (m === 'dark' ? 'light' : 'dark')),
      toggleLocale: () => setLocaleState((l) => (l === 'fa' ? 'en' : 'fa')),

      // direction is derived; keep a no-op to avoid crashes if old UI still calls it
      toggleDirection: () => {},
    }),
    [mode, locale, direction, searchQuery]
  );

  return <UiContext.Provider value={value}>{children}</UiContext.Provider>;
}
