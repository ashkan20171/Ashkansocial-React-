import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // استفاده از AuthContext

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    // فرض کنید برای ورود از نام کاربری "user" و رمز عبور "password" استفاده می‌کنیم
    if (username === 'user' && password === 'password') {
      login(); // کاربر وارد شده است
      navigate('/'); // هدایت به صفحه خانه پس از ورود
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <Container>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 8 }}>
        <Typography variant="h4" gutterBottom>
          Login to Ashkan Social
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
          label="Password"
          variant="outlined"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ marginBottom: 2 }}
        />
        <Button variant="contained" color="primary" onClick={handleLogin} fullWidth>
          Login
        </Button>
        <Box sx={{ marginTop: 2 }}>
          <Typography variant="body2">
            Don't have an account? <a href="/register">Sign up</a>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
