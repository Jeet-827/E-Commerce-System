import {
  OrderCreate,
  showOrder,
  getOrderById,
  updateOrderStatus,
  getUserOrders,
  getOrderAnalytics,
} from "../controller/order.controller.js";
import express from "express";

const OrderRoute = express.Router();

OrderRoute.post("/ordercreate", OrderCreate);
OrderRoute.get("/showorder", showOrder);
OrderRoute.get("/ordersget", getUserOrders);
OrderRoute.get("/analytics", getOrderAnalytics);
OrderRoute.get("/orderget/:id", getOrderById);
OrderRoute.put("/updatestatus/:id", updateOrderStatus);

export default OrderRoute;
