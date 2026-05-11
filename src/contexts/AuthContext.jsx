import { useState } from 'react';
import AuthContext from './AuthContextCore';

function getStoredUser() {
  const storedUser = localStorage.getItem('user');
  if (!storedUser) return null;

  try {
    return JSON.parse(storedUser);
  } catch {
    localStorage.removeItem('user');
    return null;
  }
}

function getStoredSavedProperties() {
  const storedSaved = localStorage.getItem('savedProperties');
  if (!storedSaved) return [];

  try {
    return JSON.parse(storedSaved);
  } catch {
    localStorage.removeItem('savedProperties');
    return [];
  }
}

function getSavedKey(property) {
  return `${property.source || 'property'}-${property.id}`;
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('isAuthenticated') === 'true');
  const [user, setUser] = useState(() => getStoredUser());
  const [guestLoggedIn, setGuestLoggedIn] = useState(() => localStorage.getItem('guestLoggedIn') === 'true');
  const [savedProperties, setSavedProperties] = useState(() => getStoredSavedProperties());

  const login = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
  };

  const guestAccess = (guestData) => {
    setUser({ ...guestData, isGuest: true });
    setGuestLoggedIn(true);
    localStorage.setItem('guestUser', JSON.stringify(guestData));
    localStorage.setItem('guestLoggedIn', 'true');
  };

  const isPropertySaved = (property) => {
    const key = getSavedKey(property);
    return savedProperties.some((item) => getSavedKey(item) === key);
  };

  const toggleSavedProperty = (property) => {
    if (!isAuthenticated) return false;

    const key = getSavedKey(property);
    setSavedProperties((current) => {
      const exists = current.some((item) => getSavedKey(item) === key);
      const nextSaved = exists
        ? current.filter((item) => getSavedKey(item) !== key)
        : [{ ...property, source: property.source || 'property' }, ...current];

      localStorage.setItem('savedProperties', JSON.stringify(nextSaved));
      return nextSaved;
    });

    return true;
  };

  const value = {
    isAuthenticated,
    user,
    guestLoggedIn,
    savedProperties,
    login,
    logout,
    guestAccess,
    isPropertySaved,
    toggleSavedProperty,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
