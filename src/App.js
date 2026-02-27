import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';

import { UiProvider, useUi } from './context/UiContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { NotificationsProvider } from './context/NotificationsContext';
import { PostsProvider } from './context/PostsContext';
import { ModerationProvider } from './context/ModerationContext';
import { SocialGraphProvider } from './context/SocialGraphContext';
import { MessagesProvider } from './context/MessagesContext';

import { createAppTheme } from './theme/createAppTheme';
import PageTransition from './components/common/PageTransition';
import ProtectedRoute from './components/common/ProtectedRoute';
import PublicOnlyRoute from './components/common/PublicOnlyRoute';
import ErrorBoundary from './components/common/ErrorBoundary';
import RouteFallback from './components/common/RouteFallback';

// Route-level code splitting (Stage 21)
const Home = React.lazy(() => import('./pages/Home'));
const Explore = React.lazy(() => import('./pages/Explore'));
const TagPage = React.lazy(() => import('./pages/TagPage'));
const PostDetails = React.lazy(() => import('./pages/PostDetails'));
const NewPost = React.lazy(() => import('./pages/NewPost'));
const NotificationsPage = React.lazy(() => import('./pages/NotificationsPage'));
const Bookmarks = React.lazy(() => import('./pages/Bookmarks'));
const Settings = React.lazy(() => import('./pages/Settings'));
const Profile = React.lazy(() => import('./pages/Profile'));
const UserProfile = React.lazy(() => import('./pages/UserProfile'));
const EditProfile = React.lazy(() => import('./pages/EditProfile'));
const Messages = React.lazy(() => import('./pages/Messages'));
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));

const App = () => {
  return (
    <UiProvider>
      <ThemeBridge>
        <ToastProvider>
          <AuthProvider>
            <NotificationsProvider>
              <SocialGraphProvider>
                <ModerationProvider>
                <MessagesProvider>
                  <PostsProvider>
                    <Router>
                      <AnimatedRoutes />
                    </Router>
                  </PostsProvider>
                </MessagesProvider>
              </ModerationProvider>
              </SocialGraphProvider>
            </NotificationsProvider>
          </AuthProvider>
        </ToastProvider>
      </ThemeBridge>
    </UiProvider>
  );
};

function Shell({ children }) {
  return (
    <Suspense fallback={<RouteFallback />}>
      <PageTransition>{children}</PageTransition>
    </Suspense>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <ErrorBoundary>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<ProtectedRoute><Shell><Home /></Shell></ProtectedRoute>} />
        <Route path="/explore" element={<ProtectedRoute><Shell><Explore /></Shell></ProtectedRoute>} />
        <Route path="/tag/:tag" element={<ProtectedRoute><Shell><TagPage /></Shell></ProtectedRoute>} />
        <Route path="/post/:id" element={<ProtectedRoute><Shell><PostDetails /></Shell></ProtectedRoute>} />
        <Route path="/new" element={<ProtectedRoute><Shell><NewPost /></Shell></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Shell><NotificationsPage /></Shell></ProtectedRoute>} />
        <Route path="/bookmarks" element={<ProtectedRoute><Shell><Bookmarks /></Shell></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Shell><Settings /></Shell></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Shell><Profile /></Shell></ProtectedRoute>} />
        <Route path="/u/:username" element={<ProtectedRoute><Shell><UserProfile /></Shell></ProtectedRoute>} />
        <Route path="/edit-profile" element={<ProtectedRoute><Shell><EditProfile /></Shell></ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute><Shell><Messages /></Shell></ProtectedRoute>} />

        <Route path="/login" element={<PublicOnlyRoute><Shell><Login /></Shell></PublicOnlyRoute>} />
        <Route path="/register" element={<PublicOnlyRoute><Shell><Register /></Shell></PublicOnlyRoute>} />
        <Route path="*" element={<PublicOnlyRoute><Shell><Login /></Shell></PublicOnlyRoute>} />
      </Routes>
    </ErrorBoundary>
  );
}

function ThemeBridge({ children }) {
  const { mode, direction } = useUi();
  const theme = React.useMemo(() => createAppTheme({ mode, direction }), [mode, direction]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

export default App;
