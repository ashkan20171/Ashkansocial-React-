import React, { useState } from 'react';
import { Box, Button, Card, CardContent, Container, Stack, TextField, Typography } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUi } from '../context/UiContext';
import { useToast } from '../context/ToastContext';
import LogoMark from '../components/common/LogoMark';

export default function Register() {
  const { login } = useAuth();
  const { locale } = useUi();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || '/';

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Card elevation={0} sx={{ borderRadius: 4, overflow: 'hidden' }}>
        <Box
          sx={(th) => ({
            p: 3,
            background: `linear-gradient(135deg, ${th.palette.secondary.main}, ${th.palette.primary.main})`,
            color: 'white',
          })}
        >
          <Stack direction="row" alignItems="center" gap={1.25}>
            <LogoMark size={34} />
            <Stack>
              <Typography variant="h6" sx={{ fontWeight: 950 }}>
                {locale === 'fa' ? 'ثبت‌نام در اشکان' : 'Create your Ashkan account'}
              </Typography>
              <Typography sx={{ opacity: 0.9, fontWeight: 600 }} variant="body2">
                {locale === 'fa'
                  ? 'این یک دمو است؛ ثبت‌نام واقعی با بک‌اند انجام می‌شود.'
                  : 'This is a demo; real signup will come with the backend.'}
              </Typography>
            </Stack>
          </Stack>
        </Box>

        <CardContent sx={{ p: 3 }}>
          <Stack gap={1.25}>
            <TextField
              label={locale === 'fa' ? 'نام' : 'Name'}
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
            />
            <TextField
              label={locale === 'fa' ? 'نام کاربری' : 'Username'}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
            />
            <TextField
              label={locale === 'fa' ? 'ایمیل (اختیاری)' : 'Email (optional)'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
            />
            <Button
              variant="contained"
              sx={{ borderRadius: 999, py: 1.2, fontWeight: 900 }}
              onClick={() => {
                if (!username.trim()) {
                  toast.show(locale === 'fa' ? 'نام کاربری را وارد کن' : 'Enter a username', 'warning');
                  return;
                }
                login({ username: username.trim(), name: name.trim() });
                toast.show(locale === 'fa' ? 'حساب ساخته شد' : 'Account created', 'success');
                navigate(redirectTo, { replace: true });
              }}
            >
              {locale === 'fa' ? 'ساخت حساب' : 'Create account'}
            </Button>

            <Typography variant="body2" sx={{ opacity: 0.8, fontWeight: 700 }}>
              {locale === 'fa' ? 'قبلاً حساب داری؟ ' : 'Already have an account? '}
              <Link to="/login">{locale === 'fa' ? 'ورود' : 'Sign in'}</Link>
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}
