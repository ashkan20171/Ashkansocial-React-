import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

export default function TextRenderer({ text = '' }) {
  const navigate = useNavigate();
  const theme = useTheme();

  const parts = text.split(/(@[\p{L}0-9_]+|#[\p{L}0-9_]+)/gu);

  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('@')) {
          const username = part.slice(1);
          return (
            <span
              key={i}
              onClick={() => navigate(`/profile?u=${encodeURIComponent(username)}`)}
              style={{
                cursor: 'pointer',
                fontWeight: 900,
                color: theme.palette.primary.main,
              }}
            >
              {part}
            </span>
          );
        }

        if (part.startsWith('#')) {
          const tag = part.slice(1);
          return (
            <span
              key={i}
              onClick={() => navigate(`/tag/${encodeURIComponent(tag)}`)}
              style={{
                cursor: 'pointer',
                fontWeight: 900,
                color: theme.palette.secondary.main,
              }}
            >
              {part}
            </span>
          );
        }

        return <span key={i}>{part}</span>;
      })}
    </>
  );
}
