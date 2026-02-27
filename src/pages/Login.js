import React, { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  alpha,
} from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
// Import icons via their explicit paths to avoid default/named interop issues across bundlers.
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';
import { useAuth } from '../context/AuthContext';
import { useUi } from '../context/UiContext';
import LogoMark from '../components/common/LogoMark';
import { useToast } from '../context/ToastContext';

function AuthBackdrop() {
  return (
    <Box
      aria-hidden
      sx={(th) => ({
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        '& .blob': {
          position: 'absolute',
          width: { xs: 420, md: 560 },
          height: { xs: 420, md: 560 },
          borderRadius: '50%',
          filter: 'blur(40px)',
          opacity: th.palette.mode === 'dark' ? 0.28 : 0.22,
          animation: 'ashkanFloat 6.5s ease-in-out infinite',
        },
        '& .blob.one': {
          left: { xs: -240, md: -260 },
          top: { xs: -220, md: -260 },
          background: `radial-gradient(circle at 30% 30%, ${th.palette.secondary.main}, transparent 60%)`,
        },
        '& .blob.two': {
          right: { xs: -260, md: -280 },
          bottom: { xs: -260, md: -320 },
          background: `radial-gradient(circle at 30% 30%, ${th.palette.primary.main}, transparent 60%)`,
          animationDelay: '1.2s',
        },
        '& .grain': {
          position: 'absolute',
          inset: 0,
          opacity: th.palette.mode === 'dark' ? 0.12 : 0.08,
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27160%27 height=%27160%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.9%27 numOctaves=%272%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27160%27 height=%27160%27 filter=%27url(%23n)%27 opacity=%270.35%27/%3E%3C/svg%3E")',
          mixBlendMode: th.palette.mode === 'dark' ? 'overlay' : 'soft-light',
        },
      })}
    >
      <Box className="blob one" />
      <Box className="blob two" />
      <Box className="grain" />
    </Box>
  );
}

export default function Login() {
  const { login } = useAuth();
  const { locale } = useUi();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || '/';

  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [capsOn, setCapsOn] = useState(false);

  const strings = useMemo(() => {
    const fa = locale === 'fa';
    return {
      title: fa ? 'خوش اومدی 👋' : 'Welcome back 👋',
      subtitle: fa ? 'به Ashkan وارد شو و با دوستانت در ارتباط باش.' : 'Sign in to Ashkan and stay connected.',
      displayName: fa ? 'نام نمایشی (اختیاری)' : 'Display name (optional)',
      username: fa ? 'نام کاربری' : 'Username',
      password: fa ? 'رمز عبور' : 'Password',
      remember: fa ? 'مرا به خاطر بسپار' : 'Remember me',
      forgot: fa ? 'رمز را فراموش کردی؟' : 'Forgot password?',
      signIn: fa ? 'ورود' : 'Sign in',
      or: fa ? 'یا' : 'or',
      continueGoogle: fa ? 'ادامه با Google' : 'Continue with Google',
      continueGitHub: fa ? 'ادامه با GitHub' : 'Continue with GitHub',
      noAcc: fa ? 'حساب نداری؟ ' : "Don't have an account? ",
      signup: fa ? 'ثبت‌نام' : 'Sign up',
      demoNote: fa ? 'دمو: هر نام کاربری‌ای وارد کنی وارد میشی.' : 'Demo: any username will work.',
      needUser: fa ? 'نام کاربری را وارد کن' : 'Enter a username',
      demoLogin: fa ? 'ورود سریع دمو' : 'Quick demo login',
    };
  }, [locale]);

  const strength = useMemo(() => {
    const p = password || '';
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    const label = score <= 1 ? (locale === 'fa' ? 'ضعیف' : 'Weak') : score === 2 ? (locale === 'fa' ? 'متوسط' : 'Medium') : (locale === 'fa' ? 'قوی' : 'Strong');
    return { score, label };
  }, [password, locale]);

  const handleSignIn = async () => {
    if (!username.trim()) {
      toast.show(strings.needUser, 'warning');
      return;
    }
    if (password && password.length < 4) {
      toast.show(locale === 'fa' ? 'رمز عبور خیلی کوتاه است' : 'Password is too short', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      // simulate API latency for premium UX
      await new Promise((r) => setTimeout(r, 520));
      login({ username: username.trim(), name: name.trim() || undefined, remember });
      toast.show(locale === 'fa' ? 'خوش اومدی!' : 'Welcome!', 'success');
      navigate(redirectTo, { replace: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={(th) => ({
        minHeight: '100vh',
        position: 'relative',
        display: 'grid',
        placeItems: 'center',
        py: 5,
        '@keyframes ashkanEnter': {
          '0%': { opacity: 0, transform: 'translateY(10px) scale(0.99)' },
          '100%': { opacity: 1, transform: 'translateY(0) scale(1)' },
        },
      })}
    >
      <AuthBackdrop />

      <Container maxWidth="md" sx={{ position: 'relative' }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          sx={(th) => ({
            borderRadius: 5,
            overflow: 'hidden',
            border: `1px solid ${th.palette.mode === 'dark' ? 'rgba(255,255,255,0.10)' : 'rgba(15,23,42,0.08)'}`,
            background:
              th.palette.mode === 'dark'
                ? 'linear-gradient(180deg, rgba(15,23,42,0.85), rgba(2,6,23,0.85))'
                : 'linear-gradient(180deg, rgba(255,255,255,0.90), rgba(248,250,252,0.90))',
            backdropFilter: 'blur(16px) saturate(160%)',
            boxShadow: th.palette.mode === 'dark' ? '0 40px 90px rgba(0,0,0,0.65)' : '0 40px 90px rgba(2,6,23,0.22)',
          })}
        >
          {/* Left: Brand / Story */}
          <Box
            sx={(th) => ({
              p: { xs: 3.25, md: 4 },
              flex: 1,
              position: 'relative',
              background: `radial-gradient(900px 360px at 10% 0%, ${th.palette.secondary.main}22, transparent 55%), radial-gradient(900px 420px at 90% 0%, ${th.palette.primary.main}22, transparent 55%)`,
              animation: 'ashkanEnter 520ms cubic-bezier(.2,.8,.2,1) both',
            })}
          >
            <Stack direction="row" alignItems="center" gap={1.25}>
              <LogoMark size={40} />
              <Stack>
                <Typography variant="h6" sx={{ fontWeight: 950, letterSpacing: -0.4 }}>
                  Ashkan
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.78, fontWeight: 700 }}>
                  {strings.demoNote}
                </Typography>
              </Stack>
            </Stack>

            <Box sx={{ height: 24 }} />

            <Typography
              variant="h4"
              sx={{
                fontWeight: 980,
                letterSpacing: -1,
                lineHeight: 1.06,
                maxWidth: 420,
              }}
            >
              {strings.title}
            </Typography>
            <Typography sx={{ mt: 1.25, opacity: 0.82, fontWeight: 650, maxWidth: 520 }}>
              {strings.subtitle}
            </Typography>

            <Box sx={{ height: 26 }} />

            <Stack gap={1.1} sx={{ maxWidth: 520 }}>
              {[
                locale === 'fa' ? 'فید هوشمند + هشتگ‌ها + پروفایل تب‌دار' : 'Smart feed + hashtags + tabbed profile',
                locale === 'fa' ? 'پیام‌رسان + اعلان‌ها + ذخیره‌سازی محلی' : 'Messages + notifications + local persistence',
                locale === 'fa' ? 'Dark/Light + RTL/LTR + طراحی Premium' : 'Dark/Light + RTL/LTR + premium design',
              ].map((txt) => (
                <Stack
                  key={txt}
                  direction="row"
                  gap={1}
                  alignItems="center"
                  sx={(th) => ({
                    px: 1.25,
                    py: 1,
                    borderRadius: 3,
                    border: `1px solid ${th.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.06)'}`,
                    background: th.palette.mode === 'dark' ? 'rgba(2,6,23,0.22)' : 'rgba(255,255,255,0.55)',
                  })}
                >
                  <Box
                    sx={(th) => ({
                      width: 10,
                      height: 10,
                      borderRadius: 99,
                      background: `linear-gradient(135deg, ${th.palette.secondary.main}, ${th.palette.primary.main})`,
                    })}
                  />
                  <Typography variant="body2" sx={{ fontWeight: 750, opacity: 0.9 }}>
                    {txt}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Box>

          {/* Right: Form */}
          <Box
            sx={{
              p: { xs: 3.25, md: 4 },
              width: { xs: '100%', md: 420 },
              animation: 'ashkanEnter 520ms cubic-bezier(.2,.8,.2,1) both',
              animationDelay: '90ms',
            }}
          >
            <Stack gap={1.5}>
              <Typography variant="h6" sx={{ fontWeight: 950 }}>
                {locale === 'fa' ? 'ورود' : 'Sign in'}
              </Typography>

              <Stack gap={1.2}>
                <TextField
                  label={strings.displayName}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  fullWidth
                />
                <TextField
                  label={strings.username}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSignIn();
                  }}
                  fullWidth
                  autoFocus
                />
                <TextField
                  label={strings.password}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                  type={showPass ? 'text' : 'password'}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSignIn();
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPass((s) => !s)} edge="end" aria-label="toggle password">
                          {showPass ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <FormControlLabel
                    control={<Checkbox checked={remember} onChange={(e) => setRemember(e.target.checked)} />}
                    label={<Typography sx={{ fontWeight: 750 }}>{strings.remember}</Typography>}
                  />
                  <Typography
                    component="button"
                    type="button"
                    onClick={() => toast.show(locale === 'fa' ? 'دمو است 🙂' : "It's a demo 🙂", 'info')}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer',
                      fontWeight: 800,
                      opacity: 0.8,
                    }}
                  >
                    {strings.forgot}
                  </Typography>
                </Stack>

                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardRoundedIcon />}
                  sx={(th) => ({
                    borderRadius: 999,
                    py: 1.25,
                    fontWeight: 950,
                    position: 'relative',
                    overflow: 'hidden',
                    background: `linear-gradient(135deg, ${th.palette.primary.main}, ${th.palette.secondary.main})`,
                    boxShadow:
                      th.palette.mode === 'dark'
                        ? '0 14px 40px rgba(6,182,212,0.35)'
                        : '0 14px 40px rgba(30,58,138,0.25)',
                    transition: 'transform 180ms ease, box-shadow 180ms ease, filter 180ms ease',
                    '&:before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      bottom: 0,
                      left: 0,
                      width: '50%',
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.30), transparent)',
                      transform: 'translateX(-120%)',
                    },
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow:
                        th.palette.mode === 'dark'
                          ? '0 20px 50px rgba(6,182,212,0.45)'
                          : '0 20px 50px rgba(30,58,138,0.35)',
                      filter: 'saturate(1.06)',
                    },
                    '&:hover:before': { animation: 'ashkanShine 900ms ease' },
                    '&:active': { transform: 'translateY(-1px) scale(0.99)' },
                  })}
                  disabled={isSubmitting}
                  onClick={() => {
                    handleSignIn();
                  }}
                >
                  {isSubmitting ? (locale === 'fa' ? 'در حال ورود...' : 'Signing in...') : strings.signIn}
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<ArrowForwardRoundedIcon />}
                  sx={(th) => ({
                    borderRadius: 999,
                    fontWeight: 900,
                    py: 1.25,
                    borderColor: alpha(th.palette.secondary.main, th.palette.mode === 'dark' ? 0.55 : 0.45),
                    backgroundColor: alpha(th.palette.secondary.main, th.palette.mode === 'dark' ? 0.08 : 0.04),
                    '&:hover': {
                      borderColor: alpha(th.palette.secondary.main, th.palette.mode === 'dark' ? 0.75 : 0.65),
                      backgroundColor: alpha(th.palette.secondary.main, th.palette.mode === 'dark' ? 0.14 : 0.08),
                      transform: 'translateY(-1px)',
                    },
                    transition: 'all 180ms ease',
                  })}
                  disabled={isSubmitting}
                  onClick={() => {
                    login({ username: 'demo', name: locale === 'fa' ? 'کاربر دمو' : 'Demo User', remember });
                    toast.show(locale === 'fa' ? 'ورود دمو انجام شد ✅' : 'Demo login ✅', 'success');
                    navigate(redirectTo, { replace: true });
                  }}
                >
                  {strings.demoLogin}
                </Button>

                <Divider sx={{ my: 0.4 }}>
                  <Typography sx={{ fontWeight: 850, opacity: 0.8 }}>{strings.or}</Typography>
                </Divider>

                <Stack direction={{ xs: 'column', sm: 'row' }} gap={1}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<GoogleIcon />}
                    sx={(th) => ({
                      borderRadius: 999,
                      py: 1.1,
                      fontWeight: 900,
                      borderColor: th.palette.mode === 'dark' ? 'rgba(255,255,255,0.18)' : 'rgba(2,6,23,0.16)',
                      backgroundColor: th.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.55)',
                      transition: 'transform 160ms ease, background-color 180ms ease, border-color 180ms ease',
                      '&:hover': {
                        transform: 'translateY(-1px)',
                        backgroundColor: th.palette.mode === 'dark' ? 'rgba(255,255,255,0.07)' : 'rgba(2,6,23,0.03)',
                        borderColor: th.palette.mode === 'dark' ? 'rgba(255,255,255,0.28)' : 'rgba(2,6,23,0.22)',
                      },
                    })}
                    onClick={() => toast.show(locale === 'fa' ? 'دمو: ورود با Google فعال نیست' : 'Demo: Google sign-in is disabled', 'info')}
                  >
                    {strings.continueGoogle}
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<GitHubIcon />}
                    sx={(th) => ({
                      borderRadius: 999,
                      py: 1.1,
                      fontWeight: 900,
                      borderColor: th.palette.mode === 'dark' ? 'rgba(255,255,255,0.18)' : 'rgba(2,6,23,0.16)',
                      backgroundColor: th.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.55)',
                      transition: 'transform 160ms ease, background-color 180ms ease, border-color 180ms ease',
                      '&:hover': {
                        transform: 'translateY(-1px)',
                        backgroundColor: th.palette.mode === 'dark' ? 'rgba(255,255,255,0.07)' : 'rgba(2,6,23,0.03)',
                        borderColor: th.palette.mode === 'dark' ? 'rgba(255,255,255,0.28)' : 'rgba(2,6,23,0.22)',
                      },
                    })}
                    onClick={() => toast.show(locale === 'fa' ? 'دمو: ورود با GitHub فعال نیست' : 'Demo: GitHub sign-in is disabled', 'info')}
                  >
                    {strings.continueGitHub}
                  </Button>
                </Stack>

                <Typography variant="body2" sx={{ opacity: 0.85, fontWeight: 750 }}>
                  {strings.noAcc}
                  <Link to="/register">{strings.signup}</Link>
                </Typography>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
