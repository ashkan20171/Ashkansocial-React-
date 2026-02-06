import React from 'react';
import { Container, Typography, Box, Button, Avatar, Grid } from '@mui/material';

const Profile = () => {
  return (
    <Container>
      <Box sx={{ textAlign: 'center', marginBottom: 3 }}>
        <Avatar sx={{ width: 100, height: 100, margin: '0 auto' }} />
        <Typography variant="h4" sx={{ marginTop: 2 }}>John Doe</Typography>
        <Typography variant="body1" sx={{ color: 'gray' }}>Bio goes here...</Typography>
        <Button variant="outlined" sx={{ marginTop: 2 }}>Follow</Button>
      </Box>

      <Typography variant="h6" sx={{ marginBottom: 2 }}>User Posts</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <div style={{ background: '#f4f6f9', padding: 20, borderRadius: 10 }}>Post 1</div>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <div style={{ background: '#f4f6f9', padding: 20, borderRadius: 10 }}>Post 2</div>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;
