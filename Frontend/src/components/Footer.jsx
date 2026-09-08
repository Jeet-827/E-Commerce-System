import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  FaHeart, 
  FaGithub, 
  FaTwitter, 
  FaLinkedin, 
  FaInstagram, 
  FaPaperPlane, 
  FaPhoneAlt, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaTruck, 
  FaShieldAlt, 
  FaHeadset, 
  FaUndo, 
  FaCheckCircle
} from "react-icons/fa";

function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail("");
      }, 4000);
    }
  };

  return (
    <footer className="w-full bg-white text-slate-700 font-sans border-t border-slate-200 transition-colors">
      {/* 1. Value Proposition Perks Strip */}
      <div className="border-b border-slate-100 bg-slate-50/70 py-6 px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="flex items-center gap-3.5 p-3 rounded-xl bg-white border border-slate-200/80 shadow-sm hover:border-indigo-300 transition-all">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg shrink-0">
              <FaTruck />
            </div>
            <div>
              <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Fast Shipping</h5>
              <p className="text-[11px] text-slate-500">Dispatch in 24-48 Hours</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3 rounded-xl bg-white border border-slate-200/80 shadow-sm hover:border-emerald-300 transition-all">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg shrink-0">
              <FaShieldAlt />
            </div>
            <div>
              <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">100% Genuine</h5>
              <p className="text-[11px] text-slate-500">Authentic Brand Products</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3 rounded-xl bg-white border border-slate-200/80 shadow-sm hover:border-purple-300 transition-all">
            <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center text-lg shrink-0">
              <FaUndo />
            </div>
            <div>
              <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Easy Returns</h5>
              <p className="text-[11px] text-slate-500">7 Days Exchange Policy</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3 rounded-xl bg-white border border-slate-200/80 shadow-sm hover:border-amber-300 transition-all">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-lg shrink-0">
              <FaHeadset />
            </div>
            <div>
              <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">24/7 Support</h5>
              <p className="text-[11px] text-slate-500">Instant Customer Care</p>
            </div>
          </div>

        </div>
      </div>

      {/* 2. Newsletter Subscription Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 border-b border-slate-100">
        <div className="bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 rounded-2xl p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-md text-white">
          
          <div className="max-w-xl text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full mb-2">
              ⚡ Flash Sale Alerts
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Subscribe for Exclusive Discounts & Offers
            </h3>
            <p className="mt-1 text-xs text-indigo-100">
              Get notified first when new tech devices and deals arrive at E-System Store.
            </p>
          </div>

          <div className="w-full lg:w-auto min-w-[280px] sm:min-w-[360px]">
            {subscribed ? (
              <div className="flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-white text-indigo-700 text-xs font-bold shadow animate-fadeIn">
                <FaCheckCircle className="text-emerald-500 text-base" />
                Thank you for subscribing!
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  required
                  className="w-full px-4 py-2.5 bg-white text-slate-900 placeholder-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-white text-xs shadow-inner"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-1.5"
                >
                  <FaPaperPlane className="text-[10px]" />
                  <span>Subscribe</span>
                </button>
              </form>
            )}
          </div>

        </div>
      </div>

      {/* 3. Main Footer Links Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Info & Contact (Spans 2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2 text-2xl font-black text-slate-900 tracking-tight">
              <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white flex items-center justify-center text-base shadow-sm">
                ⚡
              </span>
              <span>E-System</span>
            </Link>

            <p className="text-xs text-slate-600 leading-relaxed max-w-sm">
              Your trusted online e-commerce destination for high-performance smartphones, gaming laptops, smart tablets, furniture, and lifestyle accessories.
            </p>

            {/* Real Store Contact */}
            <div className="space-y-2 pt-1 text-xs text-slate-600">
              <div className="flex items-center gap-2.5">
                <FaMapMarkerAlt className="text-indigo-600 text-xs shrink-0" />
                <span>Ahmedabad, Gujarat, India &bull; 380006</span>
              </div>
              <div className="flex items-center gap-2.5">
                <FaPhoneAlt className="text-indigo-600 text-xs shrink-0" />
                <span>+91 7990595959 &bull; Mon-Sat (9:00 AM - 8:00 PM)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <FaEnvelope className="text-indigo-600 text-xs shrink-0" />
                <span>support@esystem.com</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-2 pt-1">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-600 flex items-center justify-center transition-all border border-slate-200"
              >
                <FaGithub size={14} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-sky-500 hover:text-white text-slate-600 flex items-center justify-center transition-all border border-slate-200"
              >
                <FaTwitter size={14} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-600 flex items-center justify-center transition-all border border-slate-200"
              >
                <FaLinkedin size={14} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-pink-600 hover:text-white text-slate-600 flex items-center justify-center transition-all border border-slate-200"
              >
                <FaInstagram size={14} />
              </a>
            </div>
          </div>

          {/* Column 1: Shop Categories */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 border-l-2 border-indigo-600 pl-2">
              Categories
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/allproducts?category=Mobile" className="text-slate-600 hover:text-indigo-600 transition-colors">
                  📱 Mobile & Phones
                </Link>
              </li>
              <li>
                <Link to="/allproducts?category=Laptop" className="text-slate-600 hover:text-indigo-600 transition-colors">
                  💻 Laptops & Gaming
                </Link>
              </li>
              <li>
                <Link to="/allproducts?category=Tablet" className="text-slate-600 hover:text-indigo-600 transition-colors">
                  📲 Tablets & iPads
                </Link>
              </li>
              <li>
                <Link to="/allproducts?category=Furniture" className="text-slate-600 hover:text-indigo-600 transition-colors">
                  🪑 Home Furniture
                </Link>
              </li>
              <li>
                <Link to="/allproducts" className="text-slate-600 hover:text-indigo-600 transition-colors">
                  📦 All Products Catalog
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 border-l-2 border-indigo-600 pl-2">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="text-slate-600 hover:text-indigo-600 transition-colors">
                  Home Page
                </Link>
              </li>
              <li>
                <Link to="/allproducts" className="text-slate-600 hover:text-indigo-600 transition-colors">
                  Browse Catalog
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-slate-600 hover:text-indigo-600 transition-colors">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link to="/checkout" className="text-slate-600 hover:text-indigo-600 transition-colors">
                  Secure Checkout
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-slate-600 hover:text-indigo-600 transition-colors">
                  My Orders & Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Payment Modes */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 border-l-2 border-indigo-600 pl-2">
              Payment Modes
            </h4>
            <div className="space-y-2 text-xs text-slate-600">
              <p className="leading-relaxed">
                Accepted Payment Methods:
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="px-2 py-1 bg-slate-100 rounded border border-slate-200 text-[10px] font-bold text-indigo-700">
                  💳 Razorpay
                </span>
                <span className="px-2 py-1 bg-slate-100 rounded border border-slate-200 text-[10px] font-bold text-blue-700">
                  GPay
                </span>
                <span className="px-2 py-1 bg-slate-100 rounded border border-slate-200 text-[10px] font-bold text-purple-700">
                  PhonePe
                </span>
                <span className="px-2 py-1 bg-slate-100 rounded border border-slate-200 text-[10px] font-bold text-sky-700">
                  Paytm
                </span>
                <span className="px-2 py-1 bg-slate-100 rounded border border-slate-200 text-[10px] font-bold text-slate-800">
                  COD
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 4. Bottom Copyright & Credits Bar */}
      <div className="bg-slate-100 border-t border-slate-200 py-4 px-4 sm:px-6 lg:px-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          
          <div className="text-center md:text-left">
            <span>&copy; {new Date().getFullYear()} E-System Store. All rights reserved.</span>
          </div>

          {/* Author Tag */}
          <div className="flex items-center gap-1.5 text-slate-600">
            <span>Crafted with</span>
            <FaHeart className="text-rose-500 animate-pulse text-xs" />
            <span>by</span>
            <span className="text-slate-900 font-bold tracking-wide hover:text-indigo-600 transition-colors">
              kishor hadiya
            </span>
          </div>

        </div>
      </div>
    </footer>
  );
}

export default Footer;
