import React, { useState } from 'react';
import { Container, Typography, Button } from '@mui/material';

const Profile = () => {
  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollow = () => {
    setIsFollowing(!isFollowing); // تغییر وضعیت دنبال کردن
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        User Profile
      </Typography>
      <Typography variant="body1" paragraph>
        This is where user details and posts will be displayed.
      </Typography>
      <Button variant="contained" color={isFollowing ? "secondary" : "primary"} onClick={handleFollow}>
        {isFollowing ? "Unfollow" : "Follow"}
      </Button>
    </Container>
  );
};

export default Profile;
