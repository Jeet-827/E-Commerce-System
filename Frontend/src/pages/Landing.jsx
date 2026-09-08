import { useState, useEffect, useCallback, useMemo, memo } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../store/Usercontext.jsx";
import Footer from "../components/Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* ─── 360° Auto-Rotating Product Banner Carousel ─── */
const BannerCarousel = memo(({ products, onProductClick, onAddToCart }) => {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const total = products.length;

  const goTo = useCallback((idx) => {
    if (animating || idx === current) return;
    setAnimating(true);
    setCurrent(idx);
    setTimeout(() => setAnimating(false), 600);
  }, [animating, current]);

  const next = useCallback(() => goTo((current + 1) % total), [current, total, goTo]);
  const prev = useCallback(() => goTo((current - 1 + total) % total), [current, total, goTo]);

  /* Auto-rotate every 3.5s */
  useEffect(() => {
    if (total === 0) return;
    const timer = setInterval(next, 3500);
    return () => clearInterval(timer);
  }, [next, total]);

  if (total === 0) return (
    <div className="banner-carousel-placeholder">
      <div className="landing-spinner" />
      <p>Loading banners...</p>
    </div>
  );

  const product = products[current];
  const imgSrc = Array.isArray(product.productimage)
    ? product.productimage[0]
    : product.productimage;

  return (
    <div className="banner-carousel">
      {/* Slide */}
      <div
        key={current}
        className={`banner-slide ${animating ? "banner-slide-in" : "banner-slide-visible"}`}
        style={{
          background: `linear-gradient(120deg,
            hsl(${(current * 47) % 360},70%,22%) 0%,
            hsl(${(current * 47 + 40) % 360},65%,35%) 100%)`
        }}
      >
        {/* Left: text */}
        <div className="banner-text">
          <span className="banner-badge">🔥 {product.category ? `${product.category} Category` : "Featured Category"}</span>
          <h2 className="banner-title">{product.title}</h2>
          <p className="banner-desc">{product.description?.slice(0, 120)}{product.description?.length > 120 ? "..." : ""}</p>
          <div className="banner-price-row">
            <span className="banner-price">₹{product.price}</span>
            <span className="banner-old-price">₹{Math.round(product.price * 1.25)}</span>
            <span className="banner-discount">20% OFF</span>
          </div>
          <div className="banner-btns">
            <button className="banner-btn-primary" onClick={() => onProductClick(product._id)}>
              View Details →
            </button>
            <button className="banner-btn-secondary" onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}>
              🛒 Add to Cart
            </button>
          </div>
        </div>

        {/* Right: product image */}
        <div className="banner-img-wrap">
          <div className="banner-img-glow" />
          <img src={imgSrc} alt={product.title} className="banner-img" />
        </div>
      </div>

      {/* Prev / Next arrows */}
      <button className="banner-arrow banner-arrow-left" onClick={prev} aria-label="Previous">‹</button>
      <button className="banner-arrow banner-arrow-right" onClick={next} aria-label="Next">›</button>

      {/* Product name tab indicators */}
      <div className="banner-tabs">
        {products.map((p, i) => {
          const thumb = Array.isArray(p.productimage) ? p.productimage[0] : p.productimage;
          const label = p.category ? `${p.category}` : p.title;
          return (
            <button
              key={i}
              className={`banner-tab ${i === current ? "banner-tab-active" : ""}`}
              onClick={() => goTo(i)}
              title={`${p.category || 'Category'}: ${p.title}`}
            >
              <img src={thumb} alt={p.title} className="banner-tab-img" />
              <span className="banner-tab-name">{label}</span>
            </button>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="banner-progress">
        <div key={current} className="banner-progress-bar" />
      </div>
    </div>
  );
});


/* ─── Promotional Banner Card (Memoized) ─── */
const PromoBannerCard = memo(({ tag, title, discount, image, productId, color, onProductClick }) => (
  <div
    className="landing-promo-card"
    style={{ "--card-accent": color }}
    onClick={() => productId ? onProductClick(productId) : null}
  >
    <div className="landing-promo-badge">{discount}</div>
    <div className="landing-promo-body">
      <span className="landing-promo-tag">{tag}</span>
      <h4 className="landing-promo-title">{title}</h4>
      <span className="landing-promo-link">Explore Now &rarr;</span>
    </div>
    {image && (
      <div className="landing-promo-img-box">
        <img src={image} alt={title} className="landing-promo-img" loading="lazy" />
      </div>
    )}
  </div>
));

/* ─── Real Product Poster Card (Memoized) ─── */
const ProductPosterCard = memo(({ product, onProductClick, onAddToCart }) => {
  const imgSrc = Array.isArray(product.productimage)
    ? product.productimage[0]
    : product.productimage;

  return (
    <div className="landing-product-card" onClick={() => onProductClick(product._id)}>
      <div className="landing-product-img-wrap">
        <img
          src={imgSrc}
          alt={product.title}
          className="landing-product-img"
          loading="lazy"
        />
        <span className="landing-product-category">{product.category}</span>
        <button
          className="landing-product-quick-cart"
          title="Add to Cart"
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
        >
          🛒
        </button>
      </div>

      <div className="landing-product-body">
        <div className="landing-product-stars">★★★★★</div>
        <h4 className="landing-product-title">{product.title}</h4>
        <p className="landing-product-desc">{product.description}</p>
        
        <div className="landing-product-footer">
          <div className="landing-product-price-box">
            <span className="landing-product-price">₹{product.price}</span>
            <span className="landing-product-old-price">₹{Math.round(product.price * 1.2)}</span>
          </div>
          <button
            className="landing-product-btn"
            onClick={(e) => {
              e.stopPropagation();
              onProductClick(product._id);
            }}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
});

/* ─── Feature Card (Memoized) ─── */
const FeatureCard = memo(({ icon, title, desc }) => (
  <div className="landing-feature-card">
    <div className="landing-feature-icon">{icon}</div>
    <h3 className="landing-feature-title">{title}</h3>
    <p className="landing-feature-desc">{desc}</p>
  </div>
));

/* ─── Category Card with real product image (Memoized) ─── */
const CategoryPill = memo(({ name, count, image, icon }) => (
  <Link to={`/allproducts?category=${encodeURIComponent(name)}`} className="landing-category-card">
    <div className="landing-cat-img-wrap">
      {image
        ? <img src={image} alt={name} className="landing-cat-img" />
        : <span className="landing-cat-icon">{icon || "📦"}</span>
      }
    </div>
    <div>
      <h4 className="landing-cat-title">{name}</h4>
      <span className="landing-cat-subtitle">{count} Product{count !== 1 ? "s" : ""}</span>
    </div>
    <span className="landing-cat-arrow">›</span>
  </Link>
));


/* ─── Testimonial Card (Memoized) ─── */
const TestimonialCard = memo(({ name, role, text, avatar }) => (
  <div className="landing-testimonial-card">
    <div className="landing-stars">★★★★★</div>
    <p className="landing-testimonial-text">"{text}"</p>
    <div className="landing-testimonial-author">
      <div className="landing-testimonial-avatar">{avatar}</div>
      <div>
        <h5 className="landing-testimonial-name">{name}</h5>
        <span className="landing-testimonial-role">{role}</span>
      </div>
    </div>
  </div>
));

/* Icon map — auto-matched by category name keyword */
const CATEGORY_ICONS = {
  mobile: "📱", phone: "📱", smartphone: "📱",
  watch: "⌚", smartwatch: "⌚",
  shoe: "👟", shoes: "👟", footwear: "👟", sneaker: "👟",
  makeup: "💄", beauty: "💄", cosmetic: "💄",
  fashion: "👗", cloth: "👗", clothing: "👗", dress: "👗", wear: "👗",
  audio: "🎧", earphone: "🎧", headphone: "🎧", speaker: "🔊",
  laptop: "💻", computer: "🖥️", tablet: "📲",
  camera: "📷", tv: "📺", television: "📺",
  bag: "👜", accessories: "🧢", jewel: "💍", jewellery: "💍",
  book: "📚", sport: "⚽", fitness: "🏋️", toy: "🧸",
  furniture: "🪑", appliance: "🏠", kitchen: "🍳",
  default: "📦",
};

function getCategoryIcon(name) {
  const lower = (name || "").toLowerCase();
  for (const [key, icon] of Object.entries(CATEGORY_ICONS)) {
    if (key !== "default" && lower.includes(key)) return icon;
  }
  return CATEGORY_ICONS.default;
}


const FEATURES = [
  { icon: "⚡", title: "Instant Delivery", desc: "Express delivery right to your doorstep within 24-48 hours." },
  { icon: "🛡️", title: "100% Genuine", desc: "Guaranteed authentic products straight from verified brands." },
  { icon: "🔒", title: "Safe Checkout", desc: "Bank-grade encryption ensures your payments are always secure." },
  { icon: "🔄", title: "Easy Returns", desc: "No questions asked 7-day return and exchange policy." },
];

const TESTIMONIALS = [
  { name: "Aarav Sharma", role: "Tech Enthusiast", text: "Ordered a smartwatch and got it the next day! The white theme UI looks super clean and crisp.", avatar: "A" },
  { name: "Neha Patel", role: "Verified Buyer", text: "Clicking on products to see instant details is so seamless. Great shopping experience!", avatar: "N" },
  { name: "Vikram Malhotra", role: "Frequent Shopper", text: "The deal banners are amazing. Got 30% off on my shoes. Highly recommended!", avatar: "V" },
];

function Landing() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const navigate = useNavigate();
  const { token, setCartitem } = useUser();

  /* Fetch Featured Products */
  const fetchProducts = useCallback(async () => {
    setLoadingProducts(true);
    try {
      const res = await axios.get(
        "http://localhost:5000/api/v1/product/productget?limit=8"
      );
      setProducts(res.data.products || []);
    } catch (err) {
      console.log("Error loading products for landing:", err);
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  /* Fetch Real Categories from DB */
  const fetchCategories = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/v1/product/categories");
      setCategories(res.data.categories || []);
    } catch (err) {
      console.log("Error loading categories:", err);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  /* Extract 1 product per category for the 360° banner carousel */
  const categoryProducts = useMemo(() => {
    if (!categories || categories.length === 0) return products;
    const catProds = categories
      .map((cat) => cat.product)
      .filter((p) => p && p.title && p.productimage);
    return catProds.length > 0 ? catProds : products;
  }, [categories, products]);

  /* Open Product Detail Page */
  const handleProductClick = useCallback((id) => {
    if (id) {
      navigate(`/product/${id}`);
    } else {
      navigate("/allproducts");
    }
  }, [navigate]);

  /* Add to Cart Handler */
  const handleAddToCart = useCallback(
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
          "http://localhost:5000/api/v1/cartdata/cartitem",
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Added to Cart! 🛒", { autoClose: 800 });

        const cartRes = await axios.get(
          "http://localhost:5000/api/v1/cartdata/cartget",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCartitem(cartRes.data.cart || []);
      } catch (err) {
        console.log("AddToCart Error:", err);
        toast.error("Failed to add to cart");
      }
    },
    [token, navigate, setCartitem]
  );

  const handleSubscribe = useCallback((e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  }, [email]);

  /* Promo Banners Data */
  const promoBanners = useMemo(() => {
    const p1 = products[0];
    const p2 = products[1];
    const p3 = products[2];

    return [
      {
        tag: "HOT DEAL",
        title: p1 ? p1.title : "Smart Next-Gen Electronics",
        discount: "40% OFF",
        image: p1 ? (Array.isArray(p1.productimage) ? p1.productimage[0] : p1.productimage) : "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500",
        productId: p1 ? p1._id : null,
        color: "#4f46e5"
      },
      {
        tag: "TRENDING",
        title: p2 ? p2.title : "Premium Fashion & Apparel",
        discount: "UP TO 50% OFF",
        image: p2 ? (Array.isArray(p2.productimage) ? p2.productimage[0] : p2.productimage) : "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
        productId: p2 ? p2._id : null,
        color: "#059669"
      },
      {
        tag: "LIMITED EDITION",
        title: p3 ? p3.title : "Luxury Footwear Collection",
        discount: "FLAT 30% OFF",
        image: p3 ? (Array.isArray(p3.productimage) ? p3.productimage[0] : p3.productimage) : "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
        productId: p3 ? p3._id : null,
        color: "#d97706"
      }
    ];
  }, [products]);

  return (
    <div className="landing-white-wrapper">
      <ToastContainer />

      {/* ══════════════ NAVBAR ══════════════ */}
      <header className="landing-light-nav">
        <div className="landing-nav-container">
          <Link to="/" className="landing-light-logo">
            <div className="landing-logo-badge">⚡</div>
            <span className="landing-logo-brand">E-System</span>
          </Link>

          <nav className="landing-light-links">
            <a href="#featured">Featured</a>
            <a href="#posters">Banners & Deals</a>
            <a href="#categories">Categories</a>
            <a href="#whyus">Why Us</a>
          </nav>

          <div className="landing-light-actions">
            <Link to="/allproducts" className="landing-nav-browse">
              Browse All
            </Link>
            <Link to="/login" className="landing-btn-login">
              Sign In
            </Link>
            <Link to="/register" className="landing-btn-signup">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* ══════════════ 360° ROTATING PRODUCT BANNER ══════════════ */}
      <section className="landing-hero-section" style={{padding: 0}}>
        <BannerCarousel
          products={categoryProducts}
          onProductClick={handleProductClick}
          onAddToCart={handleAddToCart}
        />
      </section>

      {/* ══════════════ PROMOTIONAL POSTERS / BANNERS GRID ══════════════ */}
      <section id="posters" className="landing-section-wrapper">
        <div className="landing-section-header">
          <span className="landing-section-kicker">EXCLUSIVES & DEALS</span>
          <h2 className="landing-section-main-title">Featured Product Banners</h2>
          <p className="landing-section-desc">Click any banner to open full product details</p>
        </div>

        <div className="landing-promo-grid">
          {promoBanners.map((banner, idx) => (
            <PromoBannerCard
              key={idx}
              {...banner}
              onProductClick={handleProductClick}
            />
          ))}
        </div>
      </section>

      {/* ══════════════ FEATURED PRODUCTS SECTION ══════════════ */}
      <section id="featured" className="landing-section-wrapper landing-bg-soft">
        <div className="landing-section-header">
          <span className="landing-section-kicker">TOP PICKS FOR YOU</span>
          <h2 className="landing-section-main-title">Trending Products</h2>
          <p className="landing-section-desc">Click on any product to view price, details & buy options</p>
        </div>

        {loadingProducts ? (
          <div className="landing-loader-box">
            <div className="landing-spinner" />
            <p>Fetching products from store...</p>
          </div>
        ) : (
          <div className="landing-products-grid">
            {products.map((product) => (
              <ProductPosterCard
                key={product._id}
                product={product}
                onProductClick={handleProductClick}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}

        <div className="landing-view-more-center">
          <Link to="/allproducts" className="landing-view-all-btn">
            View All Products Catalog &rarr;
          </Link>
        </div>
      </section>

      {/* ══════════════ CATEGORIES GRID ══════════════ */}
      <section id="categories" className="landing-section-wrapper">
        <div className="landing-section-header">
          <span className="landing-section-kicker">EXPLORE STORE</span>
          <h2 className="landing-section-main-title">Shop by Category</h2>
          <p className="landing-section-desc">Browse all products by their category</p>
        </div>

        {categories.length > 0 ? (
          <div className="landing-categories-container">
            {categories.map((cat) => (
              <CategoryPill
                key={cat.name}
                name={cat.name}
                count={cat.count}
                image={Array.isArray(cat.image) ? cat.image[0] : cat.image}
                icon={getCategoryIcon(cat.name)}
              />
            ))}
          </div>
        ) : (
          <div className="landing-loader-box">
            <div className="landing-spinner" />
            <p>Loading categories...</p>
          </div>
        )}
      </section>

      {/* ══════════════ WHY US / FEATURES ══════════════ */}
      <section id="whyus" className="landing-section-wrapper landing-bg-soft">
        <div className="landing-section-header">
          <span className="landing-section-kicker">WHY CHOOSE US</span>
          <h2 className="landing-section-main-title">Designed For Seamless Shopping</h2>
        </div>

        <div className="landing-features-container">
          {FEATURES.map((feat) => (
            <FeatureCard key={feat.title} {...feat} />
          ))}
        </div>
      </section>

      {/* ══════════════ TESTIMONIALS ══════════════ */}
      <section className="landing-section-wrapper">
        <div className="landing-section-header">
          <span className="landing-section-kicker">REVIEWS</span>
          <h2 className="landing-section-main-title">Loved by Thousands</h2>
        </div>

        <div className="landing-testimonials-container">
          {TESTIMONIALS.map((t) => (
            <TestimonialCard key={t.name} {...t} />
          ))}
        </div>
      </section>

      {/* ══════════════ NEWSLETTER ══════════════ */}
      <section className="landing-newsletter-light">
        <div className="landing-newsletter-inner">
          <h3>Stay Updated With Flash Sales ⚡</h3>
          <p>Subscribe to receive exclusive discount coupons and early access to product releases.</p>

          {subscribed ? (
            <div className="landing-subscribed-msg">
              ✅ Thank you for subscribing! Check your inbox for your 15% discount code.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="landing-newsletter-box">
              <input
                type="email"
                placeholder="Enter your email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit">Subscribe</button>
            </form>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Landing;
