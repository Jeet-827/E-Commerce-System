import {
  GetAllProduct,
  CreateProduct,
  GetProductById,
  GetCategories,
  DeleteProduct,
} from "../controller/product.controller.js";
import express from "express";

import {AuthMiddleware} from '../middleware/auth.middleware.js'
const ProductRoute = express.Router();

ProductRoute.get("/productget", GetAllProduct);
ProductRoute.get("/productget/:id", GetProductById);
ProductRoute.get("/categories", GetCategories);
ProductRoute.delete("/deleteproduct/:id", DeleteProduct);

export default ProductRoute;
