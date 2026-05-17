import { useCallback, useEffect, useMemo, useState } from "react";
import { staffApi } from "../services/api";
import StaffAuthContext from "./StaffAuthCore";

function getStoredStaff() {
  const raw = localStorage.getItem("staffUser");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem("staffUser");
    return null;
  }
}

export function StaffAuthProvider({ children }) {
  const [staffUser, setStaffUser] = useState(() => getStoredStaff());
  const [staffToken, setStaffToken] = useState(() => localStorage.getItem("staffToken"));
  const [booting, setBooting] = useState(Boolean(localStorage.getItem("staffToken")));

  const clearStaffSession = useCallback(() => {
    setStaffUser(null);
    setStaffToken(null);
    localStorage.removeItem("staffUser");
    localStorage.removeItem("staffToken");
  }, []);

  const saveStaffUser = useCallback((user) => {
    setStaffUser(user);
    localStorage.setItem("staffUser", JSON.stringify(user));
  }, []);

  const logoutStaff = useCallback(async () => {
    const token = localStorage.getItem("staffToken");
    if (token) {
      try {
        await staffApi.logout(token);
      } catch {
        // Local cleanup still runs so the browser cannot keep using a stale staff session.
      }
    }
    clearStaffSession();
  }, [clearStaffSession]);

  useEffect(() => {
    if (!staffToken) {
      return;
    }

    staffApi
      .me()
      .then((response) => {
        saveStaffUser(response.user);
      })
      .catch(clearStaffSession)
      .finally(() => setBooting(false));
  }, [clearStaffSession, saveStaffUser, staffToken]);

  useEffect(() => {
    window.addEventListener("staff-auth:unauthorized", clearStaffSession);
    return () => window.removeEventListener("staff-auth:unauthorized", clearStaffSession);
  }, [clearStaffSession]);

  const loginStaff = useCallback(async (credentials) => {
    const response = await staffApi.login(credentials);
    setStaffToken(response.token);
    saveStaffUser(response.user);
    localStorage.setItem("staffToken", response.token);
    return response.user;
  }, [saveStaffUser]);

  const value = useMemo(
    () => ({
      booting,
      staffUser,
      staffToken,
      isStaffAuthenticated: Boolean(staffUser && staffToken),
      loginStaff,
      logoutStaff,
      saveStaffUser,
    }),
    [booting, staffToken, staffUser, loginStaff, logoutStaff, saveStaffUser]
  );

  return <StaffAuthContext.Provider value={value}>{children}</StaffAuthContext.Provider>;
}
