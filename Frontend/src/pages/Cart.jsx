import { useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { useUser } from "../store/Usercontext";
import { API_BASE_URL } from "../config/api.config.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

function Cart() {
  const { setCartitem, cartitem, token } = useUser();
  const navigate = useNavigate();

  const CartApi = useCallback(async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/v1/cartdata/getcart`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCartitem(res.data.card || []);
    } catch (error) {
      console.log("Error fetching cart data:", error);
    }
  }, [token, setCartitem]);

  useEffect(() => {
    if (token) CartApi();
  }, [CartApi, token]);

  const handleRemoveItem = useCallback(
    async (itemId) => {
      try {
        const res = await axios.delete(
          `${API_BASE_URL}/api/v1/cartdata/cartitem/${itemId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCartitem(res.data.card || []);
        toast.success("Item removed from cart!", { autoClose: 500 });
      } catch (error) {
        console.log("Error removing item:", error);
        toast.error("Failed to remove item.");
      }
    },
    [token, setCartitem]
  );

  /* Quantity increase / decrease handler */
  const handleQuantityChange = useCallback(
    (itemId, delta) => {
      setCartitem((prevCart) =>
        prevCart.map((item) => {
          if (item._id === itemId) {
            const currentQty = item.quantity || 1;
            const newQty = Math.max(1, currentQty + delta);
            return { ...item, quantity: newQty };
          }
          return item;
        })
      );
    },
    [setCartitem]
  );

  /* Memoised totals — only recalculates when cartitem changes */
  const { subtotal, shipping, total } = useMemo(() => {
    const subtotal = cartitem.reduce(
      (sum, item) =>
        sum + (Number(item.productprice) || 0) * (item.quantity || 1),
      0
    );
    const shipping = 0;
    return { subtotal, shipping, total: subtotal + shipping };
  }, [cartitem]);

  return (
    <div className="cart-page">
      <ToastContainer position="top-right" autoClose={3000} />
      <Navbar />

      <main className="cart-main">
        <div className="cart-title-section">
          <h1 className="cart-title">Your Cart</h1>
          <p className="cart-subtitle">
            {cartitem.length === 1 ? "1 item" : `${cartitem.length} items`} in
            your cart
          </p>
        </div>

        {cartitem.length === 0 ? (
          <div className="cart-empty-card">
            <span className="cart-empty-icon">🛒</span>
            <h2 className="cart-empty-title">Your cart is empty</h2>
            <p className="cart-empty-text">
              Looks like you haven't added anything to your cart yet.
            </p>
            <a href="/home" className="cart-checkout-btn">
              Start Shopping
            </a>
          </div>
        ) : (
          <div className="cart-layout">
            {/* Cart Items */}
            <div className="cart-items-container">
              {cartitem.map((item) => {
                const qty = item.quantity || 1;
                const itemTotal = (Number(item.productprice) || 0) * qty;

                return (
                  <div className="cart-item-card" key={item._id}>
                    <div className="cart-item-img-wrap">
                      <img
                        src={item.itemimage}
                        alt={item.producttitle}
                        className="cart-item-img"
                        loading="lazy"
                      />
                    </div>
                    <div className="cart-item-info">
                      <h3 className="cart-item-title">{item.producttitle}</h3>
                      <p className="cart-item-desc">{item.productdescription}</p>

                      <div className="cart-item-qty-row">
                        <span className="cart-item-price">₹{item.productprice}</span>

                        {/* Quantity Controls: - Qty + */}
                        <div className="cart-qty-controls">
                          <button
                            className="cart-qty-btn"
                            onClick={() => handleQuantityChange(item._id, -1)}
                            disabled={qty <= 1}
                            title="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="cart-qty-val">{qty}</span>
                          <button
                            className="cart-qty-btn"
                            onClick={() => handleQuantityChange(item._id, 1)}
                            title="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        {/* Calculated Subtotal */}
                        <span className="cart-item-subtotal">
                          Total: <span className="cart-item-subtotal-val">₹{itemTotal}</span>
                        </span>
                      </div>
                    </div>
                    <div className="cart-item-actions">
                      <button
                        className="cart-remove-btn"
                        onClick={() => handleRemoveItem(item._id)}
                        title="Remove Item"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div className="cart-summary-card">
              <h2 className="cart-summary-title">Order Summary</h2>
              <div className="cart-summary-row">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="cart-summary-row">
                <span>Shipping</span>
                <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
              </div>
              <div className="cart-summary-total-row">
                <span>Total</span>
                <span className="cart-summary-total-price">₹{total}</span>
              </div>
              <button
                className="cart-checkout-btn"
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout
              </button>
              <span
                onClick={() => navigate("/home")}
                className="cart-continue-link"
                style={{ cursor: "pointer" }}
              >
                Continue Shopping
              </span>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default Cart;
