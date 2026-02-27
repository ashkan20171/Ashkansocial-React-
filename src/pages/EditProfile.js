import React, { useState } from 'react';
import { Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material';
import AppShell from '../components/layout/AppShell';
import { useAuth } from '../context/AuthContext';
import { useUi } from '../context/UiContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';

export default function EditProfile() {
  const { user, updateProfile } = useAuth();
  const { locale } = useUi();
  const toast = useToast();
  const nav = useNavigate();

  const [name, setName] = useState(user?.name || 'Ashkan');
  const [username, setUsername] = useState(user?.username || 'ashkan');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');

  return (
    <AppShell>
      <Stack gap={2}>
        <Typography variant="h6" sx={{ fontWeight: 900, px: 1 }}>
          {locale === 'fa' ? 'ویرایش پروفایل' : 'Edit profile'}
        </Typography>

        <Card elevation={0} sx={{ borderRadius: 3 }}>
          <CardContent>
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
                label={locale === 'fa' ? 'بیو' : 'Bio'}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                fullWidth
                multiline
                minRows={3}
              />
              <TextField
                label={locale === 'fa' ? 'آدرس آواتار (اختیاری)' : 'Avatar URL (optional)'}
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                fullWidth
              />

              <Stack direction="row" gap={1} sx={{ pt: 1 }}>
                <Button
                  variant="contained"
                  sx={{ borderRadius: 999, px: 2.25 }}
                  onClick={() => {
                    updateProfile({
                      name: name.trim() || 'Ashkan',
                      username: username.trim() || 'ashkan',
                      bio,
                      avatar,
                    });
                    toast.show(locale === 'fa' ? 'ذخیره شد' : 'Saved', 'success');
                    nav('/profile');
                  }}
                >
                  {locale === 'fa' ? 'ذخیره' : 'Save'}
                </Button>
                <Button variant="outlined" sx={{ borderRadius: 999, px: 2.25 }} onClick={() => nav(-1)}>
                  {locale === 'fa' ? 'انصراف' : 'Cancel'}
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </AppShell>
  );
}
