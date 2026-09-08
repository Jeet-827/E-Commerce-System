import { OrderCreate, showOrder, getOrderById, updateOrderStatus, getUserOrders } from "../controller/order.controller.js";
import express from "express";

const OrderRoute = express.Router();

OrderRoute.post("/ordercreate", OrderCreate);
OrderRoute.get("/showorder", showOrder);
OrderRoute.get("/ordersget", getUserOrders);
OrderRoute.get("/orderget/:id", getOrderById);
OrderRoute.put("/updatestatus/:id", updateOrderStatus);

export default OrderRoute;
