/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config/api.config.js";

const Usercontext = createContext();

export const Providerfun = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartitem, setCartitem] = useState([]);
  const [token, setToken] = useState("");

  useEffect(() => {
    const init = async () => {
      try {
        const res = await axios.post(
          `${API_BASE_URL}/api/v1/tokenData/regen`,
          {},
          { withCredentials: true, timeout: 2500 }
        );
        setUser(res.data.user);
        setToken(res.data.token);
      } catch {
        setUser(null);
        setToken("");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  return (
    <Usercontext.Provider
      value={{ user, setUser, loading, cartitem, setCartitem, token, setToken }}
    >
      {children}
    </Usercontext.Provider>
  );
};

export const useUser = () => useContext(Usercontext);
