import React from 'react';
import { Grid, Card, CardContent, Typography, CardMedia, IconButton } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';

const Post = ({ content, image }) => (
  <Card sx={{ marginBottom: '20px', borderRadius: '15px', boxShadow: 3 }}>
    <CardContent>
      <Typography variant="body1">{content}</Typography>
    </CardContent>
    {image && <CardMedia component="img" height="250" image={image} alt="Post image" />}
    <CardContent sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <IconButton color="primary">
        <ThumbUpIcon />
      </IconButton>
      <IconButton color="primary">
        <ChatBubbleIcon />
      </IconButton>
    </CardContent>
  </Card>
);

const Feed = () => {
  const posts = [
    { content: "Post 1", image: "https://via.placeholder.com/150" },
    { content: "Post 2", image: "https://via.placeholder.com/150" },
    { content: "Post 3", image: null },
  ];

  return (
    <Grid container spacing={3}>
      {posts.map((post, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Post content={post.content} image={post.image} />
        </Grid>
      ))}
    </Grid>
  );
};

export default Feed;
