import "./config/env.config.js";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";
import DBConnect from "./config/db.config.js";
import router from "./routes/user.routes.js";
import ProductRoute from "./routes/product.routes.js";
import productcreate from "./routes/productcreate.routes.js";
import CartRoute from "./routes/cart.routes.js";
import TokenModel from "./routes/token.routes.js";
import OrderRoute from "./routes/order.routes.js";
import SearchRoute from "./routes/search.routes.js";
import RazorPay from "./routes/razor.routes.js";

const app = express();

// Security & performance
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(compression());

// CORS
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Cache-Control for product GET APIs
app.use((req, res, next) => {
  if (req.method === "GET" && req.path.startsWith("/api/v1/product")) {
    res.setHeader("Cache-Control", "public, max-age=60, s-maxage=300, stale-while-revalidate=600");
  }
  next();
});

DBConnect();

app.use("/api/v1", router);
app.use("/api/v1/product", ProductRoute);
app.use("/api/v1/productgenereted", productcreate);
app.use("/api/v1/cartdata", CartRoute);
app.use("/api/v1/tokenData", TokenModel);
app.use("/api/v1/order", OrderRoute);
app.use("/api/v1/search", SearchRoute);
app.use("/api/v1/make", RazorPay);

app.get("/", (req, res) => {
  res.send("server is running");
});

if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    if (process.env.NODE_ENV !== "production") {
      console.log(`Server running on port ${PORT}`);
    }
  });
}

export default app;
