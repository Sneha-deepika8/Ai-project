import { createContext, useContext, useState, useCallback } from "react";
import { authService } from "../services/apiService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("finpulse_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const persistSession = (authResponse) => {
    const { token, userId, fullName, email, role } = authResponse;
    const userData = { userId, fullName, email, role };
    localStorage.setItem("finpulse_token", token);
    localStorage.setItem("finpulse_user", JSON.stringify(userData));
    setUser(userData);
  };

  const login = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login(credentials);
      persistSession(response.data);
      return true;
    } catch (err) {
      setError(err.friendlyMessage || "Invalid email or password.");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.register(payload);
      persistSession(response.data);
      return true;
    } catch (err) {
      setError(err.friendlyMessage || "Unable to create your account.");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("finpulse_token");
    localStorage.removeItem("finpulse_user");
    setUser(null);
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === "ADMIN",
    loading,
    error,
    login,
    register,
    logout,
    clearError: () => setError(null),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
