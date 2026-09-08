import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Nav from "./Nav";
import { toast } from "react-toastify";

const Settings = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newpassword, setNewpassword] = useState("");
  const [editproduct, setEditproduct] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchallproduct = useCallback(async () => {
    setLoadingProducts(true);
    try {
      let products = [];
      try {
        // First try Admin server on port 8000 (all products without limit)
        const res = await axios.get("http://localhost:8000/api/v1/edit/editallproduct");
        if (res.data && Array.isArray(res.data.data)) {
          products = res.data.data;
        }
      } catch (err) {
        console.log("Port 8000 fallback to 5000", err?.message);
      }

      // If port 8000 didn't return products, fallback to backend port 5000 with limit=0
      if (!products || products.length === 0) {
        const res = await axios.get(
          "http://localhost:5000/api/v1/product/productget?limit=0"
        );
        products = res.data.products || res.data.data || [];
      }

      setEditproduct(products || []);
    } catch (error) {
      console.log("Error fetching products:", error);
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  const handleDeleteProduct = async (id, title) => {
    setDeletingId(id);
    try {
      try {
        await axios.delete(`http://localhost:8000/api/v1/edit/deleteproduct/${id}`);
      } catch {
        await axios.delete(`http://localhost:5000/api/v1/product/deleteproduct/${id}`);
      }

      // Remove from list immediately in state
      setEditproduct((prev) => prev.filter((item) => item._id !== id));
      toast.success(`"${title || "Product"}" deleted successfully!`);
    } catch (err) {
      console.error("Failed to delete product:", err);
      toast.error(err.response?.data?.message || "Failed to delete product.");
    } finally {
      setDeletingId(null);
    }
  };

  const changepass = useCallback(async (e) => {
    e.preventDefault();
    try {
      // Try Admin update pass endpoint first
      const res = await axios.post(
        "http://localhost:8000/api/v1/admin/updatepass",
        { email, password, newpassword },
        { withCredentials: true }
      );
      toast.success(res.data.message || "Password updated successfully!");
      setEmail("");
      setPassword("");
      setNewpassword("");
    } catch (adminErr) {
      // Fallback to store user changepassword if admin port differs
      try {
        const res = await axios.post(
          "http://localhost:5000/api/v1/userdata/changepassword",
          { email, password, newpassword }
        );
        toast.success(res.data.message || "Password updated successfully!");
        setEmail("");
        setPassword("");
        setNewpassword("");
      } catch (err) {
        toast.error(
          adminErr.response?.data?.message ||
          err.response?.data?.message ||
          "Failed to update password."
        );
      }
    }
  }, [email, password, newpassword]);

  useEffect(() => {
    fetchallproduct();
  }, [fetchallproduct]);

  const filteredProducts = editproduct.filter((product) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      product.title?.toLowerCase().includes(q) ||
      product.category?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-white text-slate-900 flex font-sans">
      <Nav />

      <div className="flex-1 p-6 sm:p-10 overflow-y-auto bg-white">
        <div className="max-w-3xl mx-auto space-y-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Admin Settings</h1>

          {/* Change Password Card */}
          <div className="w-full bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Change Password</h2>

            <form onSubmit={changepass} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Admin Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newpassword}
                    onChange={(e) => setNewpassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-md shadow-indigo-100 transition-all cursor-pointer"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>

          {/* Product Management Card */}
          <div className="w-full bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Manage Catalog Products</h2>
                <p className="text-xs text-slate-500">View and edit any product in the store catalog at any time</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full">
                  {searchQuery ? `${filteredProducts.length} of ${editproduct.length}` : `${editproduct.length}`} Products
                </span>
                <button
                  type="button"
                  onClick={fetchallproduct}
                  title="Reload all products"
                  className="p-1.5 text-xs text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  🔄
                </button>
              </div>
            </div>

            {/* Quick Search across all catalog products */}
            <div className="pt-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products by title or category..."
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>

            {loadingProducts ? (
              <div className="py-8 text-center text-sm text-slate-500">
                Loading all products...
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-500">
                {searchQuery ? "No products match your search query." : "No products found."}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 max-h-[600px] overflow-y-auto pr-1">
                {filteredProducts.map((product) => (
                  <div 
                    key={product._id} 
                    className="flex items-center gap-4 p-3.5 border border-slate-100 rounded-xl hover:border-indigo-200 hover:bg-slate-50/50 transition-all"
                  >
                    <img 
                      src={product.productimage?.[0] || "https://placehold.co/100x100"} 
                      alt={product.title} 
                      className="w-14 h-14 object-cover rounded-lg bg-slate-100 border border-slate-200"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-slate-900 truncate">{product.title}</h3>
                      <p className="text-xs text-slate-500 font-medium">₹{product.price} • {product.category}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Link 
                        to={`/editproduct/${product._id}`}
                        className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-600 border border-indigo-200 text-xs font-bold rounded-lg transition-colors inline-block whitespace-nowrap"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(product._id, product.title)}
                        disabled={deletingId === product._id}
                        className="px-3 py-1.5 bg-red-50 hover:bg-red-600 hover:text-white text-red-600 border border-red-200 text-xs font-bold rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1 disabled:opacity-50 whitespace-nowrap"
                        title="Delete product"
                      >
                        {deletingId === product._id ? (
                          <span className="w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          "Delete"
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
