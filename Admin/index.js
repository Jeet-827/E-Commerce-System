import "dotenv/config";
import express from "express";
import DBConnect from "./config/db.config.js";
import cookieParser from "cookie-parser";
import compression from "compression";
import Showorder from './routes/order.routes.js'
import AdminRoutes from "./routes/admin.routes.js";
import Alluser from "./routes/alluserget.routes.js"
import EditRouter from "./routes/editproduct.routes.js";
import cors from "cors"

const app = express();
DBConnect();

app.use(
  compression({
    level: 6,
    threshold: 1024,
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
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use("/api/v1/admin", AdminRoutes);
app.use("/api/v1/order", Showorder);
app.use("/api/v1/user",Alluser)
app.use("/api/v1/edit",EditRouter)

app.get("/", (req, res) => {
  res.send("server running..");
});

if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  app.listen(process.env.AdminPORT || 8000, () => {
    console.log(`server is running ${process.env.AdminPORT || 8000}`);
  });
}

export default app;

