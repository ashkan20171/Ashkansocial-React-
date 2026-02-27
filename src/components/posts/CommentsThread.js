import React, { useMemo } from 'react';
import { Stack, Typography } from '@mui/material';
import { useUi } from '../../context/UiContext';
import CommentItem from './CommentItem';

function buildTree(comments = []) {
  const byId = new Map();
  comments.forEach((c) => byId.set(c.id, { ...c, children: [] }));
  const roots = [];
  byId.forEach((node) => {
    if (node.parentId && byId.has(node.parentId)) {
      byId.get(node.parentId).children.push(node);
    } else {
      roots.push(node);
    }
  });
  const sortRec = (arr) => {
    arr.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
    arr.forEach((n) => sortRec(n.children));
  };
  sortRec(roots);
  return roots;
}

export default function CommentsThread({
  comments,
  currentUser,
  onToggleLike,
  onReply,
  onEdit,
  onDelete,
}) {
  const { locale } = useUi();

  const tree = useMemo(() => buildTree(comments || []), [comments]);

  if (!tree.length) {
    return (
      <Typography sx={{ opacity: 0.75, fontWeight: 750 }}>
        {locale === 'fa' ? 'هنوز نظری ثبت نشده.' : 'No comments yet.'}
      </Typography>
    );
  }

  const renderNode = (node, depth) => (
    <CommentItem
      key={node.id}
      comment={node}
      depth={depth}
      canDelete={Boolean(currentUser?.username && node?.author?.username && currentUser.username === node.author.username)}
      onToggleLike={onToggleLike}
      onReply={onReply}
      onEdit={(commentId, text) => onEdit?.(commentId, text)}
      onDelete={onDelete}
    >
      {node.children?.length ? (
        <Stack gap={1}>
          {node.children.map((ch) => renderNode(ch, depth + 1))}
        </Stack>
      ) : null}
    </CommentItem>
  );

  return <Stack gap={1}>{tree.map((n) => renderNode(n, 0))}</Stack>;
}
