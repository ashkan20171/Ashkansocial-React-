import React from 'react';
import { Divider, List, ListItemButton, ListItemIcon, ListItemText, Stack, Typography } from '@mui/material';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ExploreRoundedIcon from '@mui/icons-material/ExploreRounded';
import MailRoundedIcon from '@mui/icons-material/MailRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import BookmarkRoundedIcon from '@mui/icons-material/BookmarkRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import { Link, useLocation } from 'react-router-dom';
import { useUi } from '../../context/UiContext';
import { t } from '../../lib/i18n';

function NavItem({ to, icon, label, active }) {
  return (
    <ListItemButton
      component={Link}
      to={to}
      selected={active}
      sx={{
        borderRadius: 2,
        '&.Mui-selected': {
          bgcolor: 'action.selected',
          '&:hover': { bgcolor: 'action.selected' },
        },
      }}
    >
      <ListItemIcon sx={{ minWidth: 42 }}>{icon}</ListItemIcon>
      <ListItemText primary={label} primaryTypographyProps={{ fontWeight: 800 }} />
    </ListItemButton>
  );
}

export default function SidebarNav() {
  const { pathname } = useLocation();
  const { locale } = useUi();

  return (
    <Stack gap={2} sx={{ p: 1.5 }}>
      <Stack gap={0.25} sx={{ px: 1 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>
          {t(locale, 'brand')}
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.75 }}>
          Social • Clean UI
        </Typography>
      </Stack>

      <Divider />

      <List sx={{ display: 'grid', gap: 0.5 }}>
        <NavItem
          to="/"
          icon={<HomeRoundedIcon />}
          label={t(locale, 'home')}
          active={pathname === '/'}
        />
        <NavItem
          to="/new"
          icon={<AddBoxRoundedIcon />}
          label={t(locale, 'newPost')}
          active={pathname.startsWith('/new')}
        />
        <NavItem
          to="/explore"
          icon={<ExploreRoundedIcon />}
          label={t(locale, 'explore')}
          active={pathname.startsWith('/explore')}
        />
        <NavItem
          to="/messages"
          icon={<MailRoundedIcon />}
          label={t(locale, 'messages')}
          active={pathname.startsWith('/messages')}
        />
        <NavItem
          to="/notifications"
          icon={<NotificationsRoundedIcon />}
          label={t(locale, 'notifications')}
          active={pathname.startsWith('/notifications')}
        />
        <NavItem
          to="/bookmarks"
          icon={<BookmarkRoundedIcon />}
          label={t(locale, 'bookmarks')}
          active={pathname.startsWith('/bookmarks')}
        />
        <NavItem
          to="/profile"
          icon={<PersonRoundedIcon />}
          label={t(locale, 'profile')}
          active={pathname.startsWith('/profile')}
        />
        <NavItem
          to="/settings"
          icon={<SettingsRoundedIcon />}
          label={t(locale, 'settings')}
          active={pathname.startsWith('/settings')}
        />
      </List>
    </Stack>
  );
}
