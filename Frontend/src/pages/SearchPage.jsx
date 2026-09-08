import { useEffect, useState, useCallback, useMemo, memo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useUser } from "../store/Usercontext";
import axios from "axios";
import { API_BASE_URL } from "../config/api.config.js";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

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

/* ── Memoised search result card ── */
const SearchCard = memo(({ elem, onAddToCart, onProductClick }) => {
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
      <div className="relative w-full h-56 bg-slate-100 overflow-hidden">
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
        <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-white/90 backdrop-blur-md border border-slate-200 text-indigo-600 shadow-sm">
          {elem.category}
        </span>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900 mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">
            {elem.title}
          </h2>
          <p className="text-xs text-slate-500 mb-4 line-clamp-2 leading-relaxed">
            {elem.description}
          </p>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <span className="text-xl font-extrabold text-slate-900">₹{elem.price}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(elem);
            }}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-md hover:shadow-indigo-200 transition-all duration-200"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
});

function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token, setCartitem } = useUser();
  const navigate = useNavigate();

  const fetchSearchResults = useCallback(async () => {
    if (!query.trim()) {
      setProducts([]);
      return;
    }
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_BASE_URL}/api/v1/search/search?q=${query}`
      );
      setProducts(res.data.products || []);
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    fetchSearchResults();
  }, [fetchSearchResults]);

  const handleProductClick = useCallback((id) => {
    navigate(`/product/${id}`);
  }, [navigate]);

  const handleAddToCart = useCallback(
    async (elem) => {
      if (!token) {
        alert("Please login to add items to cart!");
        navigate("/login");
        return;
      }
      try {
        const payload = {
          itemimage: Array.isArray(elem.productimage)
            ? elem.productimage[0]
            : elem.productimage,
          productid: elem._id,
          producttitle: elem.title,
          productprice: elem.price,
          productdescription: elem.description,
        };
        await axios.post(
          `${API_BASE_URL}/api/v1/cartdata/cartitem`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Item Added to Cart!");
        const cartRes = await axios.get(
          `${API_BASE_URL}/api/v1/cartdata/cartget`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCartitem(cartRes.data.cart || []);
      } catch (err) {
        console.log("AddToCart error:", err);
      }
    },
    [token, navigate, setCartitem]
  );

  /* Memoised product list */
  const productList = useMemo(() => products, [products]);

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <div className="min-h-screen bg-white text-slate-900 font-sans px-4 py-10 md:px-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-3 tracking-tight">
            Search Results
          </h1>
          <p className="text-slate-500 text-sm md:text-base max-w-md mx-auto">
            {query
              ? `Showing results for "${query}"`
              : "Enter a search term in the navbar to begin."}
          </p>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-600 rounded-full animate-spin" />
            <span className="text-indigo-600 font-medium tracking-wide">
              Searching our catalog...
            </span>
          </div>
        ) : (
          <>
            {productList.length === 0 && query ? (
              <div className="text-center py-20 bg-slate-50 border border-slate-200 rounded-3xl max-w-lg mx-auto shadow-sm">
                <div className="text-6xl mb-6 opacity-80">🔍</div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  No matches found
                </h3>
                <p className="text-sm text-slate-500 mb-6 px-8">
                  We couldn't find any products matching{" "}
                  <span className="text-indigo-600 font-semibold">"{query}"</span>.
                </p>
              </div>
            ) : null}

            {productList.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                {productList.map((elem) => (
                  <SearchCard
                    key={elem._id}
                    elem={elem}
                    onAddToCart={handleAddToCart}
                    onProductClick={handleProductClick}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default SearchPage;
