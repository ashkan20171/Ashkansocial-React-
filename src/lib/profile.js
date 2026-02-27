import { readJson, writeJson } from './storage';

export function profileKey(username) {
  return `ashkan.profile.${username || 'unknown'}.v1`;
}

export function readProfile(username, fallback = null) {
  return readJson(profileKey(username), fallback);
}

export function writeProfile(username, value) {
  return writeJson(profileKey(username), value);
}

export function getInitials(name) {
  const n = (name || 'U').trim();
  return n.split(' ').slice(0, 2).map((p) => p[0]).join('').toUpperCase();
}
