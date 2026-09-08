import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
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
  const [menuOpen, setMenuOpen] = useState(false);

  const searchRef = useRef(null);

  // Close search dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  // Debounced search
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
      } catch {
        // silent
      }
    };
    const t = setTimeout(fetchSearch, 300);
    return () => clearTimeout(t);
  }, [searchTerm]);

  const handleSearchSubmit = useCallback(() => {
    if (searchTerm.trim()) {
      setShowDropdown(false);
      setMenuOpen(false);
      navigate(`/search?q=${searchTerm}`);
    }
  }, [searchTerm, navigate]);

  const handleKeyDown = useCallback(
    (e) => { if (e.key === "Enter") handleSearchSubmit(); },
    [handleSearchSubmit]
  );

  const handleLogout = useCallback(() => {
    setUser(null);
    setToken("");
    setMenuOpen(false);
    navigate("/login");
  }, [setUser, setToken, navigate]);

  const closeMenu = () => setMenuOpen(false);

  const navLinks = user ? (
    <>
      <Link to="/home" className="home-nav-link" onClick={closeMenu}><FaHome className="nav-icon" /> Home</Link>
      <Link to="/allproducts" className="home-nav-link" onClick={closeMenu}><FaChalkboardTeacher className="nav-icon" /> All Products</Link>
      <Link to="/cart" className="home-nav-link nav-cart-link" onClick={closeMenu}>
        <FaShoppingCart className="nav-icon" /> Cart
        {cartitem.length > 0 && <span className="cart-badge">{cartitem.length}</span>}
      </Link>
      <Link to="/profile" className="home-nav-link" onClick={closeMenu}><FaUser className="nav-icon" /> Profile</Link>
      <button onClick={handleLogout} className="home-nav-link-btn nav-logout-btn">
        <FaSignOutAlt className="nav-icon" /> Logout
      </button>
    </>
  ) : (
    <>
      <Link to="/login" className="home-nav-btn" onClick={closeMenu}>Login</Link>
      <Link to="/register" className="home-nav-btn nav-register-btn" onClick={closeMenu}>Register</Link>
    </>
  );

  // Mobile drawer — rendered via Portal to document.body to escape header stacking context
  const mobileDrawer = menuOpen ? createPortal(
    <>
      {/* Backdrop overlay */}
      <div className="mob-overlay" onClick={closeMenu} />

      {/* Side drawer */}
      <div className="mob-drawer">
        {/* Drawer Header */}
        <div className="mob-drawer-header">
          <Link to="/home" className="home-brand" style={{ textDecoration: "none" }} onClick={closeMenu}>
            <div className="home-brand-icon">⚡</div>
            <span className="home-brand-name">E-System</span>
          </Link>
          <button className="mob-drawer-close" onClick={closeMenu} aria-label="Close menu">
            <FaTimes size={18} />
          </button>
        </div>

        {/* Mobile Search */}
        <div className="mob-drawer-search">
          <div className="mob-search-wrap">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              className="mob-search-input"
            />
            <FaSearch size={14} onClick={handleSearchSubmit} className="mob-search-icon" />
          </div>
          {showDropdown && searchResults.length > 0 && (
            <div className="mob-search-results">
              {searchResults.map((product) => (
                <div
                  key={product._id}
                  className="mob-search-item"
                  onClick={() => {
                    setShowDropdown(false);
                    setSearchTerm(product.title);
                    navigate(`/product/${product._id}`);
                    closeMenu();
                  }}
                >
                  {product.productimage ? (
                    <img
                      src={Array.isArray(product.productimage) ? product.productimage[0] : product.productimage}
                      alt={product.title}
                      className="mob-search-img"
                    />
                  ) : (
                    <div className="mob-search-img-placeholder" />
                  )}
                  <div className="mob-search-info">
                    <p className="mob-search-title">{product.title}</p>
                    <p className="mob-search-price">₹{product.price}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Nav Links */}
        <nav className="mob-drawer-links">{navLinks}</nav>
      </div>
    </>,
    document.body
  ) : null;

  return (
    <>
      <header className="home-header">
        {/* Brand */}
        <Link to="/home" className="home-brand" style={{ textDecoration: "none" }}>
          <div className="home-brand-icon">⚡</div>
          <span className="home-brand-name">E-System</span>
        </Link>

        {/* Desktop Search Bar */}
        <div ref={searchRef} className="flex-1 max-w-xl mx-6 hidden md:flex relative items-center justify-center">
          <div className="relative w-full group">
            <input
              type="text"
              placeholder="Search products, categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => { if (searchTerm) setShowDropdown(true); }}
              onKeyDown={handleKeyDown}
              className="w-full bg-slate-100 text-slate-900 border border-slate-200 rounded-full py-2.5 pl-5 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-indigo-500 hover:bg-slate-50 transition-all duration-300 shadow-sm"
            />
            <FaSearch
              size={16}
              onClick={handleSearchSubmit}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer hover:text-indigo-600 transition-colors duration-200"
            />
          </div>

          {/* Search Results Dropdown */}
          {showDropdown && searchResults.length > 0 && (
            <div className="absolute top-full mt-2 w-full bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-[100] max-h-96 overflow-y-auto custom-scrollbar">
              {searchResults.map((product) => (
                <div
                  key={product._id}
                  onClick={() => {
                    setShowDropdown(false);
                    setSearchTerm(product.title);
                    navigate(`/product/${product._id}`);
                  }}
                  className="flex items-center gap-4 p-3 hover:bg-slate-50 cursor-pointer transition-colors border-b border-slate-100 last:border-0"
                >
                  {product.productimage ? (
                    <img
                      src={Array.isArray(product.productimage) ? product.productimage[0] : product.productimage}
                      alt={product.title}
                      className="w-10 h-10 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-[10px] text-slate-400">No Img</div>
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900 line-clamp-1">{product.title}</p>
                    <p className="text-xs text-indigo-600 font-bold">₹{product.price}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {showDropdown && searchTerm && searchResults.length === 0 && (
            <div className="absolute top-full mt-2 w-full bg-white border border-slate-200 rounded-2xl shadow-xl p-4 text-center z-[100]">
              <p className="text-sm text-slate-500">No products found for "{searchTerm}"</p>
            </div>
          )}
        </div>

        {/* Desktop Nav */}
        <nav className="home-nav hidden md:flex">{navLinks}</nav>

        {/* Mobile: cart badge + hamburger */}
        <div className="flex items-center gap-3 md:hidden">
          {user && cartitem.length > 0 && (
            <Link to="/cart" className="mob-cart-btn" onClick={closeMenu}>
              <FaShoppingCart size={18} />
              <span className="cart-badge">{cartitem.length}</span>
            </Link>
          )}
          <button
            className="nav-hamburger"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>
      </header>

      {/* Portal: drawer & overlay rendered directly to document.body */}
      {mobileDrawer}
    </>
  );
}

export default Navbar;
