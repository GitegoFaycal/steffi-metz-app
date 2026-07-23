import { createContext, useContext, useEffect, useState } from 'react';
import {
  getAdminUser,
  getAdminToken,
  loginAdmin,
  logoutAdmin,
} from '../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = getAdminToken();
    const savedAdmin = getAdminUser();

    if (savedToken) {
      setToken(savedToken);
    }

    if (savedAdmin) {
      setAdmin(savedAdmin);
    }

    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const data = await loginAdmin(credentials);

    if (data.token) {
      setToken(data.token);
    }

    if (data.user) {
      setAdmin(data.user);
    }

    return data;
  };

  const logout = () => {
    logoutAdmin();
    setAdmin(null);
    setToken('');
  };

  const isAuthenticated = Boolean(token);

  return (
    <AuthContext.Provider
      value={{
        admin,
        token,
        loading,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}