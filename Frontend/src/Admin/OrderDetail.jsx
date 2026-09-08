import { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import axios from "axios";
import Nav from "./Nav";

function OrderDetail() {
  const { id } = useParams();
  const location = useLocation();

  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);
  const [error, setError] = useState("");

  useEffect(() => {
    // If order was not passed via state, fetch it from backend
    if (!order && id) {
      const fetchOrderDetail = async () => {
        try {
          setLoading(true);
          const res = await axios.get(
            `http://localhost:5000/api/v1/order/orderget/${id}`
          );
          setOrder(res.data.order || res.data.data);
        } catch (err) {
          console.error("Error fetching order details:", err);
          setError("Failed to load order details. Please try again.");
        } finally {
          setLoading(false);
        }
      };
      fetchOrderDetail();
    }
  }, [id, order]);

  // Calculate order subtotal
  const subtotal =
    order?.productid?.reduce((sum, item) => {
      const price = parseFloat(item?.price) || 0;
      return sum + price;
    }, 0) || 0;

  const shippingFee = 0; // Free shipping
  const grandTotal = subtotal + shippingFee;

  const isPending = order?.status?.toLowerCase() === "pending";
  const isPaid = order?.payment?.toLowerCase() === "paid";

  return (
    <div className="min-h-screen bg-white text-slate-900 flex font-sans">
      {/* Sidebar Nav */}
      <Nav />

      {/* Main Content */}
      <div className="flex-1 py-10 px-4 sm:px-6 lg:px-8 overflow-y-auto bg-white">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Back Link */}
          <div>
            <Link
              to="/order"
              className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              <span>←</span> Back to All Orders
            </Link>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-20 bg-slate-50 border border-slate-200 rounded-2xl animate-pulse">
              <p className="text-slate-500 text-sm">Loading order details...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-sm flex items-center justify-between">
              <span>{error}</span>
              <Link to="/order" className="text-xs underline text-rose-600 font-bold">
                Return to Orders
              </Link>
            </div>
          )}

          {/* Order Details View */}
          {!loading && order && (
            <div className="space-y-6">
              {/* Header Card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Order Details
                  </span>
                  <h1 className="text-xl sm:text-2xl font-mono font-extrabold text-slate-900 mt-1">
                    #{order._id} - {order.userid?.name || (typeof order.userid === "string" ? order.userid : "N/A")}
                  </h1>
                  <p className="text-xs text-slate-500 mt-1">
                    Placed on:{" "}
                    <span className="text-slate-800 font-semibold">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleString("en-IN", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })
                        : "N/A"}
                    </span>
                  </p>
                </div>

                {/* Status & Payment Badges */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <span
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${
                      isPending
                        ? "bg-amber-100 text-amber-800 border-amber-300"
                        : "bg-emerald-100 text-emerald-800 border-emerald-300"
                    }`}
                  >
                    Status: {order.status}
                  </span>

                  <span
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${
                      isPaid
                        ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                        : "bg-rose-100 text-rose-800 border-rose-300"
                    }`}
                  >
                    Payment: {order.payment}
                  </span>
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Products List (2 Cols on Large) */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 pb-3 border-b border-slate-100 flex items-center justify-between">
                      <span>Purchased Items</span>
                      <span className="text-xs font-bold text-indigo-600">
                        {order.productid?.length || 0} product(s)
                      </span>
                    </h2>

                    <div className="space-y-3">
                      {order.productid?.map((prod, index) => {
                        const img = Array.isArray(prod?.productimage)
                          ? prod.productimage[0]
                          : prod?.productimage;

                        return (
                          <div
                            key={index}
                            className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex gap-4 items-center"
                          >
                            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg bg-white border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                              {img ? (
                                <img
                                  src={img}
                                  alt={prod?.title || "Product"}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                />
                              ) : (
                                <span className="text-xl">📦</span>
                              )}
                            </div>

                            <div className="flex-1 min-w-0 space-y-1">
                              <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                                {prod?.title || "Untitled Product"}
                              </h3>
                              <p className="text-xs text-slate-500 line-clamp-2">
                                {prod?.description || "No description provided."}
                              </p>
                              {prod?.category && (
                                <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                                  {prod.category}
                                </span>
                              )}
                            </div>

                            <div className="text-right shrink-0">
                              <p className="text-base sm:text-lg font-extrabold text-slate-900">
                                ₹{prod?.price || 0}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Right Column: Customer Info & Payment Breakdown */}
                <div className="space-y-6">
                  {/* Customer & Shipping Box */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 pb-3 border-b border-slate-100">
                      Customer & Shipping Details
                    </h2>

                    <div className="space-y-2.5 text-sm">
                      <div>
                        <span className="text-xs text-slate-400 block font-semibold">CUSTOMER NAME</span>
                        <p className="text-slate-800 font-bold">
                          {order.userid?.name || (typeof order.userid === "string" ? order.userid : "N/A")}
                        </p>
                      </div>

                      {order.userid?.email && (
                        <div>
                          <span className="text-xs text-slate-400 block font-semibold">EMAIL</span>
                          <p className="text-slate-800 font-medium">{order.userid.email}</p>
                        </div>
                      )}

                      <div>
                        <span className="text-xs text-slate-400 block font-semibold">PHONE</span>
                        <p className="text-slate-800 font-bold">{order.phonenumber || "N/A"}</p>
                      </div>

                      <div>
                        <span className="text-xs text-slate-400 block font-semibold">DELIVERY ADDRESS</span>
                        <p className="text-slate-700 font-medium leading-relaxed mt-0.5">
                          {order.houseNo && `${order.houseNo}, `}
                          {order.street && `${order.street}, `}
                          {order.city && `${order.city}, `}
                          {order.state && `${order.state} - `}
                          {order.pincode && `${order.pincode}`}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Payment Summary Box */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 pb-3 border-b border-slate-100">
                      Order Summary
                    </h2>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-slate-600">
                        <span>Items Subtotal</span>
                        <span className="font-semibold text-slate-800">₹{subtotal}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Shipping Fee</span>
                        <span className="font-semibold text-emerald-600">FREE</span>
                      </div>
                      <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-base font-extrabold text-slate-900">
                        <span>Total Paid / Due</span>
                        <span className="text-xl text-indigo-600">₹{grandTotal}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrderDetail;
