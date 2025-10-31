import React, { createContext, useState, useEffect } from 'react';
import { setAuthToken } from '../api/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  useEffect(() => {
    setAuthToken(token);
    if (token) localStorage.setItem('token', token); else localStorage.removeItem('token');
    if (user) localStorage.setItem('user', JSON.stringify(user)); else localStorage.removeItem('user');
  }, [token, user]);

  const logout = () => { setToken(null); setUser(null); setAuthToken(null); };

  return <AuthContext.Provider value={{ user, setUser, token, setToken, logout }}>{children}</AuthContext.Provider>;
}
