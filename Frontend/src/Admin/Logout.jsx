import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Nav from './Nav';

const Logout = () => {
  const navigate = useNavigate();
  const [adminEmail, setAdminEmail] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const fetchAdminDetails = async () => {
      try {
        const res = await axios.post(
          "http://localhost:8000/api/v1/admin/protected",
          {},
          { withCredentials: true }
        );
        if (res.status === 200 && res.data.success === true && res.data.email) {
          setAdminEmail(res.data.email);
        }
      } catch (error) {
        console.error("Error fetching admin info:", error);
      }
    };
    fetchAdminDetails();
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      // 1. Call backend logout API to clear admin session cookie
      await axios.post(
        "http://localhost:8000/api/v1/admin/adminlogout",
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Admin logout failed:", error);
    } finally {
      // 2. Always redirect admin to Admin Login page (/admin)
      setLoggingOut(false);
      navigate("/admin", { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex font-sans">
      {/* Sidebar Nav */}
      <Nav />

      {/* Main Content */}
      <div className="flex-1 py-10 px-4 sm:px-6 lg:px-8 overflow-y-auto flex items-center justify-center bg-white">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 max-w-md w-full text-center space-y-5 shadow-lg">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center text-3xl mx-auto shadow-sm">
            🚪
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Log Out Admin</h2>
            <p className="text-sm text-slate-500 mt-1">
              Are you sure you want to end your administrative session{adminEmail ? ` for ${adminEmail}` : ""}?
            </p>
          </div>

          <div className="pt-2 flex justify-center gap-3">
            <Link
              to="/dashboard"
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-sm font-bold text-slate-700 transition-all"
            >
              Cancel
            </Link>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-sm font-bold text-white shadow-md shadow-rose-200 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              {loggingOut ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Logging out...</span>
                </>
              ) : (
                <span>Log Out Now</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logout;
