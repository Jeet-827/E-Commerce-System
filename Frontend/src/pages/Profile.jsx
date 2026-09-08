import { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { useUser } from "../store/Usercontext.jsx";
import { API_BASE_URL } from "../config/api.config.js";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
  const { user, token, setUser } = useUser();
  const [activeTab, setActiveTab] = useState("edit details");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Change password state
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passLoading, setPassLoading] = useState(false);

  // Edit details state
  const [editName, setEditName] = useState(user?.name || "");
  const [editEmail, setEditEmail] = useState(user?.email || "");
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setEditName(user.name || "");
      setEditEmail(user.email || "");
    }
  }, [user]);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/orderdata/ordersget`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrders(response.data.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load orders. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (activeTab === "My order page" && token) {
      fetchOrders();
    }
  }, [activeTab, token, fetchOrders]);

  const handleChangePassword = useCallback(
    async (e) => {
      e.preventDefault();
      if (newPassword !== confirmPassword) {
        toast.error("New passwords do not match!");
        return;
      }
      setPassLoading(true);
      try {
        await axios.post(
          `${API_BASE_URL}/api/v1/userdata/changepassword`,
          { oldPassword, newPassword },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Password updated successfully! 🔑");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to update password.");
      } finally {
        setPassLoading(false);
      }
    },
    [oldPassword, newPassword, confirmPassword, token]
  );

  const handleEditDetails = useCallback(
    async (e) => {
      e.preventDefault();
      setEditLoading(true);
      try {
        const response = await axios.put(
          `${API_BASE_URL}/api/v1/userdata/updateprofile`,
          { name: editName, email: editEmail },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Profile updated successfully! ✨");
        if (response.data.user) {
          setUser(response.data.user);
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to update profile.");
      } finally {
        setEditLoading(false);
      }
    },
    [token, editName, editEmail, setUser]
  );

  const renderContent = useMemo(() => {
    switch (activeTab) {
      case "edit details":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Personal Information</h2>
              <p className="text-slate-500 text-sm">Update your account details and contact information.</p>
            </div>

            <form onSubmit={handleEditDetails} className="space-y-5 max-w-lg">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm"
                  placeholder="Enter your email address"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={editLoading}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md shadow-indigo-200 transition-all duration-200 disabled:opacity-50 flex items-center gap-2"
              >
                {editLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save Changes</span>
                )}
              </button>
            </form>
          </div>
        );

      case "Change pass":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Security & Password</h2>
              <p className="text-slate-500 text-sm">Ensure your account stays safe with a strong password.</p>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-5 max-w-lg">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm"
                  placeholder="Enter current password"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm"
                  placeholder="Enter new password"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm"
                  placeholder="Confirm new password"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={passLoading}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md shadow-indigo-200 transition-all duration-200 disabled:opacity-50 flex items-center gap-2"
              >
                {passLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <span>Update Password</span>
                )}
              </button>
            </form>
          </div>
        );

      case "My order page":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">My Orders</h2>
                <p className="text-slate-500 text-sm">View your order history and tracking status.</p>
              </div>
              <span className="bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold text-xs px-3 py-1.5 rounded-full">
                {orders.length} Order(s)
              </span>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <div className="w-9 h-9 border-4 border-indigo-500/20 border-t-indigo-600 rounded-full animate-spin" />
                <p className="text-slate-500 text-sm">Loading your orders...</p>
              </div>
            ) : error ? (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm text-center">
                ⚠️ {error}
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-16 bg-slate-50 border border-slate-200 rounded-2xl">
                <div className="text-5xl mb-3">🛍️</div>
                <h3 className="text-base font-bold text-slate-800 mb-1">No Orders Found</h3>
                <p className="text-slate-500 text-xs">You haven't placed any orders yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order._id}
                    className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <span className="text-xs text-slate-400 block font-medium">ORDER ID</span>
                        <span className="font-bold text-sm text-indigo-600">#{order._id}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 text-xs font-extrabold rounded-full ${
                            order.status === "pending"
                              ? "bg-amber-100 text-amber-700 border border-amber-200"
                              : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                          }`}
                        >
                          {order.status.toUpperCase()}
                        </span>
                        <span
                          className={`px-3 py-1 text-xs font-extrabold rounded-full ${
                            order.payment === "unpaid"
                              ? "bg-rose-100 text-rose-700 border border-rose-200"
                              : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                          }`}
                        >
                          PAYMENT: {order.payment.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {order.productid && order.productid.length > 0 && (
                      <div className="space-y-3">
                        {order.productid.map((prod, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-100"
                          >
                            {prod.productimage && prod.productimage.length > 0 ? (
                              <img
                                src={Array.isArray(prod.productimage) ? prod.productimage[0] : prod.productimage}
                                alt={prod.title}
                                className="w-14 h-14 object-cover rounded-lg bg-white border border-slate-200"
                                loading="lazy"
                              />
                            ) : (
                              <div className="w-14 h-14 bg-slate-200 rounded-lg flex items-center justify-center text-xs text-slate-400 font-bold">
                                ITEM
                              </div>
                            )}
                            <div className="flex-1">
                              <h4 className="text-sm font-bold text-slate-800 line-clamp-1">
                                {prod.title}
                              </h4>
                              <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                                {prod.description}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className="text-sm font-extrabold text-slate-900 block">
                                ₹{prod.price}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  }, [
    activeTab,
    loading,
    error,
    orders,
    passLoading,
    editLoading,
    oldPassword,
    newPassword,
    confirmPassword,
    editName,
    editEmail,
    handleChangePassword,
    handleEditDetails,
  ]);

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-between font-sans">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 text-slate-600">
          <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-600 rounded-full animate-spin mb-3" />
          <p className="text-sm font-medium">Loading session...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between font-sans">
      <ToastContainer position="top-right" autoClose={2500} />
      <Navbar />

      <main className="flex-grow max-w-6xl w-full mx-auto px-4 py-8 md:py-12">
        {/* User Profile Header Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div
              className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center font-extrabold text-2xl md:text-3xl shrink-0"
              style={{
                background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                color: "#ffffff",
                boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.4)"
              }}
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                  {user.name || "Customer Profile"}
                </h1>
                <span className="bg-emerald-100 text-emerald-700 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Verified
                </span>
              </div>
              <p className="text-slate-500 text-sm mt-1">{user.email || "Registered User"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-3 px-5">
            <div className="text-center px-3 border-r border-slate-200">
              <span className="text-xs text-slate-400 block font-semibold">ACCOUNT</span>
              <span className="text-sm font-extrabold text-slate-800">Active</span>
            </div>
            <div className="text-center px-3">
              <span className="text-xs text-slate-400 block font-semibold">ROLE</span>
              <span className="text-sm font-extrabold text-indigo-600">Shopper</span>
            </div>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1 bg-white border border-slate-200 rounded-3xl p-4 shadow-sm h-fit">
            <nav className="space-y-1.5">
              <button
                onClick={() => setActiveTab("edit details")}
                className={`w-full text-left px-4 py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 flex items-center gap-3 ${
                  activeTab === "edit details"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span>👤</span>
                <span>Edit Profile</span>
              </button>

              <button
                onClick={() => setActiveTab("Change pass")}
                className={`w-full text-left px-4 py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 flex items-center gap-3 ${
                  activeTab === "Change pass"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span>🔐</span>
                <span>Change Password</span>
              </button>

              <button
                onClick={() => setActiveTab("My order page")}
                className={`w-full text-left px-4 py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 flex items-center gap-3 ${
                  activeTab === "My order page"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span>📦</span>
                <span>My Orders</span>
              </button>
            </nav>
          </div>

          {/* Content Body */}
          <div className="md:col-span-3 bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
            {renderContent}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
