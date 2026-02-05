import React from 'react';
import { Typography, Container } from '@mui/material';
import Feed from '../components/Feed/Feed';

const Home = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Welcome to Ashkan Social!
      </Typography>
      <Feed />
    </Container>
  );
};

export default Home;
