import { createContext, useContext, useState } from 'react';

const StoreContext = createContext();

export function StoreProvider({ children }) {
  const [datasetProfile, setDatasetProfileState] = useState(() => {
    const saved = localStorage.getItem('datasetProfile');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const isAuthenticated = !!token;

  const setDatasetProfile = (profile) => {
    setDatasetProfileState(profile);
    if (profile) {
      localStorage.setItem('datasetProfile', JSON.stringify(profile));
    } else {
      localStorage.removeItem('datasetProfile');
    }
  };

  const login = (jwtToken, userData) => {
    setToken(jwtToken);
    setUser(userData);
    localStorage.setItem('token', jwtToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const updateUser = (userData) => {
    setUser(prev => {
      const merged = { ...prev, ...userData };
      localStorage.setItem('user', JSON.stringify(merged));
      return merged;
    });
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setDatasetProfile(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('datasetProfile');
  };

  return (
    <StoreContext.Provider value={{ datasetProfile, setDatasetProfile, isAuthenticated, token, user, login, logout, updateUser }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  return useContext(StoreContext);
}
