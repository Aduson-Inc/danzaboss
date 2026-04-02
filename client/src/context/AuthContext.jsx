import { createContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('goalposts_token');
    if (token) {
      apiClient
        .get('/auth/me')
        .then((res) => {
          setUser(res.data.user);
        })
        .catch(() => {
          localStorage.removeItem('goalposts_token');
          setUser(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(
    async (email, password) => {
      const res = await apiClient.post('/auth/login', { email, password });
      localStorage.setItem('goalposts_token', res.data.token);
      setUser(res.data.user);
      navigate('/');
    },
    [navigate]
  );

  const register = useCallback(
    async (email, password, displayName) => {
      const res = await apiClient.post('/auth/register', {
        email,
        password,
        displayName,
      });
      localStorage.setItem('goalposts_token', res.data.token);
      setUser(res.data.user);
      navigate('/');
    },
    [navigate]
  );

  const logout = useCallback(() => {
    localStorage.removeItem('goalposts_token');
    setUser(null);
    navigate('/login');
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
