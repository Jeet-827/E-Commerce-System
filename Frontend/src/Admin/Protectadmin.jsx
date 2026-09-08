import { useState, useEffect } from "react";
import axios from "axios";
import { ADMIN_API_BASE_URL } from "../config/api.config.js";
import { Navigate, Outlet } from "react-router-dom";

const Protectadmin = () => {
  // Initialize isAdmin from localStorage so page reload does not kick out logged-in Admin
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem("adminLoggedIn") === "true";
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await axios.post(
          `${ADMIN_API_BASE_URL}/api/v1/admin/protected`,
          {},
          { withCredentials: true, timeout: 4000 }
        );

        if (res.status === 200 && res.data.success === true) {
          setIsAdmin(true);
          localStorage.setItem("adminLoggedIn", "true");
        }
      } catch (error) {
        // Only kick out if server explicitly responds with 401 (unauthorized)
        if (error.response && error.response.status === 401) {
          setIsAdmin(false);
          localStorage.removeItem("adminLoggedIn");
        }
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, []);

  if (loading && isAdmin === null) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-slate-600 font-sans">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium">Verifying Admin Credentials...</span>
        </div>
      </div>
    );
  }

  return isAdmin ? <Outlet /> : <Navigate to="/admin" replace />;
};

export default Protectadmin;
