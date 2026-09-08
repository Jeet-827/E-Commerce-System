import { useEffect, useState, useMemo, useCallback, memo } from "react";
import { useUser } from "../store/Usercontext";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

const CATEGORIES = [
  { id: "all", label: "All Products", icon: "🌐" },
  { id: "mobile", label: "Mobile", icon: "📱" },
  { id: "watch", label: "Watch", icon: "⌚" },
  { id: "shoes", label: "Shoes", icon: "👟" },
  { id: "makeup", label: "Makeup", icon: "💄" },
  { id: "fashion", label: "Fashion", icon: "👗" },
  { id: "beauty", label: "Beauty", icon: "💇‍♀️" },
];

const CATEGORY_ICON_MAP = {
  mobile: "📱",
  phone: "📱",
  watch: "⌚",
  shoes: "👟",
  makeup: "💄",
  fashion: "👗",
  beauty: "💇‍♀️",
  pc: "💻",
  default: "🛒",
};

const ITEMS_PER_PAGE = 12;

/* ─────────────────── Memoised Product Card ─────────────────── */
const ProductCard = memo(({ elem, onAddToCart, onProductClick }) => {
  const imgSrc = Array.isArray(elem.productimage)
    ? elem.productimage[0]
    : elem.productimage;
  const catKey = elem.category?.toLowerCase() || "";
  const icon = CATEGORY_ICON_MAP[catKey] || CATEGORY_ICON_MAP.default;

  return (
    <div
      onClick={() => onProductClick(elem._id)}
      className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:-translate-y-1.5 hover:shadow-xl hover:border-indigo-300 transition-all duration-300 flex flex-col justify-between cursor-pointer"
    >
      {/* Image */}
      <div className="relative w-full h-52 bg-slate-100 overflow-hidden">
        {imgSrc ? (
          <img
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            src={imgSrc}
            alt={elem.title}
            loading="lazy"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
        ) : null}
        <div
          className="w-full h-full flex items-center justify-center text-5xl bg-slate-100"
          style={{ display: imgSrc ? "none" : "flex" }}
        >
          {icon}
        </div>
        <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/90 backdrop-blur-md border border-slate-200 text-indigo-600 shadow-sm">
          {elem.category}
        </span>
      </div>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900 mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">
            {elem.title}
          </h2>
          <p className="text-xs text-slate-500 mb-4 line-clamp-2 leading-relaxed">
            {elem.description}
          </p>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <span className="text-lg font-extrabold text-slate-900">
            ₹{elem.price}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(elem);
            }}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-md hover:shadow-indigo-200 transition-all duration-200 cursor-pointer"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
});

/* ─────────────────── Pagination Controls ─────────────────── */
const Pagination = memo(({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 mt-12 flex-wrap">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        ← Prev
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
            currentPage === p
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-200 scale-105"
              : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
          }`}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        Next →
      </button>
    </div>
  );
});

function Allproducts() {
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  const [selectedcategory, setSelectedcategory] = useState("all");
  const [filterproduct, setFilterproduct] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  const { token, setCartitem } = useUser();
  const navigate = useNavigate();

  /* ─────────────────── Fetch Products from API ─────────────────── */
  const fetchProducts = useCallback(async (page = 1, category = selectedcategory, search = filterproduct) => {
    try {
      if (page === 1) setLoading(true);
      else setPageLoading(true);

      const res = await axios.get(
        `http://localhost:5000/api/v1/product/productget?page=${page}&limit=${ITEMS_PER_PAGE}&category=${category}&search=${search}`
      );

      setProduct(res.data.products || []);
      setTotalPages(res.data.totalPages || 1);
      setTotalProducts(res.data.totalProducts || (res.data.products || []).length);
      setCurrentPage(res.data.currentPage || page);
    } catch (error) {
      console.log("Error loading products:", error);
    } finally {
      setLoading(false);
      setPageLoading(false);
    }
  }, [selectedcategory, filterproduct]);

  useEffect(() => {
    fetchProducts(1, selectedcategory, filterproduct);
  }, [selectedcategory, filterproduct, fetchProducts]);

  /* Page Change Handler */
  const handlePageChange = useCallback(
    (newPage) => {
      if (newPage < 1 || newPage > totalPages) return;
      setCurrentPage(newPage);
      fetchProducts(newPage, selectedcategory, filterproduct);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [totalPages, fetchProducts, selectedcategory, filterproduct]
  );

  /* Category Change Handler */
  const handleCategoryChange = useCallback((catId) => {
    setSelectedcategory(catId);
    setCurrentPage(1);
  }, []);

  /* Search Input Handler */
  const handleSearchChange = useCallback((e) => {
    setFilterproduct(e.target.value);
    setCurrentPage(1);
  }, []);

  /* Product Click Handler */
  const handleProductClick = useCallback((id) => {
    navigate(`/product/${id}`);
  }, [navigate]);

  /* Add to Cart Handler */
  const handleAddToCart = useCallback(
    async (elem) => {
      if (!token) {
        alert("Please login first!");
        navigate("/login");
        return;
      }
      try {
        const payload = {
          itemimage: elem.productimage,
          productid: elem._id,
          producttitle: elem.title,
          productprice: elem.price,
          productdescription: elem.description,
        };
        await axios.post(
          "http://localhost:5000/api/v1/cartdata/cartitem",
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Added to Cart!");
        const cartRes = await axios.get(
          "http://localhost:5000/api/v1/cartdata/cartget",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCartitem(cartRes.data.cart || cartRes.data.card || []);
      } catch (err) {
        console.log("AddToCart Error:", err);
      }
    },
    [token, navigate, setCartitem]
  );

  const filteredProducts = useMemo(() => product, [product]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4 text-slate-600 font-sans">
        <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-600 rounded-full animate-spin" />
        <span className="text-sm font-medium">Loading products...</span>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <div className="min-h-screen bg-white text-slate-900 font-sans px-4 py-10 md:px-10 max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-3 tracking-tight">
            All Products Catalog
          </h1>
          <p className="text-slate-500 text-sm md:text-base max-w-md mx-auto">
            Explore our curated collection of premium products
          </p>
          <p className="text-slate-400 text-xs mt-2">
            Showing page <span className="text-indigo-600 font-semibold">{currentPage}</span> of{" "}
            <span className="text-indigo-600 font-semibold">{totalPages}</span> —{" "}
            <span className="text-indigo-600 font-semibold">{totalProducts}</span> total products
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-6 mb-10 max-w-4xl mx-auto">
          {/* Search */}
          <div className="relative w-full max-w-lg">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-base pointer-events-none">
              🔍
            </span>
            <input
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all text-sm shadow-sm"
              type="text"
              placeholder="Search products by title..."
              value={filterproduct}
              onChange={handleSearchChange}
            />
          </div>

          {/* Category Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
            {CATEGORIES.map((cat) => {
              const isActive = selectedcategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`px-4 py-2 rounded-full border text-xs md:text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    isActive
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200 scale-105"
                      : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200 hover:text-slate-900"
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Products Grid */}
        {pageLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-600 rounded-full animate-spin" />
            <span className="text-slate-500 text-sm">Loading page products...</span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 border border-slate-200 rounded-3xl max-w-lg mx-auto">
            <div className="text-5xl mb-4">📦</div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">No products found</h3>
            <p className="text-xs md:text-sm text-slate-500">
              Try choosing another category or search keyword.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {filteredProducts.map((elem) => (
                <ProductCard
                  key={elem._id}
                  elem={elem}
                  onAddToCart={handleAddToCart}
                  onProductClick={handleProductClick}
                />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Allproducts;
