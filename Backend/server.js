import "./config/env.config.js";
import express from "express";
import cookieParser from "cookie-parser";
import compression from "compression";
import DBConnect from "./config/db.config.js";
import router from "./routes/user.routes.js";
import ProductRoute from "./routes/product.routes.js";
import productcreate from "./routes/productcreate.routes.js";
import CartRoute from "./routes/cart.routes.js";
import TokenModel from "./routes/token.routes.js";
import OrderRoute from "./routes/order.routes.js";
import SearchRoute from "./routes/search.routes.js";
import RazorPay from "./routes/razor.routes.js";
import cors from "cors";
import { getCacheStats, flushAllCache } from "./utils/cache.js";

const app = express();

// High Performance HTTP Compression (gzip / deflate)
app.use(
  compression({
    level: 6,
    threshold: 1024, // only compress responses larger than 1KB
    filter: (req, res) => {
      if (req.headers["x-no-compression"]) return false;
      return compression.filter(req, res);
    },
  })
);

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
        callback(null, true);
      }
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// Cache-Control for product GET APIs (Instant load & background revalidation)
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
app.use("/api/v1/ordergenereted", OrderRoute);
app.use("/api/v1/orderdata", OrderRoute);
app.use("/api/v1/search", SearchRoute);
app.use("/api/v1/make",RazorPay);

// Cache Monitoring & Control Routes
app.get("/api/v1/cache/stats", (req, res) => {
  res.json({
    message: "Cache statistics",
    stats: getCacheStats(),
  });
});

app.post("/api/v1/cache/flush", (req, res) => {
  flushAllCache();
  res.json({ message: "Cache flushed successfully" });
});

app.get("/", (req, res) => {
  res.send("server is running..");
});

if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running ${process.env.PORT || 5000}`);
  });
}

export default app;

