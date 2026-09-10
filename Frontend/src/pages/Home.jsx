import { useState, useEffect, useCallback, useMemo, memo } from "react";
import axios from "axios";
import { useUser } from "../store/Usercontext.jsx";
import { API_BASE_URL } from "../config/api.config.js";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

/* ── Memoised product card ── */
const HomeProductCard = memo(({ product, onAddToCart, onProductClick }) => {
  const imgSrc = Array.isArray(product.productimage)
    ? product.productimage[0]
    : product.productimage;

  return (
    <div
      className="home-card cursor-pointer"
      onClick={() => onProductClick(product._id)}
    >
      <div className="home-card-img-wrap">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={product.title}
            className="home-card-img"
            loading="lazy"
            onError={(e) => {
              e.target.style.display = "none";
              if (e.target.nextSibling) {
                e.target.nextSibling.style.display = "flex";
              }
            }}
          />
        ) : null}
        <div
          className="home-card-fallback-icon"
          style={{ display: imgSrc ? "none" : "flex" }}
        >
          📦
        </div>
        {product.category && (
          <div className="home-card-category">{product.category}</div>
        )}
      </div>
      <div className="home-card-body">
        <div className="home-card-info">
          <h2 className="home-card-title" title={product.title}>
            {product.title}
          </h2>
          <p className="home-card-desc" title={product.description}>
            {product.description}
          </p>
        </div>
        <div className="home-card-footer">
          <span className="home-card-price">₹{product.price}</span>
          <button
            className="home-card-btn"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
});

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { token, setCartitem } = useUser();
  const navigate = useNavigate();

  const getAllProducts = useCallback(async () => {
    setLoading(true);
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.get(
        `${API_BASE_URL}/api/v1/product/productget`,
        { withCredentials: true, headers }
      );
      setProducts(res.data.products || res.data.Products || []);
    } catch (err) {
      console.log("Error:", err);
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    getAllProducts();
  }, [getAllProducts]);

  const AddToCart = useCallback(
    async (product) => {
      if (!token) {
        toast.info("Please login to add items to cart!");
        setTimeout(() => navigate("/login"), 1000);
        return;
      }
      try {
        const payload = {
          itemimage: product.productimage,
          productid: product._id,
          producttitle: product.title,
          productprice: product.price,
          productdescription: product.description,
        };
        await axios.post(
          `${API_BASE_URL}/api/v1/cartdata/cartitem`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Item Added", { autoClose: 500 });
        const cartRes = await axios.get(
          `${API_BASE_URL}/api/v1/cartdata/cartget`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCartitem(cartRes.data.cart || []);
      } catch (err) {
        console.log("AddToCart Error:", err);
      }
    },
    [token, navigate, setCartitem]
  );

  const handleProductClick = useCallback(
    (id) => {
      navigate(`/product/${id}`);
    },
    [navigate]
  );

  const productList = useMemo(() => products, [products]);

  return (
    <div className="home-page">
      <div className="home-bg-orb home-orb-1" />
      <div className="home-bg-orb home-orb-2" />
      <ToastContainer />
      <Navbar />

      {/* Hero */}
      <section className="home-hero">
        <h1 className="home-hero-title">
          Discover Our <span className="home-hero-gradient">Products</span>
        </h1>
        <p className="home-hero-subtitle">
          Explore our curated collection of premium products
        </p>
      </section>

      {/* Content */}
      <main className="home-main">
        {loading && (
          <div className="home-state-box">
            <div className="home-loader" />
            <p className="home-state-text">Loading products...</p>
          </div>
        )}

        {error && (
          <div className="home-state-box">
            <p className="home-error-text">⚠️ {error}</p>
          </div>
        )}

        {!loading && !error && productList.length === 0 && (
          <div className="home-state-box">
            <p className="home-state-text">
              No products found. Add some from the Dashboard!
            </p>
          </div>
        )}

        {!loading && !error && productList.length > 0 && (
          <div className="home-grid">
            {productList.map((product) => (
              <HomeProductCard
                key={product._id}
                product={product}
                onAddToCart={AddToCart}
                onProductClick={handleProductClick}
              />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default Home;
