import React, { useMemo, useState } from 'react';
import {
  AppBar,
  Avatar,
  Box,
  Badge,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  InputBase,
  alpha,
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import TranslateRoundedIcon from '@mui/icons-material/TranslateRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useUi } from '../../context/UiContext';
import { useNotifications } from '../../context/NotificationsContext';
import { t } from '../../lib/i18n';
import LogoMark from '../common/LogoMark';

export default function TopBar({ onSearch }) {
  const { isAuthenticated, user, logout } = useAuth();
  const { mode, toggleMode, locale, toggleLocale } = useUi();
    const direction = locale === 'fa' ? 'rtl' : 'ltr';
const navigate = useNavigate();
  const { unreadCount } = useNotifications();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const initials = useMemo(() => {
    const n = (user?.name || 'A').trim();
    return n.split(' ').slice(0, 2).map((p) => p[0]).join('').toUpperCase();
  }, [user]);

  return (
    <AppBar position="sticky" color="transparent" elevation={0}>
      <Toolbar sx={{ gap: 1.5 }}>
        <Stack direction="row" alignItems="center" gap={1.2} sx={{ mr: 1 }}>
          <LogoMark size={30} />
          <Typography variant="h6" sx={{ fontWeight: 900 }}>
            {t(locale, 'brand')}
          </Typography>
          <Chip
            size="small"
            label="Social"
            sx={{
              ml: 0.5,
              fontWeight: 800,
              bgcolor: (th) => alpha(th.palette.secondary.main, th.palette.mode === 'dark' ? 0.18 : 0.12),
            }}
          />
        </Stack>

        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <Box
            sx={(th) => ({
              width: 'min(720px, 100%)',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 1.5,
              py: 0.75,
              borderRadius: 999,
              border: `1px solid ${alpha(th.palette.text.primary, th.palette.mode === 'dark' ? 0.12 : 0.08)}`,
              bgcolor: alpha(th.palette.background.paper, th.palette.mode === 'dark' ? 0.55 : 0.7),
            })}
          >
            <SearchRoundedIcon sx={{ opacity: 0.7 }} />
            <InputBase
              placeholder={t(locale, 'searchPlaceholder')}
              onChange={(e) => onSearch?.(e.target.value)}
              sx={{ flex: 1 }}
            />
          </Box>
        </Box>

        <Stack direction="row" alignItems="center" gap={0.5}>
          <Tooltip title={t(locale, 'darkMode')}>
            <IconButton onClick={toggleMode}>
              {mode === 'dark' ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip title={t(locale, 'language')}>
            <IconButton onClick={toggleLocale}>
              <TranslateRoundedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={t(locale, 'notifications')}>
            <IconButton onClick={() => navigate('/notifications')}>
              <Badge badgeContent={unreadCount} color="secondary">
                <NotificationsRoundedIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
            <Avatar
              src={user?.avatar || ''}
              sx={{ width: 34, height: 34, fontWeight: 900, bgcolor: 'primary.main' }}
            >
              {initials}
            </Avatar>
          </IconButton>

          <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
            <MenuItem
              onClick={() => {
                setAnchorEl(null);
                navigate('/profile');
              }}
            >
              <PersonRoundedIcon fontSize="small" style={{ marginInlineEnd: 10 }} />
              {t(locale, 'profile')}
            </MenuItem>
            {isAuthenticated ? (
              <MenuItem
                onClick={() => {
                  setAnchorEl(null);
                  logout();
                  navigate('/');
                }}
              >
                <LogoutRoundedIcon fontSize="small" style={{ marginInlineEnd: 10 }} />
                {t(locale, 'logout')}
              </MenuItem>
            ) : (
              <MenuItem
                onClick={() => {
                  setAnchorEl(null);
                  navigate('/login');
                }}
              >
                <LoginRoundedIcon fontSize="small" style={{ marginInlineEnd: 10 }} />
                {t(locale, 'login')}
              </MenuItem>
            )}
            <MenuItem disabled>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                {locale.toUpperCase()} • {direction.toUpperCase()}
              </Typography>
            </MenuItem>
          </Menu>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
