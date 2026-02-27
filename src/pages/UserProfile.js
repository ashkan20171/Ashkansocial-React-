import React from 'react';
import { useParams } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import ProfileView from '../components/profile/ProfileView';

export default function UserProfile() {
  const { username } = useParams();
  return (
    <AppShell>
      <ProfileView username={username} />
    </AppShell>
  );
}
