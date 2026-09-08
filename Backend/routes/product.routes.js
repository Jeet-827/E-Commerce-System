import {
  GetAllProduct,
  CreateProduct,
  GetProductById,
  GetCategories,
  DeleteProduct,
} from "../controller/product.controller.js";
import express from "express";
import { AuthMiddleware } from "../middleware/auth.middleware.js";
import { cacheMiddleware } from "../middleware/cache.middleware.js";

const ProductRoute = express.Router();

// Cached GET routes for ultra-fast response times
ProductRoute.get("/productget", cacheMiddleware(120), GetAllProduct);
ProductRoute.get("/productget/:id", cacheMiddleware(300), GetProductById);
ProductRoute.get("/categories", cacheMiddleware(600), GetCategories);
ProductRoute.delete("/deleteproduct/:id", DeleteProduct);

export default ProductRoute;
