import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [guestLoggedIn, setGuestLoggedIn] = useState(false);

  useEffect(() => {
    const storedAuth = localStorage.getItem('isAuthenticated') === 'true';
    const storedUser = localStorage.getItem('user');
    const storedGuestLoggedIn = localStorage.getItem('guestLoggedIn') === 'true';
    
    setIsAuthenticated(storedAuth);
    setGuestLoggedIn(storedGuestLoggedIn);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

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

  const value = {
    isAuthenticated,
    user,
    guestLoggedIn,
    login,
    logout,
    guestAccess,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
