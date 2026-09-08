/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const Usercontext = createContext();

export const Providerfun = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartitem, setCartitem] = useState([]);
  const [token, setToken] = useState("");
  const [editproduct, setEditproduct] = useState([]);

  const func = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/v1/tokenData/regen",
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

  useEffect(() => {
    func();
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
