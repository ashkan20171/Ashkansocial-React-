import React, { useState } from 'react';
import { Container, TextField, Button, Typography } from '@mui/material';

const EditProfile = () => {
  const [username, setUsername] = useState("User");
  const [email, setEmail] = useState("user@example.com");

  const handleSaveChanges = () => {
    alert("Profile updated!");
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Edit Profile
      </Typography>
      <TextField
        label="Username"
        variant="outlined"
        fullWidth
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        sx={{ marginBottom: 2 }}
      />
      <TextField
        label="Email"
        variant="outlined"
        fullWidth
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{ marginBottom: 2 }}
      />
      <Button variant="contained" color="primary" onClick={handleSaveChanges}>
        Save Changes
      </Button>
    </Container>
  );
};

export default EditProfile;
