import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const setAuthToken = (token) => {
    if (!api?.defaults?.headers?.common) {
      console.error("Axios instance is not configured correctly:", api);
      return;
    }

    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common["Authorization"];
    }
  };

  const fetchMe = async () => {
    try {
      const { data } = await api.get("/users/me");
      setUser(data);
    } catch (err) {
      console.error(err);
      setUser(null);
      localStorage.removeItem("token");
      setAuthToken(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setAuthToken(token);
      fetchMe();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });

    localStorage.setItem("token", data.token);
    setAuthToken(data.token);
    setUser(data.user);

    return data;
  };

  const register = async (formData) => {
    const { data } = await api.post("/auth/register", formData);

    localStorage.setItem("token", data.token);
    setAuthToken(data.token);
    setUser(data.user);

    return data;
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error(err);
    } finally {
      localStorage.removeItem("token");
      setAuthToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);