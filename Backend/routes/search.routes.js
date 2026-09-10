import express from "express";
import { Search, showorder } from "../controller/search.controller.js";
import { cacheMiddleware } from "../middleware/cache.middleware.js";

const SearchRoute = express.Router();

// Cache search queries for 60 seconds
SearchRoute.get("/search", cacheMiddleware(60), Search);
SearchRoute.post("/showorder", showorder);

export default SearchRoute;
