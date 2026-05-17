import { useEffect, useState } from 'react';
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
  return `${property.source || 'property'}-${property._id || property.id}`;
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('isAuthenticated') === 'true');
  const [user, setUser] = useState(() => getStoredUser());
  const [guestLoggedIn, setGuestLoggedIn] = useState(() => localStorage.getItem('guestLoggedIn') === 'true');
  const [savedProperties, setSavedProperties] = useState(() => getStoredSavedProperties());
  const [wishlistToast, setWishlistToast] = useState(null);

  useEffect(() => {
    if (!wishlistToast) return undefined;
    const timer = window.setTimeout(() => setWishlistToast(null), 2800);
    return () => window.clearTimeout(timer);
  }, [wishlistToast]);

  const login = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setGuestLoggedIn(false);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    localStorage.removeItem('guestLoggedIn');
    localStorage.removeItem('guestUser');
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
      setWishlistToast({
        id: Date.now(),
        type: exists ? 'removed' : 'added',
        title: exists ? 'Removed from wishlist' : 'Property added to wishlist',
        message: property.title || 'Your saved properties are updated.',
      });
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
      <WishlistToast toast={wishlistToast} onClose={() => setWishlistToast(null)} />
    </AuthContext.Provider>
  );
}

function WishlistToast({ toast, onClose }) {
  if (!toast) return null;

  const added = toast.type === 'added';

  return (
    <div className="pointer-events-none fixed right-4 top-24 z-[600] w-[min(92vw,360px)] sm:right-6">
      <div className="pointer-events-auto flex items-start gap-3 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-[0_18px_55px_rgba(15,23,42,0.18)] ring-1 ring-white/80 backdrop-blur-xl animate-[akshar-toast-in_320ms_cubic-bezier(.2,.8,.2,1)_both]">
        <div className={`mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl ${added ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
          <span className="text-lg">{added ? '+' : '-'}</span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-extrabold text-slate-950">{toast.title}</p>
          <p className="mt-1 line-clamp-1 text-sm text-slate-500">{toast.message}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          aria-label="Close wishlist notification"
        >
          x
        </button>
      </div>
    </div>
  );
}
