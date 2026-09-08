import "dotenv/config";
import express, { json } from "express";
import DBConnect from "./config/db.config.js";
import cookieParser from "cookie-parser";
import Showorder from './routes/order.routes.js'
import AdminRoutes from "./routes/admin.routes.js";
import Alluser from "./routes/alluserget.routes.js"
import EditRouter from "./routes/editproduct.routes.js";
import cors from "cors"
const app = express();
DBConnect();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1/admin", AdminRoutes);
app.use("/api/v1/order", Showorder);
app.use("/api/v1/user",Alluser)
app.use("/api/v1/edit",EditRouter)

app.get("/", (req, res) => {
  res.send("server running..");
});

app.listen(process.env.AdminPORT, () => {
  console.log(`server is running ${process.env.AdminPORT}`);
});
