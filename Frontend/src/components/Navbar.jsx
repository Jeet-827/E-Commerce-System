import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { useUser } from "../store/Usercontext";
import {
  FaShoppingCart,
  FaSignOutAlt,
  FaHome,
  FaChalkboardTeacher,
  FaUser,
  FaSearch,
} from "react-icons/fa";

function Navbar() {
  const { user, setUser, setToken, cartitem } = useUser();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
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
          `http://localhost:5000/api/v1/search/search?q=${searchTerm}`
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
    navigate("/login");
  }, [setUser, setToken, navigate]);

  return (
    <header className="home-header sticky top-0 z-50 w-full">
      <Link to="/home" className="home-brand" style={{ textDecoration: "none" }}>
        <div className="home-brand-icon">⚡</div>
        <span className="home-brand-name">E-System</span>
      </Link>

      {/* Center Search Bar */}
      <div
        ref={searchRef}
        className="flex-1 max-w-xl mx-6 hidden md:flex relative items-center justify-center"
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
                {product.productimage && product.productimage.length > 0 ? (
                  <img
                    src={Array.isArray(product.productimage) ? product.productimage[0] : product.productimage}
                    alt={product.title}
                    className="w-10 h-10 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-[10px] text-slate-400">
                    No Img
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900 line-clamp-1">
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
          <div className="absolute top-full mt-2 w-full bg-white border border-slate-200 rounded-2xl shadow-xl p-4 text-center z-[100]">
            <p className="text-sm text-slate-500">
              No products found for "{searchTerm}"
            </p>
          </div>
        )}
      </div>

      <nav className="home-nav">
        {user ? (
          <>
            <Link to="/home" className="home-nav-link" title="Home">
              <FaHome style={{ marginRight: "4px", verticalAlign: "middle" }} />{" "}
              Home
            </Link>
            <Link to="/allproducts" className="home-nav-link" title="All Products">
              <FaChalkboardTeacher
                style={{ marginRight: "4px", verticalAlign: "middle" }}
              />{" "}
              All Products
            </Link>
            <Link
              to="/cart"
              className="home-nav-link"
              style={{ position: "relative" }}
              title="Shopping Cart"
            >
              <FaShoppingCart
                style={{ marginRight: "4px", verticalAlign: "middle" }}
              />{" "}
              Cart
              {cartitem.length > 0 && (
                <span className="cart-badge">{cartitem.length}</span>
              )}
            </Link>
            <Link to="/profile" className="home-nav-link" title="Profile">
              <FaUser style={{ marginRight: "4px", verticalAlign: "middle" }} />{" "}
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="home-nav-link-btn"
              title="Logout"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              <FaSignOutAlt
                style={{ marginRight: "4px", verticalAlign: "middle" }}
              />{" "}
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="home-nav-btn">
              Login
            </Link>
            <Link
              to="/register"
              className="home-nav-btn"
              style={{
                background: "transparent",
                border: "1px solid var(--primary)",
                color: "var(--primary)",
              }}
            >
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
