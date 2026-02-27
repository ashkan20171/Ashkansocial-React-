import React, { createContext, useEffect, useMemo, useState, useContext } from 'react';
import { readJson, remove, writeJson } from '../lib/storage';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const persisted = readJson('ashkan.auth', null, 'local') || readJson('ashkan.auth', null, 'session');

  const [user, setUser] = useState(
    persisted?.user || {
      id: 'u_ashkan',
      name: 'Ashkan',
      username: 'ashkan',
      avatar: '',
      bio: '',
    }
  );
  const [token, setToken] = useState(persisted?.token || null);
  const [persistTo, setPersistTo] = useState(persisted?.persistTo || (readJson('ashkan.auth', null, 'session') ? 'session' : 'local'));

  const isAuthenticated = Boolean(token);

  const login = ({ username, name, remember = true }) => {
    // Demo auth: generate token locally.
    const nextUser = {
      ...user,
      username: username || user.username,
      name: name || user.name,
    };
    setUser(nextUser);
    setPersistTo(remember ? 'local' : 'session');
    setToken(`tok_${Date.now()}`);
  };

  const logout = () => {
    setToken(null);
    remove('ashkan.auth', 'local');
    remove('ashkan.auth', 'session');
  };

  const updateProfile = (patch) => {
    setUser((u) => ({ ...u, ...patch }));
  };

  useEffect(() => {
    if (!token) return;
    writeJson('ashkan.auth', { user, token, persistTo }, persistTo);
    // Ensure only one storage has the session.
    remove('ashkan.auth', persistTo === 'local' ? 'session' : 'local');
  }, [user, token, persistTo]);

  const value = useMemo(
    () => ({ isAuthenticated, user, token, login, logout, updateProfile }),
    [isAuthenticated, user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
