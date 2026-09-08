/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config/api.config.js";

const Usercontext = createContext();

export const Providerfun = ({ children }) => {
  // Initialize user state from localStorage to prevent logout on page refresh
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  // Initialize token state from localStorage
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem("token") || "";
    } catch {
      return "";
    }
  });

  const [loading, setLoading] = useState(false);
  const [cartitem, setCartitem] = useState([]);
  const [editproduct, setEditproduct] = useState([]);

  // Sync user state to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // Sync token state to localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  // Silent verification with backend on mount
  const verifySession = async () => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/v1/tokenData/regen`,
        {},
        { withCredentials: true, timeout: 4000 }
      );
      if (res.data?.user) {
        setUser(res.data.user);
      }
      if (res.data?.token) {
        setToken(res.data.token);
      }
    } catch (error) {
      // Only logout if server explicitly returns 401 (unauthorized / token invalid)
      if (error.response && error.response.status === 401) {
        setUser(null);
        setToken("");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verifySession();
  }, []);

  return (
    <Usercontext.Provider
      value={{
        user,
        setUser,
        loading,
        cartitem,
        setCartitem,
        token,
        setToken,
        editproduct,
        setEditproduct,
      }}
    >
      {children}
    </Usercontext.Provider>
  );
};

export const useUser = () => {
  return useContext(Usercontext);
};
