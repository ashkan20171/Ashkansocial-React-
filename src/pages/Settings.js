import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import AppShell from '../components/layout/AppShell';
import { useUi } from '../context/UiContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Settings() {
  const { mode, toggleMode, locale, toggleLocale, direction, toggleDirection } = useUi();
  const { user } = useAuth();
  const toast = useToast();

  const [tab, setTab] = useState(0);
  const [status, setStatus] = useState(user?.status || '');

  return (
    <AppShell>
      <Stack gap={2}>
        <Typography variant="h5" sx={{ fontWeight: 950 }}>
          {locale === 'fa' ? 'تنظیمات' : 'Settings'}
        </Typography>

        <Card elevation={0} sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            variant="scrollable"
            allowScrollButtonsMobile
            sx={{ px: 1.5 }}
          >
            <Tab label={locale === 'fa' ? 'ظاهر' : 'Appearance'} sx={{ fontWeight: 900 }} />
            <Tab label={locale === 'fa' ? 'حساب' : 'Account'} sx={{ fontWeight: 900 }} />
            <Tab label={locale === 'fa' ? 'حریم خصوصی' : 'Privacy'} sx={{ fontWeight: 900 }} />
          </Tabs>

          <Divider />

          <CardContent sx={{ p: 2.25 }}>
            {tab === 0 ? (
              <Stack gap={2}>
                <SettingRow
                  title={locale === 'fa' ? 'حالت تاریک' : 'Dark mode'}
                  desc={locale === 'fa' ? 'برای شب و تمرکز بهتر.' : 'Better for night and focus.'}
                >
                  <Switch checked={mode === 'dark'} onChange={toggleMode} />
                </SettingRow>

                <SettingRow
                  title={locale === 'fa' ? 'زبان' : 'Language'}
                  desc={locale === 'fa' ? 'فارسی / انگلیسی' : 'Persian / English'}
                >
                  <Button onClick={toggleLocale} sx={{ borderRadius: 999, fontWeight: 900 }} variant="outlined">
                    {locale === 'fa' ? 'تغییر' : 'Toggle'}
                  </Button>
                </SettingRow>

                <SettingRow
                  title={locale === 'fa' ? 'جهت' : 'Direction'}
                  desc={locale === 'fa' ? 'RTL / LTR' : 'RTL / LTR'}
                >
                  <Button onClick={toggleDirection} sx={{ borderRadius: 999, fontWeight: 900 }} variant="outlined">
                    {direction.toUpperCase()}
                  </Button>
                </SettingRow>
              </Stack>
            ) : null}

            {tab === 1 ? (
              <Stack gap={2}>
                <Typography sx={{ fontWeight: 950 }}>
                  {locale === 'fa' ? 'پروفایل' : 'Profile'}
                </Typography>

                <TextField
                  label={locale === 'fa' ? 'استاتوس' : 'Status'}
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  placeholder={locale === 'fa' ? 'مثلاً: در حال یادگیری React' : 'e.g., Learning React'}
                  fullWidth
                />

                <Box>
                  <Button
                    variant="contained"
                    sx={{ borderRadius: 999, fontWeight: 950 }}
                    onClick={() => toast.success(locale === 'fa' ? 'ذخیره شد (دمو).' : 'Saved (demo).')}
                  >
                    {locale === 'fa' ? 'ذخیره' : 'Save'}
                  </Button>
                </Box>

                <Divider />

                <Typography sx={{ opacity: 0.8, fontWeight: 700 }}>
                  {locale === 'fa'
                    ? 'نکته: در این نسخه فقط فرانت‌اند است؛ اتصال به بک‌اند در مرحله بعد.'
                    : 'Note: This is frontend-only; backend integration comes next.'}
                </Typography>
              </Stack>
            ) : null}

            {tab === 2 ? (
              <Stack gap={2}>
                <SettingRow
                  title={locale === 'fa' ? 'اکانت خصوصی' : 'Private account'}
                  desc={locale === 'fa' ? 'فقط دنبال‌کننده‌ها پست‌ها را ببینند.' : 'Only followers can see your posts.'}
                >
                  <Switch defaultChecked={false} />
                </SettingRow>
                <SettingRow
                  title={locale === 'fa' ? 'پنهان کردن آنلاین بودن' : 'Hide online status'}
                  desc={locale === 'fa' ? 'نمایش وضعیت آنلاین/آفلاین.' : 'Show online/offline status.'}
                >
                  <Switch defaultChecked />
                </SettingRow>
                <SettingRow
                  title={locale === 'fa' ? 'تایید درخواست پیام' : 'Message requests'}
                  desc={locale === 'fa' ? 'قبل از ارسال پیام تایید بگیر.' : 'Require approval before messaging.'}
                >
                  <Switch defaultChecked />
                </SettingRow>
              </Stack>
            ) : null}
          </CardContent>
        </Card>
      </Stack>
    </AppShell>
  );
}

function SettingRow({ title, desc, children }) {
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2}>
      <Box sx={{ flex: 1 }}>
        <Typography sx={{ fontWeight: 950 }}>{title}</Typography>
        <Typography variant="caption" sx={{ opacity: 0.78, fontWeight: 700 }}>
          {desc}
        </Typography>
      </Box>
      <Box>{children}</Box>
    </Stack>
  );
}
