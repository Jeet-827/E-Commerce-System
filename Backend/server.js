import "./config/env.config.js";
import express from "express";
import cookieParser from "cookie-parser";
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

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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
app.use("/api/v1/make",RazorPay)

app.get("/", (req, res) => {
  res.send("server is running..");
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running ${process.env.Port}`);
});
