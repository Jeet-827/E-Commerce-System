import { useState, useEffect, useCallback, useMemo, memo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useUser } from "../store/Usercontext.jsx";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* ── Related Product Card ── */
const RelatedProductCard = memo(({ product, onClick }) => {
  const imgSrc = Array.isArray(product.productimage)
    ? product.productimage[0]
    : product.productimage;

  return (
    <div
      className="pdetail-related-card"
      onClick={() => onClick(product._id)}
    >
      <div className="pdetail-related-img-wrap">
        <img
          src={imgSrc}
          alt={product.title}
          className="pdetail-related-img"
          loading="lazy"
        />
        <span className="pdetail-related-badge">{product.category}</span>
      </div>
      <div className="pdetail-related-info">
        <h4 className="pdetail-related-title">{product.title}</h4>
        <p className="pdetail-related-price">₹{product.price}</p>
      </div>
    </div>
  );
});

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, setCartitem } = useUser();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  /* Fetch Product Details */
  const fetchProductDetail = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      // Try single product API
      const res = await axios.get(
        `http://localhost:5000/api/v1/product/productget/${id}`
      );
      if (res.data.product) {
        setProduct(res.data.product);
      }
    } catch (err) {
      console.log("Fetch by ID failed, trying fallback search:", err);
      // Fallback: fetch all and find matching ID
      try {
        const fallbackRes = await axios.get(
          "http://localhost:5000/api/v1/product/productget?limit=100"
        );
        const allList = fallbackRes.data.products || [];
        const found = allList.find((p) => p._id === id);
        if (found) {
          setProduct(found);
        } else {
          setError("Product not found.");
        }
      } catch (fallbackErr) {
        setError("Failed to load product details.");
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  /* Fetch Related Products */
  const fetchRelated = useCallback(async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/v1/product/productget?limit=6"
      );
      const all = res.data.products || [];
      setRelatedProducts(all.filter((p) => p._id !== id));
    } catch (err) {
      console.log("Failed to load related products:", err);
    }
  }, [id]);

  useEffect(() => {
    fetchProductDetail();
    fetchRelated();
    window.scrollTo(0, 0);
  }, [fetchProductDetail, fetchRelated]);

  /* Add To Cart Handler */
  const handleAddToCart = useCallback(async () => {
    if (!token) {
      toast.info("Please login to add items to cart!");
      setTimeout(() => navigate("/login"), 1000);
      return;
    }

    if (!product) return;
    setAdding(true);

    try {
      const payload = {
        itemimage: product.productimage,
        productid: product._id,
        producttitle: product.title,
        productprice: product.price,
        productdescription: product.description,
        quantity,
      };

      await axios.post(
        "http://localhost:5000/api/v1/cartdata/cartitem",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Added to Cart successfully! 🛒", { autoClose: 1200 });

      // Refresh cart
      const cartRes = await axios.get(
        "http://localhost:5000/api/v1/cartdata/cartget",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCartitem(cartRes.data.cart || cartRes.data.card || []);
    } catch (err) {
      console.log("Add to cart error:", err);
      toast.error("Failed to add to cart.");
    } finally {
      setAdding(false);
    }
  }, [token, product, quantity, navigate, setCartitem]);

  const handleBuyNow = useCallback(() => {
    if (!token) {
      toast.info("Please login to proceed with purchase!");
      setTimeout(() => navigate("/login"), 1000);
      return;
    }
    if (!product) return;
    navigate("/checkout", { state: { directBuyItem: product, quantity } });
  }, [token, product, quantity, navigate]);

  const handleRelatedClick = useCallback((relId) => {
    navigate(`/product/${relId}`);
  }, [navigate]);

  const imgSrc = useMemo(() => {
    if (!product) return "";
    return Array.isArray(product.productimage)
      ? product.productimage[0]
      : product.productimage;
  }, [product]);

  return (
    <div className="pdetail-page">
      <ToastContainer />
      <Navbar />

      <main className="pdetail-container">
        {/* Breadcrumb */}
        <div className="pdetail-breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/allproducts">Products</Link>
          <span>/</span>
          <span className="pdetail-bc-active">
            {product ? product.title : "Product Detail"}
          </span>
        </div>

        {loading && (
          <div className="pdetail-loading">
            <div className="pdetail-spinner" />
            <p>Loading product details...</p>
          </div>
        )}

        {error && (
          <div className="pdetail-error">
            <h2>⚠️ {error}</h2>
            <button className="pdetail-btn-back" onClick={() => navigate("/allproducts")}>
              Back to Products
            </button>
          </div>
        )}

        {!loading && !error && product && (
          <>
            <div className="pdetail-grid">
              {/* Product Image Section */}
              <div className="pdetail-image-section">
                <div className="pdetail-main-img-wrap">
                  <img
                    src={imgSrc}
                    alt={product.title}
                    className="pdetail-main-img"
                  />
                  <span className="pdetail-category-badge">{product.category}</span>
                </div>
              </div>

              {/* Product Info Section */}
              <div className="pdetail-info-section">
                <span className="pdetail-brand-tag">PREMIUM SELECTION</span>
                <h1 className="pdetail-title">{product.title}</h1>

                <div className="pdetail-rating-row">
                  <div className="pdetail-stars">★★★★★</div>
                  <span className="pdetail-rating-text">4.9 (128 reviews)</span>
                  <span className="pdetail-in-stock">In Stock</span>
                </div>

                <div className="pdetail-price-box">
                  <span className="pdetail-price">₹{product.price}</span>
                  <span className="pdetail-mrp">₹{Math.round(product.price * 1.25)}</span>
                  <span className="pdetail-discount">20% OFF</span>
                </div>

                <div className="pdetail-divider" />

                <p className="pdetail-description">
                  {product.description ||
                    "Experience unmatched quality with this premium product. Crafted to perfection and built to deliver outstanding performance in everyday use."}
                </p>

                <div className="pdetail-divider" />

                {/* Quantity selector with live Subtotal */}
                <div className="pdetail-qty-row" style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                  <span className="pdetail-qty-label">Quantity:</span>
                  <div className="pdetail-qty-picker">
                    <button
                      className="pdetail-qty-btn"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    >
                      -
                    </button>
                    <span className="pdetail-qty-val">{quantity}</span>
                    <button
                      className="pdetail-qty-btn"
                      onClick={() => setQuantity((q) => q + 1)}
                    >
                      +
                    </button>
                  </div>
                  <span className="pdetail-qty-subtotal" style={{ fontSize: "1rem", fontWeight: "700", color: "#6c63ff" }}>
                    Total: <strong style={{ fontSize: "1.2rem" }}>₹{product.price * quantity}</strong>
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="pdetail-actions">
                  <button
                    className="pdetail-btn-cart"
                    onClick={handleAddToCart}
                    disabled={adding}
                  >
                    {adding ? "Adding..." : "🛒 Add to Cart"}
                  </button>
                  <button
                    className="pdetail-btn-buy"
                    onClick={handleBuyNow}
                  >
                    ⚡ Buy Now
                  </button>
                </div>

                {/* Delivery Perks */}
                <div className="pdetail-perks">
                  <div className="pdetail-perk-item">
                    <span>🚚</span>
                    <div>
                      <strong>Free Delivery</strong>
                      <p>Express shipping available nationwide</p>
                    </div>
                  </div>
                  <div className="pdetail-perk-item">
                    <span>🛡️</span>
                    <div>
                      <strong>1 Year Warranty</strong>
                      <p>100% genuine guaranteed products</p>
                    </div>
                  </div>
                  <div className="pdetail-perk-item">
                    <span>🔄</span>
                    <div>
                      <strong>Easy 7-Day Returns</strong>
                      <p>Hassle free replacement or refund</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Related Products Section */}
            {relatedProducts.length > 0 && (
              <section className="pdetail-related-section">
                <h3 className="pdetail-related-title-heading">
                  You Might Also Like
                </h3>
                <div className="pdetail-related-grid">
                  {relatedProducts.map((rel) => (
                    <RelatedProductCard
                      key={rel._id}
                      product={rel}
                      onClick={handleRelatedClick}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default ProductDetail;
