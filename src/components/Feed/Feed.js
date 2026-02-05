import React from 'react';
import { Grid, Card, CardContent, Typography, CardMedia } from '@mui/material';

const Post = ({ content, image }) => (
  <Card sx={{ marginBottom: '16px' }}>
    <CardContent>
      <Typography variant="body1">{content}</Typography>
    </CardContent>
    {image && <CardMedia component="img" height="140" image={image} alt="Post image" />}
  </Card>
);

const Feed = () => {
  const posts = [
    { content: "Post 1", image: "https://via.placeholder.com/150" },
    { content: "Post 2", image: "https://via.placeholder.com/150" },
    { content: "Post 3", image: null },
  ];

  return (
    <Grid container spacing={2}>
      {posts.map((post, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Post content={post.content} image={post.image} />
        </Grid>
      ))}
    </Grid>
  );
};

export default Feed;
