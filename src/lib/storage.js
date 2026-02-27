// Small, dependency-free storage helpers.
// Default: localStorage. You can pass `storage = 'session'` for sessionStorage.

function pickStorage(storage) {
  return storage === 'session' ? window.sessionStorage : window.localStorage;
}

export function readJson(key, fallback, storage = 'local') {
  try {
    const raw = pickStorage(storage).getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function writeJson(key, value, storage = 'local') {
  try {
    pickStorage(storage).setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

export function remove(key, storage = 'local') {
  try {
    pickStorage(storage).removeItem(key);
  } catch {
    // ignore
  }
}
