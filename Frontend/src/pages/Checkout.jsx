import { useState, useCallback, useMemo, useEffect } from "react";
import axios from "axios";
import { useUser } from "../store/Usercontext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate, useLocation, Link } from "react-router-dom";

const RAZOR_KEY = "rzp_test_TZQOZ3uu5gp2Yy";



function loadRazorpay() {
  return new Promise((resolve) => {
    if (document.getElementById("rzp-sdk")) return resolve(true);
    const s = document.createElement("script");
    s.id = "rzp-sdk";
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

function Checkout() {
  const { user, cartitem, setCartitem, token } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const directBuyItem = location.state?.directBuyItem;
  const directQuantity = location.state?.quantity || 1;

  const [formData, setFormData] = useState({
    houseNo: "",
    street: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    phonenumber: "",
  });

  const [loading, setLoading] = useState(false);

  /* Ensure cart data is fetched from server on mount if empty and not a direct buy */
  useEffect(() => {
    const syncCart = async () => {
      if (token && !directBuyItem) {
        try {
          const res = await axios.get(
            "http://localhost:5000/api/v1/cartdata/cartget",
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const cartList = res.data.cart || res.data.card || [];
          setCartitem(cartList);
        } catch (err) {
          console.log("Error syncing cart in checkout:", err);
        }
      }
    };
    syncCart();
  }, [token, directBuyItem, setCartitem]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  /* Active checkout items (direct buy item OR full cart) */
  const checkoutItems = useMemo(() => {
    if (directBuyItem) {
      const imgSrc = Array.isArray(directBuyItem.productimage)
        ? directBuyItem.productimage[0]
        : directBuyItem.productimage;
      return [
        {
          _id: directBuyItem._id,
          productid: directBuyItem._id,
          producttitle: directBuyItem.title,
          productprice: directBuyItem.price,
          itemimage: imgSrc,
          quantity: directQuantity,
        },
      ];
    }
    return cartitem || [];
  }, [directBuyItem, directQuantity, cartitem]);

  /* Memoised order total */
  const orderTotal = useMemo(
    () =>
      checkoutItems.reduce(
        (sum, item) => sum + (Number(item.productprice) || 0) * (item.quantity || 1),
        0
      ),
    [checkoutItems]
  );

  /* shared helper to save order to DB */
  const saveOrder = async (paymentStatus) => {
    const productIds = checkoutItems.map((item) => item.productid || item._id);
    await axios.post(
      "http://localhost:5000/api/v1/order/ordercreate",
      {
        userid: user?._id,
        productid: productIds,
        address: [{
          houseNo: formData.houseNo,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          pincode: formData.pincode,
        }],
        phonenumber: Number(formData.phonenumber),
        payment: paymentStatus,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  };

  /* COD */
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!checkoutItems || checkoutItems.length === 0) {
        toast.error("Your cart is empty! Please add products to cart first.");
        return;
      }
      setLoading(true);
      try {
        await saveOrder("unpaid");
        toast.success("🎉 Order Placed Successfully!");
        if (!directBuyItem) setCartitem([]);
        setTimeout(() => navigate("/home"), 2000);
      } catch (error) {
        console.log(error);
        toast.error("Failed to place order. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [checkoutItems, directBuyItem, user, formData, token, navigate, setCartitem]
  );

  /* Razorpay */
  const handleRazorpay = async () => {
    if (!checkoutItems || checkoutItems.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }
    setLoading(true);
    try {
      const ok = await loadRazorpay();
      if (!ok) { toast.error("Razorpay failed to load."); setLoading(false); return; }

      const { data } = await axios.post(
        "http://localhost:5000/api/v1/make/payment",
        { amount: orderTotal },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const options = {
        key: RAZOR_KEY,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "E-System Store",
        order_id: data.order.id,
        prefill: {
          name: user?.name || "Customer",
          email: user?.email || "customer@example.com",
          contact: formData.phonenumber || "9876543210",
        },
        theme: { color: "#2563eb" },
        config: {
          display: {
            blocks: {
              upi_block: {
                name: "Pay via UPI / QR (GPay, PhonePe, Paytm)",
                instruments: [
                  { method: "upi" }
                ]
              },
              other_block: {
                name: "Cards, Netbanking & Wallets",
                instruments: [
                  { method: "card" },
                  { method: "netbanking" },
                  { method: "wallet" }
                ]
              }
            },
            sequence: ["block.upi_block", "block.other_block"],
            preferences: {
              show_default_blocks: true
            }
          }
        },
        handler: async () => {
          try {
            await saveOrder("paid");
            toast.success("✅ Payment Successful!");
            if (!directBuyItem) setCartitem([]);
            setTimeout(() => navigate("/home"), 2000);
          } catch { toast.error("Payment done but order save failed."); }
        },
        modal: { ondismiss: () => { toast.info("Payment cancelled."); setLoading(false); } },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (r) => { toast.error(r.error.description); setLoading(false); });
      rzp.open();
    } catch (err) {
      console.log(err);
      toast.error("Could not initiate payment.");
      setLoading(false);
    }
  };



  return (
    <div className="checkout-page min-h-screen flex flex-col bg-white">
      <ToastContainer position="top-right" autoClose={3000} />
      <Navbar />

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8 flex justify-center items-start text-slate-800 mt-16">
        <div className="max-w-3xl w-full bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
          <div className="mb-8 text-center">
            <h2 className="text-4xl font-extrabold text-blue-600 mb-2 tracking-tight">
              Secure Checkout
            </h2>
            <p className="text-slate-500">
              Please enter your shipping details to complete your order.
            </p>
          </div>

          {/* Cart / Direct Order Items Summary */}
          {checkoutItems && checkoutItems.length > 0 ? (
            <div className="mb-8 bg-blue-50/50 p-5 rounded-xl border border-blue-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wider">
                  Order Items Summary ({checkoutItems.length} item{checkoutItems.length > 1 ? "s" : ""})
                </h3>
                {directBuyItem && (
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    ⚡ Direct Buy Now
                  </span>
                )}
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {checkoutItems.map((item, idx) => (
                  <div
                    key={item._id || idx}
                    className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-slate-200 text-xs"
                  >
                    <div className="flex items-center gap-3 truncate">
                      <img
                        src={item.itemimage}
                        alt={item.producttitle}
                        className="w-10 h-10 object-cover rounded-md border border-slate-100 shrink-0"
                      />
                      <div className="truncate">
                        <p className="font-semibold text-slate-800 truncate">
                          {item.producttitle}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-[11px] text-slate-500">Qty: {item.quantity}</p>
                        )}
                      </div>
                    </div>
                    <span className="font-bold text-blue-600 shrink-0">
                      ₹{item.productprice * (item.quantity || 1)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-blue-200/60 flex items-center justify-between text-sm">
                <span className="font-bold text-slate-700">Total Amount Payable:</span>
                <span className="text-lg font-black text-blue-600">₹{orderTotal}</span>
              </div>
            </div>
          ) : (
            <div className="mb-8 p-6 bg-amber-50 border border-amber-200 rounded-xl text-center">
              <p className="text-amber-800 font-semibold text-sm mb-3">
                ⚠️ Your cart is currently empty!
              </p>
              <Link
                to="/allproducts"
                className="inline-block px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-lg shadow-sm transition-all"
              >
                Browse & Add Products
              </Link>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <h3 className="text-xl font-semibold mb-4 text-slate-900 flex items-center gap-2">
                <span>📍</span> Shipping Address
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-slate-700">
                    House No / Flat
                  </label>
                  <input
                    type="text"
                    name="houseNo"
                    value={formData.houseNo}
                    onChange={handleChange}
                    required
                    placeholder="e.g. 101, A-Wing"
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-900 placeholder-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-slate-700">
                    Street / Area
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Main Street"
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-900 placeholder-slate-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
                {["city", "state", "country"].map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium mb-1.5 text-slate-700 capitalize">
                      {field}
                    </label>
                    <input
                      type="text"
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-900"
                    />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-slate-700">
                    Pincode
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    required
                    minLength="6"
                    maxLength="6"
                    placeholder="6-digit PIN"
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-900 placeholder-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-slate-700">
                    Phone Number
                  </label>
                  <input
                    type="number"
                    name="phonenumber"
                    value={formData.phonenumber}
                    onChange={handleChange}
                    required
                    placeholder="10-digit mobile number"
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-900 placeholder-slate-400"
                  />
                </div>
              </div>
            </div>

            {/* Payment Options Heading */}
            <h3 className="text-lg font-bold text-slate-800 mt-6 mb-3">
              Select Payment Method:
            </h3>

            {/* 2 Payment Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* COD */}
              <button
                type="submit"
                disabled={loading || !checkoutItems || checkoutItems.length === 0}
                className="py-3.5 px-4 bg-slate-700 hover:bg-slate-800 text-white font-bold rounded-xl shadow-md transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 flex flex-col items-center justify-center gap-1 cursor-pointer text-xs"
              >
                <span className="text-base">💵</span>
                <span>Cash on Delivery</span>
              </button>

              {/* Razorpay */}
              <button
                type="button"
                onClick={handleRazorpay}
                disabled={loading || !checkoutItems || checkoutItems.length === 0}
                className="py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 flex flex-col items-center justify-center gap-1 cursor-pointer text-xs"
              >
                <span className="text-base">💳 Razorpay</span>
                <span className="text-[10px] text-blue-100 font-normal">(Cards, Netbanking & UPI)</span>
              </button>
            </div>
          </form>
        </div>
      </main>



      <Footer />
    </div>
  );
}

export default Checkout;
