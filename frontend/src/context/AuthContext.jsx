import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // =========================================================
  // LOAD USER FROM LOCAL STORAGE
  // =========================================================

  const loadUser = () => {
    try {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (!token || !storedUser) {
        setUser(null);
        return;
      }

      const parsedUser = JSON.parse(storedUser);

      setUser(parsedUser);
    } catch (error) {
      console.error("Auth loading error:", error);

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      setUser(null);
    }
  };

  // =========================================================
  // LOGIN
  // =========================================================

  const login = async (email, password) => {
    try {
      setLoading(true);

      const { data } = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      setUser(data.user);

      return data;
    } catch (error) {
      console.error("Login error:", error);

      throw error;
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // REGISTER
  // =========================================================

  const register = async (
    name,
    email,
    password,
    role = "customer"
  ) => {
    try {
      setLoading(true);

      const { data } = await api.post(
        "/auth/register",
        {
          name,
          email,
          password,
          role,
        }
      );

      // Some backends automatically login after registration
      if (data.token) {
        localStorage.setItem(
          "token",
          data.token
        );
      }

      if (data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        setUser(data.user);
      }

      return data;
    } catch (error) {
      console.error("Registration error:", error);

      throw error;
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // LOGOUT
  // =========================================================

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
  };

  // =========================================================
  // CHECK AUTH
  // =========================================================

  const isAuthenticated = Boolean(
    localStorage.getItem("token") && user
  );

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    loadUser();
    setLoading(false);
  }, []);

  // =========================================================
  // LISTEN FOR LOGIN/LOGOUT CHANGES
  // =========================================================

  useEffect(() => {
    const handleStorageChange = () => {
      loadUser();
    };

    window.addEventListener(
      "storage",
      handleStorageChange
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorageChange
      );
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
        loadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// =========================================================
// CUSTOM HOOK
// =========================================================

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};