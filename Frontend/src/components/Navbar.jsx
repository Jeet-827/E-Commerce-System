import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { useUser } from "../store/Usercontext";
import { API_BASE_URL } from "../config/api.config.js";
import {
  FaShoppingCart,
  FaSignOutAlt,
  FaHome,
  FaChalkboardTeacher,
  FaUser,
  FaSearch,
  FaBars,
  FaTimes,
} from "react-icons/fa";

function Navbar() {
  const { user, setUser, setToken, cartitem } = useUser();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSearch = async () => {
      if (!searchTerm.trim()) {
        setSearchResults([]);
        setShowDropdown(false);
        return;
      }
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/v1/search/search?q=${searchTerm}`
        );
        setSearchResults(res.data.products || []);
        setShowDropdown(true);
      } catch (error) {
        console.error("Search error", error);
      }
    };
    const debounceTimer = setTimeout(fetchSearch, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const handleSearchSubmit = useCallback(() => {
    if (searchTerm.trim()) {
      setShowDropdown(false);
      setMobileMenuOpen(false);
      navigate(`/search?q=${searchTerm}`);
    }
  }, [searchTerm, navigate]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") handleSearchSubmit();
    },
    [handleSearchSubmit]
  );

  const handleLogout = useCallback(() => {
    setUser(null);
    setToken("");
    setMobileMenuOpen(false);
    navigate("/login");
  }, [setUser, setToken, navigate]);

  return (
    <header className="home-header sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Brand Logo */}
        <Link to="/home" className="home-brand flex items-center gap-2.5 no-underline group">
          <div className="home-brand-icon w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white text-lg font-black shadow-md group-hover:scale-105 transition-transform">
            ⚡
          </div>
          <span className="home-brand-name text-xl font-extrabold text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">
            E-System
          </span>
        </Link>

        {/* Center Desktop Search Bar */}
        <div
          ref={searchRef}
          className="flex-1 max-w-lg mx-8 hidden md:flex relative items-center justify-center"
        >
          <div className="relative w-full group">
            <input
              type="text"
              placeholder="Search products, categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => {
                if (searchTerm) setShowDropdown(true);
              }}
              onKeyDown={handleKeyDown}
              className="w-full bg-slate-100 text-slate-900 border border-slate-200 rounded-full py-2 pl-4 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white hover:bg-slate-50 transition-all duration-200 shadow-inner"
            />
            <button
              onClick={handleSearchSubmit}
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-indigo-600 transition-colors"
            >
              <FaSearch size={15} />
            </button>
          </div>

          {/* Search Results Dropdown */}
          {showDropdown && searchResults.length > 0 && (
            <div className="absolute top-full mt-2 w-full bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-[100] max-h-96 overflow-y-auto">
              {searchResults.map((product) => (
                <div
                  key={product._id}
                  onClick={() => {
                    setShowDropdown(false);
                    setSearchTerm(product.title);
                    navigate(`/product/${product._id}`);
                  }}
                  className="flex items-center gap-3.5 p-3 hover:bg-slate-50 cursor-pointer transition-colors border-b border-slate-100 last:border-0"
                >
                  {product.productimage && product.productimage.length > 0 ? (
                    <img
                      src={Array.isArray(product.productimage) ? product.productimage[0] : product.productimage}
                      alt={product.title}
                      className="w-10 h-10 object-cover rounded-lg border border-slate-200"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-[10px] text-slate-400 font-medium">
                      No Img
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {product.title}
                    </p>
                    <p className="text-xs text-indigo-600 font-bold">
                      ₹{product.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {showDropdown && searchTerm && searchResults.length === 0 && (
            <div className="absolute top-full mt-2 w-full bg-white border border-slate-200 rounded-2xl shadow-2xl p-4 text-center z-[100]">
              <p className="text-sm text-slate-500 font-medium">
                No products found for "{searchTerm}"
              </p>
            </div>
          )}
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          {user ? (
            <>
              <Link to="/home" className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors" title="Home">
                <FaHome size={16} /> Home
              </Link>
              <Link to="/allproducts" className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors" title="All Products">
                <FaChalkboardTeacher size={16} /> Products
              </Link>
              <Link
                to="/cart"
                className="relative flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors"
                title="Shopping Cart"
              >
                <FaShoppingCart size={16} /> Cart
                {cartitem.length > 0 && (
                  <span className="absolute -top-2 -right-3 bg-rose-500 text-white text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
                    {cartitem.length}
                  </span>
                )}
              </Link>
              <Link to="/profile" className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors" title="Profile">
                <FaUser size={15} /> Profile
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-rose-600 transition-colors bg-transparent border-0 cursor-pointer"
                title="Logout"
              >
                <FaSignOutAlt size={16} /> Logout
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="px-4 py-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-xl transition-all">
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md hover:shadow-indigo-200 transition-all"
              >
                Register
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Header Right Icons (Cart + Hamburger) */}
        <div className="flex items-center gap-3 md:hidden">
          {user && (
            <Link to="/cart" className="relative p-2 text-slate-700 hover:text-indigo-600">
              <FaShoppingCart size={20} />
              {cartitem.length > 0 && (
                <span className="absolute top-0 right-0 bg-rose-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {cartitem.length}
                </span>
              )}
            </Link>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 hover:text-indigo-600 focus:outline-none rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Toggle Mobile Menu"
          >
            {mobileMenuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-4 shadow-xl animate-fadeIn">
          {/* Mobile Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-slate-100 text-slate-900 border border-slate-200 rounded-full py-2.5 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleSearchSubmit}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            >
              <FaSearch size={16} />
            </button>
          </div>

          {/* Mobile Nav Links */}
          <div className="flex flex-col space-y-2">
            {user ? (
              <>
                <Link
                  to="/home"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                >
                  <FaHome size={18} /> Home
                </Link>
                <Link
                  to="/allproducts"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                >
                  <FaChalkboardTeacher size={18} /> All Products
                </Link>
                <Link
                  to="/cart"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <FaShoppingCart size={18} /> Cart
                  </span>
                  {cartitem.length > 0 && (
                    <span className="bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {cartitem.length}
                    </span>
                  )}
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                >
                  <FaUser size={18} /> Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-rose-600 hover:bg-rose-50 transition-colors text-left w-full border-0 bg-transparent cursor-pointer"
                >
                  <FaSignOutAlt size={18} /> Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 font-semibold text-indigo-600 bg-indigo-50 rounded-xl"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 font-semibold text-white bg-indigo-600 rounded-xl shadow-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
