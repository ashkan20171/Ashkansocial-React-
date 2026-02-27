export function extractHashtags(text) {
  if (!text) return [];
  const matches = text.match(/#[\p{L}0-9_]+/gu) || [];
  // remove leading # and normalize
  const tags = matches.map((m) => m.slice(1)).filter(Boolean);
  // unique, preserve order
  return [...new Set(tags)];
}

export function extractMentions(text) {
  if (!text) return [];
  const matches = text.match(/@[A-Za-z0-9_]+/g) || [];
  return [...new Set(matches.map((m) => m.slice(1)))];
}
