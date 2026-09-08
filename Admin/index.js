import "dotenv/config";
import express from "express";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import DBConnect from "./config/db.config.js";
import Showorder from "./routes/order.routes.js";
import AdminRoutes from "./routes/admin.routes.js";
import Alluser from "./routes/alluserget.routes.js";
import EditRouter from "./routes/editproduct.routes.js";

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

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

DBConnect();

app.use("/api/v1/admin", AdminRoutes);
app.use("/api/v1/order", Showorder);
app.use("/api/v1/user", Alluser);
app.use("/api/v1/edit", EditRouter);

app.get("/", (req, res) => {
  res.send("server running");
});

if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  const PORT = process.env.AdminPORT || 8000;
  app.listen(PORT, () => {
    if (process.env.NODE_ENV !== "production") {
      console.log(`Admin server running on port ${PORT}`);
    }
  });
}

export default app;
