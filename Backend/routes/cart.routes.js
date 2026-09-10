import { CartAdd, CartData, CartRemove } from "../controller/cart.controller.js";
import express from "express";
import { AuthMiddleware } from "../middleware/auth.middleware.js";

const CartRoute = express.Router();

CartRoute.post("/cartitem", AuthMiddleware, CartAdd);
CartRoute.get("/cartget", AuthMiddleware, CartData);
CartRoute.delete("/cartitem/:id", AuthMiddleware, CartRemove);

export default CartRoute;
